"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

// The motion package (used internally by special-text.tsx for useInView)
// added ~2.5s of main-thread script execution when mounted immediately —
// directly in the hero's critical path, the worst possible place for it.
// Code-splitting alone (next/dynamic with ssr:true) didn't help: the chunk
// still loads eagerly because the component would render on first paint
// regardless. The actual fix is deferring *when* it mounts at all — see
// the requestIdleCallback gate below, same approach already used for
// Lenis. ssr:false because this now only ever mounts client-side, later.
const SpecialText = dynamic(
  () => import("@/components/ui/special-text").then((mod) => mod.SpecialText),
  { ssr: false, loading: () => null }
);

// Fixed widths (not min-width) so the box never resizes as scrambled
// characters of varying glyph width cycle through — measured from the
// actual rendered text at each breakpoint, plus a safety margin. Also
// used by the plain-text placeholder below (identical classes on both),
// so swapping placeholder -> SpecialText at the idle-callback moment is
// pixel-for-pixel invariant — the first attempt only matched the box
// sizing on the animated side and measured CLS 0.045 from that swap.
const LINE1_SIZING =
  "w-[330px] md:w-[490px] lg:w-[645px] min-h-[45.6px] md:min-h-[68.4px] lg:min-h-[91.2px]";
const LINE2_SIZING =
  "w-[285px] md:w-[415px] lg:w-[550px] min-h-[45.6px] md:min-h-[68.4px] lg:min-h-[91.2px]";

const HEADLINE_TYPOGRAPHY =
  "!font-sans font-medium text-5xl md:text-7xl lg:text-8xl tracking-tight";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [scrambleReady, setScrambleReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    // The plain, correct headline is already visible immediately (below) —
    // this just swaps in the scramble effect once the browser is idle,
    // well before the site's own ~1.5s preloader dismisses, so real users
    // never perceive the delay.
    //
    // The chunk is imported here (not just left to next/dynamic) and state
    // only flips once it resolves — otherwise next/dynamic briefly renders
    // its loading() (null) for the frame before the chunk finishes fetching,
    // collapsing the h1 line and popping it back once mounted, which showed
    // up as a real (measured) layout shift on the whole hero container.
    const ric =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = ric(() => {
      import("@/components/ui/special-text").then(() => setScrambleReady(true));
    });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, [reducedMotion]);

  const showScramble = !reducedMotion && scrambleReady;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Background gradient — placeholder for particles */}
      <div className="absolute inset-0 -z-10 hero-glow" />

      <div className="max-w-7xl mx-auto w-full">
        <div>
          <p className="font-mono text-copper text-sm tracking-widest mb-6">
            {"// AI AUTOMATION SYSTEMS"}
          </p>

          <h1
            id="hero-heading"
            aria-label={showScramble ? "Your business, on autopilot." : undefined}
            className="font-sans font-medium text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl h-24 md:h-36 lg:h-48 overflow-hidden"
          >
            <span aria-hidden={showScramble || undefined}>
              {showScramble ? (
                <SpecialText
                  speed={18}
                  delay={0}
                  inView={false}
                  once={true}
                  className={`${HEADLINE_TYPOGRAPHY} ${LINE1_SIZING}`}
                >
                  Your business,
                </SpecialText>
              ) : (
                <span
                  className={`${HEADLINE_TYPOGRAPHY} ${LINE1_SIZING} inline-flex items-center`}
                >
                  Your business,
                </span>
              )}
              <br />
              {showScramble ? (
                <SpecialText
                  speed={18}
                  delay={0.15}
                  inView={false}
                  once={true}
                  className={`${HEADLINE_TYPOGRAPHY} ${LINE2_SIZING}`}
                >
                  on autopilot.
                </SpecialText>
              ) : (
                <span
                  className={`${HEADLINE_TYPOGRAPHY} ${LINE2_SIZING} inline-flex items-center`}
                >
                  on autopilot.
                </span>
              )}
            </span>
          </h1>

          <p className="text-steel-mist text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            We build AI voice agents, WhatsApp automations, and workflow
            systems for real estate, solar, and clinics — so leads never
            leak and Sundays stay yours.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="mailto:hello@ardvix.com?subject=Free%20Automation%20Audit%20Request&body=Hi%20Ardvix%2C%20I%27d%20like%20to%20book%20a%20free%20automation%20audit%20for%20my%20business."
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

        {/* Ticker — decorative, repeats the same text 3x for the loop */}
        <div
          aria-hidden="true"
          className="mt-20 overflow-hidden border-y border-steel-mist/10 py-4"
        >
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
    </section>
  );
}
