"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { byId, fmt, runLow } from "@/lib/catalogue";
import { savePlan } from "@/lib/plan";

/* ---------- Who is buying ---------- */
const SIZES = [
  { id: "solo", label: "Just me", sub: "Self-employed" },
  { id: "small", label: "2–9 people", sub: "Owner-run team" },
  { id: "mid", label: "10–50 people", sub: "Several roles or sites" },
  { id: "large", label: "50+ people", sub: "Departments & systems" },
] as const;
type Size = (typeof SIZES)[number]["id"];

const PRESETS: { id: string; label: string; tasks: string[] }[] = [
  { id: "trades", label: "Trades & home services", tasks: ["calls", "enquiries", "quotes", "invoicing", "scheduling", "reviews"] },
  { id: "hire", label: "Equipment hire", tasks: ["calls", "enquiries", "bookings", "invoicing", "safety", "bank"] },
  { id: "clinic", label: "Clinic or dental", tasks: ["calls", "patients", "reviews", "bank"] },
  { id: "food", label: "Restaurant or food business", tasks: ["reservations", "bills", "staff", "safety", "reviews"] },
  { id: "insurance", label: "Insurance agency", tasks: ["quotesIns", "calls", "intake", "claims"] },
  { id: "law", label: "Law or accounting firm", tasks: ["enquiries", "intake", "calls", "invoicing"] },
  { id: "property", label: "Property investing & management", tasks: ["deals", "refurb", "tenants", "calls", "invoicing", "bank"] },
  { id: "construction", label: "Construction or manufacturing", tasks: ["safety", "forms", "scheduling", "bills", "invoicing"] },
  { id: "foodfactory", label: "Food production (BRCGS)", tasks: ["haccp", "trace", "bills", "staff", "excel"] },
  { id: "farm", label: "Farm", tasks: ["assurance", "fieldtasks", "spray", "timesheets", "invoicing", "translate"] },
  { id: "office", label: "Office / admin team", tasks: ["office", "enquiries", "invoicing", "delegate"] },
  { id: "other", label: "Something else", tasks: ["enquiries", "invoicing", "forms"] },
];

