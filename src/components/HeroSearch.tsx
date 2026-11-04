import Link from "next/link";

// Highest-demand, highest-value jobs across trades (from the trade problem research).
const SUGGEST: { label: string; href: string }[] = [
  { label: "Invoice on time", href: "/p/125/" },
  { label: "Get paid on time", href: "/p/22/" },
  { label: "See net profit", href: "/p/137/" },
  { label: "Never miss a call", href: "/p/7/" },
  { label: "Follow up quotes", href: "/p/13/" },
  { label: "More reviews", href: "/p/15/" },
];

/** Most-wanted outcomes as quick links (the site header holds the search box). */
export default function HeroSearch() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[14px] font-bold text-ink">Most wanted:</div>
      <div className="flex flex-wrap gap-2">
        {SUGGEST.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[14px] text-ink no-underline shadow-[0_1px_2px_rgba(15,17,17,0.1)] hover:border-[#007185] hover:bg-[#EDFDFF] hover:text-ink">{s.label}</Link>
        ))}
      </div>
    </div>
  );
}
