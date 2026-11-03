"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BUNDLES, byId, fmt } from "@/lib/catalogue";
import { loadPlan, savePlan } from "@/lib/plan";
import { ProductDetail } from "../../library/LibraryClient";

export default function ProductPageClient({ id }: { id: number }) {
  const p = byId(id);
  const [plan, setPlan] = useState<number[]>([]);
  useEffect(() => setPlan(loadPlan()), []);
  const add = (ids: number[]) => {
    const next = [...plan, ...ids.filter((x) => !plan.includes(x))];
    setPlan(next);
    savePlan(next);
  };
  const bundle = BUNDLES.find((b) => b.ids.includes(id));
  return (
    <main>
      <div className="wrap flex flex-wrap items-center justify-between gap-3 pt-5 text-sm">
        <Link href="/library/">← All automations</Link>
        {plan.length > 0 && (
          <Link href={`/checkout/?plan=${plan.join(",")}`} className="font-semibold">
            Your plan ({plan.length}) — checkout →
          </Link>
        )}
      </div>
      <ProductDetail inline p={p} inPlan={plan.includes(id)} onAdd={() => add([id])} onClose={() => {}}>
        {bundle && (() => {
          const bi = bundle.ids.map(byId);
          const full = bi.filter((x) => !x.monthly).reduce((a, x) => a + x.price, 0);
          return (
            <div className="mt-2 flex flex-col gap-2.5 rounded-xl border border-line p-4">
              <div className="font-semibold">Often added together — {bundle.name}</div>
              <div className="text-[14px] text-ink-2">{bi.map((x) => x.name).join(" + ")}</div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>Total: <b>{fmt(full * 0.9)}</b> <span className="text-sm text-ok">save {fmt(full * 0.1)} vs separately</span></span>
                <Link href={`/checkout/?plan=${bundle.ids.join(",")}`} className="btn btn-primary">Buy all {bundle.ids.length}</Link>
              </div>
            </div>
          );
        })()}
      </ProductDetail>
    </main>
  );
}
