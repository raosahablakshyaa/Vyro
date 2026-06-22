"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const INGREDIENTS = [
  {
    icon: "⚡", name: "Natural Caffeine",      dose: "150mg",
    color: "#FFD700", benefit: "Clean, sustained energy — derived from green tea extract. Zero harsh comedown.",
    detail: "Green Tea Extract",
  },
  {
    icon: "🧠", name: "L-Theanine",            dose: "100mg",
    color: "#00D4FF", benefit: "Laser-sharp focus without crashes. Works synergistically with caffeine for calm alertness.",
    detail: "Pharmaceutical Grade",
  },
  {
    icon: "💧", name: "Electrolytes",          dose: "Na·K·Mg·Ca",
    color: "#00FF88", benefit: "Hydration that keeps you moving. Full 4-salt matrix replenishes what peak performance demands.",
    detail: "Complete Hydration Blend",
  },
  {
    icon: "🔋", name: "B-Vitamins",            dose: "B3·B6·B12·B5",
    color: "#8B00FF", benefit: "Convert food into usable energy at the cellular level. Fight fatigue, support neural function.",
    detail: "Methylated Complex",
  },
  {
    icon: "💪", name: "Magnesium + Zinc",       dose: "200mg · 10mg",
    color: "#FF6B00", benefit: "Recovery and performance support. Reduces muscle fatigue, boosts testosterone naturally.",
    detail: "Chelated Form",
  },
  {
    icon: "☀️", name: "Vitamin D3",             dose: "1000 IU",
    color: "#FFD700", benefit: "Daily wellness support. Immunity, bone health, and mood — the sunshine vitamin.",
    detail: "Cholecalciferol",
  },
  {
    icon: "🌿", name: "Ashwagandha",            dose: "250mg KSM-66",
    color: "#00FF88", benefit: "Helps manage stress and maintain balance. Adaptogen that lowers cortisol and boosts resilience.",
    detail: "KSM-66 Full-Spectrum Root",
  },
];

function IngCard({ ing, i }: { ing: typeof INGREDIENTS[0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      whileHover={{ y: -6 }}
      onClick={() => setOpen(o => !o)}
      style={{
        cursor: "pointer",
        borderRadius: 16,
        border: `1px solid ${open ? ing.color + "60" : "rgba(212,175,55,0.12)"}`,
        background: open ? `${ing.color}0d` : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(18px)",
        padding: "32px 24px",
        textAlign: "center",
        transition: "border-color 0.3s, background 0.3s",
        boxShadow: open ? `0 0 40px ${ing.color}20` : "none",
      }}
    >
      <motion.div animate={{ rotate: open ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 36, marginBottom: 14, display: "block" }}>
        {ing.icon}
      </motion.div>

      <div style={{ fontFamily: "var(--font-orbitron,sans-serif)", fontWeight: 700,
        fontSize: 12, color: ing.color, marginBottom: 6, letterSpacing: 1 }}>
        {ing.name}
      </div>

      <div style={{ fontSize: 10, color: "rgba(192,192,192,0.45)",
        letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
        {ing.dose}
      </div>

      {/* Glow bar */}
      <motion.div animate={{ scaleX: open ? 1 : 0 }} transition={{ duration: 0.3 }}
        style={{ height: 1, background: `linear-gradient(90deg,transparent,${ing.color},transparent)`,
          transformOrigin: "center", marginBottom: 12 }} />

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <p style={{ fontSize: 12, color: "rgba(192,192,192,0.7)", lineHeight: 1.65,
              marginBottom: 8 }}>
              {ing.benefit}
            </p>
            <div style={{ fontSize: 9, letterSpacing: 2, color: ing.color,
              textTransform: "uppercase", opacity: 0.7 }}>
              {ing.detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ fontSize: 9, color: "rgba(192,192,192,0.3)", marginTop: 8,
        letterSpacing: 1 }}>
        {open ? "tap to close" : "tap to learn more"}
      </div>
    </motion.div>
  );
}

export function IngredientsSection() {
  return (
    <section id="ingredients" style={{ padding: "120px 24px", background: "linear-gradient(180deg,#000,#03020a,#000)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div className="label-sm" style={{ color: "#D4AF37", marginBottom: 20 }}>What&apos;s Inside</div>
        <h2 className="display-lg gradient-gold">THE FORMULA</h2>
        <p style={{ color: "rgba(192,192,192,0.55)", maxWidth: 520, margin: "16px auto 12px", lineHeight: 1.7 }}>
          7 precision-dosed, science-backed ingredients — each chosen for one purpose: to make you unstoppable.
          Tap any card to explore.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20, marginTop: 56 }}>
          {INGREDIENTS.map((ing, i) => <IngCard key={ing.name} ing={ing} i={i} />)}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 48, padding: "16px 24px", borderRadius: 12,
            border: "1px solid rgba(212,175,55,0.1)", background: "rgba(255,255,255,0.02)",
            fontSize: 11, color: "rgba(192,192,192,0.35)", letterSpacing: 1, maxWidth: 700, margin: "48px auto 0" }}>
          ✦ All ingredients FSSAI compliant · Zero artificial preservatives · No banned substances · Natural flavours ✦
        </motion.div>
      </div>
    </section>
  );
}

