/** Country editions for SEO. Prices are set list prices from US$ (ECB reference rates, 18 May 2026), rounded. */
export type Country = "us" | "uk" | "au" | "ca";
/** The live address. Set NEXT_PUBLIC_SITE_URL in the deploy workflow when the custom domain is ready. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://rajdeepwif-eng.github.io/taskautopilot-web").replace(/\/$/, "");
/** True while the site is still on the temporary github.io address — don't print QR codes yet. */
export const ON_TEMP_DOMAIN = /github\.io/.test(SITE);
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

/** Local wording for the UK and Australian editions (search terms people there actually use). */
const UK_AU: [RegExp, string][] = [
  [/\bequipment rental\b/g, "equipment hire"], [/\bEquipment rental\b/g, "Equipment hire"], [/\btool rental\b/g, "tool hire"],
  [/\bBook more rentals\b/g, "Book more hires"], [/\bOn rent: extend or call off\b/g, "On hire: extend or off-hire"], [/\brentals\b/g, "hires"],
  [/\binquiries\b/g, "enquiries"], [/\bInquiries\b/g, "Enquiries"], [/\binquiry\b/g, "enquiry"], [/\bInquiry\b/g, "Enquiry"],
  [/\bbusiness days\b/g, "working days"], [/\bbusiness day\b/g, "working day"],
  [/\bresumes\b/g, "CVs"], [/\bresume\b/g, "CV"], [/\btakeout\b/g, "takeaways"], [/\bTrucking\b/g, "Haulage"], [/\btrucking\b/g, "haulage"], [/\bmovers\b/g, "removals"],
  [/\bshowings\b/g, "viewings"], [/\bShowings\b/g, "Viewings"], [/\bShift schedules\b/g, "Rotas"], [/\bshift schedules\b/g, "rotas"],
  [/\borganiz/g, "organis"], [/\bsummariz/g, "summaris"], [/\bprioritiz/g, "prioritis"], [/\bcolor\b/g, "colour"],
  [/\bsales tax\b/g, "VAT/GST"], [/\bdial 911\b/g, "call emergency services"],
  [/\bphysical therapy\b/g, "physiotherapy"], [/\bmed spa\b/g, "aesthetics clinic"], [/\bHousecall Pro\b/g, "Tradify"], [/\bServiceTitan\b/g, "Fergus"],
  [/Patient data runs only on services that have signed a business associate agreement \(BAA\)[^.]*\./g, "Patient data is special-category data under data-protection law: it runs only on services covered by a data processing agreement, chosen with your data-protection lead — not on our standard cloud setup."],
];
const AU: [RegExp, string][] = [[/\bTrades & home services\b/g, "Tradies & home services"], [/\bPlumbers, electricians, builders, cleaners\b/g, "Plumbers, sparkies, builders, cleaners"], [/\bVAT\/GST\b/g, "GST"]];
const UK: [RegExp, string][] = [[/\bVAT\/GST\b/g, "VAT"]];
export const loc = (text: string, c: Country) => {
  if (c !== "uk" && c !== "au") return text;
  const t = UK_AU.reduce((s, [a, b]) => s.replace(a, b), text);
  return (c === "au" ? AU : UK).reduce((s, [a, b]) => s.replace(a, b), t);
};

/** Convert every US$ amount (incl. ranges like "$100–200/mo") in a string for a country edition. */
export const localPrices = (text: string, c: Country) =>
  c === "us" ? text : text.replace(/\$(\d(?:[\d,]*\d)?)(?:–(\d(?:[\d,]*\d)?))?/g, (_, a: string, b?: string) => {
    const cv = (v: string) => nice(Number(v.replace(/,/g, "")) * COUNTRIES[c].rate).toLocaleString("en-US");
    return COUNTRIES[c].sym + cv(a) + (b ? "–" + cv(b) : "");
  });

/** Meta description ≤155 characters (Google cuts longer ones), trimmed at a sentence or word. */
export const metaDesc = (t: string, max = 155) => {
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const dot = cut.lastIndexOf(". ");
  return dot > 90 ? cut.slice(0, dot + 1) : cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "") + "…";
};

/** Search title ≤60 characters: adds the brand only when it fits. */
export const seoTitle = (core: string) => ({ absolute: core.length <= 45 ? `${core} | TaskAutoMode` : core });
