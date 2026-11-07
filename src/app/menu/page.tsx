import type { Metadata } from "next";
import { PricedMenu } from "@/components/ChannelBits";

export const metadata: Metadata = {
  title: "The priced automation menu for your business — TaskAutoMode",
  description: "See the automations businesses like yours use most, each with a fixed price and go-live time.",
};

/** Lead magnet for LinkedIn, cold email and events: a priced menu per business type, gated by name and email. */
export default function MenuPage() {
  return (
    <main className="wrap flex flex-col gap-6 py-12">
      <div className="flex max-w-[760px] flex-col gap-3">
        <div className="kicker">Free · 30 seconds</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.05] tracking-tight">The priced automation menu for your business</h1>
        <p className="m-0 text-lg text-ink-2">The jobs businesses like yours hand to automation first: what each one does, what it costs, and how fast it&apos;s live. No sales call needed.</p>
      </div>
      <PricedMenu />
    </main>
  );
}
