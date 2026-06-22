"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const SCENES = [
  { id: "gamer",   mode: "Gamer Mode",   icon: "🎮", color: "#00D4FF", accent: "#8B00FF",
    title: "DOMINATE THE GAME", subtitle: "Reflexes at 0.1ms. Focus at max.",
    description: "VYRO supercharges your neural pathways. RGB ambience, headset on, energy at full capacity. Every millisecond counts — VYRO delivers the edge.",
    stats: [{ label: "Reaction Time", value: "↓ 23%" }, { label: "Focus Score", value: "↑ 94%" }, { label: "Win Rate", value: "↑ 41%" }],
    tags: ["RGB Setup","Zero Lag","Pro Gamer","Neural Boost"],
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #0d0030 0%, #000000 70%)" },
  { id: "gym",     mode: "Gym Beast Mode", icon: "💪", color: "#FF6B00", accent: "#FF2D55",
    title: "BREAK EVERY LIMIT", subtitle: "Rep after rep. No ceiling.",
    description: "Pre-workout power meets premium taste. VYRO's performance blend hits your bloodstream in minutes — deadlifts, bench press, pull-ups. Beast mode activated.",
    stats: [{ label: "Energy Surge", value: "↑ 67%" }, { label: "Endurance", value: "↑ 55%" }, { label: "Recovery", value: "↓ 30%" }],
    tags: ["Pre-Workout","Max Reps","Zero Crash","Power Blend"],
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #200800 0%, #000000 70%)" },
  { id: "runner",  mode: "Runner Mode",   icon: "🏃", color: "#00FF88", accent: "#00D4FF",
    title: "OUTRUN LIMITS", subtitle: "Neon city. Full throttle.",
    description: "Futuristic city track. Motion blur at 30km/h. VYRO electrolytes keep you locked in while neon energy trails mark your path. Faster. Farther. VYRO.",
    stats: [{ label: "Pace Boost", value: "↑ 18%" }, { label: "Hydration", value: "↑ 88%" }, { label: "Stamina", value: "↑ 72%" }],
    tags: ["Electrolytes","Speed Boost","City Sprint","Zero Wall"],
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #001a0d 0%, #000000 70%)" },
  { id: "student", mode: "Hustler Mode",  icon: "🧠", color: "#FFD700", accent: "#D4AF37",
    title: "BUILD THE EMPIRE", subtitle: "3 AM. Code shipping. No sleep needed.",
    description: "Multiple screens. Deadlines. Side projects. VYRO's L-Theanine and natural caffeine blend keeps you in the zone without the jitter — just pure focused flow.",
    stats: [{ label: "Deep Focus", value: "↑ 81%" }, { label: "Memory", value: "↑ 36%" }, { label: "Productivity", value: "↑ 60%" }],
    tags: ["L-Theanine","Zero Jitter","Deep Work","Night Mode"],
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1400 0%, #000000 70%)" },
];

type Scene = typeof SCENES[0];

// ─── Interactive: Gamer Visual ────────────────────────────────────────────────
function GamerVisual({ color, accent }: { color: string; accent: string }) {
  const [clicked, setClicked] = useState(false);
  const [kills, setKills]     = useState(14);
  const [fps,   setFps]       = useState(240);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    // Simulate kill streak burst
    let k = kills;
    const iv = setInterval(() => {
      k += 1;
      setKills(k);
      setFps(f => Math.min(f + 5, 360));
      if (k >= kills + 8) clearInterval(iv);
    }, 120);
    setTimeout(() => setClicked(false), 3500);
  };

  return (
    <div onClick={handleClick}
      style={{ position:"relative", width:"100%", aspectRatio:"16/10", borderRadius:16, overflow:"hidden",
        background:"linear-gradient(135deg,#0a0020,#000814)", border:`1px solid ${color}30`,
        cursor:"pointer" }}>

      {/* RGB keys */}
      {[0,1,2,3,4].map(i => (
        <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.2, delay:i*0.18, repeat:Infinity }}
          style={{ position:"absolute", bottom:"18%", left:`${10+i*16}%`, width:"12%", height:4,
            background:["#FF2D55","#00D4FF","#00FF88","#FFD700","#8B00FF"][i], borderRadius:2,
            boxShadow:`0 0 14px ${["#FF2D55","#00D4FF","#00FF88","#FFD700","#8B00FF"][i]}` }} />
      ))}

      {/* Monitor */}
      <div style={{ position:"absolute", top:"8%", left:"15%", right:"15%", height:"55%",
        background:`linear-gradient(135deg,${accent}20,${color}15)`, border:`1px solid ${color}40`,
        borderRadius:8, boxShadow:`0 0 40px ${color}30` }}>
        {/* Reticle */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:32, height:32 }}>
          <div style={{ position:"absolute", inset:0, border:`1px solid ${color}`, borderRadius:"50%",
            animation:"energyRing 1.5s ease-out infinite" }} />
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            width:6, height:6, background:color, borderRadius:"50%", boxShadow:`0 0 12px ${color}` }} />
        </div>
        {/* HUD stats */}
        {[`KILL: ${kills}`,`PING: 3ms`,`FPS: ${fps}`].map((t,i) => (
          <motion.div key={i} animate={{ color: clicked && i !== 1 ? ["#fff",color,"#fff"] : color }}
            transition={{ duration:0.4 }}
            style={{ position:"absolute", top:`${12+i*22}%`, left:"6%",
              fontFamily:"var(--font-orbitron,sans-serif)", fontSize:9, letterSpacing:2,
              textShadow:`0 0 8px ${color}` }}>{t}</motion.div>
        ))}
      </div>

      {/* Kill explosion on click */}
      <AnimatePresence>
        {clicked && (
          <motion.div key="kill-burst"
            initial={{ opacity:1, scale:0.5 }}
            animate={{ opacity:0, scale:3 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.8 }}
            style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
              width:80, height:80, borderRadius:"50%",
              background:`radial-gradient(circle,${color}80,transparent)`, pointerEvents:"none" }} />
        )}
      </AnimatePresence>

      {/* Click hint */}
      {!clicked && (
        <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            fontSize:9, letterSpacing:2, color, fontFamily:"var(--font-orbitron,sans-serif)" }}>
          CLICK TO PLAY ▶
        </motion.div>
      )}

      {/* Energy particles on click */}
      {clicked && Array.from({length:10},(_,i) => (
        <motion.div key={i}
          initial={{ opacity:1, x:"50%", y:"40%" }}
          animate={{ opacity:0, x:`${50+(Math.random()-0.5)*80}%`, y:`${40+(Math.random()-0.5)*60}%` }}
          transition={{ duration:0.7+i*0.05, ease:"easeOut" }}
          style={{ position:"absolute", width:4, height:4, borderRadius:"50%",
            background:color, boxShadow:`0 0 8px ${color}`, pointerEvents:"none" }} />
      ))}

      <div style={{ position:"absolute", top:12, right:12, padding:"4px 10px",
        background:clicked ? `${color}60` : `${color}20`, border:`1px solid ${color}50`, borderRadius:999,
        fontSize:9, letterSpacing:2, color, fontWeight:700, transition:"background 0.3s" }}>
        {clicked ? "🔥 CLUTCH!" : "GAMING"}
      </div>
    </div>
  );
}

