"use client";

import { useState } from "react";

import { REFERENCE_RATE } from "./rate";

const gbp = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** Fixed compensation under s5A of the Late Payment of Commercial Debts (Interest) Act 1998. */
const compensation = (debt: number) => (debt < 1000 ? 40 : debt < 10000 ? 70 : 100);

export default function LateInterestCalc() {
  const [amount, setAmount] = useState(2500);
  const [due, setDue] = useState("");
  const [paid, setPaid] = useState("");
  const [base, setBase] = useState(REFERENCE_RATE);

  const today = new Date().toISOString().slice(0, 10);
  const end = paid || today;
  const days = due ? Math.max(0, Math.round((Date.parse(end) - Date.parse(due)) / 86400000)) : 30;
  const rate = 8 + base;
  const daily = (amount * rate) / 100 / 365;
  const interest = daily * days;
  const comp = amount > 0 ? compensation(amount) : 0;

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="card flex min-w-0 flex-[999_1_420px] flex-col gap-4 p-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Invoice amount (£, the amount owed)
          <input type="number" min={0} step={1} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Payment due date
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Date paid <span className="font-normal text-muted">(leave blank if still unpaid)</span>
            <input type="date" value={paid} onChange={(e) => setPaid(e.target.value)} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Bank of England reference rate (%)
          <input type="number" min={0} step={0.05} value={base} onChange={(e) => setBase(Math.max(0, Number(e.target.value) || 0))} />
          <span className="font-normal text-muted">
            The rate in force on 30 June applies from 1 July to 31 December; the rate on 31 December applies from 1 January to 30 June.
            We&apos;ve filled in {REFERENCE_RATE}% for July–December 2026. Change it for invoices due in another period.
          </span>
        </label>
        {!due && <div className="text-[13px] text-muted">No due date entered — showing an example of 30 days late.</div>}
      </div>

      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-2xl bg-ink p-6 text-paper" aria-live="polite">
        <div className="text-[13px] text-[#A9ADB4]">You can claim</div>
        <div className="font-display text-4xl font-bold text-amber">{gbp(interest + comp)}</div>
        <div className="flex justify-between gap-3 border-t border-[#2B2E33] pt-3 text-[15px]"><span>Statutory interest at {rate.toFixed(2)}% for {days} day{days === 1 ? "" : "s"}</span><b>{gbp(interest)}</b></div>
        <div className="flex justify-between gap-3 text-[15px]"><span>Fixed compensation</span><b>{gbp(comp)}</b></div>
        <div className="flex justify-between gap-3 text-[13px] text-[#A9ADB4]"><span>Interest per day from now</span><span>{gbp(daily)}</span></div>
        <div className="text-[12px] text-[#A9ADB4]">Estimate for business-to-business debts only. Not legal advice — check your contract terms and take advice before claiming.</div>
      </div>
    </div>
  );
}
