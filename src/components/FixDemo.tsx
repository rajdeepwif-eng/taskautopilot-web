"use client";

import { useEffect, useRef, useState } from "react";
import { Country, localPrices, loc } from "@/lib/geo";

/** Numbers reserved for drama/fiction in each country, so no real person is shown. */
const PHONE: Record<Country, string> = { us: "(555) 014-2290", ca: "(555) 014-2290", uk: "07700 900123", au: "0491 570 006" };

/** One step in a demo: who it's from, the text, and a clock time shown above it. */
type Step = { from: "them" | "auto" | "you" | "system"; text: string; time: string };

/** Sample-data walk-throughs of each fix. Clearly labelled as a demo; no real customers. */
const DEMOS: Record<string, { title: string; steps: Step[] }> = {
  "missed-calls": {
    title: "A call you can't take",
    steps: [
      { from: "system", time: "2:14 pm", text: "📞 Missed call from {phone} — you're on a job" },
      { from: "auto", time: "2:14 pm", text: "Hi, it's {biz}. Sorry we missed you — we're with a customer. Book a time here: {link} or reply and we'll call you back within the hour." },
      { from: "them", time: "2:16 pm", text: "{ask}" },
      { from: "auto", time: "2:16 pm", text: "Thanks! I've passed this to {owner} with your details. You can also pick a slot here: {link}" },
      { from: "you", time: "2:17 pm", text: "🔔 New lead: {phone} — \"{ask}\" · tap to call back" },
      { from: "system", time: "2:41 pm", text: "✅ Booked: Thursday 9:00 am — added to your calendar" },
    ],
  },
  "get-paid-faster": {
    title: "An invoice that would have gone late",
    steps: [
      { from: "system", time: "Day 0", text: "🧾 Job signed off → invoice #1042 for $1,260 sent automatically, with a pay-now link" },
      { from: "auto", time: "Day 27", text: "Hi Sam, a friendly heads-up that invoice #1042 for $1,260 is due on Friday. Pay here: {pay}" },
      { from: "auto", time: "Day 37", text: "Hi Sam, invoice #1042 is now 7 days overdue. Could you let us know when to expect payment? Pay here: {pay}" },
      { from: "them", time: "Day 37", text: "Sorry, missed it — paying now." },
      { from: "system", time: "Day 37", text: "💳 $1,260 received → matched to #1042 in your accounts. Reminders stopped." },
      { from: "you", time: "Day 37", text: "🔔 Paid: #1042, $1,260 · 0 minutes of your time" },
    ],
  },
  "quote-follow-up": {
    title: "A quote that went quiet",
    steps: [
      { from: "system", time: "Mon", text: "📄 Quote Q-318 sent: {job} — $4,850" },
      { from: "auto", time: "Wed", text: "Hi Priya, just checking the quote for {job} came through OK. Happy to answer any questions — just reply here." },
      { from: "auto", time: "Next Mon", text: "Hi Priya, our diary is filling up for next month. If you'd like to go ahead, reply 'yes' and we'll lock in a date." },
      { from: "them", time: "Next Mon", text: "Yes please — can you start the 14th?" },
      { from: "system", time: "Next Mon", text: "✅ Follow-ups stopped. Quote marked won." },
      { from: "you", time: "Next Mon", text: "🔔 Q-318 accepted ($4,850) — customer asked for the 14th" },
    ],
  },
  "google-reviews": {
    title: "A happy customer, asked at the right time",
    steps: [
      { from: "system", time: "4:05 pm", text: "💳 Invoice #2210 paid in full" },
      { from: "auto", time: "4:35 pm", text: "Hi Dana, thanks for choosing {biz}! If we did a good job, a quick Google review helps a lot: {link}" },
      { from: "system", time: "7:12 pm", text: "⭐⭐⭐⭐⭐ New Google review from Dana: \"Quick, tidy and friendly.\"" },
      { from: "auto", time: "7:13 pm", text: "Draft reply ready: \"Thanks so much, Dana — glad we could help!\" · approve or edit" },
      { from: "you", time: "7:20 pm", text: "✓ Approved — reply posted" },
    ],
  },
  "ai-receptionist": {
    title: "A call at 9pm, answered",
    steps: [
      { from: "system", time: "9:02 pm", text: "📞 Incoming call — your AI receptionist answers in {biz}'s name" },
      { from: "auto", time: "9:02 pm", text: "Thanks for calling {biz}, this is the virtual assistant. How can I help?" },
      { from: "them", time: "9:02 pm", text: "{ask}" },
      { from: "auto", time: "9:03 pm", text: "I can book that. The first slot is tomorrow at 8:30 am — does that work?" },
      { from: "them", time: "9:03 pm", text: "Perfect." },
      { from: "you", time: "9:04 pm", text: "🔔 Booked: tomorrow 8:30 am · call summary and recording attached" },
    ],
  },
  "admin-hours": {
    title: "Tuesday's admin, done overnight",
    steps: [
      { from: "system", time: "11:30 pm", text: "📥 14 supplier bills found in the inbox → read and drafted in your accounts" },
      { from: "system", time: "2:00 am", text: "🏦 46 bank lines matched to invoices and bills; 3 need a look" },
      { from: "system", time: "6:00 am", text: "✉️ 22 new emails sorted; replies drafted for 9" },
      { from: "you", time: "7:30 am", text: "🔔 Morning summary: approve 14 bills, check 3 bank lines, review 9 drafts" },
    ],
  },
  "profit-dashboard": {
    title: "Month-end, without the spreadsheet",
    steps: [
      { from: "system", time: "1st, 6:00 am", text: "📊 Last month pulled from your accounts, bank and job system" },
      { from: "auto", time: "1st, 6:05 am", text: "Profit $18,400 (up 12%). Cash $41,200. Owed to you $9,800 — 2 customers over 30 days. Materials margin down 3 points: supplier prices rose." },
      { from: "you", time: "1st, 7:30 am", text: "🔔 Your monthly report is ready · plain-English notes on what changed" },
    ],
  },
};

