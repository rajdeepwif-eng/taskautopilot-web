"use client";

import { useSearchParams } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { PRODUCTS, Product } from "@/lib/catalogue";

// Homepage package shortcuts: "invoices" = "Invoices & bank" bundle (invoice reader + bank reconciliation), 0 = paid audit.
const PACKAGE_IDS: Record<string, number[]> = { invoices: [21, 23] };
const AUDIT: Product = { id: 0, cat: "Get started", name: "Paid automation audit", desc: "Ranked plan with fixed quotes", apps: "", price: 499, days: 5, ind: ["all"] };

export default function CheckoutFromQuery() {
  const raw = (useSearchParams().get("plan") ?? "").split(",").filter(Boolean);
  const ids = raw.length === 1 && PACKAGE_IDS[raw[0]] ? PACKAGE_IDS[raw[0]] : raw.map(Number);
  const items = ids
    .map((id) => (id === 0 ? AUDIT : PRODUCTS.find((p) => p.id === id)))
    .filter((p): p is Product => !!p);
  return <CheckoutClient key={raw.join(",")} items={items} />;
}
