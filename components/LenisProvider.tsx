"use client";

import { useEffect } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Deferred to idle time (setTimeout fallback for browsers without
    // requestIdleCallback, e.g. Safari): several other sections' effects
    // (the pipeline diagram's ScrollTrigger pin + getTotalLength()
    // measurements, etc.) already compete for the main thread right after
    // hydration, which was measurably delaying first paint. Lenis starting
    // a beat later is imperceptible to users but frees that window up.
    const ric =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    const idleHandle = ric(() => {
      if (cancelled) return;

      // loaded dynamically so gsap/ScrollTrigger/lenis (~50kb) aren't part of
      // the critical initial bundle needed for first paint
      Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        cleanup = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });
    });

    return () => {
      cancelled = true;
      cleanup?.();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle as number);
      else window.clearTimeout(idleHandle as number);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
