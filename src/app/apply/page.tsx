import type { Metadata } from "next";
import ApplyClient from "./ApplyClient";
import { seoTitle } from "@/lib/geo";

export const metadata: Metadata = { title: seoTitle("Apply: pay monthly, from results or in shares"), description: "Tell us about your business and we'll suggest the best way to work together: monthly, from results, part shares, automation for equity, or a plan to sell.", alternates: { canonical: "./" } };

export default function Page() {
  return <ApplyClient />;
}
