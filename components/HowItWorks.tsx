"use client";

import { useEffect, useRef } from "react";
import PipelineDiagram, {
  usePipelineRefs,
} from "@/components/pipeline/PipelineDiagram";
import Reveal from "@/components/Reveal";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

const STEPS = [
  {
    tag: "STEP 01 · Capture",
    title: "Every enquiry, one place.",
    body: "WhatsApp, missed calls, web forms, ad clicks, walk-ins — nothing slips through the cracks anymore.",
  },
  {
    tag: "STEP 02 · Automate",
    title: "AI does the busywork.",
    body: "Qualifies, replies, books, and routes — in under 30 seconds, in your customer's language, 24/7.",
  },
  {
    tag: "STEP 03 · Grow",
    title: "A live pipeline, not chaos.",
    body: "Response time drops from hours to seconds. Your team stops doing what a system should do.",
  },
] as const;

export default function HowItWorks() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="process" className="px-6 py-32">
      <div className="max-w-5xl mx-auto mb-16">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          {"// HOW IT WORKS"}
        </p>
        <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight">
          Chaos in. Signal out.
        </h2>
      </div>

      {reducedMotion ? (
        <StaticSteps />
      ) : (
        <>
          <div className="md:hidden">
            <MobileSteps />
          </div>
          <DesktopSequence />
        </>
      )}
    </section>
  );
}

function CopyBlock({
  step,
  refCb,
  className = "",
}: {
  step: (typeof STEPS)[number];
  refCb?: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  const [tag, name] = step.tag.split(" · ");
  return (
    <div ref={refCb} className={className}>
      <span className="font-mono text-copper text-xs tracking-widest">
        {tag} · {name}
      </span>
      <h3 className="font-sans font-bold text-3xl md:text-4xl text-paper mt-3 mb-4">
        {step.title}
      </h3>
      <p className="text-steel-mist text-base md:text-lg leading-relaxed max-w-md">
        {step.body}
      </p>
    </div>
  );
}

/** Desktop: pinned split layout, GSAP ScrollTrigger scrub, disabled below md.
 * GSAP/ScrollTrigger/the pipeline timeline are all loaded dynamically inside
 * this effect (not statically imported) so their ~50kb doesn't sit in the
 * critical initial JS bundle needed for first paint — nothing here is
 * needed until well after the page has already rendered and hydrated. */
function DesktopSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pipelineRefs = usePipelineRefs();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("@/components/pipeline/pipelineTimeline"),
    ]).then(([{ gsap }, { ScrollTrigger }, { buildPipelineTimeline }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const section = sectionRef.current;
        if (!section) return;

        const master = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.8,
            snap: {
              snapTo: [1 / 6, 1 / 2, 5 / 6],
              duration: 0.4,
              ease: "power1.inOut",
            },
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${self.progress * 100}%`;
                progressBarRef.current.style.opacity = self.isActive
                  ? "1"
                  : "0";
              }
            },
          },
        });

        buildPipelineTimeline(pipelineRefs, master);

        gsap.set(copyRefs.current, { opacity: 0, y: 20 });
        gsap.set(copyRefs.current[0], { opacity: 1, y: 0 });

        STEPS.forEach((_, i) => {
          if (i === 0) return;
          const at = i; // step boundaries sit at timeline t=1 and t=2
          master.to(
            copyRefs.current[i - 1],
            { opacity: 0, y: -20, duration: 0.25 },
            at - 0.15
          );
          master.to(
            copyRefs.current[i],
            { opacity: 1, y: 0, duration: 0.25 },
            at
          );
        });

        return () => {
          master.scrollTrigger?.kill();
          master.kill();
        };
      });
      // pinning intentionally has no handler below 768px — MobileSteps covers that range

      cleanup = () => mm.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // pipelineRefs is a stable set of refs, but a new wrapping object each
    // render — intentionally omitted so this effect only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="hidden md:block">
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-px bg-copper z-40"
        style={{ width: 0, opacity: 0 }}
      />
      <div
        ref={sectionRef}
        className="relative h-screen grid grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
      >
        <div className="relative h-64">
          {STEPS.map((step, i) => (
            <CopyBlock
              key={step.tag}
              step={step}
              refCb={(el) => {
                copyRefs.current[i] = el;
              }}
              className="absolute inset-0"
            />
          ))}
        </div>
        <PipelineDiagram
          refs={pipelineRefs}
          className="w-full h-auto max-h-[70vh]"
        />
      </div>
    </div>
  );
}

/** Mobile: the section scrolls naturally (no pin) — the diagram's timeline
 * scrubs in sync with scroll progress via a ScrollTrigger with pin:false.
 * Range runs from the diagram's top entering the bottom 10% of the
 * viewport to its top reaching 20% down, so it finishes while the
 * section is still comfortably on screen rather than scrolled past.
 * Three step-copy blocks stack below it, staggered in via Reveal
 * (independent of the diagram scrub). */
function MobileSteps() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const pipelineRefs = usePipelineRefs();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("@/components/pipeline/pipelineTimeline"),
    ]).then(([{ gsap }, { ScrollTrigger }, { buildPipelineTimeline }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        const diagram = diagramRef.current;
        if (!diagram) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagram,
            start: "top 90%",
            end: "top 20%",
            scrub: 0.5,
            pin: false,
          },
        });

        buildPipelineTimeline(pipelineRefs, tl);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
      // pinning intentionally has no handler at/above 768px — DesktopSequence covers that range

      cleanup = () => mm.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // pipelineRefs is a stable set of refs, but a new wrapping object each
    // render — intentionally omitted so this effect only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div ref={diagramRef}>
        <PipelineDiagram
          refs={pipelineRefs}
          className="w-full max-w-xs mx-auto h-auto"
        />
      </div>
      <div className="flex flex-col gap-12 mt-12">
        {STEPS.map((step, i) => (
          <Reveal key={step.tag} delay={i * 100}>
            <CopyBlock step={step} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** prefers-reduced-motion: no pinning, no per-element motion — three stacked
 * steps with the diagram already showing its final, complete state. */
function StaticSteps() {
  const pipelineRefs = usePipelineRefs();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import("@/components/pipeline/pipelineTimeline").then(
      ({ buildPipelineTimeline }) => {
        if (cancelled) return;
        const tl = buildPipelineTimeline(pipelineRefs);
        tl.progress(1);
        cleanup = () => tl.kill();
      }
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // pipelineRefs is a stable set of refs, but a new wrapping object each
    // render — intentionally omitted so this effect only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-16">
      {STEPS.map((step) => (
        <CopyBlock key={step.tag} step={step} />
      ))}
      <PipelineDiagram
        refs={pipelineRefs}
        className="w-full max-w-md mx-auto h-auto"
      />
    </div>
  );
}
