import data from "@/data/catalogue.json";

export type Product = {
  id: number;
  cat: string;
  name: string;
  desc: string;
  apps: string;
  price: number;
  days: number;
  ind: string[];
  monthly?: boolean;
  /** Monthly run & support range (market-checked Nov 2026). */
  run?: string;
  /** Evidence grade for the price: Strong / Moderate / Lead. */
  grade?: string;
  /** US median annual wage of the role whose work this takes on (BLS OEWS May 2025). */
  wage?: number;
  role?: string;
  replaces?: string;
};

export type Bundle = { name: string; depts: string; desc: string; ids: number[] };

export const INDUSTRIES: string[] = data.industries;
export const PRODUCTS: Product[] = data.products as Product[];
export const BUNDLES: Bundle[] = data.bundles as Bundle[];
const HOW: Record<string, string[]> = data.how;
const DEFAULT_HOURS: Record<string, number> = data.defaultHours;

export const CATEGORIES = [
  "All",
  "Get found (SEO)",
  "Websites & portals",
  "AI agents",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "Industry",
  "Compliance",
  "Monitoring",
  "Solo (self-employed)",
];

/** Prices are placeholders until confirmed by the business owner. */
export const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const priceLabel = (p: Product) => fmt(p.price) + (p.monthly ? "/mo" : "");

export const howItWorks = (p: Product) =>
  HOW[String(p.id)] ?? ["We connect the apps you already use.", p.desc, "You approve key steps and see the results."];

export const defaultHours = (p: Product) => DEFAULT_HOURS[String(p.id)] ?? 3;

export const fitsIndustry = (p: Product, industry: string) =>
  industry === "All industries" || p.ind.includes("all") || p.ind.includes(industry);

export const byId = (id: number) => PRODUCTS.find((p) => p.id === id)!;

/** Hourly cost of the role, from the BLS annual median (2,080 paid hours a year). */
export const roleHourly = (p: Product) => (p.wage ? Math.round(p.wage / 2080) : 30);

/** Example yearly cost of the manual work at the default hours and the role's median wage. */
export const exampleYearly = (p: Product) => defaultHours(p) * 52 * (p.wage ? p.wage / 2080 : 30);
