"use client";

import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = visible || reducedMotion;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        clipPath: shown ? "inset(0 0 0% 0)" : "inset(0 0 12% 0)",
        transition:
          "opacity var(--dur-reveal) var(--ease-out), transform var(--dur-reveal) var(--ease-out), clip-path var(--dur-reveal) var(--ease-out)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
