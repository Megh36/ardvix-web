"use client";

import Reveal from "@/components/Reveal";

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.5 8.8c.2-.5.4-.5.6-.5h.5c.15 0 .35 0 .5.4.2.5.6 1.5.65 1.6.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.3-.15.6.15.3.7 1.2 1.5 1.9.9.8 1.6 1 1.9 1.15.3.15.5.1.65-.05.15-.15.65-.75.8-1 .15-.25.3-.2.5-.1.2.05 1.3.6 1.5.7.2.1.35.15.4.25.05.1.05.6-.15 1.15-.2.55-1.15 1.05-1.6 1.1-.4.05-.9.1-2.9-.6-2.45-.9-4-3.4-4.15-3.6-.15-.2-1.2-1.6-1.2-3 0-1.4.75-2.1.9-2.35Z" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section
      id="book"
      className="relative min-h-screen flex items-center px-6 py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(232, 84, 29, 0.08), transparent 60%), radial-gradient(circle at 70% 60%, rgba(171, 184, 204, 0.05), transparent 60%)",
        }}
      />

      <div className="max-w-4xl mx-auto w-full text-center">
        <Reveal>
          <div>
            <p className="font-mono text-copper text-sm tracking-widest mb-6">
              {"// LET'S BUILD"}
            </p>

            <h2 className="font-sans font-medium text-5xl md:text-7xl leading-[1.02] tracking-tight">
              Let&apos;s automate the busywork.
            </h2>

            <p className="text-steel-mist text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
              One call. We look at your business, show you what&apos;s
              leaking, and tell you if we can help. No pitch, no retainer, no
              obligation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a
                href="#"
                className="cta-pulse-primary bg-copper text-obsidian font-medium px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Book a free audit
              </a>
              <a
                href="#"
                className="cta-pulse-secondary border border-copper text-copper font-medium px-8 py-4 rounded-full flex items-center gap-2 hover:bg-copper/10 transition-colors"
              >
                <WhatsAppIcon />
                Message us on WhatsApp
              </a>
            </div>

            <p className="font-mono text-copper text-xs tracking-widest mt-10">
              {"// No retainers until the system works."}
            </p>
          </div>
        </Reveal>

        <div className="mt-20 overflow-hidden border-y border-steel-mist/10 py-4">
          <div className="flex gap-12 whitespace-nowrap animate-marquee-slow font-mono text-steel-mist text-sm">
            {Array(3)
              .fill(
                "real estate · solar · clinics · dental · edtech · d2c · logistics · agencies"
              )
              .map((t, i) => (
                <span key={i}>{t}</span>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-slow {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(232, 84, 29, 0.22);
          }
          50% {
            box-shadow: 0 0 22px 4px rgba(232, 84, 29, 0.22);
          }
        }
        .cta-pulse-primary,
        .cta-pulse-secondary {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
