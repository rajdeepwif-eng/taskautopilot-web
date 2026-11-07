"use client";
import { useState } from "react";
import Link from "next/link";
import { sendLead } from "@/lib/attribution";

/**
 * Marketing consent: never pre-ticked (UK GDPR/PECR and CASL need a clear, separate opt-in).
 * Replies to the visitor's own enquiry don't need it; offers and newsletters do.
 */
export function ConsentBox({ checked, onChange, id = "consent" }: { checked: boolean; onChange: (v: boolean) => void; id?: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-[12.5px] leading-snug text-ink-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0" data-testid="consent" />
      <span>Also email me occasional automation ideas and offers. Unsubscribe any time. <Link href="/legal/privacy/">Privacy</Link></span>
    </label>
  );
}

const PREP = [
  { k: "business", q: "What does your business do, and how many people work in it?" },
  { k: "fix", q: "What's the one job you most want off your plate?" },
  { k: "today", q: "How is it done today — by hand, a VA, software, your website?" },
  { k: "tools", q: "Which apps hold the information? (e.g. Xero, Gmail, a spreadsheet)" },
  { k: "cost", q: "Roughly what does it cost you now — hours a week, or jobs lost?" },
  { k: "who", q: "Who else needs to agree before you go ahead?" },
  { k: "when", q: "When would you like it working?" },
];

/** Optional pre-call questionnaire: the more we know before the call, the more useful the call. */
export function PreCall({ email, name }: { email: string; name: string }) {
  const [f, setF] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  if (done) return <p className="m-0 rounded-lg bg-[#E9F5E9] px-3 py-2 text-[13.5px]" data-testid="precall-done">Thanks — that&apos;s on your file. Your call will start where you left off.</p>;
  return (
    <form className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3" data-testid="precall" onSubmit={(e) => { e.preventDefault(); void sendLead("pre-call", { name, email, ...f }); setDone(true); }}>
      <b className="text-[14.5px]">Help us prepare (2 minutes, optional)</b>
      <span className="text-[12.5px] text-muted">Answer what you can — we&apos;ll come to the call with a plan and a price, not questions.</span>
      {PREP.map((p) => (
        <label key={p.k} className="flex flex-col gap-1 text-[13px]">{p.q}
          <input type="text" value={f[p.k] ?? ""} onChange={(e) => setF({ ...f, [p.k]: e.target.value })} maxLength={300} />
        </label>
      ))}
      <button type="submit" className="btn btn-primary self-start !min-h-[38px] !text-[13.5px]" data-testid="precall-send">Save my answers</button>
    </form>
  );
}

/** Footer sign-up: one practical automation idea a month. The opt-in is the whole purpose, so the button is the consent. */
export function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  if (done) return <p className="m-0 text-[14px] text-paper" data-testid="subscribe-done">You&apos;re in — first idea arrives next month. Unsubscribe any time.</p>;
  return (
    <form className="flex flex-col gap-2" data-testid="subscribe" onSubmit={(e) => { e.preventDefault(); if (!/.+@.+\..+/.test(email)) return setErr("Enter a valid email."); void sendLead("subscribe", { email, marketingConsent: true, consentText: "One automation idea a month, plus occasional offers" }); setDone(true); }}>
      <b className="text-[15px] text-paper">One time-saving idea a month</b>
      <span className="text-[13px] text-[#B8C0CC]">A real automation, what it saves and what it costs. Plus occasional offers. Unsubscribe any time.</span>
      <div className="flex gap-2">
        <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="you@business.com" aria-label="Email address" className="min-w-0 flex-1" data-testid="subscribe-email" />
        <button type="submit" className="btn btn-primary !px-4">Sign me up</button>
      </div>
      {err && <span role="alert" className="text-[12.5px] text-[#FFB4A8]">{err}</span>}
    </form>
  );
}
