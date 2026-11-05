"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DEALS, DealId, dealById, revenueBands, BANDS } from "@/lib/deals";
import { DOCUMENTS, assess, checksFor, fieldsFor, Field } from "@/lib/dealRules";
import { useCurrency } from "@/components/Currency";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

const COUNTRIES = ["United Kingdom", "United States", "Australia", "Canada", "Ireland", "New Zealand", "Other"];
const COUNTRY_CUR: Record<string, keyof typeof BANDS> = { "United Kingdom": "GBP", "United States": "USD", Australia: "AUD", Canada: "CAD" };
const NEXT = ["We review it within 5 working days — a person, not a machine.", "If it's a fit, we send indicative terms in writing.", "You decide. Nothing is binding until a written agreement is signed."];

/**
 * One application for every way of working with us. The questions change with the deal, so everything
 * we need to approve it is collected up front; the submission carries a first-pass verdict, the checks
 * to run and the documents to request (the approval pack), which /deal-review/ renders for sign-off.
 */
export default function ApplyClient() {
  const [deal, setDeal] = useState<DealId>("monthly");
  const [f, setF] = useState<Record<string, string>>({ name: "", email: "", company: "", website: "", country: "", stage: "", goal: "" });
  const [sent, setSent] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const { cur } = useCurrency();
  const bandCur = COUNTRY_CUR[f.country] ?? (cur in BANDS ? (cur as keyof typeof BANDS) : "USD");
  const STAGES = revenueBands(bandCur);
  // Preselect the visitor's country from their currency (they can still change it).
  useEffect(() => { const c = ({ GBP: "United Kingdom", AUD: "Australia", CAD: "Canada", USD: "United States" } as Record<string, string>)[cur]; if (c) setF((x) => (x.country ? x : { ...x, country: c })); }, [cur]);
  useEffect(() => { try { const d = new URLSearchParams(window.location.search).get("deal") || ""; if (dealById(d)) setDeal(d as DealId); } catch { /* ignore */ } }, []);
  const set = (k: string, v: string) => { setF((x) => ({ ...x, [k]: v, ...(k === "country" ? { stage: "" } : {}) })); setErrs((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const d = dealById(deal)!;
  const fields = fieldsFor(deal);
  const docs = DOCUMENTS[deal];
  const isLtd = /Limited/.test(f.legalForm || "");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.name?.trim()) e.name = "Add your name.";
    if (!/.+@.+\..+/.test(f.email || "")) e.email = "Add an email we can reply to.";
    if (!f.company?.trim()) e.company = "Add your company's name.";
    if (!f.country) e.country = "Choose your country — the checks depend on it.";
    if (!f.stage) e.stage = "Choose your annual revenue.";
    for (const x of fields) {
      const need = x.required || (x.key === "companyNumber" && isLtd);
      if (need && !(f[x.key] || "").trim()) e[x.key] = x.type === "check" ? "Tick this to continue." : x.key === "companyNumber" ? "Add the company number — required for a limited company." : "Answer this question.";
    }
    if (f.privacyAck !== "yes") e.privacyAck = "Tick to confirm you've read how we use your information.";
    return e;
  };

  const LABELS: Record<string, string> = { name: "Your name", email: "Email", company: "Company", country: "Country", stage: "Annual revenue", privacyAck: "Privacy notice", ...Object.fromEntries(fields.map((x) => [x.key, x.label.length > 60 ? x.label.slice(0, 57) + "…" : x.label])) };
  const aria = (k: string) => ({ "aria-invalid": errs[k] ? true : undefined, "aria-describedby": errs[k] ? `err-${k}` : undefined });
  const Err = ({ k }: { k: string }) => (errs[k] ? <span id={`err-${k}`} className="text-[13px] font-semibold text-[#B12704]">{errs[k]}</span> : null);
  const req = <span aria-hidden className="text-[#B12704]"> *</span>;

  if (sent) {
    return (
      <main className="wrap flex max-w-[760px] flex-col gap-4 pb-16 pt-12">
        <div className="kicker">Step 3 of 3 · Sent</div>
        <h1 className="m-0 font-display text-3xl font-bold" data-testid="apply-done">{FORMS_LIVE ? "Thanks — we'll review it within 5 working days." : "Thanks — almost there."}</h1>
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
  const errList = Object.keys(errs);
  const renderField = (x: Field) => {
    const need = x.required || (x.key === "companyNumber" && isLtd);
    const common = { name: x.key, id: `f-${x.key}`, value: f[x.key] || "", "aria-required": need || undefined, ...aria(x.key) };
    return (
      <label key={x.key} className={`${label} ${x.type === "textarea" ? "sm:col-span-2" : ""}`}>
        <span>{x.label}{need ? req : <span className="text-muted"> (optional)</span>}</span>
        {x.options ? (
          <select {...common} onChange={(e) => set(x.key, e.target.value)}><option value="">Choose one</option>{x.options.map((o) => <option key={o}>{o}</option>)}</select>
        ) : x.type === "textarea" ? (
          <textarea {...common} rows={3} onChange={(e) => set(x.key, e.target.value)} />
        ) : (
          <input {...common} type="text" onChange={(e) => set(x.key, e.target.value)} />
        )}
        {x.hint && <span className="text-[12px] text-muted">{x.hint}</span>}
        <Err k={x.key} />
      </label>
    );
  };

  return (
    <main className="wrap grid max-w-[1120px] grid-cols-1 gap-8 pb-16 pt-10 lg:grid-cols-[1fr_300px]">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="kicker">Step 2 of 3 · Apply · about 4 minutes</div>
        <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">Tell us about your business — we&apos;ll suggest the best deal.</h1>
        <ol aria-label="Progress" className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px]">
          {["1 · Choose a way to pay", "2 · Apply", "3 · We review and reply"].map((s, i) => <li key={s} aria-current={i === 1 ? "step" : undefined} className={`rounded-full px-3 py-1 ${i === 1 ? "bg-ink text-white" : i === 0 ? "bg-[#E7F6EC] text-[#0B6B2E]" : "bg-paper text-ink-2"}`}>{s}</li>)}
        </ol>
        {!FORMS_LIVE && <div className="rounded-lg bg-[#FFF4E5] px-3 py-2 text-[14px] text-ink-2"><b>Pre-launch:</b> applications open at launch, so this form can&apos;t be sent yet. You can still see the questions now; save this page and come back at launch.</div>}
        {errList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-lg border-2 border-[#B12704] bg-[#FDECEA] p-4 text-[14px]" data-testid="error-summary">
            <b>Please fix {errList.length} {errList.length === 1 ? "thing" : "things"}:</b>
            <ul className="m-0 mt-1 pl-5">{errList.map((k) => <li key={k}><a href={`#f-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`f-${k}`)?.focus(); }}>{LABELS[k] ?? k}: {errs[k]}</a></li>)}</ul>
          </div>
        )}
        <form className="flex flex-col gap-5" data-nocurrency noValidate onSubmit={(e) => {
          e.preventDefault();
          const v = validate();
          setErrs(v);
          if (Object.keys(v).length) { requestAnimationFrame(() => summaryRef.current?.focus()); return; }
          const { verdict, flags } = assess(deal, f);
          const pack = { verdict, flags, checks: checksFor(deal, f), documents: docs, at: new Date().toISOString() };
          void sendLead("deal-application", { deal, ...f, pack });
          setSent(true);
          window.scrollTo(0, 0);
        }}>
          <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">1 · Which deal interests you?</legend>
            <div role="radiogroup" aria-label="Way to pay" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DEALS.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={deal === x.id} data-deal={x.id} onClick={() => setDeal(x.id)} className={`flex min-h-[56px] cursor-pointer flex-col items-start rounded-lg px-3 py-2 text-left ${deal === x.id ? "border-2 border-clay bg-clay-soft" : "border border-line bg-white"}`}>
                  <b>{x.name}</b><span className="text-[12.5px] text-ink-2">{x.forWho}</span>
                </button>
              ))}
            </div>
            <p className="m-0 text-[14px] text-ink-2"><b>{d.name}:</b> {d.how}</p>
          </fieldset>

          <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">2 · About you and the company</legend>
            <p className="m-0 text-[12.5px] text-muted">Fields marked <span className="text-[#B12704]">*</span> are required.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={label}><span>Your name{req}</span><input id="f-name" name="name" type="text" autoComplete="name" aria-required value={f.name || ""} onChange={(e) => set("name", e.target.value)} {...aria("name")} /><Err k="name" /></label>
              <label className={label}><span>Email{req}</span><input id="f-email" name="email" type="email" autoComplete="email" aria-required value={f.email || ""} onChange={(e) => set("email", e.target.value)} {...aria("email")} /><Err k="email" /></label>
              <label className={label}><span>Company{req}</span><input id="f-company" name="company" type="text" autoComplete="organization" aria-required value={f.company || ""} onChange={(e) => set("company", e.target.value)} {...aria("company")} /><Err k="company" /></label>
              <label className={label}><span>Website <span className="text-muted">(optional)</span></span><input id="f-website" name="website" type="text" autoComplete="url" value={f.website || ""} onChange={(e) => set("website", e.target.value)} /></label>
              <label className={label}><span>Country{req}</span><select id="f-country" name="country" aria-required value={f.country} onChange={(e) => set("country", e.target.value)} {...aria("country")}><option value="">Choose one</option>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select><Err k="country" /></label>
              <label className={label}><span>Annual revenue{req}</span><select id="f-stage" name="stage" aria-required value={f.stage || ""} onChange={(e) => set("stage", e.target.value)} {...aria("stage")}><option value="">Choose one</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select><Err k="stage" /></label>
            </div>
            <label className={label}><span>What would you like automated, or what&apos;s the goal? <span className="text-muted">(optional)</span></span><textarea id="f-goal" name="goal" rows={3} value={f.goal || ""} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. we lose calls while on jobs, invoices go out late, I do all the admin myself" /></label>
          </fieldset>

          <fieldset className="card flex flex-col gap-3 p-5" data-testid="deal-fields"><legend className="px-1 font-bold">3 · What we need to approve {d.name.toLowerCase()}</legend>
            {deal === "succession" ? (
              <div className="rounded-lg border border-[#0B6B2E] bg-[#E7F6EC] p-3 text-[14px]" data-testid="confidential">
                <b>Strictly confidential.</b> Only the partner reviewing your application sees these answers. We never contact your staff, customers or suppliers without your written permission, and we&apos;ll sign an NDA before you share anything detailed. Prefer to talk first? Tick the box below and leave the rest blank — we&apos;ll call you.
                <label className="mt-2 flex items-start gap-2"><input type="checkbox" checked={f.callFirst === "yes"} onChange={(e) => set("callFirst", e.target.checked ? "yes" : "")} className="mt-1" />I&apos;d prefer a confidential call before answering these questions</label>
              </div>
            ) : <p className="m-0 text-[13px] text-muted">These are the questions we&apos;d ask before saying yes — answering now saves a call.</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{fields.filter((x) => x.type !== "check").map(renderField)}</div>
            {fields.filter((x) => x.type === "check").map((x) => (
              <div key={x.key} className="flex flex-col gap-1">
                <label className="flex items-start gap-2 text-sm"><input id={`f-${x.key}`} type="checkbox" name={x.key} aria-required={x.required || undefined} {...aria(x.key)} checked={f[x.key] === "yes"} onChange={(e) => set(x.key, e.target.checked ? "yes" : "")} className="mt-1" /><span>{x.label}{x.required ? req : ""}</span></label>
                <Err k={x.key} />
              </div>
            ))}
            <details className="text-[13px] text-ink-2"><summary className="cursor-pointer font-semibold">What you&apos;d sign if we go ahead</summary><ul className="mb-0 mt-2 flex flex-col gap-1 pl-5">{docs.map((x) => <li key={x}>{x}</li>)}</ul></details>
          </fieldset>

          <section className="card flex flex-col gap-2 p-5 text-[13.5px] text-ink-2" aria-labelledby="privacy-h" data-testid="privacy-notice">
            <h2 id="privacy-h" className="m-0 text-[15px] font-bold text-ink">How we use your information</h2>
            <ul className="m-0 flex flex-col gap-1 pl-5">
              <li><b>Who:</b> TaskAutoMode is responsible for the information you give here.</li>
              <li><b>Why:</b> to assess this application and reply to you. Our lawful basis is steps you ask us to take before a contract.</li>
              <li><b>Shared with:</b> only those needed to decide — a credit reference agency for business searches{deal === "finance" ? " and our finance partner (named before anything is shared)" : ""}. Never sold, never used for unrelated marketing.</li>
              <li><b>Kept:</b> 12 months if no deal goes ahead, then deleted; for the life of the contract plus 6 years if it does.</li>
              <li><b>Your rights:</b> see, correct or delete your information, or object, by emailing us; you can complain to the ICO (UK) or your local regulator.</li>
            </ul>
            <p className="m-0">Full detail: <Link href="/legal/privacy/">privacy policy</Link>.</p>
            <label className="flex items-start gap-2 text-sm text-ink"><input id="f-privacyAck" type="checkbox" aria-required {...aria("privacyAck")} checked={f.privacyAck === "yes"} onChange={(e) => set("privacyAck", e.target.checked ? "yes" : "")} className="mt-1" /><span>I&apos;ve read how my information will be used{req}</span></label>
            <Err k="privacyAck" />
          </section>

          <button type="submit" className="btn btn-primary self-start">Send my application</button>
          <p className="m-0 text-[12px] text-muted">No obligation. Indicative terms only until a written agreement is signed; plans and stakes are subject to checks and approval. This isn&apos;t financial, legal or tax advice — take your own advice before agreeing to any deal.</p>
        </form>
      </div>
      <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start" aria-label="What happens next">
        <div className="card flex flex-col gap-3 p-5" data-testid="what-next">
          <b>What happens next</b>
          <ol className="m-0 flex flex-col gap-2 pl-5 text-[14px] text-ink-2">{NEXT.map((x) => <li key={x}>{x}</li>)}</ol>
          <p className="m-0 text-[12.5px] text-muted">We never ask for card or bank details by email or on this form.</p>
        </div>
      </aside>
    </main>
  );
}
