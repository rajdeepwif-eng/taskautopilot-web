import Link from "next/link";
import { compareBySlug } from "@/lib/compare";
import { byId } from "@/lib/catalogue";
import { COUNTRIES, Country, SITE, loc, localPrices, money } from "@/lib/geo";
import AddToCart from "@/components/AddToCart";
import FixDemo from "@/components/FixDemo";

export default function CompareView({ slug, country }: { slug: string; country: Country }) {
  const c = compareBySlug(slug);
  const C = COUNTRIES[country];
  const L = (x: string) => localPrices(loc(x, country), country);
  const fmt = (n: number) => money(n, country);
  const url = `${SITE}${C.path}/compare/${slug}/`;
  return (
    <main data-nocurrency={country !== "us" ? "" : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faq.map(([q, a]) => ({ "@type": "Question", name: L(q), acceptedAnswer: { "@type": "Answer", text: L(a) } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}${C.path}/` }, { "@type": "ListItem", position: 2, name: L(c.metaTitle), item: url }] }) }} />
      <section className="wrap flex flex-col gap-3 pb-6 pt-10">
        <nav className="text-sm"><Link href={`${C.path}/`}>Home</Link> › <span className="text-muted">Compare</span></nav>
        <div className="kicker">Honest comparison{country !== "us" ? ` · ${C.name}` : ""}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">{L(c.title)}</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">{L(c.intro)}</p>
      </section>

      <section className="wrap pb-8">
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="bg-[#F7F8F8] text-[13px] uppercase tracking-wide text-muted">
                <th className="w-[22%] px-4 py-3 font-semibold" scope="col"><span className="sr-only">Criterion</span></th>
                <th className="px-4 py-3 font-semibold" scope="col">{L(c.a)}</th>
                <th className="bg-clay-soft px-4 py-3 font-semibold text-clay" scope="col">{L(c.b)}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map(([k, a, b]) => (
                <tr key={k} className="border-t border-line align-top">
                  <th scope="row" className="px-4 py-3 font-semibold">{L(k)}</th>
                  <td className="px-4 py-3 text-ink-2">{L(a)}</td>
                  <td className="bg-clay-soft px-4 py-3">{L(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap grid grid-cols-1 gap-4 pb-8 md:grid-cols-2">
        <div className="card flex flex-col gap-2 p-5"><b>Choose {L(c.a).toLowerCase()} if…</b><ul className="m-0 flex list-none flex-col gap-1 p-0 text-ink-2">{c.chooseA.map((x) => <li key={x}>✓ {L(x)}</li>)}</ul></div>
        <div className="card flex flex-col gap-2 border-2 border-clay p-5"><b>Choose {L(c.b).toLowerCase()} if…</b><ul className="m-0 flex list-none flex-col gap-1 p-0 text-ink-2">{c.chooseB.map((x) => <li key={x}>✓ {L(x)}</li>)}</ul></div>
      </section>

      <section className="wrap flex flex-col gap-4 pb-10">
        <div className="rounded-xl bg-ink p-6 text-paper"><div className="kicker !text-amber">Our honest take</div><p className="m-0 mt-1 text-lg">{L(c.verdict)}</p></div>
      </section>

      {slug === "missed-call-text-back-vs-ai-receptionist" && (
        <section className="wrap grid grid-cols-1 gap-4 pb-10 lg:grid-cols-2">
          <FixDemo slug="missed-calls" country={country} />
          <FixDemo slug="ai-receptionist" country={country} />
        </section>
      )}

      <section className="wrap flex flex-col gap-4 pb-10">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Fixed-price options</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.fixes.map(byId).map((p) => (
            <div key={p.id} className="card flex flex-col gap-2 p-5">
              <Link href={`/p/${p.id}/`} className="font-bold text-ink">{L(p.name)}</Link>
              <div className="text-[14px] text-ink-2">{L(p.desc)}</div>
              <div className="mt-auto text-xl font-bold">{p.monthly ? `${fmt(p.price)}/mo` : fmt(p.price)}</div>
              <AddToCart ids={[p.id]} />
            </div>
          ))}
        </div>
        <p className="m-0 text-ink-2">Not sure? <Link href="/planner/">Build a plan in 2 minutes</Link> or <Link href="/ask/">ask us free</Link>.</p>
      </section>

      <section className="wrap flex flex-col gap-2 pb-16">
        <h2 className="m-0 text-[clamp(24px,3.5vw,32px)] font-bold">Questions</h2>
        {c.faq.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-semibold">{L(q)}</summary><p className="mb-0 mt-2 text-ink-2">{L(a)}</p></details>)}
      </section>
    </main>
  );
}
