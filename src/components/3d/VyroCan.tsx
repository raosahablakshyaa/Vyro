"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Flavour } from "@/lib/store";

// ─── Can profile ──────────────────────────────────────────────────────────────
// Real 330ml slim can aspect ratio: diameter ~66mm, height ~115mm → ratio ≈ 1.74
// We use total height 2.6 units, radius 0.46 units  → ratio ≈ 2.8 (slightly tall but visually right)
function buildCanProfile(): THREE.Vector2[] {
  const pts: [number, number][] = [
    [0.00, -1.30], // centre bottom
    [0.22, -1.30], // bottom inner
    [0.32, -1.22], // bottom bevel
    [0.42, -1.10], // bottom shoulder
    [0.46, -0.95], // body start
    [0.46,  0.95], // body end
    [0.43,  1.08], // top shoulder
    [0.32,  1.20], // neck
    [0.26,  1.28], // rim
    [0.26,  1.30], // top inner
    [0.00,  1.30], // centre top
  ];
  return pts.map(([x, y]) => new THREE.Vector2(x, y));
}

// ─── Label texture ────────────────────────────────────────────────────────────
// LatheGeometry maps U from 0→1 around the full 360°.
// We want "VYRO" to appear on the front face only (~1/3 of circumference).
// Solution: use repeat.x = 3 so the texture tiles 3× around — each tile is 120°.
// We place VYRO centred in the tile so it reads front-facing.
function buildLabelTexture(flavour: Flavour): THREE.CanvasTexture {
  // Tile size: width = 512 per tile × 3 tiles = 1536 wide, height = 512
  const TW = 512; // one tile width
  const W  = TW;  // we draw one tile; repeat handles the rest
  const H  = 512;

  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Body fill ──────────────────────────────────────────────────────────────
  ctx.fillStyle = flavour.bodyColor;
  ctx.fillRect(0, 0, W, H);

  // ── Metallic sheen ─────────────────────────────────────────────────────────
  const sheen = ctx.createLinearGradient(0, 0, W, H * 0.6);
  sheen.addColorStop(0,    "rgba(255,255,255,0.00)");
  sheen.addColorStop(0.35, "rgba(255,255,255,0.08)");
  sheen.addColorStop(0.5,  "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.65, "rgba(255,255,255,0.08)");
  sheen.addColorStop(1,    "rgba(255,255,255,0.00)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // ── Accent stripes ─────────────────────────────────────────────────────────
  const stripe = ctx.createLinearGradient(0, 0, W, 0);
  stripe.addColorStop(0,   flavour.accentColor + "99");
  stripe.addColorStop(0.5, flavour.accentColor + "ff");
  stripe.addColorStop(1,   flavour.accentColor + "99");
  ctx.fillStyle = stripe;
  ctx.fillRect(0, 0,        W, 22);   // top stripe
  ctx.fillRect(0, H - 22,   W, 22);   // bottom stripe

  // thin line
  ctx.strokeStyle = flavour.accentColor;
  ctx.lineWidth   = 1.5;
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.moveTo(0, 26);     ctx.lineTo(W, 26);     ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H - 26); ctx.lineTo(W, H - 26); ctx.stroke();
  ctx.globalAlpha = 1;

  // ── VYRO wordmark — centred in tile, occupies ~60% of width ───────────────
  const cX = W / 2;
  const cY = H / 2 - 10;
  ctx.save();
  ctx.shadowColor = flavour.glowColor;
  ctx.shadowBlur  = 28;

  // Font size: 36% of tile height → text is prominent but fits cleanly
  const fs = Math.round(H * 0.36);
  ctx.font         = `900 ${fs}px 'Arial Black', Arial, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  // Stroke (outline) pass
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth   = 10;
  ctx.strokeText("VYRO", cX, cY);

  // Metallic gradient fill
  const g = ctx.createLinearGradient(cX - 120, cY - 40, cX + 120, cY + 40);
  g.addColorStop(0,    shadeColor(flavour.labelColor, -40));
  g.addColorStop(0.3,  flavour.labelColor);
  g.addColorStop(0.5,  "#ffffff");
  g.addColorStop(0.7,  flavour.labelColor);
  g.addColorStop(1,    shadeColor(flavour.labelColor, -40));
  ctx.fillStyle = g;
  ctx.fillText("VYRO", cX, cY);
  ctx.restore();

  // ── Flavour name ───────────────────────────────────────────────────────────
  ctx.save();
  ctx.font         = `700 ${Math.round(H * 0.065)}px Arial, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle    = flavour.accentColor;
  ctx.shadowColor  = flavour.glowColor;
  ctx.shadowBlur   = 10;
  ctx.fillText(flavour.name.toUpperCase(), cX, cY + Math.round(H * 0.13));
  ctx.restore();

  // ── Tagline ────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.font         = `500 ${Math.round(H * 0.048)}px Arial, sans-serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle    = "rgba(255,255,255,0.45)";
  ctx.fillText(flavour.tagline.toUpperCase(), cX, cY + Math.round(H * 0.24));
  ctx.restore();

  // ── Info strip ─────────────────────────────────────────────────────────────
  ctx.save();
  ctx.font      = `400 ${Math.round(H * 0.036)}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillText(
    `${flavour.caffeine}mg CAFFEINE · ${flavour.calories} KCAL · ${flavour.volume}ml`,
    cX, H - 12
  );
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  // Repeat 3× around the cylinder so each tile covers 120°
  tex.wrapS   = THREE.RepeatWrapping;
  tex.wrapT   = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  tex.needsUpdate = true;
  return tex;
}

function shadeColor(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ─── Water droplet ────────────────────────────────────────────────────────────
function WaterDroplet({ position }: { position: [number, number, number] }) {
  const ref    = useRef<THREE.Mesh>(null);
  const speed  = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed + offset) * 0.03;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.009, 7, 7]} />
      <MeshTransmissionMaterial
        backside samples={3} thickness={0.06}
        roughness={0.02} transmission={0.99}
        ior={1.45} chromaticAberration={0.02}
        color="#c8e8f8"
      />
    </mesh>
  );
}

// ─── Energy particles ─────────────────────────────────────────────────────────
function EnergyParticles({ color }: { color: string }) {
  const count = 80;
  const ref   = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color("#ffffff");
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2;
      const radius = 0.7 + Math.random() * 1.0;
      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [color]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.1;
    (ref.current.material as THREE.PointsMaterial).opacity =
      0.4 + Math.sin(clock.getElapsedTime() * 1.4) * 0.25;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ─── Glow ring ────────────────────────────────────────────────────────────────
function GlowRing({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * 1.6) * 0.1;
    ref.current.scale.set(s, s, s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.2 + Math.sin(clock.getElapsedTime() * 1.6) * 0.1;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
      <ringGeometry args={[0.55, 1.2, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.2}
        blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ─── Can body ─────────────────────────────────────────────────────────────────
function CanBody({ flavour }: { flavour: Flavour }) {
  const bodyRef = useRef<THREE.Group>(null);
  const topRef  = useRef<THREE.Mesh>(null);

  const labelTex = useMemo(() => {
    if (typeof window === "undefined") return null;
    return buildLabelTexture(flavour);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flavour.id, flavour.bodyColor, flavour.labelColor, flavour.accentColor, flavour.tagline, flavour.name]);

  const profile = useMemo(() => buildCanProfile(), []);

  const silverMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C8C8C8", metalness: 0.99, roughness: 0.04, envMapIntensity: 5,
  }), []);

  const labelMat = useMemo(() => {
    if (!labelTex) return new THREE.MeshStandardMaterial({ color: flavour.bodyColor });
    return new THREE.MeshStandardMaterial({
      map: labelTex, metalness: 0.65, roughness: 0.3, envMapIntensity: 1.8,
    });
  }, [labelTex, flavour.bodyColor]);

  const bottomMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#999", metalness: 0.95, roughness: 0.1, envMapIntensity: 3,
  }), []);

  const droplets = useMemo<[number, number, number][]>(() =>
    Array.from({ length: 10 }, () => {
      const a = Math.random() * Math.PI * 2;
      return [Math.cos(a) * 0.468, (Math.random() - 0.5) * 2.0, Math.sin(a) * 0.468];
    }), []);

  // Pulse glow rings
  useFrame(({ clock }) => {
    if (!topRef.current) return;
    (topRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.sin(clock.getElapsedTime() * 2.2) * 0.25;
  });

  return (
    <group ref={bodyRef}>
      {/* Main lathe body */}
      <mesh material={labelMat} castShadow receiveShadow>
        <latheGeometry args={[profile, 128]} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.30, 0]} material={silverMat}>
        <circleGeometry args={[0.25, 64]} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.30, 0]} rotation={[Math.PI, 0, 0]} material={bottomMat}>
        <circleGeometry args={[0.21, 64]} />
      </mesh>

      {/* Pull tab */}
      <mesh position={[0.10, 1.33, 0]} material={silverMat}>
        <torusGeometry args={[0.042, 0.009, 7, 22]} />
      </mesh>

      {/* Top accent ring */}
      <mesh ref={topRef} position={[0, 0.96, 0]}>
        <torusGeometry args={[0.445, 0.006, 7, 64]} />
        <meshStandardMaterial color={flavour.accentColor}
          emissive={new THREE.Color(flavour.accentColor)} emissiveIntensity={0.5}
          metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bottom accent ring */}
      <mesh position={[0, -0.96, 0]}>
        <torusGeometry args={[0.445, 0.006, 7, 64]} />
        <meshStandardMaterial color={flavour.accentColor}
          emissive={new THREE.Color(flavour.accentColor)} emissiveIntensity={0.4}
          metalness={0.9} roughness={0.1} />
      </mesh>

      {droplets.map((pos, i) => <WaterDroplet key={i} position={pos} />)}
    </group>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export interface VyroCanProps {
  flavour: Flavour;
  rotationSpeed?: number;
  showParticles?: boolean;
  scale?: number;
  allowDrag?: boolean;
}

export default function VyroCan({
  flavour,
  rotationSpeed = 0.35,
  showParticles = true,
  scale = 1,
  allowDrag = true,
}: VyroCanProps) {
  // Rotation is driven entirely in useFrame on this group — no prop passing
  const canRef     = useRef<THREE.Group>(null);
  const { gl, size } = useThree();

  const isDragging = useRef(false);
  const lastX      = useRef(0);
  const rotY       = useRef(0);   // accumulated total rotation
  const bobT       = useRef(0);

  useEffect(() => {
    if (!allowDrag) return;
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastX.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      // sensitivity: half-drag across canvas = 180°
      rotY.current += (dx / size.width) * Math.PI * 2.5;
    };
    const onUp = () => { isDragging.current = false; };

    el.addEventListener("pointerdown",  onDown);
    el.addEventListener("pointermove",  onMove);
    el.addEventListener("pointerup",    onUp);
    el.addEventListener("pointercancel",onUp);
    return () => {
      el.removeEventListener("pointerdown",  onDown);
      el.removeEventListener("pointermove",  onMove);
      el.removeEventListener("pointerup",    onUp);
      el.removeEventListener("pointercancel",onUp);
    };
  }, [allowDrag, gl.domElement, size.width]);

  useFrame((_, delta) => {
    if (!canRef.current) return;
    // Auto-spin when not dragging
    if (!isDragging.current) rotY.current += rotationSpeed * delta;
    bobT.current += delta;
    canRef.current.rotation.y = rotY.current;
    canRef.current.position.y = Math.sin(bobT.current * 0.7) * 0.06;
  });

  return (
    <group scale={scale}>
      {/* Gentle float wrapper (no rotation applied here) */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.15}>
        <group ref={canRef}>
          <CanBody flavour={flavour} />
        </group>
      </Float>

      {showParticles && (
        <>
          <EnergyParticles color={flavour.particleColor} />
          <GlowRing color={flavour.glowColor} />
        </>
      )}

      <pointLight position={[2.5, 2, 2.5]}   color="#ffffff"            intensity={8}  distance={10} />
      <pointLight position={[-2.5, 0.5, 1.5]} color={flavour.glowColor}  intensity={5}  distance={9}  />
      <pointLight position={[0, -1.5, -2.5]}  color={flavour.accentColor} intensity={3} distance={6}  />
      <spotLight position={[0, 6, 1]} angle={0.28} penumbra={0.9}
        intensity={25} color="#ffffff" castShadow />
      <Environment preset="studio" />
    </group>
  );
}
