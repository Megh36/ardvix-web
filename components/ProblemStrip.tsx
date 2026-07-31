export default function ProblemStrip() {
  const lines = [
    { tag: "MISSED", text: "Enquiry came at 11:40 PM. Nobody called back." },
    { tag: "LEAKED", text: "Customer asked for a callback. Nobody remembered." },
    { tag: "BURNED", text: "Hours a week lost to repetitive manual work." },
  ];

  return (
    <section className="px-6 py-32">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-16">
          // THE CHAOS YOU LIVE IN
        </p>

        <div>
          {lines.map((line) => (
            <div
              key={line.tag}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-8 last:mb-0"
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
