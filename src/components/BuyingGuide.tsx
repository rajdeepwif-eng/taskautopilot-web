"use client";
import { useState } from "react";
import Link from "next/link";
import { Product, fmt } from "@/lib/catalogue";
import { NOW } from "@/data/briefs";
import { BUG_DAYS, CHANGE_BANDS, FREQS, FreqId, N8N_CHECKED, OVERHEAD_RUNS, TWEAK_DAYS, defaultRuns, flowFor, planFor, runsPerMonth, supportFrom, usageNote } from "@/lib/buying";

/**
 * The product page for a customer who knows nothing about automation. Research behind the
 * format: simple flowcharts are understood faster and more accurately than written steps
 * (Kammann, Human Factors 1975); formal notation such as BPMN gives non-experts no benefit
 * (Rodrigues et al., SBES 2015); words with a picture beat words alone (Mayer, multimedia
 * principle). So: one plain picture, one colour for where a person decides, a "what happens
 * if" list, and a plain box saying exactly what is and isn't included.
 */

const H = ({ children }: { children: React.ReactNode }) => <h3 className="m-0 mt-3 text-[18px] font-bold">{children}</h3>;

/** The whole automation in one line, readable in a few seconds. */
export function QuickRead({ p }: { p: Product }) {
  const f = flowFor(p);
  const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-ink px-4 py-3 text-[15px] leading-snug text-white" data-testid="quick-read">
      <span className="font-mono text-[11px] uppercase tracking-wide text-[#A9ADB4]">In short</span>
      <span><b>Starts:</b> {lc(f.start).replace(/\.$/, "")}</span><span aria-hidden className="text-amber">→</span>
      <span><b>it does the work</b>, <span className="text-amber">{f.live ? "a person takes over when needed" : f.approves ? "you approve anything unusual" : "you see every result"}</span></span><span aria-hidden className="text-amber">→</span>
      <span><b>Result:</b> {lc(f.result).replace(/\.$/, "")}</span>
    </div>
  );
}

/** "However you do it today, it starts from there." Same build, different starting point. */
export function StartFrom({ p }: { p: Product }) {
  const f = flowFor(p);
  const [now, setNow] = useState<string>("manual");
  const o = NOW.find((x) => x.id === now)!;
  return (
    <section className="flex flex-col gap-2 rounded-xl border-l-4 border-clay bg-white py-1 pl-4" data-testid="start-from">
      <h3 className="m-0 text-[18px] font-bold">This is an example — we build it around how you work</h3>
      <p className="m-0 text-[14.5px] text-ink-2">Doing it by hand, in software, or through your website? Pick yours:</p>
      <div role="radiogroup" aria-label="How you do it today" className="flex flex-wrap gap-1.5">
        {NOW.map((x) => <button key={x.id} type="button" role="radio" aria-checked={now === x.id} onClick={() => setNow(x.id)} className={`min-h-[40px] cursor-pointer rounded-full px-3 text-[13.5px] ${now === x.id ? "border-2 border-clay bg-clay-soft font-semibold" : "border border-line bg-white"}`}>{x.label}</button>)}
      </div>
      <p className="m-0 rounded-lg bg-clay-soft px-3 py-2 text-[14.5px]" data-testid="start-from-path">{o.path}{now === "software" && f.native ? <> <b>For this job:</b> {f.native}</> : null}{now === "software" ? <> Works with: {p.apps}.</> : null}{(now === "manual" || now === "none" || now === "outsourced") && f.needs?.length ? <> <b>For this job we start from:</b> {f.needs.join(", ").toLowerCase()} — a spreadsheet or email is fine.</> : null}{now === "website" ? <> <b>For this job:</b> it picks up from your site and passes the result on to your other apps.</> : null}</p>
      <button type="button" className="self-start border-0 bg-transparent p-0 text-[14px] font-semibold text-clay underline" onClick={() => window.dispatchEvent(new CustomEvent("ta:talk"))} data-testid="example-talk">Not sure it fits? Talk it through with us — free →</button>
    </section>
  );
}

/** Says plainly that the page is an example and everything bends to the customer. */
export function ExampleNote() {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border-l-4 border-clay bg-clay-soft px-4 py-3 text-[14.5px] leading-snug" data-testid="example-note">
      <b>This is an example — yours is built your way.</b>
      <span className="text-ink-2">It shows how this usually works. We change the steps, the rules and the apps to fit how you already work. Do it differently, or use other software? That's normal — tell us and we'll show you how it fits before you pay, free.</span>
      <button type="button" className="self-start border-0 bg-transparent p-0 text-[14px] font-semibold text-clay underline" onClick={() => window.dispatchEvent(new CustomEvent("ta:talk"))} data-testid="example-talk">Not sure it fits? Talk it through with us — free →</button>
    </div>
  );
}

