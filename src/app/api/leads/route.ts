import { type NextRequest } from "next/server";
import { readLeads, getLeadsByType, getStats, type LeadType } from "@/lib/db";

export async function GET(request: NextRequest) {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const secret   = process.env.ADMIN_SECRET;
  const provided =
    request.headers.get("x-admin-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (!secret || provided !== secret) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const sp    = request.nextUrl.searchParams;
  const type  = sp.get("type") as LeadType | null;
  const page  = Math.max(1, parseInt(sp.get("page")  ?? "1",  10));
  const limit = Math.min(200, Math.max(1, parseInt(sp.get("limit") ?? "50", 10)));

  const [leads, stats] = await Promise.all([
    type && ["waitlist","preorder","partner"].includes(type)
      ? getLeadsByType(type)
      : readLeads(),
    getStats(),
  ]);

  const total = leads.length;
  const start = (page - 1) * limit;
  const items = leads.slice(start, start + limit);

  return Response.json({
    success: true,
    stats,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    leads: items,
  });
}
