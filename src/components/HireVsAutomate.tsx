"use client";

import Link from "next/link";
import { COUNTRIES, Country, money } from "@/lib/geo";
import { HIRE_COST } from "@/lib/hireCost";
import { BUNDLES, byId } from "@/lib/catalogue";
import { fromMonthly } from "@/lib/deals";
import { useCurrency } from "@/components/Currency";

/** Side-by-side: what one admin hire costs a year vs our biggest-selling kit, in the visitor's country. */
export default function HireVsAutomate({ country: page = "us" }: { country?: Country }) {
  // On the global pages, follow the visitor's chosen currency so both sides use the same country.
  const { cur } = useCurrency();
  const country: Country = page === "us" ? (({ GBP: "uk", AUD: "au", CAD: "ca" } as Record<string, Country>)[cur] ?? "us") : page;
  const h = HIRE_COST[country];
  const C = COUNTRIES[country];
  const kit = BUNDLES.find((b) => b.name === "Trades starter kit")!;
  const kitPrice = Math.round(kit.ids.map(byId).filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0) * 0.9);
  const fmt = (n: number) => money(n, country);
  // Local prices are converted from US$; hire costs are local figures already.
  const local = (n: number) => C.sym + (Math.round(n / 100) * 100).toLocaleString("en-US");
  const kitLocal = country === "us" ? kitPrice : Math.round(kitPrice * C.rate);
  const pct = Math.round((kitLocal / h.total) * 100);
  return (
    <section className="wrap flex flex-col gap-4 pt-16" data-testid="hire-vs" data-nocurrency>
      <div className="kicker">What it saves</div>
      <h2 className="font-display m-0 text-[clamp(28px,4vw,36px)] font-bold tracking-tight">Hiring for this work costs every year. Automation is a one-off.</h2>
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="card flex flex-col gap-1 p-6">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-muted">One full-time admin / bookkeeper</div>
          <div className="font-display text-[44px] font-bold leading-none text-ink" data-nocurrency>{local(h.total)}<span className="text-xl font-semibold text-muted">/year</span></div>
          <div className="text-[14px] text-ink-2">{h.basis.charAt(0).toUpperCase() + h.basis.slice(1)}. Every year, plus holidays, sick cover and management time.</div>
        </div>
        <div className="flex items-center justify-center py-0 text-xl font-bold text-muted md:py-0" aria-hidden="true">vs</div>
        <div className="flex flex-col gap-1 rounded-xl border-2 border-clay bg-white p-6">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-clay">TaskAutoMode trades starter kit</div>
          <div className="font-display text-[44px] font-bold leading-none text-ink">{fmt(kitPrice)}<span className="text-xl font-semibold text-muted"> once</span></div>
          <div className="text-[14px] text-ink-2">Missed calls, quotes, invoices and reviews handled 24/7 — or from {fmt(fromMonthly(kitPrice))}/mo. Optional support plans.</div>
          <div className="text-[14px] font-semibold text-ok" data-testid="hire-pct">≈ {pct}% of one year&apos;s hiring cost</div>
          <div className="mt-2 flex flex-wrap gap-3"><Link href={`${C.path}/for/trades/#kit`} className="btn btn-primary !min-h-[44px]">See the kit</Link><Link href="/ways-to-pay/" className="self-center text-[14px]">All the ways to pay →</Link></div>
        </div>
      </div>
      <p className="m-0 text-[12.5px] text-muted">Automation takes on the repetitive part of the job — a person still handles judgement and relationships. Hire cost sources: {h.sources.map(([t, u], i) => <span key={u}>{i ? " · " : ""}<a href={u} rel="noopener">{t}</a></span>)}.</p>
    </section>
  );
}
