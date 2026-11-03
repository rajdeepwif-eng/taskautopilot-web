"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, fmt, priceLabel } from "@/lib/catalogue";

const TIERS = [
  { id: "none", name: "No plan", sub: "You maintain it yourselves", price: 0 },
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
    if (!items.length) return setErr("Your plan is empty — add something from the library first.");
    if (!form.name || !form.company) return setErr("Please add your name and company.");
    if (!/.+@.+\..+/.test(form.email)) return setErr("Please add a valid work email.");
    if (!terms) return setErr("Please accept the terms to continue.");
    // TODO: create a Stripe Checkout Session (test mode) via an API route, then redirect.
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="mx-auto flex max-w-[760px] flex-col gap-5 px-6 py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ok text-2xl text-white">✓</div>
        <h1 className="font-display m-0 text-4xl font-bold">Paid. Your build is booked, {form.name.split(" ")[0]}.</h1>
        <p className="m-0 text-lg text-ink-2">[Demo — Stripe not connected yet.] Receipt sent to {form.email}. Here&apos;s exactly what happens next — nobody needs to call you.</p>
        {[
          ["01", "Now — 10-minute setup form.", `Connect ${apps.join(", ") || "your apps"} with secure logins (no passwords shared).`],
          ["02", "Day 1 — build starts.", "You get a project page with progress you can check any time."],
          ["03", "Day 8–12 — approve a test run", "in one click, before anything goes live."],
          ["04", "Go-live", "plus your live results panel and handover document."],
        ].map(([n, b, r], i) => (
          <div key={n} className={`flex gap-3.5 rounded-xl bg-white p-4.5 ${i === 0 ? "border-2 border-clay" : "border border-line"}`}>
            <span className={`font-mono ${i === 0 ? "text-clay" : "text-muted"}`}>{n}</span>
            <span><b>{b}</b> {r}</span>
          </div>
        ))}
        <Link href="/" className="btn btn-primary">Start my setup form →</Link>
      </main>
    );
  }

  return (
    <main className="wrap flex flex-wrap items-start gap-8 pt-10 pb-20">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <h1 className="font-display m-0 text-[40px] font-bold tracking-tight">Two minutes, then we take it from here.</h1>

        <div className="card flex flex-col gap-3 p-5">
          <div className="font-semibold">1 · Your plan</div>
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

        <div className="card flex flex-col gap-3 p-5">
          <div className="font-semibold">2 · Which apps do you use? <span className="font-normal text-muted">(so we&apos;re ready on day one)</span></div>
          <div className="flex flex-wrap gap-2">
            {APPS.map((a) => {
              const on = apps.includes(a);
              return (
                <button key={a} type="button" aria-pressed={on} onClick={() => setApps(on ? apps.filter((x) => x !== a) : [...apps, a])}
                  className={`min-h-[44px] cursor-pointer rounded-full border px-3.5 text-sm ${on ? "border-ink bg-ink text-white" : "border-[#C9C5B9] bg-white text-ink"}`}>
                  {on ? "✓ " : ""}{a}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="font-semibold">3 · Your details</div>
          <div className="flex flex-wrap gap-3">
            {([["name", "Full name", "text"], ["email", "Work email", "email"], ["company", "Company", "text"], ["phone", "Phone (go-live day only)", "tel"]] as const).map(([k, label, type]) => (
              <label key={k} className="flex flex-[1_1_220px] flex-col gap-1.5 text-sm">
                {label}
                <input type={type} value={form[k]} onChange={(e) => { setForm({ ...form, [k]: e.target.value }); setErr(""); }} />
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-2xl bg-ink p-6 text-paper">
        <div className="font-display text-[22px] font-bold">Order summary</div>
        <div className="flex justify-between"><span>One-off build</span><span className="font-mono">{fmt(oneOff)}</span></div>
        {discount > 0 && <div className="flex justify-between text-[#7FD1A8]"><span>Bundle saving</span><span className="font-mono">−{fmt(discount)}</span></div>}
        {monthly > 0 && <div className="flex justify-between"><span>Monthly services, first month</span><span className="font-mono">{fmt(monthly)}</span></div>}
        {t.price > 0 && <div className="flex justify-between"><span>{t.name}, first month</span><span className="font-mono">{fmt(t.price)}</span></div>}
        <div className="flex items-baseline justify-between border-t border-[#2B2E33] pt-3"><span className="text-[#A9ADB4]">Due today</span><span className="font-display text-4xl font-bold text-amber">{fmt(total)}</span></div>
        <div className="text-[13px] text-[#A9ADB4]">Plus sales tax or VAT where it applies. Usage-based costs (call minutes, AI usage) are billed at cost.</div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#C9C7C0]">
          <input type="checkbox" checked={terms} onChange={() => { setTerms(!terms); setErr(""); }} className="mt-0.5 h-5 w-5" />
          <span>I agree to the <Link href="/legal/terms" className="text-amber">terms of service</Link>, scope and <Link href="/legal/refunds" className="text-amber">refund policy</Link>.</span>
        </label>
        {err && <div role="alert" className="text-sm text-[#FCA5A5]">{err}</div>}
        <button type="button" onClick={pay} className="btn btn-primary border-0 text-lg">Pay {fmt(total)} securely →</button>
        <div className="text-xs leading-normal text-[#A9ADB4]">You enter card details on Stripe&apos;s own page. We never see or store them.</div>
        <div className="flex flex-col gap-2 text-sm">
          <a href="mailto:[sales@yourdomain]" className="text-amber">Need sign-off? Send this quote to your manager →</a>
          <a href="mailto:[sales@yourdomain]" className="text-amber">Prefer to pay by invoice / bank transfer →</a>
          <Link href="/#security" className="text-amber">Data &amp; security →</Link>
        </div>
      </aside>
    </main>
  );
}
