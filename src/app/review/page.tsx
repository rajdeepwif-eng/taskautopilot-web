import type { Metadata } from "next";
import Link from "next/link";
import { GOOGLE_REVIEW_URL } from "@/lib/launch";

export const metadata: Metadata = { title: { absolute: "Leave us a review | TaskAutopilot" }, robots: { index: false, follow: false } };

/** One short link for clients (e.g. in the handover email) that goes to the Google review form. */
export default function ReviewPage() {
  return (
    <main className="wrap flex flex-col items-start gap-4 pb-16 pt-12">
      <h1 className="m-0 font-display text-3xl font-bold">Thanks for working with us</h1>
      <p className="m-0 max-w-[620px] text-ink-2">If we did a good job, a short Google review helps other owners find us. It takes about a minute.</p>
      {GOOGLE_REVIEW_URL
        ? <a href={GOOGLE_REVIEW_URL} className="btn btn-primary" rel="noopener">Write a Google review →</a>
        : <p className="m-0 text-ink-2">Our Google profile is being set up — <Link href="/">back to the site</Link>.</p>}
    </main>
  );
}
