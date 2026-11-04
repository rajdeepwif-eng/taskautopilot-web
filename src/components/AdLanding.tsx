import Link from "next/link";
import { PAYMENTS_LIVE } from "@/lib/launch";
import StickyBuy from "@/components/StickyBuy";
import { solutionBySlug } from "@/lib/solutions";
import { solutionTitle } from "@/components/SolutionView";
import { byId, runLow } from "@/lib/catalogue";
import { COUNTRIES, Country, loc, localPrices, money } from "@/lib/geo";
import FixDemo from "@/components/FixDemo";
import AddToCart from "@/components/AddToCart";

/**
 * Paid-search landing page: the headline repeats the search, one main action, the demo, the price.
 * Not indexed (it duplicates the guide); send ad clicks here with UTM tags.
 */
export default function AdLanding({ slug, country }: { slug: string; country: Country }) {
  const s = solutionBySlug(slug);
  const C = COUNTRIES[country];
  const L = (x: string) => localPrices(loc(x, country), country);
  const fmt = (n: number) => money(n, country);
  const main = byId(s.fixes[0]);
  const starter = byId(120);
  return (
    <main data-nocurrency={country !== "us" ? "" : undefined} className="pb-24 lg:pb-0">
      <section className="bg-white">
        <div className="wrap flex flex-col gap-3 pb-8 pt-8">
          <div className="kicker">Fixed price · set up for you{country !== "us" ? ` · ${C.name}` : ""}</div>
          <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,5vw,48px)] font-bold leading-[1.05] tracking-tight">{solutionTitle(slug, country)}</h1>
          <p className="m-0 max-w-[720px] text-lg text-ink-2">{L(s.problem[1] ?? s.problem[0])}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href={`/checkout/?plan=${main.id}`} className="btn btn-primary text-lg">Get it set up — {fmt(main.price)}</Link>
            <Link href="/starter/" className="font-semibold">Or try one for {fmt(starter.price)} →</Link>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 pt-1 text-[14px] text-ink-2">
            <li>✓ Live in about {main.days} business days</li><li>✓ Approve the test run or get the build fee back</li><li>✓ No sales call</li><li>✓ You own it</li>
          </ul>
        </div>
      </section>
      <section className="wrap grid grid-cols-1 items-start gap-6 py-8 lg:grid-cols-2">
        <FixDemo slug={slug} country={country} />
        <div className="flex flex-col gap-3">
          <div className="card flex flex-col gap-2 border-2 border-clay p-5">
            <b className="text-lg">{L(main.name)}</b>
            <span className="text-[15px] text-ink-2">{L(main.desc)}</span>
            <span className="text-3xl font-bold">{fmt(main.price)}</span>
            {main.run && <span className="text-[13px] text-muted">then optional Run Lite support {fmt(runLow(main))}/mo</span>}
            <div className="flex flex-wrap gap-3"><Link href={`/checkout/?plan=${main.id}`} className="btn btn-primary">{PAYMENTS_LIVE ? "Buy now" : "Reserve now"}</Link><AddToCart ids={[main.id]} /></div>
          </div>
          {s.faq.slice(0, 3).map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{L(q)}</summary><p className="mb-0 mt-2 text-ink-2">{L(a)}</p></details>)}
          <Link href={`${C.path}/solutions/${slug}/`} className="text-[14px]">Read the full guide →</Link>
        </div>
      </section>
      <StickyBuy>
        <span className="text-lg font-bold">{fmt(main.price)}</span>
        <Link href={`/checkout/?plan=${main.id}`} className="btn btn-primary !min-h-[44px] flex-1">{PAYMENTS_LIVE ? "Get it set up" : "Reserve now"}</Link>
      </StickyBuy>
    </main>
  );
}
