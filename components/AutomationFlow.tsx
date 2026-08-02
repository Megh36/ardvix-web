import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";

// lucide-react + circuit-board.tsx (which pulls in motion/react) live
// entirely inside this dynamic boundary so neither ships in the main page
// bundle — this section is below the fold in every viewport. ssr:true
// keeps the content server-rendered for SEO/no-JS, matching the pattern
// already used for the Verticals vertical mocks.
const AutomationFlowDiagram = dynamic(
  () => import("@/components/AutomationFlowDiagram"),
  { ssr: true, loading: () => null }
);

const NARRATION_LINES = [
  "Lead arrives",
  "AI Voice Agent responds in 22s",
  "Details captured to CRM",
  "Site visit booked automatically",
  "Follow-up scheduled for 48h",
];

export default function AutomationFlow() {
  return (
    <section aria-labelledby="automation-flow-heading" className="px-6 py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <p className="font-mono text-copper text-sm tracking-widest mb-6">
            {"// THE SYSTEM AT WORK"}
          </p>

          <h2
            id="automation-flow-heading"
            className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6 max-w-4xl"
          >
            This is what happens the moment a lead comes in.
          </h2>

          <p className="text-steel-mist text-lg max-w-2xl mb-16">
            From first ping to booked visit — every step runs itself, in
            under 30 seconds.
          </p>
        </Reveal>

        <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-center">
          <Reveal delay={120} className="flex items-center justify-center">
            <AutomationFlowDiagram />
          </Reveal>

          <div className="md:border-l md:border-white/10 md:pl-16">
            <Reveal delay={0}>
              <p className="font-mono text-copper text-sm tracking-widest mb-6">
                {"// WHAT HAPPENS"}
              </p>
            </Reveal>

            <div className="space-y-4">
              {NARRATION_LINES.map((line, i) => (
                <Reveal key={line} delay={i * 120}>
                  <p className="font-mono text-sm md:text-base leading-relaxed flex gap-3">
                    <span className="text-copper shrink-0">{">"}</span>
                    <span className="text-steel-mist">{line}</span>
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
