/**
 * Ways to work with us. Every number here is INDICATIVE — each deal is agreed in writing after a review.
 * Change the defaults in this one file; every page and calculator reads from it.
 */
export type DealId = "upfront" | "monthly" | "finance" | "results" | "hybrid" | "equity" | "succession";

export type Deal = {
  id: DealId;
  name: string;
  forWho: string;
  how: string;
  youPay: string;
  bestWhen: string;
  href: string;
};

/** Monthly plans: length in months → price uplift over the one-off price (covers our cost of waiting). */
export const PLAN_TERMS: { months: number; uplift: number; deposit: number }[] = [
  { months: 6, uplift: 0.05, deposit: 0.2 },
  { months: 12, uplift: 0.1, deposit: 0.2 },
  { months: 24, uplift: 0.2, deposit: 0.2 },
];

/** Pay from results: setup fee as a share of list price, our share of measured gains, the cap, and how long it runs. */
export const RESULTS = { setupShare: 0.25, gainShare: 0.2, capMultiple: 2, months: 12 };

/** Equity for automation: the stake range we look for, and the build value we commit (in US$). */
export const EQUITY = { minStake: 2, maxStake: 20, minBuildValue: 5000, vestingMonths: 12 };

/**
 * The earlier the company, the more risk we carry (no revenue to pay us back if it fails),
 * so the stake is the build value × a risk multiple ÷ the agreed company value, capped per stage.
 */
export const STAGES: { id: string; name: string; risk: number; cap: number }[] = [
  { id: "idea", name: "Idea / pre-revenue", risk: 3, cap: 20 },
  { id: "early", name: "Early revenue (under $250k a year)", risk: 2, cap: 15 },
  { id: "growing", name: "Growing ($250k–$1M a year)", risk: 1.5, cap: 10 },
  { id: "established", name: "Established (over $1M a year)", risk: 1, cap: 5 },
];

/** Smallest cash part of a hybrid deal. */
export const HYBRID_MIN_CASH = 0.5;

export const DEALS: Deal[] = [
  { id: "upfront", name: "Pay up front", forWho: "Owners who want the lowest price", how: "Fixed price, approve the test run or get the build fee back.", youPay: "The list price", bestWhen: "You have the budget and want it live fastest", href: "/library/" },
  { id: "monthly", name: "Pay monthly", forWho: "Owners who'd rather not pay in one go", how: "20% deposit, the rest spread over 6, 12 or 24 months.", youPay: "List price + 5–20% for spreading it", bestWhen: "Cash flow matters more than the last 10%", href: "/ways-to-pay/#monthly" },
  { id: "finance", name: "Finance it", forWho: "Owners who want to pay later with a finance partner", how: "Apply in minutes at checkout through a business finance partner. We're paid up front; you repay them over 3–12 months. Short terms can be interest-free.", youPay: "The list price, over time (partner terms)", bestWhen: "You want a decision in minutes and to keep cash in the business", href: "/ways-to-pay/#finance" },
  { id: "results", name: "Pay from results", forWho: "Owners who want proof before paying in full", how: "A small setup fee, then a share of the gains we measure (recovered invoices, extra booked jobs) for 12 months — capped.", youPay: "25% setup + 20% of measured gains, capped at 2× list price", bestWhen: "The gain is easy to measure (money chased, calls answered)", href: "/ways-to-pay/#results" },
  { id: "hybrid", name: "Part cash, part shares", forWho: "Growing companies keeping cash for hiring", how: "At least half in cash; the rest as a small minority stake.", youPay: "≥50% cash + a small stake", bestWhen: "You'd rather share upside than pay full price now", href: "/startups/#hybrid" },
  { id: "equity", name: "Automation for equity", forWho: "Startup founders with a strong team and idea", how: "We build your automations for a stake that vests as milestones are hit — larger the earlier you are (usually 2–20%).", youPay: "No cash — a vesting minority stake", bestWhen: "You're pre-revenue or early, and want a tech partner", href: "/startups/" },
  { id: "succession", name: "Selling or retiring", forWho: "Owners planning to step back or sell", how: "We automate the business so it runs without you — then you sell for more, sell part to us, or sell it to us over time.", youPay: "Nothing up front for selected businesses", bestWhen: "You want out in 1–5 years and want the best price", href: "/selling-or-retiring/" },
];

export const dealById = (id: string) => DEALS.find((d) => d.id === id);

/** Monthly plan maths for a one-off price. */
export const planFor = (price: number, months: number) => {
  const t = PLAN_TERMS.find((x) => x.months === months) ?? PLAN_TERMS[1];
  const total = price * (1 + t.uplift);
  const deposit = total * t.deposit;
  return { months: t.months, total, deposit, monthly: (total - deposit) / t.months };
};

/** Lowest monthly figure we can show next to a price ("or from $X/mo"). */
export const fromMonthly = (price: number) => planFor(price, PLAN_TERMS[PLAN_TERMS.length - 1].months).monthly;

/** Pay-from-results maths: setup fee, our share per month, and the cap. */
export const resultsFor = (price: number, monthlyGain: number) => {
  const setup = price * RESULTS.setupShare;
  const cap = price * RESULTS.capMultiple;
  const perMonth = monthlyGain * RESULTS.gainShare;
  const total = Math.min(cap, setup + perMonth * RESULTS.months);
  return { setup, perMonth, cap, total, months: RESULTS.months };
};

/** Implied stake for an equity deal: build value ÷ agreed company value, clamped to our range. */
export const stakeFor = (buildValue: number, companyValue: number, stage = "growing") => {
  const st = STAGES.find((x) => x.id === stage) ?? STAGES[2];
  if (companyValue <= 0) return st.cap;
  const pct = ((buildValue * st.risk) / companyValue) * 100;
  return Math.min(st.cap, Math.max(EQUITY.minStake, Math.round(pct * 10) / 10));
};

/**
 * Business finance partners per country (pay-later at checkout, instant decisions). Empty until signed —
 * pages then show "opening at launch". Researched candidates (4 Nov 2026): UK iwocaPay; US Credit Key;
 * AU Shift; CA Tabit (Merchant Growth). Prefer the seller-pays-fee option so short terms are 0% for the buyer.
 */
export const FINANCE_PARTNERS: Partial<Record<"us" | "uk" | "au" | "ca", { name: string; url: string; terms: string }>> = {};
