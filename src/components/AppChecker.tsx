"use client";

import { useState } from "react";
import { APP_GROUPS, INDUSTRY_APPS } from "@/lib/apps";

const KNOWN = Array.from(new Set([...APP_GROUPS, ...INDUSTRY_APPS].flatMap(([, apps]) => apps)));

export default function AppChecker() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const hit = query ? KNOWN.find((k) => k.toLowerCase().includes(query) || query.includes(k.toLowerCase())) : undefined;
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-[14px] border-2 border-ink bg-white p-5">
      <label className="flex min-w-0 flex-[999_1_320px] flex-col gap-1.5 font-semibold">
        Will it work with my app?
        <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type an app, e.g. Xero, Toast, Jobber…" className="font-normal" />
      </label>
      <div className="flex min-h-[48px] flex-[1_1_300px] items-center text-[15px]" aria-live="polite">
        {!query
          ? "Type any app — we'll tell you straight away."
          : hit
            ? `✓ Yes — we connect ${hit} regularly.`
            : "Probably — most apps with an API work. Leave your email in the assessment and we'll confirm within 24 hours."}
      </div>
    </div>
  );
}
