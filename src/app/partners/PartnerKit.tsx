"use client";

import { useMemo, useState } from "react";
import QR from "@/components/QR";
import { SITE } from "@/lib/geo";

/** Short, readable code from a firm name: drops generic words, e.g. "Smith & Co Bookkeeping Ltd" → SMITHCO. */
const toCode = (s: string) => s.toUpperCase().replace(/\b(BOOKKEEPING|BOOKKEEPERS|ACCOUNTING|ACCOUNTANTS|ACCOUNTANCY|SERVICES|LTD|LLC|LIMITED|INC|PTY|CPA|CPAS|AND|THE)\b/g, "").replace(/[^A-Z0-9]+/g, "").slice(0, 12);

/** Lets a partner make their own tracked link, QR code and client email in seconds. */
export default function PartnerKit() {
  const [firm, setFirm] = useState("");
  const [t, setT] = useState("trades");
  const code = toCode(firm) || "YOURFIRM";
  const url = useMemo(() => `${SITE}/go/?${new URLSearchParams({ t, ref: code, utm_medium: "referral", utm_source: "partner" })}`, [t, code]);
  const email = `Subject: A quick fix for the admin we talked about

Hi {client name},

You mentioned how much time goes on chasing invoices and calls. A team we work with, TaskAutoMode, sets up fixed-price automations for exactly this — reminders that go out on their own, calls texted back, bills booked into the accounts.

You can try one for $99 (set up for you, credited if you carry on). Have a look here — there's a 30-second demo:
${url}

Happy to talk it through.
{your name}`;
  const [copied, setCopied] = useState("");
  const copy = (k: string, v: string) => { try { navigator.clipboard.writeText(v); } catch { /* blocked */ } setCopied(k); setTimeout(() => setCopied(""), 2000); };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Your firm name
          <input type="text" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="e.g. Smith & Co Bookkeeping" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Your clients are mostly…
          <select value={t} onChange={(e) => setT(e.target.value)}>
            <option value="trades">Trades & home services</option><option value="clinics">Clinics & dental</option><option value="property">Property</option><option value="professional">Professional firms</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <QR url={url} size={140} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="text-sm">Your referral code: <b>{code}</b></div>
          <code className="break-all rounded bg-[#F7F8F8] px-2 py-1.5 text-[13px]">{url}</code>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-outline !min-h-[44px]" onClick={() => copy("link", url)}>{copied === "link" ? "✓ Link copied" : "Copy my link"}</button>
            <button type="button" className="btn btn-outline !min-h-[44px]" onClick={() => copy("email", email)}>{copied === "email" ? "✓ Email copied" : "Copy client email"}</button>
          </div>
          <div className="text-[13px] text-muted">Use the same firm name on your application so referrals are credited to you. Tell clients you receive a referral fee.</div>
        </div>
      </div>
      <details className="text-[14px]"><summary className="cursor-pointer font-semibold">Preview the client email</summary><pre className="mt-2 whitespace-pre-wrap rounded bg-[#F7F8F8] p-3 font-sans text-[14px] text-ink-2">{email}</pre></details>
    </div>
  );
}
