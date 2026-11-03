/** Original line icons and tints per catalogue category, used until real demo thumbnails exist. */
const TINT: Record<string, [string, string]> = {
  "Get found (SEO)": ["#E7F1FB", "#1E5FA8"],
  "Websites & portals": ["#EFEDFF", "#5546C8"],
  "AI agents": ["#F9ECE7", "#B23A0B"],
  Sales: ["#E5F4E4", "#1A7F4E"],
  Marketing: ["#F9EEDA", "#9A6200"],
  Finance: ["#E5F4E4", "#11653E"],
  Operations: ["#F0EFEC", "#3A3D42"],
  Industry: ["#E7F1FB", "#15457A"],
  Compliance: ["#EFEDFF", "#3F3299"],
  Monitoring: ["#FBEBEB", "#A32424"],
  "Solo (self-employed)": ["#F9EEDA", "#7A4E00"],
  "Owner & management": ["#15171A", "#F2B36B"],
  "DIY kits": ["#E5F4E4", "#1A7F4E"],
};

const PATHS: Record<string, string> = {
  "Get found (SEO)": "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  "Websites & portals": "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01",
  "AI agents": "M4 5h16v11H9l-5 4zM12 8l.9 1.9L15 10.8l-2.1.9L12 14l-.9-2.3-2.1-.9 2.1-.9z",
  Sales: "M12 21a9 9 0 1 1 9-9M12 17a5 5 0 1 1 5-5M12 13a1 1 0 1 1 1-1M13 11l8-8M17 3h4v4",
  Marketing: "M3 10v4h4l7 5V5L7 10zM18 8a5 5 0 0 1 0 8",
  Finance: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  Operations: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M9 15l2 2 4-4",
  Industry: "M3 21V10l6-4v4l6-4v4l6-4v15zM7 17h2M12 17h2M17 17h2",
  Compliance: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  Monitoring: "M3 12h4l3-7 4 14 3-7h4",
  "Solo (self-employed)": "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  "Owner & management": "M3 7l4 4 5-6 5 6 4-4-2 11H5zM5 21h14",
  "DIY kits": "M14 6l4 4M4 20l6-1 10-10-5-5L5 14zM12 6l6 6",
};

export function CatArt({ cat, size = 56 }: { cat: string; size?: number }) {
  const [bg, fg] = TINT[cat] ?? ["#F0EFEC", "#3A3D42"];
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: bg }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={PATHS[cat] ?? PATHS.Operations} />
      </svg>
    </div>
  );
}

/** TaskAutopilot mark: a task path that ends in a tick, inside a rounded square. Original design. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#15171A" />
      <circle cx="8" cy="22" r="2.2" fill="#F2B36B" />
      <path d="M10 21c4-1 5-9 9-10" fill="none" stroke="#F4F3EE" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.1 3.6" />
      <path d="M17.5 12.5l3 3 6-7" fill="none" stroke="#B23A0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
