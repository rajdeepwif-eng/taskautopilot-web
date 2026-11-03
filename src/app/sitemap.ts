import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalogue";
import { TRADES } from "@/lib/trades";
import { EDITIONS, SITE } from "@/lib/geo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-03");
  const core = ["/", "/library/", "/planner/", "/kits/", "/academy/", "/consulting/", "/ask/", "/starter/", "/scan/", "/demo/", "/insurance/", "/legal-firms/", "/partners/"];
  const urls = [
    ...core.map((p) => `${SITE}${p}`),
    ...TRADES.map((t) => `${SITE}/for/${t.slug}/`),
    ...EDITIONS.flatMap((c) => [`${SITE}/${c}/`, ...TRADES.map((t) => `${SITE}/${c}/for/${t.slug}/`)]),
    ...PRODUCTS.map((p) => `${SITE}/p/${p.id}/`),
  ];
  return urls.map((url) => ({ url, lastModified: now }));
}
