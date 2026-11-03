import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import { PRODUCTS, Product } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Secure checkout — TaskAutopilot" };

// Homepage package shortcuts: 21 = "Invoices & bank" bundle (invoice reader + bank reconciliation), 0 = paid audit.
const PACKAGE_IDS: Record<string, number[]> = { "21": [21, 23] };
const AUDIT: Product = { id: 0, cat: "Get started", name: "Paid automation audit", desc: "Ranked plan with fixed quotes", apps: "", price: 499, days: 5, ind: ["all"] };

async function CheckoutLoader({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan = "" } = await searchParams;
  const raw = plan.split(",").filter(Boolean);
  const ids = raw.length === 1 && PACKAGE_IDS[raw[0]] ? PACKAGE_IDS[raw[0]] : raw.map(Number);
  const items = ids
    .map((id) => (id === 0 ? AUDIT : PRODUCTS.find((p) => p.id === id)))
    .filter((p): p is Product => !!p);
  return <CheckoutClient items={items} />;
}

export default function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  return (
    <Suspense fallback={<main className="wrap py-16 text-ink-2">Loading your plan…</main>}>
      <CheckoutLoader searchParams={searchParams} />
    </Suspense>
  );
}
