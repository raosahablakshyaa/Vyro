"use client";

import { useRef, useState, useEffect, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useVyroStore } from "@/lib/store";
import type { Flavour } from "@/lib/store";

const VyroCan = dynamic(() => import("@/components/3d/VyroCan"), { ssr: false });

// ─── 3D viewer for one flavor ─────────────────────────────────────────────────
function FlavorCanvas({ flavour, rotSpeed }: { flavour: Flavour; rotSpeed: number }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <VyroCan
          flavour={flavour}
          rotationSpeed={rotSpeed}
          showParticles={true}
          scale={0.92}
          allowDrag={true}
        />
      </Suspense>
    </Canvas>
  );
}

// ─── Flavor dot selector ──────────────────────────────────────────────────────
function FlavorDots({
  flavours,
  active,
  onSelect,
}: {
  flavours: Flavour[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
      {flavours.map((f, i) => (
        <motion.button
          key={f.id}
          onClick={() => onSelect(i)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          title={f.name}
          style={{
            width: i === active ? 28 : 10,
            height: 10,
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: i === active ? f.accentColor : "rgba(255,255,255,0.18)",
            boxShadow: i === active ? `0 0 12px ${f.accentColor}` : "none",
            transition: "width 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Single flavor info panel ─────────────────────────────────────────────────
function FlavorInfo({ flavour, visible }: { flavour: Flavour; visible: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={flavour.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center" }}
        >
          {/* Badge */}
          {flavour.badge && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 999,
                background: `${flavour.accentColor}22`,
                border: `1px solid ${flavour.accentColor}60`,
                color: flavour.accentColor,
                fontSize: 9,
                letterSpacing: 3,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 14,
                boxShadow: `0 0 12px ${flavour.accentColor}30`,
              }}
            >
              {flavour.badge}
            </motion.div>
          )}

          {/* Flavor name */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            style={{
              fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
              color: flavour.accentColor,
              textShadow: `0 0 30px ${flavour.glowColor}60`,
              lineHeight: 1,
              marginBottom: 10,
              letterSpacing: 2,
            }}
          >
            {flavour.name}
          </motion.h3>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            style={{
              color: "rgba(192,192,192,0.6)",
              fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            {flavour.tagline}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}
          >
            {[
              { label: "Caffeine", value: `${flavour.caffeine}mg` },
              { label: "Calories", value: `${flavour.calories} kcal` },
              { label: "Volume",   value: `${flavour.volume}ml` },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: `${flavour.accentColor}0e`,
                  border: `1px solid ${flavour.accentColor}30`,
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                <div style={{
                  fontFamily: "var(--font-orbitron, sans-serif)",
                  fontWeight: 800,
                  fontSize: 16,
                  color: flavour.accentColor,
                  textShadow: `0 0 10px ${flavour.accentColor}60`,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(192,192,192,0.4)", textTransform: "uppercase", marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            style={{ display: "flex", gap: 10, justifyContent: "center" }}
          >
            <div style={{
              padding: "6px 18px",
              borderRadius: 999,
              background: flavour.available ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${flavour.available ? "#00FF88" : "rgba(255,255,255,0.1)"}`,
              fontSize: 10,
              letterSpacing: 2,
              color: flavour.available ? "#00FF88" : "rgba(192,192,192,0.4)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}>
              {flavour.available ? "✓ Available Now" : "Coming Soon"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Arrow button ─────────────────────────────────────────────────────────────
function NavArrow({ dir, color, onClick }: { dir: "left" | "right"; color: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12, x: dir === "left" ? -3 : 3 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 48, height: 48,
        borderRadius: "50%",
        border: `1px solid ${color}40`,
        background: `${color}12`,
        color,
        fontSize: 20,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 16px ${color}20`,
        transition: "border-color 0.2s, background 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = color;
        (e.currentTarget as HTMLElement).style.background  = `${color}25`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        (e.currentTarget as HTMLElement).style.background  = `${color}12`;
      }}
    >
      {dir === "left" ? "←" : "→"}
    </motion.button>
  );
}

// ─── Swipeable flavour strip (desktop thumbnail row) ─────────────────────────
function FlavorStrip({
  flavours,
  active,
  onSelect,
}: {
  flavours: Flavour[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{
      display: "flex", gap: 12, justifyContent: "center",
      flexWrap: "wrap", padding: "0 16px",
    }}>
      {flavours.map((f, i) => (
        <motion.button
          key={f.id}
          onClick={() => onSelect(i)}
          whileHover={{ y: -4, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: `1px solid ${i === active ? f.accentColor : "rgba(255,255,255,0.1)"}`,
            background: i === active
              ? `${f.accentColor}18`
              : "rgba(255,255,255,0.03)",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: i === active ? `0 0 20px ${f.accentColor}25` : "none",
            transition: "all 0.25s ease",
          }}
        >
          {/* Color dot */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: f.accentColor,
            boxShadow: `0 0 8px ${f.accentColor}`,
            margin: "0 auto 6px",
          }} />
          <div style={{
            fontFamily: "var(--font-orbitron, sans-serif)",
            fontSize: 9, letterSpacing: 1.5,
            color: i === active ? f.accentColor : "rgba(192,192,192,0.45)",
            fontWeight: 700, textTransform: "uppercase",
            whiteSpace: "nowrap",
            transition: "color 0.25s",
          }}>
            {f.name}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FlavorShowcase() {
  const { flavours, activeFlavourId, setActiveFlavour, canRotationSpeed, showParticles } =
    useVyroStore();

  const activeIdx = Math.max(0, flavours.findIndex(f => f.id === activeFlavourId));
  const activeFlavour = flavours[activeIdx] ?? flavours[0];

  // Touch / swipe support
  const touchStartX  = useRef(0);
  const [dragging, setDragging] = useState(false);
  const dragX = useMotionValue(0);
  const canvasOpacity = useTransform(dragX, [-120, 0, 120], [0.4, 1, 0.4]);

  const goTo = useCallback((idx: number) => {
    const clamped = (idx + flavours.length) % flavours.length;
    setActiveFlavour(flavours[clamped].id);
    dragX.set(0);
  }, [flavours, setActiveFlavour, dragX]);

  const prev = () => goTo(activeIdx - 1);
  const next = () => goTo(activeIdx + 1);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    dragX.set(e.touches[0].clientX - touchStartX.current);
  };
  const onTouchEnd = () => {
    setDragging(false);
    const val = dragX.get();
    if (val < -50) next();
    else if (val > 50) prev();
    dragX.set(0);
  };

  return (
    <section
      id="flavors"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 80px",
      }}
    >
      {/* Dynamic background */}
      <AnimatePresence>
        <motion.div
          key={activeFlavour.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: "absolute", inset: 0,
            background: activeFlavour.bgGradient,
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.65) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 48 }}>
        <motion.div
          className="label-sm"
          style={{ color: "#D4AF37", letterSpacing: 8, marginBottom: 12,
            fontFamily: "var(--font-orbitron, sans-serif)",
            textShadow: "0 0 20px rgba(212,175,55,0.4)" }}
        >
          Choose Your Flavour
        </motion.div>
        <h2
          className="display-lg"
          style={{
            fontFamily: "var(--font-orbitron, Orbitron, sans-serif)",
            background: "linear-gradient(135deg, #8B6914, #FFD700, #D4AF37, #8B6914)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", maxWidth: 600, margin: "0 auto 12px",
          }}
        >
          FLAVOUR LINEUP
        </h2>
        <p style={{ color: "rgba(192,192,192,0.5)", fontSize: 13, letterSpacing: 1 }}>
          Drag the can to rotate 360°  ·  Swipe or use arrows to switch flavours
        </p>
      </div>

      {/* ── Main row: arrow + canvas + arrow ───────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 24, width: "100%", maxWidth: 900,
      }}>
        <NavArrow dir="left"  color={activeFlavour.accentColor} onClick={prev} />

        {/* Canvas wrapper */}
        <motion.div
          style={{ opacity: canvasOpacity, flex: 1, maxWidth: 420, aspectRatio: "1/1.3" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFlavour.id}
              initial={{ opacity: 0, scale: 0.88, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.88, rotateY: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: "100%", height: "100%" }}
            >
              <FlavorCanvas
                flavour={activeFlavour}
                rotSpeed={canRotationSpeed}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <NavArrow dir="right" color={activeFlavour.accentColor} onClick={next} />
      </div>

      {/* ── Flavor info ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, marginTop: 24, marginBottom: 32, minHeight: 200 }}>
        <FlavorInfo flavour={activeFlavour} visible={true} />
      </div>

      {/* ── Dot indicator ───────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, marginBottom: 28 }}>
        <FlavorDots flavours={flavours} active={activeIdx} onSelect={goTo} />
      </div>

      {/* ── Flavor strip ────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 900 }}>
        <FlavorStrip flavours={flavours} active={activeIdx} onSelect={goTo} />
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ position: "relative", zIndex: 10, marginTop: 40 }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="btn-vyro"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            background: `linear-gradient(135deg, ${activeFlavour.accentColor}aa, ${activeFlavour.accentColor})`,
            color: "#000",
          }}
        >
          Get Early Access
        </motion.button>
      </motion.div>

      {/* ── Counter badge ────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 28, right: 32, zIndex: 10,
        fontFamily: "var(--font-orbitron, sans-serif)",
        fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2,
      }}>
        {(activeIdx + 1).toString().padStart(2, "0")} / {flavours.length.toString().padStart(2, "0")}
      </div>
    </section>
  );
}
