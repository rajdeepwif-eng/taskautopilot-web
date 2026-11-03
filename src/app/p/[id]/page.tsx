import type { Metadata } from "next";
import { PRODUCTS, byId, priceLabel } from "@/lib/catalogue";
import ProductPageClient from "./ProductPageClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = byId(Number((await params).id));
  return { title: `${p.name} — ${priceLabel(p)} — TaskAutopilot`, description: p.desc };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductPageClient id={Number((await params).id)} />;
}
