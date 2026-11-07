import type { Metadata } from "next";
import PartnerForm from "./PartnerForm";
import PartnerKit from "./PartnerKit";

export const metadata: Metadata = { title: { absolute: "Referral partner program for accountants | TaskAutoMode" }, description: "Introduce clients who are drowning in admin. They get automations; you get a referral fee." };

export default function PartnersPage() {
  return (
    <main>
      <section className="wrap flex flex-wrap gap-10 pb-16 pt-12">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4">
          <div className="kicker">Partner program</div>
          <h1 className="m-0 font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.05] tracking-tight">Accountants, bookkeepers and advisors: your clients&apos; admin pain is our work.</h1>
          <p className="m-0 text-lg text-ink-2">You see the late invoices, the shoebox receipts and the owner doing everything at midnight. Introduce them; we fix it with fixed-price automations.</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[16px]">
            <li>✓ A referral fee on every client who buys — terms sent when you apply. You tell each client in writing that you receive a fee and how much, before they buy (your professional body’s code and our terms both require it)</li>
            <li>✓ If clients buy our bookkeeping automations, bills, receipts and bank lines arrive matched</li>
            <li>✓ You stay the trusted advisor — we never offer accounting services</li>
            <li>✓ A free time-leak scan you can send to clients</li>
          </ul>
        </div>
        <div className="card min-w-0 flex-[1_1_380px] p-6"><PartnerForm /></div>
      </section>
      <section className="wrap flex flex-col gap-4 pb-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">How it works</h2>
        <ol className="m-0 grid grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {["Make your link below and send it to a client (or print the QR for your office).", "Your client tries a $99 starter or buys a fix online — no sales call, nothing for you to manage.", "We credit you on every client who buys through your link, under the partner terms we send when you apply."].map((x, i) => (
            <li key={x} className="card flex list-none gap-3 p-5 text-[15px]"><b className="text-muted">0{i + 1}</b><span>{x}</span></li>
          ))}
        </ol>
      </section>
      <section className="wrap flex flex-col gap-3 pb-16">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Your partner toolkit</h2>
        <div className="card p-5"><PartnerKit /></div>
      </section>
    </main>
  );
}
