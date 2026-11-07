"use client";
import { useState } from "react";
import Link from "next/link";

const LINKS: [string, string][] = [["/library/", "All automations"], ["/#trades", "By business type"], ["/starter/", "$99 starter — try one"], ["/menu/", "Free priced menu"], ["/services/", "How it works"], ["/ways-to-pay/", "Ways to pay"], ["/consulting/", "Custom work & audit"], ["/learn/", "Learn: courses & DIY kits"], ["/ask/", "Ask us free"]];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" aria-expanded={open} aria-label={open ? "Close menu" : "Menu"} onClick={() => setOpen(!open)} className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-white/60 bg-transparent" data-testid="menu-toggle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-line bg-white shadow-lg" data-testid="menu-sheet">
          <nav className="mx-auto flex max-w-[1240px] flex-col px-4 py-2 text-[16px] [&>a]:border-b [&>a]:border-line [&>a]:py-3 [&>a]:text-ink [&>a]:no-underline [&>a:last-child]:border-0" aria-label="Mobile">
            {LINKS.map(([h, t]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{t}</Link>)}
          </nav>
        </div>
      )}
    </div>
  );
}
