import type { Metadata } from "next";
import Link from "next/link";
import { byId } from "@/lib/catalogue";
import { CatArt } from "@/components/CatArt";

export const metadata: Metadata = { title: "Try one automation for $99 — TaskAutoMode", description: "Pick one starter automation. We set it up in your accounts and it runs for 30 days. $99 credited if you upgrade." };

const OPTIONS: { key: string; name: string; what: string; full: number }[] = [
  { key: "missed-calls", name: "Missed-call text-back", what: "Every call you miss gets a text within a minute with your booking link.", full: 11 },
  { key: "reviews", name: "Review requests", what: "Every customer is asked for a Google review after each job (asking everyone is the rule; cherry-picking is review-gating).", full: 15 },
  { key: "invoices-excel", name: "Invoices into Excel", what: "Invoices and receipts you forward are read and added as rows to your sheet.", full: 68 },
  { key: "email-sort", name: "Email sorting", what: "New emails are labelled and urgent ones flagged to you — no replies sent.", full: 96 },
  { key: "forms-sheet", name: "Form to sheet + alert", what: "Answers from one Google or Microsoft form go to a sheet and alert the right person.", full: 48 },
];

export default function StarterPage() {
  return (
    <main className="wrap flex flex-col gap-6 pb-16 pt-12">
      <div className="flex flex-col gap-3">
        <div className="kicker">Starter · $99 · 30 days</div>
        <h1 className="m-0 max-w-[860px] font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Pick the one task you want gone first.</h1>
        <p className="m-0 max-w-[700px] text-lg text-ink-2">We set it up in your own accounts within 5 business days and it runs for 30 days. Upgrade and your $99 is credited. On day 31 it simply pauses — nothing is charged automatically, and there&apos;s nothing more to pay.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {OPTIONS.map((o) => (
          <div key={o.key} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
            <div className="relative aspect-[16/7]"><CatArt cat={byId(o.full).cat} size={38} /></div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="font-display text-lg font-bold">{o.name}</div>
              <p className="m-0 text-[14px] text-ink-2">{o.what}</p>
              <div className="mt-auto text-[12.5px] text-muted">Full version: <Link href={`/p/${o.full}/`}>{byId(o.full).name}</Link></div>
              <Link href={`/checkout/?plan=120&pick=${o.key}`} className="btn btn-primary">Choose this — $99</Link>
            </div>
          </div>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">Want something else first? <Link href="/ask/">Ask free whether we can do it</Link>.</p>
    </main>
  );
}