// ─── Interactive: Gym Visual ──────────────────────────────────────────────────
function GymVisual({ color, accent }: { color: string; accent: string }) {
  const [lifting, setLifting] = useState(false);
  const [reps,    setReps]    = useState(12);
  const [weight,  setWeight]  = useState(100);

  const handleClick = () => {
    if (lifting) return;
    setLifting(true);
    let r = 0;
    const iv = setInterval(() => {
      r++;
      setReps(p => p + 1);
      if (r >= 5) { clearInterval(iv); setTimeout(() => setLifting(false), 1000); }
    }, 250);
    setWeight(w => w + 5);
  };

  return (
    <div onClick={handleClick}
      style={{ position:"relative", width:"100%", aspectRatio:"16/10", borderRadius:16, overflow:"hidden",
        background:"linear-gradient(135deg,#150500,#000)", border:`1px solid ${color}30`,
        cursor:"pointer" }}>

      {/* Floor grid */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"35%",
        backgroundImage:`linear-gradient(${color}08 1px,transparent 1px),linear-gradient(90deg,${color}08 1px,transparent 1px)`,
        backgroundSize:"20px 20px", transform:"perspective(150px) rotateX(35deg)", transformOrigin:"bottom" }} />

      {/* Barbell — animates on click */}
      <motion.div
        animate={lifting ? { y:[0,-18,0,-12,0] } : { y:0 }}
        transition={{ duration:1.2, ease:"easeInOut" }}
        style={{ position:"absolute", top:"28%", left:"10%", right:"10%", height:8,
          background:"linear-gradient(90deg,#888,#ccc,#888)", borderRadius:4, boxShadow:`0 0 20px ${color}40` }}>
        <div style={{ position:"absolute", left:-14, top:-20, width:14, height:48,
          background:`linear-gradient(180deg,${accent},${color})`, borderRadius:4 }} />
        <div style={{ position:"absolute", right:-14, top:-20, width:14, height:48,
          background:`linear-gradient(180deg,${accent},${color})`, borderRadius:4 }} />
      </motion.div>

      {/* Shockwave rings */}
      {[0,1,2].map(i => (
        <motion.div key={i} animate={{ scale:[0.5, lifting ? 3.5 : 2.5], opacity:[0.7,0] }}
          transition={{ duration:lifting ? 1.2 : 1.8, delay:i*0.4, repeat:Infinity, ease:"easeOut" }}
          style={{ position:"absolute", top:"25%", left:"50%", transform:"translate(-50%,-50%)",
            width:60, height:60, border:`2px solid ${color}`, borderRadius:"50%" }} />
      ))}

      {/* Weight text */}
      <motion.div
        animate={{ scale: lifting ? [1,1.3,1] : [1,1.08,1] }}
        transition={{ duration:lifting ? 1.2 : 0.8, repeat:Infinity }}
        style={{ position:"absolute", top:16, left:16, fontFamily:"var(--font-orbitron,sans-serif)",
          fontWeight:900, fontSize:32, color, textShadow:`0 0 20px ${color}`, lineHeight:1 }}>
        {reps}<div style={{ fontSize:9, letterSpacing:3, color:"rgba(255,255,255,0.5)" }}>REPS</div>
      </motion.div>

      {/* Weight badge */}
      <div style={{ position:"absolute", bottom:16, left:16, fontFamily:"var(--font-orbitron,sans-serif)",
        fontSize:13, fontWeight:700, color, textShadow:`0 0 10px ${color}` }}>
        {weight}kg
      </div>

      {/* Sweat particles on lift */}
      {lifting && Array.from({length:8},(_,i) => (
        <motion.div key={i}
          initial={{ opacity:1, x:`${30+i*5}%`, y:"30%" }}
          animate={{ opacity:0, x:`${30+i*5+(Math.random()-0.5)*20}%`, y:`${5+Math.random()*20}%` }}
          transition={{ duration:0.6, ease:"easeOut" }}
          style={{ position:"absolute", width:3, height:6, borderRadius:999,
            background:`linear-gradient(180deg,${color},transparent)`, pointerEvents:"none" }} />
      ))}

      {/* Click hint */}
      {!lifting && (
        <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            fontSize:9, letterSpacing:2, color, fontFamily:"var(--font-orbitron,sans-serif)" }}>
          CLICK TO LIFT 💪
        </motion.div>
      )}

      <div style={{ position:"absolute", top:12, right:12, padding:"4px 10px",
        background:lifting ? `${color}60` : `${color}20`, border:`1px solid ${color}50`, borderRadius:999,
        fontSize:9, letterSpacing:2, color, fontWeight:700, transition:"background 0.3s" }}>
        {lifting ? "🔥 PUSH!" : "BEAST MODE"}
      </div>
    </div>
  );
}

