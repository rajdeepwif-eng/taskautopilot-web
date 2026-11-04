import type { Metadata } from "next";
import AdLanding from "@/components/AdLanding";
import { solutionMetaTitle } from "@/components/SolutionView";
import { SOLUTIONS } from "@/lib/solutions";
import { Country, EDITIONS } from "@/lib/geo";

export function generateStaticParams() {
  return EDITIONS.flatMap((country) => SOLUTIONS.map((s) => ({ country, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; slug: string }> }): Promise<Metadata> {
  const { country, slug } = await params;
  return { title: { absolute: solutionMetaTitle(slug, country as Country) }, robots: { index: false, follow: true } };
}

export default async function Page({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  return <AdLanding slug={slug} country={country as Country} />;
}
