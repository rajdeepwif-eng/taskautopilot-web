import type { Metadata } from "next";
import Link from "next/link";
import { byId, priceLabel } from "@/lib/catalogue";
import { flowFor } from "@/lib/buying";
import { AskButton } from "@/components/FrontDoor";
import { TagSource } from "@/components/ChannelBits";

export const metadata: Metadata = {
  title: "From the YouTube channel — get it in your business | TaskAutoMode",
  description: "Saw an automation in one of our videos? Here's how to get it set up in your business, at a fixed price.",
};

const FEATURED = [11, 22, 10, 21, 15, 120];

/** Landing page for YouTube viewers (spoken vanity URL: taskautomode.com/yt). */
export default function YouTubePage() {
  return (
    <main className="wrap flex flex-col gap-8 py-12" data-testid="yt-page">
      <TagSource source="youtube" medium="video" />
      <section className="flex max-w-[780px] flex-col gap-3">
        <div className="kicker">From the channel</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.05] tracking-tight">Saw it in a video? We&apos;ll set it up in your business.</h1>
        <p className="m-0 text-lg text-ink-2">Everything you see on the channel is a real, fixed-price build. Tell us which one — or describe your version — and we&apos;ll show you how it fits the way you already work.</p>
        <div className="flex flex-wrap gap-3"><AskButton label="Tell us which one →" /><Link href="/menu/" className="btn btn-outline">See the priced menu for my business</Link></div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-bold">Most asked-for after a video</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((id) => { const p = byId(id); return (
            <Link key={id} href={`/p/${id}/`} className="card flex flex-col gap-1 p-4 text-ink no-underline hover:border-ink">
              <div className="flex items-baseline justify-between gap-2"><b className="text-[16px]">{p.name}</b><b className="whitespace-nowrap">{priceLabel(p)}</b></div>
              <span className="text-[14px] text-ink-2">{flowFor(p).result}</span>
            </Link>
          ); })}
        </div>
      </section>
    </main>
  );
}
