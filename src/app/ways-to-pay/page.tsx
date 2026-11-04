import type { Metadata } from "next";
import Link from "next/link";
import { DEALS, PLAN_TERMS, RESULTS, fromMonthly, planFor } from "@/lib/deals";
import { byId, fmt } from "@/lib/catalogue";
import DealCalculator from "@/components/DealCalculator";
import { HIRE_COST } from "@/lib/hireCost";
import { COUNTRIES, Country } from "@/lib/geo";
import { SITE, seoTitle } from "@/lib/geo";

export const metadata: Metadata = {
  title: seoTitle("Ways to pay for automation: monthly, results, shares"),
  description: "Can't pay up front? Spread the cost monthly, pay from measured results, swap part of the price for shares, or plan your exit. Indicative terms, agreed in writing.",
  alternates: { canonical: "./" },
};

const FAQ: [string, string][] = [
  ["Is there interest on monthly plans?", `There's no interest rate: a fixed amount is added for spreading the cost (${PLAN_TERMS.map((t) => `${Math.round(t.uplift * 100)}% over ${t.months} months`).join(", ")}). You see the total before you agree.`],
  ["How are results measured for 'pay from results'?", "We agree the measure before we start — for example money recovered from overdue invoices, or jobs booked from missed calls — and both sides see the same report each month."],
  ["What happens if the results don't come?", `You've paid the setup fee only. Our share comes from measured gains, and it stops after ${RESULTS.months} months or at the cap, whichever comes first.`],
  ["Do you take control of my company with shares?", "No. Stakes are minority stakes — usually 2–5% for established businesses and up to 20% for pre-revenue startups, because we carry more risk early, they vest as agreed milestones are hit, and you keep control."],
  ["Is every business eligible?", "Pay up front and pay monthly are open to most businesses (monthly plans are subject to approval). Results, shares and exit deals are for selected businesses after a short review."],
];

function HireCompare() {
  const rows = (["us", "uk", "au", "ca"] as Country[]).map((c) => ({ c, h: HIRE_COST[c], C: COUNTRIES[c] }));
  return (
    <section className="flex flex-col gap-3" data-testid="hire-table" data-nocurrency>
      <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">What hiring for this work costs, per year</h2>
      <p className="m-0 text-[12.5px] text-muted md:hidden">Swipe the table sideways to see every column →</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <thead><tr className="bg-[#F7F8F8] text-[13px] text-muted"><th className="px-4 py-3">Country</th><th className="px-4 py-3">Pay</th><th className="px-4 py-3">Employer costs</th><th className="px-4 py-3">Total a year</th><th className="px-4 py-3">Based on</th></tr></thead>
          <tbody>{rows.map(({ c, h, C }) => (
            <tr key={c} className="border-t border-line align-top"><td className="px-4 py-3 font-semibold">{C.name}</td><td className="px-4 py-3">{C.sym}{h.salary.toLocaleString("en-US")}</td><td className="px-4 py-3">{h.onCost ? C.sym + h.onCost.toLocaleString("en-US") : "not included"}</td><td className="px-4 py-3 font-bold">{C.sym}{h.total.toLocaleString("en-US")}</td><td className="px-4 py-3 text-[13px] text-ink-2">{h.basis} · {h.sources.map(([t, u], i) => <span key={u}>{i ? ", " : ""}<a href={u} rel="noopener">{t.split(" — ")[0]}</a></span>)}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <p className="m-0 text-[13px] text-muted">One full-time admin or bookkeeping role. Automation takes on the repetitive part — compare with a one-off build, or spread it monthly below.</p>
    </section>
  );
}

export default function WaysToPay() {
  const lead = byId(10), missed = byId(11);
  return (
    <main className="wrap flex flex-col gap-10 pb-16 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })), url: `${SITE}/ways-to-pay/` }) }} />
      <section className="flex flex-col gap-3">
        <div className="kicker">Ways to work with us</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Don&apos;t want to pay it all up front? Pick how you pay.</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">Hiring someone to do this work can cost tens of thousands a year. Our builds are a fixed price, and you can spread it, pay from results, swap part of it for shares — or, if you&apos;re planning to sell or retire, let the automation raise what your business is worth.</p>
      </section>

      <HireCompare />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEALS.map((d) => (
          <div key={d.id} id={d.id} className="card flex scroll-mt-20 flex-col gap-2 p-5" data-testid={`deal-${d.id}`}>
            <div className="font-display text-xl font-bold">{d.name}</div>
            <div className="text-[13px] font-semibold text-clay">{d.forWho}</div>
            <p className="m-0 text-[15px] text-ink-2">{d.how}</p>
            <div className="text-[14px]"><b>You pay:</b> {d.youPay}</div>
            <div className="text-[14px] text-ink-2"><b>Best when:</b> {d.bestWhen}</div>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              {d.id === "upfront" ? <Link href="/library/" className="btn btn-outline !min-h-[44px]">Shop fixed prices</Link> : <Link href={`/apply/?deal=${d.id}`} className="btn btn-primary !min-h-[44px]">Apply</Link>}
              {(d.id === "equity" || d.id === "hybrid") && <Link href="/startups/" className="self-center text-[14px]">For startups →</Link>}
              {d.id === "succession" && <Link href="/selling-or-retiring/" className="self-center text-[14px]">How it works →</Link>}
            </div>
          </div>
        ))}
      </section>

      <section id="monthly" className="flex scroll-mt-20 flex-col gap-3">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Pay monthly: examples</h2>
        <p className="m-0 text-[12.5px] text-muted md:hidden">Swipe the table sideways to see every column →</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
            <thead><tr className="bg-[#F7F8F8] text-[13px] text-muted"><th className="px-4 py-3">Automation</th><th className="px-4 py-3">Up front</th>{PLAN_TERMS.map((t) => <th key={t.months} className="px-4 py-3">{t.months} months</th>)}</tr></thead>
            <tbody>
              {[missed, lead].map((p) => (
                <tr key={p.id} className="border-t border-line"><td className="px-4 py-3"><Link href={`/p/${p.id}/`}>{p.name}</Link></td><td className="px-4 py-3">{fmt(p.price)}</td>
                  {PLAN_TERMS.map((t) => { const x = planFor(p.price, t.months); return <td key={t.months} className="px-4 py-3">{fmt(x.deposit)} + {fmt(x.monthly)}/mo</td>; })}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-[13px] text-muted">Deposit + monthly payments. From {fmt(fromMonthly(missed.price))}/mo. Subject to approval.</p>
      </section>

      <section id="results" className="flex scroll-mt-20 flex-col gap-3">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Work out your deal</h2>
        <DealCalculator start={lead.price} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions</h2>
        {FAQ.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mb-0 mt-2 text-ink-2">{a}</p></details>)}
        <p className="m-0 text-[12px] text-muted">All terms are indicative and agreed in writing after a review. This isn&apos;t financial, tax or legal advice.</p>
      </section>
    </main>
  );
}
