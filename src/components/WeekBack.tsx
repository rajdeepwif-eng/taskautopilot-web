"use client";
import { useState } from "react";
import { useCurrency } from "@/components/Currency";
import { openAssistant } from "@/components/FrontDoor";

/**
 * "Your week back" — two sliders, instant arithmetic, no promises.
 * The only outside figure is McKinsey's 60–70% "technically automatable" share of work time (2023);
 * we show half of the visitor's own hours as the illustration, which sits under that.
 */
export default function WeekBack() {
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(30);
  const cx = useCurrency();
  const yearHours = hours * 48; // 48 working weeks
  const backHours = Math.round(yearHours * 0.5);
  const backDays = Math.round(backHours / 8);
  const cost = backHours * rate;
  return (
    <section className="wrap pt-10" data-nocurrency data-testid="weekback">
      <div className="grid gap-5 rounded-2xl border border-line bg-white p-5 md:grid-cols-[3fr_2fr] md:items-center md:p-7">
        <div className="flex flex-col gap-4">
          <div>
            <div className="kicker">Try it — 10 seconds</div>
            <h2 className="font-display m-0 text-[clamp(24px,3.4vw,32px)] font-bold leading-tight">How much of your week is repeat admin?</h2>
          </div>
          <label className="flex flex-col gap-1 text-[14px] text-ink-2">
            <span>Hours a week your team spends on copying, chasing, re-typing and replying: <b className="text-ink">{hours} h</b></span>
            <input type="range" min={1} max={40} value={hours} onChange={(e) => setHours(Number(e.target.value))} aria-label="Hours a week on repeat admin" className="w-full accent-[#F08804]" />
          </label>
          <label className="flex flex-col gap-1 text-[14px] text-ink-2">
            <span>What an hour of that time costs you: <b className="text-ink">{cx.sym}{rate}</b></span>
            <input type="range" min={10} max={150} step={5} value={rate} onChange={(e) => setRate(Number(e.target.value))} aria-label="Cost per hour" className="w-full accent-[#F08804]" />
          </label>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-paper p-5">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-muted">If automation took half of it</div>
          <div className="font-display text-[44px] font-bold leading-none text-ink" data-testid="weekback-days">{backDays} days</div>
          <div className="text-[15px] text-ink-2">back every year — about <b className="text-ink">{cx.local(cost)}</b> of your time, from {yearHours.toLocaleString("en-GB")} hours of admin.</div>
          <button type="button" className="btn btn-primary self-start" onClick={() => openAssistant()}>Tell us what eats those hours →</button>
          <p className="m-0 text-[11.5px] leading-snug text-muted">Illustration from your own numbers, not a promise. McKinsey (2023) found 60–70% of employees&apos; time is spent on activities that are technically automatable; we show half.</p>
        </div>
      </div>
    </section>
  );
}
