import type { Metadata } from "next";
import CompareView from "@/components/CompareView";
import { COMPARES, compareBySlug } from "@/lib/compare";
import { alternates, metaDesc } from "@/lib/geo";

export function generateStaticParams() {
  return COMPARES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = compareBySlug(slug);
  return { title: { absolute: c.metaTitle.length <= 45 ? `${c.metaTitle} | TaskAutoMode` : c.metaTitle }, description: metaDesc(c.metaDescription), alternates: alternates(`/compare/${slug}/`, "us") };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CompareView slug={slug} country="us" />;
}
