import { PAYMENTS_LIVE } from "@/lib/launch";
import Link from "next/link";
import { byId, howItWorks , runLow } from "@/lib/catalogue";
import { COUNTRIES, Country, localPrices, loc, money, SITE } from "@/lib/geo";
import { solutionBySlug } from "@/lib/solutions";
import { tradeBySlug } from "@/lib/trades";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";
import AddToCart from "@/components/AddToCart";
import MissedCallCalc from "@/components/MissedCallCalc";
import { SRCSET } from "@/lib/srcset";
import FixDemo from "@/components/FixDemo";
import { AUDIENCE } from "@/components/TradeFixView";

const SHORT: Record<string, Partial<Record<Country, string>>> = {
  "get-paid-faster": { us: "Invoice reminder automation + free email templates", ca: "Automated invoice reminders for Canadian firms", uk: "Credit control automation for Xero & QuickBooks", au: "Automatic invoice reminders for tradies (Xero)" },
  "missed-calls": { us: "Missed call text back for trades, cafés & clinics", ca: "Missed call text back & AI receptionist Canada", uk: "Missed call text back & AI receptionist UK", au: "Missed call text back & AI receptionist for tradies" },
  "quote-follow-up": { us: "Quote follow up automation + email templates", ca: "Quote follow up automation + templates (Canada)", uk: "Quote follow up automation for UK trades", au: "Quote follow up for tradies + email templates" },
  "google-reviews": { us: "Automate Google review requests", ca: "Automate Google review requests in Canada", uk: "Automate Google review requests (UK)", au: "Automate Google reviews for tradies" },
  "admin-hours": { us: "QuickBooks & Xero bank reconciliation automation", ca: "Xero bank reconciliation automation (Canada)", uk: "Invoice processing & Xero bank reconciliation", au: "Xero bank reconciliation automation (Australia)" },
  "ai-receptionist": { us: "AI receptionist for any small business", ca: "AI receptionist for Canadian small businesses", uk: "AI receptionist for UK small businesses", au: "AI receptionist for tradies (Australia)" },
  "profit-dashboard": { us: "Small business profit dashboard & monthly reports", ca: "Profit dashboard for Canadian small businesses", uk: "Management accounts pack & profit dashboard", au: "Monthly management reports & profit dashboard" },
};
/** Search-result title: ≤60 characters so Google doesn't cut it; brand added only when it fits. */
export const solutionMetaTitle = (slug: string, c: Country) => { const t = SHORT[slug]?.[c] ?? solutionTitle(slug, c); return t.length <= 45 ? `${t} | TaskAutoMode` : t; };
export const solutionTitle = (slug: string, c: Country) => { const s = solutionBySlug(slug); return s.local[c] ?? s.title; };

