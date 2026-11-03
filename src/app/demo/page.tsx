import type { Metadata } from "next";
import DemoClient from "./DemoClient";
export const metadata: Metadata = { title: "Try the AI assistant live — TaskAutopilot", description: "Tap a question and watch a customer get answered in seconds." };
export default function Page() { return <DemoClient />; }
