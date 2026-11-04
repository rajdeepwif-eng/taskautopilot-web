"use client";

import { useEffect, useState } from "react";
import { GA4_ID, GOOGLE_ADS_CONVERSION_LABEL, GOOGLE_ADS_ID, META_PIXEL_ID } from "@/lib/launch";

const KEY = "ta-consent";
const ANY = !!(GA4_ID || GOOGLE_ADS_ID || META_PIXEL_ID);

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: ((...a: unknown[]) => void) & { q?: unknown[] } };

function load(src: string) {
  const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s);
}

function start() {
  const w = window as W;
  if (GA4_ID || GOOGLE_ADS_ID) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() { // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    if (GA4_ID) w.gtag("config", GA4_ID);
    if (GOOGLE_ADS_ID) w.gtag("config", GOOGLE_ADS_ID);
    load(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || GOOGLE_ADS_ID}`);
  }
  if (META_PIXEL_ID && !w.fbq) {
    const f = function fbq(...a: unknown[]) { (f.q = f.q || []).push(a); } as ((...a: unknown[]) => void) & { q?: unknown[] };
    w.fbq = f; f("init", META_PIXEL_ID); f("track", "PageView");
    load("https://connect.facebook.net/en_US/fbevents.js");
  }
}

/** Cookie consent + tracking loader. Renders nothing at all until a tracking ID is configured. */
export default function Analytics() {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!ANY) return;
    let v = "";
    try { v = localStorage.getItem(KEY) || ""; } catch { /* storage blocked */ }
    if (v === "yes") start(); else if (!v) setAsk(true);
  }, []);
  if (!ask) return null;
  const choose = (yes: boolean) => { try { localStorage.setItem(KEY, yes ? "yes" : "no"); } catch { /* ignore */ } setAsk(false); if (yes) start(); };
  return (
    <div role="dialog" aria-label="Cookie choices" className="no-print fixed inset-x-3 bottom-3 z-50 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4 text-[14px] text-ink shadow-lg sm:left-auto sm:max-w-[420px]">
      <span className="flex-[1_1_240px]">We use cookies to measure which ads and pages help owners find us. Nothing loads unless you accept.</span>
      <button type="button" className="btn btn-primary !min-h-[44px]" onClick={() => choose(true)}>Accept</button>
      <button type="button" className="btn btn-outline !min-h-[44px]" onClick={() => choose(false)}>Decline</button>
    </div>
  );
}

/** Report a reservation or purchase to the ad platforms (only if the visitor accepted). */
export function trackConversion(value: number, currency: string) {
  const w = window as W;
  try {
    if (w.gtag) {
      w.gtag("event", "generate_lead", { value, currency });
      if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) w.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`, value, currency });
    }
    if (w.fbq) w.fbq("track", "Lead", { value, currency });
  } catch { /* tracking is best-effort */ }
}
