import Reveal from "@/components/Reveal";
import CountStat from "@/components/CountStat";

const stats = [
  {
    kind: "count" as const,
    from: 60,
    to: 30,
    prefix: "< ",
    suffix: " s",
    caption: "average response time",
  },
  {
    kind: "static" as const,
    value: "24 / 7",
    caption: "always on, no shifts",
  },
  {
    kind: "static" as const,
    value: "2 weeks",
    caption: "from audit to live system",
  },
  {
    kind: "count" as const,
    from: 0,
    to: 100,
    prefix: "",
    suffix: "%",
    caption: "leads captured, none dropped",
  },
];

const timeline = [
  {
    number: "01",
    name: "Audit",
    desc: "Free 30-min call. We map your leaks.",
  },
  {
    number: "02",
    name: "Design",
    desc: "We scope the system in writing before you pay.",
  },
  {
    number: "03",
    name: "Deploy",
    desc: "Build, integrate, test, go live.",
  },
  {
    number: "04",
    name: "Support",
    desc: "Dedicated ongoing help, not a ticket queue.",
  },
];

export default function Proof() {
  return (
    <section id="work" className="px-6 py-32">
      <div className="max-w-7xl mx-auto">
        {/* Band A — stat counters */}
        <div>
          <p className="font-mono text-copper text-sm tracking-widest mb-6">
            {"// WHY IT WORKS"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-14 mt-10">
            {stats.map((s, i) => (
              <Reveal key={s.caption} delay={i * 60}>
                <div>
                  <div className="font-mono text-copper text-6xl md:text-7xl leading-none">
                    {s.kind === "count" ? (
                      <CountStat
                        from={s.from}
                        to={s.to}
                        prefix={s.prefix}
                        suffix={s.suffix}
                      />
                    ) : (
                      s.value
                    )}
                  </div>
                  <p className="text-steel-mist text-sm mt-4">{s.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Band B — featured work */}
        <div className="mt-32">
          <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-16">
            Systems already running.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-[#121216] border border-[rgba(171,184,204,0.15)] rounded-2xl p-8 flex flex-col h-full">
                <span className="font-mono text-copper text-xs tracking-widest">
                  LIVE
                </span>
                <h3 className="font-sans font-bold text-2xl text-paper mt-4 mb-3">
                  SubsidyTrack
                </h3>
                <p className="text-steel-mist text-sm leading-relaxed flex-1">
                  Post-sale PM Surya Ghar subsidy tracker for solar
                  installers. Automates paperwork status, customer updates,
                  and follow-up.
                </p>
                <p className="font-mono text-steel-mist/60 text-xs mt-8">
                  Built by Ardvix
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-[#121216] border border-dashed border-[rgba(171,184,204,0.2)] rounded-2xl p-8 flex flex-col h-full">
                <span className="font-mono text-copper text-xs tracking-widest">
                  COMING SOON
                </span>
                <h3 className="font-sans font-bold text-2xl text-paper mt-4 mb-3">
                  Your case study, next.
                </h3>
                <p className="text-steel-mist text-sm leading-relaxed flex-1">
                  The next system we ship goes here.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Band C — process timeline */}
        <div className="mt-32">
          <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-16">
            From &ldquo;hello&rdquo; to handoff, in 2 weeks.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-6">
            {timeline.map((step, i) => (
              <Reveal key={step.number} delay={i * 80}>
                <div className="flex flex-col md:items-center md:text-center">
                  <div className="hidden md:block relative w-full h-3 mb-6">
                    <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-copper/30" />
                    <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper" />
                  </div>
                  <span className="font-mono text-copper text-xs tracking-widest mb-2">
                    {step.number}
                  </span>
                  <h4 className="font-sans font-bold text-lg text-paper mb-2">
                    {step.name}
                  </h4>
                  <p className="text-steel-mist text-sm leading-relaxed md:max-w-[200px]">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-steel-mist text-sm italic text-center mt-16">
            &ldquo;Most systems are live in 2–3 weeks.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
