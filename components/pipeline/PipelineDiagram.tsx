"use client";

import { useRef, type RefObject } from "react";

const STEEL_MIST = "#ABB8CC";
const COPPER = "#E8541D";

export const SOURCE_NODES = [
  { id: "whatsapp", label: "WHATSAPP", x: 140, y: 200, labelX: 124, labelY: 204, anchor: "end" },
  { id: "missed-call", label: "MISSED CALL", x: 125, y: 370, labelX: 109, labelY: 374, anchor: "end" },
  { id: "web-form", label: "WEB FORM", x: 285, y: 110, labelX: 285, labelY: 92, anchor: "middle" },
  { id: "meta-ad", label: "META AD", x: 255, y: 485, labelX: 255, labelY: 507, anchor: "middle" },
  { id: "walk-in", label: "WALK-IN", x: 420, y: 445, labelX: 436, labelY: 449, anchor: "start" },
] as const;

export const CENTER = { x: 300, y: 300 };
export const ARROW_D =
  "M12 3.34 L22 20.66 L2 20.66 Z M12 9.34 L16.8 17.66 L13.5 17.66 L13.5 20.66 L10.5 20.66 L10.5 17.66 L7.2 17.66 Z";

export const STATE2_LABELS = [
  { text: "AUTO-REPLY < 30s", x: 440, y: 250 },
  { text: "CRM SYNC", x: 440, y: 300 },
  { text: "VOICE AGENT ANSWERS", x: 440, y: 350 },
] as const;

export const STREAM_PATHS = [
  "M 285 250 C 320 180, 380 160, 430 190",
  "M 300 240 C 340 170, 390 150, 430 185",
  "M 315 250 C 350 185, 395 165, 430 195",
] as const;

export const CHART_POINTS = "430,190 460,160 480,170 510,120 540,100 560,70";

export type PipelineRefs = {
  nodeGroupRefs: RefObject<SVGGElement | null>[];
  lineRefs: RefObject<SVGLineElement | null>[];
  arrowPathRef: RefObject<SVGPathElement | null>;
  pulseGroupRef: RefObject<SVGGElement | null>;
  state2LabelRefs: RefObject<SVGTextElement | null>[];
  streamPathRefs: RefObject<SVGPathElement | null>[];
  chartPolylineRef: RefObject<SVGPolylineElement | null>;
  chart4hrsRef: RefObject<SVGTextElement | null>;
  chart30secRef: RefObject<SVGTextElement | null>;
  chartPercentRef: RefObject<SVGTextElement | null>;
  chartPercentLabelRef: RefObject<SVGTextElement | null>;
};

export function usePipelineRefs(): PipelineRefs {
  const nodeGroupRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];
  const lineRefs = [
    useRef<SVGLineElement>(null),
    useRef<SVGLineElement>(null),
    useRef<SVGLineElement>(null),
    useRef<SVGLineElement>(null),
    useRef<SVGLineElement>(null),
  ];
  const arrowPathRef = useRef<SVGPathElement>(null);
  const pulseGroupRef = useRef<SVGGElement>(null);
  const state2LabelRefs = [
    useRef<SVGTextElement>(null),
    useRef<SVGTextElement>(null),
    useRef<SVGTextElement>(null),
  ];
  const streamPathRefs = [
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
  ];
  const chartPolylineRef = useRef<SVGPolylineElement>(null);
  const chart4hrsRef = useRef<SVGTextElement>(null);
  const chart30secRef = useRef<SVGTextElement>(null);
  const chartPercentRef = useRef<SVGTextElement>(null);
  const chartPercentLabelRef = useRef<SVGTextElement>(null);

  return {
    nodeGroupRefs,
    lineRefs,
    arrowPathRef,
    pulseGroupRef,
    state2LabelRefs,
    streamPathRefs,
    chartPolylineRef,
    chart4hrsRef,
    chart30secRef,
    chartPercentRef,
    chartPercentLabelRef,
  };
}

