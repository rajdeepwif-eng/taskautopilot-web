import type { Metadata } from "next";
import TradeFixView, { AUDIENCE, tradeFixTitle } from "@/components/TradeFixView";
import { SOLUTIONS, solutionBySlug } from "@/lib/solutions";
import { metaDesc } from "@/lib/geo";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";

/** US-only pages for each trade a fix lists — real per-trade detail, not every combination. */
export function generateStaticParams() {
  return SOLUTIONS.flatMap((s) => s.trades.filter(([t]) => AUDIENCE[t]).map(([trade]) => ({ trade, fix: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string; fix: string }> }): Promise<Metadata> {
  const { trade, fix } = await params;
  const s = solutionBySlug(fix);
  const line = s.trades.find(([k]) => k === trade)?.[1] ?? "";
  const t = tradeFixTitle(trade, fix);
  return {
    title: { absolute: t.length <= 45 ? `${t} | TaskAutopilot` : t },
    description: metaDesc(`${line} Fixed price, tested with you, live in days. Approve the test run or get the build fee back.`),
    alternates: { canonical: "./" },
    openGraph: TRADE_PHOTOS[trade] ? { images: [TRADE_PHOTOS[trade].src] } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ trade: string; fix: string }> }) {
  const { trade, fix } = await params;
  return <TradeFixView trade={trade} fix={fix} />;
}
