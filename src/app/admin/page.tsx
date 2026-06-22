"use client";

import { useState, Suspense, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useVyroStore } from "@/lib/store";
import type { Flavour } from "@/lib/store";

const VyroCan = dynamic(() => import("@/components/3d/VyroCan"), { ssr: false });

// ─── Design tokens ────────────────────────────────────────────────────────────
const A = {
  bg:      "#09090f",
  surface: "#111118",
  card:    "#16161f",
  border:  "rgba(212,175,55,0.14)",
  gold:    "#D4AF37",
  goldB:   "#FFD700",
  text:    "#e8e8e8",
  muted:   "rgba(192,192,192,0.45)",
  danger:  "#FF2D55",
};

// ─── Shared input ─────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: 2,
        textTransform: "uppercase", color: A.muted, marginBottom: 6,
        fontFamily: "var(--font-orbitron, sans-serif)" }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${A.border}`, borderRadius: 8,
          color: A.text, fontSize: 13, outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: "inherit" }}
        onFocus={e => { e.currentTarget.style.borderColor = A.gold; e.currentTarget.style.boxShadow = `0 0 0 2px ${A.gold}20`; }}
        onBlur={e  => { e.currentTarget.style.borderColor = A.border; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: 2,
        textTransform: "uppercase", color: A.muted, marginBottom: 6,
        fontFamily: "var(--font-orbitron, sans-serif)" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 44, height: 36, padding: 2, borderRadius: 6,
            border: `1px solid ${A.border}`, background: "transparent", cursor: "pointer" }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.04)",
            border: `1px solid ${A.border}`, borderRadius: 6,
            color: A.text, fontSize: 12, outline: "none", fontFamily: "monospace" }}
          onFocus={e => { e.currentTarget.style.borderColor = A.gold; }}
          onBlur={e  => { e.currentTarget.style.borderColor = A.border; }} />
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: value,
          border: `2px solid ${A.border}`, boxShadow: `0 0 10px ${value}60`, flexShrink: 0 }} />
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: `1px solid ${A.border}` }}>
      <span style={{ fontSize: 13, color: A.text }}>{label}</span>
      <motion.button onClick={() => onChange(!value)} whileTap={{ scale: 0.95 }}
        style={{ width: 48, height: 26, borderRadius: 999, border: "none", cursor: "pointer",
          background: value ? A.gold : "rgba(255,255,255,0.1)",
          position: "relative", transition: "background 0.3s", padding: 0 }}>
        <motion.div animate={{ x: value ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ position: "absolute", top: 3, width: 20, height: 20,
            borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
      </motion.button>
    </div>
  );
}

function Slider({ label, value, min, max, step = 0.05, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color: A.muted, fontFamily: "var(--font-orbitron, sans-serif)" }}>{label}</label>
        <span style={{ fontSize: 12, color: A.gold, fontFamily: "var(--font-orbitron, sans-serif)" }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: A.gold, cursor: "pointer" }} />
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: A.card, border: `1px solid ${A.border}`,
      borderRadius: 16, padding: "28px 28px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24,
        paddingBottom: 14, borderBottom: `1px solid ${A.border}` }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-orbitron, sans-serif)",
          fontWeight: 700, fontSize: 13, color: A.gold, letterSpacing: 2 }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Flavour editor form ──────────────────────────────────────────────────────
function FlavorEditor({ flavour, onSave, onCancel }: {
  flavour: Flavour;
  onSave: (f: Flavour) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Flavour>({ ...flavour });
  const up = (key: keyof Flavour) => (val: string | number | boolean) =>
    setF(prev => ({ ...prev, [key]: val }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: A.surface, border: `1px solid ${A.gold}40`,
        borderRadius: 16, padding: 28, marginBottom: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Flavour ID"   value={f.id}      onChange={up("id")}      placeholder="e.g. mango-surge" />
        <Field label="Name"         value={f.name}    onChange={up("name")}    placeholder="Mango Surge" />
        <Field label="Tagline"      value={f.tagline} onChange={up("tagline")} placeholder="Tropical energy..." />
        <Field label="Badge"        value={f.badge ?? ""} onChange={up("badge")} placeholder="NEW / LIMITED / COMING SOON" />
        <Field label="Caffeine (mg)" value={f.caffeine} onChange={v => setF(p => ({ ...p, caffeine: +v }))} type="number" />
        <Field label="Calories"     value={f.calories} onChange={v => setF(p => ({ ...p, calories: +v }))} type="number" />
        <Field label="Volume (ml)"  value={f.volume}  onChange={v => setF(p => ({ ...p, volume: +v }))} type="number" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 4 }}>
        <ColorField label="Body Color"    value={f.bodyColor}    onChange={up("bodyColor")} />
        <ColorField label="Accent Color"  value={f.accentColor}  onChange={up("accentColor")} />
        <ColorField label="Label Color"   value={f.labelColor}   onChange={up("labelColor")} />
        <ColorField label="Glow Color"    value={f.glowColor}    onChange={up("glowColor")} />
        <ColorField label="Particle Color"value={f.particleColor}onChange={up("particleColor")} />
      </div>

      <Field label="Background Gradient (CSS)" value={f.bgGradient} onChange={up("bgGradient")}
        placeholder="radial-gradient(ellipse 80% 60% at 50% 40%, #... 0%, #000 70%)" />

      <Toggle label="Available Now" value={f.available} onChange={v => setF(p => ({ ...p, available: v }))} />

      {/* Live preview */}
      <div style={{ height: 260, margin: "20px 0", borderRadius: 12, overflow: "hidden",
        background: f.bgGradient, border: `1px solid ${f.accentColor}30` }}>
        <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}
          gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <VyroCan flavour={f} rotationSpeed={0.5} showParticles={false} scale={0.85} allowDrag={false} />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
        <motion.button onClick={onCancel} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="btn-ghost" style={{ fontSize: 11, padding: "10px 24px" }}>
          Cancel
        </motion.button>
        <motion.button onClick={() => onSave(f)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="btn-vyro" style={{ fontSize: 11, padding: "10px 24px" }}>
          Save Flavour
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Flavours tab ─────────────────────────────────────────────────────────────
function FlavoursTab() {
  const { flavours, addFlavour, updateFlavour, deleteFlavour, setActiveFlavour, activeFlavourId } =
    useVyroStore();
  const [editing, setEditing]   = useState<string | null>(null);
  const [adding,  setAdding]    = useState(false);

  const blank: Flavour = {
    id: `flavour-${Date.now()}`, name: "New Flavour", tagline: "Your tagline here",
    bodyColor: "#111111", accentColor: "#D4AF37", labelColor: "#FFD700",
    glowColor: "#FFD700", particleColor: "#D4AF37",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #0d0620 0%, #000000 70%)",
    available: true, caffeine: 150, calories: 10, volume: 330,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ color: A.muted, fontSize: 12 }}>{flavours.length} flavour{flavours.length !== 1 ? "s" : ""} configured</span>
        <motion.button className="btn-vyro" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setAdding(true); setEditing(null); }}
          style={{ fontSize: 11, padding: "9px 22px" }}>
          + Add Flavour
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <FlavorEditor
            flavour={blank}
            onSave={f => { addFlavour(f); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        )}
      </AnimatePresence>

      {/* Flavour rows */}
      {flavours.map(f => (
        <div key={f.id}>
          <AnimatePresence>
            {editing === f.id && (
              <FlavorEditor
                flavour={f}
                onSave={updated => { updateFlavour(f.id, updated); setEditing(null); }}
                onCancel={() => setEditing(null)}
              />
            )}
          </AnimatePresence>

          {editing !== f.id && (
            <motion.div layout
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                background: activeFlavourId === f.id ? `${f.accentColor}12` : A.card,
                border: `1px solid ${activeFlavourId === f.id ? f.accentColor + "40" : A.border}`,
                borderRadius: 12, marginBottom: 10, cursor: "pointer" }}
              whileHover={{ y: -1 }}
            >
              {/* Color swatch */}
              <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${f.bodyColor}, ${f.accentColor})`,
                border: `2px solid ${f.accentColor}50`,
                boxShadow: `0 0 12px ${f.accentColor}40` }} />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: 12,
                  fontWeight: 700, color: f.accentColor, letterSpacing: 1 }}>{f.name}</div>
                <div style={{ fontSize: 10, color: A.muted, marginTop: 2 }}>
                  {f.caffeine}mg · {f.calories} kcal · {f.volume}ml
                  {f.badge && <span style={{ marginLeft: 8, color: f.accentColor }}>[{f.badge}]</span>}
                </div>
              </div>

              {/* Available indicator */}
              <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
                color: f.available ? "#00FF88" : A.muted, flexShrink: 0 }}>
                {f.available ? "● Live" : "○ Hidden"}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => setActiveFlavour(f.id)}
                  title="Set as active"
                  style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${A.border}`,
                    background: "transparent", color: A.gold, fontSize: 11, cursor: "pointer" }}>
                  ★
                </button>
                <button onClick={() => { setEditing(f.id); setAdding(false); }}
                  style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${A.border}`,
                    background: "transparent", color: A.text, fontSize: 11, cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => { if (confirm(`Delete "${f.name}"?`)) deleteFlavour(f.id); }}
                  style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${A.danger}40`,
                    background: "transparent", color: A.danger, fontSize: 11, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Content tab ──────────────────────────────────────────────────────────────
function ContentTab() {
  const { content, updateContent } = useVyroStore();
  const up = (key: keyof typeof content) => (v: string) => updateContent({ [key]: v });

  return (
    <div>
      <Card title="Hero Section" icon="🚀">
        <Field label="Brand Tagline (pre-headline)" value={content.brandTagline}  onChange={up("brandTagline")} />
        <Field label="Hero Headline"                value={content.heroHeadline}  onChange={up("heroHeadline")} />
        <Field label="Hero Sub-line"                value={content.heroSubline}   onChange={up("heroSubline")} />
        <Field label="Hero Description"             value={content.heroDescription} onChange={up("heroDescription")} />
      </Card>
      <Card title="Call to Action Buttons" icon="🎯">
        <Field label="Primary CTA Text"  value={content.ctaPrimary}  onChange={up("ctaPrimary")} />
        <Field label="Secondary CTA Text" value={content.ctaSecondary} onChange={up("ctaSecondary")} />
      </Card>
      <Card title="Launch Section" icon="⚡">
        <Field label="Launch Headline" value={content.launchHeadline} onChange={up("launchHeadline")} />
      </Card>
      <div style={{ padding: "14px 18px", borderRadius: 10,
        background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
        fontSize: 12, color: "#00FF88", letterSpacing: 1 }}>
        ✓ Changes are saved automatically to localStorage and reflected live on the site.
      </div>
    </div>
  );
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { showParticles, canRotationSpeed, setShowParticles, setCanRotationSpeed } = useVyroStore();

  return (
    <div>
      <Card title="3D Can Settings" icon="🎮">
        <Slider label="Auto-Rotation Speed" value={canRotationSpeed}
          min={0} max={2} step={0.05} onChange={setCanRotationSpeed} />
        <Toggle label="Show Energy Particles" value={showParticles} onChange={setShowParticles} />
      </Card>

      <Card title="Live Preview" icon="👁️">
        <div style={{ height: 320, borderRadius: 12, overflow: "hidden",
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #0d0620, #000)" }}>
          <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}
            gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <VyroCan
                flavour={{
                  id: "preview", name: "Original Gold", tagline: "Live admin preview",
                  bodyColor: "#111111", accentColor: "#D4AF37", labelColor: "#FFD700",
                  glowColor: "#FFD700", particleColor: "#D4AF37",
                  bgGradient: "", available: true, caffeine: 150, calories: 10, volume: 330,
                }}
                rotationSpeed={canRotationSpeed}
                showParticles={showParticles}
                scale={0.9}
                allowDrag={true}
              />
            </Suspense>
          </Canvas>
        </div>
        <p style={{ fontSize: 11, color: A.muted, textAlign: "center", marginTop: 10 }}>
          Drag to rotate · Settings apply to all cans on the site
        </p>
      </Card>

      <Card title="Data Management" icon="💾">
        <p style={{ fontSize: 12, color: A.muted, marginBottom: 16, lineHeight: 1.6 }}>
          All settings are persisted in <code style={{ color: A.gold }}>localStorage</code> under the key{" "}
          <code style={{ color: A.gold }}>vyro-admin-store</code>.
        </p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { localStorage.removeItem("vyro-admin-store"); window.location.reload(); }}
          style={{ padding: "10px 22px", borderRadius: 8, border: `1px solid ${A.danger}50`,
            background: `${A.danger}10`, color: A.danger, fontSize: 12,
            cursor: "pointer", letterSpacing: 1 }}>
          Reset All to Defaults
        </motion.button>
      </Card>
    </div>
  );
}

// ─── Leads tab ────────────────────────────────────────────────────────────────

type LeadType = "all" | "waitlist" | "preorder" | "partner";

interface Lead {
  id: string;
  type: "waitlist" | "preorder" | "partner";
  createdAt: string;
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
  ip?: string;
}

interface LeadsResponse {
  success: boolean;
  stats: { total: number; waitlist: number; preorder: number; partner: number };
  pagination: { page: number; limit: number; total: number; pages: number };
  leads: Lead[];
}

const TYPE_COLOR: Record<string, string> = {
  waitlist: "#00D4FF",
  preorder: "#D4AF37",
  partner:  "#8B00FF",
};

const TYPE_ICON: Record<string, string> = {
  waitlist: "📋",
  preorder: "⚡",
  partner:  "🤝",
};

function LeadRow({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const color = TYPE_COLOR[lead.type] ?? A.gold;

  const primary = lead.name ?? lead.email ?? lead.id;
  const secondary = lead.email ?? "";
  const date = new Date(lead.createdAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const extra: [string, string][] = [];
  if (lead.phone)       extra.push(["Phone", lead.phone]);
  if (lead.city)        extra.push(["City", lead.city]);
  if (lead.flavor)      extra.push(["Flavour", lead.flavor]);
  if (lead.quantity)    extra.push(["Qty (cases)", lead.quantity]);
  if (lead.company)     extra.push(["Company", lead.company]);
  if (lead.website)     extra.push(["Website", lead.website]);
  if (lead.partnerType) extra.push(["Partner Type", lead.partnerType]);
  if (lead.message)     extra.push(["Message", lead.message]);
  if (lead.ip)          extra.push(["IP", lead.ip]);

  return (
    <motion.div layout style={{ marginBottom: 8 }}>
      <div
        onClick={() => extra.length > 0 && setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "12px 16px", borderRadius: 10,
          background: open ? `${color}0a` : A.card,
          border: `1px solid ${open ? color + "40" : A.border}`,
          cursor: extra.length > 0 ? "pointer" : "default",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        {/* Type badge */}
        <div style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}18`, border: `1px solid ${color}40`,
          fontSize: 14,
        }}>
          {TYPE_ICON[lead.type]}
        </div>

        {/* Name / email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: A.text, fontWeight: 600,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {primary}
          </div>
          {secondary && secondary !== primary && (
            <div style={{ fontSize: 10, color: A.muted, marginTop: 1 }}>{secondary}</div>
          )}
        </div>

        {/* Type pill */}
        <div style={{
          flexShrink: 0, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
          color, padding: "3px 8px", borderRadius: 999,
          background: `${color}12`, border: `1px solid ${color}30`,
        }}>
          {lead.type}
        </div>

        {/* Date */}
        <div style={{ flexShrink: 0, fontSize: 10, color: A.muted, textAlign: "right" }}>
          {date}
        </div>

        {extra.length > 0 && (
          <div style={{ flexShrink: 0, fontSize: 11, color: A.muted, transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▾
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && extra.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              margin: "2px 0 0", padding: "16px 20px",
              background: `${color}06`, borderRadius: "0 0 10px 10px",
              border: `1px solid ${color}25`, borderTop: "none",
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px 24px",
            }}>
              {extra.map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                    color: A.muted, marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12, color: A.text, wordBreak: "break-word" }}>{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LeadsTab() {
  const [filter, setFilter]   = useState<LeadType>("all");
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [secret, setSecret]   = useState(
    typeof window !== "undefined" ? (localStorage.getItem("vyro-admin-secret") ?? "") : ""
  );
  const [secretInput, setSecretInput] = useState(secret);

  const fetchLeads = useCallback(async (s: string, f: LeadType, p: number) => {
    if (!s) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ secret: s, limit: "50", page: String(p) });
      if (f !== "all") params.set("type", f);
      const res  = await fetch(`/api/leads?${params}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Failed to load leads.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Network error. Could not reach /api/leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when secret / filter / page changes (if secret already set)
  useEffect(() => {
    if (secret) fetchLeads(secret, filter, page);
  }, [secret, filter, page, fetchLeads]);

  function applySecret() {
    const s = secretInput.trim();
    localStorage.setItem("vyro-admin-secret", s);
    setSecret(s);
    setPage(1);
  }

  const stats = data?.stats;

  return (
    <div>
      {/* Secret input */}
      {!secret ? (
        <Card title="Admin Secret Required" icon="🔐">
          <p style={{ fontSize: 12, color: A.muted, marginBottom: 16, lineHeight: 1.6 }}>
            Enter your <code style={{ color: A.gold }}>ADMIN_SECRET</code> to view leads.
            This is stored only in your browser&apos;s localStorage.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="password"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applySecret()}
              placeholder="Enter ADMIN_SECRET…"
              style={{
                flex: 1, padding: "10px 14px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${A.border}`, borderRadius: 8,
                color: A.text, fontSize: 13, outline: "none",
              }}
            />
            <motion.button className="btn-vyro" onClick={applySecret}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ fontSize: 11, padding: "10px 22px" }}>
              Unlock
            </motion.button>
          </div>
        </Card>
      ) : (
        <>
          {/* Stats row */}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total",     value: stats.total,    color: A.gold },
                { label: "Waitlist",  value: stats.waitlist, color: TYPE_COLOR.waitlist },
                { label: "Pre-Orders",value: stats.preorder, color: TYPE_COLOR.preorder },
                { label: "Partners",  value: stats.partner,  color: TYPE_COLOR.partner },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "18px 20px", borderRadius: 12,
                  background: `${s.color}0d`, border: `1px solid ${s.color}25`, textAlign: "center",
                }}>
                  <div style={{ fontFamily: "var(--font-orbitron,sans-serif)", fontWeight: 900,
                    fontSize: 28, color: s.color, textShadow: `0 0 16px ${s.color}40` }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: A.muted, marginTop: 4, textTransform: "uppercase" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter + refresh bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {(["all","waitlist","preorder","partner"] as LeadType[]).map(f => (
              <motion.button key={f} onClick={() => { setFilter(f); setPage(1); }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                  fontFamily: "var(--font-orbitron,sans-serif)", fontWeight: 700,
                  background: filter === f ? A.gold : "rgba(255,255,255,0.05)",
                  color: filter === f ? "#000" : A.muted,
                  transition: "all 0.2s",
                }}>
                {f === "all" ? "All" : f}
              </motion.button>
            ))}
            <div style={{ flex: 1 }} />
            <motion.button onClick={() => fetchLeads(secret, filter, page)}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              disabled={loading}
              style={{ padding: "7px 16px", borderRadius: 8,
                border: `1px solid ${A.border}`, background: "transparent",
                color: A.gold, fontSize: 11, cursor: "pointer", letterSpacing: 1 }}>
              {loading ? "Loading…" : "↻ Refresh"}
            </motion.button>
            <motion.button onClick={() => { setSecret(""); setSecretInput(""); localStorage.removeItem("vyro-admin-secret"); }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: "7px 14px", borderRadius: 8,
                border: `1px solid ${A.danger}40`, background: "transparent",
                color: A.danger, fontSize: 10, cursor: "pointer", letterSpacing: 1 }}>
              Lock
            </motion.button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8,
              background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.25)",
              fontSize: 12, color: "#FF2D55" }}>
              {error}
            </div>
          )}

          {/* Lead rows */}
          {loading && !data && (
            <div style={{ textAlign: "center", padding: 60, color: A.muted, fontSize: 12 }}>
              Loading leads…
            </div>
          )}

          {data && data.leads.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: A.muted, fontSize: 12 }}>
              No leads yet for this filter.
            </div>
          )}

          {data && data.leads.map(lead => <LeadRow key={lead.id} lead={lead} />)}

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
                <motion.button key={p} onClick={() => setPage(p)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: `1px solid ${p === page ? A.gold : A.border}`,
                    background: p === page ? `${A.gold}18` : "transparent",
                    color: p === page ? A.gold : A.muted,
                    fontSize: 12, cursor: "pointer",
                  }}>
                  {p}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "flavours", label: "Flavours",  icon: "🎨" },
  { id: "content",  label: "Content",   icon: "✏️" },
  { id: "settings", label: "Settings",  icon: "⚙️" },
  { id: "leads",    label: "Leads",     icon: "📊" },
] as const;

