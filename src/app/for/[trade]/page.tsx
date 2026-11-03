import type { Metadata } from "next";
import Link from "next/link";
import { BUNDLES, byId, fmt, priceLabel, defaultHours, exampleYearly } from "@/lib/catalogue";
import { TRADES, tradeBySlug } from "@/lib/trades";
import { CatArt } from "@/components/CatArt";

export function generateStaticParams() {
  return TRADES.map((t) => ({ trade: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string }> }): Promise<Metadata> {
  const t = tradeBySlug((await params).trade);
  return { title: `Automation for ${t.name} — TaskAutopilot`, description: t.headline };
}

export default async function TradePage({ params }: { params: Promise<{ trade: string }> }) {
  const t = tradeBySlug((await params).trade);
  const kit = BUNDLES.find((b) => b.name === t.kit);
  const kitItems = kit ? kit.ids.map(byId) : [];
  const kitFull = kitItems.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
  const top = t.top.map(byId);
  return (
    <main className="pb-24 lg:pb-0">
      <section className="wrap flex flex-col gap-4 pb-8 pt-12">
        <Link href="/#trades" className="text-sm">← All trades</Link>
        <div className="kicker">{t.name} · {t.short}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.05] tracking-tight">{t.headline}</h1>
      </section>

      <section className="border-y border-line bg-[#ECEAE2]">
        <div className="wrap grid grid-cols-1 gap-5 py-10 md:grid-cols-3">
          {t.pains.map(([pain, fix]) => (
            <div key={pain} className="flex flex-col gap-2">
              <div className="font-display text-xl font-bold leading-snug">{pain}</div>
              <div className="text-[15px] text-ink-2">→ {fix}</div>
            </div>
          ))}
        </div>
      </section>

      {kit && (
        <section className="wrap py-12">
          <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-ink p-6 text-paper md:p-8">
            <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-2">
              <div className="font-mono text-xs text-amber">START HERE · ONE PRICE · ONE SETUP</div>
              <h2 className="m-0 font-display text-3xl font-bold">{kit.name}</h2>
              <p className="m-0 opacity-80">{kit.desc}</p>
              <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[15px]">
                {kitItems.map((p) => <li key={p.id}>✓ {p.name}</li>)}
              </ul>
            </div>
            <div className="flex flex-[1_1_220px] flex-col gap-2">
              <div><b className="font-display text-4xl text-amber">{fmt(kitFull * 0.9)}</b> <span className="text-sm opacity-80">save {fmt(kitFull * 0.1)} vs separately</span></div>
              <Link href={`/checkout/?plan=${kit.ids.join(",")}`} className="btn btn-primary">Buy the kit</Link>
              <Link href="/planner/" className="text-center text-sm text-amber">Not sure? Build my plan →</Link>
            </div>
          </div>
        </section>
      )}

      <section className="wrap flex flex-col gap-4 pb-12">
        <h2 className="m-0 font-display text-[30px]">Or fix one thing first</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {top.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
              <Link href={`/p/${p.id}/`} className="relative block aspect-[16/8]" aria-label={p.name}><CatArt cat={p.cat} size={44} /></Link>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <Link href={`/p/${p.id}/`} className="font-display text-[17px] font-bold text-ink">{p.name}</Link>
                <p className="m-0 line-clamp-2 text-[13.5px] text-ink-2">{p.desc}</p>
                {p.wage && <p className="m-0 text-[12.5px] text-muted">Example: {defaultHours(p)} hrs/week ≈ {fmt(exampleYearly(p))}/yr of a {p.role}&apos;s time</p>}
                <div className="mt-auto pt-2 font-display text-2xl font-bold">{priceLabel(p)}</div>
                <Link href={`/checkout/?plan=${p.id}`} className="btn btn-primary !min-h-[40px]">Buy now</Link>
              </div>
            </article>
          ))}
        </div>
        <Link href={t.industry ? `/library/?industry=${encodeURIComponent(t.industry)}` : "/library/"} className="font-semibold">See every automation for {t.name.toLowerCase()} →</Link>
      </section>

      <section className="wrap grid grid-cols-1 gap-6 pb-14 md:grid-cols-2">
        <div className="card flex flex-col gap-2 p-6">
          <div className="font-display text-xl font-bold">Works with the apps you already use</div>
          <div className="text-ink-2">{t.apps} — and most others with an API.</div>
        </div>
        <div className="card flex flex-col gap-3 p-6">
          <div className="font-display text-xl font-bold">Questions owners ask</div>
          {t.faq.map(([q, a]) => (
            <details key={q} className="border-t border-line pt-2"><summary className="cursor-pointer font-semibold">{q}</summary><p className="m-0 pt-1.5 text-[15px] text-ink-2">{a}</p></details>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-paper p-3 lg:hidden">
        {kit && <Link href={`/checkout/?plan=${kit.ids.join(",")}`} className="btn btn-primary flex-1 !min-h-[44px]">Buy the kit · {fmt(kitFull * 0.9)}</Link>}
        <Link href="/planner/" className="btn btn-outline !min-h-[44px]">Plan</Link>
      </div>
    </main>
  );
}
