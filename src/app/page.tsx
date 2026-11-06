import type { Metadata } from "next";
import PhotoStory from "@/components/PhotoStory";
import ServicesView from "@/components/ServicesView";
import { alternates, seoTitle } from "@/lib/geo";
import HeroSearch from "@/components/HeroSearch";
import TradeGrid from "@/components/TradeGrid";
import heroImg from "@/assets/hero.jpg";
import OwnAutomations from "@/components/OwnAutomations";
import Link from "next/link";
import { HERO_VIDEO_URL, PAYMENTS_LIVE } from "@/lib/launch";
import { AskButton, ProblemButtons } from "@/components/FrontDoor";
import AppChecker from "@/components/AppChecker";
import { APP_GROUPS } from "@/lib/apps";
import { PRODUCTS, byId, fmt } from "@/lib/catalogue";
import { SRCSET } from "@/lib/srcset";
import SwitchOn from "@/components/SwitchOn";

const RUN_LOG = [
  ["03:45", "Bank reconciliation — lines matched", "ok"],
  ["06:10", "New leads found and checked", "ok"],
  ["06:30", "Today's jobs sent to the team", "ok"],
  ["07:30", "Renewals due → tasks created", "ok"],
  ["09:12", "Inbound inquiry → reply drafted", "review"],
];

const PACKAGES = [
  { name: "Try one automation", price: "$99", href: "/starter/", cta: "Pick yours", points: ["Missed calls, reviews, invoices to Excel and more", "Set up for you, runs for 30 days", "$99 credited if you upgrade", "Live in 5 business days"] },
  { name: "Never miss a lead", price: fmt(byId(10).price), href: "/checkout/?plan=10", cta: PAYMENTS_LIVE ? "Buy now" : "Reserve now", popular: true, points: ["Web, WhatsApp & social leads in one place", "Instant reply + booking link", "Team alert in 60 seconds", "Live in about 2 weeks"] },
  { name: "Paid automation audit", price: "$499", href: "/checkout/?plan=0", cta: "Buy the audit", points: ["Recorded walkthrough of your tools", "Ranked plan: hours saved per workflow", "Fixed quotes for each build", "Fee credited if you build with us"] },
];

const FAQ = [
  ["What do you build on?", "Proven workflow platforms — mainly n8n — plus leading AI models. Everything runs in accounts you own, so you are never locked in."],
  ["Can you connect my app?", "If it has an API, almost certainly. Use the checker above or ask in your setup form."],
  ["Do you need our passwords?", "No. You connect each app with its own secure login that you can switch off at any time."],
  ["What happens if you disappear?", "You keep everything: the workflows, the data and a written handover document. Another builder can pick it up."],
  ["Can a person approve things first?", "Yes. Anything that moves money or messages customers can wait for a one-tap approval."],
  ["What if it breaks?", "Anything we built that breaks is fixed free for 90 days. After that, fixes and monitoring come with a support plan; small changes are free for 14 days, then fixed-price from $150."],
  ["Who pays for running it?", "You do, directly and at cost — the automation platform (usually about €20 a month), plus texts, AI or call minutes where a build uses them. The accounts are in your name; we never mark them up."],
  ["What if my business works differently?", "Every product is an example. We tailor the steps, rules and apps to how you already work — tell the assistant or book a free 20-minute call."],
];

export const metadata: Metadata = {
  title: seoTitle("Done-for-you automation for small businesses"),
  description: "Fixed-price automations that get small businesses paid, booked and followed up: missed-call text-back, invoice reminders, reviews. Most live in 1–3 weeks.",
  alternates: alternates("/", "us"),
};

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
      <div className="wrap relative flex flex-wrap items-center gap-10 pt-10 pb-12">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          <div className="kicker">Everyday tasks, automated for you · built by business owners</div>
