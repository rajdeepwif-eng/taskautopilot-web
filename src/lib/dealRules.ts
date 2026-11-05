/**
 * Deal approval rules: what we collect for each way to pay, the checks we run, the documents
 * that close it, and a first-pass verdict. Researched 5 Nov 2026 from primary sources (registries,
 * regulators, provider terms, IPMVP/FEMP, ICAEW, Carta, YC/Techstars, BizBuySell). Thresholds marked
 * "house rule" are ours, not from a source. Not legal or tax advice: a solicitor and accountant sign off.
 */
import type { DealId } from "@/lib/deals";

export type Field = { key: string; label: string; options?: string[]; required?: boolean; hint?: string; type?: "text" | "textarea" | "check" };
export type Verdict = "pass" | "refer" | "decline";
export type Flag = { verdict: Verdict; reason: string };
export type Check = { label: string; url?: string; why: string; required?: boolean };

const COMMON_EXTRA: Field[] = [
  { key: "legalForm", label: "Business type", required: true, options: ["Limited company / LLC / corporation", "Sole trader", "Partnership", "Startup not yet incorporated", "Other"] },
  { key: "companyNumber", label: "Company or registration number", hint: "Companies House, EIN, ABN or BN. Required for a limited company." },
  { key: "trading", label: "Trading for", required: true, options: ["Not yet trading", "Under 6 months", "6–12 months", "1–3 years", "Over 3 years"] },
  { key: "role", label: "Your role", required: true, options: ["Owner / director", "Co-founder", "Manager (not a director)", "Other"] },
  { key: "projectValue", label: "Rough size of the project", options: ["Under 1,000", "1,000–5,000", "5,000–20,000", "Over 20,000", "Not sure yet"], hint: "In your currency. We confirm the exact price in writing." },
];

export const DEAL_FIELDS: Partial<Record<DealId, Field[]>> = {
  monthly: [
    { key: "term", label: "Spread it over", required: true, options: ["3 months", "6 months", "12 months"] },
    { key: "timeline", label: "When do you want it live?", options: ["As soon as possible", "Within 1–3 months", "Just exploring"] },
    { key: "creditConsent", label: "I agree you can run a business credit search on the company with a credit reference agency (e.g. Experian). It's a business search and isn't recorded on any director's personal credit file. If we ever need a director's personal search, we'll ask you separately first.", type: "check", required: true },
    { key: "businessPurpose", label: "This plan is wholly or mainly for the business", type: "check", required: true },
  ],
  finance: [
    { key: "partnerConsent", label: "I agree you can pass my name, company and project details to our finance partner, so they can make their own credit decision under their own privacy notice. We'll name the partner and link their notice before anything is shared.", type: "check", required: true },
  ],
  results: [
    { key: "gainType", label: "What gain should we be paid from?", required: true, options: ["Late invoices recovered", "Extra booked jobs", "Calls answered that we used to miss", "Other"] },
    { key: "baselineMonths", label: "How much past data do you have for it?", required: true, options: ["None", "Under 6 months", "6–12 months", "Over 12 months"], hint: "We measure the gain against your normal months before the build" },
    { key: "dataSystem", label: "Where is it recorded?", hint: "e.g. Xero, QuickBooks, Jobber, your phone system" },
    { key: "dataAccess", label: "Can you give us read-only access to that system?", required: true, options: ["Yes", "Not sure", "No"] },
  ],
  hybrid: [
    { key: "team", label: "Founding team / management (who, background, full-time?)", type: "textarea", required: true },
    { key: "cashShare", label: "Cash part", required: true, options: ["50%", "60%", "70%", "80% or more"] },
    { key: "capTable", label: "Do you have an up-to-date cap table (who owns what, including SAFEs or options)?", required: true, options: ["Yes", "No", "Not sure"] },
    { key: "valuation", label: "Basis for your company value", options: ["Recent funding round", "Accountant valuation", "Revenue or profit multiple", "Our own estimate"] },
  ],
  equity: [
    { key: "team", label: "Founding team (who, background, full-time?)", type: "textarea", required: true },
    { key: "stakeOk", label: "Funding so far", options: ["Bootstrapped", "Friends & family", "Angel / pre-seed", "Seed or later"] },
    { key: "capTable", label: "Do you have an up-to-date cap table (including SAFEs, notes or options)?", required: true, options: ["Yes", "No", "Not sure"] },
    { key: "ipAssigned", label: "Has everyone who built your product signed its IP over to the company?", required: true, options: ["Yes", "Not sure", "No"] },
    { key: "runway", label: "Cash runway", required: true, options: ["Under 6 months", "6–12 months", "Over 12 months"] },
  ],
  succession: [
    { key: "exitYears", label: "When would you like to step back?", required: true, options: ["Within 12 months", "1–2 years", "3–5 years", "Not sure yet"] },
    { key: "ownership", label: "How much do you own?", options: ["100%", "Over 50%", "50% or less"] },
    { key: "reason", label: "What matters most to you?", options: ["Best price", "Looking after my staff", "A clean, quick exit", "Staying involved part-time"] },
    { key: "accounts3y", label: "Do you have 3 years of filed accounts?", required: true, options: ["Yes", "Fewer than 3 years", "No"] },
    { key: "topCustomer", label: "Your biggest customer's share of sales", required: true, options: ["Under 10%", "10–20%", "Over 20%"] },
    { key: "debts", label: "Loans, charges or tax arrears?", options: ["None", "Some, up to date", "Some, behind", "Not sure"] },
  ],
};
export const fieldsFor = (deal: DealId): Field[] => [...COMMON_EXTRA, ...(DEAL_FIELDS[deal] ?? [])];

