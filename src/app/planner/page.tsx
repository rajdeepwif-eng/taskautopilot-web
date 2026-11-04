import type { Metadata } from "next";
import { seoTitle } from "@/lib/geo";
import PlannerClient from "./PlannerClient";

export const metadata: Metadata = {
  title: seoTitle("Automation planner: what to automate first & payback"),
  description: "Pick where your team's time goes. Get a ranked automation plan, payback in weeks and a 90-day rollout you can buy in one click.",
};

export default function PlannerPage() {
  return <PlannerClient />;
}
