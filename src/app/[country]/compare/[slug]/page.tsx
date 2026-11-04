import type { Metadata } from "next";
import CompareView from "@/components/CompareView";
import { COMPARES, compareBySlug } from "@/lib/compare";
import { Country, EDITIONS, alternates, loc, localPrices, metaDesc } from "@/lib/geo";

export function generateStaticParams() {
  return EDITIONS.flatMap((country) => COMPARES.map((c) => ({ country, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  const c = compareBySlug(slug);
  const k = country as Country;
  const t = `${loc(c.metaTitle, k)} (${k === "uk" ? "UK" : k === "au" ? "Australia" : "Canada"})`;
  return { title: { absolute: t.length <= 45 ? `${t} | TaskAutopilot` : t }, description: metaDesc(localPrices(loc(c.metaDescription, k), k)), alternates: alternates(`/compare/${slug}/`, k) };
}

export default async function Page({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  return <CompareView slug={slug} country={country as Country} />;
}
