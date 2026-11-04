"use client";

import { useState } from "react";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import Link from "next/link";
import { sendLead } from "@/lib/attribution";

export default function AskClient() {
  const [f, setF] = useState({ task: "", often: "Every day", apps: "", link: "", email: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, v: string) => { setF({ ...f, [k]: v }); setErr(""); };

  if (sent)
    return (
      <div className="flex flex-col gap-3">
        <div className="font-display text-3xl font-bold">{FORMS_LIVE ? "Got it — we\u2019ll reply within 1 business day." : "Thanks — almost there."}</div>
        <p className="m-0 text-ink-2">{FORMS_LIVE ? `You\u2019ll hear from us at ${f.email} with a clear yes or no, a fixed price if it\u2019s a yes, and how long it takes. No charge for the answer.` : FORM_NOT_SENT}</p>
        <Link href="/library/" className="btn btn-outline self-start">Keep browsing</Link>
      </div>
    );

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => {
      e.preventDefault();
      if (f.task.trim().length < 15) return setErr("Tell us a little more about the task — a sentence or two is perfect.");
      if (!/.+@.+\..+/.test(f.email)) return setErr("Please add your email so we can reply.");
      void sendLead("ask", { ...f });
      setSent(true);
    }}>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">1 · What task do you want to stop doing by hand?
        <textarea rows={4} value={f.task} onChange={(e) => set("task", e.target.value)} className="font-normal" placeholder="e.g. Every morning I copy orders from our website into a spreadsheet and email the warehouse the list." />
      </label>
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-sm font-semibold">2 · How often?
          <select value={f.often} onChange={(e) => set("often", e.target.value)} className="font-normal">
            <option>Many times a day</option><option>Every day</option><option>Every week</option><option>Every month</option><option>Now and then</option>
          </select>
        </label>
        <label className="flex flex-[2_1_260px] flex-col gap-1.5 text-sm font-semibold">3 · Which apps are involved?
          <input type="text" value={f.apps} onChange={(e) => set("apps", e.target.value)} className="font-normal" placeholder="e.g. Shopify, Excel, Gmail" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">4 · Optional: a link to a screen recording, SOP or example file
        <input type="url" value={f.link} onChange={(e) => set("link", e.target.value)} className="font-normal" placeholder="Loom, Google Drive or OneDrive link" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">5 · Your email
        <input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className="font-normal" placeholder="you@company.com" />
      </label>
      {err && <div role="alert" className="text-sm text-[#B42318]">{err}</div>}
      {!FORMS_LIVE && <div className="rounded-lg bg-[#FFF4E5] px-3 py-2 text-[14px] text-ink-2">Heads up: our inbox opens at launch, so questions can&apos;t be sent just yet. Browse the shop or check back soon.</div>}
      <button type="submit" className="btn btn-primary">Ask — it&apos;s free</button>
      <div className="text-[13px] text-muted">Don&apos;t include passwords or customer personal data. We&apos;ll only use this to answer you.</div>
    </form>
  );
}