export function SocialProof() {
  return (
    <section id="social" style={{ padding:"120px 24px", background:"linear-gradient(180deg,#000,#050305,#000)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
        <div className="label-sm" style={{ color:"#D4AF37", marginBottom:20 }}>The Numbers Don't Lie</div>
        <h2 className="display-lg gradient-gold">SOCIAL PROOF</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:24, marginTop:60 }}>
          {[
            {value:"10,000+",label:"Interested Users",icon:"👥",color:"#FFD700"},
            {value:"500+",label:"Beta Testers",icon:"🧪",color:"#00D4FF"},
            {value:"50+",label:"Campus Ambassadors",icon:"🏛️",color:"#00FF88"},
            {value:"95%",label:"Positive Reviews",icon:"⭐",color:"#FF6B00"},
          ].map(stat => (
            <motion.div key={stat.label} whileHover={{ y:-8 }}
              className="glass" style={{ padding:"40px 32px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:16 }}>{stat.icon}</div>
              <div style={{ fontFamily:"var(--font-orbitron,sans-serif)", fontWeight:900,
                fontSize:"clamp(2.2rem,4vw,3.5rem)", color:stat.color,
                textShadow:`0 0 20px ${stat.color}40`, lineHeight:1, marginBottom:8 }}>{stat.value}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchForm() {
  return (
    <section id="join" style={{ padding:"120px 24px", background:"linear-gradient(180deg,#000,#060410,#000)" }}>
      <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
        <div className="label-sm" style={{ color:"#D4AF37", marginBottom:20 }}>Shape The Product</div>
        <h2 className="display-lg gradient-gold">MARKET RESEARCH</h2>
        <p style={{ color:"rgba(192,192,192,0.55)", marginBottom:48 }}>
          Your voice builds VYRO. Complete this 2-minute survey and get early access, launch discounts, and a chance to become a Beta Tester.
        </p>
        <div className="glass-strong" style={{ padding:"48px 40px", textAlign:"left" }}>
          <input className="vyro-input" placeholder="Email address" type="email" style={{ marginBottom:16 }} />
          <button className="btn-vyro" style={{ width:"100%" }}>Join The Launch</button>
        </div>
      </div>
    </section>
  );
}

// ─── Pre-order + Be a Partner ─────────────────────────────────────────────────
type FormMode = "preorder" | "partner";

export function PreOrderSection() {
  const [mode, setMode] = useState<FormMode>("preorder");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    quantity: "1", flavor: "Original Gold",
    company: "", website: "", type: "Distributor", message: "",
  });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10,
    color: "#e8e8e8", fontSize: 13, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s", marginBottom: 16,
    fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
    color: "rgba(192,192,192,0.5)", marginBottom: 6,
    fontFamily: "var(--font-orbitron,sans-serif)",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#D4AF37";
    e.currentTarget.style.boxShadow   = "0 0 0 2px rgba(212,175,55,0.15)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
    e.currentTarget.style.boxShadow   = "none";
  };

  return (
    <section id="preorder" style={{
      padding: "120px 24px",
      background: "linear-gradient(180deg,#000,#07050f,#000)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 400, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(ellipse,${mode === "preorder" ? "rgba(212,175,55,0.06)" : "rgba(0,212,255,0.06)"} 0%,transparent 70%)`,
        transition: "background 0.6s" }} />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="label-sm" style={{ color: "#D4AF37", marginBottom: 16 }}>
            {mode === "preorder" ? "Be First In Line" : "Grow With VYRO"}
          </div>
          <h2 className="display-lg gradient-gold">
            {mode === "preorder" ? "PRE-ORDER" : "BE A PARTNER"}
          </h2>
          <p style={{ color: "rgba(192,192,192,0.5)", marginTop: 12, lineHeight: 1.7, fontSize: 14 }}>
            {mode === "preorder"
              ? "Lock in your first case of VYRO before we hit shelves. Early birds get exclusive pricing and first access."
              : "Distributor, retailer, or campus rep — join the VYRO network and grow together."}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 40,
          background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4,
          border: "1px solid rgba(212,175,55,0.12)", maxWidth: 340, margin: "0 auto 40px" }}>
          {(["preorder","partner"] as FormMode[]).map(m => (
            <motion.button key={m} onClick={() => { setMode(m); setSubmitted(false); }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                cursor: "pointer", fontSize: 11, letterSpacing: 2,
                fontFamily: "var(--font-orbitron,sans-serif)", fontWeight: 700,
                textTransform: "uppercase",
                background: mode === m ? "linear-gradient(135deg,#8B6914,#FFD700)" : "transparent",
                color: mode === m ? "#000" : "rgba(192,192,192,0.5)",
                transition: "all 0.3s",
                boxShadow: mode === m ? "0 0 20px rgba(212,175,55,0.3)" : "none",
              }}>
              {m === "preorder" ? "Pre-Order" : "Be a Partner"}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 40px",
                background: "rgba(255,255,255,0.04)", borderRadius: 20,
                border: "1px solid rgba(212,175,55,0.2)" }}>
              {[0,1,2].map(i => (
                <motion.div key={i}
                  initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity, ease: "easeOut" }}
                  style={{ position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)", width: 60, height: 60,
                    borderRadius: "50%", border: "2px solid #FFD700", pointerEvents: "none" }} />
              ))}
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {mode === "preorder" ? "⚡" : "🤝"}
              </div>
              <h3 style={{ fontFamily: "var(--font-orbitron,sans-serif)", fontWeight: 900,
                fontSize: "clamp(1.3rem,3vw,1.8rem)", color: "#FFD700",
                textShadow: "0 0 24px rgba(255,215,0,0.5)", marginBottom: 12 }}>
                {mode === "preorder" ? "YOU'RE ON THE LIST!" : "APPLICATION RECEIVED!"}
              </h3>
              <p style={{ color: "rgba(192,192,192,0.6)", lineHeight: 1.7, maxWidth: 360, margin: "0 auto" }}>
                {mode === "preorder"
                  ? "Your pre-order is locked in. We'll reach out when VYRO is ready to ship."
                  : "Our team will review your application and get back to you within 48 hours."}
              </p>
            </motion.div>
          ) : (
            <motion.div key={mode}
              initial={{ opacity: 0, x: mode === "preorder" ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
              style={{ background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: "40px 36px",
                border: "1px solid rgba(212,175,55,0.15)", backdropFilter: "blur(24px)" }}>

              {mode === "preorder" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  <div><label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} value={form.name} onChange={up("name")} placeholder="Your name" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>Email</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={up("email")} placeholder="you@email.com" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>Phone</label>
                    <input style={inputStyle} type="tel" value={form.phone} onChange={up("phone")} placeholder="+91 XXXXX XXXXX" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>City</label>
                    <input style={inputStyle} value={form.city} onChange={up("city")} placeholder="Mumbai, Delhi..." onFocus={focus} onBlur={blur} /></div>
                  <div>
                    <label style={labelStyle}>Flavour</label>
                    <select style={{ ...inputStyle, appearance: "none" as const }} value={form.flavor} onChange={up("flavor")} onFocus={focus} onBlur={blur}>
                      {["Original Gold","Arctic Blue","Berry Storm","Citrus Blast","Jungle Green","Cherry Red"].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Quantity (cases of 24)</label>
                    <select style={{ ...inputStyle, appearance: "none" as const }} value={form.quantity} onChange={up("quantity")} onFocus={focus} onBlur={blur}>
                      {["1","2","3","5","10","20+"].map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  <div><label style={labelStyle}>Name</label>
                    <input style={inputStyle} value={form.name} onChange={up("name")} placeholder="Your name" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>Email</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={up("email")} placeholder="you@email.com" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>Company / Brand</label>
                    <input style={inputStyle} value={form.company} onChange={up("company")} placeholder="Your company name" onFocus={focus} onBlur={blur} /></div>
                  <div><label style={labelStyle}>Website (optional)</label>
                    <input style={inputStyle} value={form.website} onChange={up("website")} placeholder="https://..." onFocus={focus} onBlur={blur} /></div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>Partnership Type</label>
                    <select style={{ ...inputStyle, appearance: "none" as const }} value={form.type} onChange={up("type")} onFocus={focus} onBlur={blur}>
                      {["Distributor","Retailer","Campus Ambassador","Gym / Studio Partner","Esports Team","Content Creator","Investor"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>Tell us about yourself</label>
                    <textarea style={{ ...inputStyle, height: 100, resize: "vertical" } as React.CSSProperties}
                      value={form.message} onChange={up("message")}
                      placeholder="What makes you the right VYRO partner?"
                      onFocus={focus} onBlur={blur} />
                  </div>
                </div>
              )}

              {/* Benefits row */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                {(mode === "preorder"
                  ? ["🎯 Early Access","💰 Launch Price","📦 First Delivery","🏆 Founding Customer"]
                  : ["🤝 Exclusive Terms","📈 Growth Support","🎨 Brand Kit","💼 Dedicated Manager"]
                ).map(b => (
                  <div key={b} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 10,
                    background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                    color: "rgba(212,175,55,0.8)", letterSpacing: 1 }}>{b}</div>
                ))}
              </div>

              <motion.button className="btn-vyro" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(true)}
                style={{ width: "100%", fontSize: 13, letterSpacing: 3 }}>
                {mode === "preorder" ? "Confirm Pre-Order →" : "Submit Application →"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function LaunchSection() {
  return (
    <section id="launch" style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"80px 24px",
      background:"radial-gradient(ellipse 80% 80% at 50% 50%, #0d0515 0%, #000000 70%)" }}>
      <div style={{ textAlign:"center", zIndex:10 }}>
        <div className="label-sm" style={{ color:"#D4AF37", marginBottom:20 }}>⚡ The Launch</div>
        <h2 className="display-xl gradient-gold" style={{ marginBottom:24 }}>
          Fuel Focus. Power Performance. Become VYRO.
        </h2>
        <p style={{ color:"rgba(192,192,192,0.55)", maxWidth:500, margin:"0 auto 40px", lineHeight:1.7 }}>
          Whether you game, grind, run, or build — VYRO is the fuel that unlocks your next level. Be first. Be VYRO.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <motion.button className="btn-vyro" whileHover={{ scale:1.06 }} whileTap={{ scale:0.97 }}
            onClick={() => document.getElementById("join")?.scrollIntoView({ behavior:"smooth" })}>
            Join The Launch
          </motion.button>
          <motion.button className="btn-ghost" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            onClick={() => document.getElementById("ingredients")?.scrollIntoView({ behavior:"smooth" })}>
            Explore Formula
          </motion.button>
        </div>
      </div>

      <footer style={{ borderTop:"1px solid rgba(212,175,55,0.12)", padding:"40px 24px",
        textAlign:"center", marginTop:"auto", width:"100%" }}>
        <div style={{ fontFamily:"var(--font-orbitron,sans-serif)", fontWeight:900, fontSize:28,
          color:"#FFD700", marginBottom:12, letterSpacing:8 }}>VYRO</div>
        <div style={{ fontSize:9, color:"rgba(192,192,192,0.2)", letterSpacing:1 }}>
          © 2025 VYRO Beverages Pvt. Ltd. · All rights reserved · Made with ⚡ in India
        </div>
      </footer>
    </section>
  );
}
