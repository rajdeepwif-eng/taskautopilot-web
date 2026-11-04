"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FIXES: [string, string][] = [["get-paid-faster", "Get paid faster"], ["missed-calls", "Missed call text back"], ["quote-follow-up", "Quote follow-up"], ["google-reviews", "Google review requests"], ["admin-hours", "Cut admin time"], ["ai-receptionist", "AI receptionist"], ["profit-dashboard", "Profit dashboard"]];

/** Links to the solution guides in the edition the visitor is reading (/uk, /au, /ca or US). */
export default function FooterFixes() {
  const m = (usePathname() || "/").match(/^\/(uk|au|ca)(\/|$)/);
  const pre = m ? `/${m[1]}` : "";
  return (<div className="flex flex-col gap-2"><b className="text-white">Popular fixes</b>{FIXES.map(([s, n]) => <Link key={s} href={`${pre}/solutions/${s}/`}>{n}</Link>)}{pre === "/uk" && <Link href="/tools/late-payment-interest-calculator/">Late payment interest calculator</Link>}</div>);
}
