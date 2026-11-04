import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/geo";
import LateInterestCalc from "./LateInterestCalc";
import { REFERENCE_RATE } from "./rate";

const URL = `${SITE}/tools/late-payment-interest-calculator/`;

export const metadata: Metadata = {
  title: { absolute: "Late payment interest calculator (UK) | TaskAutopilot" },
  description: `Work out statutory interest (8% + ${REFERENCE_RATE}% Bank of England reference rate) and fixed compensation on a late business invoice. Free, UK.`,
  alternates: { canonical: "./", languages: { "en-GB": URL } },
};

const FAQ: [string, string][] = [
  ["What is the statutory interest rate on late payments?", `8% plus the Bank of England reference rate, for business-to-business debts. With a ${REFERENCE_RATE}% reference rate for July–December 2026, that is ${(8 + REFERENCE_RATE).toFixed(2)}% a year.`],
  ["How much fixed compensation can I claim?", "£40 for a debt under £1,000, £70 for £1,000 to £9,999.99, and £100 for £10,000 or more, on top of interest."],
  ["Can I charge interest to consumers?", "No. Statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998 applies only between businesses (and to public-sector bodies paying businesses)."],
  ["What if my contract sets a different rate?", "Then the contract rate applies instead of statutory interest, as long as it's a substantial remedy. Check your terms."],
  ["How do I claim it?", "Send a new invoice or a statement showing the interest and compensation. Many businesses mention their right to statutory interest in their payment terms."],
];

export default function Page() {
  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Late payment interest calculator (UK)", url: URL, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } }) }} />
      <div className="flex flex-col gap-3">
        <div className="kicker">Free tool · United Kingdom</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">Late payment interest calculator (UK)</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">
          If another business pays you late, UK law lets you claim interest at 8% above the Bank of England reference rate, plus a fixed sum to cover recovery costs. Enter the invoice and dates to see what you can add.
        </p>
      </div>

      <LateInterestCalc />

      <section className="flex max-w-[860px] flex-col gap-3">
        <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">How it&apos;s worked out</h2>
        <p className="m-0 text-ink-2">Daily interest = amount owed × (8% + reference rate) ÷ 365. Multiply by the number of days late. Then add fixed compensation: £40 under £1,000, £70 from £1,000 to £9,999.99, £100 from £10,000.</p>
        <p className="m-0 text-ink-2">Example: £2,500 paid 30 days late at {(8 + REFERENCE_RATE).toFixed(2)}% is about £{((2500 * (8 + REFERENCE_RATE)) / 100 / 365 * 30).toFixed(2)} interest, plus £70 compensation.</p>
      </section>

      <section className="flex max-w-[860px] flex-col gap-3 rounded-xl border-2 border-ink bg-white p-6">
        <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">Rather not chase at all?</h2>
        <p className="m-0 text-ink-2">Our invoice reminder automation sends polite reminders before and after the due date, with a pay-now link, and flags stubborn accounts to you. It works with Xero, QuickBooks and Sage.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/uk/solutions/get-paid-faster/" className="btn btn-primary">See credit control automation</Link>
          <Link href="/uk/solutions/get-paid-faster/#templates" className="btn btn-outline">Free reminder email templates</Link>
        </div>
      </section>

      <section className="flex max-w-[860px] flex-col gap-2">
        <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mb-0 mt-2 text-ink-2">{a}</p></details>
        ))}
      </section>

      <p className="m-0 max-w-[860px] text-[13px] text-muted">
        Sources: <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt">GOV.UK — charging interest on commercial debt</a> ·{" "}
        <a href="https://www.legislation.gov.uk/ukpga/1998/20/contents">Late Payment of Commercial Debts (Interest) Act 1998</a> ·{" "}
        <a href="https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate">Bank of England Bank Rate</a>. Reference rate checked November 2026. This is general information, not legal advice.
      </p>
    </main>
  );
}
