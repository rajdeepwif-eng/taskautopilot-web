/**
 * Marketing attribution: remembers where a visitor came from (ad, partner code, flyer QR, event)
 * so every reservation and lead says which strategy produced it. Stored only in this browser.
 */
import { FORMS_LIVE, LEAD_ENDPOINT } from "@/lib/launch";

export type Touch = { source: string; medium: string; campaign: string; ref: string; gclid: string; landing: string; at: string };
const FIRST = "ta-first-touch";
const LAST = "ta-last-touch";

/** Marketing data persists only after cookie consent; otherwise it lasts for this visit only. */
const store = () => { try { return localStorage.getItem("ta-consent") === "yes" ? localStorage : sessionStorage; } catch { return sessionStorage; } };
const REF = "ta-ref";

export function captureTouch() {
  try {
    const q = new URLSearchParams(window.location.search);
    const has = ["utm_source", "utm_medium", "utm_campaign", "ref", "gclid", "src"].some((k) => q.get(k));
    const t: Touch = {
      source: q.get("utm_source") || q.get("src") || (q.get("gclid") ? "google" : "") || referrerSource(),
      medium: q.get("utm_medium") || (q.get("gclid") ? "cpc" : q.get("ref") ? "referral" : ""),
      campaign: q.get("utm_campaign") || "",
      ref: (q.get("ref") || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32),
      gclid: (q.get("gclid") || "").slice(0, 200),
      landing: window.location.pathname,
      at: new Date().toISOString(),
    };
    const st = store();
    if (!st.getItem(FIRST)) st.setItem(FIRST, JSON.stringify(t));
    if (has || !st.getItem(LAST)) st.setItem(LAST, JSON.stringify(t));
    // The partner code alone is kept so the referrer can be credited if the visitor buys on a later visit.
    if (t.ref) localStorage.setItem(REF, t.ref);
  } catch { /* storage blocked — attribution is best-effort */ }
}

function referrerSource() {
  try {
    const r = document.referrer ? new URL(document.referrer).hostname : "";
    if (!r || r === window.location.hostname) return "direct";
    if (/google\./.test(r)) return "google-organic";
    if (/bing\./.test(r)) return "bing-organic";
    if (/facebook|instagram/.test(r)) return "meta";
    if (/youtube/.test(r)) return "youtube";
    if (/linkedin/.test(r)) return "linkedin";
    return r;
  } catch { return ""; }
}

export function readTouches(): { first: Touch | null; last: Touch | null } {
  try {
    const st = store();
    const first = JSON.parse(st.getItem(FIRST) || localStorage.getItem(FIRST) || "null");
    const last = JSON.parse(st.getItem(LAST) || localStorage.getItem(LAST) || "null");
    const ref = localStorage.getItem(REF) || "";
    if (ref && last && !last.ref) last.ref = ref;
    return { first, last: last ?? (ref ? { source: "", medium: "referral", campaign: "", ref, gclid: "", landing: "", at: "" } : null) };
  } catch { return { first: null, last: null }; }
}

/** Sends a lead or reservation with its attribution. Returns true only if it really went out. */
export async function sendLead(kind: string, data: Record<string, unknown>): Promise<boolean> {
  const payload = { kind, data, attribution: readTouches(), page: typeof window !== "undefined" ? window.location.pathname : "", sentAt: new Date().toISOString() };
  try { (window as unknown as { __taLastLead?: unknown }).__taLastLead = payload; } catch { /* ignore */ }
  if (!FORMS_LIVE || !LEAD_ENDPOINT) return false;
  try {
    const r = await fetch(LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return r.ok;
  } catch { return false; }
}