export function FlowPicture({ p }: { p: Product }) {
  const f = flowFor(p);
  const boxes = [
    { k: "1 · It starts when", t: f.start, cls: "border-line bg-white" },
    { k: "2 · It does this for you", t: f.steps, cls: "border-line bg-white" },
    { k: "3 · You stay in charge", t: f.check, cls: "border-[#E8A33A] bg-[#FFF6E5]" },
    { k: "4 · What you get", t: f.result, cls: "border-[#2F6FB5] bg-[#EEF4FB]" },
  ];
  return (
    <figure className="m-0 flex flex-col gap-2" data-testid="flow-picture" aria-label="How this automation works, in four steps">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_1.3fr_auto_1fr_auto_1fr] md:items-stretch">
        {boxes.map((b, i) => (
          <div key={i} className="contents">
            <div className={`flex flex-col gap-1 rounded-lg border-2 p-3 text-[14px] leading-snug ${b.cls}`}>
              <b className="text-[12px] uppercase tracking-wide text-muted">{b.k}</b>
              {Array.isArray(b.t) ? <ol className="m-0 flex list-decimal flex-col gap-1 pl-4">{b.t.map((s, j) => <li key={j}>{s}</li>)}</ol> : <span>{b.t}</span>}
            </div>
            {i < boxes.length - 1 && <div aria-hidden className="self-center text-center text-xl text-muted"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></div>}
          </div>
        ))}
      </div>
      <figcaption className="text-[12px] text-muted">Amber is where a person decides. Blue is the result, in the apps you already use.</figcaption>
    </figure>
  );
}

function YouChoose({ p }: { p: Product }) {
  const f = flowFor(p);
  const decide = [...(f.decide?.length ? f.decide : ["What should happen, for whom, and when?", "Which apps hold the information today?", "Who approves or gets alerted?"]), "One site or several? (each site or account can have its own rules)"];
  return (
    <section className="flex flex-col gap-2" data-testid="you-choose">
      <H>Built your way — you choose at setup</H>
      <p className="m-0 text-[15px] text-ink-2">Every business does this a little differently. A 10-minute setup form fixes how yours works before we build:</p>
      <ul className="m-0 flex flex-col gap-1 pl-5 text-[15px]">{decide.map((q, i) => <li key={i}>{q}</li>)}</ul>
      {f.needs?.length ? <p className="m-0 text-[14px] text-ink-2"><b>What it reads:</b> {f.needs.join(" · ")}{f.from ? <> — usually from {f.from}.</> : null}</p> : null}
      {f.native && <p className="m-0 rounded-lg bg-paper px-3 py-2 text-[14px] text-ink-2"><b>Worth knowing:</b> {f.native}</p>}
    </section>
  );
}

function WhatIf({ p }: { p: Product }) {
  const f = flowFor(p);
  const rows = [
    f.live
      ? ["It isn't sure what to say", "It hands over to a person with the conversation so far. AI can still get things wrong, so it answers only from your information, and conversations are logged for you to review."]
      : ["It isn't sure what to do", "It asks a person, with the details in front of them, instead of guessing."],
    ["An app is down or a login expires", "It retries a few times, then alerts you. What it couldn't do is logged so it can be re-run once fixed. (If an app doesn't resend events, the daily check catches what was missed.)"],
    ["The same thing arrives twice", "Where an app can send the same item twice, the build checks for it, so it's handled once."],
    ["It stops running altogether", "A daily self-check alerts you — and us while you're on a support plan."],
    ["You want to try it safely first", "We test on sample data or drafts before go-live wherever your apps allow, and you approve the test run."],
    ["You stop support, or we close", "It keeps running in your own accounts — the workflows are yours. Your handover says how to pause, change or move it."],
  ];
  return (
    <section className="flex flex-col gap-2" data-testid="what-if">
      <H>What happens if…</H>
      <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-2 text-[15px] sm:grid-cols-[minmax(0,14rem)_1fr]">
        {rows.map(([q, a]) => (<div key={q} className="contents"><dt className="font-semibold">{q}</dt><dd className="m-0 text-ink-2">{a}</dd></div>))}
      </dl>
    </section>
  );
}

