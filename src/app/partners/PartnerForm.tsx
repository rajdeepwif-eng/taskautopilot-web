"use client";
import { useState } from "react";

export default function PartnerForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) return <div className="flex flex-col gap-2"><div className="font-display text-2xl font-bold">Thanks — we&apos;ll be in touch.</div><div className="text-ink-2">Partner terms go to {email} within one business day.</div></div>;
  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (/.+@.+\..+/.test(email)) setSent(true); }}>
      <div className="font-display text-xl font-bold">Apply to partner</div>
      <label className="flex flex-col gap-1.5 text-sm">Firm name<input type="text" name="firm" /></label>
      <label className="flex flex-col gap-1.5 text-sm">Work email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="flex flex-col gap-1.5 text-sm">What you do
        <select name="type"><option>Accountant</option><option>Bookkeeper</option><option>Business adviser / coach</option><option>IT or software reseller</option><option>Other</option></select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">Clients you work with<select name="size"><option>Under 25</option><option>25–100</option><option>100–500</option><option>500+</option></select></label>
      <button type="submit" className="btn btn-primary">Send me partner terms</button>
    </form>
  );
}
