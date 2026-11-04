import type { Metadata } from "next";
import * as Launch from "@/lib/launch";
import { ON_TEMP_DOMAIN, SITE } from "@/lib/geo";
import { PARTNERS } from "@/data/partners";

export const metadata: Metadata = { title: { absolute: "Launch checklist | TaskAutopilot" }, robots: { index: false, follow: false } };

type Item = { step: string; who: string; how: string; done: boolean | null };

/** Internal: what's left before launch. Ticks come from the live site settings; null = can't be checked from the site. */
const ITEMS: [string, Item[]][] = [
  ["1 · Foundations", [
    { step: "Custom domain live", who: "You → me", how: "Buy the domain, add DNS records, then I set NEXT_PUBLIC_SITE_URL and the base path in the deploy workflow.", done: !ON_TEMP_DOMAIN },
    { step: "Google Search Console + sitemap submitted", who: "You", how: `Verify the domain, then submit ${SITE}/sitemap.xml.`, done: null },
    { step: "Legal pages signed off by attorney", who: "You + attorney", how: "Terms, refunds (incl. 6-month minimum and how the $99 starter is treated), privacy (incl. cookies), partner and referral terms.", done: null },
    { step: "Company details on the site", who: "You → me", how: "Legal name, address, phone and support email — and a local address/phone per country if you have them.", done: null },
  ]],
  ["2 · Taking leads and money", [
    { step: "Lead storage: Airtable base 'TaskAutopilot Leads'", who: "You", how: "One table: type, name, email, items, total, heard-about-us, partner code, source, campaign, date.", done: null },
    { step: "Slack alert channel", who: "You", how: "e.g. #taskautopilot-leads — every new lead and reservation posts here.", done: null },
    { step: "Form webhook (n8n) connected", who: "Me, after you approve", how: "Webhook → validate → Airtable → Slack. Then set LEAD_ENDPOINT.", done: !!Launch.LEAD_ENDPOINT },
    { step: "Forms switched on (after an end-to-end test)", who: "Me", how: "FORMS_LIVE = true. Forms then promise a reply within 1 business day.", done: Launch.FORMS_LIVE },
    { step: "Lead owner: Raj replies within 1 business day from day one", who: "You", how: "Slack alerts tag you.", done: null },
    { step: "Stripe connected, card payments on", who: "You → me", how: "Create the Stripe account; I connect Stripe Checkout and set PAYMENTS_LIVE = true.", done: Launch.PAYMENTS_LIVE },
    { step: "Next build start date set (capacity)", who: "You", how: "Tell me the first free start date; it shows on checkout and offer pages. Update it weekly.", done: !!Launch.NEXT_BUILD_START },
  ]],
  ["3 · Marketing switches", [
    { step: "GA4 + Google Ads conversion tag", who: "You → me", how: "Send the GA4 ID, Ads ID and conversion label; a cookie banner appears and nothing loads until visitors accept.", done: !!(Launch.GA4_ID && Launch.GOOGLE_ADS_ID && Launch.GOOGLE_ADS_CONVERSION_LABEL) },
    { step: "Meta pixel (for demo retargeting)", who: "You → me", how: "Send the pixel ID.", done: !!Launch.META_PIXEL_ID },
    { step: "Google Business Profile + review link", who: "You → me", how: "Create the profile; send the 'write a review' link for /review/.", done: !!Launch.GOOGLE_REVIEW_URL },
    { step: "First partners approved", who: "You → me", how: "After a partner signs terms, I add their code so clients see 'Recommended by…'.", done: Object.keys(PARTNERS).length > 0 },
    { step: "Client referral reward confirmed", who: "You", how: `Placeholder is $${Launch.REFERRAL_CREDIT_USD} each way; confirm, then I switch /refer/ on.`, done: Launch.REFERRALS_LIVE },
    { step: "Partner directories applied to", who: "You", how: "Xero, QuickBooks, Jobber and ServiceM8 partner / consultant directories (check each programme accepts service firms).", done: null },
    { step: "Print flyers (only after the domain is live)", who: "You", how: "Use /kit/ — one campaign name per street, event or partner.", done: null },
  ]],
];

export default function LaunchPage() {
  const all = ITEMS.flatMap(([, x]) => x);
  const checkable = all.filter((i) => i.done !== null);
  return (
    <main className="wrap flex flex-col gap-6 pb-16 pt-10">
      <div className="kicker">Internal · not indexed</div>
      <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">Launch checklist</h1>
      <p className="m-0 text-ink-2">{checkable.filter((i) => i.done).length} of {checkable.length} site switches done. Items marked ⬜ with no tick box can&apos;t be checked from the site — tell me when they&apos;re done.</p>
      {ITEMS.map(([group, items]) => (
        <section key={group} className="card overflow-hidden">
          <div className="bg-[#F7F8F8] px-4 py-3 font-bold">{group}</div>
          {items.map((i) => (
            <div key={i.step} className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-3 text-[15px]">
              <span className="w-6">{i.done === true ? "✅" : i.done === false ? "⬜" : "▫️"}</span>
              <span className="min-w-0 flex-[1_1_240px] font-semibold">{i.step}</span>
              <span className="w-[120px] text-muted">{i.who}</span>
              <span className="min-w-0 flex-[2_1_320px] text-ink-2">{i.how}</span>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