type TabId = typeof TABS[number]["id"];

function Sidebar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const { flavours } = useVyroStore();
  return (
    <aside style={{ width: 240, flexShrink: 0, background: A.surface,
      borderRight: `1px solid ${A.border}`, display: "flex", flexDirection: "column",
      minHeight: "100vh" }}>

      {/* Logo */}
      <div style={{ padding: "28px 24px", borderBottom: `1px solid ${A.border}` }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontWeight: 900,
            fontSize: 26, letterSpacing: 6, color: A.goldB,
            textShadow: `0 0 20px ${A.goldB}40` }}>
            VYRO
          </div>
        </a>
        <div style={{ fontSize: 9, letterSpacing: 3, color: A.muted, textTransform: "uppercase", marginTop: 3 }}>
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {TABS.map(tab => (
          <motion.button key={tab.id} onClick={() => onChange(tab.id)}
            whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              background: active === tab.id ? `${A.gold}18` : "transparent",
              borderLeft: active === tab.id ? `3px solid ${A.gold}` : "3px solid transparent",
              marginBottom: 4, textAlign: "left", transition: "background 0.2s" }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: 11,
              fontWeight: 700, letterSpacing: 1.5,
              color: active === tab.id ? A.gold : A.muted,
              transition: "color 0.2s" }}>
              {tab.label}
            </span>
            {tab.id === "flavours" && (
              <span style={{ marginLeft: "auto", fontSize: 10, color: A.muted,
                background: "rgba(255,255,255,0.07)", padding: "2px 7px",
                borderRadius: 999 }}>
                {flavours.length}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Back to site */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${A.border}` }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          borderRadius: 8, background: "rgba(255,255,255,0.03)",
          border: `1px solid ${A.border}`, textDecoration: "none",
          color: A.muted, fontSize: 11, letterSpacing: 1,
          transition: "background 0.2s, color 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${A.gold}10`; (e.currentTarget as HTMLElement).style.color = A.gold; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.color = A.muted; }}>
          ← View Site
        </a>
      </div>
    </aside>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<TabId>("flavours");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: A.bg, color: A.text,
      fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
      <Sidebar active={tab} onChange={setTab} />

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {/* Top bar */}
        <div style={{ padding: "20px 36px", borderBottom: `1px solid ${A.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: A.surface, position: "sticky", top: 0, zIndex: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontWeight: 700,
              fontSize: 16, color: A.text, letterSpacing: 1 }}>
              {TABS.find(t => t.id === tab)?.icon}{" "}
              {TABS.find(t => t.id === tab)?.label}
            </div>
            <div style={{ fontSize: 10, color: A.muted, marginTop: 2, letterSpacing: 1 }}>
              VYRO Website Management
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 999,
            background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00FF88",
              boxShadow: "0 0 6px #00FF88", animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: 10, color: "#00FF88", letterSpacing: 1.5 }}>LIVE</span>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding: "32px 36px", maxWidth: 900 }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}>
              {tab === "flavours" && <FlavoursTab />}
              {tab === "content"  && <ContentTab />}
              {tab === "settings" && <SettingsTab />}
              {tab === "leads"    && <LeadsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
