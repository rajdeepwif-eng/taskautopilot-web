"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, fmt, priceLabel } from "@/lib/catalogue";

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
  const t = TIERS.find((x) => x.id === tier)!;
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
        <h1 className="font-display m-0 text-4xl font-bold">Card payments open soon.</h1>
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
        <div className="text-[15px] text-ink-2">Pay now; tell us about your apps and team on a 10-minute setup form afterwards.</div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="font-semibold">1 · Your order</div>
          {items.length === 0 && <div className="text-ink-2">Nothing selected. <Link href="/library">Browse the library →</Link></div>}
          {items.map((p) => (
            <div key={p.id} className="flex justify-between border-b border-[#EDEAE1] pb-2"><span>{p.name}</span><span className="font-mono">{priceLabel(p)}</span></div>
          ))}
          <div className="mt-1.5 font-semibold">Keep it running <span className="font-normal text-muted">(cancel any time)</span></div>
          <div className="flex flex-wrap gap-2">
            {TIERS.map((x) => (
              <button key={x.id} type="button" onClick={() => setTier(x.id)} aria-pressed={tier === x.id}
                className={`min-h-[48px] flex-[1_1_160px] cursor-pointer rounded-[10px] px-3.5 py-3 text-left text-ink ${tier === x.id ? "border-2 border-clay bg-clay-soft" : "border border-[#C9C5B9] bg-white"}`}>
                <b>{x.name}</b> · {x.price ? fmt(x.price) + "/mo" : "$0"}<br /><span className="text-[13px] text-ink-2">{x.sub}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <aside id="pay-box" className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-2xl bg-ink p-6 text-paper">
        <div className="font-display text-[22px] font-bold">Order summary</div>
        <div className="flex justify-between"><span>One-off build</span><span className="font-mono">{fmt(oneOff)}</span></div>
        {discount > 0 && <div className="flex justify-between text-[#7FD1A8]"><span>Bundle saving</span><span className="font-mono">−{fmt(discount)}</span></div>}
        {monthly > 0 && <div className="flex justify-between"><span>Monthly services, first month</span><span className="font-mono">{fmt(monthly)}</span></div>}
        {t.price > 0 && <div className="flex justify-between"><span>{t.name}, first month</span><span className="font-mono">{fmt(t.price)}</span></div>}
        <div className="flex items-baseline justify-between border-t border-[#2B2E33] pt-3"><span className="text-[#A9ADB4]">Due today</span><span className="font-display text-4xl font-bold text-amber">{fmt(total)}</span></div>
        <div className="text-[13px] text-[#A9ADB4]">Plus sales tax or VAT where it applies. Usage-based costs (call minutes, AI usage) are billed at cost.</div>
        <label className="flex flex-col gap-1.5 text-sm text-[#C9C7C0]">
          Email for your receipt and setup form
          <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} placeholder="you@company.com" className="!text-ink" />
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#C9C7C0]">
          <input type="checkbox" checked={terms} onChange={() => { setTerms(!terms); setErr(""); }} className="mt-0.5 h-5 w-5" />
          <span>I agree to the <Link href="/legal/terms" className="text-amber">terms of service</Link>, scope and <Link href="/legal/refunds" className="text-amber">refund policy</Link>.</span>
        </label>
        {err && <div role="alert" className="text-sm text-[#FCA5A5]">{err}</div>}
        <button type="button" onClick={pay} className="btn btn-primary border-0 text-lg">Pay {fmt(total)} securely →</button>
        <div className="rounded-lg bg-[#1F2226] px-3 py-2.5 text-sm"><b className="text-[#7FD1A8]">✓ Approve the test run or get a full refund</b><span className="block text-[#C9C7C0]">If you don&apos;t approve the test run of a build, we refund its build fee in full.</span></div>
        <div className="text-xs leading-normal text-[#A9ADB4]">🔒 Paid on Stripe&apos;s secure checkout — certified to PCI DSS Level 1, the top card-security standard. We never see your card, and card payments keep your card provider&apos;s dispute rights.</div>
        <div className="flex flex-col gap-2 text-sm">
          <button type="button" onClick={() => { try { navigator.clipboard.writeText(window.location.href); } catch {} setErr("✓ Quote link copied — send it to whoever signs off."); }} className="cursor-pointer border-0 bg-transparent p-0 text-left text-amber">Need sign-off? Copy a link to this quote →</button>
          <Link href="/consulting/#audit" className="text-amber">Need an invoice or a purchase order? Ask here →</Link>
          <Link href="/#security" className="text-amber">Data &amp; security →</Link>
        </div>
      </aside>
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-paper p-3 lg:hidden">
          <span className="font-display text-xl font-bold">{fmt(total)}</span>
          <a href="#pay-box" className="btn btn-primary !min-h-[44px] flex-1">Continue to pay →</a>
        </div>
      )}
    </main>
  );
}
