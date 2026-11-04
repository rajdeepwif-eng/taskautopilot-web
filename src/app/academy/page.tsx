import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, priceLabel } from "@/lib/catalogue";
import { CatArt } from "@/components/CatArt";
import { LIVE_WORKFLOWS } from "@/components/OwnAutomations";

export const metadata: Metadata = {
  title: "TaskAutopilot Academy — automation courses for owners and teams",
  description: "Learn to automate your own business from owners who run 43 live automations. Self-paced courses, a live cohort and team workshops.",
};

export default function AcademyPage() {
  const courses = PRODUCTS.filter((p) => p.cat === "Courses");
  return (
    <main>
      <section className="wrap flex flex-col gap-4 pb-8 pt-14">
        <div className="kicker">TaskAutopilot Academy</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.04] tracking-tight">Learn to automate your own business — from owners who run {LIVE_WORKFLOWS} live automations.</h1>
        <p className="m-0 max-w-[720px] text-lg text-ink-2">Free tutorials teach the tool. Ours teach the business: what to automate first, how to keep it reliable, and how to make your team use it. Each lesson is built to end with something working.</p>
        <div className="flex flex-wrap gap-4 text-sm text-ink-2"><span>✓ Real workflows we run ourselves</span><span>✓ Templates you keep</span><span>✓ Approval steps built in — nothing runs without your yes</span></div>
      </section>
      <section className="wrap grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 pb-14">
        {courses.map((c) => (
          <article key={c.id} className="card flex flex-col overflow-hidden">
            <div className="relative aspect-[16/7]"><CatArt cat="Courses" size={48} /></div>
            <div className="flex flex-1 flex-col gap-2.5 p-5">
              <div className="text-[12px] text-muted">{c.apps}</div>
              <h2 className="m-0 font-display text-[21px] font-bold leading-tight">{c.name}</h2>
              <p className="m-0 text-[14.5px] leading-normal text-ink-2">{c.desc}</p>
              <div className="mt-auto font-display text-[28px] font-bold">{priceLabel(c)}</div>
              <Link href={`/checkout/?plan=${c.id}`} className="btn btn-primary">{c.id === 75 ? "Book the workshop" : c.id === 74 || c.id === 106 || c.id === 105 ? "Reserve a place" : "Pre-order — opens soon"}</Link>
              <Link href={`/p/${c.id}/`} className="text-center text-sm">What&apos;s inside →</Link>
            </div>
          </article>
        ))}
      </section>
      <section className="border-y border-line bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-12">
          <div className="flex max-w-[640px] flex-col gap-2">
            <h2 className="m-0 font-display text-[30px]">Rather we just build it?</h2>
            <p className="m-0 text-ink-2">Every course has a done-for-you version. Course fees are credited if you upgrade within 30 days.</p>
          </div>
          <div className="flex flex-wrap gap-3"><Link href="/library/" className="btn btn-dark">Shop automations</Link><Link href="/consulting/" className="btn btn-outline">Train my whole team</Link></div>
        </div>
      </section>
    </main>
  );
}
