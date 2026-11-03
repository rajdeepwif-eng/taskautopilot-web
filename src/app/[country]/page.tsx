import type { Metadata } from "next";
import Link from "next/link";
import { TRADES } from "@/lib/trades";
import TradeIcon from "@/components/TradeIcon";
import { COUNTRIES, Country, EDITIONS, alternates, money } from "@/lib/geo";

export function generateStaticParams() {
  return EDITIONS.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const c = (await params).country as Country;
  const C = COUNTRIES[c];
  return {
    title: `Business automation for ${C.adj === "UK" ? "UK" : C.adj} small businesses | TaskAutopilot`,
    description: `Fixed-price automations for ${C.name} trades and teams: missed calls, bookings, invoices, staff and compliance. Prices in ${C.sym}. Approve the test run or get a full refund.`,
    alternates: alternates("/", c),
  };
}

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const c = (await params).country as Country;
  const C = COUNTRIES[c];
  return (
    <main data-nocurrency="">
      <section className="wrap flex flex-col gap-4 pb-10 pt-14">
        <div className="kicker">Automation made simple · {C.name}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.04] tracking-tight">Things get done — without you doing them.</h1>
        <p className="m-0 max-w-[700px] text-xl text-ink-2">Automations for {C.adj === "UK" ? "UK" : C.adj} owner-run businesses: calls answered, jobs booked, invoices paid, staff on track. Fixed prices in {C.sym}, {C.tax}. Start from {money(99, c)}.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="#trades" className="btn btn-primary">Show me my trade →</Link>
          <Link href="/starter/" className="btn btn-outline">Try one automation for {money(99, c)}</Link>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink-2"><span>✓ Fixed price</span><span>✓ Approve the test run or full refund</span><span>✓ Secure Stripe checkout</span><span>✓ You own everything</span></div>
      </section>
      <section id="trades" className="wrap flex flex-col gap-5 pb-16">
        <h2 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">What&apos;s your business?</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {TRADES.map((t) => (
            <Link key={t.slug} href={`${C.path}/for/${t.slug}/`} className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white text-ink no-underline hover:border-ink">
              <div className="relative aspect-[16/7]"><TradeIcon slug={t.slug} size={38} /></div>
              <div className="flex flex-col gap-0.5 p-3.5"><span className="font-display text-[17px] font-bold leading-tight group-hover:text-clay">{t.name}</span><span className="text-[12.5px] text-muted">{t.short}</span></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
