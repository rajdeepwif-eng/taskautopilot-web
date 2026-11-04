import Link from "next/link";
import { TRADES } from "@/lib/trades";
import TradeIcon from "@/components/TradeIcon";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";

// Lead with the owner groups that earn the most (IRS-based study: Smith, Yagan, Zidar & Zwick, QJE 2019)
// and need the most admin automated; the rest follow.
const ORDER = ["trades", "clinics", "professional", "busy-professionals", "property", "equipment-hire", "manufacturing", "food-production", "restaurants", "logistics", "retail", "farming", "office-teams"];

export default function TradeGrid() {
  return (
    <section id="trades" className="wrap flex flex-col gap-5 pt-16">
      <div className="kicker">Start here</div>
      <h2 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">What&apos;s your business?</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {ORDER.map((slug) => TRADES.find((t) => t.slug === slug)!).filter(Boolean).map((t) => (
          <Link key={t.slug} href={`/for/${t.slug}/`} className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white text-ink no-underline hover:border-ink">
            <div className="relative aspect-[16/9] overflow-hidden">
              {TRADE_PHOTOS[t.slug]
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={TRADE_PHOTOS[t.slug].src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                : <TradeIcon slug={t.slug} size={38} />}
            </div>
            <div className="flex flex-col gap-0.5 p-3.5">
              <span className="font-display text-[17px] font-bold leading-tight group-hover:text-clay">{t.name}</span>
              <span className="text-[12.5px] text-muted">{t.short}</span>
            </div>
          </Link>
        ))}
        <Link href="/for/solo/" className="flex flex-col justify-center gap-0.5 rounded-xl border border-dashed border-[#C9C5B9] p-4 text-ink no-underline hover:border-ink">
          <span className="font-display text-[17px] font-bold">Just me</span>
          <span className="text-[12.5px] text-muted">Self-employed — Solo versions from $300</span>
        </Link>
      </div>
    </section>
  );
}

export function ThreeDoors() {
  const doors = [
    { k: "FIX ONE THING", t: "One problem, one fixed price", d: "Missed calls, invoices to Excel, reviews, your inbox — from $600, live in days.", href: "/library/", cta: "Shop quick fixes" },
    { k: "SET ME UP", t: "A starter kit for your trade", d: "The 3–4 automations businesses like yours need first, at one price.", href: "/kits/", cta: "See starter kits" },
    { k: "CHANGE HOW WE WORK", t: "Teams, accountability & training", d: "Delegation, SOPs, staff training, consulting and courses for growing teams.", href: "/consulting/", cta: "Talk team change" },
  ];
  return (
    <section className="wrap grid grid-cols-1 gap-4 pt-12 md:grid-cols-3">
      {doors.map((x, i) => (
        <Link key={x.k} href={x.href} className={`flex flex-col gap-2 rounded-2xl p-6 no-underline ${i === 1 ? "bg-ink text-paper" : "card text-ink"}`}>
          <span className={`font-mono text-xs ${i === 1 ? "text-amber" : "text-clay"}`}>{x.k}</span>
          <span className="font-display text-2xl font-bold">{x.t}</span>
          <span className={i === 1 ? "opacity-80" : "text-ink-2"}>{x.d}</span>
          <span className={`mt-auto pt-2 font-semibold ${i === 1 ? "text-amber" : "text-clay"}`}>{x.cta} →</span>
        </Link>
      ))}
    </section>
  );
}
