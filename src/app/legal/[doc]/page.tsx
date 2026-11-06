import type { Metadata } from "next";
import Link from "next/link";

const TITLES: Record<string, string> = {
  terms: "Terms of service",
  privacy: "Privacy policy",
  refunds: "Refund policy",
  dpa: "Data-processing agreement",
};

/** Plain-English commitments already made elsewhere on the site. Not the legal text. */
const SUMMARY: Record<string, string[]> = {
  terms: [
    "Every build has a fixed price shown before you buy; scope is confirmed on a short setup form.",
    "We build in accounts you own. You keep the workflows, data and a written handover.",
    "Ongoing support is optional. Monthly services have a 6-month minimum, then run month to month.",
    "Usage costs (call minutes, texts, AI usage) are billed at cost.",
  ],
  refunds: [
    "Approve the test run or get a full refund: if you don't approve the test run of a build, we refund that build's fee in full.",
    "DIY kits: you can cancel for a full refund within 14 days, as long as you haven't downloaded the kit. At checkout you'll be asked to agree that downloading starts straight away and ends that right to cancel.",
    "Courses: full refund at any time before the course opens, and within 14 days of it opening if you haven't started the lessons. Your statutory rights are not affected.",
    "The $99 starter is credited in full if you upgrade to a build.",
  ],
  privacy: [
    "We only access the apps you connect, with logins you can switch off at any time — we never ask for passwords.",
    "Card details are handled by Stripe; we never see or store them.",
    "Workflows run on n8n Cloud with data stored in the EU (Frankfurt, Germany), encrypted in transit and at rest.",
    "Sub-processors: n8n (hosting), Anthropic, OpenAI, Google or Mistral (only the AI models your workflows use), Airtable (where used), Stripe (payments).",
    "Applications for payment plans, results-based or equity deals are used only to assess that application. Business credit searches go to a credit reference agency; a finance partner sees your details only if you choose finance and agree.",
    "Applications are kept 12 months if no deal goes ahead, then deleted; for the life of the contract plus 6 years if it does. You can ask to see, correct or delete your information at any time, and complain to the ICO.",
  ],
  dpa: [
    "A data-processing agreement will be available to sign before any build starts.",
    "It will list the same sub-processors shown on our security section and in the privacy policy.",
  ],
};

export function generateStaticParams() {
  return Object.keys(TITLES).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  return { title: `${TITLES[doc] ?? "Legal"} — TaskAutoMode`, robots: { index: false } };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  return (
    <main className="wrap flex max-w-[820px] flex-col gap-4 py-14">
      <h1 className="font-display m-0 text-4xl font-bold">{TITLES[doc] ?? "Legal"}</h1>
      <div className="rounded-lg border border-[#F3A847] bg-[#FEF8F2] p-4 text-[15px]">
        The full {(TITLES[doc] ?? "document").toLowerCase()} {doc === "terms" ? "are" : "is"} being finalized with our attorney before card payments open. Nothing is charged until then.
      </div>
      <h2 className="m-0 mt-2 text-xl font-bold">In plain English, what we already commit to</h2>
      <ul className="m-0 flex flex-col gap-2 pl-5 text-[16px] leading-relaxed text-ink-2">
        {(SUMMARY[doc] ?? []).map((x) => <li key={x}>{x}</li>)}
      </ul>
      <p className="m-0 text-[13px] text-muted">This summary is not the legal text and does not replace it.</p>
      <div className="flex flex-wrap gap-4 text-sm">{Object.entries(TITLES).filter(([k]) => k !== doc).map(([k, t]) => <Link key={k} href={`/legal/${k}/`}>{t}</Link>)}</div>
    </main>
  );
}
