import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap flex flex-col items-start gap-4 py-20">
      <h1 className="m-0 text-4xl font-bold">We couldn&apos;t find that page.</h1>
      <p className="m-0 text-lg text-ink-2">It may have moved. Use the search box at the top, or start here:</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/library/" className="btn btn-primary">Browse all automations</Link>
        <Link href="/#trades" className="btn btn-outline">Shop by business type</Link>
        <Link href="/ask/" className="btn btn-outline">Ask us free</Link>
      </div>
    </main>
  );
}
