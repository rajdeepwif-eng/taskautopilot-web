"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGEST = ["email inbox", "missed calls", "invoices", "WhatsApp", "timesheets", "HACCP"];

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = (t: string) => router.push(`/library/?q=${encodeURIComponent(t)}`);
  return (
    <div className="flex flex-col gap-2">
      <form
        role="search"
        className="flex max-w-[620px] overflow-hidden rounded-xl border-2 border-ink bg-white"
        onSubmit={(e) => { e.preventDefault(); go(q); }}
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to stop doing by hand?"
          aria-label="Search automations"
          className="min-w-0 flex-1 rounded-none border-0 text-[17px]"
        />
        <button type="submit" className="cursor-pointer border-0 bg-clay px-5 font-semibold text-white">Search</button>
      </form>
      <div className="flex flex-wrap gap-2 text-sm text-ink-2">
        Popular:
        {SUGGEST.map((s) => (
          <button key={s} type="button" onClick={() => go(s)} className="cursor-pointer border-0 bg-transparent p-0 text-clay underline">{s}</button>
        ))}
      </div>
    </div>
  );
}
