import type { Metadata } from "next";
import MarketClient from "./MarketClient";

export const metadata: Metadata = {
  title: "Automation library — TaskAutoMode",
  description: "Ready-made automations, websites and SEO packages for owner-run businesses — filter by industry, see how each one works, fixed prices.",
};

export default function LibraryPage() {
  return <MarketClient />;
}
