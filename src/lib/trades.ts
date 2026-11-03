/** Trade storefronts: what each kind of customer sees first. */
export type Trade = {
  slug: string; name: string; short: string; cat: string; industry?: string;
  headline: string; pains: [string, string][]; kit: string; top: number[]; apps: string; faq: [string, string][];
};

const SAFE: [string, string] = ["Do I need to be technical?", "No. We build it in your own accounts, show you a test run, and hand over a short guide. Most owners spend about 30 minutes with us in total."];
const OWN: [string, string] = ["What if I stop paying the monthly fee?", "You keep everything we built — it lives in your accounts. The monthly plan only covers monitoring and fixes."];

export const TRADES: Trade[] = [
  { slug: "trades", name: "Trades & home services", short: "Plumbers, electricians, builders, cleaners", cat: "Operations", industry: "Trades & home services",
    headline: "Answer every call, chase every quote, get paid — while you're on the tools.",
    pains: [["\"I miss calls when I'm up a ladder.\"", "Every missed call gets a text back in seconds with your booking link."], ["\"Quotes go quiet and I forget to chase.\"", "Polite follow-ups go out until the customer decides."], ["\"I'm doing invoices at 10pm.\"", "Invoices go out when the job is done; late payers are chased for you."]],
    kit: "Trades starter kit", top: [11, 10, 13, 26, 22, 65], apps: "Jobber, Housecall Pro, ServiceM8, Xero, QuickBooks, Google, WhatsApp", faq: [SAFE, OWN] },
  { slug: "equipment-hire", name: "Equipment hire & construction", short: "Plant hire, tool hire, contractors", cat: "Industry", industry: "Construction & equipment hire",
    headline: "Book more hires, keep machines safe and get paid without chasing.",
    pains: [["\"Enquiries come in at night and go elsewhere.\"", "Every enquiry gets a reply and a booking link within a minute."], ["\"Checks and defects live on paper.\"", "Pre-use checks on a phone; failed items become fixes with photo proof."], ["\"Invoices and bank matching eat my week.\"", "Bills booked and bank lines matched overnight."]],
    kit: "Equipment hire starter kit", top: [10, 11, 97, 98, 22, 23], apps: "SafetyCulture, Airtable, Xero, QuickBooks, Zoho Books, Google, WhatsApp",
    faq: [SAFE, ["Who signs off inspections?", "Your competent person. We schedule, remind and record — statutory sign-off always stays with them."], OWN] },
  { slug: "restaurants", name: "Restaurants & hospitality", short: "Restaurants, cafés, takeaways, hotels", cat: "Operations", industry: "Restaurants & hospitality",
    headline: "Fewer no-shows, bills booked without typing, staff on the right shifts.",
    pains: [["\"No-shows cost us tables every weekend.\"", "Reminders go out and empty slots are offered to the waitlist."], ["\"Supplier invoices pile up.\"", "Bills are read and booked into your accounts automatically."], ["\"Who's working tomorrow?\"", "Rotas, leave and GPS clock-in in one place."]],
    kit: "Restaurant starter kit", top: [35, 21, 79, 30, 15, 64], apps: "OpenTable, Toast, Square, Deputy, Homebase, Xero, WhatsApp", faq: [SAFE, OWN] },
  { slug: "food-production", name: "Food production & processing", short: "Food factories, bakeries, packers", cat: "Industry", industry: "Food production & processing",
    headline: "Audit-ready records every day — not the week before the audit.",
    pains: [["\"Our HACCP records are paper and gaps get found at audit.\"", "Digital checks at every CCP; anything out of limit opens a corrective action."], ["\"A mock recall takes us a day.\"", "Lots scanned at goods-in and linked to every batch — trace in minutes."], ["\"Supplier certificates expire without us noticing.\"", "Certificates collected and chased before they lapse."]],
    kit: "Food factory starter kit (BRCGS-ready)", top: [81, 82, 83, 85, 86, 100], apps: "Excel, Google Sheets, SafetyCulture, Airtable, your ERP",
    faq: [SAFE, ["Do you set our critical limits?", "No. Limits and methods come from your HACCP plan and your food safety team approves them. We make the records easy and complete."], OWN] },
  { slug: "farming", name: "Farming & agriculture", short: "Farms, growers, orchards", cat: "Industry", industry: "Farming & agriculture",
    headline: "Know what was done in every field, by whom — and what it earned.",
    pains: [["\"Workers don't know today's jobs.\"", "Your crop calendar becomes dated tasks with photo proof."], ["\"Spray records are scattered.\"", "Every application recorded for audits and buyers."], ["\"I don't know my real yield per acre.\"", "Harvest and sales logged, compared with last season."]],
    kit: "Farm starter kit", top: [87, 88, 89, 90, 91, 79], apps: "WhatsApp, Google Sheets, Airtable, Excel",
    faq: [SAFE, ["Will it tell us what to spray?", "No. Rates come from the product label and your agronomist. The photo triage only suggests what to check; an expert confirms."], OWN] },
  { slug: "clinics", name: "Clinics & healthcare", short: "Dental, physio, med spa, vets", cat: "Industry", industry: "Clinics & healthcare",
    headline: "Patients book themselves, reminders cut no-shows, every call is answered.",
    pains: [["\"The phone rings while we're with patients.\"", "An AI receptionist answers, books and passes urgent calls to you."], ["\"No-shows leave gaps in the diary.\"", "Reminders and easy rebooking go out automatically."], ["\"Intake forms are clipboards.\"", "Digital intake forms before the visit."]],
    kit: "Clinic starter kit", top: [33, 7, 15, 64, 96, 100], apps: "Dentrix, Jane, Cliniko, Google Calendar, Weave",
    faq: [SAFE, ["Is patient data handled properly?", "Patient data runs only on services that sign a business associate agreement (BAA), set up with your compliance adviser."], OWN] },
  { slug: "property", name: "Property & real estate", short: "Landlords, letting agents, managers", cat: "Industry", industry: "Real estate & property",
    headline: "Tenants looked after, repairs closed out, rent chased — without the phone glued to you.",
    pains: [["\"Maintenance requests come by text, email and calls.\"", "One form logs every request with photos and assigns a contractor."], ["\"Rent chasing is awkward.\"", "Polite reminders and statements go out on schedule."], ["\"Viewings enquiries go unanswered.\"", "Every enquiry answered with a booking link in a minute."]],
    kit: "Property starter kit", top: [34, 10, 22, 98, 38, 7], apps: "AppFolio, Buildium, Xero, QuickBooks, Google, WhatsApp", faq: [SAFE, OWN] },
  { slug: "professional", name: "Law, accounting & insurance", short: "Law firms, accountants, insurance agencies", cat: "Industry", industry: "Professional services",
    headline: "Turn more enquiries into clients — and stop chasing documents.",
    pains: [["\"Prospects call three firms and pick whoever answers first.\"", "Every enquiry gets a reply and a booking link within a minute."], ["\"We chase clients for the same documents every year.\"", "Forms and documents are requested, checked and chased automatically."], ["\"Renewals slip.\"", "Renewals are contacted 60, 30 and 7 days out."]],
    kit: "Professional firm starter kit", top: [32, 10, 45, 96, 93, 7], apps: "Clio, Karbon, Xero Practice Manager, AgencyZoom, Microsoft 365",
    faq: [SAFE, ["Does any legal or advice decision get automated?", "No. Automation collects and organises; advice, conflicts and claim decisions stay with your people."], OWN] },
  { slug: "retail", name: "Retail & e-commerce", short: "Shops, online stores, brands", cat: "Marketing", industry: "Retail & e-commerce",
    headline: "Answer 'where's my order?' instantly and win back the carts you lose.",
    pains: [["\"Half our messages are 'where's my order?'\"", "An assistant answers with live order status on web and WhatsApp."], ["\"Shoppers leave at checkout.\"", "Abandoned-cart reminders and post-purchase flows run themselves."], ["\"Stock and orders don't match.\"", "Orders sync to stock, warehouse and accounts without retyping."]],
    kit: "Shop starter kit", top: [8, 20, 28, 27, 15, 64], apps: "Shopify, WooCommerce, Square, Klaviyo, Xero, QuickBooks", faq: [SAFE, OWN] },
  { slug: "logistics", name: "Logistics & transport", short: "Hauliers, couriers, removals", cat: "Operations", industry: "Logistics & transport",
    headline: "Jobs dispatched, proof captured, drivers and vehicles kept on track.",
    pains: [["\"Run sheets are made by hand every morning.\"", "Jobs become run sheets on drivers' phones automatically."], ["\"Proof of delivery goes missing.\"", "Photos and signatures captured and sent to the customer."], ["\"Who started when?\"", "GPS clock-in and vehicle checks, with defects chased."]],
    kit: "Transport starter kit", top: [26, 29, 79, 91, 97, 68], apps: "Google Maps, Airtable, Xero, QuickBooks, WhatsApp", faq: [SAFE, OWN] },
  { slug: "manufacturing", name: "Manufacturing & wholesale", short: "Workshops, factories, distributors", cat: "Industry", industry: "Manufacturing & wholesale",
    headline: "Paperwork into your systems, stock under control, checklists closed out.",
    pains: [["\"We retype purchase orders and delivery notes.\"", "Documents are read and entered automatically."], ["\"Stock counts never match.\"", "Scan stock in and out; low stock and reorders flagged."], ["\"Machine checks and defects slip.\"", "Checklists scheduled; defects chased until fixed."]],
    kit: "Factory starter kit", top: [36, 27, 28, 97, 98, 100], apps: "Excel, Google Sheets, your ERP, Xero, QuickBooks, SafetyCulture", faq: [SAFE, OWN] },
  { slug: "office-teams", name: "Offices & growing teams", short: "Any business with 5–500 staff", cat: "Owner & management",
    headline: "Delegate in one message, see who did what, and stop drowning in email.",
    pains: [["\"I chase people for updates all day.\"", "SOP tasks with proof, an evening exceptions list and a Friday scorecard."], ["\"My inbox runs my day.\"", "Emails sorted, replies drafted, one digest of what needs you."], ["\"Nobody trained the new starter.\"", "Training by role on their phone, with sign-off and records."]],
    kit: "Team accountability kit", top: [101, 96, 61, 62, 63, 100], apps: "Asana, ClickUp, Monday.com, Slack, Teams, Gmail, Outlook", faq: [SAFE, OWN] },
];

export const tradeBySlug = (s: string) => TRADES.find((t) => t.slug === s)!;
