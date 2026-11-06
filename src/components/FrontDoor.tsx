"use client";
import { PROBLEMS } from "@/components/Assistant";

/** One front door: every "not sure" or "tell us" button opens the same assistant. */
export const openAssistant = (pain?: string) => window.dispatchEvent(new CustomEvent("ta:open", { detail: { pain } }));

export function AskButton({ label = "Tell us what you need →", className = "btn btn-primary text-[17px]" }: { label?: string; className?: string }) {
  return <button type="button" className={className} onClick={() => openAssistant()} data-testid="front-door">{label}</button>;
}

/** The six problems owners describe, each opening the assistant with 3 priced ideas. */
export function ProblemButtons() {
  return (
    <section className="wrap flex flex-col gap-4 pt-14" data-testid="problem-buttons">
      <div className="kicker">Not sure what can be automated?</div>
      <h2 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">What do you want sorted?</h2>
      <p className="m-0 max-w-[680px] text-ink-2">Tap one. You&apos;ll see 3 examples with prices, each one tailored to how you already work.</p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p) => (
          <button key={p.id} type="button" onClick={() => openAssistant(p.id)} className="flex min-h-[64px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 text-left text-[17px] font-semibold text-ink hover:border-ink">
            {p.label}<span className="text-clay" aria-hidden>→</span>
          </button>
        ))}
      </div>
    </section>
  );
}
