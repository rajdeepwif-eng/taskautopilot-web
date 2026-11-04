import type { Metadata } from "next";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import { BUNDLES, PRODUCTS, byId, fmt, priceLabel } from "@/lib/catalogue";
import { CatArt } from "@/components/CatArt";

export const metadata: Metadata = { title: "Industry kits & DIY kits — TaskAutoMode", description: "One-price industry kits for your industry, or do-it-yourself kits from $99." };

export default function KitsPage() {
  const kits = BUNDLES.filter((b) => b.kit);
  const diy = PRODUCTS.filter((p) => p.cat === "DIY kits");
  return (
    <main>
      <section className="wrap flex flex-col gap-3 pb-6 pt-12">
        <div className="kicker">Industry kits</div>
        <h1 className="m-0 font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.05] tracking-tight">Everything your industry needs first — one price, one setup.</h1>
      </section>
      <section className="wrap grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 pb-14">
        {kits.map((k) => {
          const items = k.ids.map(byId);
          const full = items.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
          return (
            <div key={k.name} className="card flex flex-col gap-3 p-6">
              <div className="text-[12px] text-muted">{k.depts}</div>
              <h2 className="m-0 font-display text-2xl font-bold">{k.name}</h2>
              <p className="m-0 text-[15px] text-ink-2">{k.desc}</p>
              <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[14px]">
                {items.map((p) => <li key={p.id}>✓ <Link href={`/p/${p.id}/`}>{p.name}</Link></li>)}
              </ul>
              <div className="mt-auto"><b className="font-display text-2xl">{fmt(full * 0.9)}</b> <span className="text-sm text-ok">save 10% vs buying separately</span></div>
              <Link href={`/checkout/?plan=${k.ids.join(",")}`} className="btn btn-primary">Buy the kit</Link>
              <AddToCart ids={k.ids} label="Add kit to cart" />
            </div>
          );
        })}
      </section>
      <section className="border-t border-line bg-white">
        <div className="wrap flex flex-col gap-4 py-14">
          <div className="kicker">Prefer to do it yourself?</div>
          <h2 className="m-0 font-display text-[34px]">DIY kits from $99</h2>
          <p className="m-0 max-w-[700px] text-ink-2">The same workflow we install, with a step-by-step written guide and checklist. 30 days of email help. Upgrade within 30 days and your kit price is credited.</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {diy.map((p) => (
              <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
                <div className="relative aspect-[16/8]"><CatArt cat={p.cat} size={44} /></div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <Link href={`/p/${p.id}/`} className="font-display text-[17px] font-bold text-ink">{p.name}</Link>
                  <div className="mt-auto font-display text-2xl font-bold">{priceLabel(p)}</div>
                  <AddToCart ids={[p.id]} />
                  <Link href={`/checkout/?plan=${p.id}`} className="btn btn-primary">Buy now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
