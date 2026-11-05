import Link from "next/link";

// Ranked by what owners report losing most (Fed Small Business Credit Survey 2025, QuickBooks Late Payments
// Report 2025, call-answer studies, Xero admin-time guide, BrightLocal 2025). Cheapest first step linked for each.
const SUGGEST: { label: string; href: string }[] = [
  { label: "Get paid faster", href: "/solutions/get-paid-faster/" },
  { label: "Never miss a lead", href: "/solutions/missed-calls/" },
  { label: "Follow up every quote", href: "/solutions/quote-follow-up/" },
  { label: "Get admin hours back", href: "/solutions/admin-hours/" },
  { label: "More 5-star reviews", href: "/solutions/google-reviews/" },
  { label: "Answer every call", href: "/solutions/ai-receptionist/" },
  { label: "Know your real profit", href: "/solutions/profit-dashboard/" },
];

/** Most-wanted outcomes as quick links (the site header holds the search box). */
export default function HeroSearch({ showSource = false, prefix = "" }: { showSource?: boolean; prefix?: string } = {}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[14px] font-bold text-ink">Where owners lose the most — fix one first:</div>
      <div className="flex flex-wrap gap-2">
        {SUGGEST.map((s) => (
          <Link key={s.label} href={`${prefix}${s.href}`} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[14px] text-ink no-underline shadow-[0_1px_2px_rgba(15,17,17,0.1)] hover:border-[#007185] hover:bg-[#EDFDFF] hover:text-ink">{s.label}</Link>
        ))}
      </div>
      {showSource && <div className="text-[12px] text-muted">Ranked from US research: 56% of small businesses are owed money on unpaid invoices (QuickBooks, 2025); 51% struggle with uneven cash flow and 57% with winning customers (Federal Reserve, 2025).</div>}
    </div>
  );
}
