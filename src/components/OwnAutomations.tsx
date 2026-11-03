/** What runs every day in the owners' own businesses (from the live n8n account, 3 Nov 2026). Names anonymised. */
const GROUPS: { dept: string; items: string[] }[] = [
  { dept: "Sales & leads", items: [
    "Every new email posted to the team with a suggested reply",
    "Website, WhatsApp, Facebook and Instagram leads routed to one channel",
    "Website forms saved straight into the CRM",
    "New local firms found by web search and checked against the company register",
    "Newly registered companies near the yard added as prospects",
    "Missing email addresses found for prospects",
    "Large contractors researched before anyone contacts them",
    "Daily summary of new leads",
    "Personal outreach drafts built, approved by the owner, then sent",
    "Replies, bounces and opt-outs logged automatically",
    "Google review requested after every paid invoice",
    "Directory listings checked quarterly for the right name, phone and hours",
  ]},
  { dept: "Finance", items: [
    "Bank reconciliation overnight, with a checker the next morning",
    "Supplier invoices read and booked into the accounts",
    "Supplier invoices read with document AI and filed (India)",
    "Weekly invoice sign-off list for the owner",
    "Quarterly backup of every invoice and receipt",
  ]},
  { dept: "Operations & bookings", items: [
    "Live delivery slots shown at checkout",
    "Customers look up and change their own booking",
    "Daily run sheets and checklists sent to the driver",
    "Off-hire collections scheduled with return checks",
  ]},
  { dept: "Safety & compliance", items: [
    "Failed inspection items turned into owned tasks until fixed",
    "Maintenance due dates turned into tasks before they lapse",
    "Insurance, certificates and filing deadlines flagged at 30, 14 and 0 days",
  ]},
  { dept: "Stock & yard", items: [
    "QR stock take, deliveries and new items logged from a phone",
    "Items taken out or put back logged by shelf QR",
    "Diesel tank logged litre by litre, with a weekly meter check",
    "Diesel price change alert with the new price to charge",
    "Low-stock alerts with approval to reorder",
    "Printable QR shelf labels",
  ]},
  { dept: "Owner & management", items: [
    "Owner's quick replies in chat turned into task changes",
    "Jobs delegated from a chat message to the task system",
  ]},
  { dept: "Keeping it all running", items: [
    "Instant alert on any failed run",
    "Missed-run check seven times a day",
    "Daily watchdog for new, changed or quietly failing workflows",
  ]},
];

export const LIVE_COUNT = GROUPS.reduce((a, g) => a + g.items.length, 0);
/** Active workflows in the n8n account on 3 Nov 2026 (some jobs use several workflows). */
export const LIVE_WORKFLOWS = 43;

export default function OwnAutomations() {
  return (
    <section className="border-y border-line bg-[#ECEAE2]">
      <div className="wrap flex flex-col gap-5 py-16">
        <div className="kicker">Proof, not promises</div>
        <h2 className="m-0 max-w-[820px] font-display text-[clamp(28px,4vw,40px)] leading-tight">
          {LIVE_COUNT} jobs run every day in our own businesses — equipment hire, food, farming and property.
        </h2>
        <p className="m-0 max-w-[720px] text-ink-2">{LIVE_WORKFLOWS} live workflows behind them. We built these for ourselves first — every one is something you can buy, adapted to your apps.</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {GROUPS.map((g) => (
            <div key={g.dept} className="card flex flex-col gap-2 p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-lg font-bold">{g.dept}</div>
                <span className="font-mono text-xs text-ok">● {g.items.length} live</span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[14px] leading-snug text-ink-2">
                {g.items.map((i) => <li key={i}>✓ {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
