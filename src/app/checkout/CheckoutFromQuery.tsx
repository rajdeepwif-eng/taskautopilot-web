"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadPlan } from "@/lib/plan";
import CheckoutClient from "./CheckoutClient";
import { PRODUCTS, Product } from "@/lib/catalogue";

// Homepage package shortcuts: "invoices" = "Invoices & bank" bundle (invoice reader + bank reconciliation), 0 = paid audit.
const PACKAGE_IDS: Record<string, number[]> = { invoices: [21, 23] };
const AUDIT: Product = { id: 0, cat: "Get started", name: "Paid automation audit", desc: "Ranked plan with fixed quotes", apps: "", price: 499, days: 5, ind: ["all"] };

export default function CheckoutFromQuery() {
  const sp = useSearchParams();
  const fromUrl = (sp.get("plan") ?? "").split(",").filter(Boolean);
  // No ?plan= in the link: fall back to the cart saved in this browser.
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => { if (!fromUrl.length) setSaved(loadPlan().map(String)); }, [fromUrl.length]);
  const raw = fromUrl.length ? fromUrl : saved;
  const pick = sp.get("pick");
  const PICKS: Record<string, string> = { "missed-calls": "Missed-call text-back", reviews: "Review requests", "invoices-excel": "Invoices into Excel", "email-sort": "Email sorting", "forms-sheet": "Form to sheet + alert" };
  const ids = raw.length === 1 && PACKAGE_IDS[raw[0]] ? PACKAGE_IDS[raw[0]] : raw.map(Number);
  const items = ids
    .map((id) => (id === 0 ? AUDIT : PRODUCTS.find((p) => p.id === id)))
    .filter((p): p is Product => !!p)
    .map((p) => (p.id === 120 && pick && PICKS[pick] ? { ...p, name: `Starter — ${PICKS[pick]}` } : p));
  return <CheckoutClient key={raw.join(",")} items={items} />;
}
