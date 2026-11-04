import type { Metadata } from "next";
import AdLanding from "@/components/AdLanding";
import { solutionMetaTitle } from "@/components/SolutionView";
import { SOLUTIONS } from "@/lib/solutions";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: { absolute: solutionMetaTitle(slug, "us") }, robots: { index: false, follow: true } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <AdLanding slug={(await params).slug} country="us" />;
}