/* ---------- Where the time goes: each task maps to the product that takes it on ---------- */
type Task = { id: string; label: string; hours: number; rate: number; product: number; solo?: number; lead?: boolean };
const TASKS: Task[] = [
  { id: "calls", label: "Answering the phone", hours: 8, rate: 18, product: 7, solo: 40, lead: true },
  { id: "enquiries", label: "Replying to web, email & WhatsApp enquiries", hours: 5, rate: 18, product: 10, solo: 40, lead: true },
  { id: "quotes", label: "Chasing quotes that went quiet", hours: 3, rate: 35, product: 13 },
  { id: "bookings", label: "Taking bookings and payments", hours: 6, rate: 18, product: 4 },
  { id: "scheduling", label: "Scheduling jobs and staff", hours: 6, rate: 24, product: 26 },
  { id: "invoicing", label: "Sending invoices & chasing late payers", hours: 4, rate: 22, product: 22, solo: 41 },
  { id: "bills", label: "Typing in supplier bills", hours: 4, rate: 23, product: 21, solo: 42 },
  { id: "bank", label: "Bank reconciliation", hours: 3, rate: 23, product: 23 },
  { id: "receipts", label: "Receipts & expenses", hours: 2, rate: 23, product: 24, solo: 42 },
  { id: "questions", label: "Answering 'where's my order / booking?'", hours: 6, rate: 22, product: 8 },
  { id: "reviews", label: "Asking for reviews & replying", hours: 2, rate: 30, product: 15, solo: 43 },
  { id: "social", label: "Posting on social media", hours: 3, rate: 36, product: 17 },
  { id: "staff", label: "Onboarding staff & rotas", hours: 3, rate: 24, product: 30 },
  { id: "intake", label: "Collecting client forms & documents", hours: 4, rate: 27, product: 32 },
  { id: "reservations", label: "Reservations & no-shows", hours: 5, rate: 18, product: 35 },
  { id: "patients", label: "Patient booking, reminders & intake forms", hours: 8, rate: 22, product: 33 },
  { id: "tenants", label: "Tenant & maintenance requests", hours: 6, rate: 22, product: 34 },
  { id: "quotesIns", label: "Insurance quotes & renewals", hours: 10, rate: 24, product: 45 },
  { id: "claims", label: "Claims intake paperwork", hours: 20, rate: 24, product: 46 },
  { id: "reporting", label: "Pulling numbers together for reports", hours: 3, rate: 30, product: 25 },
  { id: "brief", label: "Checking every app to see what needs me", hours: 5, rate: 60, product: 49 },
  { id: "team", label: "Checking my team's or assistant's progress", hours: 4, rate: 60, product: 50 },
  { id: "delegate", label: "Delegating jobs and chasing staff for updates", hours: 5, rate: 60, product: 62 },
  { id: "research", label: "Researching before decisions", hours: 3, rate: 60, product: 51 },
  { id: "excel", label: "Typing invoices or documents into Excel", hours: 4, rate: 21, product: 68 },
  { id: "whatsapp", label: "Answering WhatsApp messages", hours: 5, rate: 18, product: 64, lead: true },
  { id: "translate", label: "Translating messages and documents", hours: 2, rate: 25, product: 67 },
  { id: "timesheets", label: "Checking timesheets and who turned up", hours: 3, rate: 24, product: 79 },
  { id: "cctv", label: "Watching CCTV or checking the site after hours", hours: 3, rate: 20, product: 80 },
  { id: "haccp", label: "Food safety records & audit prep (HACCP / BRCGS)", hours: 6, rate: 24, product: 81 },
  { id: "trace", label: "Batch records & traceability", hours: 4, rate: 24, product: 82 },
  { id: "fieldtasks", label: "Planning and checking farm field work", hours: 5, rate: 20, product: 87 },
  { id: "spray", label: "Spray, fertiliser & input records", hours: 2, rate: 20, product: 88 },
  { id: "office", label: "Office admin: inbox, filing, meeting actions", hours: 8, rate: 22, product: 92 },
  { id: "inbox", label: "Reading, sorting and replying to email", hours: 7, rate: 22, product: 96 },
  { id: "checklists", label: "Chasing checklists and getting defects fixed", hours: 4, rate: 24, product: 97 },
  { id: "maintenance", label: "Planning site and machine maintenance", hours: 3, rate: 26, product: 98 },
  { id: "sops", label: "Writing and updating SOPs", hours: 3, rate: 40, product: 54 },
  { id: "trackers", label: "Updating trackers and spreadsheets by hand", hours: 4, rate: 22, product: 99 },
  { id: "training", label: "Training staff and keeping training records", hours: 4, rate: 30, product: 100 },
  { id: "goals", label: "Setting goals and tracking the plan each week", hours: 3, rate: 60, product: 101 },
  { id: "epr", label: "Preparing staff performance reviews", hours: 2, rate: 40, product: 107 },
  { id: "recruit", label: "Recruiting: reading CVs and booking interviews", hours: 4, rate: 30, product: 110 },
  { id: "ea", label: "Diary, meeting agendas, notes and prep", hours: 6, rate: 37, product: 111 },
  { id: "payroll", label: "Preparing payroll: hours, overtime, leave", hours: 3, rate: 25, product: 112 },
  { id: "vehicle", label: "Vehicle & machine daily checks on paper", hours: 3, rate: 22, product: 113 },
  { id: "stock", label: "Tracking stock in and out", hours: 4, rate: 20, product: 27 },
  { id: "p2p", label: "Matching orders, deliveries and invoices", hours: 4, rate: 23, product: 115 },
  { id: "assurance", label: "Farm assurance audit prep (Red Tractor / GLOBALG.A.P.)", hours: 4, rate: 22, product: 116 },
  { id: "deals", label: "Searching and analysing property deals", hours: 6, rate: 40, product: 117 },
  { id: "refurb", label: "Managing renovation projects", hours: 5, rate: 35, product: 119 },
  { id: "audit", label: "Checking the business is compliant & on track each month", hours: 3, rate: 60, product: 134 },
  { id: "kpi", label: "Working out stock, KPIs and cost per product", hours: 4, rate: 30, product: 136 },
  { id: "finreport", label: "Building monthly financial reports", hours: 4, rate: 35, product: 137 },
  { id: "docs", label: "Turning paper forms into something usable", hours: 2, rate: 22, product: 135 },
  { id: "safety", label: "Safety checks, inspections & fixing failed items", hours: 4, rate: 24, product: 47 },
  { id: "forms", label: "Retyping answers from Google / Microsoft forms", hours: 3, rate: 21, product: 48 },
];

