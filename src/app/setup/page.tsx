import type { Metadata } from "next";
import SetupClient from "./SetupClient";

export const metadata: Metadata = { title: { absolute: "Your setup form | TaskAutoMode" }, robots: { index: false, follow: false } };

export default function SetupPage() {
  return <SetupClient />;
}
