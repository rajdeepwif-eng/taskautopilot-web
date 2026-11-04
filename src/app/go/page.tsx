import type { Metadata } from "next";
import GoClient from "./GoClient";

export const metadata: Metadata = {
  title: { absolute: "Nice to meet you | TaskAutopilot" },
  description: "Try one automation for $99 — set up for you in 5 business days.",
  robots: { index: false, follow: true },
  alternates: { canonical: "./" },
};

export default function GoPage() {
  return <GoClient />;
}
