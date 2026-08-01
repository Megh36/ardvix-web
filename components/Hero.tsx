export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Background gradient — placeholder for particles */}
      <div className="absolute inset-0 -z-10 hero-glow" />

      <div className="max-w-7xl mx-auto w-full">
        <div>
          <p className="font-mono text-copper text-sm tracking-widest mb-6">
            {"// AI AUTOMATION SYSTEMS"}
          </p>

          <h1
            id="hero-heading"
            className="font-sans font-medium text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl"
          >
            Your business,
            <br />
            on autopilot.
          </h1>

          <p className="text-steel-mist text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            We build AI voice agents, WhatsApp automations, and workflow
            systems for real estate, solar, and clinics — so leads never
            leak and Sundays stay yours.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="mailto:hello@ardvix.com?subject=Free%20Automation%20Audit%20Request&body=Hi%20Ardvix%2C%20I%27d%20like%20to%20book%20a%20free%20automation%20audit%20for%20my%20business."
              className="bg-copper text-obsidian font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Book a free automation audit
            </a>
            <a
              href="#services"
              className="border border-steel-mist/30 text-paper px-6 py-3 rounded-full hover:border-paper transition-colors"
            >
              See the systems ↓
            </a>
          </div>
        </div>

        {/* Ticker — decorative, repeats the same text 3x for the loop */}
        <div
          aria-hidden="true"
          className="mt-20 overflow-hidden border-y border-steel-mist/10 py-4"
        >
          <div className="flex gap-12 whitespace-nowrap animate-marquee font-mono text-copper text-sm">
            {Array(3)
              .fill(
                "leads captured · calls answered · hours saved · appointments booked · follow-ups sent · reports generated"
              )
              .map((t, i) => (
                <span key={i}>{t}</span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}