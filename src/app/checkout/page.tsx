import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutFromQuery from "./CheckoutFromQuery";

export const metadata: Metadata = { title: "Secure checkout — TaskAutoMode" };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="wrap py-16 text-ink-2">Loading your order…</main>}>
      <CheckoutFromQuery />
    </Suspense>
  );
}
