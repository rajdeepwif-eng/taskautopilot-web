import Link from "next/link";
import { solutionBySlug } from "@/lib/solutions";
import { tradeBySlug } from "@/lib/trades";
import { byId, runLow } from "@/lib/catalogue";
import { SITE, money } from "@/lib/geo";
import AddToCart from "@/components/AddToCart";
import FixDemo from "@/components/FixDemo";

/** How people search for each fix. */
export const FIX_PHRASE: Record<string, string> = {
  "get-paid-faster": "Automatic invoice reminders",
  "missed-calls": "Missed call text back",
  "quote-follow-up": "Quote follow-up automation",
  "google-reviews": "Google review requests",
  "admin-hours": "Admin automation",
  "profit-dashboard": "Profit dashboard",
  "ai-receptionist": "AI receptionist",
};
/** Who the page is for, as they describe themselves. */
export const AUDIENCE: Record<string, string> = {
  trades: "contractors & home services",
  clinics: "clinics & dental practices",
  "equipment-hire": "equipment rental companies",
  property: "property managers & landlords",
  professional: "law & accounting firms",
  restaurants: "restaurants",
  "food-production": "food producers & wholesalers",
  solo: "self-employed & one-person businesses",
};
/** What a customer typically asks in that trade (sample data for the demo). */
const ASK: Record<string, string> = {
  trades: "Can someone fix a leaking water heater this week?",
  clinics: "Do you have an appointment on Thursday?",
  "equipment-hire": "Is a mini excavator free this Saturday?",
  property: "The heating in my unit isn't working.",
  professional: "I need help reviewing a contract.",
  restaurants: "Table for four tonight at 7?",
  "food-production": "Can you quote 200 cases for next week?",
  solo: "Are you free to quote a job this week?",
};

export const tradeFixTitle = (trade: string, fix: string) => `${FIX_PHRASE[fix]} for ${AUDIENCE[trade]}`;

export default function TradeFixView({ trade, fix }: { trade: string; fix: string }) {
  const s = solutionBySlug(fix);
  const t = tradeBySlug(trade);
  const line = s.trades.find(([k]) => k === trade)?.[1] ?? "";
  const fmt = (n: number) => money(n, "us");
  const products = s.fixes.map(byId);
  const title = tradeFixTitle(trade, fix);
  const url = `${SITE}/for/${trade}/${fix}/`;
  const faq: [string, string][] = [...s.faq.slice(0, 3), ...t.faq.slice(0, 1)];
  const others = s.trades.filter(([k]) => k !== trade && AUDIENCE[k]);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: t.name, item: `${SITE}/for/${trade}/` }, { "@type": "ListItem", position: 3, name: title, item: url }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
      <section className="wrap flex flex-col gap-3 pb-6 pt-10">
        <nav className="text-sm"><Link href="/">Home</Link> › <Link href={`/for/${trade}/`}>{t.name}</Link> › <span className="text-muted">{FIX_PHRASE[fix]}</span></nav>
        <div className="kicker">{t.name} · {s.short}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">{title}</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">{line} Set up for you at a fixed price, tested with you before it goes live.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href={`/checkout/?plan=${products[0].id}`} className="btn btn-primary">Get {products[0].name.toLowerCase()} — {fmt(products[0].price)}</Link>
          <Link href={`/solutions/${fix}/`} className="btn btn-outline">How it works</Link>
        </div>
      </section>

      <section className="wrap grid grid-cols-1 items-start gap-6 pb-10 lg:grid-cols-2">
        <FixDemo slug={fix} ask={ASK[trade]} />
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">Where {AUDIENCE[trade].split(" & ")[0]} lose time and money</h2>
          {t.pains.slice(0, 3).map(([pain, fixText]) => (
            <div key={pain} className="card flex flex-col gap-1 p-4"><b>{pain}</b><span className="text-[15px] text-ink-2">{fixText}</span></div>
          ))}
          <div className="text-[14px] text-ink-2">Works with {t.apps} — and most others with an API.</div>
        </div>
      </section>

      <section className="wrap flex flex-col gap-4 pb-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Fixed prices</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <div key={p.id} className={`card flex flex-col gap-2 p-5 ${i === 0 ? "border-2 border-clay" : ""}`}>
              <Link href={`/p/${p.id}/`} className="font-bold text-ink">{p.name}</Link>
              <div className="text-[14px] text-ink-2">{p.desc}</div>
              <div className="mt-auto text-xl font-bold">{p.monthly ? `${fmt(p.price)}/mo` : fmt(p.price)}</div>
              {p.run && <div className="text-[13px] text-muted">then optional Run Lite support {fmt(runLow(p))}/mo</div>}
              <AddToCart ids={[p.id]} />
            </div>
          ))}
        </div>
        <p className="m-0 text-ink-2">Want the full set for {AUDIENCE[trade].split(" & ")[0]}? <Link href={`/for/${trade}/#kit`}>See the {t.kit.toLowerCase()}</Link>.</p>
      </section>

      <section className="wrap flex flex-col gap-2 pb-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions</h2>
        {faq.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mb-0 mt-2 text-ink-2">{a}</p></details>)}
      </section>

      {others.length > 0 && (
        <section className="wrap flex flex-col gap-2 pb-16">
          <h2 className="m-0 text-lg font-bold">{FIX_PHRASE[fix]} for other businesses</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2">{others.map(([k]) => <Link key={k} href={`/for/${k}/${fix}/`}>{tradeFixTitle(k, fix)}</Link>)}</div>
        </section>
      )}
    </main>
  );
}
