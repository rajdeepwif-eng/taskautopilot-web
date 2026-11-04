import type { Metadata } from "next";
import Link from "next/link";
import { PAYMENTS_LIVE } from "@/lib/launch";
import TradeGrid from "@/components/TradeGrid";
import HeroSearch from "@/components/HeroSearch";
import heroImg from "@/assets/hero.jpg";
import { COUNTRIES, Country, EDITIONS, alternates, money, loc, seoTitle } from "@/lib/geo";
import { SRCSET } from "@/lib/srcset";
import SwitchOn from "@/components/SwitchOn";

export function generateStaticParams() {
  return EDITIONS.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const c = (await params).country as Country;
  const C = COUNTRIES[c];
  return {
    title: seoTitle(`Automation for ${C.adj === "UK" ? "UK" : C.adj} small businesses`),
    description: `Fixed-price automations for ${C.name} businesses: missed calls, bookings, invoices and reviews. Prices in ${C.sym}. Approve the test run or get a full refund.`,
    alternates: alternates("/", c),
  };
}

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const c = (await params).country as Country;
  const C = COUNTRIES[c];
  return (
    <main data-nocurrency="">
      <section className="bg-white">
        <div className="wrap flex flex-wrap items-center gap-10 pb-12 pt-10">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
            <div className="kicker">Everyday tasks, automated for you · {C.name}</div>
            <h1 className="font-display m-0 text-[clamp(38px,6vw,56px)] font-bold leading-[1.04] tracking-tight">
            <span className="inline-flex items-center gap-3"><SwitchOn size={44} />Switch on.</span><br />Get your time back.
          </h1>
            <p className="m-0 max-w-[620px] text-xl leading-normal text-ink-2">We set up the automations that get you paid, booked and followed up — fixed price in {C.sym} ({C.tax}), tested with you, most live in 1–3 weeks. No sales call.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg.src} srcSet={SRCSET.hero} sizes="100vw" fetchPriority="high" alt="" aria-hidden="true" className="aspect-[16/9] w-full rounded-lg object-cover object-[70%_50%] lg:hidden" />
            <div className="flex flex-wrap gap-3">
              <Link href="#trades" className="btn btn-primary text-[17px]">Show me fixes for my business →</Link>
              <Link href="/starter/" className="btn btn-outline">Try one automation for {money(99, c)}</Link>
            </div>
            <HeroSearch showSource={false} prefix={C.path} />
            <div className="flex flex-wrap gap-4 text-sm text-ink-2"><span>✓ Fixed price</span><span>✓ Approve the test run or full refund</span>{PAYMENTS_LIVE && <span>✓ Secure Stripe checkout</span>}<span>✓ You own everything</span></div>
          </div>
          <div className="hidden min-w-0 flex-[1_1_380px] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg.src} srcSet={SRCSET.hero} sizes="(min-width: 1024px) 560px, 1px" width={heroImg.width} height={heroImg.height} alt="A business owner sees 'Invoice paid' on his phone while at his child's game" className="aspect-[4/3] w-full rounded-lg object-cover object-[70%_50%] shadow-[0_2px_10px_rgba(15,17,17,0.15)]" />
          </div>
        </div>
      </section>
      <div className="pb-16"><TradeGrid country={c} /></div>
    </main>
  );
}
