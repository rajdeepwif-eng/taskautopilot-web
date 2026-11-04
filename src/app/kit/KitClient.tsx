"use client";

import { useMemo, useState } from "react";
import QR from "@/components/QR";
import { ON_TEMP_DOMAIN, SITE } from "@/lib/geo";

const TRADES: [string, string, string][] = [
  ["trades", "Plumbers, electricians & builders", "Missed a call on the job? Every caller gets a text back in a minute — with your booking link."],
  ["clinics", "Clinics & dental practices", "After-hours callers get a booking link straight away. Reminders cut no-shows."],
  ["property", "Landlords & property managers", "Maintenance requests logged and acknowledged at any hour. Rent reminders sent on time."],
  ["professional", "Accountants, lawyers & advisors", "Every enquiry answered in a minute, with a consultation booked for you."],
];
const SOURCES: [string, string][] = [["visit", "Door-to-door visit"], ["call", "Phone call follow-up"], ["event", "Trade show or event"], ["partner", "Partner (accountant / bookkeeper)"], ["mail", "Letter or postcard"]];

const SCRIPT: [string, string][] = [
  ["Open (10 sec)", "\"Hi, I'm ___ from TaskAutopilot. Quick one — when you're on a job and the phone rings, what happens to that call?\""],
  ["Listen", "Let them answer. Most say it goes to voicemail or they call back later. Ask: \"How many of those do you think never call back?\""],
  ["Show (30 sec)", "Open the demo on your phone (scan the flyer QR) and press play: missed call → text back → booked."],
  ["Offer", "\"We'll set that up for you for $99. It runs for 30 days, and if you keep going the $99 comes off the price.\""],
  ["Close", "\"Want me to leave this with you? Scan the code when you've got a minute — no sales call, you pick it online.\" Leave the flyer."],
];
const OBJECTIONS: [string, string][] = [
  ["\"I don't have time.\"", "\"That's exactly why — it takes one 10-minute form, then we do the rest.\""],
  ["\"I'm not techy.\"", "\"You don't need to be. We build it in your accounts and show you a test run before it goes live.\""],
  ["\"Too expensive.\"", "\"It's $99 to try. One extra job a month usually covers it many times over.\""],
  ["\"I already have voicemail.\"", "\"Many callers don't leave one — they ring the next business. This texts them before they do.\""],
  ["\"Send me something.\"", "\"Here's the flyer — the QR shows the demo and the price. I'll pop back next week.\""],
];

export default function KitClient() {
  const [t, setT] = useState("trades");
  const [src, setSrc] = useState("visit");
  const [campaign, setCampaign] = useState("");
  const [ref, setRef] = useState("");
  const trade = TRADES.find((x) => x[0] === t)!;
  const url = useMemo(() => {
    const q = new URLSearchParams({ t, src, utm_medium: src === "partner" ? "referral" : "offline" });
    if (campaign.trim()) q.set("utm_campaign", campaign.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40));
    if (ref.trim()) q.set("ref", ref.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32));
    return `${SITE}/go/?${q.toString()}`;
  }, [t, src, campaign, ref]);
  const [copied, setCopied] = useState(false);

  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <section className="no-print flex flex-col gap-3">
        <div className="kicker">Sales kit · internal</div>
        <h1 className="m-0 font-display text-[clamp(30px,4.5vw,44px)] font-bold tracking-tight">Flyers, QR codes and the door-to-door script</h1>
        <p className="m-0 max-w-[760px] text-ink-2">Make a flyer for a street, an event or a partner. Each QR code carries its own tag, so every reservation shows which visit, event or partner it came from.</p>
      </section>

      {ON_TEMP_DOMAIN && <div role="alert" className="no-print rounded-lg border-2 border-[#B12704] bg-[#FFF4E5] p-4 text-[15px]"><b>Don&apos;t print in bulk yet.</b> These QR codes point to the temporary github.io address. Once the custom domain is live they&apos;ll update automatically — print after that, or flyers already handed out will break.</div>}
      <section className="no-print card grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Who is it for?
          <select value={t} onChange={(e) => setT(e.target.value)}>{TRADES.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Where will it be used?
          <select value={src} onChange={(e) => setSrc(e.target.value)}>{SOURCES.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Campaign name <span className="font-normal text-muted">e.g. &quot;northside-week1&quot; or &quot;home-show-2026&quot;</span>
          <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Partner code <span className="font-normal text-muted">(optional, for a partner&apos;s flyers)</span>
          <input type="text" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. SMITHCO" />
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <code className="min-w-0 flex-1 break-all rounded bg-[#F7F8F8] px-2 py-1.5 text-[13px]">{url}</code>
          <button type="button" className="btn btn-outline !min-h-[44px]" onClick={() => { try { navigator.clipboard.writeText(url); } catch { /* blocked */ } setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "✓ Copied" : "Copy link"}</button>
          <button type="button" className="btn btn-primary !min-h-[44px]" onClick={() => window.print()}>Print flyer</button>
        </div>
      </section>

      {/* The flyer (A5-friendly). Only this prints. */}
      <section className="print-sheet mx-auto flex w-full max-w-[560px] flex-col gap-4 rounded-xl border-2 border-ink bg-white p-7 text-ink">
        <div className="text-[13px] font-bold uppercase tracking-wide text-clay">TaskAutopilot · for {trade[1].toLowerCase()}</div>
        <div className="font-display text-[30px] font-bold leading-tight">Stop losing jobs to missed calls.</div>
        <p className="m-0 text-[17px]">{trade[2]}</p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[16px]">
          <li>✓ Try one automation for <b>$99</b> — set up for you</li>
          <li>✓ Live in 5 business days, in your own accounts</li>
          <li>✓ $99 credited if you upgrade · no sales call</li>
        </ul>
        <div className="flex items-center gap-4 border-t border-line pt-4">
          <QR url={url} size={130} />
          <div className="flex flex-col gap-1 text-[15px]"><b>Scan to see the 30-second demo and the price.</b><span className="break-all text-muted">Or visit {SITE.replace("https://", "")}/go/</span></div>
        </div>
      </section>

      <section className="no-print grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-3 p-5">
          <h2 className="m-0 text-xl font-bold">Door-to-door script (2 minutes)</h2>
          <ol className="m-0 flex flex-col gap-2 pl-5 text-[15px] text-ink-2">{SCRIPT.map(([k, v]) => <li key={k}><b className="text-ink">{k}:</b> {v}</li>)}</ol>
        </div>
        <div className="card flex flex-col gap-3 p-5">
          <h2 className="m-0 text-xl font-bold">Common objections</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-ink-2">{OBJECTIONS.map(([k, v]) => <li key={k}><b className="text-ink">{k}</b> {v}</li>)}</ul>
        </div>
        <div className="card flex flex-col gap-2 p-5 lg:col-span-2">
          <h2 className="m-0 text-xl font-bold">Weekly target (conservative plan)</h2>
          <p className="m-0 text-[15px] text-ink-2">20 visits or calls a week to one trade in one area · leave a flyer at every stop · follow up a week later · log each stop in your CRM with the campaign name above so the results line up with reservations.</p>
        </div>
      </section>
    </main>
  );
}
