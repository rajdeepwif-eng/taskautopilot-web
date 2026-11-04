import type { Metadata } from "next";
import { TRADE_PHOTOS } from "@/lib/tradePhotos";
import { TRADES, tradeBySlug } from "@/lib/trades";
import TradeView from "@/components/TradeView";
import { COUNTRIES, Country, EDITIONS, alternates, loc, seoTitle } from "@/lib/geo";

export function generateStaticParams() {
  return EDITIONS.flatMap((country) => TRADES.map((t) => ({ country, trade: t.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; trade: string }> }): Promise<Metadata> {
  const { country, trade } = await params;
  const t = tradeBySlug(trade);
  const C = COUNTRIES[country as Country];
  return { title: seoTitle(`${loc(t.name, country as Country)} automation in ${C.adj === "UK" ? "the UK" : C.name}`), description: `${loc(t.headline, country as Country)} Fixed prices in ${C.sym}, ${C.tax}.`, alternates: alternates(`/for/${t.slug}/`, country as Country), openGraph: TRADE_PHOTOS[t.slug] ? { images: [TRADE_PHOTOS[t.slug].src] } : undefined };
}

export default async function Page({ params }: { params: Promise<{ country: string; trade: string }> }) {
  const { country, trade } = await params;
  return <TradeView slug={trade} country={country as Country} />;
}
