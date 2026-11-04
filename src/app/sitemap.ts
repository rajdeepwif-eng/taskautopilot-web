import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalogue";
import { TRADES } from "@/lib/trades";
import { SOLUTIONS } from "@/lib/solutions";
import { COMPARES } from "@/lib/compare";
import { INTEGRATIONS } from "@/lib/integrations";
import { AUDIENCE } from "@/components/TradeFixView";
import { EDITIONS, SITE } from "@/lib/geo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core = ["/", "/library/", "/planner/", "/kits/", "/academy/", "/consulting/", "/ask/", "/starter/", "/scan/", "/demo/", "/insurance/", "/legal-firms/", "/partners/", "/tools/late-payment-interest-calculator/"];
  const urls = [
    ...core.map((p) => `${SITE}${p}`),
    ...SOLUTIONS.map((s) => `${SITE}/solutions/${s.slug}/`),
    ...COMPARES.map((c) => `${SITE}/compare/${c.slug}/`),
    ...INTEGRATIONS.map((i) => `${SITE}/integrations/${i.slug}/`),
    `${SITE}/demos/`,
    ...SOLUTIONS.flatMap((s) => s.trades.filter(([t]) => AUDIENCE[t]).map(([t]) => `${SITE}/for/${t}/${s.slug}/`)),
    ...TRADES.map((t) => `${SITE}/for/${t.slug}/`),
    ...EDITIONS.flatMap((c) => [`${SITE}/${c}/`, ...TRADES.map((t) => `${SITE}/${c}/for/${t.slug}/`), ...SOLUTIONS.map((s) => `${SITE}/${c}/solutions/${s.slug}/`), ...COMPARES.map((x) => `${SITE}/${c}/compare/${x.slug}/`)]),
    ...PRODUCTS.map((p) => `${SITE}/p/${p.id}/`),
  ];
  return urls.map((url) => ({ url, lastModified: now }));
}
