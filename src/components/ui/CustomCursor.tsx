"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Never show custom cursor on admin pages
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;
    let visible = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Use document-level listener — fires even over canvas / iframes
    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current)  dotRef.current.style.opacity  = "1";
        if (ringRef.current) ringRef.current.style.opacity = "0.7";
      }
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current)  dotRef.current.style.opacity  = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onEnterInteractive = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "52px";
        ringRef.current.style.height = "52px";
        ringRef.current.style.borderColor = "rgba(255,215,0,0.8)";
      }
    };
    const onLeaveInteractive = () => {
      if (ringRef.current) {
        ringRef.current.style.width  = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.borderColor = "rgba(212,175,55,0.7)";
      }
    };

    const animate = () => {
      ringX = lerp(ringX, dotX, 0.13);
      ringY = lerp(ringY, dotY, 0.13);
      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top  = `${dotY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top  = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    // Attach interactive listeners to the entire document (not just current elements)
    const onInteractiveMouseEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.matches("a, button, [role='button'], input, select, textarea, label")) {
        onEnterInteractive();
      }
    };
    const onInteractiveMouseLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.matches("a, button, [role='button'], input, select, textarea, label")) {
        onLeaveInteractive();
      }
    };

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseover",  onInteractiveMouseEnter, { passive: true });
    document.addEventListener("mouseout",   onInteractiveMouseLeave, { passive: true });

    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover",  onInteractiveMouseEnter);
      document.removeEventListener("mouseout",   onInteractiveMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 8, height: 8,
          background: "#FFD700",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.2s",
          mixBlendMode: "difference",
          willChange: "left, top",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 36, height: 36,
          border: "1.5px solid rgba(212,175,55,0.7)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999998,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s, border-color 0.2s",
          willChange: "left, top",
        }}
      />
    </>
  );
}
