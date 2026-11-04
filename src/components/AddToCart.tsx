"use client";

import { useEffect, useState } from "react";
import { loadPlan, savePlan } from "@/lib/plan";

/** Yellow "Add to cart" button usable on any page; shares the cart with the header and shop. */
export default function AddToCart({ ids, label = "Add to cart", className = "" }: { ids: number[]; label?: string; className?: string }) {
  const [inCart, setInCart] = useState(false);
  useEffect(() => {
    const check = () => { const p = loadPlan(); setInCart(ids.every((id) => p.includes(id))); };
    check();
    window.addEventListener("ta-plan-change", check);
    return () => window.removeEventListener("ta-plan-change", check);
  }, [ids]);
  return (
    <button
      type="button"
      onClick={() => { const p = loadPlan(); savePlan(inCart ? p.filter((x) => !ids.includes(x)) : [...p, ...ids.filter((x) => !p.includes(x))]); }}
      className={`btn btn-cart ${className}`}
    >
      {inCart ? "✓ In your cart" : label}
    </button>
  );
}