// ─── Interactive: Student/Hustler Visual ──────────────────────────────────────
function StudentVisual({ color, accent }: { color: string; accent: string }) {
  const [shipping, setShipping]   = useState(false);
  const [commits,  setCommits]    = useState(0);
  const [lines,    setLines]      = useState<string[]>([]);

  const allLines = [
    "const vyro = new Energy();",
    "vyro.activate('focus', MAX);",
    "while(hustle) { ship(); }",
    "// 3:47 AM — still coding",
    "git commit -m 'VYRO mode'",
  ];

  const handleClick = () => {
    if (shipping) return;
    setShipping(true);
    const newLine = [
      "npm run build ✓",
      "tests passed ✓",
      "deployed! 🚀",
      "users: +1,200",
      "// shipping again...",
    ][commits % 5];
    setLines(l => [...l.slice(-4), newLine]);
    setCommits(c => c + 1);
    setTimeout(() => setShipping(false), 1400);
  };

  const displayLines = [...allLines.slice(0, 5 - lines.length), ...lines];

  return (
    <div onClick={handleClick}
      style={{ position:"relative", width:"100%", aspectRatio:"16/10", borderRadius:16, overflow:"hidden",
        background:"linear-gradient(135deg,#0a0800,#000)", border:`1px solid ${color}30`,
        cursor:"pointer" }}>

      {/* Three monitors */}
      {[
        {left:"2%",  width:"30%", top:"8%",  height:"58%"},
        {left:"34%", width:"32%", top:"4%",  height:"64%"},
        {left:"68%", width:"30%", top:"8%",  height:"58%"},
      ].map((m,mi) => (
        <div key={mi} style={{ position:"absolute", ...m,
          background: mi===1 ? `linear-gradient(135deg,${accent}20,${color}12)` : "rgba(10,8,0,0.8)",
          border:`1px solid ${mi===1?color:color+"30"}`, borderRadius:4, overflow:"hidden" }}>
          {mi===1 && displayLines.map((line,li) => (
            <motion.div key={line+li}
              initial={{ opacity:0, x:-8 }}
              animate={{ opacity: li === 3 ? 0.5 : 0.85, x:0 }}
              transition={{ duration:0.25, delay:li*0.06 }}
              style={{ padding:"2px 6px", fontSize:7, fontFamily:"monospace",
                color: line.includes("✓") || line.includes("🚀") ? "#00FF88"
                     : line.startsWith("//") ? "#888"
                     : color,
                letterSpacing:0.5, lineHeight:1.6, whiteSpace:"nowrap" }}>
              {line}
            </motion.div>
          ))}
          {mi !== 1 && Array.from({length:8},(_,li) => (
            <motion.div key={li}
              animate={shipping ? { opacity:[0.3,1,0.3] } : {}}
              transition={{ duration:0.4, delay:li*0.05, repeat:shipping ? Infinity : 0 }}
              style={{ margin:"4px 6px", height:4,
                background:`linear-gradient(90deg,${color}40,transparent)`,
                width:`${40+((li*37)%50)}%`, borderRadius:2 }} />
          ))}
        </div>
      ))}

      {/* Commit flash */}
      <AnimatePresence>
        {shipping && (
          <motion.div key="flash"
            initial={{ opacity:0.7 }} animate={{ opacity:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.8 }}
            style={{ position:"absolute", inset:0, background:`${color}08`, pointerEvents:"none" }} />
        )}
      </AnimatePresence>

      {/* Clock */}
      <motion.div animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:2, repeat:Infinity }}
        style={{ position:"absolute", top:14, left:14, fontFamily:"var(--font-orbitron,sans-serif)",
          fontWeight:700, fontSize:18, color, textShadow:`0 0 12px ${color}` }}>
        03:47
        <div style={{ fontSize:8, letterSpacing:2, color:"rgba(255,255,255,0.4)" }}>AM — IN THE ZONE</div>
      </motion.div>

      {/* Commit counter */}
      {commits > 0 && (
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
          style={{ position:"absolute", bottom:12, left:14, fontFamily:"var(--font-orbitron,sans-serif)",
            fontSize:10, fontWeight:700, color: "#00FF88" }}>
          {commits} commit{commits !== 1 ? "s" : ""} 🚀
        </motion.div>
      )}

      {/* Click hint */}
      {!shipping && (
        <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            fontSize:9, letterSpacing:2, color, fontFamily:"var(--font-orbitron,sans-serif)" }}>
          CLICK TO SHIP 🚀
        </motion.div>
      )}

      <div style={{ position:"absolute", top:12, right:12, padding:"4px 10px",
        background:shipping ? `${color}60` : `${color}20`, border:`1px solid ${color}50`, borderRadius:999,
        fontSize:9, letterSpacing:2, color, fontWeight:700, transition:"background 0.3s" }}>
        {shipping ? "⚡ SHIPPING!" : "HUSTLE MODE"}
      </div>
    </div>
  );
}

