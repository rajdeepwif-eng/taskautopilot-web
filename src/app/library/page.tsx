import type { Metadata } from "next";
import LibraryClient from "./LibraryClient";

export const metadata: Metadata = {
  title: "Automation library — TaskAutopilot",
  description: "44 ready-made automations, websites and SEO packages, filtered by industry, with prices and demo videos.",
};

export default function LibraryPage() {
  return <LibraryClient />;
}
