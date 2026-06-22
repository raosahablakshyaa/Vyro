import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VYRO — Fuel Focus. Power Performance.",
  description:
    "VYRO is the next-generation premium energy drink engineered for gamers, athletes, runners, and hustlers. Experience peak performance.",
  keywords: ["VYRO", "energy drink", "premium", "performance", "gaming", "athlete"],
  openGraph: {
    title: "VYRO — Fuel Focus. Power Performance.",
    description: "The world's most advanced energy drink.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable}`}
    >
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