/** First-pass verdict. The worst flag wins; a person always makes the final decision. */
export function assess(deal: DealId, f: Record<string, string>): { verdict: Verdict; flags: Flag[] } {
  const flags: Flag[] = [];
  const add = (verdict: Verdict, reason: string) => flags.push({ verdict, reason });
  const country = f.country || "";
  const uk = country === "United Kingdom";
  if (/Limited/.test(f.legalForm || "") && !(f.companyNumber || "").trim()) add("refer", "Limited company with no company number — ask for it before running checks.");
  if (f.role && !/Owner|Co-founder/.test(f.role)) add("refer", "Applicant isn't an owner or director — confirm who can sign.");
  if (deal === "monthly") {
    if (/Sole trader|Partnership/.test(f.legalForm || "")) add("refer", uk ? "Sole traders and 2–3 partner firms count as 'individuals' under the Consumer Credit Act. Offer in-house terms only if exempt (art 60F: 12 or fewer payments within 12 months, no interest or charges); otherwise route to the finance partner. A tick box is not the art 60C business declaration — that needs the FCA's prescribed form (solicitor)." : "Not incorporated — check local credit rules or route to the finance partner.");
    if (country === "United States") add("refer", "US commercial-financing disclosure laws now cover 10 states (CA, CT, FL, GA, KS, MO, NY, TX, UT, VA). Check the customer's state with a lawyer before quoting.");
    if (/Not yet|Under 6|6–12/.test(f.trading || "")) add("refer", "Trading under 12 months — ask for 3 months of bank statements (house rule).");
    if (/Startup/.test(f.legalForm || "")) add("decline", "Not incorporated yet — offer pay up front, results or equity instead.");
  }
  if (deal === "finance") {
    add("refer", "Partner makes the credit decision; we only confirm the company is genuine.");
    if (uk && /Sole trader|Partnership/.test(f.legalForm || "")) add("refer", "Introducing a sole trader or 2–3 partner firm to a lender may be credit broking (RAO art 36A) — confirm our FCA position or the partner's cover first.");
  }
  if (deal === "results") {
    if (f.baselineMonths === "None" || f.baselineMonths === "Under 6 months") add("decline", "Not enough past data to set a fair baseline — offer pay monthly instead.");
    else if (f.baselineMonths === "6–12 months") add("refer", "Under 12 months of baseline — check for seasonality (house rule).");
    if (f.dataAccess === "No") add("decline", "No read access to the system of record — the gain can't be verified.");
    else if (f.dataAccess === "Not sure") add("refer", "Confirm read-only data access before agreeing the baseline.");
    if (f.gainType === "Other") add("refer", "Custom gain — define the measurement boundary and formula (IPMVP) first.");
  }
  if (deal === "equity" || deal === "hybrid") {
    if (f.capTable === "No") add("refer", "No cap table — needed before any stake is priced.");
    if (f.capTable === "Not sure") add("refer", "Cap table unclear — reconcile with the PSC register / filings.");
    if (deal === "equity") {
      if (f.ipAssigned === "No") add("decline", "IP not owned by the company — fix assignments first.");
      if (f.ipAssigned === "Not sure") add("refer", "Confirm IP assignments from founders and contractors.");
      if (f.runway === "Under 6 months") add("refer", "Under 6 months' runway — high risk the stake is worth nothing.");
    }
    if (uk) add("refer", "UK company: check whether the stake needs a National Security and Investment Act notification (mandatory over 25% in listed sectors such as AI).");
    if (deal === "hybrid" && f.valuation === "Our own estimate") add("refer", "Value is the owner's estimate — get an accountant valuation (or 409A in the US).");
  }
  if (deal === "succession") {
    if (f.accounts3y !== "Yes") add("refer", "Fewer than 3 years of accounts — valuation will lean on management accounts.");
    if (f.topCustomer === "Over 20%") add("refer", "One customer over 20% of sales (house rule) — concentration risk for a buyer.");
    if (f.debts === "Some, behind") add("refer", "Debts or tax arrears behind — must be resolved or priced in.");
    if (f.debts === "Not sure") add("refer", "Check the charges register and HMRC/IRS position.");
  }
  if (f.trading === "Not yet trading" && deal !== "equity") add("refer", "Not trading yet — equity or pay up front may suit better.");
  const order: Verdict[] = ["pass", "refer", "decline"];
  const verdict = flags.reduce<Verdict>((v, x) => (order.indexOf(x.verdict) > order.indexOf(v) ? x.verdict : v), "pass");
  return { verdict, flags };
}