export default function PipelineDiagram({
  refs,
  className = "",
}: {
  refs: PipelineRefs;
  className?: string;
}) {
  const {
    nodeGroupRefs,
    lineRefs,
    arrowPathRef,
    pulseGroupRef,
    state2LabelRefs,
    streamPathRefs,
    chartPolylineRef,
    chart4hrsRef,
    chart30secRef,
    chartPercentRef,
    chartPercentLabelRef,
  } = refs;

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* connecting lines, node -> center */}
      {SOURCE_NODES.map((node, i) => (
        <line
          key={node.id}
          id={`pipeline-line-${node.id}`}
          ref={lineRefs[i]}
          x1={node.x}
          y1={node.y}
          x2={CENTER.x}
          y2={CENTER.y}
          stroke={STEEL_MIST}
          strokeWidth={1.5}
        />
      ))}

      {/* three copper streams, arrow -> chart (state 3) */}
      {STREAM_PATHS.map((d, i) => (
        <path
          key={i}
          ref={streamPathRefs[i]}
          d={d}
          stroke={COPPER}
          strokeWidth={1.5}
          fill="none"
        />
      ))}

      {/* rising line chart (state 3) */}
      <polyline
        ref={chartPolylineRef}
        points={CHART_POINTS}
        stroke={COPPER}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* source nodes + labels (state 1) */}
      {SOURCE_NODES.map((node, i) => (
        <g key={node.id} ref={nodeGroupRefs[i]}>
          <circle cx={node.x} cy={node.y} r={8} stroke={STEEL_MIST} strokeWidth={1.5} fill="none" />
          <text
            x={node.labelX}
            y={node.labelY}
            textAnchor={node.anchor}
            fontFamily="var(--font-jetbrains)"
            fontSize={10}
            fill={STEEL_MIST}
            letterSpacing="0.05em"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* pulse dots traveling node -> arrow (state 2) */}
      <g ref={pulseGroupRef}>
        {SOURCE_NODES.map((node, i) => (
          <circle key={node.id} r={3} fill={COPPER}>
            <animateMotion
              dur="1.5s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#pipeline-line-${node.id}`} />
            </animateMotion>
          </circle>
        ))}
      </g>

      {/* ardvix arrow mark, center (state 2) */}
      <g transform={`translate(${CENTER.x} ${CENTER.y}) scale(7) translate(-12 -12)`}>
        <path
          ref={arrowPathRef}
          d={ARROW_D}
          fillRule="evenodd"
          fill={COPPER}
          stroke={COPPER}
          strokeWidth={0.5}
        />
      </g>

      {/* floating action labels (state 2) */}
      {STATE2_LABELS.map((label, i) => (
        <text
          key={label.text}
          ref={state2LabelRefs[i]}
          x={label.x}
          y={label.y}
          textAnchor="start"
          fontFamily="var(--font-jetbrains)"
          fontSize={11}
          fill={COPPER}
          letterSpacing="0.03em"
        >
          {label.text}
        </text>
      ))}

      {/* response-time counter + leads captured stat (state 3) */}
      <text
        ref={chart4hrsRef}
        x={415}
        y={225}
        textAnchor="end"
        fontFamily="var(--font-jetbrains)"
        fontSize={20}
        fill={STEEL_MIST}
      >
        4 HRS
      </text>
      <text
        x={425}
        y={225}
        textAnchor="start"
        fontFamily="var(--font-jetbrains)"
        fontSize={14}
        fill={STEEL_MIST}
      >
        →
      </text>
      <text
        ref={chart30secRef}
        x={445}
        y={225}
        textAnchor="start"
        fontFamily="var(--font-jetbrains)"
        fontSize={13}
        fill={STEEL_MIST}
      >
        30 SEC
      </text>

      <text
        ref={chartPercentRef}
        x={565}
        y={55}
        textAnchor="end"
        fontFamily="var(--font-jetbrains)"
        fontSize={26}
        fontWeight={500}
        fill={COPPER}
      >
        100%
      </text>
      <text
        ref={chartPercentLabelRef}
        x={565}
        y={40}
        textAnchor="end"
        fontFamily="var(--font-jetbrains)"
        fontSize={9}
        fill={STEEL_MIST}
        letterSpacing="0.05em"
      >
        LEADS CAPTURED
      </text>
    </svg>
  );
}
