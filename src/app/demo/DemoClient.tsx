"use client";

import { useState } from "react";
import Link from "next/link";
import { byId, fmt } from "@/lib/catalogue";

type Msg = { from: "you" | "bot"; text: string };
const SCRIPT: { q: string; a: string[] }[] = [
  { q: "Do you have a mini digger free this Saturday?", a: ["Yes — the 1.5-tonne mini digger is free this Saturday.", "Day hire is $180 including delivery within 10 miles. Want me to book it?"] },
  { q: "Can I book a table for 4 at 7pm Friday?", a: ["I can do 7:15pm Friday for 4, or 6:30pm.", "Shall I hold 7:15pm? I'll text you a reminder on Friday morning."] },
  { q: "Where's my order #1042?", a: ["Order #1042 left our warehouse this morning.", "It's due tomorrow before 1pm. I've texted you the tracking link."] },
  { q: "I need to speak to someone about a complaint.", a: ["I'm sorry to hear that. I've passed this to the manager now, with your details.", "They'll call you back within 1 hour. Is this the best number?"] },
];

export default function DemoClient() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi! I'm the AI assistant for a demo business. Ask me something below." }]);
  const [busy, setBusy] = useState(false);

  const ask = (i: number) => {
    if (busy) return;
    const s = SCRIPT[i];
    setBusy(true);
    setMsgs((m) => [...m, { from: "you", text: s.q }]);
    s.a.forEach((t, j) => setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: t }]);
      if (j === s.a.length - 1) setBusy(false);
    }, 700 * (j + 1)));
  };

  return (
    <main>
      <section className="wrap flex flex-col gap-3 pb-6 pt-12">
        <div className="kicker">Try it live</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.05] tracking-tight">See how your customers get answered in seconds.</h1>
        <p className="m-0 max-w-[700px] text-lg text-ink-2">Tap a question. This demo uses sample answers from a pretend business — yours answers from your own prices, stock and calendar.</p>
      </section>
      <div className="wrap flex flex-wrap items-start gap-8 pb-16">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 bg-ink px-4 py-3 text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7FD1A8]" /> <b>Demo business</b> <span className="text-[12px] text-[#A9ADB4]">· replies instantly, 24/7</span>
          </div>
          <div className="flex min-h-[340px] flex-col gap-2 bg-[#EFEDE6] p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] ${m.from === "you" ? "self-end bg-[#DCF3D9]" : "self-start bg-white"}`}>{m.text}</div>
            ))}
            {busy && <div className="self-start rounded-2xl bg-white px-3.5 py-2 text-muted">typing…</div>}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line p-3">
            {SCRIPT.map((s, i) => (
              <button key={i} type="button" disabled={busy} onClick={() => ask(i)} className="min-h-[40px] cursor-pointer rounded-full border border-[#C9C5B9] bg-white px-3 text-left text-[14px] disabled:opacity-50">{s.q}</button>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
          <div className="card flex flex-col gap-2 p-5">
            <div className="font-display text-xl font-bold">What you just saw</div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-ink-2">
              <li>✓ Answers from your info — prices, stock, opening times</li>
              <li>✓ Books, offers alternatives and sends reminders</li>
              <li>✓ Hands complaints and anything tricky to a person</li>
              <li>✓ Works on your website, WhatsApp and phone</li>
            </ul>
          </div>
          <div className="card flex flex-col gap-2 p-5">
            <div className="font-display text-xl font-bold">Prefer to hear it?</div>
            <div className="text-[15px] text-ink-2">A demo phone line for the AI receptionist is being set up. Until then, watch the demo on the product page.</div>
            <Link href="/p/7/" className="font-semibold">AI phone receptionist →</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/p/108/" className="btn btn-primary">Get the 24/7 AI sales agent — {fmt(byId(108).price)}</Link>
            <Link href="/p/10/" className="btn btn-outline">Start smaller — instant replies, {fmt(byId(10).price)}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
