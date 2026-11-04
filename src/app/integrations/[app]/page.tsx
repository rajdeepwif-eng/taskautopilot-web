import type { Metadata } from "next";
import Link from "next/link";
import { INTEGRATIONS, integrationBySlug } from "@/lib/integrations";
import { PRODUCTS, byId, fmt, priceLabel } from "@/lib/catalogue";
import { SITE, metaDesc, seoTitle } from "@/lib/geo";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ app: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const i = integrationBySlug((await params).app);
  return { title: seoTitle(`${i.name} automation for ${i.who}`), description: metaDesc(`${i.intro} Fixed prices, set up for you.`), alternates: { canonical: "./" } };
}

export default async function Page({ params }: { params: Promise<{ app: string }> }) {
  const i = integrationBySlug((await params).app);
  const list = i.products === "auto"
    ? PRODUCTS.filter((p) => JSON.stringify(p).toLowerCase().includes(i.match!) && p.cat !== "Courses").sort((a, b) => a.price - b.price).slice(0, 9)
    : i.products.map(byId);
  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: `${i.name} automation`, item: `${SITE}/integrations/${i.slug}/` }] }) }} />
      <section className="flex flex-col gap-3">
        <nav className="text-sm"><Link href="/">Home</Link> › <span className="text-muted">Integrations</span></nav>
        <div className="kicker">Works with {i.name}</div>
        <h1 className="m-0 max-w-[900px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">{i.name} automation, set up for you</h1>
        <p className="m-0 max-w-[760px] text-lg text-ink-2">{i.intro}</p>
        <div className="rounded-lg bg-[#F0F8F3] px-4 py-3 text-[14px] text-ink-2">🔒 {i.note}</div>
      </section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="card flex flex-col gap-2 p-5">
            <Link href={`/p/${p.id}/`} className="font-bold text-ink">{p.name}</Link>
            <div className="text-[14px] text-ink-2">{p.desc}</div>
            <div className="mt-auto text-xl font-bold">{priceLabel(p)}</div>
            <AddToCart ids={[p.id]} />
          </div>
        ))}
      </section>
      <p className="m-0 text-ink-2">Don&apos;t see what you need with {i.name}? <Link href="/ask/">Ask us free</Link> — or start with the <Link href="/starter/">{fmt(99)} starter</Link>. {INTEGRATIONS.filter((x) => x.slug !== i.slug).map((x) => <span key={x.slug}> · <Link href={`/integrations/${x.slug}/`}>{x.name}</Link></span>)}</p>
    </main>
  );
}
