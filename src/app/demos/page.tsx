import type { Metadata } from "next";
import Link from "next/link";
import FixDemo from "@/components/FixDemo";
import { SOLUTIONS } from "@/lib/solutions";
import { seoTitle } from "@/lib/geo";

export const metadata: Metadata = {
  title: seoTitle("See it run: automation demos"),
  description: "Press play and watch each automation work, step by step: missed calls texted back, invoices chased and paid, quotes followed up, reviews requested.",
  alternates: { canonical: "./" },
};

export default function DemosPage() {
  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <section className="flex flex-col gap-3">
        <div className="kicker">Demos · sample data</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">See each automation run — 30 seconds each</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">Press play to watch what happens, step by step. These use sample data; yours runs in your own accounts with your words.</p>
      </section>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SOLUTIONS.map((s) => (
          <div key={s.slug} className="flex flex-col gap-2">
            <FixDemo slug={s.slug} />
            <Link href={`/solutions/${s.slug}/`} className="text-[15px] font-semibold">{s.short}: how it works and what it costs →</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
