import type { Metadata } from "next";
import { TRADES, tradeBySlug } from "@/lib/trades";
import TradeView from "@/components/TradeView";
import { alternates } from "@/lib/geo";

export function generateStaticParams() {
  return TRADES.map((t) => ({ trade: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string }> }): Promise<Metadata> {
  const t = tradeBySlug((await params).trade);
  return { title: `Automation for ${t.name} | TaskAutopilot`, description: t.headline, alternates: alternates(`/for/${t.slug}/`, "us") };
}

export default async function TradePage({ params }: { params: Promise<{ trade: string }> }) {
  return <TradeView slug={(await params).trade} country="us" />;
}
