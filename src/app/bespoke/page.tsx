import Link from "next/link";

export const metadata = { title: "Bespoke automation brief — TaskAutopilot" };

// Placeholder: the full 6-step brief (SOP upload / explain / day-one, risks, estimate, paid scoping) is the next build step.
export default function BespokePage() {
  return (
    <main className="wrap flex flex-col gap-4 py-16">
      <div className="kicker !text-clay">Bespoke automation</div>
      <h1 className="font-display m-0 text-[42px] font-bold leading-tight">Tell us the job once. Get a fixed quote in 48 hours — no discovery calls.</h1>
      <p className="m-0 text-lg text-ink-2">[The guided brief is being built next.]</p>
      <Link href="/library" className="btn btn-dark self-start">Browse ready-made automations</Link>
    </main>
  );
}
