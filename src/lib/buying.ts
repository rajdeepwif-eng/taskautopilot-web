import { BRIEFS, type Brief } from "@/data/briefs";
import { Product, howItWorks, runLow, fmt } from "@/lib/catalogue";

/**
 * What a customer is buying, in one place: the after-go-live policy, change prices, and how
 * "runs" (n8n executions) turn into running costs. Policy agreed with the owner 6 Nov 2026:
 * small changes free for 14 days, bug fixes free for 90 days, then a support plan or fixed
 * change bands. Run counting follows n8n's docs: one execution = one run of a workflow,
 * however many steps; a timer counts every time it fires, even when nothing is found
 * (docs.n8n.io, "Understand executions"). Plan sizes read from n8n.io/pricing on 6 Nov 2026.
 */
export const TWEAK_DAYS = 14;
export const BUG_DAYS = 90;

export const CHANGE_BANDS = [
  { id: "small", name: "Small change", price: 150, what: "About an hour: wording, timing, who gets alerts, a rule or a field — in apps already connected" },
  { id: "medium", name: "Medium change", price: 450, what: "Up to about half a day: a new rule or branch, an extra step in an app already connected" },
  { id: "large", name: "Large change", price: 0, what: "A new app, a new workflow or a different way of working — fixed quote before any work" },
] as const;

export const N8N_PLANS = [
  { name: "Starter", runs: 2500, eur: 20 },
  { name: "Pro", runs: 10000, eur: 50 },
] as const;
export const N8N_CHECKED = "n8n.io/pricing, checked 6 Nov 2026 (annual billing)";

export const FREQS = [
  { id: "event", label: "As soon as it happens", perMonth: 0, note: "Runs only when something happens — usually the cheapest" },
  { id: "1m", label: "Check every minute", perMonth: 43200, note: "43,200 runs a month — rarely needed; an instant trigger usually does the same job" },
  { id: "15m", label: "Check every 15 minutes", perMonth: 2880, note: "A timed schedule counts every check as a run, even when nothing is new (app “watch” triggers count only when something new arrives)" },
  { id: "1h", label: "Check every hour", perMonth: 720, note: "A timed schedule counts every check as a run" },
  { id: "1d", label: "Once a day", perMonth: 30, note: "One run a day" },
  { id: "1w", label: "Once a week", perMonth: 4, note: "One run a week" },
  { id: "1mo", label: "Once a month", perMonth: 1, note: "One run a month" },
] as const;
export type FreqId = (typeof FREQS)[number]["id"];

/** Daily self-check + watchdog that every build includes (about 2 runs a day). */
export const OVERHEAD_RUNS = 60;

export const runsPerMonth = (freq: FreqId, eventsPerMonth: number) => {
  const f = FREQS.find((x) => x.id === freq)!;
  return (f.id === "event" ? Math.max(0, eventsPerMonth) : f.perMonth) + OVERHEAD_RUNS;
};

export const planFor = (runs: number) => {
  const p = N8N_PLANS.find((x) => runs <= x.runs);
  return p
    ? { name: `n8n ${p.name}`, cost: `about €${p.eur}/mo (roughly $${Math.round(p.eur * 1.12)}), paid to n8n`, fits: true }
    : { name: "A larger n8n plan", cost: "quoted — we'll also show you how to cut the runs", fits: false };
};

export const briefFor = (p: Product): Brief | undefined => BRIEFS.find((b) => b.products.includes(p.id));

const APPROVAL = /approv|sign-off|sign off|for you to|you check|you click|review(ed)? by|asks you|waits for/i;

/** Kind of extra usage cost a build has, if any (drives the "other running costs" note and the buy box). */
export function usageKind(p: Product): "voice" | "ai" | "sms" | "data" | "" {
  if (p.usage) return (p.usage === "none" ? "" : p.usage) as "voice" | "ai" | "sms" | "data";
  const words = `${p.name} ${p.desc}`;
  const run = p.run ?? "";
  if (/photo/i.test(p.apps) && /receipt|invoice|document/i.test(words)) return "ai";
  if (/receptionist|voice AI|AI voice|voice call/i.test(words) || /minutes/i.test(run)) return "voice";
  if (/\bAI\b/.test(run) || p.cat === "AI agents" || /\bAI\b|chatbot|assistant|reads? (the|each|your)|photo/i.test(words)) return "ai";
  if (/\b(texts?|SMS|WhatsApp)\b/i.test(words + " " + p.apps)) return "sms";
  if (/data|tool costs/i.test(run)) return "data";
  return "";
}

/** Products where an AI replies live to customers — a person can't pre-check every answer. */
const liveAI = (p: Product) => usageKind(p) === "voice" || /chat|assistant|answers|receptionist/i.test(`${p.name}`) || [7, 8, 10, 64, 66, 108].includes(p.id);

/** The four boxes of the "how it works" picture, in plain words. */
export function flowFor(p: Product) {
  const found = briefFor(p);
  const how = howItWorks(p);
  // A brief shared by several products describes its lead product; others keep their own steps.
  const own = !found || found.products[0] === p.id || !HAS_HOW(p);
  const b = own ? found : undefined;
  const start = b?.trigger ?? how[0];
  const steps = b ? [...b.steps] : how.slice(1);
  const text = [p.desc, ...steps, ...how, ...(b?.ask ?? [])].join(" ");
  const live = liveAI(p);
  const approves = !live && APPROVAL.test(text);
  const check = live
    ? "It follows rules you set and hands over to a person when it isn't confident. Conversations are logged so you can review them"
    : approves
      ? "You approve or edit anything it isn't sure about — nothing unusual goes out without you"
      : "You see every result; anything unusual is flagged to you, not guessed";
  const result = b?.outcome ?? p.desc.split(/(?<=\.)\s/)[0];
  return { start, steps, check, approves, live, result, needs: b?.inputs, from: b?.from, decide: b?.ask, native: b?.native };
}
const HAS_HOW = (p: Product) => howItWorks(p)[0] !== "We connect the apps you already use.";

/** Sensible starting values for the runs calculator. */
export function defaultRuns(p: Product): { freq: FreqId; events: number } {
  const f = flowFor(p);
  const t = [f.start, ...f.steps].join(" ").toLowerCase();
  if (/every (night|morning|day)|each (day|morning)|daily|due|expir|renewal|recall|reminder|coming up|watch every/.test(t)) return { freq: "1d", events: 0 };
  if (/every week|weekly|each week/.test(t)) return { freq: "1w", events: 0 };
  if (/once a month|monthly|each month/.test(t)) return { freq: "1mo", events: 0 };
  return { freq: "event", events: 200 };
}

/** Builds whose biggest running cost is usage other than n8n runs (call minutes, AI, data). */
const USAGE: Record<string, string> = {
  voice: "This build also uses AI voice and phone minutes — usually its biggest running cost, and it grows with call volume. We estimate it from your call numbers on the setup form and show it before you buy.",
  ai: "This build also uses AI (for example to read documents or write replies), billed by use. We estimate it from your volumes at setup and show it before you buy.",
  sms: "This build also sends texts or WhatsApp messages, billed per message by the provider. We estimate it from your volumes at setup.",
  data: "This build also needs a data or tool subscription, paid to that provider — named on the setup form.",
};
export const usageNote = (p: Product) => USAGE[usageKind(p)] ?? "";
export const usageShort = (p: Product) => ({ voice: "call minutes", ai: "AI use", sms: "texts", data: "data subscription", "": "" })[usageKind(p)];

export const supportFrom = (p: Product) => (runLow(p) ? `${fmt(runLow(p))}/mo` : "");
