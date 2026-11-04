import type { Metadata } from "next";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";
import { TRADES, tradeBySlug } from "@/lib/trades";
import TradeView from "@/components/TradeView";
import { alternates, seoTitle } from "@/lib/geo";

export function generateStaticParams() {
  return TRADES.map((t) => ({ trade: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string }> }): Promise<Metadata> {
  const t = tradeBySlug((await params).trade);
  return { title: seoTitle(`${t.name} automation — ${t.short}`.length <= 60 ? `${t.name} automation — ${t.short}` : `${t.name} automation`), description: `${t.headline} Fixed prices, approve the test run or full refund.`, alternates: alternates(`/for/${t.slug}/`, "us"), openGraph: TRADE_PHOTOS[t.slug] ? { images: [TRADE_PHOTOS[t.slug].src] } : undefined };
}

export default async function TradePage({ params }: { params: Promise<{ trade: string }> }) {
  return <TradeView slug={(await params).trade} country="us" />;
}
