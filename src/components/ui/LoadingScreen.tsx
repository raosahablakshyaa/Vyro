"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    const steps = [
      { target: 30,  delay: 100  },
      { target: 55,  delay: 400  },
      { target: 78,  delay: 800  },
      { target: 92,  delay: 1200 },
      { target: 100, delay: 1600 },
    ];
    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => {
        setProgress(target);
        if (target === 100) setTimeout(() => setVisible(false), 900);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#000",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px" }} />

          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 48 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 140, height: 140, borderRadius: "50%", border: "1px dashed rgba(212,175,55,0.3)" }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(212,175,55,0.2)" }} />
            <div style={{ fontFamily: "var(--font-orbitron, Orbitron, sans-serif)", fontWeight: 900, fontSize: 52,
              letterSpacing: 12, color: "#FFD700",
              textShadow: "0 0 40px rgba(255,215,0,0.6)", lineHeight: 1, position: "relative", zIndex: 1, padding: "20px 8px" }}>
              VYRO
            </div>
            <div style={{ fontSize: 9, letterSpacing: 6, color: "rgba(212,175,55,0.5)", textTransform: "uppercase",
              fontFamily: "var(--font-orbitron, sans-serif)", position: "relative", zIndex: 1 }}>
              Initializing
            </div>
          </motion.div>

          <div style={{ position: "relative", zIndex: 1, width: 280 }}>
            <div style={{ height: 1, background: "rgba(212,175,55,0.1)", borderRadius: 1, marginBottom: 12, overflow: "hidden" }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ height: "100%", background: "linear-gradient(90deg, #8B6914, #FFD700, #D4AF37)",
                  boxShadow: "0 0 8px rgba(255,215,0,0.6)", borderRadius: 1 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(192,192,192,0.3)", textTransform: "uppercase" }}>Loading Experience</span>
              <span style={{ fontFamily: "var(--font-orbitron, sans-serif)", fontSize: 12, fontWeight: 700, color: "#D4AF37" }}>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
