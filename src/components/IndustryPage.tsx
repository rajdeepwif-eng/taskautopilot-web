import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import { byId, fmt, priceLabel, defaultHours, exampleYearly } from "@/lib/catalogue";

export type IndustryContent = {
  kicker: string;
  title: string;
  lede: string;
  pains: { t: string; d: string }[];
  productIds: number[];
  apps: string;
  care: { t: string; d: string }[];
  ctaNote: string;
};

export default function IndustryPage({ c }: { c: IndustryContent }) {
  const products = c.productIds.map(byId);
  return (
    <main>
      <section className="wrap flex flex-col gap-4 pb-10 pt-16">
        <div className="kicker">{c.kicker}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.05] tracking-tight">{c.title}</h1>
        <p className="m-0 max-w-[680px] text-[19px] leading-normal text-ink-2">{c.lede}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#automations" className="btn btn-primary">See the automations &amp; prices</a>
          <Link href="/consulting/#audit" className="btn btn-outline">Book a paid audit — from $499</Link>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="wrap flex flex-wrap gap-4 py-12">
          {c.pains.map((p) => (
            <div key={p.t} className="flex flex-[1_1_260px] flex-col gap-2">
              <div className="font-display text-xl font-bold">{p.t}</div>
              <div className="text-[15px] leading-relaxed text-ink-2">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="automations" className="wrap flex flex-col gap-5 py-14">
        <h2 className="m-0 font-display text-[34px]">Ready-made for your firm</h2>
        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <div key={p.id} className="card flex min-w-0 flex-[1_1_320px] flex-col gap-2.5 p-6">
              <h3 className="m-0 font-display text-[22px] font-bold leading-tight">{p.name}</h3>
              <p className="m-0 text-[15px] leading-normal text-ink-2">{p.desc}</p>
              {p.replaces && <p className="m-0 border-l-2 border-clay pl-2.5 text-[14px] font-medium leading-snug">{p.replaces}</p>}
              {p.wage && (
                <p className="m-0 rounded-md bg-paper px-2.5 py-1.5 text-[13px] text-ink-2">
                  Example: {defaultHours(p)} hrs/week of a {p.role}&apos;s time ≈ <b>{fmt(exampleYearly(p))}/yr</b>
                </p>
              )}
              <div className="mt-auto flex items-baseline justify-between border-t border-line pt-2">
                <span className="font-display text-2xl font-bold">{priceLabel(p)}</span>
                <span className="text-[13px] text-muted">{p.run ? `then ${p.run}` : `live in ${p.days} days`}</span>
              </div>
              <AddToCart ids={[p.id]} />
              <Link href={`/checkout/?plan=${p.id}`} className="btn btn-primary">Buy now</Link>
            </div>
          ))}
        </div>
        <p className="m-0 text-sm text-muted">Works with: {c.apps}. Wage figures are US medians from the Bureau of Labor Statistics (May 2025); change them to your own on any product page or in the <Link href="/planner/">planner</Link>.</p>
      </section>

      <section className="bg-ink text-paper">
        <div className="wrap flex flex-wrap gap-8 py-14">
          <div className="flex flex-[1_1_300px] flex-col gap-3">
            <h2 className="m-0 font-display text-[32px]">How we handle your clients&apos; data</h2>
            <p className="m-0 opacity-80">{c.ctaNote}</p>
          </div>
          <div className="flex flex-[2_1_480px] flex-wrap gap-4">
            {c.care.map((x) => (
              <div key={x.t} className="flex flex-[1_1_220px] flex-col gap-1.5">
                <div className="font-semibold text-amber">{x.t}</div>
                <div className="text-[15px] leading-relaxed opacity-85">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-4 py-14">
        <h2 className="m-0 font-display text-[30px]">Something specific to your firm?</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/bespoke/" className="btn btn-outline">Send a bespoke brief</Link>
          <Link href="/consulting/#audit" className="btn btn-dark">Book an audit</Link>
        </div>
      </section>
    </main>
  );
}
