/**
 * What one full-time admin / bookkeeping person costs an employer per country (checked 4 Nov 2026).
 * Used to show what automation saves. Keep sources next to the numbers.
 */
import type { Country } from "@/lib/geo";

export type HireCost = { salary: number; onCost: number; total: number; basis: string; sources: [string, string][] };

const usSalary = 50670; // BLS, bookkeeping/accounting/auditing clerks, median, May 2025
const ukSalary = Math.round(12.71 * 37.5 * 52); // National Living Wage from 1 Apr 2026, full-time
const auSalary = 1400 * 52; // Jobs and Skills Australia, bookkeepers, median full-time weekly, May 2025
const caSalary = Math.round(28.02 * 2080); // Job Bank, bookkeepers, national median hourly, 2023-24

export const HIRE_COST: Record<Country, HireCost> = {
  us: { salary: usSalary, onCost: Math.round(usSalary / 0.7 - usSalary), total: Math.round(usSalary / 0.7), basis: "median bookkeeping clerk pay, plus benefits (30% of total pay costs)", sources: [["BLS — bookkeeping clerks pay", "https://www.bls.gov/ooh/office-and-administrative-support/bookkeeping-Accounting-and-auditing-clerks.htm"], ["BLS — employer costs (benefits 30%)", "https://www.bls.gov/news.release/ecec.nr0.htm"]] },
  uk: { salary: ukSalary, onCost: Math.round((ukSalary - 5000) * 0.15), total: Math.round(ukSalary + (ukSalary - 5000) * 0.15), basis: "full-time at the National Living Wage (the legal minimum), plus 15% employer National Insurance — before pension", sources: [["GOV.UK — National Living Wage", "https://www.gov.uk/national-minimum-wage-rates"], ["GOV.UK — employer NI 15%", "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027"]] },
  au: { salary: auSalary, onCost: Math.round(auSalary * 0.12), total: Math.round(auSalary * 1.12), basis: "median full-time bookkeeper pay, plus 12% superannuation", sources: [["Jobs and Skills Australia — bookkeepers", "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/5512-bookkeepers"], ["ATO — super guarantee 12%", "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee"]] },
  ca: { salary: caSalary, onCost: 0, total: caSalary, basis: "median bookkeeper pay, full-time — before employer CPP, EI and benefits", sources: [["Job Bank — bookkeepers' wages", "https://www.jobbank.gc.ca/marketreport/wages-occupation/12562/ca"]] },
};
