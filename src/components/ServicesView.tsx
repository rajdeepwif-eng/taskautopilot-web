import Link from "next/link";
import { fmt } from "@/lib/catalogue";

/**
 * Our services as three steps, modelled on how leading AI consultancies present an engagement
 * (find what's worth automating → build it properly → make it stick) — but with prices and timings on the page.
 */
export const PHASES: { n: string; name: string; line: string; does: string[]; links: [string, string][] }[] = [
  {
    n: "01", name: "Find it", line: "Work out what's worth automating before you spend anything.",
    does: ["Free 2-minute leak scan of your week", "Ask us free: a reply with what we'd automate first", `Paid audit (${fmt(499)}): ranked plan, fixed quotes, payback for each`, "Hours and money each fix saves, on your numbers"],
    links: [["Run the free leak scan", "/scan/"], ["Book the paid audit", "/consulting/#audit"]],
  },
  {
    n: "02", name: "Build it", line: "Built properly, tested with you, live in days — not a demo.",
    does: ["Fixed price agreed before we start", "Built inside your own accounts and apps", "You approve a test run before anything goes live", "Security and access set up with your own logins"],
    links: [["Shop fixed-price automations", "/library/"], ["Something bespoke", "/bespoke/"]],
  },
  {
    n: "03", name: "Make it stick", line: "An automation only counts if your team actually uses it.",
    does: ["Handover document and a short walkthrough for your team", "Results panel: hours saved, inquiries answered, money collected", "Optional Run plans: monitoring, alerts and fixes", "Courses so your team can run and extend it"],
    links: [["See the results panel", "/results/"], ["Team courses", "/academy/"]],
  },
];

const PROMISES: [string, string][] = [
  ["Prices on the page", "Every automation has a fixed price before you talk to anyone."],
  ["No science projects", "We build proven workflows for real jobs — calls, quotes, invoices, bookings."],
  ["You own it", "It runs in your accounts. Leave any time and keep everything we built."],
  ["Approve before go-live", "Nothing goes live until you've seen the test run. If it isn't right, the build fee comes back."],
];

export default function ServicesView({ compact = false }: { compact?: boolean }) {
  return (
    <section className="wrap flex flex-col gap-6 pt-16" data-testid="services">
      <div className="flex flex-col gap-2">
        <div className="kicker">How we work</div>
        <h2 className="font-display m-0 max-w-[820px] text-[clamp(28px,4vw,40px)] font-bold leading-tight tracking-tight">From busywork to running on its own — in three steps.</h2>
        {!compact && <p className="m-0 max-w-[720px] text-lg text-ink-2">Most firms make you sit through discovery workshops before you see a price. We show the price first, build it with you, and stay until it&apos;s part of how your business runs.</p>}
      </div>
      <ol className="m-0 grid grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {PHASES.map((p) => (
          <li key={p.n} className="card flex list-none flex-col gap-3 p-6">
            <div className="flex items-baseline gap-3"><span className="font-mono text-sm text-clay">{p.n}</span><h3 className="m-0 font-display text-2xl font-bold">{p.name}</h3></div>
            <p className="m-0 font-semibold">{p.line}</p>
            {!compact && <ul className="m-0 flex flex-col gap-1.5 pl-5 text-[15px] text-ink-2">{p.does.map((d) => <li key={d}>{d}</li>)}</ul>}
            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[14px]">{p.links.map(([t, h]) => <Link key={h} href={h}>{t} →</Link>)}</div>
          </li>
        ))}
      </ol>
      {compact ? (
        <Link href="/services/" className="self-start text-[15px] font-semibold">How we work, step by step →</Link>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(([t, d]) => <div key={t} className="flex flex-col gap-1 rounded-xl bg-white p-4"><b>{t}</b><span className="text-[14px] text-ink-2">{d}</span></div>)}
        </div>
      )}
    </section>
  );
}
