"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRIEFS, Brief, NOW, ROUTES, matchBriefs } from "@/data/briefs";
import { Product, byId, fmt, priceLabel } from "@/lib/catalogue";
import { TRADES } from "@/lib/trades";
import { flowFor } from "@/lib/buying";
import AIChat from "@/components/AIChat";
import { ASSISTANT_ENDPOINT, BOOKING_URL, FORMS_LIVE, FORM_NOT_SENT, PAYMENTS_LIVE } from "@/lib/launch";
import { APP_GROUPS, INDUSTRY_APPS } from "@/lib/apps";
import { sendLead } from "@/lib/attribution";

const POPULAR = ["reviews", "missed-calls", "invoice-chase", "lead-reply", "quote-chase", "social"];
const STARTERS = ["admin", "invoice-chase", "missed-calls", "reviews", "lead-reply", "quote-build"];
const WHEN = ["As soon as possible", "Within 1–3 months", "Just exploring"];
const VOLUMES = ["Under 10 a week", "10–50 a week", "50–200 a week", "Over 200 a week", "Not sure"];
const HIDE = /^\/(checkout|deal-review|apply|launch|ask)\//;
/** The six problems owners describe (research report §8, step 1), each with the products that solve it. */
export const PROBLEMS: { id: string; label: string; ids: number[] }[] = [
  { id: "customers", label: "Get more customers", ids: [11, 10, 13, 15, 7, 8, 4, 1, 16, 20, 65, 14] },
  { id: "paid", label: "Get paid faster & tidy money", ids: [22, 123, 21, 23, 24, 124, 125, 127, 25, 146, 121, 126] },
  { id: "team", label: "Run the team without chasing", ids: [96, 93, 49, 30, 94, 95, 110, 61, 111, 50] },
  { id: "ops", label: "Run sites, stock & jobs", ids: [26, 27, 29, 113, 98, 130, 28, 36, 97, 131, 37, 38] },
  { id: "compliance", label: "Stay audit-ready & compliant", ids: [81, 82, 83, 85, 37, 38, 88, 116, 78] },
  { id: "content", label: "Content & social on autopilot", ids: [17, 144, 142, 143] },
];
/** Products that need a quick compliance check before we take them on (6 Nov product check). */
const CHECK_FIRST = new Set([12, 35, 132, 141, 33, 79, 80, 107, 110, 126, 138, 66]);
const STAFF = ["Just me", "2–10", "11–50", "50+"];
const BUDGET = ["Under $1,000", "$1,000–3,000", "$3,000–10,000", "$10,000+", "Not sure yet"];
/** A product with no enquiry brief still gets a usable one, built from its own page. */
const briefOf = (p: Product): Brief => {
  const found = BRIEFS.find((b) => b.products[0] === p.id);
  if (found) return found;
  const f = flowFor(p);
  const st = [...f.steps, "", "", ""].slice(0, 3) as [string, string, string];
  return { id: `p${p.id}`, keys: "", outcome: f.result, trigger: f.start, inputs: f.needs ?? [], from: f.from ?? p.apps, steps: st, ask: f.decide ?? ["How do you do it today?", "Which apps hold the information?", "Who approves or gets alerted?"], native: f.native, products: [p.id] };
};
const TIMES = ["Weekday morning", "Weekday afternoon", "Weekday evening", "Any time"];
/** Words that mean "I'm not sure this fits me" — answered with reassurance and a call, never a hard sell. */
const WORRY = /complicat|confus|not sure|unsure|don'?t know|no idea|different(ly)? |my own way|our own way|won'?t work|not work for|doesn'?t fit|too (hard|much|technical)|overwhelm|help me|scared|worried|is this for me|can you call|speak to|talk to/i;
const KNOWN = [...APP_GROUPS, ...INDUSTRY_APPS].flatMap(([, a]) => a).concat(["Zoho", "Sheets", "Google Drive", "OneDrive", "Teams", "Jobber", "ServiceM8", "Tradify", "Dext", "Hubdoc", "BrightPay", "Gusto", "Deputy", "Facebook", "Instagram", "LinkedIn", "Google Ads", "Canva", "Notion", "Trello", "Typeform", "Google Forms", "spreadsheet", "email", "phone", "paper"]);
const toolCheck = (t: string) => t.split(/,|\band\b|\/|\+|&/i).map((x) => x.trim()).filter((x) => x.length > 1).map((x) => ({ name: x, known: KNOWN.some((k) => k.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(k.toLowerCase().split(" ")[0])) }));