const q = (s: string) => encodeURIComponent(s || "");
/** Checks to run before approval, with the official tool for each country. */
export function checksFor(deal: DealId, f: Record<string, string>): Check[] {
  const c: Check[] = [];
  const name = f.company || "";
  const country = f.country || "";
  const key = f.companyNumber || name;
  const ch = "https://find-and-update.company-information.service.gov.uk";
  if (country === "United Kingdom") {
    c.push({ label: "Companies House: active, accounts on time, PSC and charges", url: key ? `${ch}/search?q=${q(key)}` : ch, why: "Confirms the company is real and who controls it.", required: true });
    c.push({ label: "Directors and PSCs: identity verified at Companies House", url: key ? `${ch}/search?q=${q(key)}` : ch, why: "ID verification has been required since 18 Nov 2025 — check each officer's record shows it.", required: true });
    c.push({ label: "Disqualified directors search", url: `${ch}/search/disqualified-officers?q=${q(f.name || "")}`, why: "Directors must not be disqualified.", required: true });
    c.push({ label: "UK sanctions list search — company, directors and owners", url: "https://search-uk-sanctions-list.service.gov.uk/", why: "Single UK list since 28 Jan 2026. Screen the people, not just the company.", required: true });
    if (deal === "equity" || deal === "succession" || deal === "hybrid") c.push({ label: "PEP / adverse-media screen on directors, owners and seller", why: "Standard customer due diligence (MLR 2017; JMLSG guidance). Use a screening provider." });
    if (deal === "monthly" || deal === "finance") c.push({ label: "VAT number check", url: "https://www.gov.uk/check-uk-vat-number", why: "Name and address on the VAT record match the application." });
    if (deal === "monthly" || deal === "succession") {
      c.push({ label: "CCJs (TrustOnline, £6)", url: "https://www.registry-trust.org.uk/services/trustonline", why: "Unsatisfied judgments are a decline (house rule).", required: true });
      c.push({ label: "Insolvency: Gazette notices and Individual Insolvency Register", url: "https://www.thegazette.co.uk/insolvency", why: "A winding-up petition (company) or bankruptcy (sole trader) is a decline.", required: true });
    }
  } else if (country === "United States") {
    c.push({ label: "State Secretary of State business registry", why: "Good standing and officers (state by state)." });
    c.push({ label: "OFAC sanctions search — company and owners", url: "https://sanctionssearch.ofac.treas.gov/", why: "Owners and company must be clear.", required: true });
    c.push({ label: "Beneficial owners confirmed by us (KYC)", why: "FinCEN's BOI register no longer covers US companies (March 2025 interim rule), so we collect owners' ID ourselves.", required: true });
    if (deal === "equity" || deal === "hybrid") c.push({ label: "SEC EDGAR full-text search (filter form D)", url: `https://www.sec.gov/edgar/search/#/q=${q(name)}&forms=D`, why: "Past raises and exemptions used." });
  } else if (country === "Australia") {
    c.push({ label: "ABN Lookup", url: key ? `https://abr.business.gov.au/Search/ResultsActive?SearchText=${q(key)}` : "https://abr.business.gov.au/", why: "Active ABN and entity type.", required: true });
    c.push({ label: "ASIC company search (free)", url: "https://asic.gov.au/online-services/search-asic-registers/companies-and-organisations", why: "Registered company and officeholders.", required: true });
    c.push({ label: "ASIC banned and disqualified register; Director ID held", url: "https://asic.gov.au/online-services/search-asic-registers/banned-and-disqualified-registers", why: "Directors must not be banned; every director needs a Director ID." });
    c.push({ label: "DFAT consolidated sanctions list (download the XLSX and search it)", url: "https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list", why: "Owners and company must be clear.", required: true });
  } else if (country === "Canada") {
    c.push({ label: "Corporations Canada (federal) search", url: "https://ised-isde.canada.ca/cc/lgcy/fdrlCrpSrch.html", why: "Active federal corporation, directors and individuals with significant control.", required: true });
    c.push({ label: "Canada's Business Registries (provincial companies)", url: "https://www.canada.ca/en/services/business/start/register-with-gov.html", why: "Most small firms are registered provincially — search the province's registry." });
    c.push({ label: "Canadian consolidated sanctions list", url: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx", why: "Owners and company must be clear.", required: true });
  }
  if (deal === "monthly") {
    c.push({ label: "Business credit score (e.g. Experian Commercial Delphi)", why: "Pass 51+, refer 26–50, decline 25 or below; 0–1 means dissolved or a winding-up petition (house rule on Experian's bands).", required: true });
    c.push({ label: "Affordability: 3 months' business bank statements", why: "The instalment fits comfortably in normal monthly takings (house rule)." });
    c.push({ label: "Bank account in the company's name — Confirmation of Payee match on the Direct Debit", why: "Payments only from the contracting business, set up through the Direct Debit provider.", required: true });
  }
  if (deal === "results") {
    c.push({ label: "Baseline and M&V plan (IPMVP principles, used by analogy)", url: "https://evo-world.org/images/corporate_documents/IPMVP-Generally-Accepted-Principles_Final_26OCT2018.pdf", why: "Gain = baseline − reporting period ± agreed adjustments; conservative and transparent.", required: true });
    c.push({ label: "Read-only access tested and baseline data exported", why: "The gain must be measurable from the customer's own system.", required: true });
  }
  if (deal === "equity" || deal === "hybrid") {
    c.push({ label: "Cap table reconciles to filings / PSC; IP assignments in place", why: "No undisclosed SAFEs, notes or side letters.", required: true });
    if (country === "United States") c.push({ label: "409A or other fair-value basis; 83(b) within 30 days if unvested", url: "https://www.irs.gov/pub/irs-pdf/f15620.pdf", why: "Shares for services are taxable at fair market value." });
    if (country === "United Kingdom") {
      c.push({ label: "Director authority, pre-emption waived; SH01 within one month (Companies Act s.555)", url: "https://www.legislation.gov.uk/ukpga/2006/46/section/555", why: "Allotment for non-cash consideration must be filed." });
      c.push({ label: "National Security and Investment Act: notifiable?", url: "https://www.gov.uk/government/collections/national-security-and-investment-act", why: "Mandatory notification can apply to stakes over 25% in AI and other listed sectors." });
    }
  }
  if (deal === "succession") {
    c.push({ label: "Accounts reconcile to tax returns; add-backs evidenced", why: "Valuation rests on SDE/EBITDA.", required: true });
    c.push({ label: "Change-of-control clauses in key contracts and leases", why: "A sale can trigger terminations." });
    c.push({ label: "Valuation sense-check", url: "https://www.bizbuysell.com/blog/2025-year-in-review/", why: "US small-business average 2025: 2.61× cash flow (BizBuySell — one source, a lead not a rule)." });
    if (country === "United Kingdom") c.push({ label: "Seller's tax route (accountant)", url: "https://www.gov.uk/business-asset-disposal-relief", why: "Business Asset Disposal Relief is 18% from 6 Apr 2026 (£1m lifetime); EOT sales get 50% relief from 26 Nov 2025 and can't be combined with BADR." });
  }
  return c;
}

/** Documents that close each deal (in order). */
export const DOCUMENTS: Record<DealId, string[]> = {
  upfront: ["Service agreement and fixed quote"],
  monthly: ["Service agreement", "Instalment agreement with business-purpose declaration", "Direct Debit / ACH mandate (via provider — never card details by hand)", "US: commercial-financing disclosure if the customer's state requires it (10 states — check with lawyer)", "UK sole trader / small partnership: in-house terms only if exempt (art 60F), otherwise via the finance partner", "Optional director's guarantee (solicitor)"],
  finance: ["Partner merchant agreement (us)", "Partner credit terms (customer, with partner)", "Service agreement", "Written confirmation of no recourse to us"],
  results: ["Service agreement", "Gainshare agreement with baseline schedule", "M&V plan and risk/responsibility matrix", "Read-only data access and confidentiality", "Monthly M&V report signed off by the customer", "Dispute route: independent expert"],
  hybrid: ["Term sheet", "Service agreement with milestones", "Subscription agreement (shares for services)", "Shareholders' agreement / deed of adherence", "Board (and shareholder) resolutions", "Updated cap table; SH01 (UK) or Form D (US)"],
  equity: ["NDA", "Term sheet", "Due diligence", "Service agreement with milestone schedule", "Subscription agreement + disclosure letter", "Deed of adherence to shareholders' agreement", "Board approval, share issue and filings; 83(b) if US"],
  succession: ["NDA", "Information memorandum", "Heads of terms / LOI (exclusivity)", "Financial, legal and tax due diligence", "SPA or APA + disclosure letter, warranties and indemnities", "For deferred payment: loan note or earn-out schedule plus security (escrow, guarantee or charge)", "For management path: management services agreement plus option agreement"],
};

export const VERDICT_TEXT: Record<Verdict, string> = { pass: "No flags yet", refer: "Needs a look", decline: "Suggest another way to pay" };

/** Risk grade for the review memo, from the first-pass flags (house rule, not a credit score). */
export const riskGrade = (flags: Flag[]): { grade: "A" | "B" | "C" | "D"; text: string } => {
  const dec = flags.filter((x) => x.verdict === "decline").length, ref = flags.filter((x) => x.verdict === "refer").length;
  if (dec) return { grade: "D", text: "Decline or restructure" };
  if (ref >= 3) return { grade: "C", text: "Higher risk — conditions needed" };
  if (ref) return { grade: "B", text: "Moderate — resolve the flags" };
  return { grade: "A", text: "Low — subject to checks" };
};

/** How long an approval stays valid before the checks must be rerun (house rule). */
export const APPROVAL_VALID_DAYS = 30;
