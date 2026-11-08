/**
 * How each course and kit is advertised. Everything here is drawn from the product's own description —
 * no learner counts, ratings or results, because we have none yet.
 * outcome = the one line a buyer reads first; inside = what they actually get; who/format/length = the meta row.
 */
export type LearnMeta = { outcome: string; inside: string[]; who: string; format: string; length: string; track: Track };
export type Track = "owners" | "managers" | "builders" | "teams";

export const TRACKS: Record<Track, { title: string; blurb: string }> = {
  owners: { title: "For owners — get your time back", blurb: "Build the first automations in your own business, with us or at your own pace." },
  managers: { title: "For managers — run the team with less chasing", blurb: "Delegation, accountability and numbers, with AI doing the admin." },
  builders: { title: "For builders — make it reliable", blurb: "From first workflow to systems you can trust, the way we run our own." },
  teams: { title: "For whole teams — licences and live days", blurb: "Train 10 or 25 people at once, with a manager's view of progress." },
};

export const COURSE_META: Record<number, LearnMeta> = {
  70: { outcome: "Leave with five automations running in your own business", inside: ["Short lessons, each ending with a working automation", "10 ready-made workflow templates and checklists", "Missed calls, inquiries, invoices, bank matching, reviews"], who: "Owners", format: "Self-paced", length: "30-day plan", track: "owners" },
  74: { outcome: "Build one automation a week, live, with us on the call", inside: ["Small live group over 6 weeks", "Two private 1-to-1 build sessions", "Office hours and templates — leave with 5 working automations"], who: "Owners", format: "Live cohort", length: "6 weeks", track: "owners" },
  106: { outcome: "Twelve weeks working directly with us on your automation roadmap", inside: ["Small group of owners, weekly meetings", "We plan the roadmap and review every build", "Limited places"], who: "Owners", format: "Live mastermind", length: "12 weeks", track: "owners" },
  77: { outcome: "Delegate in one message and review the whole team every Friday", inside: ["SOP tasks with owners and proof for every role", "Friday team review and better 1-to-1s", "AI does the admin"], who: "Managers & supervisors", format: "Self-paced", length: "Short lessons", track: "managers" },
  71: { outcome: "The accountability system we run ourselves, in your Asana and Slack", inside: ["SOP tasks with owners and proof", "Delegating from one chat message", "Evening exceptions list and Friday scorecard"], who: "Owners & managers", format: "Self-paced", length: "Short lessons", track: "managers" },
  104: { outcome: "One dashboard that matters, with AI explaining what changed and why", inside: ["Get the numbers out of your apps automatically", "Build the one dashboard that matters", "AI explains what changed and why"], who: "Managers", format: "Self-paced", length: "Short lessons", track: "managers" },
  102: { outcome: "One clear goal, quarterly priorities with owners, a weekly scoreboard", inside: ["Turn one goal into quarterly priorities with owners", "Weekly scoreboard and quarterly review", "Built on the planning system we use ourselves"], who: "Owners & leadership teams", format: "Self-paced", length: "Short lessons", track: "managers" },
  73: { outcome: "From your first workflow to systems you can trust", inside: ["Triggers, AI steps, error alerts, missed-run checks", "Labelling and handover standards we use on live workflows", "Built in n8n"], who: "Operations managers", format: "Self-paced", length: "Short lessons", track: "builders" },
  72: { outcome: "An AI that briefs you every morning and never acts without your yes", inside: ["Morning brief, assistant tracking, research before decisions", "Systems that keep improving", "Approval steps on everything"], who: "Owners", format: "Self-paced", length: "Short lessons", track: "builders" },
  78: { outcome: "Audits ready any day: checklists become inspections, failures become owned fixes", inside: ["Scheduled inspections from your checklists", "Failed items become owned fixes; expiry dates become reminders", "Your competent person keeps sign-off"], who: "Safety & compliance leads", format: "Self-paced", length: "Short lessons", track: "builders" },
  105: { outcome: "Ten weeks to a reviewed capstone automation and our practitioner certificate", inside: ["Live sessions over 10 weeks", "Capstone automation in your own business, reviewed", "Practical exam; our own certificate, not an accredited qualification"], who: "Builders & ops leads", format: "Live programme", length: "10 weeks", track: "builders" },
  75: { outcome: "Ten of your staff each leave with an automation they'll use tomorrow", inside: ["One live day, built around your own processes", "Everyone builds and tests their own automation", "Up to 10 staff"], who: "Teams", format: "Live workshop", length: "1 day", track: "teams" },
  76: { outcome: "Any course for up to 10 staff, with a manager's progress view", inside: ["Pick any course", "Dashboard of who finished which lesson and what they built", "Renews yearly"], who: "Teams up to 10", format: "Licence", length: "12 months", track: "teams" },
  103: { outcome: "Every employee using AI safely for writing, research, analysis and admin", inside: ["Short role-based lessons", "Company AI policy template", "Manager progress view · up to 25 staff"], who: "Teams up to 25", format: "Licence", length: "12 months", track: "teams" },
};

/** Kits: the outcome and the done-for-you product the price is anchored against. */
export const KIT_META: Record<number, { outcome: string; build?: number }> = {
  55: { outcome: "Text back every missed call within a minute", build: 11 },
  56: { outcome: "Reply to every new lead instantly and offer a booking", build: 10 },
  57: { outcome: "Ask every customer for a review, automatically", build: 15 },
  58: { outcome: "Read supplier invoices into your books without typing", build: 21 },
  59: { outcome: "Match the bank to your books every night", build: 23 },
  60: { outcome: "Turn any web form into tasks, emails and records", build: 48 },
  69: { outcome: "Pull invoices and documents into Excel", build: 68 },
  145: { outcome: "Post from a content sheet to your socials on schedule", build: 17 },
};

export const KIT_INSIDE = ["The ready-made n8n workflow file", "Step-by-step written guide and setup checklist", "30 days of email help", "Credited in full if you upgrade to done-for-you within 30 days"];