/**
 * Automation assistant. Starts from the RESULT the customer wants (output first), shows how we'd do it
 * (trigger → inputs → 3 steps), asks how they do it today and which tools they use, then sends a
 * structured brief so we can reply with the right demo, options and a fixed price. A person checks every brief.
 */
export default function Assistant({ inline = false }: { inline?: boolean }) {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(inline);
  const [step, setStep] = useState(0);
  const [said, setSaid] = useState("");
  const [pick, setPick] = useState<Brief | null>(null);
  const [now, setNow] = useState("");
  const [tools, setTools] = useState("");
  const [volume, setVolume] = useState("");
  const [route, setRoute] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [when, setWhen] = useState("");
  const [approver, setApprover] = useState("");
  const [unsure, setUnsure] = useState(false);
  const [c, setC] = useState({ name: "", email: "", company: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [talk, setTalk] = useState(false);
  const [times, setTimes] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [pain, setPain] = useState("");
  const [staff, setStaff] = useState("");
  const [budget, setBudget] = useState("");
  const [custom, setCustom] = useState({ systems: "", volume: "", cost: "", signoff: "", offer: "" });
  const [ai, setAi] = useState(!!ASSISTANT_ENDPOINT);
  const panel = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => matchBriefs(said), [said]);
  useEffect(() => { if (open && !inline) panel.current?.focus(); }, [open, inline, step]);
  useEffect(() => { if (!open || inline) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, inline]);
  useEffect(() => {
    const on = () => { setTalk(true); setOpen(true); };
    window.addEventListener("ta:talk", on);
    return () => window.removeEventListener("ta:talk", on);
  }, []);
  useEffect(() => {
    const on = (e: Event) => {
      const pain = (e as CustomEvent<{ pain?: string }>).detail?.pain;
      setOpen(true); setTalk(false); setSent(false);
      if (pain) { setPain(pain); setUnsure(true); setStep(10); }
    };
    window.addEventListener("ta:open", on);
    return () => window.removeEventListener("ta:open", on);
  }, []);
  if (!inline && HIDE.test(path)) return null;

  const worried = WORRY.test([said, tools, ...Object.values(answers)].join(" "));
  const tc = toolCheck(tools);
  const mentioned = KNOWN.filter((k) => k.length > 3 && !/^(email|phone|paper|spreadsheet)$/i.test(k) && new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(said)).slice(0, 3);
  const bookCall = () => {
    if (!c.name.trim()) return setErr("Add your name.");
    if (!/.+@.+\..+/.test(c.email)) return setErr("Add an email we can reply to.");
    void sendLead("call-request", { ...c, phone, times, said, tools, page: path, brief: pick?.id || "" });
    setSent(true); setErr("");
  };
  const reset = () => { setIndustry(""); setPain(""); setStaff(""); setBudget(""); setCustom({ systems: "", volume: "", cost: "", signoff: "", offer: "" }); setTalk(false); setTimes(""); setPhone(""); setStep(0); setSaid(""); setPick(null); setNow(""); setTools(""); setVolume(""); setRoute(""); setAnswers({}); setWhen(""); setApprover(""); setUnsure(false); setSent(false); setErr(""); };
  const choose = (b: Brief | null) => { setPick(b); setStep(2); };
  const demo = pick?.products[0] ? `/p/${pick.products[0]}/` : "/demos/";
  const send = () => {
    if (!c.name.trim()) return setErr("Add your name.");
    if (!/.+@.+\..+/.test(c.email)) return setErr("Add an email we can reply to.");
    const brief = pick ? { id: pick.id, outcome: pick.outcome, trigger: pick.trigger, inputs: pick.inputs, from: pick.from, steps: pick.steps, toConfirm: pick.ask, native: pick.native || "", products: pick.products, kit: pick.kit || null } : { id: "custom", outcome: said, toConfirm: ["What should happen, for whom, and when?", "Where does the information live today?", "Who approves it?"] };
    const pid = pick?.products[0];
    const match = pid ? { id: pid, name: byId(pid).name, price: byId(pid).price, confidence: pick && matches.includes(pick) && matches[0] === pick ? "high" : unsure || industry ? "suggested" : "picked" } : null;
    void sendLead("automation-brief", { said, ...c, now, tools, volume, route, when, approver, answers, industry, pain, staff, budget, page: path, brief, match, complianceCheck: pid ? CHECK_FIRST.has(pid) : false, assumed: [industry ? "" : "industry not given", volume ? "" : "volume not given"].filter(Boolean) });
    setSent(true); setErr("");
  };

  const sendCustom = () => {
    if (!c.name.trim()) return setErr("Add your name.");
    if (!/.+@.+\..+/.test(c.email)) return setErr("Add an email we can reply to.");
    void sendLead("custom-brief", { said, ...c, staff, budget, ...custom, page: path });
    setSent(true); setErr("");
  };
  const productCard = (p: Product, onPick?: () => void) => (
    <div key={p.id} className="flex flex-col gap-1 rounded-lg border border-line bg-white p-3 text-[13.5px]" data-testid="assistant-product">
      <div className="flex items-baseline justify-between gap-2"><b className="text-[14.5px]">{p.name}</b><b className="whitespace-nowrap text-[15px]">{priceLabel(p)}</b></div>
      <span className="text-ink-2">{flowFor(p).result}</span>
      <span className="text-[12.5px] text-muted">{p.monthly ? "Monthly service" : `Fixed price · live in about ${p.days} business days`} · running costs paid by you, at cost{CHECK_FIRST.has(p.id) ? " · quick compliance check first" : ""}</span>
      <div className="mt-1 flex flex-wrap gap-2">
        {onPick && <button type="button" className="btn btn-primary !min-h-[36px] !px-3 !text-[13px]" onClick={onPick} data-testid="assistant-pick">This one — tailor it</button>}
        <Link href={`/p/${p.id}/`} className="text-[13px]" onClick={() => !inline && setOpen(false)}>See full page</Link>
        {!CHECK_FIRST.has(p.id) && <Link href={`/checkout/?plan=${p.id}`} className="text-[13px]">{PAYMENTS_LIVE ? "Buy now" : "Reserve"}</Link>}
      </div>
    </div>
  );
  const recs = (() => {
    const pr = PROBLEMS.find((x) => x.id === pain);
    const tr = TRADES.find((t) => t.slug === industry);
    const pool = pr ? pr.ids : tr ? tr.top : [];
    const first = tr && pr ? pr.ids.filter((id) => tr.top.includes(id) || (tr.journey ?? []).some(([, ids]) => ids.includes(id))) : [];
    return [...new Set([...first, ...pool])].map(byId).filter(Boolean).slice(0, 3);
  })();
  const chip = "min-h-[40px] cursor-pointer rounded-full border border-line bg-white px-3 text-left text-[13.5px] hover:border-ink";
  const opt = (on: boolean) => `flex min-h-[48px] w-full cursor-pointer flex-col items-start rounded-lg px-3 py-2 text-left text-[14px] ${on ? "border-2 border-clay bg-clay-soft" : "border border-line bg-white"}`;
  const steps = ["Result", "How", "Today", "Tools", "Route", "Send"];

  const reassure = (
    <div className="flex flex-col gap-1.5 rounded-lg border-l-4 border-clay bg-clay-soft p-3 text-[13.5px]" data-testid="assistant-reassure">
      <b>That's completely normal.</b>
      <span>Everything we show is an example. We build it around how you already work and the software you already use — you don't need to change your way of doing things. The easiest next step is a free 20-minute call: you talk, we sketch it for you.</span>
      <button type="button" className="btn btn-primary self-start" onClick={() => setTalk(true)} data-testid="assistant-talk-cta">Book a free call</button>
    </div>
  );

  const talkView = (
    <div className="flex flex-col gap-3" data-testid="assistant-talk">
      <b className="text-[16px]">Talk it through — free, 20 minutes</b>
      <p className="m-0 text-[13.5px] text-ink-2">No tech knowledge needed. Tell us how you do it today; we'll tell you honestly what's worth automating, how it would fit your software, and what it would cost. No obligation.</p>
      {BOOKING_URL ? <a href={BOOKING_URL} target="_blank" rel="noopener" className="btn btn-primary self-start" data-testid="assistant-book-link">Pick a time →</a> : null}
      <b className="text-[14px]">{BOOKING_URL ? "Or we'll send you times:" : "When suits you? We'll send you times to pick from."}</b>
      <div className="flex flex-wrap gap-1.5">{TIMES.map((v) => <button key={v} type="button" aria-pressed={times === v} className={`${chip} ${times === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setTimes(v)}>{v}</button>)}</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-[13.5px]">Your name<input type="text" autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} data-testid="talk-name" /></label>
        <label className="flex flex-col gap-1 text-[13.5px]">Email<input type="email" autoComplete="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} data-testid="talk-email" /></label>
        <label className="flex flex-col gap-1 text-[13.5px] sm:col-span-2">Phone <span className="text-muted">(optional, if you'd rather we ring)</span><input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label className="flex flex-col gap-1 text-[13.5px] sm:col-span-2">What's on your mind? <span className="text-muted">(optional)</span><textarea rows={2} value={said} onChange={(e) => setSaid(e.target.value)} /></label>
      </div>
      {err && <div role="alert" className="text-[13px] font-semibold text-[#B12704]">{err}</div>}
      <button type="button" className="btn btn-primary self-start" onClick={bookCall} data-testid="talk-send">Request my call</button>
      <button type="button" className="self-start border-0 bg-transparent p-0 text-[12.5px] text-muted underline" onClick={() => { setTalk(false); setErr(""); }}>← Back to the planner</button>
      <p className="m-0 text-[12px] text-muted">We only use this to arrange the call. <Link href="/legal/privacy/">Privacy</Link></p>
    </div>
  );

  const body = (
    <div className="flex flex-col gap-3" data-testid="assistant-body">
      {!sent && step > 0 && step < 10 && <ol aria-label="Progress" className="m-0 flex list-none gap-1 p-0">{steps.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-clay" : "bg-line"}`}><span className="sr-only">{s}</span></li>)}</ol>}
      {sent ? (
        <div className="flex flex-col gap-2" data-testid="assistant-done">
          <b className="text-[17px]">{FORMS_LIVE ? (talk ? "Got it — we'll be in touch to book your call." : "Got it — your brief is with us.") : "Thanks — almost there."}</b>
          <p className="m-0 text-[14px] text-ink-2">{FORMS_LIVE ? talk ? "Within 1 working day you'll get times to pick from. Nothing to prepare — just tell us how you do it today." : "A person reads every brief. Within 1 working day you'll get how it would work for you, a short demo and a fixed price — or how to switch it on yourself if your software already does it." : FORM_NOT_SENT}</p>
          <Link href={demo} className="btn btn-primary self-start" onClick={() => !inline && setOpen(false)}>See it working →</Link>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={reset}>Start another</button>
        </div>
      ) : talk ? talkView : ai && step === 0 ? (
        <AIChat endpoint={ASSISTANT_ENDPOINT} page={path} onFallback={() => setAi(false)} onTalk={() => setTalk(true)} onDone={() => setSent(true)} />
      ) : step === 0 ? (
        <>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold" htmlFor="as-said">What result do you want?
            <span className="text-[12.5px] font-normal text-muted">Describe the outcome, not the tech — e.g. “every customer gets asked for a Google review after the job”.</span>
          </label>
          <textarea id="as-said" rows={3} value={said} onChange={(e) => setSaid(e.target.value)} data-testid="assistant-input" />
          {worried && reassure}
          {mentioned.length > 0 && <div className="text-[13px] text-ok" data-testid="assistant-mentioned">✓ We work with {mentioned.join(", ")} — we build around it, not instead of it.</div>}
          <div className="flex flex-wrap gap-1.5">{POPULAR.map((id) => { const b = BRIEFS.find((x) => x.id === id)!; return <button key={id} type="button" className={chip} onClick={() => { setSaid(b.outcome); choose(b); }}>{b.outcome.split(/[,—]/)[0]}</button>; })}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!said.trim()} onClick={() => setStep(1)} data-testid="assistant-next">Show me how</button>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <button type="button" className={opt(false)} onClick={() => { setUnsure(true); setStep(10); }} data-testid="assistant-unsure"><b>Not sure what's possible?</b><span className="text-[12.5px] text-ink-2">Two taps → 3 ideas with prices</span></button>
            <button type="button" className={opt(false)} onClick={() => setStep(20)} data-testid="assistant-custom"><b>Something bigger or custom</b><span className="text-[12.5px] text-ink-2">Several systems, 50+ staff, or your own process</span></button>
          </div>
        </>
      ) : step === 1 ? (
        <>
          <b className="text-[15px]">{unsure ? "Most owners start with one of these:" : matches.length ? "Closest jobs we build — pick one, or describe yours:" : "Nothing close in our list yet — that’s fine. Pick a starting point or send your words:"}</b>
          {(unsure || !matches.length ? STARTERS.map((id) => BRIEFS.find((x) => x.id === id)!) : matches).map((b) => (
            <button key={b.id} type="button" className={opt(false)} onClick={() => choose(b)} data-testid="assistant-match">
              <b>{b.outcome}</b><span className="text-[12.5px] text-ink-2">Starts when: {b.trigger.toLowerCase()}</span>{b.products[0] ? <span className="text-[12.5px] font-semibold">{byId(b.products[0]).name} · {priceLabel(byId(b.products[0]))}{byId(b.products[0]).monthly ? "" : ` · live in about ${byId(b.products[0]).days} days`}</span> : <span className="text-[12.5px] text-muted">Priced after a quick look</span>}
            </button>
          ))}
          <button type="button" className={opt(false)} onClick={() => choose(null)}><b>None of these — send my words as they are</b><span className="text-[12.5px] text-ink-2">We’ll reply with how the input and processing would work for your exact case.</span></button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(0)}>← Change what I want</button>
        </>
      ) : step === 2 ? (
        <>
          {pick?.products[0] ? productCard(byId(pick.products[0])) : null}
          {pick ? (
            <div className="flex flex-col gap-2 rounded-lg bg-paper p-3 text-[13.5px]" data-testid="assistant-how">
              <span className="text-[12px] text-clay">Example of how it usually works — we tailor every step to you</span>
              <b className="text-[15px]">{pick.outcome}</b>
              <div><b>Starts when:</b> {pick.trigger}</div>
              <div><b>We’ll need:</b> {pick.inputs.join(" · ")}</div>
              <div className="text-ink-2">Usually from: {pick.from}</div>
              <ol className="m-0 flex list-decimal flex-col gap-0.5 pl-5">{pick.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              {pick.native && <div className="rounded bg-white px-2 py-1 text-[12.5px]"><b>Honest tip:</b> {pick.native}</div>}
            </div>
          ) : null}
          {pick ? (
            <div className="flex flex-col gap-2" data-testid="assistant-questions">
              <b className="text-[14px]">Quick questions <span className="font-normal text-muted">(optional — saves a call)</span></b>
              {pick.ask.slice(0, 2).map((q) => (
                <label key={q} className="flex flex-col gap-1 text-[13px]">{q}<input type="text" value={answers[q] || ""} onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })} /></label>
              ))}
            </div>
          ) : <p className="m-0 text-[14px] text-ink-2">No problem — tell us how it works today and we’ll design the input and processing for you.</p>}
          <b className="text-[14px]">How do you do it today?</b>
          <div role="radiogroup" aria-label="How you do it today" className="flex flex-col gap-1.5">{NOW.map((n) => <button key={n.id} type="button" role="radio" aria-checked={now === n.id} className={opt(now === n.id)} onClick={() => setNow(n.id)}><b>{n.label}</b>{now === n.id && <span className="text-[12.5px] text-ink-2">{n.path}</span>}</button>)}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!now} onClick={() => setStep(3)}>Next</button>
        </>
      ) : step === 3 ? (
        <>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Which tools do you use for this? <span className="text-[12.5px] font-normal text-muted">Optional — e.g. Xero, Jobber, Gmail, WhatsApp, a spreadsheet</span>
            <input type="text" value={tools} onChange={(e) => setTools(e.target.value)} className="font-normal" data-testid="assistant-tools" />
          </label>
          {tc.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[13px]" data-testid="assistant-toolcheck">{tc.map((t) => <li key={t.name}>{t.known ? <span className="text-ok">✓ We work with {t.name}</span> : <span>• {t.name}: not on our usual list — we check it for free before you pay, or talk it through on a call</span>}</li>)}</ul>
          )}
          {worried && reassure}
          <b className="text-[14px]">Roughly how many a week?</b>
          <div className="flex flex-wrap gap-1.5">{VOLUMES.map((v) => <button key={v} type="button" aria-pressed={volume === v} className={`${chip} ${volume === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setVolume(v)}>{v}</button>)}</div>
          <b className="text-[14px]">How many people work in the business?</b>
          <div className="flex flex-wrap gap-1.5">{STAFF.map((v) => <button key={v} type="button" aria-pressed={staff === v} className={`${chip} ${staff === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setStaff(v)}>{v}</button>)}</div>
          <b className="text-[14px]">When do you need it?</b>
          <div className="flex flex-wrap gap-1.5">{WHEN.map((v) => <button key={v} type="button" aria-pressed={when === v} className={`${chip} ${when === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setWhen(v)}>{v}</button>)}</div>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Who would sign off the test run? <span className="text-[12.5px] font-normal text-muted">Optional — name or role</span>
            <input type="text" value={approver} onChange={(e) => setApprover(e.target.value)} className="font-normal" />
          </label>
          <button type="button" className="btn btn-primary self-start" onClick={() => setStep(4)}>Next</button>
        </>
      ) : step === 10 ? (
        <>
          <b className="text-[15px]">What's your business?</b>
          <div className="flex flex-wrap gap-1.5" data-testid="assistant-industries">{TRADES.slice(0, 12).map((t) => <button key={t.slug} type="button" aria-pressed={industry === t.slug} className={`${chip} ${industry === t.slug ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setIndustry(t.slug)}>{t.name}</button>)}</div>
          <b className="text-[15px]">Where does your week go?</b>
          <div className="flex flex-wrap gap-1.5" data-testid="assistant-pains">{PROBLEMS.map((p) => <button key={p.id} type="button" aria-pressed={pain === p.id} className={`${chip} ${pain === p.id ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setPain(p.id)}>{p.label}</button>)}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!industry && !pain} onClick={() => setStep(11)} data-testid="assistant-ideas">Show me 3 ideas</button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(0)}>← Back</button>
        </>
      ) : step === 11 ? (
        <>
          <b className="text-[15px]">3 ideas for you, with prices</b>
          <p className="m-0 text-[13px] text-ink-2">Each one is an example we tailor to how you work. Pick one to tell us more — or book a free call.</p>
          {recs.map((p) => productCard(p, () => { setSaid(flowFor(p).result); choose(briefOf(p)); }))}
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(10)}>← Change my answers</button>
        </>
      ) : step === 20 ? (
        <>
          <b className="text-[15px]">Tell us about it — 4 quick questions</b>
          <label className="flex flex-col gap-1 text-[13.5px]">What should happen, in your words?<textarea rows={2} value={said} onChange={(e) => setSaid(e.target.value)} data-testid="custom-what" /></label>
          <label className="flex flex-col gap-1 text-[13.5px]">Which systems are involved?<input type="text" value={custom.systems} onChange={(e) => setCustom({ ...custom, systems: e.target.value })} placeholder="e.g. Sage, our ERP, Outlook, a spreadsheet" /></label>
          <label className="flex flex-col gap-1 text-[13.5px]">How many a week, roughly?<input type="text" value={custom.volume} onChange={(e) => setCustom({ ...custom, volume: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-[13.5px]">What does it cost when it goes wrong?<input type="text" value={custom.cost} onChange={(e) => setCustom({ ...custom, cost: e.target.value })} placeholder="e.g. late orders, a person's full day, fines" /></label>
          <b className="text-[14px]">People in the business</b>
          <div className="flex flex-wrap gap-1.5">{STAFF.map((v) => <button key={v} type="button" aria-pressed={staff === v} className={`${chip} ${staff === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setStaff(v)}>{v}</button>)}</div>
          <b className="text-[14px]">Budget in mind</b>
          <div className="flex flex-wrap gap-1.5">{BUDGET.map((v) => <button key={v} type="button" aria-pressed={budget === v} className={`${chip} ${budget === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setBudget(v)}>{v}</button>)}</div>
          <b className="text-[14px]">How should we take it from here?</b>
          <div role="radiogroup" className="flex flex-col gap-1.5">
            <button type="button" role="radio" aria-checked={custom.offer === "call"} className={opt(custom.offer === "call")} onClick={() => setCustom({ ...custom, offer: "call" })}><b>Free 20-minute call</b><span className="text-[12.5px] text-ink-2">Best for one or two workflows. We come back with a fixed price.</span></button>
            <button type="button" role="radio" aria-checked={custom.offer === "audit"} className={opt(custom.offer === "audit")} onClick={() => setCustom({ ...custom, offer: "audit" })}><b>Paid automation audit — {fmt(499)}</b><span className="text-[12.5px] text-ink-2">For several systems or 50+ staff: a ranked plan with fixed quotes. Fee credited if you build with us.</span></button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-[13.5px]">Your name<input type="text" autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></label>
            <label className="flex flex-col gap-1 text-[13.5px]">Email<input type="email" autoComplete="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></label>
          </div>
          {err && <div role="alert" className="text-[13px] font-semibold text-[#B12704]">{err}</div>}
          <button type="button" className="btn btn-primary self-start" disabled={!custom.offer} onClick={sendCustom} data-testid="custom-send">Send</button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(0)}>← Back</button>
        </>
      ) : step === 4 ? (
        <>
          <b className="text-[14px]">How would you like it?</b>
          <div role="radiogroup" aria-label="How you'd like it" className="flex flex-col gap-1.5">{ROUTES.map((r) => { const off = r.id === "diy" && !!pick && !pick.kit && pick.id !== "learn"; return <button key={r.id} type="button" role="radio" aria-checked={route === r.id} disabled={off} className={`${opt(route === r.id)} ${off ? "cursor-not-allowed opacity-60" : ""}`} onClick={() => setRoute(r.id)}><b>{r.label}</b><span className="text-[12.5px] text-ink-2">{off ? "No DIY kit for this one yet — the other two routes work." : `${r.id === "diy" && pick?.kit ? `${byId(pick.kit).name} — ` : ""}${r.note}`}</span></button>; })}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!route} onClick={() => setStep(5)}>Next</button>
        </>
      ) : (
        <>
          <b className="text-[14px]">Where should we send your plan?</b>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-[13.5px]">Your name<input type="text" autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></label>
            <label className="flex flex-col gap-1 text-[13.5px]">Email<input type="email" autoComplete="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></label>
            <label className="flex flex-col gap-1 text-[13.5px] sm:col-span-2">Business <span className="text-muted">(optional)</span><input type="text" autoComplete="organization" value={c.company} onChange={(e) => setC({ ...c, company: e.target.value })} /></label>
          </div>
          {err && <div role="alert" className="text-[13px] font-semibold text-[#B12704]">{err}</div>}
          <button type="button" className="btn btn-primary self-start" onClick={send} data-testid="assistant-send">Send my brief</button>
          <p className="m-0 text-[12px] text-muted">We only use this to reply about your automation. No passwords needed — logins come later, in your own accounts. <Link href="/legal/privacy/">Privacy</Link></p>
        </>
      )}
      {!sent && !talk && step > 1 && step < 10 && <button type="button" className="self-start border-0 bg-transparent p-0 text-[12.5px] text-muted underline" onClick={() => setStep(step - 1)}>← Back</button>}
      {!sent && !talk && !(ai && step === 0) && <button type="button" className="self-start rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold" onClick={() => setTalk(true)} data-testid="assistant-talk">☎ Rather talk it through? Book a free call</button>}
    </div>
  );

  if (inline) return <div className="card p-5">{body}</div>;
  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} data-testid="assistant-open" aria-label="Chat with us — plan my automation" className="fixed bottom-[84px] right-4 z-40 flex min-h-[52px] cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-clay px-5 text-[15px] font-bold text-white shadow-[0_6px_24px_rgba(0,0,0,0.35)] md:bottom-6">
          <span aria-hidden className="text-[18px]">💬</span><span className="sm:hidden">Chat with us</span><span className="hidden sm:inline">Chat with us — get a price</span>
        </button>
      )}
      {open && (
        <div ref={panel} tabIndex={-1} role="dialog" aria-modal="false" aria-label="Automation assistant" data-testid="assistant-panel" className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-y-auto rounded-t-2xl border border-line bg-white p-4 shadow-2xl md:inset-x-auto md:bottom-6 md:right-6 md:w-[400px] md:rounded-2xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div><b className="text-[16px]">Automation assistant</b><div className="text-[12px] text-muted">Tell us what you need · see options with prices · a person reads every brief</div></div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="h-9 w-9 cursor-pointer rounded-full border-0 bg-paper text-xl">×</button>
          </div>
          {body}
        </div>
      )}
    </>
  );
}
