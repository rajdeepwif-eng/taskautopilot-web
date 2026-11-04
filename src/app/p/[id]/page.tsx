import type { Metadata } from "next";
import { metaDesc, seoTitle } from "@/lib/geo";
import { PRODUCTS, byId, priceLabel } from "@/lib/catalogue";
import ProductPageClient from "./ProductPageClient";
import { PAYMENTS_LIVE } from "@/lib/launch";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = byId(Number((await params).id));
  return { title: seoTitle(`${p.name} — ${priceLabel(p)}`.length <= 60 ? `${p.name} — ${priceLabel(p)}` : p.name.split(" (")[0].slice(0, 60)), description: metaDesc(p.desc), alternates: { canonical: `/p/${p.id}/` } };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const p = byId(Number((await params).id));
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://rajdeepwif-eng.github.io/taskautopilot-web/" }, { "@type": "ListItem", position: 2, name: "All automations", item: "https://rajdeepwif-eng.github.io/taskautopilot-web/library/" }, { "@type": "ListItem", position: 3, name: p.name, item: `https://rajdeepwif-eng.github.io/taskautopilot-web/p/${p.id}/` }] };
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc,
    brand: { "@type": "Brand", name: "TaskAutopilot" },
    category: p.cat,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: PAYMENTS_LIVE ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: `https://rajdeepwif-eng.github.io/taskautopilot-web/p/${p.id}/`,
      ...(p.monthly ? { priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "USD", unitCode: "MON" } } : {}),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <ProductPageClient id={p.id} />
    </>
  );
}
