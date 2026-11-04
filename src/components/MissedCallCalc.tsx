"use client";

import { useState } from "react";
import { fmt } from "@/lib/catalogue";

/** Missed-call cost calculator — the visitor's own numbers, nothing assumed beyond what they enter. */
export default function MissedCallCalc() {
  const [v, setV] = useState({ missed: 5, value: 400, win: 30 });
  const yearly = v.missed * 52 * v.value * (v.win / 100);
  const F = ({ k, label, pre, suf }: { k: keyof typeof v; label: string; pre?: string; suf?: string }) => (
    <label className="flex flex-col gap-1 text-[14px] text-ink-2">
      {label}
      <span className="flex items-center gap-1 rounded-lg border border-line bg-white px-2.5">
        {pre && <span className="text-muted">{pre}</span>}
        <input type="number" min={0} value={v[k]} onChange={(e) => setV({ ...v, [k]: Math.max(0, Number(e.target.value) || 0) })} className="w-full min-w-0 !border-0 !bg-transparent !px-0 !py-2 text-[16px]" />
        {suf && <span className="text-muted">{suf}</span>}
      </span>
    </label>
  );
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="text-lg font-bold">Missed-call cost calculator</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <F k="missed" label="Missed calls a week" />
        <F k="value" label="Average job value" pre="$" />
        <F k="win" label="% of answered calls that buy" suf="%" />
      </div>
      <div className="text-[15px]">Work you may be losing: <b className="text-[24px] text-[#B12704]">{fmt(yearly)}</b> a year</div>
      <div className="text-[12px] text-muted">Your numbers only: missed calls × 52 weeks × job value × win rate. Not every missed caller would have bought — adjust the win rate to be cautious.</div>
    </div>
  );
}
