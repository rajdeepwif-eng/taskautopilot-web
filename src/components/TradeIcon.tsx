/** Original line icons, one per trade. */
const I: Record<string, [string, string, string]> = {
  trades: ["#F9ECE7", "#B23A0B", "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"],
  "equipment-hire": ["#F9EEDA", "#9A6200", "M3 18h11M4 18v-3h9l1 3M6 15V11h5l2 4M13 11l4-6 4 3-3 3M5 21a1.5 1.5 0 1 0 0-.1M12 21a1.5 1.5 0 1 0 0-.1"],
  restaurants: ["#FBEBEB", "#A32424", "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"],
  "food-production": ["#E5F4E4", "#1A7F4E", "M3 21V10l5 3V10l5 3V6h8v15zM15 3c0 2 2 2 2 4"],
  farming: ["#E5F4E4", "#11653E", "M12 21V11M12 11c0-4 3-7 8-7 0 5-3 7-8 7zM12 14c0-3-2-5-7-5 0 4 2 5 7 5zM5 21h14"],
  clinics: ["#E7F1FB", "#1E5FA8", "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"],
  property: ["#EFEDFF", "#5546C8", "M3 11l9-7 9 7M5 9.5V21h14V9.5M10 21v-6h4v6"],
  professional: ["#F0EFEC", "#3A3D42", "M4 8h16v12H4zM9 8V5h6v3M4 13h16"],
  retail: ["#F9EEDA", "#7A4E00", "M5 8h14l-1 13H6zM9 8a3 3 0 0 1 6 0"],
  logistics: ["#E7F1FB", "#15457A", "M2 7h12v9H2zM14 10h4l3 3v3h-7M6 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1"],
  manufacturing: ["#F0EFEC", "#15171A", "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"],
  "busy-professionals": ["#E6ECF7", "#1F3E73", "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"],
  solo: ["#F9EEDA", "#7A4E00", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"],
  "office-teams": ["#15171A", "#F2B36B", "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M12 20a6 6 0 0 1 10 0"],
};

export default function TradeIcon({ slug, size = 40 }: { slug: string; size?: number }) {
  const [bg, fg, d] = I[slug] ?? I.professional;
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: bg }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
    </div>
  );
}
