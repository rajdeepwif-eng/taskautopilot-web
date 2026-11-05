import type { Metadata } from "next";
import DealReviewClient from "./DealReviewClient";

export const metadata: Metadata = { title: { absolute: "Deal review | TaskAutoMode" }, robots: { index: false, follow: false } };

export default function DealReview() {
  return <DealReviewClient />;
}
