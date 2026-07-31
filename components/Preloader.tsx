"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

function subscribeNoop() {
  return () => {};
}

function getVisitedSnapshot() {
  return sessionStorage.getItem("ardvix-visited") === "true";
}

function getVisitedServerSnapshot() {
  return false;
}

export default function Preloader() {
  const alreadyVisited = useSyncExternalStore(
    subscribeNoop,
    getVisitedSnapshot,
    getVisitedServerSnapshot
  );
  const reducedMotion = usePrefersReducedMotion();
  const shouldSkip = alreadyVisited || reducedMotion;

  const [pct, setPct] = useState("initializing systems…");
  const [pathLength, setPathLength] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [fillIn, setFillIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (shouldSkip) {
      if (!alreadyVisited) {
        sessionStorage.setItem("ardvix-visited", "true");
      }
      return;
    }

    const raf = requestAnimationFrame(() => {
      if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
      setDrawn(true);
    });

    const timers = [
      setTimeout(() => setPct("42%"), 250),
      setTimeout(() => setPct("88%"), 500),
      setTimeout(() => setPct("100%"), 750),
      setTimeout(() => setFillIn(true), 700),
      setTimeout(() => setFadeOut(true), 1200),
      setTimeout(() => {
        sessionStorage.setItem("ardvix-visited", "true");
        setDone(true);
      }, 1500),
    ];

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [shouldSkip, alreadyVisited]);

  if (shouldSkip || done) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6"
      style={{
        zIndex: 100,
        backgroundColor: "var(--obsidian)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 300ms ease-out",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <svg width="64" height="64" viewBox="0 0 24 24">
        <path
          ref={pathRef}
          d="M12 3.34 L22 20.66 L2 20.66 Z M12 9.34 L16.8 17.66 L13.5 17.66 L13.5 20.66 L10.5 20.66 L10.5 17.66 L7.2 17.66 Z"
          fillRule="evenodd"
          fill="var(--copper)"
          stroke="var(--copper)"
          strokeWidth="0.5"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: drawn ? 0 : pathLength,
            fillOpacity: fillIn ? 1 : 0,
            strokeOpacity: fillIn ? 0 : 1,
            transition:
              "stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1), fill-opacity 300ms ease-out, stroke-opacity 300ms ease-out",
          }}
        />
      </svg>
      <p className="font-mono text-copper text-xs tracking-widest">{pct}</p>
    </div>
  );
}
