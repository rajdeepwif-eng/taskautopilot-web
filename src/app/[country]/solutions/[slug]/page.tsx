import type { Metadata } from "next";
import SolutionView, { solutionMetaTitle } from "@/components/SolutionView";
import { SOLUTIONS, solutionBySlug } from "@/lib/solutions";
import { Country, EDITIONS, alternates, loc, localPrices, metaDesc } from "@/lib/geo";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";

export function generateStaticParams() {
  return EDITIONS.flatMap((country) => SOLUTIONS.map((s) => ({ country, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  const s = solutionBySlug(slug);
  const img = TRADE_PHOTOS[s.trades[0][0]];
  return { title: { absolute: solutionMetaTitle(slug, country as Country) }, description: metaDesc(localPrices(loc(s.metaDescription, country as Country), country as Country)), alternates: alternates(`/solutions/${slug}/`, country as Country), openGraph: img ? { images: [img.src] } : undefined };
}

export default async function Page({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  return <SolutionView slug={slug} country={country as Country} />;
}
