/**
 * lib/db.ts — Couchbase Capella via REST Data API
 *
 * Uses the Couchbase Capella Data API (HTTP) instead of the native SDK.
 * Zero native binary dependencies — works on any Node version / platform.
 *
 * Bucket : travel-sample
 * Scope  : vyro
 * Collection: leads
 *
 * Server-only module. Never import this in Client Components.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LeadType = "waitlist" | "preorder" | "partner";

export interface Lead {
  id: string;
  type: LeadType;
  createdAt: string;
  ip?: string;
  email?: string;
  name?: string;
  phone?: string;
  city?: string;
  flavor?: string;
  quantity?: string;
  company?: string;
  website?: string;
  partnerType?: string;
  message?: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt">;

// ─── Config helpers ────────────────────────────────────────────────────────────

function cfg() {
  const connStr = process.env.COUCHBASE_CONNECTION_STRING ?? "";
  // connStr: couchbases://cb.<id>.cloud.couchbase.com
  // Data API base: https://cb.<id>.cloud.couchbase.com
  const host    = connStr.replace(/^couchbases?:\/\//, "");
  const bucket  = process.env.COUCHBASE_BUCKET   ?? "travel-sample";
  const scope   = process.env.COUCHBASE_SCOPE    ?? "vyro";
  const user    = process.env.COUCHBASE_USERNAME  ?? "";
  const pass    = process.env.COUCHBASE_PASSWORD  ?? "";
  const auth    = Buffer.from(`${user}:${pass}`).toString("base64");

  return { host, bucket, scope, auth };
}

// ─── REST helpers ──────────────────────────────────────────────────────────────

/** KV document endpoint */
function kvUrl(key: string) {
  const { host, bucket, scope } = cfg();
  return `https://${host}/v1/scopes/${scope}/collections/leads/documents/${encodeURIComponent(key)}`;
}

/** N1QL / SQL++ query endpoint */
function queryUrl() {
  const { host } = cfg();
  return `https://${host}/analytics/service`;
}

async function cbFetch(url: string, init: RequestInit) {
  const { auth } = cfg();
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

/** Run an Analytics (SQL++) query — returns rows array */
async function runQuery<T>(statement: string, args?: Record<string, unknown>): Promise<T[]> {
  const body: Record<string, unknown> = { statement };
  if (args) body.args = Object.values(args);

  const res = await cbFetch(queryUrl(), {
    method: "POST",
    body: JSON.stringify(body),
  });

  const json = await res.json() as {
    results?: T[];
    errors?: Array<{ msg: string }>;
    status?: string;
  };

  if (!res.ok || (json.errors && json.errors.length > 0)) {
    const msg = json.errors?.[0]?.msg ?? `HTTP ${res.status}`;
    throw new Error(`Couchbase query error: ${msg}`);
  }

  return json.results ?? [];
}

// ─── One-time collection bootstrap ────────────────────────────────────────────

let _bootstrapped = false;

async function ensureCollection() {
  if (_bootstrapped) return;
  const { host, bucket, scope, auth } = cfg();

  // Create scope
  await fetch(`https://${host}/v1/scopes`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: scope }),
  });

  // Create collection
  await fetch(`https://${host}/v1/scopes/${scope}/collections`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "leads" }),
  });

  // Create Analytics dataset so SQL++ queries work
  await runQuery(
    `CREATE DATASET IF NOT EXISTS \`${bucket}_vyro_leads\`
     ON \`${bucket}\`.\`${scope}\`.\`leads\``
  ).catch(() => {/* already exists */});

  await runQuery(`CONNECT LINK Local`).catch(() => {/* already connected */});

  _bootstrapped = true;
}

// ─── Insert ────────────────────────────────────────────────────────────────────

export async function insertLead(data: LeadInput): Promise<Lead> {
  await ensureCollection();
  const lead: Lead = {
    ...data,
    id: `${data.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const res = await cbFetch(kvUrl(lead.id), {
    method: "POST",
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Couchbase insert failed: ${res.status} ${text}`);
  }

  return lead;
}

// ─── Read all ──────────────────────────────────────────────────────────────────

export async function readLeads(): Promise<Lead[]> {
  await ensureCollection();
  const { bucket } = cfg();
  const rows = await runQuery<Lead>(
    `SELECT * FROM \`${bucket}_vyro_leads\` ORDER BY createdAt DESC`
  );
  return rows;
}

// ─── Read by type ──────────────────────────────────────────────────────────────

export async function getLeadsByType(type: LeadType): Promise<Lead[]> {
  await ensureCollection();
  const { bucket } = cfg();
  const rows = await runQuery<Lead>(
    `SELECT * FROM \`${bucket}_vyro_leads\` WHERE type = "${type}" ORDER BY createdAt DESC`
  );
  return rows;
}

// ─── Duplicate check ───────────────────────────────────────────────────────────

export async function findWaitlistByEmail(email: string): Promise<Lead | null> {
  await ensureCollection();
  const { bucket } = cfg();
  const rows = await runQuery<Lead>(
    `SELECT * FROM \`${bucket}_vyro_leads\`
     WHERE type = "waitlist" AND email = "${email.replace(/"/g, "")}" LIMIT 1`
  );
  return rows[0] ?? null;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export async function getStats(): Promise<{
  total: number; waitlist: number; preorder: number; partner: number;
}> {
  await ensureCollection();
  const { bucket } = cfg();

  const rows = await runQuery<{ type: string; cnt: number }>(
    `SELECT type, COUNT(*) AS cnt FROM \`${bucket}_vyro_leads\` GROUP BY type`
  );

  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.type] = row.cnt;

  return {
    total:    (counts.waitlist ?? 0) + (counts.preorder ?? 0) + (counts.partner ?? 0),
    waitlist: counts.waitlist ?? 0,
    preorder: counts.preorder ?? 0,
    partner:  counts.partner  ?? 0,
  };
}
