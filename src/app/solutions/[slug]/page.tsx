import type { Metadata } from "next";
import SolutionView, { solutionTitle } from "@/components/SolutionView";
import { SOLUTIONS, solutionBySlug } from "@/lib/solutions";
import { alternates } from "@/lib/geo";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = solutionBySlug((await params).slug);
  const img = TRADE_PHOTOS[s.trades[0][0]];
  return { title: `${solutionTitle(s.slug, "us")} | TaskAutopilot`, description: s.metaDescription, alternates: alternates(`/solutions/${s.slug}/`, "us"), openGraph: img ? { images: [img.src] } : undefined };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <SolutionView slug={(await params).slug} country="us" />;
}
