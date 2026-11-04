"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { APP_GROUPS } from "@/lib/apps";
import { byId } from "@/lib/catalogue";
import { FORMS_LIVE, FORM_NOT_SENT } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

/** The 10-minute setup form after purchase: everything we need to build without a call. */
export default function SetupClient() {
  const [ids, setIds] = useState<number[]>([]);
  const [f, setF] = useState({ business: "", name: "", email: "", phone: "", approver: "", tone: "Friendly and short", exceptions: "", examples: "", other: "" });
  const [apps, setApps] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { try { const q = new URLSearchParams(window.location.search).get("plan") || ""; setIds(q.split(",").map(Number).filter((n) => n && byId(n))); } catch { /* ignore */ } }, []);
  const set = (k: keyof typeof f, v: string) => { setF({ ...f, [k]: v }); setErr(""); };
  const toggle = (a: string) => setApps(apps.includes(a) ? apps.filter((x) => x !== a) : [...apps, a]);

  if (sent) {
    return (
      <main className="wrap flex max-w-[760px] flex-col gap-4 pb-16 pt-12">
        <h1 className="m-0 font-display text-3xl font-bold">{FORMS_LIVE ? "Got it — your build is in the queue." : "Thanks — almost there."}</h1>
        <p className="m-0 text-ink-2">{FORMS_LIVE ? "We'll email you within 1 business day with the next step: a secure link to connect each app with its own login. Nothing goes live until you approve the test run." : FORM_NOT_SENT}</p>
        <Link href="/" className="btn btn-outline self-start">Back to the site</Link>
      </main>
    );
  }

  return (
    <main className="wrap flex max-w-[860px] flex-col gap-6 pb-16 pt-10">
      <div className="kicker">Setup form · about 10 minutes</div>
      <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">Tell us how your business works — we&apos;ll do the rest.</h1>
      {ids.length > 0 && <div className="card p-4 text-[15px]"><b>Your order:</b> {ids.map((i) => byId(i).name).join(" · ")}</div>}
      <div className="rounded-lg bg-[#F0F8F3] px-4 py-3 text-[14px] text-ink-2">🔒 Don&apos;t type passwords here. You&apos;ll connect each app later with its own secure sign-in.</div>
      <form className="flex flex-col gap-5" onSubmit={(e) => {
        e.preventDefault();
        if (!f.business.trim()) return setErr("Please add your business name.");
        if (!/.+@.+\..+/.test(f.email)) return setErr("Please add an email we can reach you on.");
        if (!f.approver.trim()) return setErr("Tell us who signs off the test run.");
        void sendLead("setup", { ...f, apps, items: ids });
        setSent(true);
      }}>
        <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">1 · About you</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">Business name<input type="text" value={f.business} onChange={(e) => set("business", e.target.value)} /></label>
            <label className="flex flex-col gap-1.5 text-sm">Your name<input type="text" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
            <label className="flex flex-col gap-1.5 text-sm">Email<input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
            <label className="flex flex-col gap-1.5 text-sm">Phone <span className="text-muted">(optional)</span><input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
          </div>
        </fieldset>
        <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">2 · The apps you use</legend>
          {APP_GROUPS.map(([g, list]) => (
            <div key={g} className="flex flex-wrap items-center gap-2"><span className="w-[110px] text-[13px] text-muted">{g}</span>
              {list.map((a) => <button key={a} type="button" aria-pressed={apps.includes(a)} onClick={() => toggle(a)} className={`min-h-[40px] cursor-pointer rounded-full border px-3 text-sm ${apps.includes(a) ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>{a}</button>)}
            </div>
          ))}
          <label className="flex flex-col gap-1.5 text-sm">Anything else? <input type="text" value={f.other} onChange={(e) => set("other", e.target.value)} placeholder="e.g. Jobber, ServiceM8, a booking site" /></label>
        </fieldset>
        <fieldset className="card flex flex-col gap-3 p-5"><legend className="px-1 font-bold">3 · How it should behave</legend>
          <label className="flex flex-col gap-1.5 text-sm">Who signs off the test run?<input type="text" value={f.approver} onChange={(e) => set("approver", e.target.value)} placeholder="Name and email" /></label>
          <label className="flex flex-col gap-1.5 text-sm">Tone for messages to customers
            <select value={f.tone} onChange={(e) => set("tone", e.target.value)}><option>Friendly and short</option><option>Formal and polite</option><option>Match a message I&apos;ll paste below</option></select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">Exceptions — when should a person handle it instead?<textarea rows={3} value={f.exceptions} onChange={(e) => set("exceptions", e.target.value)} placeholder="e.g. complaints, VIP customers, anything over $5,000" /></label>
          <label className="flex flex-col gap-1.5 text-sm">Paste 1–2 real examples <span className="text-muted">(a typical customer message, quote or invoice wording — remove anything private)</span><textarea rows={4} value={f.examples} onChange={(e) => set("examples", e.target.value)} /></label>
        </fieldset>
        {!FORMS_LIVE && <div className="rounded-lg bg-[#FFF4E5] px-3 py-2 text-[14px] text-ink-2">Heads up: our inbox opens at launch, so this form can&apos;t be sent just yet.</div>}
        {err && <div role="alert" className="text-sm text-[#B12704]">{err}</div>}
        <button type="submit" className="btn btn-primary self-start">Send my setup form</button>
      </form>
    </main>
  );
}
