import type { Metadata } from "next";
import ParticleField from "./ParticleField";

export const metadata: Metadata = {
  title: "Particles Preview — Ardvix",
  robots: {
    index: false,
    follow: false,
  },
};

/** Dev-only prototype for the "chaos organizes into the arrow" hero
 * metaphor. Not linked from anywhere, not indexed. The live hero is
 * untouched until this is reviewed and approved. */
export default function ParticlesPreviewPage() {
  return (
    <main className="fixed inset-0 bg-obsidian overflow-hidden">
      <ParticleField />
    </main>
  );
}
