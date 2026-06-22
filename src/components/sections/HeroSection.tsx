"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useVyroStore, useActiveFlavour } from "@/lib/store";

const VyroCan         = dynamic(() => import("@/components/3d/VyroCan"),         { ssr: false });
const BackgroundScene = dynamic(() => import("@/components/3d/BackgroundScene"), { ssr: false });

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,0.15)" : "none",
        transition: "all 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #8B6914, #FFD700)", boxShadow: "0 0 20px rgba(212,175,55,0.5)" }}>
          <span style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontWeight: 900, fontSize: 12, color: "#000" }}>V</span>
        </div>
        <span style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontWeight: 900, fontSize: 22, letterSpacing: 6,
          color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>VYRO</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {[
          { label: "Story",       href: "#story" },
          { label: "Flavours",    href: "#flavors" },
          { label: "Performance", href: "#performance" },
          { label: "Ingredients", href: "#ingredients" },
          { label: "Join",        href: "#join" },
        ].map(item => (
          <a key={item.label} href={item.href}
            style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: 11, letterSpacing: 3,
              color: "rgba(192,192,192,0.7)", textDecoration: "none", textTransform: "uppercase",
              transition: "color 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FFD700"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(192,192,192,0.7)"; }}>
            {item.label}
          </a>
        ))}
        <a href="/admin"
          style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: 10, letterSpacing: 2,
            color: "rgba(212,175,55,0.5)", textDecoration: "none", textTransform: "uppercase",
            padding: "4px 10px", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 6,
            transition: "all 0.2s" }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#FFD700";
            el.style.borderColor = "rgba(212,175,55,0.6)";
            el.style.background = "rgba(212,175,55,0.08)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(212,175,55,0.5)";
            el.style.borderColor = "rgba(212,175,55,0.2)";
            el.style.background = "transparent";
          }}>
          Admin
        </a>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-vyro"
        style={{ padding: "10px 24px", fontSize: 11 }}
        onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}>
        Join Launch
      </motion.button>
    </motion.nav>
  );
}

function FloatingPill({ text, color, x, y, delay }: { text: string; color: string; x: string; y: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      style={{ position: "absolute", left: x, top: y, padding: "6px 14px", borderRadius: 999,
        border: `1px solid ${color}40`, background: `${color}12`, backdropFilter: "blur(10px)",
        color, fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase",
        whiteSpace: "nowrap", pointerEvents: "none",
        animation: "float 5s ease-in-out infinite", boxShadow: `0 0 16px ${color}30` }}>
      {text}
    </motion.div>
  );
}

export default function HeroSection() {
  const [dpr, setDpr] = useState(1.5);
  const activeFlavour   = useActiveFlavour();
  const { content, canRotationSpeed, showParticles } = useVyroStore();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const bgX = useTransform(springX, [-600, 600], [-12, 12]);
  const bgY = useTransform(springY, [-300, 300], [-6, 6]);

  useEffect(() => {
    const fn = (e: MouseEvent) => { mouseX.set(e.clientX - window.innerWidth / 2); mouseY.set(e.clientY - window.innerHeight / 2); };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, [mouseX, mouseY]);

  return (
    <>
      <Navbar />
      <section id="hero" className="section-full"
        style={{ height: "100vh", background: activeFlavour.bgGradient || "radial-gradient(ellipse 80% 60% at 50% 40%, #0d0620 0%, #000000 70%)" }}>
        <motion.div style={{ x: bgX, y: bgY, position: "absolute", inset: 0, zIndex: 0 }}>
          <Canvas dpr={dpr} camera={{ position: [0, 0, 4.2], fov: 44 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} shadows>
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
            <AdaptiveDpr pixelated /><AdaptiveEvents />
            <Suspense fallback={null}>
              <BackgroundScene />
              <VyroCan
                flavour={activeFlavour}
                rotationSpeed={canRotationSpeed}
                showParticles={showParticles}
                scale={1}
                allowDrag={true}
              />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </motion.div>

        <div style={{ position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none", zIndex: 1 }} />

        {/* HUD corners */}
        {([["tl","top","left"],["tr","top","right"],["bl","bottom","left"],["br","bottom","right"]] as const).map(([id, v, h]) => (
          <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            style={{ position: "absolute", width: 28, height: 28, [v]: 24, [h]: 24, zIndex: 10,
              borderTop:    v === "top"    ? "2px solid rgba(212,175,55,0.5)" : "none",
              borderBottom: v === "bottom" ? "2px solid rgba(212,175,55,0.5)" : "none",
              borderLeft:   h === "left"   ? "2px solid rgba(212,175,55,0.5)" : "none",
              borderRight:  h === "right"  ? "2px solid rgba(212,175,55,0.5)" : "none" }} />
        ))}

        <FloatingPill text="Natural Caffeine" color="#FFD700" x="6%"  y="30%" delay={1.8} />
        <FloatingPill text="L-Theanine"       color="#00D4FF" x="6%"  y="42%" delay={2.0} />
        <FloatingPill text="Electrolytes"     color="#8B00FF" x="6%"  y="54%" delay={2.2} />
        <FloatingPill text="B Vitamins"       color="#00FF88" x="72%" y="30%" delay={1.9} />
        <FloatingPill text="Zero Sugar"       color="#FFD700" x="72%" y="42%" delay={2.1} />
        <FloatingPill text="Performance+"     color="#FF6B00" x="72%" y="54%" delay={2.3} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end", paddingBottom: 96, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }} className="label-sm"
            style={{ color: "#D4AF37", letterSpacing: 8, marginBottom: 16,
              fontFamily: "var(--font-orbitron, sans-serif)", textShadow: "0 0 20px rgba(212,175,55,0.4)" }}>
            {content.brandTagline}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl glow-gold"
            style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", textAlign: "center",
              background: "linear-gradient(135deg, #8B6914 0%, #FFD700 40%, #D4AF37 60%, #8B6914 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
            {content.heroHeadline}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: "clamp(0.9rem, 2vw, 1.4rem)",
              letterSpacing: 6, color: "rgba(192,192,192,0.85)", marginTop: 8, textAlign: "center" }}>
            {content.heroSubline}
          </motion.div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="divider-gold" style={{ width: 220, margin: "20px auto" }} />

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{ maxWidth: 480, textAlign: "center", color: "rgba(192,192,192,0.6)",
              fontSize: "clamp(0.8rem, 1.4vw, 1rem)", lineHeight: 1.7, marginBottom: 32 }}>
            {content.heroDescription}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }} style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <motion.button className="btn-vyro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}>
              {content.ctaPrimary}
            </motion.button>
            <motion.button className="btn-ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}>
              {content.ctaSecondary}
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(212,175,55,0.5)" }}>
            <span style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase" }}>Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 1, height: 36, background: "linear-gradient(180deg, #D4AF37, transparent)" }} />
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180,
          background: "linear-gradient(to bottom, transparent, #000000)", pointerEvents: "none", zIndex: 3 }} />
      </section>
    </>
  );
}