<h1 className="font-display m-0 text-[clamp(38px,6vw,56px)] font-bold leading-[1.04] tracking-tight">
            <span className="inline-flex items-center gap-3"><SwitchOn size={44} />Switch on.</span><br />Get your time back.
          </h1>
          <p className="m-0 max-w-[600px] text-xl leading-normal text-ink-2">
            Tell us what you want to stop doing by hand. We show you how it would work, the fixed price, and build it around the way you already work — most live in 1–3 weeks.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {HERO_VIDEO_URL ? <video src={HERO_VIDEO_URL} poster={heroImg.src} autoPlay muted loop playsInline aria-hidden="true" className="aspect-[3/2] w-full rounded-lg object-cover lg:hidden" /> : <img src={heroImg.src} srcSet={SRCSET.hero} sizes="100vw" fetchPriority="high" alt="" aria-hidden="true" className="aspect-[3/2] w-full rounded-lg object-cover lg:hidden" />}
          <div className="-mt-3 lg:hidden"><PhotoStory slug="hero" /></div>
          <div className="flex flex-wrap items-center gap-4">
            <AskButton />
            <Link href="#trades" className="btn btn-outline">Show me fixes for my business</Link>
          </div>
          <HeroSearch />
          <div className="flex flex-wrap gap-4 text-sm text-ink-2">
            <span>✓ Fixed price</span><span>✓ Pay up front, monthly or from results</span><span>✓ Approve the test run or full refund</span>{PAYMENTS_LIVE && <span>✓ Secure Stripe checkout</span>}<span>✓ You own everything</span>
          </div>
          <Link href="/starter/" className="flex max-w-[620px] items-center justify-between gap-3 rounded-xl border-2 border-clay bg-white/90 px-4 py-3 text-ink no-underline">
            <span><b>New here? Try one automation for $99.</b> <span className="text-ink-2">Set up for you, runs 30 days, $99 credited if you upgrade.</span></span>
            <span className="whitespace-nowrap font-semibold text-clay">Pick yours →</span>
          </Link>
        </div>
        <div className="hidden min-w-0 flex-[1_1_380px] lg:block">
          {HERO_VIDEO_URL ? (
            <video src={HERO_VIDEO_URL} poster={heroImg.src} autoPlay muted loop playsInline aria-label="Short animation: 24 hours in a business. AI agents check vans on site at dawn, chase invoices in the office, reorder stock on the factory floor, and answer a missed call while the owner is at home" className="aspect-[3/2] w-full rounded-lg object-cover shadow-[0_2px_10px_rgba(15,17,17,0.15)]" data-testid="hero-video" />
          ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={heroImg.src} srcSet={SRCSET.hero} sizes="(min-width: 1024px) 560px, 1px" width={heroImg.width} height={heroImg.height} alt="A plumber works under a sink while his phone shows tomorrow's diary: Dave's 9:00 job, added by the AI assistant after a missed call" className="aspect-[3/2] w-full rounded-lg object-cover shadow-[0_2px_10px_rgba(15,17,17,0.15)]" />
          )}
          {!HERO_VIDEO_URL && <PhotoStory slug="hero" />}
        </div>
      </div>
      </section>

      <ProblemButtons />

      <TradeGrid />

      <ServicesView compact />

      {/* Packages */}
      <section id="packages" className="wrap flex flex-col gap-5 pt-16">
        <div className="kicker">Skip the sales call</div>
        <h2 className="font-display m-0 text-[clamp(28px,4vw,36px)] font-bold tracking-tight">Start small. Fixed price. Pay online.</h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {PACKAGES.map((p) => (
            <div key={p.name} className={`flex min-w-[82%] shrink-0 snap-center flex-[1_1_280px] flex-col sm:min-w-0 sm:shrink ${p.popular ? "order-first sm:order-none" : ""} gap-3 rounded-[14px] p-6 ${p.popular ? "bg-ink text-paper" : "card"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[19px] font-semibold">{p.name}</div>
                {p.popular && <span className="rounded-xl bg-clay px-2.5 py-1 text-xs text-white">Our pick</span>}
              </div>
              <div className="font-display text-4xl font-bold">{p.price}</div>
              <ul className={`m-0 list-none p-0 text-[15px] leading-relaxed ${p.popular ? "text-[#C9C7C0]" : "text-ink-2"}`}>
                {p.points.map((x) => <li key={x}>✓ {x}</li>)}
              </ul>
              <Link href={p.href} className={`btn mt-auto ${p.popular ? "btn-primary" : "btn-outline"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/library" className="btn btn-dark">Browse the full catalog ({PRODUCTS.length}) →</Link>
          <AskButton label="Not sure? Tell us what you need" className="btn btn-outline" />
        </div>
      </section>

      <p className="wrap m-0 pt-6 text-[15px] text-ink-2">Prefer to spread the cost? <Link href="/ways-to-pay/">Monthly, finance and other ways to pay →</Link></p>

      <div className="pt-16"><OwnAutomations /></div>

      {/* Apps */}
      <section className="wrap flex flex-col gap-4 pt-16">
        <h2 className="font-display m-0 text-[clamp(28px,4vw,36px)] font-bold tracking-tight">Works with the tools you already use</h2>
        <p className="m-0 max-w-[900px] text-[16px] leading-relaxed text-ink-2">{APP_GROUPS.flatMap(([, apps]) => apps).slice(0, 24).join(" · ")} — and anything else with an API.</p>
        <AppChecker />
        <p className="m-0 text-[13px] text-muted">Names shown for compatibility only — not partnerships.</p>
      </section>

      {/* FAQ + security */}
      <section className="wrap flex flex-col gap-5 py-16">
        <h2 className="font-display m-0 text-[clamp(28px,4vw,36px)] font-bold tracking-tight">Questions owners ask us</h2>
        <div className="flex flex-wrap gap-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card flex-[1_1_340px] self-start px-5 py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <div className="mt-1.5 text-[15px] leading-normal text-ink-2">{a}</div>
            </details>
          ))}
        </div>
        <div id="security" className="flex flex-col gap-2 rounded-2xl bg-ink p-6 text-paper">
          <div className="font-display text-[22px] font-bold">Your data stays yours</div>
          <div className="text-[15px] leading-relaxed text-[#C9C7C0]">Encrypted in transit and at rest, hosted in the EU (Frankfurt), and you own every account. Access is limited to the apps you approve.</div>
          <details className="text-[14px] text-[#C9C7C0]">
            <summary className="cursor-pointer text-amber">Who else touches your data</summary>
            <div className="mt-2 flex flex-col gap-1">
              <span>Workflow hosting — n8n Cloud (EU, Frankfurt)</span>
              <span>AI models — Anthropic, OpenAI, Google, Mistral (only those your workflows use)</span>
              <span>Data tables — Airtable (where used)</span>
              <span>Payments — Stripe</span>
            </div>
          </details>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <div className="wrap flex flex-wrap items-center justify-between gap-8 py-16">
          <div className="flex flex-[1_1_480px] flex-col gap-3">
            <h2 className="font-display m-0 text-[clamp(28px,4vw,40px)] font-bold">Ready to get your week back?</h2>
            <p className="m-0 text-[17px] text-[#C9C7C0]">Pick your fix, pay online, approve the test run — most live in 1–3 weeks.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="#trades" className="btn btn-primary text-lg">See fixes for my business</Link>
            <AskButton label="Not sure? Tell us what you need" className="btn border border-paper text-lg text-paper" />
          </div>
        </div>
      </section>
    </main>
  );
}
