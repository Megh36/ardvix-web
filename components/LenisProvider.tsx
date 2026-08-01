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

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
