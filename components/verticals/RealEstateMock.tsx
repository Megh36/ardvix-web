const WHATSAPP_GREEN = "#25D366";

/** Real Estate mockup: a stylized WhatsApp thread inside a phone frame,
 * showing the AI auto-replying to a property enquiry and locking in a site
 * visit. Pure JSX/CSS — no screenshots, no external images. */
export default function RealEstateMock() {
  return (
    <div
      className="relative min-h-[400px] md:aspect-[4/5] overflow-hidden rounded-2xl border border-steel-mist/15 bg-obsidian p-5 transition-transform duration-200 hover:scale-[1.01] shadow-[inset_0_24px_32px_-24px_rgba(0,0,0,0.55)] flex flex-col"
      aria-hidden="true"
    >
      {/* phone frame chrome */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-10 h-1 rounded-full bg-steel-mist/20" />
      </div>

      <div className="flex flex-col gap-2.5">
        {/* incoming */}
        <div className="flex flex-col items-start gap-1 max-w-[85%]">
          <div className="bg-white/[0.07] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
            <p className="text-paper text-xs leading-relaxed">
              Is the Whitefield 3BHK still available? Budget 1.4Cr.
            </p>
          </div>
          <span className="font-mono text-steel-mist/60 text-[10px] pl-1">
            11:38 PM
          </span>
        </div>

        {/* outgoing — the one place WhatsApp brand green is used */}
        <div className="flex flex-col items-end gap-1 max-w-[85%] self-end">
          <div
            className="rounded-2xl rounded-br-sm px-3.5 py-2.5"
            style={{ backgroundColor: WHATSAPP_GREEN }}
          >
            <p className="text-white text-xs leading-relaxed">
              Hi! Yes it is. Sending you the floor plan and video now. Can you
              visit Saturday 11am?
            </p>
          </div>
          <span className="font-mono text-copper text-[10px] pr-1 tracking-wide">
            AUTO-REPLY · 22s
          </span>
        </div>

        {/* typing indicator */}
        <div className="flex items-center gap-1 pl-1">
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-steel-mist/50" />
            <span className="w-1 h-1 rounded-full bg-steel-mist/50" />
            <span className="w-1 h-1 rounded-full bg-steel-mist/50" />
          </span>
          <span className="font-mono text-steel-mist/50 text-[10px] italic">
            typing…
          </span>
        </div>

        {/* incoming, confirms */}
        <div className="flex flex-col items-start gap-1 max-w-[85%]">
          <div className="bg-white/[0.07] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
            <p className="text-paper text-xs leading-relaxed">
              Perfect. Booking me in.
            </p>
          </div>
          <span className="font-mono text-steel-mist/60 text-[10px] pl-1">
            11:39 PM
          </span>
        </div>
      </div>

      {/* booked tag — in normal flow with mt-auto (pushed to the bottom
       * edge when there's room to spare) rather than absolutely positioned,
       * so it can never overlap the thread above it at narrower widths
       * where this fixed-aspect box is shorter in absolute pixels */}
      <div className="mt-auto pt-4">
        <div className="border border-copper/30 rounded px-3 py-2 text-center">
          <span className="font-mono text-copper text-[10px] tracking-widest">
            SITE VISIT BOOKED — SAT 11:00 AM
          </span>
        </div>
      </div>
    </div>
  );
}
