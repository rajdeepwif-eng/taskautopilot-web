"use client";

import { useState } from "react";
import Link from "next/link";
import { fmt } from "@/lib/catalogue";

type Leak = { id: string; label: string; yearly: number; fix: string; fixId: number };

export default function ScanClient() {
  const [v, setV] = useState({ calls: 15, missedPct: 25, jobValue: 400, winPct: 30, replyHrs: 4, overdue: 6, invoiceValue: 1200, adminHrs: 10, rate: 25, noShows: 3 });
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const set = (k: keyof typeof v, n: number) => setV((x) => ({ ...x, [k]: Math.max(0, n) }));

  const missed = v.calls * (v.missedPct / 100);
  const leaks: Leak[] = [
    { id: "calls", label: "Missed calls that ring someone else", yearly: missed * 52 * v.jobValue * (v.winPct / 100), fix: "Missed-call text-back", fixId: 11 },
    { id: "slow", label: "Slow replies to enquiries", yearly: v.replyHrs > 1 ? v.calls * 52 * v.jobValue * (v.winPct / 100) * Math.min(0.25, v.replyHrs / 48) : 0, fix: "Instant lead reply & booking", fixId: 10 },
    { id: "cash", label: "Cash stuck in overdue invoices (one-off)", yearly: v.overdue * v.invoiceValue, fix: "Automated credit control", fixId: 22 },
    { id: "admin", label: "Admin hours typing, chasing and copying", yearly: v.adminHrs * 52 * v.rate * 0.7, fix: "Supplier invoice reader", fixId: 21 },
    { id: "noshow", label: "No-shows and empty slots", yearly: v.noShows * 52 * v.jobValue * 0.5, fix: "Reservations & no-show reminders", fixId: 35 },
  ].sort((a, b) => b.yearly - a.yearly);
  const total = leaks.reduce((a, l) => a + l.yearly, 0);

  const Field = ({ k, label, prefix, suffix }: { k: keyof typeof v; label: string; prefix?: string; suffix?: string }) => (
    <label className="flex flex-col gap-1 text-[14px] text-ink-2">
      {label}
      <span className="flex items-center gap-1 rounded-lg border border-[#C9C5B9] bg-white px-2.5">
        {prefix && <span className="text-muted">{prefix}</span>}
        <input type="number" min={0} value={v[k]} onChange={(e) => set(k, Number(e.target.value) || 0)} className="w-full min-w-0 !border-0 !bg-transparent !px-0 !py-2 text-[16px] !shadow-none !outline-none" />
        {suffix && <span className="whitespace-nowrap text-muted">{suffix}</span>}
      </span>
    </label>
  );

  return (
    <main>
      <section className="wrap flex flex-col gap-3 pb-6 pt-12">
        <div className="kicker">Free time-leak scan · 60 seconds</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.05] tracking-tight">Find out where your business leaks money every week.</h1>
        <p className="m-0 max-w-[700px] text-lg text-ink-2">Answer ten quick questions with your own rough numbers. You get a ranked leak report and the fix for each one.</p>
      </section>

      <div className="wrap flex flex-wrap items-start gap-8 pb-16">
        <div className="card flex min-w-0 flex-[999_1_520px] flex-col gap-4 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field k="calls" label="Calls & enquiries a week" />
            <Field k="missedPct" label="% you can't answer at once" suffix="%" />
            <Field k="jobValue" label="Average job or order value" prefix="$" />
            <Field k="winPct" label="% of answered enquiries that buy" suffix="%" />
            <Field k="replyHrs" label="Typical hours before you reply" suffix="hrs" />
            <Field k="noShows" label="No-shows a week" />
            <Field k="overdue" label="Invoices overdue right now" />
            <Field k="invoiceValue" label="Average invoice value" prefix="$" />
            <Field k="adminHrs" label="Admin hours a week (typing, chasing)" suffix="hrs" />
            <Field k="rate" label="Cost of that time per hour" prefix="$" />
          </div>
          <button type="button" onClick={() => setDone(true)} className="btn btn-primary">Show my leak report</button>
          <div className="text-[12px] text-muted">Estimates from your numbers only. We assume slow replies lose up to a quarter of enquiries and automation takes on 70% of admin time — change your inputs to test it.</div>
        </div>

        <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
          <div className={`flex flex-col gap-3 rounded-2xl bg-ink p-6 text-paper ${done ? "" : "opacity-60"}`}>
            <div className="font-display text-2xl font-bold">Your leak report</div>
            <div className="text-[13px] text-[#A9ADB4]">Estimated leaks a year</div>
            <div className="font-display text-[40px] font-bold text-amber">{fmt(total)}</div>
            {leaks.map((l, i) => (
              <div key={l.id} className="flex flex-col gap-0.5 border-t border-[#2B2E33] pt-2.5">
                <div className="flex justify-between gap-3 text-[15px]"><span>{i + 1}. {l.label}</span><b className="whitespace-nowrap font-mono">{fmt(l.yearly)}</b></div>
                <Link href={`/p/${l.fixId}/`} className="text-[13px] text-amber">Fix: {l.fix} →</Link>
              </div>
            ))}
            <Link href="/planner/" className="btn btn-primary mt-1">Turn this into a costed plan →</Link>
          </div>

          <div className="card flex flex-col gap-2 border-2 border-amber p-5">
            <div className="font-display text-lg font-bold">Automatic scan — coming soon</div>
            <div className="text-[14px] text-ink-2">Connect your inbox and calendar read-only and we measure missed calls, reply times and unpaid invoices for you. No guessing.</div>
            {joined ? (
              <div className="text-[14px] font-semibold text-ok">✓ You&apos;re on the early-access list.</div>
            ) : (
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (/.+@.+\..+/.test(email)) setJoined(true); }}>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="min-w-0 flex-1" aria-label="Work email" />
                <button type="submit" className="btn btn-dark">Get early access</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
