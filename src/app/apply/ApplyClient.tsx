"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEALS, DealId, dealById, revenueBands } from "@/lib/deals";
import { DOCUMENTS, assess, checksFor, fieldsFor } from "@/lib/dealRules";
import { useCurrency } from "@/components/Currency";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

const COUNTRIES = ["United States", "United Kingdom", "Australia", "Canada", "Other"];

/**
 * One application for every way of working with us. The questions change with the deal, so everything
 * we need to approve it is collected up front; the submission carries a first-pass verdict, the checks
 * to run and the documents to request (the approval pack), which /deal-review/ renders for sign-off.
 */
export default function ApplyClient() {
  const [deal, setDeal] = useState<DealId>("monthly");
  const [f, setF] = useState<Record<string, string>>({ name: "", email: "", company: "", website: "", country: "United States", stage: "", goal: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const { cur } = useCurrency();
  const STAGES = revenueBands(cur);
  // Preselect the visitor's country from their currency (they can still change it).
  useEffect(() => { const c = ({ GBP: "United Kingdom", AUD: "Australia", CAD: "Canada" } as Record<string, string>)[cur]; if (c) setF((x) => (x.country === "United States" ? { ...x, country: c } : x)); }, [cur]);
  useEffect(() => { try { const d = new URLSearchParams(window.location.search).get("deal") || ""; if (dealById(d)) setDeal(d as DealId); } catch { /* ignore */ } }, []);
  const set = (k: string, v: string) => { setF((x) => ({ ...x, [k]: v })); setErr(""); };
  const d = dealById(deal)!;
  const fields = fieldsFor(deal);
  const docs = DOCUMENTS[deal];

  if (sent) {
    return (
      <main className="wrap flex max-w-[760px] flex-col gap-4 pb-16 pt-12">
        <h1 className="m-0 font-display text-3xl font-bold" data-testid="apply-done">{FORMS_LIVE ? "Thanks — we'll review it within 5 business days." : "Thanks — almost there."}</h1>
        <p className="m-0 text-ink-2">{FORMS_LIVE ? (deal === "succession" ? "Everything you shared stays confidential. We'll suggest a time to talk, and nothing is shared with your staff or customers." : "If it's a fit, we'll send indicative terms in writing. No obligation either way.") : FORM_NOT_SENT}</p>
        <div className="card flex flex-col gap-2 p-5" data-testid="apply-docs">
          <b>What to have ready if we go ahead</b>
          <ul className="m-0 flex flex-col gap-1 pl-5 text-[14px] text-ink-2">{docs.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="m-0 text-[12.5px] text-muted">We&apos;ll ask for these in writing. You never need to send card or bank details by email.</p>
        </div>
        <Link href="/ways-to-pay/" className="btn btn-outline self-start">Back to ways to work with us</Link>
      </main>
    );
  }

  const label = "flex flex-col gap-1.5 text-sm";
  return (
    <main className="wrap flex max-w-[860px] flex-col gap-6 pb-16 pt-10">
      <div className="kicker">Apply · about 4 minutes</div>
      <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">Tell us about your business — we&apos;ll suggest the best deal.</h1>
      {!FORMS_LIVE && <div className="rounded-lg bg-[#FFF4E5] px-3 py-2 text-[14px] text-ink-2"><b>Pre-launch:</b> applications open at launch, so this form can&apos;t be sent yet. You can still see the questions now; save this page and come back at launch.</div>}
      <form className="flex flex-col gap-5" data-nocurrency onSubmit={(e) => {
        e.preventDefault();
        if (!f.name?.trim() || !f.company?.trim()) return setErr("Please add your name and company.");
        if (!/.+@.+\..+/.test(f.email || "")) return setErr("Please add an email we can reply to.");
        if (!f.stage) return setErr("Please pick your company's size.");
        const missing = fields.find((x) => x.required && !(f[x.key] || "").trim());
        if (missing) return setErr(missing.type === "check" ? `Please tick: "${missing.label}".` : `Please answer: "${missing.label}".`);
        const { verdict, flags } = assess(deal, f);
        const pack = { verdict, flags, checks: checksFor(deal, f), documents: docs, at: new Date().toISOString() };
        void sendLead("deal-application", { deal, ...f, pack });
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
            <label className={label}>Your name *<input name="name" type="text" value={f.name || ""} onChange={(e) => set("name", e.target.value)} /></label>
            <label className={label}>Email *<input name="email" type="email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} /></label>
            <label className={label}>Company *<input name="company" type="text" value={f.company || ""} onChange={(e) => set("company", e.target.value)} /></label>
            <label className={label}>Website <span className="text-muted">(optional)</span><input name="website" type="text" value={f.website || ""} onChange={(e) => set("website", e.target.value)} /></label>
            <label className={label}>Country<select name="country" value={f.country} onChange={(e) => set("country", e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className={label}>Annual revenue *<select name="stage" value={f.stage || ""} onChange={(e) => set("stage", e.target.value)}><option value="">Choose one</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></label>
          </div>
          <label className={label}>What would you like automated, or what&apos;s the goal?<textarea name="goal" rows={3} value={f.goal || ""} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. we lose calls while on jobs, invoices go out late, I do all the admin myself" /></label>
        </fieldset>

        <fieldset className="card flex flex-col gap-3 p-5" data-testid="deal-fields"><legend className="px-1 font-bold">3 · What we need to approve {d.name.toLowerCase()}</legend>
          <p className="m-0 text-[13px] text-muted">These are the questions we&apos;d ask before saying yes — answering now saves a call. {deal === "succession" ? "🔒 Confidential: we don't contact your staff, customers or suppliers without your permission." : ""}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.filter((x) => x.type !== "check").map((x) => (
              <label key={x.key} className={`${label} ${x.type === "textarea" ? "sm:col-span-2" : ""}`}>
                {x.label}{x.required ? " *" : ""}
                {x.options ? (
                  <select name={x.key} value={f[x.key] || ""} onChange={(e) => set(x.key, e.target.value)}><option value="">Choose one</option>{x.options.map((o) => <option key={o}>{o}</option>)}</select>
                ) : x.type === "textarea" ? (
                  <textarea name={x.key} rows={3} value={f[x.key] || ""} onChange={(e) => set(x.key, e.target.value)} />
                ) : (
                  <input name={x.key} type="text" value={f[x.key] || ""} onChange={(e) => set(x.key, e.target.value)} />
                )}
                {x.hint && <span className="text-[12px] text-muted">{x.hint}</span>}
              </label>
            ))}
          </div>
          {fields.filter((x) => x.type === "check").map((x) => (
            <label key={x.key} className="flex items-start gap-2 text-sm"><input type="checkbox" name={x.key} checked={f[x.key] === "yes"} onChange={(e) => set(x.key, e.target.checked ? "yes" : "")} className="mt-1" />{x.label}{x.required ? " *" : ""}</label>
          ))}
          <details className="text-[13px] text-ink-2"><summary className="cursor-pointer font-semibold">What you&apos;d sign if we go ahead</summary><ul className="mb-0 mt-2 flex flex-col gap-1 pl-5">{docs.map((x) => <li key={x}>{x}</li>)}</ul></details>
        </fieldset>

        {err && <div role="alert" className="text-sm text-[#B12704]">{err}</div>}
        <button type="submit" className="btn btn-primary self-start">Send my application</button>
        <p className="m-0 text-[12px] text-muted">No obligation. Indicative terms only until a written agreement is signed; plans and stakes are subject to checks and approval. This isn&apos;t financial, legal or tax advice — take your own advice before agreeing to any deal.</p>
      </form>
    </main>
  );
}
