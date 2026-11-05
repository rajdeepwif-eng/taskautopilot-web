"use client";

/**
 * Shows prices in the visitor's currency. Prices are authored in US$; set list prices for
 * UK, Australia and Canada are derived from ECB reference rates (18 May 2026) and rounded.
 * Text that quotes US statistics (BLS medians) is left in US$.
 */
import { useEffect, useState } from "react";
import { nice } from "@/lib/geo";

const RATES = { USD: 1, GBP: 0.747, AUD: 1.396, CAD: 1.374 } as const;
type Cur = keyof typeof RATES;
const SYM: Record<Cur, string> = { USD: "$", GBP: "£", AUD: "A$", CAD: "C$" };
const LABEL: Record<Cur, string> = { USD: "US $", GBP: "UK £", AUD: "AU $", CAD: "CA $" };
const KEY = "ta-currency";
const PRICE = /\$(\d(?:[\d,]*\d)?(?:\.\d+)?)(?:–(\d(?:[\d,]*\d)?))?/g;
const seen = new WeakMap<Text, { orig: string; shown: string }>();


function convertText(t: string, cur: Cur) {
  if (cur === "USD" || /BLS|median|US\$/.test(t)) return t;
  const cv = (v: string) => nice(Number(v.replace(/,/g, "")) * RATES[cur]).toLocaleString("en-GB");
  return t.replace(PRICE, (_, v: string, hi?: string) => SYM[cur] + cv(v) + (hi ? "–" + cv(hi) : ""));
}

function apply(root: Node, cur: Cur) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = w.nextNode())) {
    const t = n as Text;
    const p = t.parentElement;
    if (!p || p.closest("script,style,[data-nocurrency]")) continue;
    const rec = seen.get(t);
    // If the text is what we last showed, keep the stored original; otherwise React (or first sight) set new text.
    const orig = rec && t.data === rec.shown ? rec.orig : t.data;
    if (!/\$\d/.test(orig)) { if (rec) seen.delete(t); continue; }
    const shown = convertText(orig, cur);
    seen.set(t, { orig, shown });
    if (t.data !== shown) t.data = shown;
  }
}

const ROUTE: Record<string, Cur> = { uk: "GBP", au: "AUD", ca: "CAD" };

function read(): Cur {
  try {
    // A country edition (/uk/, /au/, /ca/) always shows its own currency.
    const seg = window.location.pathname.split("/").filter(Boolean).find((s) => s in ROUTE);
    if (seg) { const cur = ROUTE[seg]; try { window.localStorage.setItem(KEY, cur); } catch { /* ignore */ } return cur; }
  } catch { /* ignore */ }
  try {
    const v = window.localStorage.getItem(KEY) as Cur | null;
    if (v && v in RATES) return v;
  } catch { /* storage blocked */ }
  try {
    const l = navigator.language || "";
    if (/-GB$/i.test(l)) return "GBP";
    if (/-AU$/i.test(l)) return "AUD";
    if (/-CA$/i.test(l)) return "CAD";
  } catch { /* ignore */ }
  // Many UK and Australian browsers report en-US, so fall back to the time zone.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/^Europe\/(London|Belfast)$/.test(tz)) return "GBP";
    if (/^Australia\//.test(tz)) return "AUD";
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal)$/.test(tz)) return "CAD";
  } catch { /* ignore */ }
  return "USD";
}

const EVT = "ta-currency-change";

export type { Cur };
export const CUR_RATES = RATES;
export const CUR_SYM = SYM;
/** The visitor's currency for components that compute prices themselves (mark them data-nocurrency). */
export function useCurrency() {
  const [cur, setCur] = useState<Cur>("USD");
  useEffect(() => {
    setCur(read());
    const on = (e: Event) => setCur((e as CustomEvent<Cur>).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  const rate = RATES[cur], sym = SYM[cur];
  /** Format an amount already in local currency. */
  const local = (n: number) => sym + Math.round(n).toLocaleString("en-GB");
  /** Convert a US$ amount to a rounded local amount (same rounding as the rest of the site). */
  const fromUsd = (usd: number) => (cur === "USD" ? usd : nice(usd * rate));
  return { cur, rate, sym, local, fromUsd };
}

/** Mounted once (in the layout): converts prices on the page and keeps them converted. */
export function CurrencyApplier() {
  const [cur, setCur] = useState<Cur>("USD");
  useEffect(() => {
    setCur(read());
    const on = (e: Event) => setCur((e as CustomEvent<Cur>).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  useEffect(() => {
    // `alive` stops a callback queued before cleanup from re-attaching an observer for the old
    // currency (that stale observer fought the new one and flipped prices back to US$).
    let alive = true;
    apply(document.body, cur);
    let busy = false;
    const opts = { subtree: true, childList: true, characterData: true };
    const mo = new MutationObserver(() => {
      if (busy || !alive) return;
      busy = true;
      requestAnimationFrame(() => { if (!alive) return; mo.disconnect(); apply(document.body, cur); mo.observe(document.documentElement, opts); busy = false; });
    });
    // Watch the whole document: if React replaces <body> during hydration, conversion still follows.
    mo.observe(document.documentElement, opts);
    // Re-apply a few times while late hydration and client navigation settle.
    let ticks = 0;
    const iv = window.setInterval(() => { if (!alive) return; apply(document.body, cur); if (++ticks >= 12) window.clearInterval(iv); }, 400);
    return () => { alive = false; mo.disconnect(); window.clearInterval(iv); };
  }, [cur]);
  return null;
}

/** A currency picker; any number can be on the page — they stay in sync. */
export default function CurrencySwitch() {
  const [cur, setCur] = useState<Cur>("USD");
  useEffect(() => {
    setCur(read());
    const on = (e: Event) => setCur((e as CustomEvent<Cur>).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  return (
    <label className="flex items-center gap-1.5 text-sm" data-nocurrency>
      <select
        value={cur}
        onChange={(e) => {
          const v = e.target.value as Cur;
          try { window.localStorage.setItem(KEY, v); } catch { /* ignore */ }
          window.dispatchEvent(new CustomEvent(EVT, { detail: v }));
        }}
        className="!min-h-[36px] !py-1 !pl-2 !pr-7 text-sm"
        aria-label="Currency"
      >
        {(Object.keys(RATES) as Cur[]).map((c) => <option key={c} value={c}>{LABEL[c]}</option>)}
      </select>
    </label>
  );
}
