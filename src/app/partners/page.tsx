import type { Metadata } from "next";
import PartnerForm from "./PartnerForm";

export const metadata: Metadata = { title: "Partner program for accountants & advisors — TaskAutopilot", description: "Introduce clients who are drowning in admin. They get automations; you get a referral fee." };

export default function PartnersPage() {
  return (
    <main>
      <section className="wrap flex flex-wrap gap-10 pb-16 pt-12">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4">
          <div className="kicker">Partner program</div>
          <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Accountants, bookkeepers and advisors: your clients&apos; admin pain is our work.</h1>
          <p className="m-0 text-lg text-ink-2">You see the late invoices, the shoebox receipts and the owner doing everything at midnight. Introduce them; we fix it with fixed-price automations.</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[16px]">
            <li>✓ A referral fee on every client who buys — terms sent when you apply (partners tell their clients about the fee)</li>
            <li>✓ If clients buy our bookkeeping automations, bills, receipts and bank lines arrive matched</li>
            <li>✓ You stay the trusted advisor — we never offer accounting services</li>
            <li>✓ A free time-leak scan you can send to clients</li>
          </ul>
        </div>
        <div className="card min-w-0 flex-[1_1_380px] p-6"><PartnerForm /></div>
      </section>
    </main>
  );
}
