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
  return "USD";
}

const EVT = "ta-currency-change";

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
    apply(document.body, cur);
    let busy = false;
    const mo = new MutationObserver(() => {
      if (busy) return;
      busy = true;
      requestAnimationFrame(() => { mo.disconnect(); apply(document.body, cur); mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true }); busy = false; });
    });
    // Watch the whole document: if React replaces <body> during hydration, conversion still follows.
    mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    const late = window.setTimeout(() => apply(document.body, cur), 1500);
    return () => { mo.disconnect(); window.clearTimeout(late); };
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
