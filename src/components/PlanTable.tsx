"use client";

import Link from "next/link";
import { PLAN_TERMS, planFor } from "@/lib/deals";
import { useCurrency } from "@/components/Currency";

/** Monthly-plan examples worked out in the visitor's currency, so every row adds up. */
export default function PlanTable({ items }: { items: { id: number; name: string; price: number }[] }) {
  const { local, fromUsd } = useCurrency();
  return (
    <table className="w-full min-w-[620px] border-collapse text-left text-[15px]" data-nocurrency data-testid="plan-table">
      <thead><tr className="bg-[#F7F8F8] text-[13px] text-muted"><th className="px-4 py-3">Automation</th><th className="px-4 py-3">Up front</th>{PLAN_TERMS.map((t) => <th key={t.months} className="px-4 py-3">{t.months} months</th>)}</tr></thead>
      <tbody>
        {items.map((p) => { const base = fromUsd(p.price); return (
          <tr key={p.id} className="border-t border-line"><td className="px-4 py-3"><Link href={`/p/${p.id}/`}>{p.name}</Link></td><td className="px-4 py-3">{local(base)}</td>
            {PLAN_TERMS.map((t) => { const x = planFor(base, t.months); return <td key={t.months} className="px-4 py-3">{local(x.deposit)} + {t.months} × {local(x.monthly)}<div className="text-[12.5px] text-muted">total {local(x.total)}</div></td>; })}</tr>
        ); })}
      </tbody>
    </table>
  );
}
