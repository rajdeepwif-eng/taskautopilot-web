import HeroSearch from "@/components/HeroSearch";
import Link from "next/link";
import Assessment from "@/components/Assessment";
import AppChecker from "@/components/AppChecker";
import { APP_GROUPS, INDUSTRY_APPS } from "@/lib/apps";
import { PRODUCTS } from "@/lib/catalogue";

const RUN_LOG = [
  ["03:45", "Bank reconciliation — lines matched", "ok"],
  ["06:10", "New leads found and checked", "ok"],
  ["06:30", "Today's jobs sent to the team", "ok"],
  ["07:30", "Renewals due → tasks created", "ok"],
  ["09:12", "Inbound enquiry → reply drafted", "review"],
];

const PERSON_VS_AUTOMATION = [
  ["Answers a new enquiry", "Within hours, if free", "In under a minute, 24/7"],
  ["Works", "Office hours, holidays off", "Nights, weekends, every day"],
  ["Follows the process", "Usually — steps get missed when busy", "Every step, every time, with a log"],
  ["Typical cost", "$[25–40] an hour, every hour", "One fixed build + optional monthly plan"],
  ["Best at", "Judgement, relationships, tricky cases", "Repetitive, rules-based, high-volume work"],
];

const PACKAGES = [
  { name: "Never miss a lead", price: "$[2,500]", id: 10, points: ["Web, WhatsApp & social leads in one place", "Instant reply + booking link", "Team alert in 60 seconds", "Live in 10 working days"] },
  { name: "Invoices & bank, done overnight", price: "$[4,950]", id: 21, popular: true, points: ["Supplier bills read & booked", "Nightly bank matching + checker", "Weekly sign-off list for you", "Xero, QuickBooks, Sage or Zoho"] },
  { name: "Paid automation audit", price: "$[499]", id: 0, points: ["Recorded walkthrough of your tools", "Ranked plan: hours saved per workflow", "Fixed quotes for each build", "Fee credited if you build with us"] },
];

