"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { captureTouch, sendLead } from "@/lib/attribution";
import { TRADES } from "@/lib/trades";
import { byId, priceLabel } from "@/lib/catalogue";
import { flowFor } from "@/lib/buying";
import { ConsentBox } from "@/components/LeadBits";
import { openAssistant } from "@/components/FrontDoor";

/** Vanity URLs (spoken in videos, printed on flyers) arrive with no UTM tags; tag them so the CRM knows the channel. */
export function TagSource({ source, medium }: { source: string; medium: string }) {
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      if (!u.searchParams.get("utm_source")) {
        u.searchParams.set("utm_source", source); u.searchParams.set("utm_medium", medium);
        window.history.replaceState(null, "", u.toString()); captureTouch();
      }
    } catch { /* best effort */ }
  }, [source, medium]);
  return null;
}

/** Lead magnet: the priced menu of automations for one business type, shown straight away after an email. */
export function PricedMenu() {
  const [trade, setTrade] = useState(TRADES[0].slug);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const t = TRADES.find((x) => x.slug === trade)!;
  const ids = [...new Set([...t.top, ...((t as { journey?: [string, number[]][] }).journey ?? []).flatMap(([, i]) => i)])].filter((i) => byId(i)).slice(0, 12);
  return (
    <div className="flex flex-col gap-4" data-testid="priced-menu">
      {!open ? (
        <form className="card flex flex-col gap-3 p-5" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return setErr("Add your name."); if (!/.+@.+\..+/.test(email)) return setErr("Add a valid email."); void sendLead("guide", { name, email, trade, guide: "priced-menu", marketingConsent: consent }); setOpen(true); }}>
          <label className="flex flex-col gap-1.5 text-[15px] font-semibold">Your business type
            <select value={trade} onChange={(e) => setTrade(e.target.value)} data-testid="menu-trade">{TRADES.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select>
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-[15px] font-semibold">Your name<input type="text" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} data-testid="menu-name" /></label>
            <label className="flex flex-col gap-1.5 text-[15px] font-semibold">Work email<input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} data-testid="menu-email" /></label>
          </div>
          <ConsentBox checked={consent} onChange={setConsent} id="consent-menu" />
          {err && <span role="alert" className="text-[13px] font-semibold text-[#B12704]">{err}</span>}
          <button type="submit" className="btn btn-primary self-start text-[17px]" data-testid="menu-open">Show me the priced menu →</button>
          <span className="text-[12.5px] text-muted">It opens right here. We&apos;ll also email you a copy.</span>
        </form>
      ) : (
        <div className="flex flex-col gap-3" data-testid="menu-list">
          <h2 className="m-0 font-display text-[clamp(24px,3.5vw,32px)] font-bold">Automations for {t.name.toLowerCase()} — fixed prices</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ids.map((id) => { const p = byId(id); return (
              <Link key={id} href={`/p/${id}/`} className="card flex flex-col gap-1 p-4 text-ink no-underline hover:border-ink">
                <div className="flex items-baseline justify-between gap-2"><b className="text-[16px]">{p.name}</b><b className="whitespace-nowrap">{priceLabel(p)}</b></div>
                <span className="text-[14px] text-ink-2">{flowFor(p).result}</span>
                <span className="text-[12.5px] text-muted">{p.monthly ? "Monthly service" : `Live in about ${p.days} business days`} · built around how you work</span>
              </Link>
            ); })}
          </div>
          <div className="flex flex-wrap gap-2"><button type="button" className="btn btn-primary" onClick={() => openAssistant()}>Which one first? Ask us →</button><Link href="/starter/" className="btn btn-outline">Try one for $99</Link></div>
        </div>
      )}
    </div>
  );
}
