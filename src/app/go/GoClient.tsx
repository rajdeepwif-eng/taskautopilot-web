"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FixDemo from "@/components/FixDemo";
import { byId, fmt } from "@/lib/catalogue";
import { partnerName } from "@/data/partners";
import { NEXT_BUILD_START } from "@/lib/launch";

/** What each trade's owner hears first. Keys match the ?t= value on flyers and QR codes. */
const PITCH: Record<string, { who: string; line: string; demo: string; ask: string; picks: number[] }> = {
  trades: { who: "plumbers, electricians & builders", line: "Every call you miss while you're on a job gets a text back in a minute — with your booking link.", demo: "missed-calls", ask: "Can someone fix a leaking water heater this week?", picks: [11, 13, 22] },
  clinics: { who: "clinics & dental practices", line: "Patients who call after hours get a booking link straight away, and reminders cut no-shows.", demo: "missed-calls", ask: "Do you have an appointment on Thursday?", picks: [11, 33, 15] },
  property: { who: "landlords & property managers", line: "Maintenance requests are logged and acknowledged at any hour, and rent reminders go out on time.", demo: "ai-receptionist", ask: "The heating in my unit isn't working.", picks: [117, 22, 11] },
  professional: { who: "accountants, lawyers & advisors", line: "New enquiries get a reply in a minute and a consultation booked — without you chasing.", demo: "missed-calls", ask: "I need help reviewing a contract.", picks: [10, 11, 96] },
};

export default function GoClient() {
  const [t, setT] = useState("trades");
  const [by, setBy] = useState("");
  useEffect(() => { try { const q = new URLSearchParams(window.location.search); const k = q.get("t") || ""; if (PITCH[k]) setT(k); setBy(partnerName(q.get("ref") || "")); } catch { /* ignore */ } }, []);
  const p = PITCH[t];
  const starter = byId(120);
  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <section className="flex flex-col gap-3">
        <div className="kicker">{by ? `Recommended by ${by}` : "Nice to meet you"} · for {p.who}</div>
        <h1 className="m-0 max-w-[860px] font-display text-[clamp(30px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Try one automation for {fmt(starter.price)}. We set it up for you.</h1>
        <p className="m-0 max-w-[720px] text-lg text-ink-2">{p.line} Set up in your own accounts within 5 business days, runs for 30 days, and the {fmt(starter.price)} is credited if you upgrade.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/starter/" className="btn btn-primary">Pick my {fmt(starter.price)} starter →</Link>
          <Link href="/ask/" className="btn btn-outline">Ask a question first</Link>
        </div>
      </section>
      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <FixDemo slug={p.demo} ask={p.ask} />
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">What owners like you start with</h2>
          {p.picks.map(byId).map((x) => (
            <Link key={x.id} href={`/p/${x.id}/`} className="card flex flex-col gap-1 p-4 text-ink no-underline hover:border-ink">
              <b>{x.name}</b><span className="text-[14px] text-ink-2">{x.desc}</span><span className="text-[15px] font-bold">{x.monthly ? `${fmt(x.price)}/mo` : fmt(x.price)}</span>
            </Link>
          ))}
          <div className="text-[14px] text-ink-2">✓ Fixed prices · ✓ Approve the test run or get the build fee back · ✓ No sales call needed{NEXT_BUILD_START ? ` · 📅 Next build start ${new Date(NEXT_BUILD_START + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" })}` : ""}</div>
        </div>
      </section>
    </main>
  );
}
