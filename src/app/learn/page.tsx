import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, byId, fmt, priceLabel } from "@/lib/catalogue";
import { CatArt } from "@/components/CatArt";
import { COURSE_META, KIT_INSIDE, KIT_META, TRACKS, type Track } from "@/data/learn";

export const metadata: Metadata = {
  title: "Learn: courses & DIY kits — TaskAutoMode",
  description: "Prefer to build it yourself or train your team? Self-paced and live courses, team licences and DIY automation kits.",
};

type P = (typeof PRODUCTS)[number];
const FEATURED = [74, 70];

/** Course card: outcome first, what's inside, who/format/length, price. No ratings or learner counts — we have none yet. */
function CourseCard({ p, big = false }: { p: P; big?: boolean }) {
  const m = COURSE_META[p.id];
  if (!m) return null;
  return (
    <Link href={`/p/${p.id}/`} className={`card group flex flex-col overflow-hidden text-ink no-underline hover:border-ink ${big ? "md:flex-row" : ""}`} data-testid="course-card">
      <div className={`relative flex items-center justify-center bg-[#232F3E] ${big ? "min-h-[180px] md:w-[38%]" : "h-[120px]"}`}>
        <CatArt cat="Courses" size={big ? 72 : 52} />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold text-ink">{m.format} · {m.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[12.5px] font-semibold uppercase tracking-wide text-clay">{m.who}</span>
        <h3 className={`m-0 font-display font-bold leading-tight ${big ? "text-[24px]" : "text-[18px]"}`}>{m.outcome}</h3>
        <span className="text-[13.5px] text-muted">{p.name}</span>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[14px] text-ink-2">
          {m.inside.map((t) => <li key={t} className="flex gap-2"><span aria-hidden className="text-ok">✓</span><span>{t}</span></li>)}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div><b className="text-[22px]">{priceLabel(p)}</b>{m.format === "Live cohort" || m.format === "Live mastermind" || m.format === "Live programme" ? <span className="block text-[12.5px] text-muted">per person</span> : m.format === "Live workshop" ? <span className="block text-[12.5px] text-muted">per day, up to 10 staff</span> : m.format === "Licence" ? <span className="block text-[12.5px] text-muted">per year</span> : null}</div>
          <span className="btn btn-primary !min-h-[40px] !text-[14px]">See what&apos;s inside →</span>
        </div>
      </div>
    </Link>
  );
}

/** Kit card: the outcome, what's in the box, and the done-for-you price it's anchored against. */
function KitCard({ p }: { p: P }) {
  const m = KIT_META[p.id];
  const build = m?.build ? byId(m.build) : undefined;
  return (
    <Link href={`/p/${p.id}/`} className="card flex flex-col overflow-hidden text-ink no-underline hover:border-ink" data-testid="kit-card">
      <div className="relative flex h-[96px] items-center justify-center bg-[#FFF3E0]"><CatArt cat="DIY kits" size={44} /><span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-ink">DIY kit · download</span></div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="m-0 font-display text-[17px] font-bold leading-tight">{m?.outcome ?? p.name}</h3>
        <span className="text-[13px] text-muted">{p.name.replace(" — DIY kit", "")} · you set it up in your own n8n</span>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[13.5px] text-ink-2">
          {KIT_INSIDE.map((t) => <li key={t} className="flex gap-2"><span aria-hidden className="text-ok">✓</span><span>{t}</span></li>)}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div><b className="text-[22px]">{priceLabel(p)}</b>{build && <span className="block text-[12.5px] text-muted">or done for you: {fmt(build.price)}</span>}</div>
          <span className="btn btn-primary !min-h-[38px] !text-[13.5px]">See the kit →</span>
        </div>
      </div>
    </Link>
  );
}

/** Learners are a different buyer from owners who want it done for them, so they get their own area. */
export default function LearnPage() {
  const courses = PRODUCTS.filter((p) => p.cat === "Courses" && COURSE_META[p.id]);
  const kits = PRODUCTS.filter((p) => p.cat === "DIY kits");
  const featured = FEATURED.map(byId);
  const byTrack = (t: Track) => courses.filter((p) => COURSE_META[p.id].track === t && !FEATURED.includes(p.id));
  return (
    <main className="wrap flex flex-col gap-12 py-12">
      <section className="flex flex-col gap-3">
        <div className="kicker">Learn</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-tight">Learn to automate your own business</h1>
        <p className="m-0 max-w-[720px] text-lg text-ink-2">Every course ends with something running in your business, not a certificate on a wall. Taught by the people who build these automations for clients every week. Prefer it done for you? <Link href="/library/">That&apos;s the main shop.</Link></p>
        <p className="m-0 max-w-[720px] rounded-lg bg-[#FFF3E0] px-3 py-2 text-[14px] text-ink-2"><b>Founding enrolment.</b> Self-paced courses open soon — enrol now at the founding price, full refund any time before your course opens.</p>
      </section>

      <section className="flex flex-col gap-4" data-testid="learn-featured">
        <h2 className="m-0 font-display text-2xl font-bold">Start here</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{featured.map((p) => <CourseCard key={p.id} p={p} big />)}</div>
      </section>

      {(Object.keys(TRACKS) as Track[]).map((t) => {
        const list = byTrack(t);
        if (!list.length) return null;
        return (
          <section key={t} className="flex flex-col gap-4" data-testid={`learn-${t}`}>
            <div><h2 className="m-0 font-display text-2xl font-bold">{TRACKS[t].title}</h2><p className="m-0 mt-1 text-ink-2">{TRACKS[t].blurb}</p></div>
            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${list.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>{list.map((p) => <CourseCard key={p.id} p={p} />)}</div>
          </section>
        );
      })}

      <section className="flex flex-col gap-4" data-testid="learn-kits">
        <div><h2 className="m-0 font-display text-2xl font-bold">DIY kits — the exact workflow we install, for you to set up</h2><p className="m-0 mt-1 text-ink-2">The workflow file, a written guide and 30 days of email help. If you&apos;d rather we did it, the kit price comes off the build.</p></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{kits.map((p) => <KitCard key={p.id} p={p} />)}</div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3" data-testid="learn-promise">
        {[["Built on real work", "Every lesson ends with an automation running in your own business."], ["Taught by builders", "The same team that installs these for clients, using the standards we use on our own live workflows."], ["No lock-in", "Everything runs in your own accounts. Courses are refundable in full before they open."]].map(([h, b]) => (
          <div key={h} className="flex flex-col gap-1"><b>{h}</b><span className="text-[14px] text-ink-2">{b}</span></div>
        ))}
      </section>
    </main>
  );
}
