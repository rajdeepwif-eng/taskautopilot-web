"use client";

import { PLAN_TERMS, planFor } from "@/lib/deals";
import { useState } from "react";
import Link from "next/link";
import { Product, fmt, priceLabel, runLow } from "@/lib/catalogue";
import { useEffect } from "react";
import { NEXT_BUILD_START, PAYMENTS_LIVE } from "@/lib/launch";
import { trackConversion } from "@/components/Analytics";
import { useCurrency } from "@/components/Currency";
import { partnerName } from "@/data/partners";
import { readTouches, sendLead } from "@/lib/attribution";
import { ConsentBox } from "@/components/LeadBits";

const HEARD = ["Google search", "Google ad", "YouTube", "LinkedIn", "An email from us", "A phone call from us", "My accountant or bookkeeper", "A friend or another business owner", "We visited you", "Trade show or event", "Facebook or Instagram", "Other"];
const guessHeard = (src: string, med: string, ref: string) => ref ? "My accountant or bookkeeper" : med === "cpc" ? "Google ad" : /youtube/.test(src) ? "YouTube" : /linkedin/.test(src) ? "LinkedIn" : /email|mail/.test(src + med) ? "An email from us" : /call|phone/.test(src) ? "A phone call from us" : /organic/.test(src) ? "Google search" : /flyer|visit|door/.test(src) ? "We visited you" : /event|show/.test(src) ? "Trade show or event" : /meta|facebook|instagram/.test(src) ? "Facebook or Instagram" : "";

