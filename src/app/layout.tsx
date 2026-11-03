import type { Metadata } from "next";
import Link from "next/link";
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
          <div className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/" className="flex items-center gap-2.5 no-underline text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F4F3EE" strokeWidth="2" aria-hidden="true">
                  <path d="M2 4h12M2 8h8M2 12h5" />
                </svg>
              </span>
              <span className="font-display text-xl font-bold">TaskAutopilot</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-6 text-[15px]">
              <Link href="/library" className="font-semibold text-ink">Automation library</Link>
              <Link href="/#assess" className="text-ink">Free assessment</Link>
              <Link href="/#security" className="text-ink">Security</Link>
              <Link href="/#packages" className="btn btn-primary !min-h-[44px]">See prices</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="wrap flex flex-wrap justify-between gap-3 py-8 text-sm text-muted">
          <span>TaskAutopilot · [company number] · [address]</span>
          <span>
            <Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link>
          </span>
        </footer>
      </body>
    </html>
  );
}
