import type { Metadata } from "next";
import Link from "next/link";
import { Subscribe } from "@/components/LeadBits";
import CurrencySwitch, { CurrencyApplier } from "@/components/Currency";
import { AskButton } from "@/components/FrontDoor";
import MobileMenu from "@/components/MobileMenu";
import { HeaderSearch, PlanLink } from "@/components/StoreBar";
import "./globals.css";
import FooterFixes from "@/components/FooterFixes";
import Attribution from "@/components/Attribution";
import Analytics from "@/components/Analytics";
import Assistant from "@/components/Assistant";
import { SITE } from "@/lib/geo";
import { COMPANY } from "@/lib/launch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE + "/"),
  openGraph: { type: "website", siteName: "TaskAutoMode", images: [{ url: `${SITE}/og.png`, width: 1200, height: 630, alt: "TaskAutoMode — Switch on. Get your time back." }] },
  alternates: { canonical: "./" },
  twitter: { card: "summary_large_image" },
  title: "TaskAutoMode — everyday tasks, automated for you",
  description:
    "Ready-made AI automations, booking websites and local SEO for every kind of business. See how each one works, see the price, pay online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": `${SITE}/#org`, name: "TaskAutoMode", slogan: "Everyday tasks, automated for you", url: `${SITE}/`, logo: `${SITE}/icon.svg`, areaServed: ["US", "GB", "AU", "CA"], description: "Done-for-you, fixed-price business automation for owner-run businesses." },
          { "@type": "WebSite", name: "TaskAutoMode", url: `${SITE}/`, potentialAction: { "@type": "SearchAction", target: `${SITE}/library/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
        ] }) }} />
        <header className="sticky top-0 z-30 bg-[#131921] text-white">
          <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-2.5 sm:gap-5">
            <Link href="/" className="flex shrink-0 items-center rounded no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${process.env.PAGES_BASE_PATH || ""}/logo-header.svg`} alt="TaskAutoMode — everyday tasks, automated for you" width={190} height={30} className="h-[26px] w-auto sm:h-[32px]" />
            </Link>
            <nav className="hidden shrink-0 items-center gap-0.5 whitespace-nowrap text-[14px] font-medium lg:flex [&>a]:rounded-lg [&>a]:px-2.5 [&>a]:py-1.5 [&>a]:text-white [&>a]:no-underline [&>a:hover]:bg-white/15" aria-label="Main">
              <Link href="/library/">All automations</Link>
              <Link href="/#trades">By business type</Link>
              <Link href="/starter/">$99 starter</Link>
              <Link href="/services/">How it works</Link>
              <Link href="/consulting/">Custom &amp; audit</Link>
              <Link href="/learn/">Learn</Link>
            </nav>
            <div className="hidden min-w-0 flex-1 md:flex lg:ml-auto lg:w-[230px] lg:flex-none"><HeaderSearch /></div>
            <AskButton label="Get a price" className="btn btn-primary ml-auto shrink-0 whitespace-nowrap !min-h-[42px] !px-4 md:ml-0" />
            <PlanLink />
            <MobileMenu />
          </div>
          <div className="px-4 pb-2.5 md:hidden"><HeaderSearch /></div>
        </header>
        {children}
        <CurrencyApplier />
        <Attribution />
        <Analytics />
        <Assistant />
        <footer className="mt-auto bg-[#232F3E] text-[#DDD] [&_a]:text-[#DDD] [&_a:hover]:text-white">
          <div className="wrap border-b border-white/15 py-8"><div className="max-w-[560px]"><Subscribe /></div></div>
          <div className="wrap grid grid-cols-2 gap-6 py-10 text-sm md:grid-cols-5">
            <div className="flex flex-col gap-2"><b className="text-white">Shop</b><Link href="/library/">All automations</Link><Link href="/#trades">Shop by business type</Link><Link href="/starter/">Starter offer</Link><Link href="/kits/">Industry & DIY kits</Link><Link href="/academy/">Courses</Link></div>
            <FooterFixes />
            <div className="flex flex-col gap-2"><b className="text-white">Not sure yet?</b><Link href="/services/">How we work</Link><Link href="/ask/">Ask us free</Link><Link href="/planner/">Build my plan</Link><Link href="/scan/">Free leak scan</Link><Link href="/demos/">See it run (demos)</Link><Link href="/ways-to-pay/">Ways to pay</Link><Link href="/startups/">Startups: automation for equity</Link><Link href="/selling-or-retiring/">Selling or retiring</Link><Link href="/consulting/">Consulting for teams</Link><Link href="/compare/automation-vs-hiring/">Automation vs hiring</Link><Link href="/compare/done-for-you-vs-diy-automation/">Done-for-you vs DIY</Link><Link href="/compare/missed-call-text-back-vs-ai-receptionist/">Text-back vs AI receptionist</Link></div>
            <div className="flex flex-col gap-2"><b className="text-white">Industries</b><Link href="/insurance/">Insurance</Link><Link href="/legal-firms/">Law firms</Link><Link href="/results/">Results panel</Link><Link href="/partners/">Partners</Link><Link href="/integrations/xero/">Xero</Link><Link href="/integrations/quickbooks/">QuickBooks</Link><Link href="/integrations/jobber/">Jobber</Link><Link href="/integrations/servicem8/">ServiceM8</Link><span className="flex gap-3"><Link href="/uk/">UK</Link><Link href="/au/">Australia</Link><Link href="/ca/">Canada</Link></span></div>
            <div className="flex flex-col gap-2"><b className="text-white">Policies</b><Link href="/legal/terms/">Terms</Link><Link href="/legal/refunds/">Refunds</Link><Link href="/legal/privacy/">Privacy</Link><Link href="/legal/dpa/">Data processing</Link><Link href="/#security">Security</Link></div>
          </div>
          <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-4 text-[13px]" data-testid="company-line"><div>{COMPANY.legalName ? <>{COMPANY.legalName}{COMPANY.regNumber && <> · Company no. {COMPANY.regNumber}</>}{COMPANY.address && <> · {COMPANY.address}</>}{COMPANY.email && <> · <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></>}{COMPANY.phone && <> · <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a></>}<br /></> : <>Registered company name, number and address are added at launch.<br /></>}© 2026 TaskAutoMode · UK, Australian and Canadian pages show fixed local prices; other pages convert from US$ for guidance</div><div className="[&_select]:!border-white/15 [&_select]:!bg-[#232F3E] [&_select]:!text-white [&_select]:!py-1 [&_label]:text-[#DDD]"><CurrencySwitch /></div></div>
        </footer>
      </body>
    </html>
  );
}
