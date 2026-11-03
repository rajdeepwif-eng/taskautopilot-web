"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { text: "How many hours a week does your team spend retyping, chasing or matching?", opts: [["Under 5", 5], ["5–15", 15], ["15–40", 30], ["Over 40", 40]] },
  { text: "How fast does a new enquiry get a reply?", opts: [["Under 5 minutes", 0], ["Within the hour", 10], ["Same day", 20], ["Next day or later", 30]] },
  { text: "Which tools hold your work today?", opts: [["Spreadsheets and email", 30], ["A CRM, little else", 20], ["Several apps, not connected", 25], ["Connected, but breaking", 15]] },
] as const;

export default function Assessment() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const step = answers.length;
  const score = Math.min(100, answers.reduce((a, b) => a + b, 0));
  const slowReplies = (answers[1] ?? 0) >= 20;
  const rec = slowReplies ? { name: "Instant lead reply & booking", price: "$[2,500]", id: 10 } : { name: "Supplier invoice reader + bank reconciliation", price: "$[4,950]", id: 21 };
  const verdict =
    score >= 70
      ? "High: most of your admin can run itself. Start with the fastest payback."
      : score >= 40
        ? "Medium: two or three automations would free a day a week."
        : "Low: you are already lean. One targeted automation plus monitoring is enough.";

  return (
    <div className="flex flex-wrap gap-10 rounded-[18px] border-2 border-ink bg-white p-9">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
        <div className="kicker !text-clay">Free workflow assessment</div>
        <h2 className="font-display m-0 text-4xl font-bold leading-tight">How much of your week could run itself?</h2>
        <p className="m-0 text-[17px] text-ink-2">Three questions. Your score, yearly cost and the first automation we&apos;d build — on screen, no email needed.</p>
        <div className="mt-2 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded ${i <= step ? "bg-clay" : "bg-line"}`} />
          ))}
        </div>
      </div>
      <div className="min-w-0 flex-[1_1_460px]">
        {step < 3 && (
          <div className="flex flex-col gap-3.5">
            <div className="text-sm text-muted">Question {step + 1} of 3</div>
            <div className="font-display text-2xl font-bold">{QUESTIONS[step].text}</div>
            {QUESTIONS[step].opts.map(([label, v]) => (
              <button key={label} type="button" onClick={() => setAnswers([...answers, v])} className="min-h-[48px] cursor-pointer rounded-[10px] border border-[#C9C5B9] bg-paper px-4 py-4 text-left text-base text-ink">
                {label}
              </button>
            ))}
          </div>
        )}
        {step === 3 && !done && (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-baseline gap-3">
              <div className="font-display text-6xl font-bold text-clay">{score}</div>
              <div className="text-ink-2">/ 100 automation score</div>
            </div>
            <div className="text-[17px]">{verdict}</div>
            <div className="rounded-xl bg-ink p-4 text-paper">
              <div className="text-sm text-[#A9ADB4]">Manual time a year at $35/hour (an estimate — we refine it with you)</div>
              <div className="font-display text-4xl font-bold text-amber">${Math.round((answers[0] ?? 0) * 35 * 52).toLocaleString("en-US")}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-clay p-4">
              <div>
                <div className="text-[13px] text-muted">We&apos;d start with</div>
                <div className="font-display text-[22px] font-bold">{rec.name} — {rec.price}</div>
              </div>
              <Link href={`/checkout?plan=${rec.id}`} className="btn btn-primary">Buy this now →</Link>
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Not ready? Email me the plan instead
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(false); }} placeholder="you@company.com" />
            </label>
            {error && <div className="text-sm text-[#B42318]">Please add a valid work email.</div>}
            <button type="button" className="btn btn-dark border-0" onClick={() => (/.+@.+\..+/.test(email) ? setDone(true) : setError(true))}>Send my plan</button>
            <button type="button" className="min-h-[44px] cursor-pointer border-0 bg-transparent text-sm text-muted underline" onClick={() => setAnswers([])}>Start again</button>
          </div>
        )}
        {done && (
          <div className="flex flex-col gap-3.5">
            <div className="font-display text-[28px] font-bold">Your plan is on its way to {email}.</div>
            <Link href="/library" className="btn btn-dark">Browse the automation library</Link>
          </div>
        )}
      </div>
    </div>
  );
}
