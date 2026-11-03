import type { Metadata } from "next";
import MarketClient from "./MarketClient";

export const metadata: Metadata = {
  title: "Automation library — TaskAutopilot",
  description: "46 ready-made automations, websites and SEO packages, filtered by industry, with prices and demo videos.",
};

export default function LibraryPage() {
  return <MarketClient />;
}
