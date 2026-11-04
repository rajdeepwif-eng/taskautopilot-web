"use client";

import { useState } from "react";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

export default function AuditForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);

  if (sent)
    return (
      <div className="flex flex-col gap-3" aria-live="polite">
        <div className="font-display text-[28px] font-bold">{FORMS_LIVE ? "Thanks — we\u2019ve got your request." : "Thanks — almost there."}</div>
        <div className="text-ink-2">{FORMS_LIVE ? `We\u2019ll reply to ${email} within one business day with scope, a fixed audit price and call times.` : FORM_NOT_SENT}</div>
      </div>
    );

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (/.+@.+\..+/.test(email)) { void sendLead("audit", { email, form: Object.fromEntries(new FormData(e.currentTarget)) }); setSent(true); }
        else setErr(true);
      }}
    >
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm">Company<input type="text" name="company" /></label>
        <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm">Work email<input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(false); }} /></label>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm">Team size
          <select name="size"><option>10–50</option><option>51–250</option><option>251–500</option><option>500+</option></select>
        </label>
        <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm">What do you need first?
          <select name="need"><option>Audit &amp; roadmap</option><option>Implementation</option><option>Team training</option><option>Ongoing lead (fractional)</option><option>Not sure — advise me</option></select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">The biggest time sink in your business
        <textarea name="sink" rows={3} placeholder="e.g. Orders retyped between our shop, warehouse and accounts across 3 sites" />
      </label>
      {err && <div className="text-sm text-[#B42318]">Please add a valid work email.</div>}
      <button type="submit" className="btn btn-primary">Request my audit proposal</button>
    </form>
  );
}
