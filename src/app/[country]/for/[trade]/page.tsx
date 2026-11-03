import type { Metadata } from "next";
import { TRADES, tradeBySlug } from "@/lib/trades";
import TradeView from "@/components/TradeView";
import { COUNTRIES, Country, EDITIONS, alternates } from "@/lib/geo";

export function generateStaticParams() {
  return EDITIONS.flatMap((country) => TRADES.map((t) => ({ country, trade: t.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; trade: string }> }): Promise<Metadata> {
  const { country, trade } = await params;
  const t = tradeBySlug(trade);
  const C = COUNTRIES[country as Country];
  return { title: `${t.name} automation in the ${C.adj === "UK" ? "UK" : C.name} | TaskAutopilot`, description: `${t.headline} Fixed prices in ${C.sym}, ${C.tax}.`, alternates: alternates(`/for/${t.slug}/`, country as Country) };
}

export default async function Page({ params }: { params: Promise<{ country: string; trade: string }> }) {
  const { country, trade } = await params;
  return <TradeView slug={trade} country={country as Country} />;
}
