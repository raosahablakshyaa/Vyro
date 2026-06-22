"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CustomCursor from "@/components/ui/CustomCursor";
import {
  IngredientsSection,
  SocialProof,
  ResearchForm,
  PreOrderSection,
  LaunchSection,
} from "@/components/sections/FinalSections";

// Three.js / Canvas components must be client-only (ssr: false)
// Per Next.js 16 docs: ssr: false is only valid inside Client Components
const HeroSection = dynamic(
  () => import("@/components/sections/HeroSection"),
  { ssr: false }
);

const FlavorShowcase = dynamic(
  () => import("@/components/sections/FlavorShowcase"),
  { ssr: false }
);

const PerformanceJourney = dynamic(
  () => import("@/components/sections/PerformanceJourney"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <main>
        {/* Hero — 3D can with active flavour, parallax, CTAs */}
        <HeroSection />

        {/* Flavour swiper — all flavours with 360° rotating can */}
        <FlavorShowcase />

        {/* Cinematic performance scenes */}
        <PerformanceJourney />

        {/* Ingredient cards */}
        <IngredientsSection />

        {/* Social proof counters + testimonials */}
        <SocialProof />

        {/* Market research form */}
        <ResearchForm />

        {/* Pre-order + Be a Partner */}
        <PreOrderSection />

        {/* Final launch CTA + footer */}
        <LaunchSection />
      </main>
    </>
  );
}