const FAQ = [
  ["What do you build on?", "Proven workflow platforms — mainly n8n — plus leading AI models. Everything runs in accounts you own, so you are never locked in."],
  ["Can you connect my app?", "If it has an API, almost certainly. Use the checker above or ask in your setup form."],
  ["Do you need our passwords?", "No. You connect each app with its own secure login that you can switch off at any time."],
  ["What happens if you disappear?", "You keep everything: the workflows, the data and a written handover document. Another builder can pick it up."],
  ["Can a person approve things first?", "Yes. Anything that moves money or messages customers can wait for a one-tap approval."],
  ["What if it breaks?", "Failures alert us straight away. On a Run plan we fix them; without one, fixes are billed at $[150]/hour."],
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="wrap flex flex-wrap items-center gap-12 pt-16 pb-10">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          <div className="kicker">For owner-run businesses of every kind</div>
          <h1 className="font-display m-0 text-[clamp(38px,6vw,56px)] font-bold leading-[1.04] tracking-tight">
            Get found. Get booked. Get paid — while your team gets on with the work.
          </h1>
          <p className="m-0 max-w-[600px] text-xl leading-normal text-ink-2">
            Local SEO, booking websites and AI automations from one team. Pick a package, pay online, and it&apos;s live in 10–15 working days.
          </p>
          <HeroSearch />
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/library/" className="btn btn-primary text-[17px]">Browse &amp; buy automations →</Link>
            <Link href="/planner/" className="font-semibold text-ink">Not sure? Build my plan in 2 minutes →</Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-ink-2">
            <span>✓ Fixed price</span><span>✓ Pay online, no sales call</span><span>✓ You own everything</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-2xl bg-ink p-6 font-mono text-[13px] text-[#E9E7E0]">
          <div className="flex justify-between"><span className="text-[#A9ADB4]">run log · today</span><span className="text-[#7FD1A8]">● live</span></div>
          {RUN_LOG.map(([t, label, st], i) => (
            <div key={t} className={`flex justify-between gap-3 ${i === 0 ? "border-t border-[#2B2E33] pt-3" : ""}`}>
              <span>{t} {label}</span>
              <span className={st === "ok" ? "text-[#7FD1A8]" : "text-amber"}>{st}</span>
            </div>
          ))}
          <div className="border-t border-[#2B2E33] pt-3 text-[#A9ADB4]">Every client gets this view of their own workflows.</div>
        </div>
      </section>

      {/* Proof strip — real figures from our own n8n account (refresh before launch) */}
      <section className="bg-ink text-paper">
        <div className="wrap flex flex-wrap justify-between gap-6 py-8">
          {[
            ["140,000+", "automation runs to date in our own businesses"],
            ["44", "workflows live across the industries we run"],
            ["~200/day", "runs — 0 failures in the last 24 hours"],
            ["100%", "yours — documented handover, no lock-in"],
          ].map(([n, l]) => (
            <div key={l} className="flex-[1_1_200px]">
              <div className="font-display text-[40px] font-bold">{n}</div>
              <div className="text-sm text-[#C9C7C0]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="wrap flex flex-col gap-5 pt-16">
        <h2 className="font-display m-0 text-[40px] font-bold tracking-tight">One team for the whole journey</h2>
        <div className="flex flex-wrap items-stretch gap-3">
          {[
            ["01 · Get found", "Local SEO", "Area pages, Google Business Profile and automatic review requests.", "from $[450]/mo", false],
            ["02 · Get booked", "Booking websites & portals", "Customers price, book and pay online; your team runs the desk from one screen.", "from $[4,500]", false],
            ["03 · Get paid", "AI automations", "Leads answered, bills booked, bank matched, late payers chased.", "from $[600]", true],
          ].map(([k, t, d, p, dark]) => (
            <Link key={k as string} href="/library" className={`flex flex-[1_1_280px] flex-col gap-2.5 rounded-[14px] p-6 no-underline ${dark ? "bg-ink text-paper" : "card text-ink"}`}>
              <span className={`font-mono text-xs uppercase ${dark ? "text-amber" : "text-clay"}`}>{k}</span>
              <span className="font-display text-2xl font-bold">{t}</span>
              <span className={`text-[15px] leading-normal ${dark ? "text-[#C9C7C0]" : "text-ink-2"}`}>{d}</span>
              <span className={`text-sm ${dark ? "text-[#A9ADB4]" : "text-muted"}`}>{p}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Person vs automation */}
      <section className="wrap flex flex-col gap-4 pt-16">
        <h2 className="font-display m-0 text-[clamp(28px,4vw,40px)] font-bold tracking-tight">What automation does that a person can&apos;t — and what stays human</h2>
        <div className="card overflow-hidden">
          <div className="flex flex-wrap font-mono text-xs text-muted">
            <div className="flex-[1_1_200px] px-4 py-3" />
            <div className="flex-[1_1_220px] px-4 py-3">A PERSON DOING IT BY HAND</div>
            <div className="flex-[1_1_220px] bg-clay-soft px-4 py-3 text-clay">AN AUTOMATION</div>
          </div>
          {PERSON_VS_AUTOMATION.map(([a, b, c]) => (
            <div key={a} className="flex flex-wrap border-t border-[#E6E3D9]">
              <div className="flex-[1_1_200px] px-4 py-3.5 font-semibold">{a}</div>
              <div className="flex-[1_1_220px] px-4 py-3.5 text-ink-2">{b}</div>
              <div className="flex-[1_1_220px] bg-clay-soft px-4 py-3.5">{c}</div>
            </div>
          ))}
        </div>
        <p className="m-0 text-[15px] text-ink-2">Automation doesn&apos;t replace your team — it takes the repetitive work so they spend their time on customers and decisions. Every product page shows the value using <b>your</b> hours and costs.</p>
      </section>

      {/* Video */}
      <section className="wrap flex flex-wrap items-center gap-8 pt-16">
        <div className="flex aspect-video min-w-0 flex-[999_1_560px] flex-col items-center justify-center gap-3.5 rounded-2xl bg-ink p-6 text-center text-[#C9C7C0]">
          <span className="flex h-18 w-18 items-center justify-center rounded-full bg-clay">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <div className="font-mono text-[13px] text-[#A9ADB4]">[Explainer video · 45–60 s · captions on]</div>
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
          <h2 className="font-display m-0 text-[34px] font-bold leading-tight">Watch one job go from enquiry to paid — with nobody typing.</h2>
          <Link href="#packages" className="btn btn-primary self-start">Seen enough? Buy a fixed package →</Link>
          <Link href="#assess" className="font-semibold">Not sure which? Take the 2-minute assessment</Link>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="wrap flex flex-col gap-5 pt-16">
        <div className="kicker !text-clay">Skip the call</div>
        <h2 className="font-display m-0 text-[clamp(28px,4vw,40px)] font-bold tracking-tight">Fixed scope. Fixed price. Pay online, we start Monday.</h2>
        <div className="flex flex-wrap gap-4">
          {PACKAGES.map((p) => (
            <div key={p.name} className={`flex flex-[1_1_280px] flex-col gap-3 rounded-[14px] p-6 ${p.popular ? "bg-ink text-paper" : "card"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[19px] font-semibold">{p.name}</div>
                {p.popular && <span className="rounded-xl bg-clay px-2.5 py-1 text-xs text-white">Most popular</span>}
              </div>
              <div className="font-display text-4xl font-bold">{p.price}</div>
              <ul className={`m-0 list-none p-0 text-[15px] leading-relaxed ${p.popular ? "text-[#C9C7C0]" : "text-ink-2"}`}>
                {p.points.map((x) => <li key={x}>✓ {x}</li>)}
              </ul>
              <Link href={`/checkout/?plan=${p.id === 21 ? "invoices" : p.id}`} className={`btn mt-auto ${p.id === 0 ? "btn-outline" : "btn-primary"}`}>{p.id === 0 ? "Buy the audit" : "Buy now — secure checkout"}</Link>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/library" className="btn btn-dark">Browse all {PRODUCTS.length} products — each with a demo video →</Link>
          <Link href="/bespoke" className="btn btn-outline">Need something custom? Build your brief →</Link>
        </div>
      </section>

      {/* Assessment */}
      <section id="assess" className="wrap pt-16"><Assessment /></section>

      {/* Apps */}
      <section className="wrap flex flex-col gap-5 pt-16">
        <h2 className="font-display m-0 text-[36px] font-bold tracking-tight">Works with the tools your industry already trusts</h2>
        <div className="flex flex-wrap gap-2.5">
          {APP_GROUPS.map(([g, apps]) => (
            <div key={g} className="card flex flex-[1_1_260px] flex-col gap-1.5 px-4.5 py-4">
              <div className="font-mono text-xs uppercase text-muted">{g}</div>
              <div className="text-[15px] text-ink-2">{apps.join(" · ")}</div>
            </div>
          ))}
        </div>
        <div className="kicker mt-2">Industry tools</div>
        <div className="flex flex-wrap gap-2.5">
          {INDUSTRY_APPS.map(([g, apps]) => (
            <div key={g} className="flex flex-[1_1_260px] flex-col gap-1.5 rounded-xl bg-ink px-4.5 py-4 text-paper">
              <div className="font-mono text-xs uppercase text-amber">{g}</div>
              <div className="text-[15px] text-[#C9C7C0]">{apps.join(" · ")}</div>
            </div>
          ))}
        </div>
        <AppChecker />
        <p className="m-0 text-[13px] text-muted">Names shown for compatibility only — not partnerships.</p>
      </section>

      {/* FAQ + security */}
      <section className="wrap flex flex-col gap-5 py-16">
        <h2 className="font-display m-0 text-[36px] font-bold tracking-tight">Questions owners ask us</h2>
        <div className="flex flex-wrap gap-3">
          {FAQ.map(([q, a]) => (
            <div key={q} className="card flex flex-[1_1_340px] flex-col gap-1.5 px-5 py-4.5">
              <div className="font-semibold">{q}</div>
              <div className="text-[15px] leading-normal text-ink-2">{a}</div>
            </div>
          ))}
        </div>
        <div id="security" className="flex flex-wrap gap-7 rounded-2xl bg-ink p-7 text-paper">
          <div className="flex flex-[1_1_320px] flex-col gap-2.5">
            <div className="font-mono text-xs text-amber">SECURITY &amp; YOUR DATA</div>
            <div className="font-display text-[26px] font-bold">Your data stays yours</div>
            <div className="text-[15px] leading-relaxed text-[#C9C7C0]">Workflows run on n8n Cloud, with data stored in the EU (Frankfurt, Germany). Encrypted in transit and at rest. Access limited to the apps you approve. Data-processing agreement on request.</div>
          </div>
          <div className="flex flex-[1_1_320px] flex-col gap-2 text-[15px] leading-relaxed text-[#C9C7C0]">
            <b className="text-white">Who else touches your data (sub-processors)</b>
            <span>Workflow hosting — n8n Cloud (EU, Frankfurt)</span>
            <span>AI models — Anthropic, OpenAI, Google, Mistral (only those your workflows use)</span>
            <span>Data tables — Airtable (where used)</span>
            <span>Payments — Stripe</span>
            <Link href="/legal/dpa" className="text-amber">Download our data-processing agreement →</Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <div className="wrap flex flex-wrap items-center justify-between gap-8 py-16">
          <div className="flex flex-[1_1_480px] flex-col gap-3">
            <h2 className="font-display m-0 text-[40px] font-bold">Ready to get your week back?</h2>
            <p className="m-0 text-[17px] text-[#C9C7C0]">Pick a package and pay online — live in 10–15 working days.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="#packages" className="btn btn-primary text-lg">See packages &amp; prices</Link>
            <Link href="/bespoke" className="btn border border-paper text-lg text-paper">Start a bespoke brief</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
