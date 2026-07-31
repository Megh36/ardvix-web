const verticals = [
  {
    tag: "REAL ESTATE",
    subhead: "For brokers and developers.",
    bullets: [
      "Qualify every property enquiry instantly",
      "Auto-book site visits and reminders",
      "Never lose a buyer to slow follow-up",
    ],
    linkText: "Automation for real estate",
  },
  {
    tag: "SOLAR INSTALLERS",
    subhead: "For rooftop and EPC teams.",
    bullets: [
      "Qualify homeowners automatically",
      "Schedule surveys without back-and-forth calls",
      "Keep every installation moving through one automated pipeline",
    ],
    linkText: "Automation for solar",
  },
  {
    tag: "CLINICS",
    subhead: "For doctors and clinic owners.",
    bullets: [
      "AI appointment booking, 24/7",
      "Automatic patient reminders",
      "Reduce no-shows and front-desk workload",
    ],
    linkText: "Automation for clinics",
  },
];

export default function Verticals() {
  return (
    <section id="verticals" className="px-6 py-32">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          // BUILT FOR YOUR INDUSTRY
        </p>

        <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-16">
          Automation, tuned to how you actually work.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verticals.map((v) => (
            <div
              key={v.tag}
              className="bg-[#121216] border border-[rgba(171,184,204,0.15)] rounded-2xl p-8 flex flex-col"
            >
              <span className="font-mono text-copper text-xs tracking-widest">
                // {v.tag}
              </span>
              <h3 className="font-sans font-bold text-xl text-paper mt-4 mb-5">
                {v.subhead}
              </h3>
              <ul className="space-y-3 mb-8">
                {v.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-steel-mist text-sm leading-relaxed"
                  >
                    <span className="w-2 h-2 bg-copper mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="font-mono text-copper text-sm mt-auto hover:opacity-80 transition-opacity"
              >
                {v.linkText} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
