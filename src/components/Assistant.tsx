"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRIEFS, Brief, NOW, ROUTES, matchBriefs } from "@/data/briefs";
import { byId } from "@/lib/catalogue";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

const POPULAR = ["reviews", "missed-calls", "invoice-chase", "lead-reply", "quote-chase", "social"];
const VOLUMES = ["Under 10 a week", "10–50 a week", "50–200 a week", "Over 200 a week", "Not sure"];
const HIDE = /^\/(checkout|deal-review|apply|launch|ask)\//;

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
  const [c, setC] = useState({ name: "", email: "", company: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => matchBriefs(said), [said]);
  useEffect(() => { if (open && !inline) panel.current?.focus(); }, [open, inline, step]);
  useEffect(() => { if (!open || inline) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, inline]);
  if (!inline && HIDE.test(path)) return null;

  const reset = () => { setStep(0); setSaid(""); setPick(null); setNow(""); setTools(""); setVolume(""); setRoute(""); setSent(false); setErr(""); };
  const choose = (b: Brief | null) => { setPick(b); setStep(2); };
  const demo = pick ? `/p/${pick.products[0]}/` : "/demos/";
  const send = () => {
    if (!c.name.trim()) return setErr("Add your name.");
    if (!/.+@.+\..+/.test(c.email)) return setErr("Add an email we can reply to.");
    const brief = pick ? { id: pick.id, outcome: pick.outcome, trigger: pick.trigger, inputs: pick.inputs, from: pick.from, steps: pick.steps, toConfirm: pick.ask, native: pick.native || "", products: pick.products, kit: pick.kit || null } : { id: "custom", outcome: said, toConfirm: ["What should happen, for whom, and when?", "Where does the information live today?", "Who approves it?"] };
    void sendLead("automation-brief", { said, ...c, now, tools, volume, route, page: path, brief });
    setSent(true); setErr("");
  };

  const chip = "min-h-[40px] cursor-pointer rounded-full border border-line bg-white px-3 text-left text-[13.5px] hover:border-ink";
  const opt = (on: boolean) => `flex min-h-[48px] w-full cursor-pointer flex-col items-start rounded-lg px-3 py-2 text-left text-[14px] ${on ? "border-2 border-clay bg-clay-soft" : "border border-line bg-white"}`;
  const steps = ["Result", "How", "Today", "Tools", "Route", "Send"];

  const body = (
    <div className="flex flex-col gap-3" data-testid="assistant-body">
      {!sent && step > 0 && <ol aria-label="Progress" className="m-0 flex list-none gap-1 p-0">{steps.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-clay" : "bg-line"}`}><span className="sr-only">{s}</span></li>)}</ol>}
      {sent ? (
        <div className="flex flex-col gap-2" data-testid="assistant-done">
          <b className="text-[17px]">{FORMS_LIVE ? "Got it — your brief is with us." : "Thanks — almost there."}</b>
          <p className="m-0 text-[14px] text-ink-2">{FORMS_LIVE ? "A person reads every brief. Within 1 working day you'll get how it would work for you, a short demo and a fixed price — or how to switch it on yourself if your software already does it." : FORM_NOT_SENT}</p>
          <Link href={demo} className="btn btn-primary self-start" onClick={() => !inline && setOpen(false)}>See it working →</Link>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={reset}>Start another</button>
        </div>
      ) : step === 0 ? (
        <>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold" htmlFor="as-said">What result do you want?
            <span className="text-[12.5px] font-normal text-muted">Describe the outcome, not the tech — e.g. “every customer gets asked for a Google review after the job”.</span>
          </label>
          <textarea id="as-said" rows={3} value={said} onChange={(e) => setSaid(e.target.value)} data-testid="assistant-input" />
          <div className="flex flex-wrap gap-1.5">{POPULAR.map((id) => { const b = BRIEFS.find((x) => x.id === id)!; return <button key={id} type="button" className={chip} onClick={() => { setSaid(b.outcome); choose(b); }}>{b.outcome.split(/[,—]/)[0]}</button>; })}</div>
          <button type="button" className="btn btn-primary self-start" disabled={!said.trim()} onClick={() => setStep(1)} data-testid="assistant-next">Show me how</button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => { setSaid("Not sure yet — show me ideas"); choose(null); }}>Not sure — just tell us your goal and we’ll suggest the options</button>
        </>
      ) : step === 1 ? (
        <>
          <b className="text-[15px]">{matches.length ? "Here’s how we’d do it — pick the closest:" : "We’ll work this one out with you."}</b>
          {matches.map((b) => (
            <button key={b.id} type="button" className={opt(false)} onClick={() => choose(b)} data-testid="assistant-match">
              <b>{b.outcome}</b><span className="text-[12.5px] text-ink-2">Starts when: {b.trigger.toLowerCase()}</span>
            </button>
          ))}
          <button type="button" className={opt(false)} onClick={() => choose(null)}><b>None of these — send my words as they are</b><span className="text-[12.5px] text-ink-2">We’ll come back with the input and processing for your exact case.</span></button>
          <button type="button" className="self-start border-0 bg-transparent p-0 text-[13px] text-clay underline" onClick={() => setStep(0)}>← Change what I want</button>
        </>
      ) : step === 2 ? (
        <>
          {pick ? (
            <div className="flex flex-col gap-2 rounded-lg bg-paper p-3 text-[13.5px]" data-testid="assistant-how">
              <b className="text-[15px]">{pick.outcome}</b>
              <div><b>Starts when:</b> {pick.trigger}</div>
              <div><b>We’ll need:</b> {pick.inputs.join(" · ")}</div>
              <div className="text-ink-2">Usually from: {pick.from}</div>
              <ol className="m-0 flex list-decimal flex-col gap-0.5 pl-5">{pick.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              {pick.native && <div className="rounded bg-white px-2 py-1 text-[12.5px]"><b>Honest tip:</b> {pick.native}</div>}
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
          <b className="text-[14px]">Roughly how many a week?</b>
          <div className="flex flex-wrap gap-1.5">{VOLUMES.map((v) => <button key={v} type="button" aria-pressed={volume === v} className={`${chip} ${volume === v ? "!border-2 !border-clay bg-clay-soft" : ""}`} onClick={() => setVolume(v)}>{v}</button>)}</div>
          <button type="button" className="btn btn-primary self-start" onClick={() => setStep(4)}>Next</button>
        </>
      ) : step === 4 ? (
        <>
          <b className="text-[14px]">How would you like it?</b>
          <div role="radiogroup" aria-label="How you'd like it" className="flex flex-col gap-1.5">{ROUTES.filter((r) => r.id !== "diy" || !pick || pick.kit || pick.id === "learn").map((r) => <button key={r.id} type="button" role="radio" aria-checked={route === r.id} className={opt(route === r.id)} onClick={() => setRoute(r.id)}><b>{r.label}</b><span className="text-[12.5px] text-ink-2">{r.id === "diy" && pick?.kit ? `${byId(pick.kit).name} — ` : ""}{r.note}</span></button>)}</div>
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
      {!sent && step > 1 && <button type="button" className="self-start border-0 bg-transparent p-0 text-[12.5px] text-muted underline" onClick={() => setStep(step - 1)}>← Back</button>}
    </div>
  );

  if (inline) return <div className="card p-5">{body}</div>;
  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} data-testid="assistant-open" className="fixed bottom-[84px] right-4 z-40 flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border-0 bg-ink px-4 text-[14px] font-semibold text-white shadow-lg md:bottom-6">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#7FD1A8]" /> Automation assistant
        </button>
      )}
      {open && (
        <div ref={panel} tabIndex={-1} role="dialog" aria-modal="false" aria-label="Automation assistant" data-testid="assistant-panel" className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-y-auto rounded-t-2xl border border-line bg-white p-4 shadow-2xl md:inset-x-auto md:bottom-6 md:right-6 md:w-[400px] md:rounded-2xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div><b className="text-[16px]">Automation assistant</b><div className="text-[12px] text-muted">Tell us the result you want — a person checks every brief</div></div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="h-9 w-9 cursor-pointer rounded-full border-0 bg-paper text-xl">×</button>
          </div>
          {body}
        </div>
      )}
    </>
  );
}
