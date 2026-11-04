/**
 * Comparison pages for buyers weighing options. Kept factual and even-handed: each side gets
 * a "choose this if". Our prices come from the catalogue; we quote no third-party prices.
 */
export type Compare = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  a: string; // the other option
  b: string; // our option
  rows: [string, string, string][]; // [criterion, a, b]
  chooseA: string[];
  chooseB: string[];
  verdict: string;
  fixes: number[]; // products to show
  faq: [string, string][];
};

export const COMPARES: Compare[] = [
  {
    slug: "automation-vs-hiring",
    title: "Automation vs hiring an assistant: which saves a small business more?",
    metaTitle: "Automation vs hiring an assistant (or a VA)",
    metaDescription: "Should you hire an admin, use a virtual assistant or automate? An honest side-by-side on cost, speed, cover and judgement, with when each wins.",
    intro: "Most owners reach a point where admin eats the evenings. The usual answer is to hire — in-house or a virtual assistant. Automation is the other option. They're good at different things, and the best setups use both.",
    a: "Hiring (in-house or virtual assistant)",
    b: "Done-for-you automation",
    rows: [
      ["Cost", "An hourly or salaried cost that continues every month, plus time to recruit, train and manage", "One fixed build price, then optional support from a few hundred a month"],
      ["Hours covered", "Working hours, with cover needed for holidays and sickness", "24/7, including evenings and weekends"],
      ["Speed on repeat tasks", "Minutes per task, and it varies with workload", "Seconds, the same way every time"],
      ["Judgement and relationships", "Strong — reads situations, handles upset customers", "Follows your rules; hands anything unusual to a person"],
      ["Scales with volume", "Needs more hours or more people", "Handles more volume for the same price (usage costs aside)"],
      ["When someone leaves", "Know-how can leave with them", "Documented and stays in your own accounts"],
    ],
    chooseA: ["The work needs judgement on most items, not rules", "You need someone on the phone building relationships", "Tasks change every week and are hard to describe"],
    chooseB: ["The same steps repeat every day (reminders, data entry, follow-ups)", "Things slip after hours or when you're busy", "You want a fixed cost instead of another wage"],
    verdict: "Automate the repetitive steps first, then hire for judgement. An assistant who isn't typing reminders and copying invoices gets far more done.",
    fixes: [11, 22, 96],
    faq: [
      ["Will automation replace my staff?", "It takes the repetitive part of their job, so they spend time on customers and decisions. Most owners automate before hiring, or to stop a new hire drowning in admin."],
      ["Can a virtual assistant run the automations?", "Yes. Automations send alerts and tasks to whoever you choose, including a VA."],
      ["What does automation cost compared with a wage?", "Our builds are fixed one-off prices shown on each product, with optional monthly support. Every product page works out the value using your own hours and hourly cost."],
    ],
  },
  {
    slug: "done-for-you-vs-diy-automation",
    title: "Done-for-you automation vs DIY with Zapier, Make or n8n",
    metaTitle: "Done-for-you automation vs DIY (Zapier, Make, n8n)",
    metaDescription: "DIY automation tools are powerful but take time to learn, build and fix. Compare doing it yourself with a fixed-price, done-for-you build.",
    intro: "Tools like Zapier, Make and n8n let anyone connect apps. We use the same kind of tools ourselves. The real question isn't the tool — it's whose time goes into designing, testing and fixing it.",
    a: "DIY with an automation tool",
    b: "Done-for-you build",
    rows: [
      ["Upfront cost", "Tool subscription only", "Fixed build price"],
      ["Your time", "Hours to learn, design and test — often evenings", "One setup form and one test run to approve"],
      ["When something breaks", "You find out when a customer complains, then debug it", "Failure alerts and fixes with a support plan"],
      ["Edge cases", "Easy to miss until they bite (duplicates, refunds, time zones)", "Designed in from experience and tested with your data"],
      ["Ownership", "Yours", "Yours — built in your own accounts, with a handover guide"],
      ["Best for", "Simple, low-risk tasks and people who enjoy building", "Money and customer-facing tasks where mistakes cost"],
    ],
    chooseA: ["The task is simple and low-risk", "You enjoy building and have spare hours", "You're happy to monitor and fix it yourself"],
    chooseB: ["It touches money or customers (invoices, bookings, replies)", "Your time is worth more running the business", "You want it tested, documented and watched"],
    verdict: "DIY is great for small, low-stakes tasks. For anything that touches cash or customers, a tested build with failure alerts usually pays for itself in the first mistake it avoids.",
    fixes: [22, 13, 15],
    faq: [
      ["Which tool do you build on?", "Whatever fits your apps — often n8n, Zapier or Make, or the automation built into your existing software. It runs in your accounts, so you're never locked in."],
      ["Can I edit it myself afterwards?", "Yes. You get a written handover guide, and everything is in your own accounts."],
      ["Do you sell DIY kits too?", "Yes — our DIY kits give you the templates and instructions to build it yourself."],
    ],
  },
  {
    slug: "missed-call-text-back-vs-ai-receptionist",
    title: "Missed-call text-back vs AI receptionist: which do you need?",
    metaTitle: "Missed call text back vs AI receptionist",
    metaDescription: "Text-back replies after a missed call; an AI receptionist answers the call itself. Compare cost, setup time and fit, and see which to start with.",
    intro: "Both stop missed calls turning into lost jobs. The difference is when they act: text-back replies after the call rings out, while an AI receptionist answers the call and handles it there and then.",
    a: "Missed-call text-back",
    b: "AI receptionist",
    rows: [
      ["What it does", "Texts the caller within a minute with your booking link", "Answers the call, answers questions, books the job"],
      ["Caller experience", "A quick text; they book or wait for your call-back", "A conversation now, 24/7"],
      ["Setup time", "About a week", "About three weeks"],
      ["Price", "From $600 fixed build", "From $4,600 fixed build, plus a monthly plan with a minutes cap"],
      ["Best when", "You miss a handful of calls a week", "Calls are constant or come mostly after hours"],
      ["Complex calls", "You call back", "Passed to you with a summary"],
    ],
    chooseA: ["You miss a few calls a week", "You want the cheapest, fastest fix", "Most callers just want a time slot"],
    chooseB: ["Calls are constant and you can't call back fast", "Many calls come after hours", "Callers ask the same questions every day"],
    verdict: "Start with text-back if you miss a handful of calls; move to an AI receptionist when volume grows. Many owners run text-back first, then upgrade.",
    fixes: [11, 7, 10],
    faq: [
      ["Can I start with text-back and upgrade later?", "Yes. Many owners start with text-back, then add a receptionist as calls grow — the two work side by side."],
      ["Will callers know the receptionist is AI?", "Yes — it introduces itself as your virtual assistant and passes the call to a person on request."],
      ["Do I need a new number?", "No. Both work with your existing business number."],
    ],
  },
];

export const compareBySlug = (s: string) => COMPARES.find((c) => c.slug === s)!;