function SceneVisual({ scene }: { scene: Scene }) {
  const { color, accent } = scene;
  if (scene.id === "gamer")   return <GamerVisual   color={color} accent={accent} />;
  if (scene.id === "gym")     return <GymVisual     color={color} accent={accent} />;
  if (scene.id === "student") return <StudentVisual color={color} accent={accent} />;

  // runner — no click interaction needed, just speed blur
  return (
    <div style={{ position:"relative", width:"100%", aspectRatio:"16/10", borderRadius:16, overflow:"hidden",
      background:"linear-gradient(135deg,#001408,#000)", border:`1px solid ${color}30` }}>
      {[0,1,2].map(i => (
        <motion.div key={i} animate={{ x:["0%","-100%"] }} transition={{ duration:1.2-i*0.15, repeat:Infinity, ease:"linear" }}
          style={{ position:"absolute", bottom:`${22+i*4}%`, left:0, width:"200%", height:1,
            background:`linear-gradient(90deg,transparent,${color},transparent)`, opacity:0.6-i*0.15 }} />
      ))}
      {Array.from({length:12},(_,i) => (
        <motion.div key={i} animate={{ x:["100%","-20%"], opacity:[0,0.7,0] }}
          transition={{ duration:0.6+Math.random()*0.4, repeat:Infinity, delay:Math.random()*0.8, ease:"linear" }}
          style={{ position:"absolute", top:`${15+Math.random()*65}%`,
            width:`${40+Math.random()*80}px`, height:1,
            background:`linear-gradient(90deg,${color},transparent)` }} />
      ))}
      <motion.div animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:1, repeat:Infinity }}
        style={{ position:"absolute", top:16, left:16, fontFamily:"var(--font-orbitron,sans-serif)",
          fontWeight:900, fontSize:28, color, textShadow:`0 0 16px ${color}` }}>
        32<span style={{ fontSize:11, marginLeft:3 }}>km/h</span>
      </motion.div>
      <div style={{ position:"absolute", top:12, right:12, padding:"4px 10px",
        background:`${color}20`, border:`1px solid ${color}50`, borderRadius:999,
        fontSize:9, letterSpacing:2, color, fontWeight:700 }}>SPRINT MODE</div>
    </div>
  );
}

