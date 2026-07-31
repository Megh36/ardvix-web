import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-copper/30 mt-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/ardvix-mark.svg" alt="" width={28} height={28} />
              <span className="font-medium">ARDVIX</span>
            </div>
            <p className="text-steel-mist text-sm mb-6">
              AI automation systems, built in India.
            </p>
            <a
              href="mailto:hello@ardvix.com"
              className="font-mono text-xs text-steel-mist hover:text-paper transition-colors"
            >
              hello@ardvix.com
            </a>
          </div>

          <div>
            <h3 className="font-mono text-copper text-xs tracking-widest mb-4">
              {"// SERVICES"}
            </h3>
            <ul className="space-y-2 text-sm text-steel-mist">
              <li>AI Voice Agent</li>
              <li>WhatsApp Automation</li>
              <li>Lead Capture and CRM</li>
              <li>Appointment Systems</li>
              <li>Custom Workflows</li>
              <li>Full Automation</li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-copper text-xs tracking-widest mb-4">
              {"// VERTICALS"}
            </h3>
            <ul className="space-y-2 text-sm text-steel-mist">
              <li>Real Estate</li>
              <li>Solar</li>
              <li>Clinics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-copper text-xs tracking-widest mb-4">
              {"// GET STARTED"}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@ardvix.com?subject=Free%20Automation%20Audit%20Request&body=Hi%20Ardvix%2C%20I%27d%20like%20to%20book%20a%20free%20automation%20audit%20for%20my%20business."
                className="bg-copper text-obsidian text-sm font-medium px-4 py-2 rounded-full text-center"
              >
                Book a free audit
              </a>
              <a
                href="mailto:hello@ardvix.com?subject=Ardvix%20Enquiry&body=Hi%20Ardvix%2C%20I%27d%20like%20to%20talk%20about%20automation%20for%20my%20business."
                className="border border-copper text-copper text-sm px-4 py-2 rounded-full text-center"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-steel-mist/10">
          <p className="font-mono text-xs text-steel-mist">
            2026 Ardvix Automation Systems LLP. All rights reserved.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden -mb-16 md:-mb-24 lg:-mb-32">
        <h2
          className="font-sans font-bold text-center leading-none select-none"
          style={{
            fontSize: "clamp(120px, 22vw, 380px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(171, 184, 204, 0.15)",
          }}
        >
          ARDVIX
        </h2>
      </div>
    </footer>
  );
}