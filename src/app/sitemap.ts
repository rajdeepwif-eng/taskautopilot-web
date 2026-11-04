import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalogue";
import { TRADES } from "@/lib/trades";
import { SOLUTIONS } from "@/lib/solutions";
import { EDITIONS, SITE } from "@/lib/geo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core = ["/", "/library/", "/planner/", "/kits/", "/academy/", "/consulting/", "/ask/", "/starter/", "/scan/", "/demo/", "/insurance/", "/legal-firms/", "/partners/", "/tools/late-payment-interest-calculator/"];
  const urls = [
    ...core.map((p) => `${SITE}${p}`),
    ...SOLUTIONS.map((s) => `${SITE}/solutions/${s.slug}/`),
    ...TRADES.map((t) => `${SITE}/for/${t.slug}/`),
    ...EDITIONS.flatMap((c) => [`${SITE}/${c}/`, ...TRADES.map((t) => `${SITE}/${c}/for/${t.slug}/`), ...SOLUTIONS.map((s) => `${SITE}/${c}/solutions/${s.slug}/`)]),
    ...PRODUCTS.map((p) => `${SITE}/p/${p.id}/`),
  ];
  return urls.map((url) => ({ url, lastModified: now }));
}
