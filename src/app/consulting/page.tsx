import type { Metadata } from "next";
import Link from "next/link";
import AuditForm from "./AuditForm";

export const metadata: Metadata = { title: "Consulting for larger teams — TaskAutopilot" };

const STEPS = [
  { n: "STEP 1 · AUDIT & ROADMAP", t: "Find the hours", d: "Interviews with each team, process maps, and every task ranked by hours saved and payback — with a fixed quote for each build.", m: "1–3 weeks · report, roadmap, quotes", p: "$[5,000–15,000]", s: "Credited against the build if you go ahead", hl: true },
  { n: "STEP 2 · IMPLEMENTATION", t: "Build it inside your business", d: "We build in your own accounts and systems — CRM, ERP, accounts, ops — with approval steps, testing and documentation.", m: "4–12 weeks · phased go-lives", p: "$[10,000–50,000]", s: "Per phase, fixed price" },
  { n: "STEP 3 · TEAM ENABLEMENT", t: "Train your people to run it", d: "Hands-on workshops on your own workflows, plus done-with-you builds so your team can create the next automations themselves.", m: "1-day workshops or 6-week programmes · up to 10 people", p: "$[3,500] / day", s: "Programme: $[7,500–12,000]" },
  { n: "STEP 4 · FRACTIONAL HEAD OF AUTOMATION", t: "Keep it improving", d: "A senior lead who owns your automation roadmap: monthly priorities, new builds, monitoring and a board-ready results report.", m: "Monthly · cancel with 30 days' notice", p: "$[3,000–10,000] / mo", s: "", dark: true },
];

export default function ConsultingPage() {
  return (
    <main>
      <section className="wrap flex flex-wrap items-end gap-10 pb-10 pt-16">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <div className="kicker">CONSULTING · FOR TEAMS OF 10 TO 500</div>
          <h1 className="m-0 font-display text-[clamp(36px,5vw,54px)] leading-[1.05] tracking-tight">We find what to automate, build it inside your business, and train your team to run it.</h1>
          <p className="m-0 max-w-[640px] text-[19px] leading-normal text-ink-2">For companies with several sites, departments or systems — where off-the-shelf packages are not enough and you want it done properly, once.</p>
        </div>
        <div className="flex flex-[1_1_300px] flex-col gap-2.5 rounded-2xl bg-ink p-6 text-paper">
          <div className="font-mono text-xs text-amber">HOW CLIENTS USUALLY START</div>
          <div className="text-base">Audit → Build → Train → Run</div>
          <div className="text-sm opacity-80">Fixed price at every step. Stop after any step and keep everything.</div>
        </div>
      </section>

      <section className="wrap flex flex-wrap gap-3.5 pb-16">
        {STEPS.map((x) => (
          <div key={x.n} className={`flex flex-[1_1_260px] flex-col gap-2.5 rounded-[14px] p-6 ${x.dark ? "bg-ink text-paper" : x.hl ? "border-2 border-clay bg-white" : "border border-line bg-white"}`}>
            <div className={`font-mono text-xs ${x.hl ? "text-clay" : x.dark ? "text-amber" : "text-muted"}`}>{x.n}</div>
            <div className="font-display text-2xl font-bold">{x.t}</div>
            <div className={`text-[15px] leading-relaxed ${x.dark ? "opacity-80" : "text-ink-2"}`}>{x.d}</div>
            <div className={`text-sm ${x.dark ? "opacity-70" : "text-muted"}`}>{x.m}</div>
            <div className={`mt-auto font-display text-[26px] font-bold ${x.dark ? "text-amber" : ""}`}>{x.p}</div>
            {x.s && <div className={`text-[13px] ${x.hl ? "text-ok" : "text-muted"}`}>{x.s}</div>}
          </div>
        ))}
      </section>

      <section className="border-y border-line bg-[#ECEAE2]">
        <div className="wrap flex flex-wrap gap-8 py-14">
          <div className="flex flex-[1_1_340px] flex-col gap-3">
            <h2 className="m-0 font-display text-[32px]">Right for you if…</h2>
            <ul className="m-0 list-none p-0 leading-loose"><li>✓ You have 10+ staff or more than one site</li><li>✓ Work moves between several systems by hand</li><li>✓ You want a plan before you spend</li><li>✓ You want your team to own it afterwards</li></ul>
          </div>
          <div className="flex flex-[1_1_340px] flex-col gap-3">
            <h2 className="m-0 font-display text-[32px]">What you always get</h2>
            <ul className="m-0 list-none p-0 leading-loose"><li>✓ Fixed price before each step</li><li>✓ Built in accounts you own — no lock-in</li><li>✓ Approval steps on money and customer messages</li><li>✓ Written handover and a live results panel</li></ul>
          </div>
        </div>
      </section>

      <section id="audit" className="wrap flex flex-wrap gap-10 py-16">
        <div className="flex flex-[1_1_340px] flex-col gap-3.5">
          <h2 className="m-0 font-display text-[38px] leading-tight">Book an audit</h2>
          <p className="m-0 text-[17px] text-ink-2">Tell us about your business. We reply within one working day with a proposed scope, fixed audit price and a call time.</p>
          <div className="text-sm text-muted">Prefer to start small? <Link href="/library/">Browse ready-made automations</Link> or <Link href="/bespoke/">send a bespoke brief</Link>.</div>
        </div>
        <div className="card min-w-0 flex-[1_1_460px] p-7">
          <AuditForm />
        </div>
      </section>
    </main>
  );
}
