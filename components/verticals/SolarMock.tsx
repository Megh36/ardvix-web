const STAGES = ["LEAD", "QUAL", "SURV", "PROP", "INST", "SUB"];

const CUSTOMERS = [
  { name: "RAO, K.", stage: 4, active: true }, // INSTALL
  { name: "SHAH, M.", stage: 3, active: true }, // PROPOSAL
  { name: "PATEL, R.", stage: 2, active: true }, // SURVEY
] as const;

/** Solar mockup: a stylized pipeline / status board — four homeowner
 * installs, each at a different stage of a shared 6-step pipeline. Pure
 * JSX/CSS — no screenshots, no external images. */
export default function SolarMock() {
  return (
    <div
      className="relative min-h-[300px] md:aspect-[5/4] overflow-hidden rounded-2xl border border-steel-mist/15 bg-obsidian p-4 transition-transform duration-200 hover:scale-[1.01] shadow-[inset_0_24px_32px_-24px_rgba(0,0,0,0.55)]"
      role="img"
      aria-label="Illustration of a solar installation pipeline board showing three customers moving through a six-stage process from lead to subsidy, each at a different stage."
    >
      <span className="font-mono text-copper text-xs tracking-widest">
        PIPELINE — 3 ACTIVE
      </span>

      {/* axis legend */}
      <div className="grid grid-cols-[52px_1fr_14px] gap-3 items-center mt-6 mb-2">
        <span />
        <div className="flex justify-between">
          {STAGES.map((s) => (
            <span
              key={s}
              className="font-mono text-steel-mist/40 text-[7px] tracking-wide"
            >
              {s}
            </span>
          ))}
        </div>
        <span />
      </div>

      <div className="flex flex-col gap-5">
        {CUSTOMERS.map((c) => (
          <div
            key={c.name}
            className="grid grid-cols-[52px_1fr_14px] gap-3 items-center"
          >
            <span className="font-mono text-paper text-[10px] truncate">
              {c.name}
            </span>

            <div className="flex gap-1">
              {STAGES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= c.stage ? "bg-copper" : "bg-steel-mist/15"
                  }`}
                />
              ))}
            </div>

            <span
              className={`w-2 h-2 rounded-full shrink-0 justify-self-end ${
                c.active ? "bg-copper" : "bg-steel-mist/40"
              }`}
            />
          </div>
        ))}
      </div>

      {/* anchored to the bottom edge, same as the booked-tag in the real
       * estate mock, so the mockup reads as filled rather than top-heavy */}
      <div className="absolute left-4 right-4 bottom-4 border-t border-steel-mist/10 pt-3">
        <span className="font-mono text-steel-mist text-[10px] tracking-wide">
          AVG TIME TO INSTALL: 11 DAYS{" "}
          <span className="text-copper">(↓ 40%)</span>
        </span>
      </div>
    </div>
  );
}
