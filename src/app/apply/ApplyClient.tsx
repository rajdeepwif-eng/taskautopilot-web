"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEALS, DealId, dealById, revenueBands } from "@/lib/deals";
import { useCurrency } from "@/components/Currency";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

const COUNTRIES = ["United States", "United Kingdom", "Australia", "Canada", "Other"];

/** One application for every way of working with us; the questions change with the deal picked. */
export default function ApplyClient() {
  const [deal, setDeal] = useState<DealId>("monthly");
  const [f, setF] = useState<Record<string, string>>({ name: "", email: "", company: "", website: "", country: "United States", stage: "", goal: "", timeline: "", team: "", stakeOk: "", exitYears: "", ownership: "", reason: "" });
  const [sent, setSent] = useState(false);
  const { cur } = useCurrency();
  const STAGES = revenueBands(cur);
  // Preselect the visitor's country from their currency (they can still change it).
  useEffect(() => { const c = ({ GBP: "United Kingdom", AUD: "Australia", CAD: "Canada" } as Record<string, string>)[cur]; if (c) setF((x) => (x.country === "United States" ? { ...x, country: c } : x)); }, [cur]);
  const [err, setErr] = useState("");
  useEffect(() => { try { const d = new URLSearchParams(window.location.search).get("deal") || ""; if (dealById(d)) setDeal(d as DealId); } catch { /* ignore */ } }, []);
  const set = (k: string, v: string) => { setF({ ...f, [k]: v }); setErr(""); };
  const d = dealById(deal)!;

  if (sent) {
    return (
      <main className="wrap flex max-w-[760px] flex-col gap-4 pb-16 pt-12">
        <h1 className="m-0 font-display text-3xl font-bold" data-testid="apply-done">{FORMS_LIVE ? "Thanks — we'll review it within 5 business days." : "Thanks — almost there."}</h1>
        <p className="m-0 text-ink-2">{FORMS_LIVE ? (deal === "succession" ? "Everything you shared stays confidential. We'll suggest a time to talk, and nothing is shared with your staff or customers." : "If it's a fit, we'll send indicative terms in writing. No obligation either way.") : FORM_NOT_SENT}</p>
        <Link href="/ways-to-pay/" className="btn btn-outline self-start">Back to ways to work with us</Link>
      </main>
    );
  }

  const label = "flex flex-col gap-1.5 text-sm";
  return (
    <main className="wrap flex max-w-[860px] flex-col gap-6 pb-16 pt-10">
      <div className="kicker">Apply · about 3 minutes</div>
      <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">Tell us about your business — we&apos;ll suggest the best deal.</h1>
      {!FORMS_LIVE && <div className="rounded-lg bg-[#FFF4E5] px-3 py-2 text-[14px] text-ink-2"><b>Pre-launch:</b> applications open at launch, so this form can&apos;t be sent yet. You can still see the questions; to talk now, email the address in the footer.</div>}
      <form className="flex flex-col gap-5" data-nocurrency onSubmit={(e) => {
        e.preventDefault();
        if (!f.name.trim() || !f.company.trim()) return setErr("Please add your name and company.");
        if (!/.+@.+\..+/.test(f.email)) return setErr("Please add an email we can reply to.");
        if (!f.stage) return setErr("Please pick your company's size.");
        if (deal === "equity" && !f.team.trim()) return setErr("Tell us briefly about the founding team.");
        if (deal === "succession" && !f.exitYears) return setErr("Roughly when would you like to step back?");
        void sendLead("deal-application", { deal, ...f });
        setSent(true);
      }}>
        <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">1 · Which deal interests you?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEALS.map((x) => (
              <button key={x.id} type="button" aria-pressed={deal === x.id} data-deal={x.id} onClick={() => setDeal(x.id)} className={`flex min-h-[56px] cursor-pointer flex-col items-start rounded-lg px-3 py-2 text-left ${deal === x.id ? "border-2 border-clay bg-clay-soft" : "border border-line bg-white"}`}>
                <b>{x.name}</b><span className="text-[12.5px] text-ink-2">{x.forWho}</span>
              </button>
            ))}
          </div>
          <p className="m-0 text-[14px] text-ink-2"><b>{d.name}:</b> {d.how}</p>
        </fieldset>

        <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">2 · About you and the company</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={label}>Your name *<input name="name" type="text" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
            <label className={label}>Email *<input name="email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
            <label className={label}>Company *<input name="company" type="text" value={f.company} onChange={(e) => set("company", e.target.value)} /></label>
            <label className={label}>Website <span className="text-muted">(optional)</span><input name="website" type="text" value={f.website} onChange={(e) => set("website", e.target.value)} /></label>
            <label className={label}>Country<select name="country" value={f.country} onChange={(e) => set("country", e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className={label}>Annual revenue *<select name="stage" value={f.stage} onChange={(e) => set("stage", e.target.value)}><option value="">Choose one</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></label>
          </div>
          <label className={label}>What would you like automated, or what&apos;s the goal?<textarea name="goal" rows={3} value={f.goal} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. we lose calls while on jobs, invoices go out late, I do all the admin myself" /></label>
        </fieldset>

        {(deal === "equity" || deal === "hybrid") && (
          <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">3 · For startups</legend>
            <label className={label}>Founding team (who, background, full-time?)<textarea name="team" rows={3} value={f.team} onChange={(e) => set("team", e.target.value)} /></label>
            <label className={label}>Funding so far<select name="stakeOk" value={f.stakeOk} onChange={(e) => set("stakeOk", e.target.value)}><option value="">Choose one</option><option>Bootstrapped</option><option>Friends &amp; family</option><option>Angel / pre-seed</option><option>Seed or later</option></select></label>
          </fieldset>
        )}

        {deal === "succession" && (
          <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">3 · Your plans (confidential)</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={label}>When would you like to step back?<select name="exitYears" value={f.exitYears} onChange={(e) => set("exitYears", e.target.value)}><option value="">Choose one</option><option>Within 12 months</option><option>1–2 years</option><option>3–5 years</option><option>Not sure yet</option></select></label>
              <label className={label}>How much do you own?<select name="ownership" value={f.ownership} onChange={(e) => set("ownership", e.target.value)}><option value="">Choose one</option><option>100%</option><option>Over 50%</option><option>50% or less</option></select></label>
            </div>
            <label className={label}>What matters most to you?<select name="reason" value={f.reason} onChange={(e) => set("reason", e.target.value)}><option value="">Choose one</option><option>Best price</option><option>Looking after my staff</option><option>A clean, quick exit</option><option>Staying involved part-time</option></select></label>
            <p className="m-0 text-[13px] text-muted">🔒 We don&apos;t contact your staff, customers or suppliers without your permission.</p>
          </fieldset>
        )}

        {(deal === "monthly" || deal === "results") && (
          <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">3 · Timing</legend>
            <label className={label}>When do you want it live?<select name="timeline" value={f.timeline} onChange={(e) => set("timeline", e.target.value)}><option value="">Choose one</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Just exploring</option></select></label>
          </fieldset>
        )}

        {err && <div role="alert" className="text-sm text-[#B12704]">{err}</div>}
        <button type="submit" className="btn btn-primary self-start">Send my application</button>
        <p className="m-0 text-[12px] text-muted">No obligation. Indicative terms only until a written agreement is signed; plans and stakes are subject to approval. This isn&apos;t financial or legal advice — take your own advice before agreeing to any deal.</p>
      </form>
    </main>
  );
}
