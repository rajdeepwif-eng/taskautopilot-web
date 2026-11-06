"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRIEFS, Brief, NOW, ROUTES, matchBriefs } from "@/data/briefs";
import { byId } from "@/lib/catalogue";
import { BOOKING_URL, FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { APP_GROUPS, INDUSTRY_APPS } from "@/lib/apps";
import { sendLead } from "@/lib/attribution";

const POPULAR = ["reviews", "missed-calls", "invoice-chase", "lead-reply", "quote-chase", "social"];
const STARTERS = ["admin", "invoice-chase", "missed-calls", "reviews", "lead-reply", "quote-build"];
const WHEN = ["As soon as possible", "Within 1–3 months", "Just exploring"];
const VOLUMES = ["Under 10 a week", "10–50 a week", "50–200 a week", "Over 200 a week", "Not sure"];
const HIDE = /^\/(checkout|deal-review|apply|launch|ask)\//;
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
  const panel = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => matchBriefs(said), [said]);
  useEffect(() => { if (open && !inline) panel.current?.focus(); }, [open, inline, step]);
  useEffect(() => { if (!open || inline) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, inline]);
  useEffect(() => {
    const on = () => { setTalk(true); setOpen(true); };
    window.addEventListener("ta:talk", on);
    return () => window.removeEventListener("ta:talk", on);
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
  const reset = () => { setTalk(false); setTimes(""); setPhone(""); setStep(0); setSaid(""); setPick(null); setNow(""); setTools(""); setVolume(""); setRoute(""); setAnswers({}); setWhen(""); setApprover(""); setUnsure(false); setSent(false); setErr(""); };
  const choose = (b: Brief | null) => { setPick(b); setStep(2); };
  const demo = pick ? `/p/${pick.products[0]}/` : "/demos/";
  const send = () => {
    if (!c.name.trim()) return setErr("Add your name.");
    if (!/.+@.+\..+/.test(c.email)) return setErr("Add an email we can reply to.");
    const brief = pick ? { id: pick.id, outcome: pick.outcome, trigger: pick.trigger, inputs: pick.inputs, from: pick.from, steps: pick.steps, toConfirm: pick.ask, native: pick.native || "", products: pick.products, kit: pick.kit || null } : { id: "custom", outcome: said, toConfirm: ["What should happen, for whom, and when?", "Where does the information live today?", "Who approves it?"] };
    void sendLead("automation-brief", { said, ...c, now, tools, volume, route, when, approver, answers, page: path, brief });
    setSent(true); setErr("");
  };

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
      {!sent && step > 0 && <ol aria-label="Progress" className="m-0 flex list-none gap-1 p-0">{steps.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-clay" : "bg-line"}`}><span className="sr-only">{s}</span></li>)}</ol>}
      {sent ? (
        <div className="flex flex-col gap-2" data-testid="assistant-done">
          <b className="text-[17px]">{FORMS_LIVE ? (talk ? "Got it — we'll be in touch to book your call." : "Got it — your brief is with us.") : "Thanks — almost there."}</b>
          <p className="m-0 text-[14px] text-ink-2">{FORMS_LIVE ? talk ? "Within 1 working day you'll get times to pick from. Nothing to prepare — just tell us how you do it today." : "A person reads every brief. Within 1 working day you'll get how it would work for you, a short demo and a fixed price — or how to switch it on yourself if your software already does it." : FORM_NOT_SENT}</p>
          <Link href={demo} className="btn btn-primary self-start" onClick={() => !inline && setOpen(false)}>See it working →</Link>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={reset}>Start another</button>
        </div>
      ) : talk ? talkView : step === 0 ? (
        <>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold" htmlFor="as-said">What result do you want?
            <span className="text-[12.5px] font-normal text-muted">Describe the outcome, not the tech — e.g. “every customer gets asked for a Google review after the job”.</span>
          </label>
          <textarea id="as-said" rows={3} value={said} onChange={(e) => setSaid(e.target.value)} data-testid="assistant-input" />
          {worried && reassure}
          {mentioned.length > 0 && <div className="text-[13px] text-ok" data-testid="assistant-mentioned">✓ We work with {mentioned.join(", ")} — we build around it, not instead of it.</div>}
          <div className="flex flex-wrap gap-1.5">{POPULAR.map((id) => { const b = BRIEFS.find((x) => x.id === id)!; return <button key={id} type="button" className={chip} onClick={() => { setSaid(b.outcome); choose(b); }}>{b.outcome.split(/[,—]/)[0]}</button>; })}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!said.trim()} onClick={() => setStep(1)} data-testid="assistant-next">Show me how</button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => { setUnsure(true); setStep(1); }}>Not sure what to automate? Show me where owners usually start</button>
        </>
      ) : step === 1 ? (
        <>
          <b className="text-[15px]">{unsure ? "Most owners start with one of these:" : matches.length ? "Closest jobs we build — pick one, or describe yours:" : "Nothing close in our list yet — that’s fine. Pick a starting point or send your words:"}</b>
          {(unsure || !matches.length ? STARTERS.map((id) => BRIEFS.find((x) => x.id === id)!) : matches).map((b) => (
            <button key={b.id} type="button" className={opt(false)} onClick={() => choose(b)} data-testid="assistant-match">
              <b>{b.outcome}</b><span className="text-[12.5px] text-ink-2">Starts when: {b.trigger.toLowerCase()}</span>
            </button>
          ))}
          <button type="button" className={opt(false)} onClick={() => choose(null)}><b>None of these — send my words as they are</b><span className="text-[12.5px] text-ink-2">We’ll reply with how the input and processing would work for your exact case.</span></button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(0)}>← Change what I want</button>
        </>
      ) : step === 2 ? (
        <>
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
          <b className="text-[14px]">When do you need it?</b>
          <div className="flex flex-wrap gap-1.5">{WHEN.map((v) => <button key={v} type="button" aria-pressed={when === v} className={`${chip} ${when === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setWhen(v)}>{v}</button>)}</div>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Who would sign off the test run? <span className="text-[12.5px] font-normal text-muted">Optional — name or role</span>
            <input type="text" value={approver} onChange={(e) => setApprover(e.target.value)} className="font-normal" />
          </label>
          <button type="button" className="btn btn-primary self-start" onClick={() => setStep(4)}>Next</button>
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
      {!sent && !talk && step > 1 && <button type="button" className="self-start border-0 bg-transparent p-0 text-[12.5px] text-muted underline" onClick={() => setStep(step - 1)}>← Back</button>}
      {!sent && !talk && <button type="button" className="self-start rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold" onClick={() => setTalk(true)} data-testid="assistant-talk">☎ Rather talk it through? Book a free call</button>}
    </div>
  );

  if (inline) return <div className="card p-5">{body}</div>;
  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} data-testid="assistant-open" className="fixed bottom-[84px] right-4 z-40 flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border-0 bg-ink px-4 text-[14px] font-semibold text-white shadow-lg md:bottom-6">
          <span aria-hidden>✦</span><span className="hidden sm:inline"> Plan my automation</span><span className="sr-only sm:hidden">Plan my automation</span>
        </button>
      )}
      {open && (
        <div ref={panel} tabIndex={-1} role="dialog" aria-modal="false" aria-label="Automation assistant" data-testid="assistant-panel" className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-y-auto rounded-t-2xl border border-line bg-white p-4 shadow-2xl md:inset-x-auto md:bottom-6 md:right-6 md:w-[400px] md:rounded-2xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div><b className="text-[16px]">Automation assistant</b><div className="text-[12px] text-muted">Quick brief · matched to the jobs we build · a person reads every one</div></div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="h-9 w-9 cursor-pointer rounded-full border-0 bg-paper text-xl">×</button>
          </div>
          {body}
        </div>
      )}
    </>
  );
}
