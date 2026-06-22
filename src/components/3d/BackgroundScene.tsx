"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DustParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      speeds[i] = 0.002 + Math.random() * 0.004;
    }
    return { positions, speeds };
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      (pos.array as Float32Array)[i * 3 + 1] += speeds[i];
      if ((pos.array as Float32Array)[i * 3 + 1] > 10)
        (pos.array as Float32Array)[i * 3 + 1] = -10;
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#D4AF37" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function LightTrails() {
  const count = 20;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const trails = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 24,
    y: (Math.random() - 0.5) * 14,
    z: -8 - Math.random() * 4,
    length: 0.5 + Math.random() * 2,
    speed: 0.02 + Math.random() * 0.04,
    color: i % 3 === 0 ? "#D4AF37" : i % 3 === 1 ? "#00D4FF" : "#8B00FF",
    angle: Math.random() * Math.PI * 2,
    offset: Math.random() * 100,
  })), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    trails.forEach((trail, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.x = trail.x + Math.sin(t * trail.speed + trail.offset) * 3;
      mesh.position.y = trail.y + Math.cos(t * trail.speed * 0.7 + trail.offset) * 2;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.abs(Math.sin(t * trail.speed + trail.offset)) * 0.35;
    });
  });
  return (
    <>
      {trails.map((trail, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={[trail.x, trail.y, trail.z]} rotation={[0, 0, trail.angle]}>
          <planeGeometry args={[0.015, trail.length]} />
          <meshBasicMaterial color={trail.color} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

function EnergyWaves() {
  const rings = useMemo(() => Array.from({ length: 4 }, (_, i) => ({ offset: (i / 4) * Math.PI * 2, color: i % 2 === 0 ? "#D4AF37" : "#00D4FF" })), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    rings.forEach((ring, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const phase = (t * 0.4 + ring.offset) % (Math.PI * 2);
      const scale = 1 + (phase / (Math.PI * 2)) * 5;
      mesh.scale.set(scale, scale, scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.4 * (1 - phase / (Math.PI * 2)));
    });
  });
  return (
    <>
      {rings.map((ring, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, -2]}>
          <ringGeometry args={[0.8, 0.85, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function GridFloor() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.07 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[40, 40, 30, 30]} />
      <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.07} depthWrite={false} />
    </mesh>
  );
}

export default function BackgroundScene() {
  return (
    <>
      <DustParticles />
      <LightTrails />
      <EnergyWaves />
      <GridFloor />
      <ambientLight intensity={0.15} color="#0a0a1a" />
      <pointLight position={[0, 0, -10]} color="#3a0060" intensity={2} distance={20} />
    </>
  );
}
