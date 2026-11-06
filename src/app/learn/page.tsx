import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, priceLabel } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Learn: courses & DIY kits — TaskAutoMode",
  description: "Prefer to build it yourself or train your team? Self-paced and live courses, team licences and DIY automation kits.",
};

/** Learners are a different buyer from owners who want it done for them, so they get their own area. */
export default function LearnPage() {
  const courses = PRODUCTS.filter((p) => p.cat === "Courses");
  const kits = PRODUCTS.filter((p) => p.cat === "DIY kits");
  const card = (p: (typeof PRODUCTS)[number]) => (
    <Link key={p.id} href={`/p/${p.id}/`} className="card flex flex-col gap-1 p-4 text-ink no-underline hover:border-ink">
      <b>{p.name}</b><span className="text-[14px] text-ink-2">{p.desc}</span><b className="mt-1">{priceLabel(p)}</b>
    </Link>
  );
  return (
    <main className="wrap flex flex-col gap-8 py-12">
      <section className="flex flex-col gap-2">
        <div className="kicker">Learn</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-tight">Build it yourself, or train your team</h1>
        <p className="m-0 max-w-[720px] text-lg text-ink-2">Most owners want it done for them — that&apos;s <Link href="/library/">the main shop</Link>. If you&apos;d rather learn, these are the same workflows we build, with guides and courses.</p>
      </section>
      <section className="flex flex-col gap-3" data-testid="learn-kits">
        <h2 className="m-0 font-display text-2xl font-bold">DIY kits — the workflow file plus a step-by-step guide</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{kits.map(card)}</div>
      </section>
      <section className="flex flex-col gap-3" data-testid="learn-courses">
        <h2 className="m-0 font-display text-2xl font-bold">Courses and team training</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{courses.map(card)}</div>
      </section>
    </main>
  );
}
