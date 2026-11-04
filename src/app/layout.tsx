import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/CatArt";
import CurrencySwitch, { CurrencyApplier } from "@/components/Currency";
import { HeaderSearch, PlanLink } from "@/components/StoreBar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rajdeepwif-eng.github.io/taskautopilot-web/"),
  openGraph: { type: "website", siteName: "TaskAutopilot"},
  title: "TaskAutopilot — things get done without you doing them",
  description:
    "Ready-made AI automations, booking websites and local SEO for every kind of business. See how each one works, see the price, pay online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header>
          <div className="bg-[#131921] text-white">
            <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
              <Link href="/" className="flex shrink-0 items-center gap-2 rounded px-1 py-1 text-white no-underline hover:outline hover:outline-1 hover:outline-white">
                <Logo />
                <span className="hidden text-[19px] font-bold tracking-tight sm:inline">TaskAutopilot</span>
              </Link>
              <div className="hidden min-w-0 flex-1 md:flex"><HeaderSearch /></div>
              <div className="hidden shrink-0 lg:block [&_select]:!border-0 [&_select]:!bg-transparent [&_select]:!text-white [&_select]:!py-1 [&_option]:text-black"><CurrencySwitch /></div>
              <Link href="/ask/" className="hidden shrink-0 flex-col rounded px-1.5 py-1 leading-tight text-white no-underline hover:outline hover:outline-1 hover:outline-white lg:flex">
                <span className="text-[12px] text-[#CCC]">Not sure?</span><span className="text-[14px] font-bold">Ask us free</span>
              </Link>
              <div className="ml-auto md:ml-0"><PlanLink /></div>
            </div>
            <div className="px-3 pb-2 md:hidden"><HeaderSearch /></div>
          </div>
          <nav className="bg-[#232F3E] text-white">
            <div className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto whitespace-nowrap px-2 py-1 text-[14px] [&>a]:rounded [&>a]:px-2 [&>a]:py-1.5 [&>a]:text-white [&>a]:no-underline [&>a:hover]:outline [&>a:hover]:outline-1 [&>a:hover]:outline-white">
              <Link href="/library/" className="font-bold">☰ All automations</Link>
              <Link href="/#trades">Shop by trade</Link>
              <Link href="/starter/">$99 starter</Link>
              <Link href="/kits/">Starter kits</Link>
              <Link href="/demo/">Try it live</Link>
              <Link href="/planner/">Planner</Link>
              <Link href="/academy/">Courses</Link>
              <Link href="/consulting/">Consulting</Link>
              <Link href="/ask/" className="lg:!hidden">Ask us free</Link>
              <span className="px-2 lg:hidden [&_select]:!border-0 [&_select]:!bg-transparent [&_select]:!text-white [&_select]:!py-0.5 [&_option]:text-black"><CurrencySwitch /></span>
            </div>
          </nav>
        </header>
        {children}
        <CurrencyApplier />
        <footer className="mt-10 bg-[#232F3E] text-[#DDD] [&_a]:text-[#DDD]"><div className="wrap flex flex-wrap justify-between gap-3 py-8 text-sm">
          <span>© 2026 TaskAutopilot · Prices in US dollars</span>
          <span className="flex flex-wrap gap-4"><Link href="/insurance/">Insurance</Link><Link href="/legal-firms/">Law firms</Link><Link href="/results/">Results panel</Link><Link href="/partners/">Partners</Link><Link href="/scan/">Free leak scan</Link><Link href="/kits/">Starter kits</Link><Link href="/demo/">Try it live</Link><Link href="/library/">All automations</Link><Link href="/uk/">UK</Link><Link href="/au/">Australia</Link><Link href="/ca/">Canada</Link><Link href="/#security">Security</Link></span>
          <span>
            <Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link>
          </span>
        </div></footer>
      </body>
    </html>
  );
}
