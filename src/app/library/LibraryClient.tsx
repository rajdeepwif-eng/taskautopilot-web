"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CatArt } from "@/components/CatArt";
import { PAYMENTS_LIVE } from "@/lib/launch";
import { LiveBy } from "@/components/StoreBar";
import { SITE } from "@/lib/geo";
import {
  BUNDLES,
  CATEGORIES,
  INDUSTRIES,
  PRODUCTS,
  Product,
  byId,
  defaultHours,
  fitsIndustry,
  fmt,
  howItWorks,
  priceLabel,
  roleHourly,
  exampleYearly, exampleRate,
  runLow,
} from "@/lib/catalogue";

function Chip({ active, onClick, children, tone = "dark" }: { active: boolean; onClick: () => void; children: React.ReactNode; tone?: "dark" | "clay" }) {
  const on = tone === "clay" ? "bg-clay border-clay text-white" : "bg-ink border-ink text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] cursor-pointer rounded-full border px-4 text-sm ${active ? on : "border-line bg-white text-ink"}`}
    >
      {children}
    </button>
  );
}

export default function LibraryClient() {
  const [industry, setIndustry] = useState("All industries");
  const [cat, setCat] = useState("All");
  const [view, setView] = useState<"products" | "processes">("products");
  const [plan, setPlan] = useState<number[]>([]);
  const [open, setOpen] = useState<Product | null>(null);

  const shown = useMemo(
    () => PRODUCTS.filter((p) => (cat === "All" || p.cat === cat) && fitsIndustry(p, industry)),
    [cat, industry],
  );

  const inPlan = (id: number) => plan.includes(id);
  const toggle = (id: number) => setPlan((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]));
  const planItems = plan.map(byId);
  const oneOff = planItems.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
  const monthly = planItems.filter((p) => p.monthly).reduce((a, p) => a + p.price, 0);
  const discount = planItems.length >= 3 ? oneOff * 0.1 : 0;
  const allSolo = planItems.length > 0 && planItems.every((p) => p.cat === "Solo (self-employed)");
  const runText = allSolo
    ? "Solo Care $49/mo — we keep it all running"
    : planItems.length >= 3
      ? "Run Full $1,500/mo — monitoring, fixes, a new workflow monthly, live results panel"
      : `Run Lite ${fmt(planItems.reduce((a, p) => a + runLow(p), 0))}/mo — monitoring, failure alerts and fixes`;

  return (
    <main>
      <section className="wrap flex flex-col gap-3.5 pt-12 pb-6">
        <div className="kicker">Automation library</div>
        <h1 className="font-display m-0 text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">
          Pick your industry. See what businesses like yours automate first — with prices.
        </h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">
          Ready-made automations, websites and SEO for every kind of business. Watch each one work, add what you need, then pay online or ask for a quote.
        </p>

        <div className="mt-3 font-semibold">1 · Your industry</div>
        <div className="flex flex-wrap gap-2">
          {["All industries", ...INDUSTRIES].map((i) => (
            <Chip key={i} tone="clay" active={industry === i} onClick={() => setIndustry(i)}>
              {i}
            </Chip>
          ))}
        </div>

        <div className="mt-2 font-semibold">
          2 · Browse <span className="font-normal text-muted">— {shown.length} products for {industry}</span>
        </div>
        <div className="flex self-start overflow-hidden rounded-[10px] border border-ink">
          {(["products", "processes"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`min-h-[44px] cursor-pointer px-5 font-semibold ${view === v ? "bg-ink text-white" : "bg-white text-ink"}`}
            >
              {v === "products" ? "All products" : "End-to-end processes"}
            </button>
          ))}
        </div>
        {view === "products" && (
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}
      </section>

      <section className="wrap flex flex-wrap items-start gap-6 pb-20">
        <div className="flex min-w-0 flex-[999_1_640px] flex-wrap gap-4">
          {view === "products" &&
            shown.map((p) => (
              <article key={p.id} className="card flex min-w-[260px] flex-[1_1_280px] flex-col gap-2.5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  aria-label={`See how ${p.name} works`}
                  className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 border-0 bg-ink"
                >
                  <CatArt cat={p.cat} />
                </button>
                <div className="flex flex-col gap-2 px-5 pb-5">
                  <div className="flex justify-between font-mono text-xs text-muted">
                    <span>{p.cat}</span>
                    <span className="text-ok">● ready-made</span>
                  </div>
                  <h3 className="font-display m-0 text-[21px] font-bold leading-tight">{p.name}</h3>
                  <p className="m-0 text-[15px] leading-normal text-ink-2">{p.desc}</p>
                  {p.replaces && <p className="m-0 border-l-2 border-clay pl-2.5 text-[14px] font-medium leading-snug">{p.replaces}</p>}
                  {p.wage && (
                    <p className="m-0 rounded-md bg-paper px-2.5 py-1.5 text-[13px] text-ink-2">
                      Example: {defaultHours(p)} hrs/week of a {p.role}&apos;s time at ${exampleRate(p)}/hr ≈ <b>{fmt(exampleYearly(p))}/yr</b>
                    </p>
                  )}
                  <p className="m-0 text-[13px] text-muted">Works with: {p.apps}</p>
                  <button type="button" onClick={() => setOpen(p)} className="min-h-[44px] cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold text-clay">
                    Value vs doing it by hand →
                  </button>
                  <div className="mt-auto flex items-baseline justify-between border-t border-line pt-2">
                    <span className="font-display text-2xl font-bold">{priceLabel(p)}</span>
                    <span className="text-[13px] text-muted">live in {p.days} days</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`min-h-[44px] cursor-pointer rounded-lg font-semibold ${inPlan(p.id) ? "border-0 bg-ink text-white" : "border border-clay bg-white text-clay"}`}
                  >
                    {inPlan(p.id) ? "✓ In your cart — remove" : "+ Add to cart"}
                  </button>
                </div>
              </article>
            ))}

          {view === "processes" &&
            BUNDLES.map((b) => {
              const items = b.ids.map(byId);
              const full = items.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
              const all = b.ids.every(inPlan);
              return (
                <article key={b.name} className="card flex w-full flex-col gap-3.5 p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display m-0 text-2xl font-bold">{b.name}</h3>
                    <span className="font-mono text-xs text-muted">CROSSES: {b.depts}</span>
                  </div>
                  <p className="m-0 text-[15px] text-ink-2">{b.desc}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {items.map((p, i) => (
                      <span key={p.id} className="flex items-center gap-2">
                        <span className="rounded-lg border border-line bg-paper px-3 py-2 text-sm">
                          <span className="font-mono text-[11px] text-muted">{p.cat} · </span>
                          {p.name}
                        </span>
                        {i < items.length - 1 && <span className="text-clay">→</span>}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                    <span>
                      <b className="font-display text-[22px]">{fmt(full * 0.9)}</b>{" "}
                      <span className="text-ok">save 10% vs buying separately</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPlan((x) => [...x, ...b.ids.filter((id) => !x.includes(id))])}
                      className="btn btn-primary border-0"
                    >
                      {all ? "✓ Whole process in plan" : "Add whole process"}
                    </button>
                  </div>
                </article>
              );
            })}
        </div>

        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-2xl bg-ink p-6 text-paper lg:sticky lg:top-6">
          <div className="font-display text-[22px] font-bold">Your cart</div>
          {planItems.length === 0 && <div className="text-[15px] text-[#A9ADB4]">Nothing yet. Add automations from the library.</div>}
          {planItems.map((p) => (
            <div key={p.id} className="flex justify-between gap-3 border-b border-[#2B2E33] pb-2.5 text-[15px]">
              <span>{p.name}</span>
              <span className="font-mono">{priceLabel(p)}</span>
            </div>
          ))}
          {discount > 0 && (
            <div className="flex justify-between text-[15px] text-[#7FD1A8]">
              <span>Bundle saving (3+ items, 10%)</span>
              <span className="font-mono">−{fmt(discount)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-[#A9ADB4]">One-off build</span>
            <span className="font-display text-[34px] font-bold text-amber">{fmt(oneOff - discount)}</span>
          </div>
          {monthly > 0 && (
            <div className="flex items-baseline justify-between">
              <span className="text-[#A9ADB4]">Monthly</span>
              <span className="font-display text-[22px] font-bold">{fmt(monthly)}/mo</span>
            </div>
          )}
          <div className="text-sm text-[#C9C7C0]">+ Suggested: <b className="text-white">{runText}</b></div>
          <Link href={`/checkout?plan=${plan.join(",")}`} className="btn btn-primary">Go to checkout →</Link>
          <a href={`mailto:?subject=${encodeURIComponent("Automation quote — TaskAutopilot")}&body=${encodeURIComponent(planItems.map((p) => `• ${p.name} — ${p.monthly ? fmt(p.price) + "/mo" : fmt(p.price)}`).join("\n") + `\n\nOne-off total: ${fmt(oneOff - discount)}${monthly ? ` + ${fmt(monthly)}/mo` : ""}\nCheckout: ${SITE}/checkout/?plan=${plan.join(",")}`)}`} className="btn border border-paper bg-transparent text-paper no-underline">Email me this as a quote</a>
          <div className="text-xs text-[#A9ADB4]">Fixed prices. Final scope confirmed on your setup form.</div>
          <div className="flex flex-col gap-2 border-t border-[#2B2E33] pt-3.5">
            <div className="font-semibold">Need something custom?</div>
            <div className="text-sm text-[#C9C7C0]">Build your brief in 5 minutes and get a fixed quote in 48 hours.</div>
            <Link href="/bespoke" className="font-semibold text-amber">Start a bespoke brief →</Link>
          </div>
        </aside>
      </section>

      {open && <ProductDetail p={open} inPlan={inPlan(open.id)} onAdd={() => { if (!inPlan(open.id)) toggle(open.id); setOpen(null); }} onClose={() => setOpen(null)} />}
    </main>
  );
}

export function ProductDetail({ p, inPlan, onAdd, onClose, children, inline = false }: { p: Product; inPlan: boolean; onAdd: () => void; onClose: () => void; children?: React.ReactNode; inline?: boolean }) {
  const [hours, setHours] = useState(defaultHours(p));
  const [rate, setRate] = useState(roleHourly(p));
  const weekly = (Number(hours) || 0) * (Number(rate) || 0);
  let payback = "—";
  if (weekly) {
    if (p.monthly) {
      const m = (weekly * 52) / 12;
      payback = m >= p.price ? `Saves ${fmt(m - p.price)} a month after the fee` : `Costs ${fmt(p.price - m)} a month more than the time saved`;
    } else {
      const net = weekly - (runLow(p) * 12) / 52;
      if (net <= 0) payback = "At these numbers the monthly run plan costs more than the time saved — lower-cost options may suit you better.";
      else {
        const w = Math.ceil(p.price / net);
        payback = `Pays back in about ${w} week${w === 1 ? "" : "s"}${runLow(p) ? ` after the run plan (from ${fmt(runLow(p))}/mo)` : ""} — illustrative, on your numbers.`;
      }
    }
  }
  return (
    <div className={inline ? "wrap py-6" : "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(21,23,26,0.62)] px-3 py-6"} onClick={inline ? undefined : onClose}>
      <div role={inline ? undefined : "dialog"} aria-modal={inline ? undefined : true} aria-label={p.name} className={inline ? "flex flex-col rounded-[18px] border border-line bg-white" : "relative flex w-full max-w-[1040px] flex-col overflow-hidden rounded-[18px] bg-white"} onClick={(e) => e.stopPropagation()}>
        {!inline && <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 h-10 w-10 cursor-pointer rounded-full border-0 bg-white text-2xl shadow">×</button>}
        <div className="flex flex-wrap items-start gap-7 p-5 md:p-7">
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-3.5">
            <div className="relative aspect-[16/4] overflow-hidden rounded-lg"><CatArt cat={p.cat} /></div>
            <div className="font-mono text-xs text-muted">{p.cat} · ● ready-made</div>
            {inline ? <h1 className="font-display m-0 text-3xl font-bold leading-tight">{p.name}</h1> : <h2 className="font-display m-0 text-3xl font-bold leading-tight">{p.name}</h2>}
            <p className="m-0 text-[17px] leading-normal text-ink-2">{p.desc}</p>
            <div className="mt-1 text-[18px] font-bold">About this automation</div>
            {howItWorks(p).map((t, i) => (
              <div key={i} className="flex gap-3 text-[15px] leading-normal">
                <span className="font-bold text-muted">0{i + 1}</span>
                <span>{t}</span>
              </div>
            ))}
            <div className="mt-2 font-semibold">Automation vs doing it by hand</div>
            <div className="flex flex-col gap-3 rounded-xl bg-paper p-4">
              <div className="flex flex-wrap gap-3">
                <label className="flex flex-[1_1_160px] flex-col gap-1.5 text-sm">
                  Hours a week a person spends on this
                  <input type="number" min={0} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
                </label>
                <label className="flex flex-[1_1_160px] flex-col gap-1.5 text-sm">
                  Their cost per hour ($)
                  <input type="number" min={0} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                </label>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-[1_1_140px]"><div className="text-[13px] text-muted">Hours handed back a year</div><div className="font-display text-[26px] font-bold">{Math.round((Number(hours) || 0) * 52).toLocaleString("en-US")}</div></div>
                <div className="flex-[1_1_140px]"><div className="text-[13px] text-muted">Cost of doing it by hand a year</div><div className="font-display text-[26px] font-bold">{fmt(weekly * 52)}</div></div>
              </div>
              <div className={`font-semibold ${/more than|costs more/.test(payback) ? "text-[#B12704]" : "text-ok"}`}>{payback}</div>
              <div className="text-[13px] leading-normal text-ink-2">
                Also: works nights and weekends, replies in seconds not hours, never forgets a step, and frees your people for work that needs a human.{" "}
                <span className="text-muted">{p.wage ? `Starting rate is the US median for a ${p.role} (BLS, May 2025) — change it to yours.` : "Starting numbers are estimates — change them to yours."}</span>
              </div>
            </div>
            <div className="text-sm text-muted">Works with: {p.apps}</div>
            {children}
          </div>
          <div className="order-first flex min-w-0 flex-[1_1_260px] flex-col gap-3 self-start rounded-lg border border-line bg-white p-5 md:order-none md:sticky md:top-4">
            <div className="text-xl leading-tight md:hidden">{p.name}</div>
            <div className="text-[34px] font-medium leading-none">{priceLabel(p)}</div>
            {p.cat !== "Courses" && p.cat !== "DIY kits" && <div className="text-[15px]"><LiveBy days={p.days} /></div>}
            <div className="text-[18px] text-ok">Ready to start</div>
            {p.id === 120 ? (
              <Link href="/starter/" className="btn btn-primary">Choose your starter automation →</Link>
            ) : (<>
              <button type="button" onClick={onAdd} className="btn btn-cart">{inPlan ? "✓ In your cart" : "Add to cart"}</button>
              <Link href={`/checkout/?plan=${p.id}`} className="btn btn-primary">Buy now</Link>
            </>)}
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]"><span className="text-muted">Built by</span><span>TaskAutopilot</span><span className="text-muted">Payment</span><span>{PAYMENTS_LIVE ? "Secure transaction · Stripe" : "Stripe checkout opens at launch"}</span>{!p.monthly && p.cat !== "Courses" && p.cat !== "DIY kits" && <><span className="text-muted">Guarantee</span><span>Approve the test run or full refund of the build fee</span></>}</div>
            <div className="text-sm leading-relaxed text-ink-2">
              {p.cat === "Courses" ? "✓ One-off fee, lifetime access to materials" : p.cat === "DIY kits" ? "✓ One-off fee, instant download" : p.monthly ? "✓ Monthly, 6-month minimum, then rolling" : "✓ Fixed price, one-off build"}
              {!p.monthly && p.id !== 120 && <><br />✓ You own it — documented handover</>}
              {p.run && (<><br />✓ Optional Run Lite support after launch: {fmt(runLow(p))}/mo (6-month minimum)</>)}
            </div>
            
            <div className="text-[12px] text-muted">{PAYMENTS_LIVE ? "🔒 Paid on Stripe's secure checkout — certified to PCI DSS Level 1, the top card-security standard. We never see your card, and card payments keep your card provider's dispute rights." : "🔒 Card payments open at launch on Stripe's secure checkout — reserve now, nothing charged today."}</div>
            {!inline && <Link href={`/p/${p.id}/`} className="text-center text-sm text-muted underline">Open full page / share link</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
