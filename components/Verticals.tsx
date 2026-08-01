import Reveal from "@/components/Reveal";
import RealEstateMock from "@/components/verticals/RealEstateMock";
import SolarMock from "@/components/verticals/SolarMock";
import ClinicMock from "@/components/verticals/ClinicMock";

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
    Mock: RealEstateMock,
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
    Mock: SolarMock,
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
    Mock: ClinicMock,
  },
] as const;

export default function Verticals() {
  return (
    <section id="verticals" aria-labelledby="verticals-heading" className="px-6 py-32">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          {"// BUILT FOR YOUR INDUSTRY"}
        </p>

        <h2
          id="verticals-heading"
          className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-16"
        >
          Automation, tuned to how you actually work.
        </h2>

        <div>
          {verticals.map((v, i) => {
            // panels alternate visual-left/visual-right on desktop; on
            // mobile the visual always stacks above the copy
            const visualFirstDesktop = i % 2 === 1;
            const Mock = v.Mock;
            return (
              <Reveal
                key={v.tag}
                delay={i * 120}
                className={i === verticals.length - 1 ? "" : "mb-16"}
              >
                <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 sm:p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div
                      className={`order-1 ${visualFirstDesktop ? "md:order-1" : "md:order-2"}`}
                    >
                      <Mock />
                    </div>

                    <div
                      className={`order-2 ${visualFirstDesktop ? "md:order-2" : "md:order-1"}`}
                    >
                      <span className="font-mono text-copper text-sm tracking-widest">
                        {`// ${v.tag}`}
                      </span>
                      <h3 className="font-sans font-medium text-3xl md:text-4xl text-paper mt-4 mb-6 leading-tight">
                        {v.subhead}
                      </h3>
                      <ul className="space-y-4 mb-10">
                        {v.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-3 text-steel-mist leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 bg-copper mt-2 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        className="group inline-flex items-center gap-2 font-mono text-copper text-sm"
                      >
                        <span className="group-hover:underline">
                          {v.linkText}
                        </span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