function SceneCard({ scene }: { scene: Scene }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  return (
    <div ref={ref} className="scene-pad" style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      background:scene.bgGradient, position:"relative" }}>
      <div className="scene-grid">
        <div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:inView?1:0, y:inView?0:20 }}
            transition={{ duration:0.5 }}
            style={{ display:"inline-flex", alignItems:"center", gap:10,
              padding:"6px 16px", borderRadius:999,
              background:`${scene.color}15`, border:`1px solid ${scene.color}40`,
              marginBottom:24 }}>
            <span style={{ fontSize:20 }}>{scene.icon}</span>
            <span style={{ fontFamily:"var(--font-orbitron,sans-serif)", fontSize:10,
              letterSpacing:3, color:scene.color, fontWeight:700 }}>{scene.mode}</span>
          </motion.div>

          <motion.h2 initial={{ opacity:0, y:30 }} animate={{ opacity:inView?1:0, y:inView?0:30 }}
            transition={{ duration:0.6, delay:0.1 }}
            style={{ fontFamily:"var(--font-orbitron,Orbitron,sans-serif)",
              fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:900, lineHeight:1.05,
              color:"#fff", textShadow:`0 0 30px ${scene.color}40`, marginBottom:12 }}>
            {scene.title}
          </motion.h2>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:inView?1:0, y:inView?0:20 }}
            transition={{ duration:0.5, delay:0.2 }}
            style={{ fontSize:"clamp(0.9rem,1.3vw,1.1rem)", color:scene.color,
              fontWeight:600, marginBottom:16, letterSpacing:1 }}>
            {scene.subtitle}
          </motion.p>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:inView?1:0, y:inView?0:16 }}
            transition={{ duration:0.5, delay:0.3 }}
            style={{ color:"rgba(192,192,192,0.65)", lineHeight:1.7,
              fontSize:"clamp(0.82rem,1.1vw,0.95rem)", marginBottom:28 }}>
            {scene.description}
          </motion.p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:inView?1:0 }}
            transition={{ delay:0.4 }}
            style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:32 }}>
            {scene.tags.map(tag => (
              <span key={tag} style={{ padding:"4px 12px", borderRadius:999,
                border:`1px solid ${scene.color}30`, fontSize:10, letterSpacing:2,
                color:"rgba(192,192,192,0.6)", textTransform:"uppercase" }}>
                {tag}
              </span>
            ))}
          </motion.div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {scene.stats.map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.3+i*0.12, duration:0.5 }}
                style={{ background:"rgba(0,0,0,0.5)", border:`1px solid ${scene.color}30`,
                  borderRadius:8, padding:"10px 16px", backdropFilter:"blur(12px)",
                  display:"flex", justifyContent:"space-between", alignItems:"center", gap:32 }}>
                <span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(192,192,192,0.6)" }}>{s.label}</span>
                <span style={{ fontFamily:"var(--font-orbitron,sans-serif)", fontWeight:700, fontSize:16, color:scene.color, textShadow:`0 0 12px ${scene.color}80` }}>{s.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity:0, x:40, scale:0.95 }}
          animate={{ opacity:inView?1:0, x:inView?0:40, scale:inView?1:0.95 }}
          transition={{ duration:0.7, delay:0.15, ease:[0.16,1,0.3,1] }}>
          <SceneVisual scene={scene} />
        </motion.div>
      </div>
    </div>
  );
}

