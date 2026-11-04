/** Country editions for SEO. Prices are set list prices from US$ (ECB reference rates, 18 May 2026), rounded. */
export type Country = "us" | "uk" | "au" | "ca";
export const SITE = "https://rajdeepwif-eng.github.io/taskautopilot-web";
export const COUNTRIES: Record<Country, { name: string; adj: string; locale: string; rate: number; sym: string; tax: string; path: string }> = {
  us: { name: "United States", adj: "US", locale: "en-US", rate: 1, sym: "$", tax: "plus sales tax where it applies", path: "" },
  uk: { name: "United Kingdom", adj: "UK", locale: "en-GB", rate: 0.747, sym: "£", tax: "plus VAT", path: "/uk" },
  au: { name: "Australia", adj: "Australian", locale: "en-AU", rate: 1.396, sym: "A$", tax: "plus GST", path: "/au" },
  ca: { name: "Canada", adj: "Canadian", locale: "en-CA", rate: 1.374, sym: "C$", tax: "plus GST/HST where it applies", path: "/ca" },
};
export const EDITIONS: Country[] = ["uk", "au", "ca"];

/** One rounding rule for every non-US price: under 1,000 ends in 9 (rounded up); 1,000+ to the nearest 50. Zero stays zero. */
export function nice(n: number) {
  if (n <= 0) return 0;
  if (n >= 1000) return Math.round(n / 50) * 50;
  return Math.max(9, Math.ceil(n / 10) * 10 - 1);
}
export const money = (usd: number, c: Country) =>
  COUNTRIES[c].sym + (c === "us" ? Math.round(usd) : nice(usd * COUNTRIES[c].rate)).toLocaleString("en-US");

/** hreflang alternates for a path that exists in every edition (e.g. "/for/trades/"). */
export const alternates = (path: string, c: Country) => ({
  canonical: `${SITE}${COUNTRIES[c].path}${path}`,
  languages: {
    "en-US": `${SITE}${path}`,
    "en-GB": `${SITE}/uk${path}`,
    "en-AU": `${SITE}/au${path}`,
    "en-CA": `${SITE}/ca${path}`,
    "x-default": `${SITE}${path}`,
  },
});
