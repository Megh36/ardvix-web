type Status = "CONFIRMED" | "REMINDED" | "NEW BOOKING";

const SLOTS: { time: string; initials: string; status: Status; note?: string }[] = [
  { time: "10:00", initials: "R.K.", status: "CONFIRMED" },
  {
    time: "10:30",
    initials: "S.P.",
    status: "REMINDED",
    note: "SMS + WHATSAPP",
  },
  { time: "11:30", initials: "V.N.", status: "NEW BOOKING" },
  { time: "12:00", initials: "D.J.", status: "CONFIRMED" },
];

function StatusTag({ status }: { status: Status }) {
  if (status === "REMINDED") {
    return (
      <span className="font-mono text-steel-mist text-[9px] tracking-widest border border-steel-mist/30 rounded px-2 py-0.5">
        REMINDED
      </span>
    );
  }
  if (status === "NEW BOOKING") {
    return (
      <span className="font-mono text-copper text-[9px] tracking-widest border border-copper/40 rounded px-2 py-0.5 animate-pulse">
        NEW BOOKING
      </span>
    );
  }
  return (
    <span className="font-mono text-copper text-[9px] tracking-widest border border-copper/30 rounded px-2 py-0.5">
      CONFIRMED
    </span>
  );
}

/** Clinics mockup: a stylized single-day appointment calendar. Pure
 * JSX/CSS — no screenshots, no external images. */
export default function ClinicMock() {
  return (
    <div
      className="relative min-h-[300px] md:aspect-[5/4] overflow-hidden rounded-2xl border border-steel-mist/15 bg-obsidian p-4 transition-transform duration-200 hover:scale-[1.01] shadow-[inset_0_24px_32px_-24px_rgba(0,0,0,0.55)]"
      role="img"
      aria-label="Illustration of a clinic's daily appointment calendar showing confirmed bookings, a reminder sent by SMS and WhatsApp, and a new booking, with no-shows down 60% this week."
    >
      <span className="font-mono text-copper text-xs tracking-widest">
        TODAY — WED 30 JUL
      </span>

      <div className="flex flex-col gap-4 mt-6">
        {SLOTS.map((s) => (
          <div key={s.time} className="flex items-center gap-3">
            <span className="font-mono text-steel-mist text-[10px] w-11 shrink-0">
              {s.time}
            </span>
            <span className="font-mono text-paper text-xs w-9 shrink-0">
              {s.initials}
            </span>
            <StatusTag status={s.status} />
            {s.note && (
              <span className="font-mono text-steel-mist/50 text-[9px] tracking-wide truncate">
                · {s.note}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* anchored to the bottom edge, same as the booked-tag in the real
       * estate mock, so the mockup reads as filled rather than top-heavy */}
      <div className="absolute left-4 right-4 bottom-4 border-t border-steel-mist/10 pt-3">
        <span className="font-mono text-steel-mist text-[10px] tracking-wide">
          NO-SHOWS THIS WEEK: 2{" "}
          <span className="text-copper">(↓ 60%)</span>
        </span>
      </div>
    </div>
  );
}
