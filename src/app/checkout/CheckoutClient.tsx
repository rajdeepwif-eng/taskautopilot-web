"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, fmt, priceLabel } from "@/lib/catalogue";
import { PAYMENTS_LIVE } from "@/lib/launch";

const TIERS = [
  { id: "none", name: "No plan", sub: "You maintain it; fixes later at $150/hour", price: 0 },
  { id: "lite", name: "Run Lite", sub: "Alerts + fixes · 1–2 automations", price: 300 },
  { id: "full", name: "Run Full", sub: "+ new workflow monthly, results panel", price: 1500 },
];
const APPS = ["Gmail", "Outlook", "Slack", "Teams", "WhatsApp", "Xero", "QuickBooks", "Sage", "Zoho Books", "HubSpot", "Shopify", "Other"];

export default function CheckoutClient({ items }: { items: Product[] }) {
  const [tier, setTier] = useState("none");
  const [apps, setApps] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState("");
  const [paid, setPaid] = useState(false);

  const oneOff = items.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
  const monthly = items.filter((p) => p.monthly).reduce((a, p) => a + p.price, 0);
  const discount = items.length >= 3 ? oneOff * 0.1 : 0;
  const t = items.some((p) => p.run) ? TIERS.find((x) => x.id === tier)! : TIERS[0];
  const total = oneOff - discount + monthly + t.price;

  const pay = () => {
    if (!items.length) return setErr("Your cart is empty — add something from the shop first.");
    if (!/.+@.+\..+/.test(form.email)) return setErr("Please add a valid work email.");
    if (!terms) return setErr("Please accept the terms to continue.");
    // TODO: create a Stripe Checkout Session (test mode) via an API route, then redirect.
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="mx-auto flex max-w-[760px] flex-col gap-5 px-6 py-14">
        <h1 className="font-display m-0 text-4xl font-bold">Reserved — card payments open soon.</h1>
        <p className="m-0 text-lg text-ink-2">We&apos;re finishing our secure Stripe checkout. <b>Nothing has been charged.</b> Here&apos;s exactly what will happen once you pay — nobody needs to call you.</p>
        {[
          ["01", "Now — 10-minute setup form.", "Tell us your apps and connect them with secure logins (no passwords shared)."],
          ["02", "Day 1 — build starts.", "You get a project page with progress you can check any time."],
          ["03", "Day 8–12 — approve a test run", "in one click, before anything goes live."],
          ["04", "Go-live", "plus your live results panel and handover document."],
        ].map(([n, b, r], i) => (
          <div key={n} className={`flex gap-3.5 rounded-xl bg-white p-4.5 ${i === 0 ? "border-2 border-clay" : "border border-line"}`}>
            <span className={`font-mono ${i === 0 ? "text-clay" : "text-muted"}`}>{n}</span>
            <span><b>{b}</b> {r}</span>
          </div>
        ))}
        <Link href="/" className="btn btn-outline">Back to the shop</Link>
      </main>
    );
  }

  return (
    <main className="wrap flex flex-wrap items-start gap-8 pt-10 pb-32 lg:pb-20">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <h1 className="font-display m-0 text-[clamp(30px,4vw,40px)] font-bold tracking-tight">One minute, then we take it from here.</h1>
        <div className="text-[15px] text-ink-2">{PAYMENTS_LIVE ? "Pay now; tell us about your apps and team on a 10-minute setup form afterwards." : "Card payments open at launch. Reserve your build now — nothing is charged today."}</div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="flex items-baseline justify-between"><div className="font-bold">Your order</div><Link href="/library/" className="text-sm">Edit cart</Link></div>
          {items.length === 0 && <div className="text-ink-2">Nothing selected. <Link href="/library">Browse the shop →</Link></div>}
          {items.map((p) => (
            <div key={p.id} className="flex justify-between gap-3 border-b border-line pb-2"><span>{p.name}{p.run && <span className="block text-[13px] text-muted">Ongoing support from {p.run}</span>}</span><span className="whitespace-nowrap">{priceLabel(p)}</span></div>
          ))}
          {items.some((p) => p.run) && (<>
            <div className="mt-1.5 font-bold">Keep it running <span className="font-normal text-muted">(optional · cancel any time)</span></div>
            <div className="flex flex-wrap gap-2">
              {TIERS.map((x) => (
                <button key={x.id} type="button" onClick={() => setTier(x.id)} aria-pressed={tier === x.id}
                  className={`min-h-[48px] flex-[1_1_160px] cursor-pointer rounded-lg px-3.5 py-3 text-left text-ink ${tier === x.id ? "border-2 border-[#007185] bg-[#EDFDFF]" : "border border-line bg-white"}`}>
                  <b>{x.name}</b> · {x.price ? fmt(x.price) + "/mo" : fmt(0)}<br /><span className="text-[13px] text-ink-2">{x.sub}</span>
                </button>
              ))}
            </div>
          </>)}
        </div>
      </div>

      <aside id="pay-box" className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-lg border border-line bg-white p-6 text-ink">
        <div className="text-[22px] font-bold">Order summary</div>
        <div className="flex justify-between"><span>One-off build</span><span>{fmt(oneOff)}</span></div>
        {discount > 0 && <div className="flex justify-between text-ok"><span>Bundle saving (3+ items)</span><span>−{fmt(discount)}</span></div>}
        {monthly > 0 && <div className="flex justify-between"><span>Monthly services, first month</span><span>{fmt(monthly)}</span></div>}
        {t.price > 0 && <div className="flex justify-between"><span>{t.name}, first month</span><span>{fmt(t.price)}</span></div>}
        <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-muted">{PAYMENTS_LIVE ? "Due today" : "Total (charged at launch)"}</span><span className="text-4xl font-bold text-[#B12704]">{fmt(total)}</span></div>
        <div className="text-[13px] text-muted">Plus sales tax where it applies. Usage-based costs (call minutes, AI usage) are billed at cost.</div>
        <label className="flex flex-col gap-1.5 text-sm text-ink-2">
          {PAYMENTS_LIVE ? "Email for your receipt and setup form" : "Email to reserve your build"}
          <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} placeholder="you@company.com" />
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-2">
          <input type="checkbox" checked={terms} onChange={() => { setTerms(!terms); setErr(""); }} className="mt-0.5 h-5 w-5 accent-[#007185]" />
          <span>I agree to the <Link href="/legal/terms">terms of service</Link>, scope and <Link href="/legal/refunds">refund policy</Link>.</span>
        </label>
        {err && <div role="alert" className="text-sm text-[#B12704]">{err}</div>}
        <button type="button" onClick={pay} className="btn btn-primary text-lg">{PAYMENTS_LIVE ? `Pay ${fmt(total)} securely →` : "Reserve — no charge today"}</button>
        <div className="rounded-lg bg-[#F0F8F3] px-3 py-2.5 text-sm"><b className="text-ok">✓ Approve the test run or get a full refund</b><span className="block text-ink-2">If you don&apos;t approve the test run of a build, we refund its build fee in full.</span></div>
        <div className="text-xs leading-normal text-muted">{PAYMENTS_LIVE ? "🔒 Paid on Stripe's secure checkout — certified to PCI DSS Level 1, the top card-security standard. We never see your card, and card payments keep your card provider's dispute rights." : "🔒 At launch, payment is taken on Stripe's secure checkout — we never see your card."}</div>
        <div className="flex flex-col gap-2 text-sm">
          <button type="button" onClick={() => { try { navigator.clipboard.writeText(window.location.href); } catch {} setErr("✓ Quote link copied — send it to whoever signs off."); }} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[#007185]">Need sign-off? Copy a link to this quote →</button>
          <Link href="/consulting/#audit">Need an invoice or a purchase order? Ask here →</Link>
          <Link href="/#security">Data &amp; security →</Link>
        </div>
      </aside>
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white p-3 lg:hidden">
          <span className="text-xl font-bold">{fmt(total)}</span>
          <a href="#pay-box" className="btn btn-primary !min-h-[44px] flex-1">{PAYMENTS_LIVE ? "Continue to pay →" : "Continue →"}</a>
        </div>
      )}
    </main>
  );
}
