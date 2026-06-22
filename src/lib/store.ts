import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Flavour definition ────────────────────────────────────────────────────────
export interface Flavour {
  id: string;
  name: string;
  tagline: string;
  bodyColor: string;       // main can body colour
  accentColor: string;     // top/bottom stripe colour
  labelColor: string;      // VYRO text colour on can
  glowColor: string;       // particle + glow colour
  particleColor: string;
  bgGradient: string;      // hero background for this flavour
  available: boolean;
  badge?: string;          // e.g. "NEW", "LIMITED"
  caffeine: number;        // mg
  calories: number;
  volume: number;          // ml
}

// ─── Site content ──────────────────────────────────────────────────────────────
export interface SiteContent {
  heroHeadline: string;
  heroSubline: string;
  heroDescription: string;
  ctaPrimary: string;
  ctaSecondary: string;
  brandTagline: string;
  launchHeadline: string;
}

// ─── Store shape ───────────────────────────────────────────────────────────────
interface VyroStore {
  flavours: Flavour[];
  activeFlavourId: string;
  content: SiteContent;
  showParticles: boolean;
  canRotationSpeed: number;

  // Actions
  setActiveFlavour: (id: string) => void;
  addFlavour: (f: Flavour) => void;
  updateFlavour: (id: string, patch: Partial<Flavour>) => void;
  deleteFlavour: (id: string) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
  setShowParticles: (v: boolean) => void;
  setCanRotationSpeed: (v: number) => void;
}

// ─── Default flavours ──────────────────────────────────────────────────────────
const DEFAULT_FLAVOURS: Flavour[] = [
  {
    id: "original-gold",
    name: "Original Gold",
    tagline: "The one that started it all",
    bodyColor: "#111111",
    accentColor: "#D4AF37",
    labelColor: "#FFD700",
    glowColor: "#FFD700",
    particleColor: "#D4AF37",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0e00 0%, #000000 70%)",
    available: true,
    caffeine: 150,
    calories: 10,
    volume: 330,
  },
  {
    id: "arctic-blue",
    name: "Arctic Blue",
    tagline: "Ice-cold focus, zero limits",
    bodyColor: "#040d1a",
    accentColor: "#00D4FF",
    labelColor: "#00D4FF",
    glowColor: "#00D4FF",
    particleColor: "#00AAFF",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #00101a 0%, #000000 70%)",
    available: true,
    badge: "NEW",
    caffeine: 150,
    calories: 5,
    volume: 330,
  },
  {
    id: "berry-storm",
    name: "Berry Storm",
    tagline: "Wild berry surge. Pure power.",
    bodyColor: "#120010",
    accentColor: "#8B00FF",
    labelColor: "#CC44FF",
    glowColor: "#8B00FF",
    particleColor: "#AA22FF",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #0e001a 0%, #000000 70%)",
    available: true,
    badge: "NEW",
    caffeine: 150,
    calories: 10,
    volume: 330,
  },
  {
    id: "citrus-blast",
    name: "Citrus Blast",
    tagline: "Explosive citrus. Instant ignition.",
    bodyColor: "#141000",
    accentColor: "#FF6B00",
    labelColor: "#FF8C00",
    glowColor: "#FF6B00",
    particleColor: "#FF8C00",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0800 0%, #000000 70%)",
    available: true,
    caffeine: 150,
    calories: 15,
    volume: 330,
  },
  {
    id: "jungle-green",
    name: "Jungle Green",
    tagline: "Natural. Raw. Unstoppable.",
    bodyColor: "#001a08",
    accentColor: "#00FF88",
    labelColor: "#00FF88",
    glowColor: "#00FF88",
    particleColor: "#00CC66",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #001a08 0%, #000000 70%)",
    available: false,
    badge: "COMING SOON",
    caffeine: 150,
    calories: 5,
    volume: 330,
  },
  {
    id: "cherry-red",
    name: "Cherry Red",
    tagline: "Bold cherry. Relentless drive.",
    bodyColor: "#1a0005",
    accentColor: "#FF2D55",
    labelColor: "#FF2D55",
    glowColor: "#FF2D55",
    particleColor: "#FF0044",
    bgGradient: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0008 0%, #000000 70%)",
    available: false,
    badge: "COMING SOON",
    caffeine: 150,
    calories: 10,
    volume: 500,
  },
];

const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: "VYRO",
  heroSubline: "FUEL FOCUS. POWER PERFORMANCE.",
  heroDescription:
    "Engineered for gamers, athletes, runners, and hustlers. Premium-grade ingredients. Zero compromise.",
  ctaPrimary: "Join The Launch",
  ctaSecondary: "Explore",
  brandTagline: "⚡ Next-Gen Energy",
  launchHeadline: "Fuel Focus. Power Performance. Become VYRO.",
};

// ─── Zustand store ─────────────────────────────────────────────────────────────
export const useVyroStore = create<VyroStore>()(
  persist(
    (set) => ({
      flavours: DEFAULT_FLAVOURS,
      activeFlavourId: "original-gold",
      content: DEFAULT_CONTENT,
      showParticles: true,
      canRotationSpeed: 0.35,

      setActiveFlavour: (id) => set({ activeFlavourId: id }),

      addFlavour: (f) =>
        set((s) => ({ flavours: [...s.flavours, f] })),

      updateFlavour: (id, patch) =>
        set((s) => ({
          flavours: s.flavours.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),

      deleteFlavour: (id) =>
        set((s) => ({
          flavours: s.flavours.filter((f) => f.id !== id),
          activeFlavourId:
            s.activeFlavourId === id
              ? (s.flavours.find((f) => f.id !== id)?.id ?? "original-gold")
              : s.activeFlavourId,
        })),

      updateContent: (patch) =>
        set((s) => ({ content: { ...s.content, ...patch } })),

      setShowParticles: (v) => set({ showParticles: v }),
      setCanRotationSpeed: (v) => set({ canRotationSpeed: v }),
    }),
    { name: "vyro-admin-store" }
  )
);

// ─── Convenience selector ──────────────────────────────────────────────────────
export const useActiveFlavour = () => {
  const { flavours, activeFlavourId } = useVyroStore();
  return flavours.find((f) => f.id === activeFlavourId) ?? flavours[0];
};