function WhatYouBuy({ p }: { p: Product }) {
  const sup = supportFrom(p);
  const cols: [string, string[]][] = p.monthly ? [
    ["Included", [
      "Set up in your own accounts, to the choices on your setup form",
      "Monitoring, fixes and small changes for as long as you subscribe",
      "A monthly check-in on what it did and what to improve",
      "If you cancel after the minimum, the workflows stay in your accounts and are yours",
    ]],
    ["Not included", [
      "Running costs — paid by you directly, at cost (see runs below)",
      "New apps, workflows or a different way of working — quoted first",
    ]],
    ["You'll need", [
      `The apps it works with: ${p.apps}`,
      "Admin access to connect each one — you connect them; we never ask for passwords",
      "6-month minimum, then month to month",
    ]],
  ] : [
    ["Included", [
      "Built in your own accounts, to the choices on your setup form",
      "A test run you approve before go-live — or a full refund of the build fee",
      "Written handover: what it does, where it runs, how to pause it",
      "Your data stays in your own accounts; we connect with access you can switch off any time",
      `${TWEAK_DAYS} days of free small changes after go-live`,
      `${BUG_DAYS} days of free fixes if anything we built breaks`,
    ]],
    ["Not included", [
      "Running costs — paid by you directly, at cost (see runs below)",
      "Extra apps or steps — apps not listed are checked free before you pay, and quoted if they add work",
      `Changes after ${TWEAK_DAYS} days — fixed prices from ${fmt(CHANGE_BANDS[0].price)}`,
      `Fixes after ${BUG_DAYS} days, unless you're on a support plan${sup ? ` (from ${sup})` : ""}`,
    ]],
    ["You'll need", [
      `The apps it works with: ${p.apps}`,
      "Admin access to connect each one — you connect them; we never ask for passwords",
      "About an hour of your time: the setup form and approving the test run",
    ]],
  ];
  return (
    <section className="flex flex-col gap-2" data-testid="what-you-buy">
      <H>What you're buying</H>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {cols.map(([h, items]) => (
          <div key={h} className="rounded-lg border border-line p-3">
            <b className={h === "Included" ? "text-ok" : h === "Not included" ? "text-[#B12704]" : ""}>{h === "Included" ? "✓ " : h === "Not included" ? "✗ " : ""}{h}</b>
            <ul className="m-0 mt-1 flex flex-col gap-1 pl-4 text-[14px] leading-snug">{items.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Runs({ p }: { p: Product }) {
  const d = defaultRuns(p);
  const [freq, setFreq] = useState<FreqId>(d.freq);
  const [events, setEvents] = useState(d.events || 200);
  const taps = flowFor(p).approves && freq === "event" ? Math.round(events * 0.2) : 0;
  const runs = runsPerMonth(freq, events) + taps;
  const plan = planFor(runs);
  const f = FREQS.find((x) => x.id === freq)!;
  return (
    <section id="runs" className="flex scroll-mt-4 flex-col gap-2" data-testid="runs">
      <H>Runs and running costs</H>
      <p className="m-0 text-[15px] text-ink-2">A <b>run</b> is one time the automation does its job — one payment checked, one reminder sent — however many steps it takes. Runs are what the automation platform (n8n) charges for, so how often it checks matters more than how clever it is.</p>
      <div className="flex flex-col gap-3 rounded-xl bg-paper p-4">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm">How quickly should it react?
            <select value={freq} onChange={(e) => setFreq(e.target.value as FreqId)} data-testid="runs-freq">
              {FREQS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
          </label>
          {freq === "event" && (
            <label className="flex flex-[1_1_160px] flex-col gap-1.5 text-sm">How many times a month does it happen?
              <input type="number" min={0} value={events} onChange={(e) => setEvents(Number(e.target.value))} data-testid="runs-events" />
            </label>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-[1_1_140px]"><div className="text-[13px] text-muted">Runs a month</div><div className="font-display text-[26px] font-bold" data-testid="runs-total">{runs.toLocaleString("en-US")}</div></div>
          <div className="flex-[1_1_200px]"><div className="text-[13px] text-muted">Platform plan that fits</div><div className={`font-display text-[20px] font-bold ${plan.fits ? "" : "text-[#B12704]"}`} data-testid="runs-plan">{plan.name}</div><div className="text-[13px]">{plan.cost}</div></div>
        </div>
        {usageNote(p) && <div className="rounded-lg bg-white px-3 py-2 text-[13px] leading-normal" data-testid="usage-note"><b>Other running costs:</b> {usageNote(p)}</div>}
        <div className="text-[13px] leading-normal text-ink-2">{f.note}. Includes about {OVERHEAD_RUNS} runs a month for its daily self-check and watchdog. {taps ? `Includes about ${taps} approval taps (one in five needing you) — each tap is a run. ` : "Each approval tap is one more run. "}Steps it hands to a sub-workflow don't count extra.</div>
      </div>
      <ul className="m-0 flex flex-col gap-1 pl-5 text-[14px] text-ink-2">
        <li><b>You pay running costs directly, at cost</b> — no markup. The n8n account is in your name, so you can see every run. Texts, call minutes and AI use, where a build uses them, are billed the same way.</li>
        <li><b>We size it before you buy</b> and use instant triggers wherever your apps allow, so you don't pay for empty checks.</li>
        <li><b>No surprise platform bills:</b> your n8n plan is a fixed monthly price, and n8n lists overage as capped on Starter and Pro. We set up a usage alert where your plan allows it. Usage costs like AI, texts or calls vary — we estimate them before you buy.</li>
      </ul>
      <p className="m-0 text-[12px] text-muted">Plan sizes and prices: {N8N_CHECKED}. Prices are set by n8n and can change; we confirm yours at setup.</p>
    </section>
  );
}

function AfterGoLive({ p }: { p: Product }) {
  const sup = supportFrom(p);
  const steps = [
    ["Day 0", "Go-live", "You approved the test run. It's live, with your handover."],
    [`Days 1–${TWEAK_DAYS}`, "Settle in", "Use it for real. Small changes are free — tell us within 14 days."],
    [`Days 1–${BUG_DAYS}`, "Free fixes", "If anything we built doesn't do what your setup form says, we fix it free."],
    [`After day ${BUG_DAYS}`, "Your choice", sup ? `Keep fixes and monitoring with a support plan from ${sup}, or pay per change.` : "Pay per change, or ask about a support plan."],
  ];
  return (
    <section className="flex flex-col gap-2" data-testid="after-go-live">
      <H>After go-live: changes and fixes</H>
      <ol className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-4">
        {steps.map(([when, t, d]) => (
          <li key={when} className="rounded-lg border border-line p-3 text-[14px] leading-snug"><div className="font-mono text-[12px] text-muted">{when}</div><b>{t}</b><div className="text-ink-2">{d}</div></li>
        ))}
      </ol>
      <table className="w-full border-collapse text-[14px]" data-testid="change-bands">
        <thead><tr className="text-left text-muted"><th className="border-b border-line py-1 pr-3 font-normal">After {TWEAK_DAYS} days</th><th className="border-b border-line py-1 pr-3 font-normal">What it covers</th><th className="border-b border-line py-1 font-normal">Price</th></tr></thead>
        <tbody>{CHANGE_BANDS.map((b) => (<tr key={b.id}><td className="border-b border-line py-1.5 pr-3 font-semibold">{b.name}</td><td className="border-b border-line py-1.5 pr-3 text-ink-2">{b.what}</td><td className="whitespace-nowrap border-b border-line py-1.5">{b.price ? fmt(b.price) : "Quoted"}</td></tr>))}</tbody>
      </table>
      <p className="m-0 text-[13px] text-ink-2"><b>A fix</b> is when it doesn't do what your setup form says. <b>A change</b> is when you'd like it to do something different — a new app, step or way of working is a change even in the first {TWEAK_DAYS} days. Every price is agreed before we start. Support plans include one small change a month. <Link href="/legal/terms/">Terms</Link></p>
    </section>
  );
}

/** "What you'll see": a mock-up of the result, for products where a picture of the screen helps. Example data only. */
function Preview({ p }: { p: Product }) {
  if (p.id !== 146) return null;
  const rows = [["1", "6 Nov", "245.00", "Customer A", "sent ✓"], ["2", "5 Nov", "198.00", "Customer B", "sent ✓"], ["3", "4 Nov", "412.50", "Customer C", "needs you (1)"], ["4", "3 Nov", "96.00", "Customer D", "needs you (2)"]];
  const cases = [
    ["Paid the price on your list", "Invoiced, recorded as paid and emailed — automatically", "Nobody"],
    ["Paid a different amount (discount, phone price)", "Draft invoice waits as a message with Approve / Edit / Not this", "You (or your stand-in after a set time)"],
    ["Payment with no reference", "Asks which booking it's for, with a pick-list of that customer's open bookings", "Anyone on the team"],
    ["Paid twice, refund or chargeback", "Flagged only — money-back cases stay manual", "You"],
    ["Old payments with no invoice", "Listed on day one for you to approve, never invoiced on its own", "You"],
  ];
  return (
    <section className="flex flex-col gap-2" data-testid="preview">
      <H>What you'll see each morning</H>
      <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3 text-[13px]">
        <b>Invoices · 09:20 · 2 sent automatically · 2 need you</b>
        <table className="w-full border-collapse font-mono text-[12px]"><tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className="border-b border-line py-1 pr-2">{c}</td>)}</tr>)}</tbody></table>
        <div className="rounded-lg border-l-4 border-[#E8A33A] bg-[#FFF6E5] p-2"><b>Needs you · price is different from your price list</b><div>Customer C · paid $412.50 on 4 Nov · price list says $390.00 · invoice will be dated 4 Nov</div><div className="mt-1 flex flex-wrap gap-2"><span className="rounded border border-ok px-2 py-0.5 text-ok">Approve and send</span><span className="rounded border border-line px-2 py-0.5">Edit amounts</span><span className="rounded border border-line px-2 py-0.5">Not this</span></div></div>
        <div className="rounded-lg border-l-4 border-[#2F6FB5] bg-[#EEF4FB] p-2"><b>Needs you · which booking is this payment for?</b><div>$96.00 from Customer D · no reference · pick from their open bookings ▾</div></div>
        <div className="rounded-lg bg-[#E9F5E9] p-2">After your tap: <b>approved · invoice sent · $412.50 · dated 4 Nov</b> — the message shrinks to one line.</div>
      </div>
      <p className="m-0 text-[12px] text-muted">Example layout with made-up customers and numbers. Shown in Slack; Teams or email on request.</p>
      <table className="w-full border-collapse text-[14px]" data-testid="preview-cases">
        <thead><tr className="text-left text-muted"><th className="border-b border-line py-1 pr-3 font-normal">When the payment is…</th><th className="border-b border-line py-1 pr-3 font-normal">What it does</th><th className="border-b border-line py-1 font-normal">Who decides</th></tr></thead>
        <tbody>{cases.map((c) => <tr key={c[0]}>{c.map((x, i) => <td key={i} className={`border-b border-line py-1.5 pr-3 ${i === 0 ? "font-semibold" : "text-ink-2"}`}>{x}</td>)}</tr>)}</tbody>
      </table>
    </section>
  );
}

/** What a DIY kit buyer gets and takes on. */
export function KitGuide({ p }: { p: Product }) {
  const cols: [string, string[]][] = [
    ["Included", ["The ready-made workflow file", "A step-by-step written guide and setup checklist", "30 days of email help", "Upgrade to done-for-you within 30 days and the kit price is credited"]],
    ["Not included", ["Setting it up — you import it and connect your own apps", "Running costs — your own n8n plan (from about €20/mo, roughly $22) and any texts or AI use", "Changes to fit a different way of working — that's what done-for-you is for"]],
    ["You'll need", [`The apps it works with: ${p.apps}`, "An n8n account", "A couple of hours, and comfort following a written guide"]],
  ];
  return (
    <section className="flex flex-col gap-2" data-testid="kit-guide">
      <H>What you get in this kit</H>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">{cols.map(([h, items]) => (
        <div key={h} className="rounded-lg border border-line p-3"><b>{h}</b><ul className="m-0 mt-1 flex flex-col gap-1 pl-4 text-[14px] leading-snug">{items.map((t) => <li key={t}>{t}</li>)}</ul></div>
      ))}</div>
      <p className="m-0 text-[13px] text-ink-2">This kit is the standard version. Need it to work your way, or with other software? Done-for-you builds are tailored to you. Refund: within 14 days if you haven't downloaded it.</p>
    </section>
  );
}

/** Full guide for a done-for-you build. */
export function BuyingGuide({ p }: { p: Product }) {
  return (
    <div className="flex flex-col gap-4" data-testid="buying-guide">
      <Preview p={p} />
      <YouChoose p={p} />
      <WhatIf p={p} />
      <WhatYouBuy p={p} />
      <details id="costs" className="group scroll-mt-4 rounded-xl border border-line p-3" data-testid="costs-details">
        <summary className="cursor-pointer list-none text-[16px] font-bold"><span className="text-clay group-open:hidden">▸ </span><span className="hidden text-clay group-open:inline">▾ </span>Running costs, changes and fixes <span className="block text-[14px] font-normal text-ink-2">Most builds run on n8n Starter: about €20/mo (roughly $22), paid by you to n8n.{p.monthly ? "" : ` Small changes free for ${TWEAK_DAYS} days, fixes free for ${BUG_DAYS} days.`} Tap for the calculator and prices.</span></summary>
        <div className="mt-2 flex flex-col gap-4">
          <Runs p={p} />
          {p.monthly ? null : <AfterGoLive p={p} />}
        </div>
      </details>
    </div>
  );
}
