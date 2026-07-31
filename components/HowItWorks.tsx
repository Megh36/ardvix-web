const steps = [
  {
    tag: "STEP 01",
    name: "Capture",
    body: "Every enquiry lands in one place — WhatsApp, missed calls, web forms, ad clicks, walk-ins. Nothing slips through.",
  },
  {
    tag: "STEP 02",
    name: "Automate",
    body: "An AI layer qualifies, replies, books, and routes — in under 30 seconds, in your customer's language.",
  },
  {
    tag: "STEP 03",
    name: "Grow",
    body: "You get a live pipeline instead of a chaotic inbox. Response time drops from hours to seconds. Your team stops doing what a system should do.",
  },
];

function CaptureIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="60" cy="60" r="6" />
      <circle cx="20" cy="25" r="4" />
      <circle cx="100" cy="25" r="4" />
      <circle cx="20" cy="95" r="4" />
      <line x1="24" y1="28" x2="55" y2="56" />
      <line x1="96" y1="28" x2="65" y2="56" />
      <line x1="24" y1="92" x2="55" y2="64" />
    </svg>
  );
}

function AutomateIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 60 L75 60" />
      <path d="M55 35 L80 60 L55 85" />
      <path d="M20 35 L20 85" />
    </svg>
  );
}

function GrowIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="15,90 40,65 58,78 105,20" />
      <polyline points="80,20 105,20 105,45" />
    </svg>
  );
}

const icons = [CaptureIcon, AutomateIcon, GrowIcon];

export default function HowItWorks() {
  return (
    <section id="process" className="px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-copper text-sm tracking-widest mb-6">
          // HOW IT WORKS
        </p>

        <h2 className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-tight">
          Chaos in. Signal out.
        </h2>

        <div>
          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <div
                key={step.tag}
                className="flex items-center justify-between gap-8 mt-24 first:mt-24"
              >
                <div className="max-w-2xl">
                  <span className="font-mono text-copper text-xs tracking-widest">
                    {step.tag} · {step.name}
                  </span>
                  <h3 className="font-sans font-bold text-2xl md:text-3xl text-paper mt-3 mb-4">
                    {step.name}
                  </h3>
                  <p className="text-steel-mist text-base md:text-lg leading-relaxed">
                    {step.body}
                  </p>
                </div>
                <div className="hidden md:block text-steel-mist shrink-0">
                  <Icon />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
