const services = [
  {
    id: "01",
    name: "AI Voice Agent",
    desc: "A voice that answers every call, day or night. Qualifies, books, and hands off warm leads to your team.",
    large: true,
  },
  {
    id: "02",
    name: "WhatsApp Automation",
    desc: "Instant replies, catalogs, follow-ups, and reminders — running on the number your customers already message.",
  },
  {
    id: "03",
    name: "Lead Capture and CRM",
    desc: "One pipeline for web forms, Meta ads, walk-ins, and calls. Every lead routed, tagged, and never dropped.",
  },
  {
    id: "04",
    name: "Appointment and Booking Systems",
    desc: "Site visits, surveys, consultations — booked automatically, confirmed automatically, reminded automatically.",
  },
  {
    id: "05",
    name: "Custom Workflow Automations",
    desc: "The invisible back office: invoicing, reporting, subsidy tracking, no-show recovery, staff handoffs.",
  },
  {
    id: "06",
    name: "Full Automation System",
    desc: "The flagship. End-to-end build combining every system above, tailored to your business, with dedicated support.",
    large: true,
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 py-32">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          // WHAT WE BUILD
        </p>

        <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight mb-16">
          Six systems. One outcome — leverage.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className={`bg-[#121216] border border-[rgba(171,184,204,0.15)] rounded-2xl p-8 transition-colors duration-200 hover:border-copper ${
                s.large ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <span className="font-mono text-copper text-sm tracking-widest">
                {s.id}
              </span>
              <h3 className="font-sans font-medium text-xl text-paper mt-4 mb-3">
                {s.name}
              </h3>
              <p className="text-steel-mist text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-steel-mist text-sm italic text-center mt-16">
          &ldquo;Not sure which tier fits? Start with the free audit — we&apos;ll
          tell you what you actually need.&rdquo;
        </p>
      </div>
    </section>
  );
}