export default function PerformanceJourney() {
  return (
    <section id="performance">
      <div id="story" style={{ padding:"clamp(64px,10vw,120px) 16px clamp(48px,8vw,80px)", textAlign:"center",
        background:"linear-gradient(180deg,#000,#050508)" }}>
        <div className="label-sm" style={{ color:"#D4AF37", letterSpacing:8, marginBottom:20,
          fontFamily:"var(--font-orbitron,sans-serif)", textShadow:"0 0 20px rgba(212,175,55,0.4)" }}>
          The Performance Journey
        </div>
        <h2 className="display-lg" style={{ fontFamily:"var(--font-orbitron,Orbitron,sans-serif)",
          background:"linear-gradient(135deg,#8B6914,#FFD700,#D4AF37,#8B6914)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundClip:"text", maxWidth:700, margin:"0 auto 24px" }}>
          POWERED BY VYRO
        </h2>
        <p style={{ color:"rgba(192,192,192,0.55)", maxWidth:520, margin:"0 auto",
          lineHeight:1.7, fontSize:"clamp(0.85rem,1.2vw,1rem)" }}>
          Four lifestyles. One formula. Scroll to experience what VYRO unlocks in you.
        </p>
      </div>
      {SCENES.map(scene => (
        <div key={scene.id} id={`scene-${scene.id}`}>
          <SceneCard scene={scene} />
        </div>
      ))}
    </section>
  );
}
