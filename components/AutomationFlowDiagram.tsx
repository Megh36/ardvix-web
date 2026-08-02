"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  MessageSquare,
  Phone,
  MessageCircle,
  Database,
  Calendar,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";
import type { CircuitNodeType, CircuitConnection } from "@/components/ui/circuit-board";

// motion/react is already loaded for Hero's scramble effect; this reuses
// the same shared chunk rather than adding new weight. Still code-split
// (ssr:true, matching the Verticals mock pattern) since it's well below
// the fold and there's nothing to gain from having it in the initial bundle.
const CircuitBoard = dynamic(
  () => import("@/components/ui/circuit-board").then((mod) => mod.CircuitBoard),
  { ssr: true, loading: () => null }
);

type FlowStatus = "active" | "processing";

const FLOW_STEPS: {
  id: string;
  x: number;
  y: number;
  label: string;
  icon: LucideIcon;
  status: FlowStatus;
}[] = [
  { id: "lead", x: 60, y: 200, label: "Enquiry", icon: MessageSquare, status: "active" },
  { id: "voice", x: 250, y: 90, label: "AI Voice Agent", icon: Phone, status: "processing" },
  // y:205 not 200 — sharing lead's exact y made calculatePath's horizontal
  // branch in circuit-board.tsx emit a zero-length "V" segment (dy=0),
  // which broke the pulse's dash sweep at that path's midpoint. The 5px
  // offset is imperceptible but keeps dy nonzero.
  { id: "whatsapp", x: 250, y: 205, label: "WhatsApp", icon: MessageCircle, status: "active" },
  { id: "crm", x: 250, y: 310, label: "CRM Sync", icon: Database, status: "active" },
  { id: "book", x: 440, y: 145, label: "Booked", icon: Calendar, status: "active" },
  { id: "followup", x: 440, y: 255, label: "Follow-Up", icon: Repeat, status: "processing" },
];

const FLOW_CONNECTIONS: { from: string; to: string; bidirectional?: boolean }[] = [
  { from: "lead", to: "voice" },
  { from: "lead", to: "whatsapp" },
  { from: "lead", to: "crm" },
  { from: "voice", to: "book" },
  { from: "whatsapp", to: "book" },
  { from: "crm", to: "followup" },
  { from: "book", to: "followup", bidirectional: true },
];

// getStatusColor's status-based branches inside circuit-board.tsx are
// hardcoded to grey regardless of the nodeColor/traceColor props passed
// in — the only lever left without touching that file is overriding color
// on our own icon wrapper, which wins over the ambient inherited color set
// by the node's own div (see brief: "wrap node icons in a span with
// text-copper for active status").
function buildIcon(Icon: LucideIcon, status: FlowStatus) {
  const icon = <Icon size={18} strokeWidth={2} />;
  return status === "active" ? <span className="text-copper">{icon}</span> : icon;
}

const circuitNodes: CircuitNodeType[] = FLOW_STEPS.map((step) => ({
  id: step.id,
  x: step.x,
  y: step.y,
  label: step.label,
  status: step.status,
  size: "md",
  icon: buildIcon(step.icon, step.status),
}));

const circuitConnections: CircuitConnection[] = FLOW_CONNECTIONS.map((c) => ({
  from: c.from,
  to: c.to,
  animated: true,
  bidirectional: c.bidirectional,
}));

const DIAGRAM_ARIA_LABEL =
  "Diagram showing the Ardvix automation flow from lead capture to follow-up";

// SSR-safe: server and first client paint both assume "not desktop", so
// hydration never mismatches. If the real viewport turns out to be desktop,
// this flips shortly after mount and swaps to the animated diagram — since
// the section sits below the fold inside a Reveal (opacity:0 until scrolled
// into view), that swap resolves well before a user could ever see it.
function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia("(min-width: 640px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 640px)").matches;
}
function getDesktopServerSnapshot() {
  return false;
}
function useIsDesktopViewport() {
  return useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getDesktopServerSnapshot);
}

// Fixed-size (600x400) diagram scaled to fit its container via a measured
// transform rather than swapping to a second hardcoded tablet size — this
// covers the full desktop-to-tablet range with one code path.
function ScaledCircuitBoard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setScale(Math.min(1, w / 600));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full" style={{ height: 400 * scale }}>
      <div style={{ width: 600, height: 400, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <CircuitBoard
          nodes={circuitNodes}
          connections={circuitConnections}
          width={600}
          height={400}
          variant="dark"
          traceColor="rgba(171, 184, 204, 0.25)"
          pulseColor="#E8541D"
          nodeColor="rgba(171, 184, 204, 0.5)"
          gridColor="rgba(171, 184, 204, 0.06)"
          pulseSpeed={2.5}
          traceWidth={2}
          role="img"
          aria-label={DIAGRAM_ARIA_LABEL}
        />
      </div>
    </div>
  );
}

// Static fallback shared by mobile (<640px, per brief 5b — a 375px screen
// can't fit 600px of horizontal circuit clearly) and prefers-reduced-motion
// (any width). Since circuit-board.tsx's animations (node scale-in, pulse
// overlays) can't be disabled from outside without touching its internals,
// a plain static list is the only way to fully honor "no pulses, all nodes
// in final state" without modifying the reference component.
function StaticFlowList() {
  return (
    <div
      role="img"
      aria-label={DIAGRAM_ARIA_LABEL}
      className="max-w-sm mx-auto py-4"
    >
      {FLOW_STEPS.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === FLOW_STEPS.length - 1;
        return (
          <div key={step.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-px bg-copper/30" />
            )}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg border shrink-0 ${
                step.status === "active"
                  ? "border-copper text-copper"
                  : "border-[rgba(171,184,204,0.3)] text-steel-mist"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="pt-2">
              <p className="font-sans font-medium text-paper">{step.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AutomationFlowDiagram() {
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktopViewport();
  const showCircuit = isDesktop && !reducedMotion;

  return showCircuit ? <ScaledCircuitBoard /> : <StaticFlowList />;
}