const TAX: Record<string, string> = { USD: "Plus sales tax where it applies.", GBP: "Plus VAT at 20% where it applies.", AUD: "Plus GST where it applies.", CAD: "Plus GST/HST where it applies." };
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
  const lite = items.reduce((a, p) => a + runLow(p), 0);
  const TIERS = [
    { id: "none", name: "No plan", sub: "Free fixes for 90 days and free small changes for 14 days; after that, changes from $150 (fixed price) and fixes need a plan", price: 0 },
    { id: "lite", name: "Run Lite", sub: "Monitoring, failure alerts, fixes after the free 90 days, and one small change a month", price: lite },
    { id: "full", name: "Run Full", sub: "Run Lite + one new time-saver each month + live results panel", price: Math.max(1500, lite) },
  ];
  const t = items.some((p) => p.run) ? TIERS.find((x) => x.id === tier)! : TIERS[0];
  const [cur, setCur] = useState("USD");
  const [heard, setHeard] = useState("");
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const [payPlan, setPayPlan] = useState(0); // 0 = pay in full, else months
  const [refCode, setRefCode] = useState("");
  useEffect(() => { const { first, last } = readTouches(); const t = last || first; if (t) { setRefCode(t.ref || first?.ref || ""); setHeard(guessHeard(t.source, t.medium, t.ref || first?.ref || "")); } }, []);
  useEffect(() => { try { setCur(localStorage.getItem("ta-currency") || "USD"); } catch { /* storage blocked */ } }, []);
  const total = oneOff - discount + monthly + t.price;
  // On a monthly plan only the deposit (plus any first-month services) is due at the start.
  // Plan maths in the visitor's currency so the deposit and payments add up exactly as shown.
  const cx = useCurrency();
  const planX = payPlan > 0 ? planFor(cx.fromUsd(oneOff - discount), payPlan) : null;
  const extrasLocal = cx.fromUsd(monthly + t.price);
  const dueNow = planX ? planX.deposit + extrasLocal : total;
  const fmtDue = (n: number) => (planX ? cx.local(n) : fmt(n));

  const pay = () => {
    if (!items.length) return setErr("Nothing selected yet — pick an automation first.");
    if (!form.name.trim()) return setErr("Please add your name.");
    if (!/.+@.+\..+/.test(form.email)) return setErr("Please add a valid work email.");
    if (!terms) return setErr("Please accept the terms to continue.");
    // TODO: create a Stripe Checkout Session (test mode) via an API route, then redirect.
    void sendLead("reservation", { items: items.map((p) => p.id), tier, total, currency: cur, name: form.name, email: form.email, phone: form.phone, company: form.company, marketingConsent: consent, heard, refCode, payPlan });
    trackConversion(total, "USD");
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="mx-auto flex max-w-[760px] flex-col gap-5 px-6 py-14">
        <h1 className="font-display m-0 text-4xl font-bold">Reserved — your build slot is held.</h1>
        <p className="m-0 text-lg text-ink-2"><b>Nothing has been charged.</b> We&apos;ll email you within 1 working day to confirm the slot and, if you like, a 15-minute call to check the details. Card payment opens within two weeks; here&apos;s what happens once you pay.</p>
        {[
          ["01", "Now — 10-minute setup form.", "Tell us your apps and who signs off. You connect apps later with their own secure logins — no passwords shared."],
          ["02", "Build starts.", "You get a progress update at each step, and one point of contact."],
          ["03", "Before go-live — approve a test run", "in one click. Nothing goes live until you do."],
          ["04", "Go-live", "plus your live results panel and handover document."],
        ].map(([n, b, r], i) => (
          <div key={n} className={`flex gap-3.5 rounded-xl bg-white p-4.5 ${i === 0 ? "border-2 border-clay" : "border border-line"}`}>
            <span className={`font-mono ${i === 0 ? "text-clay" : "text-muted"}`}>{n}</span>
            <span><b>{b}</b> {r}</span>
          </div>
        ))}
        <Link href={`/setup/?plan=${items.map((p) => p.id).join(",")}`} className="btn btn-primary">Start my 10-minute setup form →</Link>
        <Link href="/" className="btn btn-outline">Back to the shop</Link>
      </main>
    );
  }

  return (
    <main className="wrap flex flex-wrap items-start gap-8 pt-10 pb-32 lg:pb-20">
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <h1 className="font-display m-0 text-[clamp(30px,4vw,40px)] font-bold tracking-tight">One minute, then we take it from here.</h1>
        <div className="text-[15px] text-ink-2">{PAYMENTS_LIVE ? "Pay now; tell us about your apps and team on a 10-minute setup form afterwards." : "Card payments open within the next two weeks. Reserve your build slot now — nothing is charged until you confirm."}</div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="flex items-baseline justify-between"><div className="font-bold">Your order</div><Link href="/library/" className="text-sm">Change</Link></div>
          {items.length === 0 && <div className="text-ink-2">Nothing selected. <Link href="/library">Browse the shop →</Link></div>}
          {items.map((p) => (
            <div key={p.id} className="flex justify-between gap-3 border-b border-line pb-2"><span>{p.name}{p.run && tier !== "none" && <span className="block text-[13px] text-muted">Support plan from {fmt(runLow(p))}/mo</span>}</span><span className="whitespace-nowrap">{priceLabel(p)}</span></div>
          ))}
          {items.some((p) => p.run) && (<>
            <div className="mt-1.5 font-bold">Keep it running <span className="font-normal text-muted">(optional · 6-month minimum, then month to month)</span></div>
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
        {oneOff - discount >= 500 && (
          <div className="flex flex-col gap-1.5 rounded-lg border border-line p-3 text-sm" data-testid="pay-plan">
            <b>How do you want to pay the build?</b>
            <div className="flex flex-wrap gap-2">
              {[0, ...PLAN_TERMS.map((x) => x.months)].map((m) => (
                <button key={m} type="button" aria-pressed={payPlan === m} onClick={() => setPayPlan(m)} className={`min-h-[44px] cursor-pointer rounded-lg px-3 ${payPlan === m ? "border-2 border-[#007185] bg-[#EDFDFF]" : "border border-line bg-white"}`}>{m === 0 ? "In full" : `${m} months`}</button>
              ))}
            </div>
            {planX && <span className="text-ink-2" data-testid="plan-line" data-nocurrency>{cx.local(planX.deposit)} deposit, then {payPlan} × {cx.local(planX.monthly)} (total {cx.local(planX.total)}). Subject to approval.</span>}
            <Link href="/ways-to-pay/" className="text-[13px]">Other ways: finance, pay from results, shares →</Link>
          </div>
        )}
        {discount > 0 && <div className="flex justify-between text-ok"><span>Bundle saving (3+ items)</span><span>−{fmt(discount)}</span></div>}
        {monthly > 0 && <div className="flex justify-between"><span>Monthly services, first month</span><span>{fmt(monthly)}</span></div>}
        {t.price > 0 && <div className="flex justify-between"><span>{t.name}, first month</span><span>{fmt(t.price)}</span></div>}
        <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-muted">{planX ? (PAYMENTS_LIVE ? "Deposit due today" : "Deposit — you pay when checkout opens") : PAYMENTS_LIVE ? "Due today" : "Total — you confirm and pay when checkout opens"}</span><span className="text-4xl font-bold text-[#B12704]" data-testid="due-now" data-nocurrency={planX ? true : undefined}>{fmtDue(dueNow)}</span></div>
        {planX && <div className="text-[13px] text-ink-2" data-testid="due-later" data-nocurrency>Then {payPlan} monthly payments of {cx.local(planX.monthly)} — {cx.local(planX.total + extrasLocal)} in total.</div>}
        <div className="text-[13px] text-muted">{TAX[cur] ?? TAX.USD} Running costs are paid by you directly, at cost: n8n from about €20/mo (roughly $22), plus call minutes, texts or AI use where a build uses them.</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-ink-2">Your name
            <input type="text" autoComplete="name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErr(""); }} placeholder="Sam Patel" data-testid="co-name" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-ink-2">Phone <span className="text-muted">(optional — for a quick call if anything is unclear)</span>
            <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7700 900000" data-testid="co-phone" />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm text-ink-2">
          {PAYMENTS_LIVE ? "Email for your receipt and setup form" : "Email to reserve your build"}
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} onBlur={() => { if (!started && /.+@.+\..+/.test(form.email)) { setStarted(true); void sendLead("checkout-started", { items: items.map((p) => p.id), total, currency: cur, name: form.name, email: form.email, phone: form.phone, refCode }); } }} placeholder="you@company.com" data-testid="co-email" />
        </label>
        <ConsentBox checked={consent} onChange={setConsent} id="consent-checkout" />
        <label className="flex flex-col gap-1.5 text-sm text-ink-2">
          How did you hear about us? <span className="text-muted">(optional)</span>
          <select value={heard} onChange={(e) => setHeard(e.target.value)}>
            <option value="">Choose one</option>
            {HEARD.map((h) => <option key={h}>{h}</option>)}
          </select>
        </label>
        {refCode && <div className="rounded-lg bg-[#F0F8F3] px-3 py-2 text-[13px] text-ink-2">✓ {partnerName(refCode) ? <>Referred by <b>{partnerName(refCode)}</b></> : <>Referral code <b>{refCode}</b> noted</>} — your referrer will be credited.</div>}
        {NEXT_BUILD_START && <div className="text-[13px] text-ink-2">📅 Next build start: <b>{new Date(NEXT_BUILD_START + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</b></div>}
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-2">
          <input type="checkbox" checked={terms} onChange={() => { setTerms(!terms); setErr(""); }} className="mt-0.5 h-5 w-5 accent-[#007185]" />
          <span>I agree to the <Link href="/legal/terms">terms of service</Link>, scope and <Link href="/legal/refunds">refund policy</Link>.</span>
        </label>
        {err && <div role="alert" className="text-sm text-[#B12704]">{err}</div>}
        <button type="button" onClick={pay} className="btn btn-primary text-lg">{PAYMENTS_LIVE ? `Pay ${fmtDue(dueNow)} securely →` : "Reserve — no charge today"}</button>
        <div className="rounded-lg bg-[#F0F8F3] px-3 py-2.5 text-sm"><b className="text-ok">✓ Approve the test run or get the build fee back in full</b><span className="block text-ink-2">If you don&apos;t approve the test run of a build, we refund its build fee in full.</span></div>
        <div className="text-xs leading-normal text-muted">{PAYMENTS_LIVE ? "🔒 Paid on Stripe's secure checkout — certified to PCI DSS Level 1, the top card-security standard. We never see your card, and card payments keep your card provider's dispute rights." : "🔒 At launch, payment is taken on Stripe's secure checkout — we never see your card."}</div>
        <div className="flex flex-col gap-2 text-sm">
          <button type="button" onClick={() => { try { navigator.clipboard.writeText(window.location.href); } catch {} setErr("✓ Quote link copied — send it to whoever signs off."); }} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[#007185]">Need sign-off? Copy a link to this quote →</button>
          <Link href="/consulting/#audit">Need an invoice or a purchase order? Ask here →</Link>
          <Link href="/#security">Data &amp; security →</Link>
        </div>
      </aside>
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white p-3 lg:hidden">
          <span className="text-xl font-bold" data-nocurrency={planX ? true : undefined}>{fmtDue(dueNow)}</span>
          <a href="#pay-box" className="btn btn-primary !min-h-[44px] flex-1">{PAYMENTS_LIVE ? "Continue to pay →" : "Continue →"}</a>
        </div>
      )}
    </main>
  );
}
