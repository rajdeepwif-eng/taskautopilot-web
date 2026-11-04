import type { Metadata } from "next";
import AskClient from "./AskClient";

export const metadata: Metadata = { title: "Can we automate it? Free answer in 1 business day — TaskAutopilot", description: "Describe any task. We tell you free whether we can automate it, the fixed price and how long it takes." };

export default function AskPage() {
  return (
    <main className="wrap flex flex-wrap gap-10 pb-16 pt-12">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
        <div className="kicker">Free · no call · no obligation</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Can we automate it? Ask — the answer is free.</h1>
        <p className="m-0 text-lg text-ink-2">Not in our shop? We build custom automations every week. Tell us the task in plain words and get a straight answer within 1 business day once our inbox opens at launch.</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[16px]">
          <li>✓ A clear yes or no — we&apos;ll tell you if it isn&apos;t worth automating</li>
          <li>✓ A fixed price and timeline if it&apos;s a yes</li>
          <li>✓ We never charge for telling you what we can or can&apos;t do</li>
        </ul>
      </div>
      <div className="card min-w-0 flex-[1_1_480px] p-6"><AskClient /></div>
    </main>
  );
}
