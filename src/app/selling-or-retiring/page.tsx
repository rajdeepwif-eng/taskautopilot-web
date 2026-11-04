import type { Metadata } from "next";
import Link from "next/link";
import { seoTitle } from "@/lib/geo";

export const metadata: Metadata = {
  title: seoTitle("Selling or retiring? Automate first"),
  description: "Planning to step back or sell? We automate your business so it runs without you — then you sell for more, sell part to us, or sell it to us over time. Confidential.",
  alternates: { canonical: "./" },
};

const PATHS = [
  ["Sell for more", "We automate the owner-dependent work, so a buyer sees a business that runs without you. You sell on the open market; we can be paid at sale.", "succession"],
  ["Sell part to us", "We buy a share now and automate the business together. You keep running it, step back gradually, and sell the rest later.", "succession"],
  ["Sell it to us over time", "For selected businesses, we buy the company with part paid at completion and the rest paid over an agreed period, sometimes linked to results.", "succession"],
  ["We run it, you're paid from profits", "We take over day-to-day running through automation and a management agreement, and you're paid from the profits each year until the agreed price is reached. Ownership passes on the agreed schedule.", "succession"],
];
const STEPS = [
  ["Confidential chat", "Your goals, timeline and what matters to you — price, staff, a clean exit."],
  ["Free automation & readiness review", "Where the business depends on you, and what can run without you."],
  ["A written plan", "Which path fits, the work, and indicative terms."],
  ["Automate", "Built and tested with you; the business runs on its own."],
  ["Exit", "Sell, sell part, or sell to us — on the agreed terms."],
];
const LOOK: string[] = [
  "Profitable, trading 3+ years",
  "The owner does much of the admin, sales or scheduling",
  "In the US, UK, Australia or Canada",
  "Trades, clinics, professional firms, equipment rental, property, food production",
];
const FAQ: [string, string][] = [
  ["Is this confidential?", "Yes. We don't contact your staff, customers or suppliers without your permission, and we'll sign a confidentiality agreement before you share figures."],
  ["Why does automation matter when selling?", "Buyers pay less for a business that depends on its owner. Showing that bookings, invoicing and follow-ups run without you makes it easier to sell and to hand over."],
  ["Do you buy every business?", "No — only selected businesses after review. The other two paths are open to more owners."],
  ["What happens to my staff?", "That's part of the plan from the start. Many owners care about this most, and we agree it in writing."],
  ["Is being paid over time better for tax?", "It can spread the tax over the years you're paid — for example, US installment-sale rules tax the gain as payments arrive — but it doesn't make it tax-free, and rules differ by country. In the UK, selling to an Employee Ownership Trust can qualify for capital gains relief. Your accountant should confirm before you agree anything."],
  ["Do I need a broker or advisor?", "We recommend your own accountant and solicitor for any sale. We'll work alongside them."],
];

export default function Selling() {
  return (
    <main className="wrap flex flex-col gap-10 pb-16 pt-10">
      <section className="flex flex-col gap-3">
        <div className="kicker">For owners planning to step back</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Selling or retiring? Make the business run without you first.</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">Buyers pay less for a business that depends on its owner. We automate the work that sits on your desk — then you choose: sell for more, sell part to us, or sell it to us over time.</p>
        <div className="flex flex-wrap gap-3 pt-1"><Link href="/apply/?deal=succession" className="btn btn-primary">Start a confidential conversation</Link></div>
        <p className="m-0 text-[13px] text-muted">🔒 Confidential. Nothing up front for selected businesses.</p>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{PATHS.map(([t, d]) => <div key={t} className="card flex flex-col gap-2 p-5"><div className="font-display text-xl font-bold">{t}</div><p className="m-0 text-[15px] text-ink-2">{d}</p></div>)}</section>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">How it works</h2>
        <ol className="m-0 grid grid-cols-1 gap-3 p-0 md:grid-cols-5">{STEPS.map(([t, d], i) => <li key={t} className="card flex list-none flex-col gap-1 p-4 text-[14px]"><b className="text-muted">0{i + 1} · <span className="text-ink">{t}</span></b><span className="text-ink-2">{d}</span></li>)}</ol>
      </section>
      <section className="card flex flex-col gap-2 p-5">
        <h2 className="m-0 text-xl font-bold">What we look for</h2>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[15px] text-ink-2">{LOOK.map((x) => <li key={x}>✓ {x}</li>)}</ul>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions</h2>
        {FAQ.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mb-0 mt-2 text-ink-2">{a}</p></details>)}
        <p className="m-0 text-[12px] text-muted">Indicative only; any purchase or investment is subject to due diligence and a written agreement. This isn&apos;t financial, tax or legal advice.</p>
      </section>
    </main>
  );
}
