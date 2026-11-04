import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Your results panel — TaskAutopilot", description: "Every build includes a results panel showing hours saved, inquiries answered and money collected." };

const TILES = [
  ["Hours handed back this month", "62"], ["Inquiries answered in under 1 minute", "214"],
  ["Overdue invoices chased", "38"], ["Automation runs this month", "5,410"],
];
const RUNS = [
  ["06:10", "New inquiry answered and booked", "ok"], ["06:45", "3 supplier bills read and booked", "ok"],
  ["07:30", "Renewal reminders sent", "ok"], ["09:12", "Refund request sent to you to approve", "review"],
];

export default function ResultsPage() {
  return (
    <main>
      <section className="wrap flex flex-col gap-3 pb-6 pt-12">
        <div className="kicker">Your results panel</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.05] tracking-tight">See exactly what your automations did — every day.</h1>
        <p className="m-0 max-w-[700px] text-lg text-ink-2">Every build includes a results panel: hours handed back, inquiries answered, money chased and anything waiting for you.</p>
      </section>
      <section className="wrap pb-16">
        <div className="flex flex-col gap-5 rounded-2xl bg-ink p-6 text-paper">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-display text-xl font-bold">Example business · November</div>
            <span className="rounded-full bg-amber px-3 py-1 text-[12px] font-bold text-ink">EXAMPLE — SAMPLE DATA, NOT A REAL CLIENT</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TILES.map(([l, n]) => (
              <div key={l} className="rounded-xl bg-[#1F2226] p-4"><div className="font-display text-3xl font-bold text-amber">{n}</div><div className="text-[13px] text-[#C9C7C0]">{l}</div></div>
            ))}
          </div>
          <div className="flex flex-col gap-2 font-mono text-[13px]">
            {RUNS.map(([t, w, s]) => (
              <div key={t} className="flex justify-between gap-3 border-t border-[#2B2E33] pt-2"><span>{t} · {w}</span><span className={s === "ok" ? "text-[#7FD1A8]" : "text-amber"}>{s}</span></div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/library/" className="btn btn-primary">Browse automations</Link>
          <Link href="/planner/" className="btn btn-outline">Build my plan</Link>
        </div>
      </section>
    </main>
  );
}
