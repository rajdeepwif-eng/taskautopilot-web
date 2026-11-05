import type { Metadata } from "next";
import Link from "next/link";
import ServicesView from "@/components/ServicesView";

export const metadata: Metadata = {
  title: "Services: find it, build it, make it stick — TaskAutoMode",
  description: "How TaskAutoMode works: find what's worth automating, build it at a fixed price with a test run you approve, then make it stick with handover, a results panel and optional support.",
  alternates: { canonical: "/services/" },
};

const COMPARE: [string, string, string][] = [
  ["Price", "Usually on request, after a discovery call", "Fixed and shown on every automation"],
  ["Getting started", "Workshops and a scoping phase", "A free 2-minute scan, or pick a fix and start"],
  ["Time to live", "Often weeks to months", "Most automations live in 1–3 weeks"],
  ["Risk", "You pay for the project as it runs", "Approve the test run, or the build fee comes back"],
  ["Who it's for", "Larger companies with AI budgets", "Owner-run businesses and their teams"],
];

export default function Services() {
  return (
    <main className="pb-16">
      <section className="wrap flex flex-col gap-4 pt-10">
        <div className="kicker">Services</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(34px,5.5vw,54px)] font-bold leading-[1.04] tracking-tight">Automation your team actually uses — priced up front.</h1>
        <p className="m-0 max-w-[720px] text-xl text-ink-2">Shipping software isn&apos;t the goal. Getting paid faster, missing fewer calls and handing back hours each week is. Here&apos;s how we get you there.</p>
        <div className="flex flex-wrap gap-3 pt-1"><Link href="/scan/" className="btn btn-primary">Start with the free leak scan</Link><Link href="/library/" className="btn btn-outline">See fixed prices</Link></div>
      </section>
      <ServicesView />
      <section className="wrap flex flex-col gap-3 pt-16">
        <h2 className="m-0 font-display text-[clamp(24px,3.5vw,32px)] font-bold">How this compares with a typical AI consultancy</h2>
        <div className="flex flex-col gap-2 md:hidden">{COMPARE.map(([a, b, c]) => <div key={a} className="card flex flex-col gap-1 p-4"><b>{a}</b><span className="text-[14px] text-muted">Typical: {b}</span><span className="text-[15px]"><b className="text-clay">Us:</b> {c}</span></div>)}</div>
        <div className="hidden overflow-x-auto rounded-xl border border-line bg-white md:block">
          <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
            <thead><tr className="bg-[#F7F8F8] text-[13px] text-muted"><th className="px-4 py-3"> </th><th className="px-4 py-3">Typical AI consultancy</th><th className="px-4 py-3">TaskAutoMode</th></tr></thead>
            <tbody>{COMPARE.map(([a, b, c]) => <tr key={a} className="border-t border-line"><td className="px-4 py-3 font-semibold">{a}</td><td className="px-4 py-3 text-ink-2">{b}</td><td className="px-4 py-3">{c}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="m-0 text-[13px] text-muted">Large, custom AI programmes still suit a consultancy. If you need one, we&apos;ll say so.</p>
      </section>
    </main>
  );
}