type State = {
  size: Size;
  preset: string;
  picked: string[];
  hours: Record<string, number>;
  rate: Record<string, number>;
  share: number; // % of the task the automation takes on (estimate, editable)
  missed: number; // missed calls/enquiries a week
  jobValue: number; // average job value
  winRate: number; // % of those that would have become a job
  budget: number;
};

const DEFAULT: State = {
  size: "small", preset: "trades", picked: PRESETS[0].tasks, hours: {}, rate: {},
  share: 70, missed: 5, jobValue: 400, winRate: 30, budget: 10000,
};

function encode(s: State) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(s)))); } catch { return ""; }
}
function decode(h: string): State | null {
  try { return { ...DEFAULT, ...JSON.parse(decodeURIComponent(escape(atob(h)))) }; } catch { return null; }
}

function Num({ label, value, onChange, prefix, suffix, min = 0, step = 1 }: { label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; min?: number; step?: number }) {
  return (
    <label className="flex flex-col gap-1 text-[13px] text-ink-2">
      {label}
      <span className="flex items-center gap-1 rounded-lg border border-[#C9C5B9] bg-white px-2.5 focus-within:border-ink">
        {prefix && <span className="text-muted">{prefix}</span>}
        <input type="number" min={min} step={step} value={value} onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="w-full min-w-0 !border-0 !bg-transparent !px-0 !py-2 text-[15px] !shadow-none !outline-none" />
        {suffix && <span className="whitespace-nowrap text-muted">{suffix}</span>}
      </span>
    </label>
  );
}

