"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/components/usePrefersReducedMotion";

const LINES = [
  { tag: "MISSED", text: "Enquiry came at 11:40 PM. Nobody called back." },
  { tag: "LEAKED", text: "Customer asked for a callback. Nobody remembered." },
  { tag: "BURNED", text: "Hours a week lost to repetitive manual work." },
] as const;

const CHAR_MS = 28;
const CHAR_JITTER_MS = 6;
const LINE_GAP_MS = 250;

type Phase = "idle" | "tag" | "sentence" | "done";

/** One line of the terminal readout. Typing is driven by a single chained
 * setTimeout stepping through tag chars -> one silent "space" tick -> sentence
 * chars, so it reads as one continuous stream rather than two separate
 * animations. Both the tag pill and the sentence reserve their final size via
 * an invisible sizer (identical markup, full text) so nothing reflows as
 * characters are appended — the visible text is an absolutely-positioned
 * overlay on top of it. */
function TypingLine({
  tag,
  text,
  active,
  opacity,
  onComplete,
  className = "",
}: {
  tag: string;
  text: string;
  active: boolean;
  opacity: number;
  onComplete: () => void;
  className?: string;
}) {
  const fullTag = `[${tag}]`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [tagCount, setTagCount] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [glitchTick, setGlitchTick] = useState(0);
  const hasStartedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || hasStartedRef.current) return;
    hasStartedRef.current = true;
    setPhase("tag");

    let cancelled = false;
    let i = 0;
    const tagTicks = fullTag.length;
    const totalTicks = fullTag.length + 1 + text.length; // +1 silent pause tick

    function scheduleNext() {
      const delay = CHAR_MS + (Math.random() * 2 - 1) * CHAR_JITTER_MS;
      window.setTimeout(() => {
        if (cancelled) return;
        i++;
        if (i <= tagTicks) {
          setTagCount(i);
          setGlitchTick((g) => g + 1);
          setPhase("tag");
        } else if (i === tagTicks + 1) {
          setPhase("tag"); // the silent space tick — cursor holds at tag end
        } else {
          setTextCount(i - tagTicks - 1);
          setPhase("sentence");
        }
        if (i < totalTicks) {
          scheduleNext();
        } else {
          setPhase("done");
          onCompleteRef.current();
        }
      }, delay);
    }
    scheduleNext();

    return () => {
      cancelled = true;
    };
    // fullTag/text derive from props that never change after mount for a
    // given line — only `active` (the trigger) needs to be watched here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const settledTag = fullTag.slice(0, Math.max(0, tagCount - 1));
  const glitchChar = tagCount > 0 ? fullTag[tagCount - 1] : "";
  const sentenceTyped = text.slice(0, textCount);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 transition-opacity duration-300 ease-out ${className}`}
      style={{ opacity }}
    >
      <span className="relative inline-block shrink-0">
        <span
          aria-hidden="true"
          className="invisible select-none inline-block font-mono text-xs tracking-widest border border-copper/30 rounded px-3 py-1 whitespace-pre"
        >
          {fullTag}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-block font-mono text-copper text-xs tracking-widest border border-copper/30 rounded px-3 py-1 whitespace-pre"
        >
          {settledTag}
          {glitchChar && (
            <span key={glitchTick} className="tag-glitch-char">
              {glitchChar}
            </span>
          )}
          {phase === "tag" && <span className="type-cursor" />}
        </span>
      </span>

      <span className="relative inline-block align-top flex-1">
        <span
          aria-hidden="true"
          className="invisible select-none inline-block font-mono text-base md:text-lg"
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-block font-mono text-paper text-base md:text-lg"
        >
          {sentenceTyped}
          {phase === "sentence" && <span className="type-cursor" />}
        </span>
      </span>
    </div>
  );
}

export default function ProblemStrip() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const handleLineComplete = useCallback((index: number) => {
    window.setTimeout(() => {
      if (index < LINES.length - 1) {
        setActiveIndex(index + 1);
      } else {
        setShowClosing(true);
      }
    }, LINE_GAP_MS);
  }, []);

  const fullTextForSR = `${LINES.map((l) => `[${l.tag}] ${l.text}`).join(
    " "
  )} This is what we automate.`;

  if (reducedMotion) {
    return (
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-copper text-sm tracking-widest mb-16">
            {"// THE CHAOS YOU LIVE IN"}
          </p>

          <div>
            {LINES.map((line, i) => (
              <div
                key={line.tag}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 ${
                  i === LINES.length - 1 ? "" : "mb-8"
                }`}
              >
                <span className="font-mono text-copper text-xs tracking-widest border border-copper/30 rounded px-3 py-1 w-fit shrink-0">
                  [{line.tag}]
                </span>
                <span className="font-mono text-paper text-base md:text-lg">
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          <p className="font-sans font-medium text-2xl md:text-3xl text-paper text-center mt-24">
            This is what we automate.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="px-6 py-32">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-16">
          {"// THE CHAOS YOU LIVE IN"}
        </p>

        {/* Full content for screen readers, available immediately rather
         * than assembled character-by-character alongside the animation. */}
        <div className="sr-only">{fullTextForSR}</div>

        <div aria-hidden="true">
          {LINES.map((line, i) => (
            <TypingLine
              key={line.tag}
              tag={line.tag}
              text={line.text}
              active={started && i === activeIndex}
              opacity={
                !started
                  ? 0
                  : showClosing
                    ? 0.55
                    : i < activeIndex
                      ? 0.55
                      : i === activeIndex
                        ? 1
                        : 0
              }
              onComplete={() => handleLineComplete(i)}
              className={i === LINES.length - 1 ? "" : "mb-8"}
            />
          ))}
        </div>

        {/* Always mounted (space reserved from the start, no reflow when it
         * fades in) — driven by showClosing rather than Reveal's own
         * IntersectionObserver, since its timing must follow the typing
         * sequence finishing, not the element's own scroll-visibility. */}
        <p
          className="font-sans font-medium text-2xl md:text-3xl text-paper text-center mt-24"
          style={{
            opacity: showClosing ? 1 : 0,
            transform: showClosing ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 400ms var(--ease-out), transform 400ms var(--ease-out)",
          }}
        >
          This is what we automate.
        </p>
      </div>
    </section>
  );
}
