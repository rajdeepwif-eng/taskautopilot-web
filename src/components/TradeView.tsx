import Link from "next/link";
import { PAYMENTS_LIVE } from "@/lib/launch";
import { BUNDLES, byId, defaultHours, exampleYearly, exampleRate } from "@/lib/catalogue";
import { tradeBySlug } from "@/lib/trades";
import { CatArt } from "@/components/CatArt";
import { COUNTRIES, Country, localPrices, money, loc, SITE } from "@/lib/geo";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";
import AddToCart from "@/components/AddToCart";
import { runLow } from "@/lib/catalogue";
import { SRCSET } from "@/lib/srcset";

export default function TradeView({ slug, country }: { slug: string; country: Country }) {
  const raw = tradeBySlug(slug);
  const L = (x: string) => loc(x, country);
  const t = { ...raw, name: L(raw.name), short: L(raw.short), headline: L(raw.headline), pains: raw.pains.map(([a, b]) => [L(a), L(b)] as [string, string]), faq: raw.faq.map(([a, b]) => [L(a), L(b)] as [string, string]), journey: raw.journey?.map(([st, ids]) => [L(st), ids] as [string, number[]]) };
  const fmt = (n: number) => money(n, country);
  const priceLabel = (p: { price: number; monthly?: boolean }) => fmt(p.price) + (p.monthly ? "/mo" : "");
  const C = COUNTRIES[country];
  const kit = BUNDLES.find((b) => b.name === t.kit);
  const kitItems = kit ? kit.ids.map(byId) : [];
  const kitFull = kitItems.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
  const top = t.top.map(byId);
  const cheapest = Math.min(...top.filter((p) => !p.monthly).map((p) => p.price));
  const kitRun = kitItems.reduce((a, p) => a + (runLow(p) || 0), 0);
  return (
    <main className="pb-24 lg:pb-0" data-nocurrency={country !== "us" ? "" : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}${C.path}/` }, { "@type": "ListItem", position: 2, name: t.name, item: `${SITE}${C.path}/for/${slug}/` }] }) }} />
      <section className="wrap flex flex-wrap items-center gap-8 pb-8 pt-12">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-4">
          <Link href={`${C.path}/#trades`} className="text-sm">← All trades</Link>
          <div className="kicker">{t.name} · {t.short}{country !== "us" ? ` · ${C.name}` : ""}</div>
          <h1 className="m-0 max-w-[900px] font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.05] tracking-tight">{t.headline}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#fixes" className="btn btn-primary">Start with one fix — from {fmt(cheapest)}</a>
            {kit && <a href="#kit" className="btn btn-outline">See the starter kit — {fmt(kitFull * 0.9)}</a>}
            <Link href="/starter/" className="font-semibold text-ink">Or try one for {fmt(99)} →</Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-ink-2"><span>✓ Fixed price</span><span>✓ Approve the test run or full refund</span>{PAYMENTS_LIVE && <span>✓ Secure Stripe checkout</span>}</div>
        </div>
        {TRADE_PHOTOS[slug] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={TRADE_PHOTOS[slug].src} srcSet={SRCSET[slug]} sizes="(min-width: 1024px) 560px, 100vw" fetchPriority="high" width={TRADE_PHOTOS[slug].width} height={TRADE_PHOTOS[slug].height} alt={`Illustrative photo: in ${t.name.toLowerCase()}, the result appears in the software the business already uses, marked as done by the AI assistant`} className="aspect-[3/2] w-full min-w-0 flex-[1_1_380px] rounded-2xl object-cover" />
        )}
      </section>

      <section className="border-y border-line bg-white">
        <div className="wrap pt-8 text-[14px] font-bold text-muted">The problems owners in this trade tell us about most</div>
        <div className="wrap grid grid-cols-1 gap-5 pb-10 pt-3 md:grid-cols-3">
          {t.pains.map(([pain, fix]) => (
            <div key={pain} className="flex flex-col gap-2">
              <div className="font-display text-xl font-bold leading-snug">{pain}</div>
              <div className="text-[15px] text-ink-2">→ {fix}</div>
            </div>
          ))}
        </div>
      </section>

      {kit && (
        <section id="kit" className="wrap scroll-mt-20 py-12">
          <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-ink p-6 text-paper md:p-8">
            <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-2">
              <div className="text-sm font-bold text-amber">Start here · one price · one setup</div>
              <h2 className="m-0 font-display text-3xl font-bold">{L(kit.name)}</h2>
              <p className="m-0 opacity-80">{L(kit.desc)}</p>
              <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[15px]">
                {kitItems.map((p) => <li key={p.id}>✓ {L(p.name)}</li>)}
              </ul>
            </div>
            <div className="flex flex-[1_1_220px] flex-col gap-2">
              <div><b className="font-display text-4xl text-amber">{fmt(kitFull * 0.9)}</b> <span className="text-sm opacity-80">save 10% vs buying separately</span></div>
              {kitRun > 0 && <div className="text-[13px] opacity-80">+ ongoing support from {fmt(kitRun)}/mo (optional)</div>}
              <Link href={`/checkout/?plan=${kit.ids.join(",")}`} className="btn btn-primary">Buy the kit</Link>
              <AddToCart ids={kit.ids} label="Add kit to cart" />
              <Link href="/ask/" className="text-center text-sm text-amber">Not sure? Get a free recommendation →</Link>
            </div>
          </div>
        </section>
      )}


      {t.journey && (
        <section className="wrap pb-12">
          <h2 className="m-0 pb-1 font-display text-[30px] font-bold">Covered end to end</h2>
          <p className="m-0 pb-5 text-ink-2">{L("Every step from the first inquiry to the office work afterwards — tap a step to see the automation.")}</p>
          <ol className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {t.journey.map(([stage, ids], i) => (
              <li key={stage} className="flex gap-3 rounded-xl border border-line bg-white p-3.5">
                <span className="text-sm font-bold text-clay">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-1">
                  <b className="text-[15px]">{stage}</b>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                    {ids.map((id) => <Link key={id} href={`/p/${id}/`} className="inline-block py-1.5">{L(byId(id).name.split(" — ")[0])}</Link>)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="m-0 pt-3 text-sm text-muted">A step we haven&apos;t listed? <Link href="/ask/">Ask free</Link> — we can usually build it.</p>
        </section>
      )}
      <section id="fixes" className="wrap flex scroll-mt-20 flex-col gap-4 pb-12">
        <h2 className="m-0 font-display text-[30px] font-bold">Or fix one thing first</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {top.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
              <Link href={`/p/${p.id}/`} className="relative block aspect-[16/8]" aria-label={p.name}><CatArt cat={p.cat} size={44} /></Link>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <Link href={`/p/${p.id}/`} className="font-display text-[17px] font-bold text-ink">{L(p.name)}</Link>
                <p className="m-0 line-clamp-2 text-[13.5px] text-ink-2">{L(p.desc)}</p>
                {p.wage && country === "us" && <p className="m-0 text-[12.5px] text-muted">Example: {defaultHours(p)} hrs/week of a {p.role}&apos;s time at ${exampleRate(p)}/hr ≈ {fmt(exampleYearly(p))}/yr</p>}
                <div className="mt-auto pt-2 font-display text-2xl font-bold">{priceLabel(p)}</div>
                {p.run && <span className="text-[13px] text-muted">then optional Run Lite support {fmt(runLow(p))}/mo</span>}
                <AddToCart ids={[p.id]} className="!min-h-[40px]" />
                <Link href={`/checkout/?plan=${p.id}`} className="btn btn-primary !min-h-[40px]">{PAYMENTS_LIVE ? "Buy now" : "Reserve now"}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2"><Link href={t.industry ? `/library/?industry=${encodeURIComponent(t.industry)}` : "/library/"} className="font-semibold">See every automation for {t.name.toLowerCase()} →</Link><Link href="/ask/" className="font-semibold">Don&apos;t see your task? Ask free — we can usually build it →</Link></div>
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

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white p-3 lg:hidden">
        {kit && <Link href={`/checkout/?plan=${kit.ids.join(",")}`} className="btn btn-primary flex-1 !min-h-[44px]">Buy the kit · {fmt(kitFull * 0.9)}</Link>}
        <Link href="/ask/" className="btn btn-outline !min-h-[44px]">Ask free</Link>
      </div>
    </main>
  );
}
