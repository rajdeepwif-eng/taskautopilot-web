import type { Metadata } from "next";
import Link from "next/link";
import DealCalculator from "@/components/DealCalculator";
import { EQUITY, HYBRID_MIN_CASH } from "@/lib/deals";
import { fmt } from "@/lib/catalogue";
import { seoTitle } from "@/lib/geo";

export const metadata: Metadata = {
  title: seoTitle("Automation for equity: startups"),
  description: `Strong founders, great idea, no time to build the back office? We build your automations for a small vesting stake (${EQUITY.minStake}–${EQUITY.maxStake}%), or part cash, part shares.`,
  alternates: { canonical: "./" },
};

const STEPS = [
  ["Apply", "3 minutes: team, idea, stage and what you need automated."],
  ["Review", "We look at the team, the market and the fit — and reply with a yes, a no, or questions."],
  ["Indicative terms", "In writing: what we build, its value, the stake, and the milestones it vests on."],
  ["Build", "Same process as every client: fixed scope, a test run you approve, a handover guide."],
  ["Vest", `The stake vests over about ${EQUITY.vestingMonths} months as agreed milestones are hit. Miss them on our side, and it doesn't vest.`],
];

const FAQ: [string, string][] = [
  ["How much equity do you take?", `From ${EQUITY.minStake}% up to ${EQUITY.maxStake}%. It's the value of what we build, times a risk multiple for your stage (3× pre-revenue down to 1× established), divided by an agreed company value. The earlier you are, the more risk we carry, so the bigger the stake. It's a minority stake; you keep control.`],
  ["What if we'd rather pay some cash?", `Part cash, part shares works: at least ${Math.round(HYBRID_MIN_CASH * 100)}% in cash and a smaller stake for the rest.`],
  ["What do you look for?", "A committed founding team, a company already set up, a clear way to make money, and a real need for automation (sales, operations, finance or support)."],
  ["What happens if the startup doesn't make it?", "Then our stake is worth nothing — that's the risk we take. You keep everything we built, documented, in your own accounts."],
  ["Do you join the board?", "No. We're a minority shareholder and a technical partner, not a manager. Information rights are agreed in the paperwork."],
];

export default function Startups() {
  return (
    <main className="wrap flex flex-col gap-10 pb-16 pt-10">
      <section className="flex flex-col gap-3">
        <div className="kicker">For startup founders</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">You build the company. We automate it — for a small share.</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">Strong founders with a good idea rarely have time (or cash) to build the back office: lead handling, onboarding, invoicing, reporting. We build those automations for a small vesting stake instead of a bill.</p>
        <div className="flex flex-wrap gap-3 pt-1"><Link href="/apply/?deal=equity" className="btn btn-primary">Apply for automation for equity</Link><Link href="/apply/?deal=hybrid" className="btn btn-outline">Part cash, part shares</Link></div>
        <p className="m-0 text-[13px] text-muted">Builds from {fmt(EQUITY.minBuildValue)} in value. Selected startups only.</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">How it works</h2>
        <ol className="m-0 grid grid-cols-1 gap-3 p-0 md:grid-cols-5">{STEPS.map(([t, d], i) => <li key={t} className="card flex list-none flex-col gap-1 p-4 text-[14px]"><b className="text-muted">0{i + 1} · <span className="text-ink">{t}</span></b><span className="text-ink-2">{d}</span></li>)}</ol>
      </section>
      <section id="hybrid" className="flex scroll-mt-20 flex-col gap-3">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Work out a stake</h2>
        <DealCalculator start={EQUITY.minBuildValue} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions</h2>
        {FAQ.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mb-0 mt-2 text-ink-2">{a}</p></details>)}
        <p className="m-0 text-[12px] text-muted">Indicative only. Any stake is agreed in a written shareholder agreement after review. Take your own legal and tax advice.</p>
      </section>
    </main>
  );
}
