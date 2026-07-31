"use client";

import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

export default function CountStat({
  from,
  to,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(from + (to - from) * eased));
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setValue(to);
              }
            };

            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration, reducedMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {reducedMotion ? to : value}
      {suffix}
    </span>
  );
}
