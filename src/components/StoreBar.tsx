"use client";

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
      className="flex h-10 min-w-0 flex-1 overflow-hidden rounded-md bg-white focus-within:ring-2 focus-within:ring-[#FEBD69]"
      onSubmit={(e) => { e.preventDefault(); router.push(`/library/?q=${encodeURIComponent(q)}`); try { window.dispatchEvent(new CustomEvent("ta-search", { detail: q })); } catch { /* ignore */ } }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search automations — e.g. missed calls, invoices, bookings"
        aria-label="Search automations"
        className="min-w-0 flex-1 !rounded-none !border-0 !px-3 !py-0 text-[15px] text-[#0F1111]"
      />
      <button type="submit" aria-label="Search" className="flex w-12 cursor-pointer items-center justify-center border-0 bg-[#FEBD69] hover:bg-[#F3A847]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F1111" strokeWidth="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
      </button>
    </form>
  );
}

/** "Your plan" with a live count, like a basket. */
export function PlanLink() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    setIds(loadPlan());
    const on = (e?: Event) => { const d = (e as CustomEvent<number[]> | undefined)?.detail; setIds(Array.isArray(d) ? d : loadPlan()); };
    window.addEventListener("ta-plan-change", on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener("ta-plan-change", on); window.removeEventListener("storage", on); };
  }, []);
  const href = ids.length ? `/checkout/?plan=${ids.join(",")}` : "/library/";
  return (
    <Link href={href} className="flex items-end gap-1 rounded px-1.5 py-1 text-white no-underline hover:outline hover:outline-1 hover:outline-white" aria-label={`Your plan, ${ids.length} items`}>
      <span className="relative">
        <svg width="34" height="28" viewBox="0 0 34 28" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true"><path d="M2 3h5l4 16h16l4-11H9" /><circle cx="13" cy="24" r="2" /><circle cx="25" cy="24" r="2" /></svg>
        <span className="absolute -top-1.5 left-[15px] text-[15px] font-bold text-[#F08804]">{ids.length}</span>
      </span>
      <span className="hidden text-[14px] font-bold sm:inline">Plan</span>
    </Link>
  );
}

/** "Live by <date>" — like a delivery date. Shows working days until the browser works out the date. */
export function LiveBy({ days, className = "" }: { days: number; className?: string }) {
  const [label, setLabel] = useState(`in ${days} working days`);
  useEffect(() => {
    const d = new Date();
    let left = days + 2; // build starts within 2 working days
    while (left > 0) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) left--; }
    setLabel(d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }, [days]);
  return <span className={className}>Live by <b>{label}</b></span>;
}
