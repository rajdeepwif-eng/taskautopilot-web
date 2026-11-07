"use client";
import { PAYMENTS_LIVE } from "@/lib/launch";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadPlan } from "@/lib/plan";

/** Shop-style search box for the header. */
export function HeaderSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      role="search"
      className="flex h-[42px] min-w-0 flex-1 overflow-hidden rounded-xl bg-white focus-within:ring-2 focus-within:ring-amber"
      onSubmit={(e) => { e.preventDefault(); router.push(`/library/?q=${encodeURIComponent(q)}`); try { window.dispatchEvent(new CustomEvent("ta-search", { detail: q })); } catch { /* ignore */ } }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search — e.g. missed calls, invoices"
        aria-label="Search automations"
        className="min-w-0 flex-1 !rounded-none !border-0 !px-3 !py-0 text-[15px] text-ink"
      />
      <button type="submit" aria-label="Search" className="flex w-11 cursor-pointer items-center justify-center border-0 bg-amber hover:bg-clay">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
      </button>
    </form>
  );
}

/** "Your cart" with a live count, like a basket. */
export function PlanLink() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    setIds(loadPlan());
    const on = (e?: Event) => { const d = (e as CustomEvent<number[]> | undefined)?.detail; setIds(Array.isArray(d) ? d : loadPlan()); };
    window.addEventListener("ta-plan-change", on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener("ta-plan-change", on); window.removeEventListener("storage", on); };
  }, []);
  if (!ids.length) return null;
  return (
    <Link href={`/checkout/?plan=${ids.join(",")}`} className="flex h-[42px] shrink-0 items-center gap-1.5 rounded-lg border border-white/60 px-3 text-[14px] font-semibold text-white no-underline hover:bg-white/15" aria-label={`Your plan, ${ids.length} items — go to checkout`} data-testid="plan-link">
      <span>Your plan</span><span className="rounded-full bg-clay px-2 py-0.5 text-[12px] text-white">{ids.length}</span>
    </Link>
  );
}

/** "Live by <date>" — like a delivery date. Shows business days until the browser works out the date. */
export function LiveBy({ days, className = "" }: { days: number; className?: string }) {
  if (!PAYMENTS_LIVE) return <span className={className}>Live about <b>{days} business days</b> after you order</span>;
  const [label, setLabel] = useState(`in ${days} business days`);
  useEffect(() => {
    const d = new Date();
    let left = days + 2; // build starts within 2 business days
    while (left > 0) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) left--; }
    setLabel(d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }, [days]);
  return <span className={className}>Live by <b>{label}</b></span>;
}
