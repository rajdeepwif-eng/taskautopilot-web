import type { Metadata } from "next";
import KitClient from "./KitClient";

export const metadata: Metadata = {
  title: { absolute: "Sales kit | TaskAutopilot" },
  robots: { index: false, follow: false },
};

export default function KitPage() {
  return <KitClient />;
}