const BUBBLE: Record<Step["from"], string> = {
  them: "self-end bg-[#DCF3D9] text-ink",
  auto: "self-start bg-white text-ink",
  you: "self-stretch border border-amber bg-[#232F3E] text-amber",
  system: "self-center bg-transparent text-[#A9ADB4] text-[13px] text-center",
};
const WHO: Record<Step["from"], string> = { them: "Customer", auto: "Automation", you: "You", system: "" };

export default function FixDemo({ slug, country = "us", biz = "Northside Services", ask = "Can someone come out this week?", job = "the new patio", owner = "the team" }: { slug: string; country?: Country; biz?: string; ask?: string; job?: string; owner?: string }) {
  const demo = DEMOS[slug];
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || !demo) return;
    if (shown >= demo.steps.length) { setPlaying(false); return; }
    const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : 1300);
    return () => window.clearTimeout(id);
  }, [playing, shown, demo]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [shown]);

  if (!demo) return null;
  const fill = (t: string) => t.replace(/\{biz\}/g, biz).replace(/\{ask\}/g, ask).replace(/\{job\}/g, job).replace(/\{owner\}/g, owner).replace(/\{link\}/g, "book.example/abc").replace(/\{pay\}/g, "pay.example/1042").replace(/\{phone\}/g, PHONE[country]);
  const local = (t: string) => localPrices(loc(fill(t), country), country);
  const done = shown >= demo.steps.length;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-ink p-5 text-paper">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-display text-lg font-bold">See it run: {demo.title}</div>
        <span className="whitespace-nowrap rounded bg-[#232F3E] px-2 py-0.5 text-[11px] text-[#A9ADB4]">Demo · sample data</span>
      </div>
      <div ref={box} className="flex max-h-[380px] min-h-[200px] flex-col gap-2 overflow-y-auto rounded-xl bg-[#1B232E] p-3" aria-live="polite">
        {shown === 0 && <div className="m-auto text-center text-[14px] text-[#A9ADB4]">Press play to watch what happens — step by step.</div>}
        {demo.steps.slice(0, shown).map((s, i) => (
          <div key={i} className={`flex max-w-[88%] flex-col gap-0.5 rounded-2xl px-3.5 py-2 text-[14.5px] leading-snug ${BUBBLE[s.from]}`}>
            {s.from !== "system" && <span className="text-[11px] font-semibold opacity-70">{WHO[s.from]} · {s.time}</span>}
            {s.from === "system" && <span className="text-[11px] opacity-80">{s.time}</span>}
            <span>{local(s.text)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => { if (done) setShown(0); setPlaying(true); }} className="btn btn-primary !min-h-[44px]">{done ? "Replay ↺" : playing ? "Playing…" : shown ? "Continue ▶" : "Play the demo ▶"}</button>
        {!done && <button type="button" onClick={() => { setPlaying(false); setShown(demo.steps.length); }} className="min-h-[44px] cursor-pointer border-0 bg-transparent px-1 text-[14px] text-[#C9C7C0] underline">Show all steps</button>}
      </div>
    </div>
  );
}
