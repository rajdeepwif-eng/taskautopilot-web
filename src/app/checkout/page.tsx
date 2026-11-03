import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutFromQuery from "./CheckoutFromQuery";

export const metadata: Metadata = { title: "Secure checkout — TaskAutopilot" };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="wrap py-16 text-ink-2">Loading your plan…</main>}>
      <CheckoutFromQuery />
    </Suspense>
  );
}
