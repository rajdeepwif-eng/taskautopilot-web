"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { byId, fmt, priceLabel } from "@/lib/catalogue";
import { PAYMENTS_LIVE } from "@/lib/launch";
import { sendLead } from "@/lib/attribution";

type Cta = { type: string; product_id?: number };
type Msg = { role: "user" | "assistant"; content: string; products?: number[]; cta?: Cta };

const MAX_TURNS = 16;
const OPENER = "Hi — I'm the TaskAutoMode assistant. What would you like to stop doing by hand, or start happening automatically? Plain words are perfect.";

/**
 * Live AI interviewer. Talks to the n8n workflow at `endpoint`, which runs Claude with our catalogue,
 * asks one question at a time, suggests products with prices, and returns a priceable brief.
 * Any error falls back to the guided assistant, so a visitor is never stuck.
 */
export default function AIChat({ endpoint, page, onFallback, onTalk, onDone }: { endpoint: string; page: string; onFallback: () => void; onTalk: () => void; onDone: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: OPENER }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [brief, setBrief] = useState<Record<string, unknown> | null>(null);
  const [sid] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs, busy]);

  const turns = msgs.filter((m) => m.role === "user").length;
  const send = async () => {
    const t = text.trim().slice(0, 1000);
    if (!t || busy || turns >= MAX_TURNS) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sid, page, message: t, history: next.map(({ role, content }) => ({ role, content })) }) });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      const ids = Array.isArray(d.products) ? d.products.map(Number).filter((n: number) => byId(n)).slice(0, 3) : [];
      const cta: Cta | undefined = d.cta && typeof d.cta === "object" && d.cta.type && d.cta.type !== "none" ? { type: String(d.cta.type), product_id: Number(d.cta.product_id) || undefined } : undefined;
      setMsgs([...next, { role: "assistant", content: String(d.reply || "Sorry — could you say that another way?"), products: ids, cta }]);
      if (d.brief && typeof d.brief === "object") setBrief(d.brief);
    } catch {
      onFallback();
    } finally { setBusy(false); }
  };
  const finish = () => {
    void sendLead("ai-brief", { sessionId: sid, page, brief, transcript: msgs.map(({ role, content }) => ({ role, content })) });
    onDone();
  };

  /** The one next step the sales lead recommends, as a real button. */
  const ctaButton = (c: Cta) => {
    const p = c.product_id && byId(c.product_id) ? byId(c.product_id) : undefined;
    const cls = "btn btn-primary !min-h-[38px] !text-[13.5px] self-start";
    if (c.type === "buy" && p) return <Link href={`/checkout/?plan=${p.id}`} className={cls} data-testid="ai-cta">{PAYMENTS_LIVE ? `Buy ${p.name} — ${priceLabel(p)}` : `Reserve ${p.name} — nothing charged today`}</Link>;
    if (c.type === "starter") return <Link href="/starter/" className={cls} data-testid="ai-cta">Start with the {fmt(99)} starter</Link>;
    if (c.type === "audit") return <Link href="/checkout/?plan=0" className={cls} data-testid="ai-cta">Book the {fmt(499)} audit (credited if you build)</Link>;
    if (c.type === "call") return <button type="button" className={cls} onClick={onTalk} data-testid="ai-cta">Book a free 20-minute call</button>;
    if (c.type === "send_brief") return <button type="button" className={cls} onClick={finish} data-testid="ai-cta">Send me the fixed price</button>;
    return null;
  };
  const lastCta = [...msgs].reverse().find((m) => m.role === "assistant")?.cta;

  return (
    <div className="flex flex-col gap-2" data-testid="ai-chat">
      <div className="flex max-h-[46vh] flex-col gap-2 overflow-y-auto pr-1" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[14px] ${m.role === "user" ? "bg-ink text-white" : "bg-paper"}`}>{m.content}</div>
            {m.products?.map((id) => { const p = byId(id); return (
              <Link key={id} href={`/p/${id}/`} className="flex w-[90%] items-baseline justify-between gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink no-underline hover:border-ink" data-testid="ai-product">
                <span><b>{p.name}</b><span className="block text-muted">{p.monthly ? "Monthly service" : `Fixed price · live in about ${p.days} days`}</span></span><b className="whitespace-nowrap">{priceLabel(p)}</b>
              </Link>
            ); })}
          </div>
        ))}
        {!busy && lastCta && ctaButton(lastCta)}
        {busy && <div className="self-start rounded-2xl bg-paper px-3 py-2 text-[14px] text-muted">Thinking…</div>}
        <div ref={end} />
      </div>
      {turns < MAX_TURNS ? (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void send(); }}>
          <input type="text" value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} placeholder="Type your answer…" aria-label="Your message" className="min-w-0 flex-1" data-testid="ai-input" />
          <button type="submit" className="btn btn-primary !px-4" disabled={busy || !text.trim()}>Send</button>
        </form>
      ) : <p className="m-0 text-[13px] text-ink-2">That's plenty to work with — send it over and a person will reply.</p>}
      <div className="flex flex-wrap gap-2">
        {(brief || turns >= 3) && <button type="button" className="btn btn-primary !min-h-[38px] !text-[13.5px]" onClick={finish} data-testid="ai-finish">Send this to the team for a fixed price</button>}
        <button type="button" className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold" onClick={onTalk}>☎ Book a free call</button>
        <button type="button" className="border-0 bg-transparent p-0 text-[12.5px] text-muted underline" onClick={onFallback} data-testid="ai-fallback">Prefer quick-tap questions?</button>
      </div>
      <p className="m-0 text-[11.5px] text-muted">AI assistant — it can make mistakes; a person checks every brief before any price is final. Don&apos;t share passwords or card details here.</p>
    </div>
  );
}
