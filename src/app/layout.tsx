import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/CatArt";
import CurrencySwitch, { CurrencyApplier } from "@/components/Currency";
import { HeaderSearch, PlanLink } from "@/components/StoreBar";
import "./globals.css";
import FooterFixes from "@/components/FooterFixes";
import Attribution from "@/components/Attribution";
import Analytics from "@/components/Analytics";
import heroImg from "@/assets/hero.jpg";
import { SITE } from "@/lib/geo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE + "/"),
  openGraph: { type: "website", siteName: "TaskAutoMode", images: [heroImg.src] },
  alternates: { canonical: "./" },
  twitter: { card: "summary_large_image" },
  title: "TaskAutoMode — everyday tasks, automated for you",
  description:
    "Ready-made AI automations, booking websites and local SEO for every kind of business. See how each one works, see the price, pay online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": `${SITE}/#org`, name: "TaskAutoMode", url: `${SITE}/`, logo: `${SITE}/icon.svg`, areaServed: ["US", "GB", "AU", "CA"], description: "Done-for-you, fixed-price business automation for owner-run businesses." },
          { "@type": "WebSite", name: "TaskAutoMode", url: `${SITE}/`, potentialAction: { "@type": "SearchAction", target: `${SITE}/library/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
        ] }) }} />
        <header>
          <div className="bg-[#131921] text-white">
            <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
              <Link href="/" className="flex shrink-0 items-center gap-2 rounded px-1 py-1 text-white no-underline hover:outline hover:outline-1 hover:outline-white">
                <Logo size={26} />
                <span className="text-[17px] font-extrabold tracking-tight sm:text-[20px]">Task<span className="text-[#FF9900]">AutoMode</span></span>
              </Link>
              <div className="hidden min-w-0 flex-1 md:flex"><HeaderSearch /></div>
              <div className="shrink-0 [&_select]:!border-0 [&_select]:!bg-transparent [&_select]:!text-white [&_select]:!py-1 [&_option]:text-black"><CurrencySwitch /></div>
              <Link href="/ask/" className="hidden shrink-0 flex-col rounded px-1.5 py-1 leading-tight text-white no-underline hover:outline hover:outline-1 hover:outline-white lg:flex">
                <span className="text-[12px] text-[#CCC]">Not sure?</span><span className="text-[14px] font-bold">Ask us free</span>
              </Link>
              <div className="ml-auto md:ml-0"><PlanLink /></div>
            </div>
            <div className="px-3 pb-2 md:hidden"><HeaderSearch /></div>
          </div>
          <nav className="relative bg-[#232F3E] text-white after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-[#232F3E] after:to-transparent lg:after:hidden">
            <div className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto whitespace-nowrap px-2 py-1 text-[14px] [&>a]:rounded [&>a]:px-2 [&>a]:py-1.5 [&>a]:text-white [&>a]:no-underline [&>a:hover]:outline [&>a:hover]:outline-1 [&>a:hover]:outline-white">
              <Link href="/library/" className="font-bold">☰ All automations</Link>
              <Link href="/#trades">Shop by trade</Link>
              <Link href="/starter/">Starter offer</Link>
              <Link href="/kits/">Industry kits</Link>
              <Link href="/demo/">Sample chat</Link>
              <Link href="/planner/">Planner</Link>
              <Link href="/academy/">Courses</Link>
              <Link href="/consulting/">Consulting</Link>
              <Link href="/ask/" className="lg:!hidden">Ask us free</Link>
            </div>
          </nav>
        </header>
        {children}
        <CurrencyApplier />
        <Attribution />
        <Analytics />
        <footer className="bg-[#232F3E] text-[#DDD] [&_a]:text-[#DDD] [&_a:hover]:text-white">
          <div className="wrap grid grid-cols-2 gap-6 py-10 text-sm md:grid-cols-5">
            <div className="flex flex-col gap-2"><b className="text-white">Shop</b><Link href="/library/">All automations</Link><Link href="/#trades">Shop by business type</Link><Link href="/starter/">Starter offer</Link><Link href="/kits/">Industry & DIY kits</Link><Link href="/academy/">Courses</Link></div>
            <FooterFixes />
            <div className="flex flex-col gap-2"><b className="text-white">Not sure yet?</b><Link href="/ask/">Ask us free</Link><Link href="/planner/">Build my plan</Link><Link href="/scan/">Free leak scan</Link><Link href="/demos/">See it run (demos)</Link><Link href="/consulting/">Consulting for teams</Link><Link href="/compare/automation-vs-hiring/">Automation vs hiring</Link><Link href="/compare/done-for-you-vs-diy-automation/">Done-for-you vs DIY</Link><Link href="/compare/missed-call-text-back-vs-ai-receptionist/">Text-back vs AI receptionist</Link></div>
            <div className="flex flex-col gap-2"><b className="text-white">Industries</b><Link href="/insurance/">Insurance</Link><Link href="/legal-firms/">Law firms</Link><Link href="/results/">Results panel</Link><Link href="/partners/">Partners</Link><Link href="/integrations/xero/">Xero</Link><Link href="/integrations/quickbooks/">QuickBooks</Link><Link href="/integrations/jobber/">Jobber</Link><Link href="/integrations/servicem8/">ServiceM8</Link><span className="flex gap-3"><Link href="/uk/">UK</Link><Link href="/au/">Australia</Link><Link href="/ca/">Canada</Link></span></div>
            <div className="flex flex-col gap-2"><b className="text-white">Policies</b><Link href="/legal/terms/">Terms</Link><Link href="/legal/refunds/">Refunds</Link><Link href="/legal/privacy/">Privacy</Link><Link href="/legal/dpa/">Data processing</Link><Link href="/#security">Security</Link></div>
          </div>
          <div className="wrap border-t border-[#3A4553] py-4 text-[13px]">© 2026 TaskAutoMode · UK, Australian and Canadian pages show fixed local prices; other pages convert from US$ for guidance</div>
        </footer>
      </body>
    </html>
  );
}
