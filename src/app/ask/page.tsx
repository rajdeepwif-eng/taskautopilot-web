import type { Metadata } from "next";
import { seoTitle } from "@/lib/geo";
import AskClient from "./AskClient";
import Assistant from "@/components/Assistant";

export const metadata: Metadata = { title: seoTitle("Can we automate it? Ask free"), description: "Describe any task. We tell you free whether we can automate it, the fixed price and how long it takes." };

export default function AskPage() {
  return (
    <main className="wrap flex w-full min-w-0 flex-wrap gap-10 pb-16 pt-12">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
        <div className="kicker">Free · no call · no obligation</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Can we automate it? Ask — the answer is free.</h1>
        <p className="m-0 text-lg text-ink-2">Start with the result you want. We work backwards to what it needs and how it runs, then reply with a demo, your options and a fixed price — within 1 business day once our inbox opens at launch.</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[16px]">
          <li>✓ A clear yes or no — we&apos;ll tell you if it isn&apos;t worth automating</li>
          <li>✓ A fixed price and timeline if it&apos;s a yes</li>
          <li>✓ We never charge for telling you what we can or can&apos;t do</li>
        </ul>
      </div>
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
        <Assistant inline />
        <details className="card p-5"><summary className="cursor-pointer font-semibold">Prefer to write it out in your own words?</summary><div className="pt-4"><AskClient /></div></details>
      </div>
    </main>
  );
}
