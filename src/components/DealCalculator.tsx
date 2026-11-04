"use client";

import { useState } from "react";
import Link from "next/link";
import { EQUITY, PLAN_TERMS, RESULTS, planFor, resultsFor, stakeFor } from "@/lib/deals";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function Num({ label, value, onChange, prefix = "$", step = 100 }: { label: string; value: number; onChange: (n: number) => void; prefix?: string; step?: number }) {
  return (
    <label className="flex flex-col gap-1 text-[13px] text-ink-2">
      {label}
      <span className="flex items-center gap-1 rounded-lg border border-line bg-white px-2.5">
        {prefix && <span className="text-muted">{prefix}</span>}
        <input type="number" min={0} step={step} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="w-full min-w-0 !border-0 !bg-transparent !px-0 !py-2 text-[15px] !shadow-none" />
      </span>
    </label>
  );
}

/** Compare the ways to pay on one price. Indicative only. */
export default function DealCalculator({ start = 1800 }: { start?: number }) {
  const [tab, setTab] = useState<"monthly" | "results" | "equity">("monthly");
  const [price, setPrice] = useState(start);
  const [months, setMonths] = useState(12);
  const [gain, setGain] = useState(1500);
  const [build, setBuild] = useState(15000);
  const [value, setValue] = useState(300000);
  const plan = planFor(price, months);
  const res = resultsFor(price, gain);
  const stake = stakeFor(build, value);

  return (
    <div className="card flex flex-col gap-4 p-5" data-testid="deal-calc">
      <div className="flex flex-wrap gap-2" role="tablist">
        {([["monthly", "Pay monthly"], ["results", "Pay from results"], ["equity", "Automation for equity"]] as const).map(([k, n]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[44px] cursor-pointer rounded-full border px-4 text-sm ${tab === k ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>{n}</button>
        ))}
      </div>

      {tab === "monthly" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Num label="Build price" value={price} onChange={setPrice} />
            <div className="flex flex-wrap gap-2">{PLAN_TERMS.map((t) => (
              <button key={t.months} type="button" aria-pressed={months === t.months} onClick={() => setMonths(t.months)} className={`min-h-[44px] cursor-pointer rounded-lg border px-3 text-sm ${months === t.months ? "border-2 border-[#007185] bg-[#EDFDFF]" : "border-line bg-white"}`}>{t.months} months</button>
            ))}</div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-ink p-4 text-paper" aria-live="polite">
            <div className="text-[13px] text-[#A9ADB4]">Deposit today</div><div className="text-2xl font-bold" data-testid="plan-deposit">{money(plan.deposit)}</div>
            <div className="text-[13px] text-[#A9ADB4]">Then {plan.months} monthly payments of</div><div className="text-3xl font-bold text-amber" data-testid="plan-monthly">{money(plan.monthly)}</div>
            <div className="text-[13px] text-[#A9ADB4]">Total {money(plan.total)} vs {money(price)} paid up front</div>
          </div>
        </div>
      )}

      {tab === "results" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Num label="List price of the build" value={price} onChange={setPrice} />
            <Num label="Measured gain a month (e.g. late invoices recovered, extra jobs booked)" value={gain} onChange={setGain} />
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-ink p-4 text-paper" aria-live="polite">
            <div className="text-[13px] text-[#A9ADB4]">Setup fee</div><div className="text-2xl font-bold" data-testid="res-setup">{money(res.setup)}</div>
            <div className="text-[13px] text-[#A9ADB4]">Then {Math.round(RESULTS.gainShare * 100)}% of measured gains for {res.months} months</div><div className="text-3xl font-bold text-amber" data-testid="res-month">{money(res.perMonth)}/mo</div>
            <div className="text-[13px] text-[#A9ADB4]">Most you'd ever pay: {money(res.cap)} · on these numbers: {money(res.total)}</div>
          </div>
        </div>
      )}

      {tab === "equity" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Num label="Value of the automations we'd build" value={build} onChange={setBuild} step={1000} />
            <Num label="Agreed value of your company today" value={value} onChange={setValue} step={10000} />
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-ink p-4 text-paper" aria-live="polite">
            <div className="text-[13px] text-[#A9ADB4]">Indicative stake</div><div className="text-3xl font-bold text-amber" data-testid="eq-stake">{stake}%</div>
            <div className="text-[13px] text-[#A9ADB4]">Vests over {EQUITY.vestingMonths} months as agreed milestones are hit. We look for {EQUITY.minStake}–{EQUITY.maxStake}%; builds from {money(EQUITY.minBuildValue)}.</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/apply/?deal=${tab}`} className="btn btn-primary">Apply for this deal →</Link>
        <span className="text-[12px] text-muted">Indicative figures. Every deal is agreed in writing after a review; plans and stakes are subject to approval.</span>
      </div>
    </div>
  );
}
