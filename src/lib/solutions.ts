/**
 * Problem guides ("solutions"): one page per pain owners search for, linking to the fixes and trades.
 * Statistics are quoted with their source; keep them in sync with the cited reports.
 */
export type Solution = {
  slug: string;
  title: string; // h1 / page title, phrased as people search
  short: string; // chip / link label
  metaDescription: string;
  problem: string[]; // paragraphs
  stat?: { text: string; source: string; url: string };
  fixes: number[]; // product ids, first = main fix
  trades: [string, string][]; // [trade slug, what it looks like in that trade]
  faq: [string, string][];
  /** Local page titles built from the keyword research (US/UK/CA/AU autocomplete, 4 Nov 2026). */
  local: Partial<Record<"us" | "uk" | "au" | "ca", string>>;
  templates?: [string, string][];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "get-paid-faster",
    title: "Get paid faster: automatic invoice reminders for small businesses",
    short: "Get paid faster",
    metaDescription: "Stop chasing late payers by hand. Invoices go out when the job is done, polite reminders follow automatically, and payments are matched for you. Fixed price.",
    problem: [
      "Late payment is the most common money problem for owner-run businesses. Chasing feels awkward, so it slips — and every week an invoice sits unpaid is cash you can't use for wages, materials or growth.",
      "The fix isn't a tougher tone. It's consistency: every invoice sent on time, every customer reminded before and after the due date, every payment matched without anyone typing.",
    ],
    stat: { text: "56% of US small businesses are owed money from unpaid invoices — about $17,500 each on average.", source: "QuickBooks Small Business Late Payments Report, 2025 (2,487 firms)", url: "https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/" },
    fixes: [22, 125, 123],
    trades: [
      ["trades", "Invoice goes out the day the job is signed off; reminders follow until it's paid."],
      ["equipment-hire", "Rental invoices and extensions billed automatically; overdue accounts flagged before the next booking."],
      ["professional", "Engagement fees and retainers billed on schedule; reminders sent in your firm's tone."],
      ["property", "Rent and service charges invoiced monthly; late tenants reminded automatically."],
      ["food-production", "Wholesale invoices sent with delivery; statements and reminders on your terms."],
    ],
    local: {
      us: "Automated invoice reminders & accounts receivable automation for small businesses",
      ca: "Automated invoice reminders & accounts receivable automation for Canadian small businesses",
      uk: "Credit control automation for small businesses — works with Xero & QuickBooks",
      au: "Automatic invoice reminders for tradies & small businesses — works with Xero",
    },
    faq: [
      ["Will reminders upset my customers?", "They're polite, on your letterhead and in your words. You choose the timing and tone, and anything unusual waits for your approval."],
      ["Does it work with QuickBooks or Xero?", "Yes. It works with QuickBooks, Xero, Sage and Zoho Books, using the invoices already in your accounts."],
      ["Can customers pay from the reminder?", "Yes — every reminder includes a pay-now link from your existing payment provider."],
      ["What happens with customers who still don't pay?", "After your last reminder, the account is flagged to you with a summary, so you decide the next step."],
    ],
  },
  {
    slug: "missed-calls",
    title: "Never miss a lead: missed-call text-back and instant replies",
    short: "Never miss a lead",
    metaDescription: "Every missed call gets a text back within a minute with your booking link, and every web or WhatsApp inquiry gets an instant reply. From $600, fixed price.",
    problem: [
      "When you're on a job, with a patient or driving, the phone rings out. Most callers don't leave a voicemail — they ring the next business on the list.",
      "A missed-call text-back answers for you: the caller gets a friendly text within a minute with your booking link, and you get the details to call back when you're free.",
    ],
    stat: { text: "57% of US small employers name reaching customers and growing sales as their top operating challenge.", source: "Federal Reserve Small Business Credit Survey, 2025", url: "https://fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2025/2025-report-on-employer-firms.pdf" },
    fixes: [11, 10, 7],
    trades: [
      ["trades", "Callers get a text while you're up a ladder, with a link to book a visit."],
      ["clinics", "After-hours callers get a booking link instead of voicemail."],
      ["equipment-hire", "Availability questions get an instant reply with a link to reserve the machine."],
      ["restaurants", "Missed booking calls get a text with your reservation link."],
      ["solo", "One-person businesses get an office-style reply without hiring anyone."],
    ],
    local: {
      us: "Missed call text back service for contractors & small businesses",
      ca: "Missed call text back & AI receptionist for Canadian businesses (works with Jobber)",
      uk: "Missed call text back & AI receptionist for UK small businesses",
      au: "Missed call text back & AI receptionist for tradies",
    },
    faq: [
      ["Does it need a new phone number?", "No. It works with your existing business number through your phone provider or a call-forwarding setup."],
      ["What does the text say?", "Whatever you approve — usually a short apology, your booking link and when you'll call back."],
      ["How is this different from an AI receptionist?", "Text-back replies after a missed call. An AI receptionist answers the call itself. Most owners start with text-back and upgrade if volume grows."],
      ["How fast is it live?", "Missed-call text-back is usually live in about a week."],
    ],
  },
  {
    slug: "quote-follow-up",
    title: "Quote follow-up on autopilot: win more of the jobs you price",
    short: "Follow up every quote",
    metaDescription: "Polite, timed follow-ups go out on every quote until the customer decides, so fewer jobs go quiet. Works with your existing quoting tool. From $1,200.",
    problem: [
      "Pricing a job takes time, then the quote sits in someone's inbox. Most owners mean to follow up and don't — not because they don't care, but because the next job is already waiting.",
      "Automated follow-up sends a short, friendly nudge on a schedule you choose, stops the moment the customer replies, and tells you which quotes are going cold.",
    ],
    fixes: [13, 16],
    trades: [
      ["trades", "Every estimate gets two or three polite follow-ups until the customer says yes or no."],
      ["manufacturing", "Trade quotes are chased on schedule with the drawing or spec attached."],
      ["professional", "Proposals and engagement letters are followed up until signed or declined."],
      ["equipment-hire", "Rental quotes are followed up before the machine is offered to someone else."],
    ],
    local: {
      us: "Quote follow up automation (plus free follow-up email templates)",
      ca: "Quote follow up automation (plus free follow-up email templates)",
      uk: "Quote follow up automation for UK trades (plus free email templates)",
      au: "Quote follow up for tradies — automatic, plus free email templates",
    },
    templates: [
      ["2 days after the quote", "Hi {first name}, just checking the quote for {job} came through OK. Happy to answer any questions or adjust anything — just reply here. {your name}"],
      ["7 days after the quote", "Hi {first name}, our diary is filling up for {month}. If you'd like to go ahead with {job}, reply 'yes' and we'll lock in a date. {your name}"],
      ["14 days after the quote", "Hi {first name}, I'll close this quote for now so it doesn't clutter your inbox. If anything changes, reply any time and we'll pick it straight back up. {your name}"],
    ],
    faq: [
      ["Will it keep emailing after the customer replies?", "No — any reply stops the sequence and alerts you."],
      ["Which quoting tools does it work with?", "Common ones include Jobber, Housecall Pro, ServiceTitan, QuickBooks estimates, Xero quotes and spreadsheets."],
      ["Can I write the messages?", "Yes. We draft them in your voice and you approve them before anything goes out."],
    ],
  },
  {
    slug: "google-reviews",
    title: "Get more 5-star Google reviews automatically",
    short: "More 5-star reviews",
    metaDescription: "A review request goes to every happy customer at the right moment, and every review gets a reply. Builds your Google profile without you remembering to ask. From $1,100.",
    problem: [
      "Most happy customers would leave a review — they just aren't asked at the right moment. Asking by hand is easy to forget when the day is busy.",
      "Automatic review requests go out after a job is paid or an appointment ends, with a direct link to your Google profile. Replies to new reviews are drafted for you to approve.",
    ],
    stat: { text: "Only 4% of US consumers say they never read online reviews of businesses.", source: "BrightLocal Local Consumer Review Survey, 2025 (1,026 consumers)", url: "https://www.brightlocal.com/research/local-consumer-review-survey-2025/" },
    fixes: [15],
    trades: [
      ["trades", "Customers get a review link the day the invoice is paid."],
      ["clinics", "Patients get a review request after their visit, sent in line with your policies."],
      ["restaurants", "Guests who booked get a thank-you and review link the next morning."],
      ["retail", "Online buyers get a review request after delivery."],
    ],
    local: {
      us: "Automate Google review requests for your small business",
      ca: "Automate Google review requests for your Canadian business",
      uk: "Automate Google review requests for your UK business",
      au: "Automate Google review requests for tradies & local businesses",
    },
    faq: [
      ["Is it allowed to ask for reviews?", "Yes, asking customers for honest reviews is fine. We never offer incentives, gate reviews or write fake ones."],
      ["Do you reply to reviews for me?", "Replies are drafted in your voice and posted after you approve them."],
      ["Which review sites?", "Google first; Facebook, Yelp and industry sites can be added."],
    ],
  },
  {
    slug: "admin-hours",
    title: "Cut admin time: inbox, bills and bank matching done for you",
    short: "Get admin hours back",
    metaDescription: "Emails sorted with replies drafted, supplier bills read and booked, bank lines matched overnight. Hand back the hours you spend on admin each week. Fixed prices.",
    problem: [
      "Admin grows quietly: sorting email, typing bills into the accounts, matching the bank, copying details between apps. None of it is hard; all of it takes time away from customers.",
      "Automation takes the repetitive parts: email is sorted with replies drafted for one-tap approval, supplier bills are read and booked, and the bank is matched overnight with a short list of anything that needs you.",
    ],
    fixes: [96, 21, 23, 68],
    trades: [
      ["office-teams", "Shared inboxes sorted and routed; one digest of what needs the owner."],
      ["food-production", "Supplier invoices booked with the delivery note attached."],
      ["busy-professionals", "Your inbox triaged with replies drafted, so evenings stay free."],
      ["manufacturing", "Purchase invoices matched to orders and goods received."],
    ],
    local: {
      us: "Inbox automation, invoice processing & QuickBooks/Xero bank reconciliation automation",
      ca: "Xero & QuickBooks bank reconciliation automation, plus inbox automation",
      uk: "Automate purchase invoice processing, Xero bank reconciliation & your inbox",
      au: "Xero bank reconciliation automation, bill processing & inbox automation",
    },
    faq: [
      ["Do you need my email password?", "No. You connect your account with its own secure login, which you can switch off at any time."],
      ["Will it send emails without me?", "Only if you choose. By default replies are drafted for you to approve."],
      ["Does my bookkeeper still need to check things?", "Yes — automation does the typing and matching; your bookkeeper reviews the exceptions."],
    ],
  },
  {
    slug: "profit-dashboard",
    title: "Know your real profit: a monthly management pack that builds itself",
    short: "Know your real profit",
    metaDescription: "Profit and loss, cash, who owes you and margin by product or service — built automatically each month with plain-English notes on what changed. From $3,000.",
    problem: [
      "Many owners only see their numbers when the accountant sends year-end accounts — too late to change anything. Costs creep up and margins shrink without anyone noticing.",
      "An automated management pack pulls from your accounts every month: profit and loss, cash, debtors and margin by product or service, with a short note on what changed and why.",
    ],
    stat: { text: "75% of US small employers cite rising costs as a financial challenge, and 51% report uneven cash flow.", source: "Federal Reserve Small Business Credit Survey, 2025", url: "https://fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2025/2025-report-on-employer-firms.pdf" },
    fixes: [137, 23],
    trades: [
      ["manufacturing", "Margin per product with materials and labor, updated monthly."],
      ["restaurants", "Food and labor cost percentages against sales, week by week."],
      ["equipment-hire", "Revenue and utilization per machine, so you know what earns its keep."],
      ["food-production", "Cost per product and yield, alongside sales."],
    ],
    local: {
      us: "Small business profit dashboard & monthly management reports",
      ca: "Small business profit dashboard & monthly management reports",
      uk: "Monthly management accounts pack & profit dashboard for small businesses",
      au: "Monthly management reports & profit dashboard for small businesses",
    },
    faq: [
      ["Does it replace my accountant?", "No. It gives you the numbers monthly; your accountant still handles tax and year-end."],
      ["Which accounting software?", "QuickBooks, Xero, Sage and Zoho Books."],
      ["Is it a one-off or monthly?", "The build is a fixed one-off price; an optional monthly plan keeps it running and adds new reports."],
    ],
  },
];

export const solutionBySlug = (slug: string) => SOLUTIONS.find((s) => s.slug === slug)!;
