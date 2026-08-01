import { gsap } from "gsap";
import {
  SOURCE_NODES,
  STATE2_LABELS,
  type PipelineRefs,
} from "./PipelineDiagram";

const EASE = "power3.out";
const COPPER = "#E8541D";
const STEEL_MIST = "#ABB8CC";

function len(el: SVGGeometryElement | null) {
  return el ? el.getTotalLength() : 0;
}

/**
 * Builds the pipeline diagram's tweens. Total duration is 3 "step units"
 * (state1 = 0-1, state2 = 1-2, state3 = 2-3) so scroll progress (0-1 on a
 * ScrollTrigger) maps linearly onto three equal thirds.
 *
 * Pass an existing timeline via `into` to append these tweens directly onto
 * it (desktop: the same timeline that carries the scrub'd ScrollTrigger, so
 * everything shares one playhead) — nesting a separately-scrubbed child
 * timeline via `.add()` does not reliably forward playhead position in
 * every GSAP version, so callers that need scroll-scrubbed behavior should
 * always pass their own timeline in rather than nest the return value.
 * With no `into`, returns a new paused standalone timeline for manual
 * control via tl.tweenTo()/tl.progress() (mobile, reduced motion).
 */
export function buildPipelineTimeline(
  refs: PipelineRefs,
  into?: gsap.core.Timeline
): gsap.core.Timeline {
  const nodeEls = refs.nodeGroupRefs.map((r) => r.current);
  const lineEls = refs.lineRefs.map((r) => r.current);
  const streamEls = refs.streamPathRefs.map((r) => r.current);
  const labelEls = refs.state2LabelRefs.map((r) => r.current);
  const arrowEl = refs.arrowPathRef.current;
  const pulseGroupEl = refs.pulseGroupRef.current;
  const chartEl = refs.chartPolylineRef.current;
  const chart4hrsEl = refs.chart4hrsRef.current;
  const chart30secEl = refs.chart30secRef.current;
  const percentEl = refs.chartPercentRef.current;
  const percentLabelEl = refs.chartPercentLabelRef.current;

  const lineLens = lineEls.map(len);
  const streamLens = streamEls.map(len);
  const arrowLen = len(arrowEl);
  const chartLen = len(chartEl);

  // -- initial (hidden) states --
  nodeEls.forEach((el) => {
    gsap.set(el, { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" });
  });
  lineEls.forEach((el, i) => {
    gsap.set(el, { strokeDasharray: lineLens[i], strokeDashoffset: lineLens[i] });
  });
  gsap.set(arrowEl, {
    fillOpacity: 0,
    strokeOpacity: 1,
    strokeDasharray: arrowLen,
    strokeDashoffset: arrowLen,
  });
  gsap.set(pulseGroupEl, { opacity: 0 });
  labelEls.forEach((el, i) => {
    gsap.set(el, { opacity: 0, attr: { x: STATE2_LABELS[i].x - 24 } });
  });
  streamEls.forEach((el, i) => {
    gsap.set(el, { strokeDasharray: streamLens[i], strokeDashoffset: streamLens[i] });
  });
  gsap.set(chartEl, { strokeDasharray: chartLen, strokeDashoffset: chartLen });
  gsap.set(percentEl, { opacity: 0, attr: { y: 42 } });
  gsap.set(percentLabelEl, { opacity: 0, attr: { y: 71 } });

  const tl = into ?? gsap.timeline({ paused: true, defaults: { ease: EASE } });

  // -- state 1 · capture (0 -> 1): nodes + connecting lines draw in, staggered --
  SOURCE_NODES.forEach((_, i) => {
    const start = i * 0.15;
    tl.to(nodeEls[i], { opacity: 1, scale: 1, duration: 0.2 }, start);
    tl.to(lineEls[i], { strokeDashoffset: 0, duration: 0.3 }, start + 0.05);
  });

  // -- state 2 · automate (1 -> 2): arrow draws + fills, pulses travel, labels float out --
  tl.to(arrowEl, { strokeDashoffset: 0, duration: 0.35 }, 1);
  tl.to(arrowEl, { fillOpacity: 1, strokeOpacity: 0, duration: 0.2 }, 1.35);
  tl.to(pulseGroupEl, { opacity: 1, duration: 0.1 }, 1.15);
  STATE2_LABELS.forEach((label, i) => {
    tl.to(
      labelEls[i],
      { attr: { x: label.x }, opacity: 1, duration: 0.25 },
      1.4 + i * 0.15
    );
  });
  tl.to(pulseGroupEl, { opacity: 0, duration: 0.15 }, 1.85);

  // -- state 3 · grow (2 -> 3): streams -> chart draws in, counter + stat land --
  streamEls.forEach((el, i) => {
    tl.to(el, { strokeDashoffset: 0, duration: 0.3 }, 2 + i * 0.08);
  });
  tl.to(chartEl, { strokeDashoffset: 0, duration: 0.4 }, 2.35);
  tl.to(chart4hrsEl, { attr: { "font-size": 13 }, fill: STEEL_MIST, duration: 0.3 }, 2.6);
  tl.to(chart30secEl, { attr: { "font-size": 22 }, fill: COPPER, duration: 0.3 }, 2.6);
  tl.to(percentEl, { opacity: 1, attr: { y: 30 }, duration: 0.25 }, 2.8);
  tl.to(percentLabelEl, { opacity: 1, attr: { y: 59 }, duration: 0.25 }, 2.8);

  // pad to an exact duration of 3 so callers can rely on the 0/1/2/3 step
  // boundaries regardless of the last tween's real end time
  tl.set({}, {}, 3);

  return tl;
}
