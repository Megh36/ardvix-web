"use client";

import Reveal from "@/components/Reveal";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background gradient — placeholder for particles */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(232, 84, 29, 0.08), transparent 60%), radial-gradient(circle at 70% 60%, rgba(171, 184, 204, 0.05), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <Reveal>
          <div>
            <p className="font-mono text-copper text-sm tracking-widest mb-6">
              {"// AI AUTOMATION SYSTEMS"}
            </p>

            <h1 className="font-sans font-medium text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl">
              Your business,
              <br />
              on autopilot.
            </h1>

            <p className="text-steel-mist text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              We build AI voice agents, WhatsApp automations, and workflow
              systems for real estate, solar, and clinics — so leads never
              leak and Sundays stay yours.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <a
                href="#book"
                className="bg-copper text-obsidian font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                Book a free automation audit
              </a>
              <a
                href="#services"
                className="border border-steel-mist/30 text-paper px-6 py-3 rounded-full hover:border-paper transition-colors"
              >
                See the systems ↓
              </a>
            </div>
          </div>
        </Reveal>

        {/* Ticker */}
        <div className="mt-20 overflow-hidden border-y border-steel-mist/10 py-4">
          <div className="flex gap-12 whitespace-nowrap animate-marquee font-mono text-copper text-sm">
            {Array(3)
              .fill(
                "leads captured · calls answered · hours saved · appointments booked · follow-ups sent · reports generated"
              )
              .map((t, i) => (
                <span key={i}>{t}</span>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}