export default function PlannerClient() {
  const [s, setS] = useState<State>(DEFAULT);
  const [copied, setCopied] = useState(false);
  const set = (p: Partial<State>) => setS((x) => ({ ...x, ...p }));

  useEffect(() => {
    const h = window.location.hash.slice(1);
    const d = h ? decode(h) : null;
    if (d) setS(d);
  }, []);

  const solo = s.size === "solo";
  const rows = useMemo(() => {
    const seen = new Set<number>();
    return s.picked
      .map((id) => TASKS.find((t) => t.id === id)!)
      .filter(Boolean)
      .map((t) => {
        const pid = solo && t.solo ? t.solo : t.product;
        const p = byId(pid);
        const hours = s.hours[t.id] ?? t.hours;
        const rate = s.rate[t.id] ?? (p.wage ? Math.round(p.wage / 2080) : t.rate);
        const timeYear = hours * 52 * rate * (s.share / 100);
        const revenueYear = t.lead ? s.missed * 52 * s.jobValue * (s.winRate / 100) * (s.share / 100) : 0;
        const firstYearCost = p.monthly ? p.price * 12 : p.price + runLow(p) * 12;
        const yearly = timeYear + revenueYear;
        const paybackWeeks = yearly > 0 ? Math.ceil(firstYearCost / (yearly / 52)) : 999;
        return { t, p, hours, rate, timeYear, revenueYear, yearly, firstYearCost, paybackWeeks };
      })
      .filter((r) => (seen.has(r.p.id) ? false : (seen.add(r.p.id), true)))
      .sort((a, b) => a.paybackWeeks - b.paybackWeeks);
  }, [s, solo]);

  // Fit the best-payback items inside the budget (one-off spend).
  let spent = 0;
  const chosen = rows.filter((r) => {
    const cost = r.p.monthly ? 0 : r.p.price;
    if (spent + cost > s.budget) return false;
    spent += cost;
    return true;
  });
  const later = rows.filter((r) => !chosen.includes(r));
  const oneOff = chosen.filter((r) => !r.p.monthly).reduce((a, r) => a + r.p.price, 0);
  const discount = chosen.length >= 3 ? oneOff * 0.1 : 0;
  const monthly = chosen.filter((r) => r.p.monthly).reduce((a, r) => a + r.p.price, 0);
  const yearly = chosen.reduce((a, r) => a + r.yearly, 0);
  const hoursBack = chosen.reduce((a, r) => a + r.hours * (s.share / 100), 0);
  const runYear = chosen.reduce((a, r) => a + (r.p.monthly ? 0 : runLow(r.p) * 12), 0);
  const cost1 = oneOff - discount + monthly * 12 + runYear;
  const payback = yearly > 0 ? Math.ceil(cost1 / (yearly / 52)) : 0;
  const phases = [chosen.slice(0, 2), chosen.slice(2, 4), chosen.slice(4)];
  const ids = chosen.map((r) => r.p.id);
  const hasLead = s.picked.some((id) => TASKS.find((t) => t.id === id)?.lead);

  const shareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${encode(s)}`;
    try { navigator.clipboard.writeText(url); } catch { /* clipboard blocked */ }
    window.history.replaceState(null, "", `#${encode(s)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main>
      <section className="wrap flex flex-col gap-3 pb-6 pt-12">
        <div className="kicker">Automation planner · 2 minutes</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.05] tracking-tight">
          See what to automate first, what it costs, and when it pays for itself.
        </h1>
        <p className="m-0 max-w-[720px] text-lg text-ink-2">Pick where your time goes. We rank every automation by payback, fit it to your budget and lay out a 90-day rollout you can buy in one click.</p>
      </section>

      <div className="wrap flex flex-wrap items-start gap-8 pb-20">
        {/* ---------- Inputs ---------- */}
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
          <div className="card flex flex-col gap-3 p-5">
            <div className="font-semibold">1 · How big is your team?</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SIZES.map((z) => (
                <button key={z.id} type="button" onClick={() => set({ size: z.id })} aria-pressed={s.size === z.id}
                  className={`flex min-h-[64px] cursor-pointer flex-col items-start justify-center rounded-[10px] px-3 text-left ${s.size === z.id ? "border-2 border-clay bg-clay-soft" : "border border-[#C9C5B9] bg-white"}`}>
                  <span className="font-semibold">{z.label}</span><span className="text-[12px] text-muted">{z.sub}</span>
                </button>
              ))}
            </div>
            {solo && <div className="text-[13px] text-ok">✓ Showing Solo versions — same automations, priced for one person.</div>}
          </div>

          <div className="card flex flex-col gap-3 p-5">
            <div className="font-semibold">2 · What kind of business?</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.id} type="button" onClick={() => set({ preset: p.id, picked: p.tasks })} aria-pressed={s.preset === p.id}
                  className={`min-h-[40px] cursor-pointer rounded-full border px-3.5 text-sm ${s.preset === p.id ? "border-ink bg-ink text-white" : "border-[#C9C5B9] bg-white"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold">3 · Where does the time go each week?</div>
              <div className="text-[12px] text-muted">Hourly cost starts at the US median for that role (BLS) — change it to yours.</div>
            </div>
            <div className="flex flex-col divide-y divide-line">
              {TASKS.map((t) => {
                const on = s.picked.includes(t.id);
                const p = byId(solo && t.solo ? t.solo : t.product);
                return (
                  <div key={t.id} className="flex flex-wrap items-center gap-3 py-2.5">
                    <label className="flex min-w-0 flex-[1_1_240px] cursor-pointer items-center gap-2.5">
                      <input type="checkbox" checked={on} className="h-4 w-4 accent-[#B23A0B]"
                        onChange={() => set({ picked: on ? s.picked.filter((x) => x !== t.id) : [...s.picked, t.id] })} />
                      <span className={on ? "font-medium" : "text-ink-2"}>{t.label}</span>
                    </label>
                    {on && (
                      <div className="flex flex-[1_1_220px] gap-2">
                        <Num label="Hours / week" value={s.hours[t.id] ?? t.hours} onChange={(n) => set({ hours: { ...s.hours, [t.id]: n } })} />
                        <Num label="Cost / hour" prefix="$" value={s.rate[t.id] ?? (p.wage ? Math.round(p.wage / 2080) : t.rate)} onChange={(n) => set({ rate: { ...s.rate, [t.id]: n } })} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {hasLead && (
            <div className="card flex flex-col gap-3 border-2 border-amber p-5">
              <div className="font-semibold">4 · The money you don&apos;t see: missed enquiries</div>
              <div className="text-[14px] text-ink-2">Time saved is only half of it. Enquiries that go unanswered are jobs that go elsewhere.</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Num label="Missed calls / enquiries a week" value={s.missed} onChange={(n) => set({ missed: n })} />
                <Num label="Average job value" prefix="$" value={s.jobValue} onChange={(n) => set({ jobValue: n })} />
                <Num label="% that would have booked" suffix="%" value={s.winRate} onChange={(n) => set({ winRate: Math.min(100, n) })} />
              </div>
              <div className="text-[14px]">
                Missed work today: <b>{fmt(s.missed * 52 * s.jobValue * (s.winRate / 100))}/yr</b> on your numbers.
              </div>
            </div>
          )}

          <div className="card flex flex-col gap-3 p-5">
            <div className="font-semibold">{hasLead ? "5" : "4"} · Budget & assumptions</div>
            <label className="flex flex-col gap-1.5 text-sm">
              Budget to start with: <b className="text-lg">{fmt(s.budget)}</b>
              <input type="range" min={500} max={50000} step={500} value={s.budget} onChange={(e) => set({ budget: Number(e.target.value) })} className="accent-[#B23A0B]" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Share of each task the automation takes on: <b>{s.share}%</b>
              <input type="range" min={30} max={95} step={5} value={s.share} onChange={(e) => set({ share: Number(e.target.value) })} className="accent-[#B23A0B]" />
              <span className="text-[12px] text-muted">Our planning estimate, not a promise — a person still checks and handles exceptions. Lower it to be cautious.</span>
            </label>
          </div>
        </div>

        {/* ---------- Result ---------- */}
        <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-4 lg:sticky lg:top-4">
          <div className="flex flex-col gap-4 rounded-2xl bg-ink p-6 text-paper">
            <div className="font-display text-2xl font-bold">Your plan</div>
            {chosen.length === 0 ? (
              <div className="text-[#C9C7C0]">Tick at least one task, or raise the budget.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-[12px] text-[#A9ADB4]">Value a year</div><div className="font-display text-[28px] font-bold text-amber">{fmt(yearly)}</div></div>
                  <div><div className="text-[12px] text-[#A9ADB4]">Pays back in</div><div className="font-display text-[28px] font-bold">{payback} wk{payback === 1 ? "" : "s"}</div></div>
                  <div><div className="text-[12px] text-[#A9ADB4]">Hours back a week</div><div className="font-display text-xl font-bold">{Math.round(hoursBack)}</div></div>
                  <div><div className="text-[12px] text-[#A9ADB4]">First-year cost incl. run plans</div><div className="font-display text-xl font-bold">{fmt(cost1)}</div></div>
                </div>
                <div className="flex flex-col gap-3 border-t border-[#2B2E33] pt-3">
                  {phases.map((ph, i) => ph.length > 0 && (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="font-mono text-[11px] text-amber">{["WEEKS 1–3 · QUICKEST PAYBACK", "WEEKS 4–8", "WEEKS 9–12"][i]}</div>
                      {ph.map((r) => (
                        <div key={r.p.id} className="flex items-start justify-between gap-3 text-[14px]">
                          <span>{r.p.name}<span className="block text-[12px] text-[#A9ADB4]">{r.t.label} · pays back in {r.paybackWeeks} wks</span></span>
                          <span className="whitespace-nowrap font-mono">{r.p.monthly ? `${fmt(r.p.price)}/mo` : fmt(r.p.price)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {discount > 0 && <div className="text-[14px] text-[#7FD1A8]">Includes 10% off for 3+ items: −{fmt(discount)}</div>}
                <Link href={`/checkout/?plan=${ids.join(",")}`} onClick={() => savePlan(ids)} className="btn btn-primary">Buy this plan — {fmt(oneOff - discount)}{monthly ? ` + ${fmt(monthly)}/mo` : ""}</Link>
                <button type="button" onClick={shareLink} className="btn border border-paper bg-transparent text-paper">
                  {copied ? "✓ Link copied — send it to your partner or accountant" : "Copy a link to this plan"}
                </button>
              </>
            )}
          </div>

          {later.length > 0 && (
            <div className="card flex flex-col gap-2 p-5">
              <div className="font-semibold">Next, when budget allows</div>
              {later.map((r) => (
                <div key={r.p.id} className="flex justify-between gap-3 text-[14px]">
                  <Link href={`/p/${r.p.id}/`}>{r.p.name}</Link><span className="font-mono text-muted">{fmt(r.p.price)}</span>
                </div>
              ))}
            </div>
          )}

          {(s.size === "mid" || s.size === "large") && (
            <div className="card flex flex-col gap-2 border-2 border-ink p-5">
              <div className="font-display text-lg font-bold">{s.size === "large" ? "At your size, start with an audit." : "Several teams? An audit finds more."}</div>
              <div className="text-[14px] text-ink-2">We map every department, rank the savings and give fixed quotes. The audit fee is credited against the build.</div>
              <Link href="/consulting/#audit" className="btn btn-dark">Book an audit</Link>
            </div>
          )}

          <div className="text-[12px] leading-relaxed text-muted">
            Estimates use your numbers and the share you set; they are not a guarantee of results. Wage defaults: US median hourly pay for the matching role, Bureau of Labor Statistics, May 2025.
          </div>
        </aside>
      </div>
    </main>
  );
}