export default function SolutionView({ slug, country }: { slug: string; country: Country }) {
  const s = solutionBySlug(slug);
  const C = COUNTRIES[country];
  const L = (x: string) => loc(x, country);
  const fmt = (n: number) => money(n, country);
  const main = byId(s.fixes[0]);
  const others = s.fixes.slice(1).map(byId);
  const photo = TRADE_PHOTOS[s.trades[0][0]];
  const base = `${SITE}${C.path}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: s.short, item: `${base}/solutions/${s.slug}/` },
      ] },
      { "@type": "FAQPage", mainEntity: s.faq.map(([q, a]) => ({ "@type": "Question", name: L(q), acceptedAnswer: { "@type": "Answer", text: L(a) } })) },
      { "@type": "Service", name: L(main.name), provider: { "@type": "Organization", name: "TaskAutoMode" }, areaServed: country === "us" ? "US" : country === "uk" ? "GB" : country.toUpperCase(), offers: { "@type": "Offer", price: main.price, priceCurrency: "USD" } },
    ],
  };
  return (
    <main data-nocurrency={country !== "us" ? "" : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-white">
        <div className="wrap flex flex-wrap items-center gap-8 pb-10 pt-8">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <nav className="text-sm" aria-label="Breadcrumb"><Link href={`${C.path}/`}>Home</Link> › <span className="text-muted">{s.short}</span></nav>
            <h1 className="m-0 font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">{solutionTitle(slug, country)}</h1>
            {s.problem.map((p) => <p key={p} className="m-0 max-w-[680px] text-[17px] leading-relaxed text-ink-2">{L(p)}</p>)}
            {s.stat && country === "us" && (
              <p className="m-0 max-w-[680px] border-l-4 border-clay pl-3 text-[15px]"><b>{s.stat.text}</b> <a href={s.stat.url} rel="noopener" target="_blank" className="text-[13px]">{s.stat.source}</a></p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/checkout/?plan=${main.id}`} className="btn btn-primary">{PAYMENTS_LIVE ? "Buy" : "Reserve"} {L(main.name).toLowerCase()} — {fmt(main.price)}</Link>
              <AddToCart ids={[main.id]} />
              <Link href="/starter/" className="font-semibold text-ink">Or try one for {fmt(99)} →</Link>
            </div>
          </div>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} srcSet={SRCSET[s.trades[0][0]] } sizes="(min-width: 1024px) 560px, 100vw" width={photo.width} height={photo.height} alt="Illustrative photo: an owner sees the job done on their phone" className="aspect-[4/3] w-full min-w-0 flex-[1_1_360px] rounded-lg object-cover" />
          )}
        </div>
      </section>

      <section className="wrap flex flex-col gap-4 py-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">How it works</h2>
        <ol className="m-0 grid grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {howItWorks(main).map((h, i) => (
            <li key={h} className="card flex list-none gap-3 p-5 text-[15px]"><b className="text-muted">0{i + 1}</b><span>{L(h)}</span></li>
          ))}
        </ol>
        <div className="max-w-[640px]"><FixDemo slug={slug} country={country} /></div>
        {(slug === "missed-calls" || slug === "ai-receptionist") && <p className="m-0 text-ink-2">Not sure which you need? <Link href={`${C.path}/compare/missed-call-text-back-vs-ai-receptionist/`}>Compare text-back vs an AI receptionist →</Link></p>}
        {slug === "missed-calls" && country === "us" && <MissedCallCalc />}
      </section>

      {s.templates && (
        <section id="templates" className="wrap flex scroll-mt-20 flex-col gap-3 pb-10">
          <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">{s.templatesTitle ?? "Free quote follow-up email templates"}</h2>
          {slug === "get-paid-faster" && country === "uk" && <p className="m-0 text-ink-2">Owed by another business? <Link href="/tools/late-payment-interest-calculator/">Work out the statutory interest you can add →</Link></p>}
          <p className="m-0 text-ink-2">Copy these as they are. The automation sends them for you at the right time and stops as soon as the customer replies or pays.</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {s.templates.map(([when, body]) => (
              <div key={when} className="card flex flex-col gap-2 p-5"><b>{when}</b><p className="m-0 whitespace-pre-line text-[15px] text-ink-2">{L(body)}</p></div>
            ))}
          </div>
        </section>
      )}

      <section className="wrap flex flex-col gap-4 pb-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">What it costs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[main, ...others].map((p) => (
            <div key={p.id} className="card flex flex-col gap-2 p-5">
              <Link href={`/p/${p.id}/`} className="text-[17px] font-bold text-ink">{L(p.name)}</Link>
              <p className="m-0 text-[14px] text-ink-2">{L(p.desc)}</p>
              <div className="mt-auto text-2xl font-bold">{fmt(p.price)}{p.monthly ? "/mo" : ""}</div>
              {p.run && <div className="text-[13px] text-muted">then optional Run Lite support {fmt(runLow(p))}/mo</div>}
              <AddToCart ids={[p.id]} className="!min-h-[40px]" />
            </div>
          ))}
        </div>
        <p className="m-0 text-[14px] text-ink-2">Fixed price · approve the test run or get a full refund · you own everything we build.</p>
      </section>

      <section className="border-y border-line bg-white">
        <div className="wrap flex flex-col gap-4 py-10">
          <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">What it looks like in your business</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {s.trades.map(([t, how]) => (
              <Link key={t} href={country === "us" && AUDIENCE[t] ? `/for/${t}/${slug}/` : `${C.path}/for/${t}/`} className="card flex flex-col gap-1 p-4 text-ink no-underline hover:border-[#007185]">
                <b className="text-[#007185]">{L(tradeBySlug(t).name)} →</b>
                <span className="text-[15px] text-ink-2">{L(how)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap flex flex-col gap-3 py-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions owners ask</h2>
        {s.faq.map(([q, a]) => (
          <details key={q} className="card p-4"><summary className="cursor-pointer font-bold">{L(q)}</summary><p className="m-0 mt-2 text-ink-2">{L(a)}</p></details>
        ))}
      </section>
    </main>
  );
}
