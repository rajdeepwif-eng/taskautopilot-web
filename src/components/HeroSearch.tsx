import Link from "next/link";

// Ranked by what owners report losing most (Fed Small Business Credit Survey 2025, QuickBooks Late Payments
// Report 2025, call-answer studies, Xero admin-time guide, BrightLocal 2025). Cheapest first step linked for each.
const SUGGEST: { label: string; href: string }[] = [
  { label: "Get paid faster", href: "/p/22/" },
  { label: "Never miss a lead", href: "/p/11/" },
  { label: "Follow up every quote", href: "/p/13/" },
  { label: "Get admin hours back", href: "/p/96/" },
  { label: "More 5-star reviews", href: "/p/15/" },
  { label: "Know your real profit", href: "/p/137/" },
];

/** Most-wanted outcomes as quick links (the site header holds the search box). */
export default function HeroSearch({ showSource = true }: { showSource?: boolean } = {}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[14px] font-bold text-ink">Where owners lose the most — fix one first:</div>
      <div className="flex flex-wrap gap-2">
        {SUGGEST.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[14px] text-ink no-underline shadow-[0_1px_2px_rgba(15,17,17,0.1)] hover:border-[#007185] hover:bg-[#EDFDFF] hover:text-ink">{s.label}</Link>
        ))}
      </div>
      {showSource && <div className="text-[12px] text-muted">Ranked from US research: 56% of small businesses are owed money on unpaid invoices (QuickBooks, 2025); 51% struggle with uneven cash flow and 57% with winning customers (Federal Reserve, 2025).</div>}
    </div>
  );
}
