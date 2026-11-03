import type { Metadata } from "next";
import ScanClient from "./ScanClient";
export const metadata: Metadata = { title: "Free time-leak scan — TaskAutopilot", description: "Ten quick questions. A ranked report of where your business leaks money, with the fix for each." };
export default function Page() { return <ScanClient />; }
