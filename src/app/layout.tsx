import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/CatArt";
import "@fontsource-variable/inter";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskAutopilot — Get found. Get booked. Get paid.",
  description:
    "Ready-made AI automations, booking websites and local SEO for every kind of business. Watch each one work, see the price, pay online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="border-b border-line">
          <div className="wrap flex items-center justify-between gap-4 py-3.5">
            <Link href="/" className="flex items-center gap-2.5 no-underline text-ink">
              <Logo />
              <span className="font-display text-xl font-bold">TaskAutopilot</span>
            </Link>
            <nav className="hidden items-center gap-6 text-[15px] lg:flex">
              <Link href="/#trades" className="font-semibold text-ink">Shop by trade</Link>
              <Link href="/planner/" className="text-ink">Planner</Link>
              <Link href="/academy/" className="text-ink">Courses</Link>
              <Link href="/consulting/" className="text-ink">Consulting</Link>
              <Link href="/ask/" className="text-ink">Can we automate it?</Link>
              <Link href="/library/" className="btn btn-primary !min-h-[44px]">Browse &amp; buy</Link>
            </nav>
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/library/" className="btn btn-primary !min-h-[40px] !px-4 whitespace-nowrap text-sm">Browse &amp; buy</Link>
              <details className="relative">
                <summary aria-label="Menu" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line [&::-webkit-details-marker]:hidden">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                </summary>
                <div className="absolute right-0 top-12 z-40 flex w-56 flex-col gap-1 rounded-xl border border-line bg-white p-3 text-[15px] shadow-lg [&>a]:py-2">
                  <Link href="/#trades" className="font-semibold text-ink">Shop by trade</Link>
              <Link href="/planner/" className="text-ink">Planner</Link>
              <Link href="/academy/" className="text-ink">Courses</Link>
              <Link href="/consulting/" className="text-ink">Consulting</Link>
              <Link href="/ask/" className="text-ink">Can we automate it?</Link>
              <Link href="/insurance/" className="text-ink">Insurance</Link>
                  <Link href="/legal-firms/" className="text-ink">Law firms</Link>
                  <Link href="/#security" className="text-ink">Security</Link>
                </div>
              </details>
            </div>
          </div>
        </header>
        {children}
        <footer className="wrap flex flex-wrap justify-between gap-3 py-8 text-sm text-muted">
          <span>© 2026 TaskAutopilot · Prices in US dollars</span>
          <span className="flex flex-wrap gap-4"><Link href="/insurance/">Insurance</Link><Link href="/legal-firms/">Law firms</Link><Link href="/results/">Results panel</Link><Link href="/partners/">Partners</Link><Link href="/scan/">Free leak scan</Link><Link href="/kits/">Starter kits</Link><Link href="/demo/">Try it live</Link><Link href="/library/">All automations</Link><Link href="/#security">Security</Link></span>
          <span>
            <Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link>
          </span>
        </footer>
      </body>
    </html>
  );
}
