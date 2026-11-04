"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BUNDLES, CATEGORIES, INDUSTRIES, PRODUCTS, Product, byId, fitsIndustry, fmt, priceLabel , runLow } from "@/lib/catalogue";
import { ProductDetail } from "./LibraryClient";
import { loadPlan, savePlan } from "@/lib/plan";
import { CatArt } from "@/components/CatArt";
import { LiveBy } from "@/components/StoreBar";

const PRICE_BANDS = [
  { id: "any", label: "Any price", test: () => true },
  { id: "u1", label: "Under $1,000", test: (p: Product) => !p.monthly && p.price < 1000 },
  { id: "1to3", label: "$1,000 – $3,000", test: (p: Product) => !p.monthly && p.price >= 1000 && p.price <= 3000 },
  { id: "3to6", label: "$3,000 – $6,000", test: (p: Product) => !p.monthly && p.price > 3000 && p.price <= 6000 },
  { id: "6up", label: "$6,000 & above", test: (p: Product) => !p.monthly && p.price > 6000 },
  { id: "mo", label: "Monthly plans", test: (p: Product) => !!p.monthly },
];
const SPEED = [
  { id: "any", label: "Any", max: 999 },
  { id: "10", label: "Live in 10 days or less", max: 10 },
  { id: "20", label: "Live in 20 days or less", max: 20 },
];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "fast", label: "Fastest to go live" },
];

function Radio({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex min-h-[36px] cursor-pointer items-center gap-2.5 text-[15px]">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-[#007185]" />
      <span className={checked ? "font-semibold" : ""}>{children}</span>
    </label>
  );
}

export default function MarketClient() {
  const [dept, setDept] = useState("All");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All industries");
  const [band, setBand] = useState("any");
  const [speed, setSpeed] = useState("any");
  const [sort, setSort] = useState("featured");
  const [plan, setPlan] = useState<number[]>([]);
  const [open, setOpen] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<Product | null>(null);

  const [limit, setLimit] = useState(24);
  const loaded = useRef(false);
  useEffect(() => {
    setPlan(loadPlan());
    const sp = new URLSearchParams(window.location.search);
    const qq = sp.get("q");
    if (qq) { setQ(qq); setQuery(qq); }
    const ind = sp.get("industry");
    if (ind && INDUSTRIES.includes(ind)) setIndustry(ind);
    const onSearch = (e: Event) => { const v = (e as CustomEvent<string>).detail; setQ(v); setQuery(v); };
    window.addEventListener("ta-search", onSearch);
    const bd = sp.get("band");
    if (bd && PRICE_BANDS.some((b) => b.id === bd)) setBand(bd);
    loaded.current = true;
  }, []);
  useEffect(() => { if (loaded.current) savePlan(plan); }, [plan]);
  useEffect(() => { setLimit(24); }, [query, dept, industry, band, speed, sort]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setCartOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    // Word search: every word must appear; hyphens count as spaces and plurals match singulars.
    const norm = (s: string) => s.toLowerCase().replace(/[-–/&]/g, " ");
    const words = norm(query).split(/\s+/).filter((w) => w.length > 1).map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
    const t = words.length > 0;
    const hit = (p: Product) => { const h = norm(`${p.name} ${p.desc} ${p.apps} ${p.cat} ${p.role ?? ""}`); return words.every((w) => h.includes(w)); };
    const b = PRICE_BANDS.find((x) => x.id === band)!;
    const max = SPEED.find((x) => x.id === speed)!.max;
    const r = PRODUCTS.filter(
      (p) =>
        (dept === "All" || p.cat === dept) &&
        fitsIndustry(p, industry) &&
        b.test(p) &&
        p.days <= max &&
        (!t || hit(p)),
    );
    // Featured: the $99 starter first, then one-off fixes cheapest-first, monthly services last.
    // Featured: $99 starter, then the fixes owners need most (research-ranked), then one-off builds, monthly services, kits and courses.
    const FEATURED = [120, 11, 22, 13, 15, 7, 10, 125, 137, 96, 21, 23];
    const rank = (p: Product) => { const i = FEATURED.indexOf(p.id); return i >= 0 ? i : 100 + (p.monthly ? 50 : 0) + (p.cat === "Courses" || p.cat === "DIY kits" || p.cat === "Solo (self-employed)" ? 100 : 0); };
    if (sort === "featured") r.sort((a, b2) => rank(a) - rank(b2) || a.price - b2.price);
    if (sort === "low") r.sort((a, b2) => a.price - b2.price);
    if (sort === "high") r.sort((a, b2) => b2.price - a.price);
    if (sort === "fast") r.sort((a, b2) => a.days - b2.days);
    return r;
  }, [dept, query, industry, band, speed, sort]);

  const inPlan = (id: number) => plan.includes(id);
  const add = (p: Product) => {
    if (!inPlan(p.id)) setPlan((x) => [...x, p.id]);
    setJustAdded(p);
    setCartOpen(true);
  };
  const remove = (id: number) => setPlan((x) => x.filter((y) => y !== id));
  const addMany = (ids: number[]) => {
    setPlan((x) => [...x, ...ids.filter((id) => !x.includes(id))]);
    setJustAdded(null);
    setCartOpen(true);
  };

  const items = plan.map(byId);
  const oneOff = items.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
  const monthly = items.filter((p) => p.monthly).reduce((a, p) => a + p.price, 0);
  const discount = items.length >= 3 ? oneOff * 0.1 : 0;
  const clearAll = () => {
    setDept("All"); setQ(""); setQuery(""); setIndustry("All industries"); setBand("any"); setSpeed("any");
  };

  const filters = (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-1.5 font-semibold">Your industry</div>
        {["All industries", ...INDUSTRIES].map((i) => (
          <Radio key={i} name="industry" checked={industry === i} onChange={() => setIndustry(i)}>{i}</Radio>
        ))}
      </div>
      <div>
        <div className="mb-1.5 font-semibold">Price</div>
        {PRICE_BANDS.map((b) => (
          <Radio key={b.id} name="price" checked={band === b.id} onChange={() => setBand(b.id)}>{b.label}</Radio>
        ))}
      </div>
      <div>
        <div className="mb-1.5 font-semibold">Speed</div>
        {SPEED.map((s) => (
          <Radio key={s.id} name="speed" checked={speed === s.id} onChange={() => setSpeed(s.id)}>{s.label}</Radio>
        ))}
      </div>
      <button type="button" onClick={clearAll} className="cursor-pointer self-start border-0 bg-transparent p-0 text-sm font-semibold text-clay underline">
        Clear all filters
      </button>
    </div>
  );

  return (
    <main>
      {/* Department strip (search lives in the site header) */}
      <div className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="wrap flex items-center gap-3 pt-2">
          {query && <div className="text-[15px]">Results for <b className="text-clay">&ldquo;{query}&rdquo;</b> <button type="button" onClick={() => { setQ(""); setQuery(""); }} className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-[#007185] underline">clear</button></div>}
          <h1 className="m-0 text-[20px] font-bold">{query ? "" : "Automations for small businesses"}</h1>
          {plan.length > 0 && <button type="button" onClick={() => { setJustAdded(null); setCartOpen(true); }} className="ml-auto cursor-pointer border-0 bg-transparent p-0 text-[14px] text-[#007185] underline">View cart ({plan.length})</button>}
        </div>
        <div className="wrap flex gap-1.5 overflow-x-auto py-2 text-sm">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setDept(c)}
              className={`min-h-[34px] shrink-0 cursor-pointer rounded-full px-3 ${dept === c ? "border border-[#007185] bg-[#EDFDFF] font-bold text-ink" : "border border-line bg-white text-ink hover:bg-[#F7FAFA]"}`}
            >
              {c === "All" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap flex flex-wrap items-start gap-8 py-6">
        {/* Filters */}
        <aside className="hidden w-[240px] shrink-0 lg:block">{filters}</aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <details className="rounded-[10px] border border-line bg-white p-4 lg:hidden">
            <summary className="cursor-pointer font-semibold">Filters</summary>
            <div className="pt-4">{filters}</div>
          </details>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="text-[15px]">
              <b>{results.length}</b> result{results.length === 1 ? "" : "s"}
              {query && <> for <b className="text-clay">“{query}”</b></>}
              {industry !== "All industries" && <> in <b>{industry}</b></>}
            </div>
            <label className="flex items-center gap-2 text-sm">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-[40px] py-1 text-sm">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {results.length === 0 && (
            <div className="card flex flex-col gap-2 p-6">
              <div className="font-display text-xl font-bold">No ready-made match.</div>
              <div className="text-ink-2">We build custom automations too. Describe the task and get a free yes/no and a fixed price — replies start at launch.</div>
              <Link href="/ask/" className="btn btn-primary self-start">Can you automate it? Ask free</Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:gap-4">
            {results.slice(0, limit).map((p) => (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:shadow-[0_2px_10px_rgba(15,17,17,0.15)]">
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  aria-label={`See how ${p.name} works`}
                  className="relative flex aspect-[16/7] cursor-pointer items-center justify-center overflow-hidden border-0 p-0 sm:aspect-[16/10]"
                >
                  <CatArt cat={p.cat} />
                  
                  {p.id === 120 && <span className="absolute left-0 top-2 rounded-r bg-[#CC0C39] px-2 py-0.5 text-[12px] font-bold text-white">Try it for $99</span>}
                </button>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <button type="button" onClick={() => setOpen(p)} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[16px] font-normal leading-snug text-ink hover:text-clay hover:underline">
                    {p.name}
                  </button>
                  <p className="m-0 line-clamp-2 text-[13.5px] leading-snug text-ink-2">{p.desc}</p>
                  {p.role && <p className="m-0 text-[12.5px] text-muted">Takes on work of a {p.role}</p>}
                  <div className="mt-auto pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[28px] font-medium leading-none">{priceLabel(p)}</span>
                      {!p.monthly && <span className="text-[13px] text-muted">fixed price</span>}
                    </div>
                    {p.run && <div className="text-[13px] text-muted">Optional support {fmt(runLow(p))}/mo</div>}
                    <div className="mt-1 text-[14px] text-ink">{p.cat === "Courses" ? "Founding enrollment open" : p.cat === "DIY kits" ? <>Instant <b>download</b></> : <LiveBy days={p.days} />}</div>
                    {p.cat !== "Courses" && p.cat !== "DIY kits" && !p.monthly && <div className="text-[13px] text-ok">Approve the test run or full refund</div>}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => (inPlan(p.id) ? remove(p.id) : add(p))}
                      className={`min-h-[36px] cursor-pointer rounded-full text-[14px] ${inPlan(p.id) ? "border border-line bg-white text-ink" : "border border-[#FCD200] bg-[#FFD814] text-ink hover:bg-[#F7CA00]"}`}
                    >
                      {inPlan(p.id) ? "✓ In cart — remove" : "Add to cart"}
                    </button>
                    <Link href={`/checkout/?plan=${p.id}`} className="flex min-h-[36px] items-center justify-center rounded-full border border-[#FF8F00] bg-[#FFA41C] text-[14px] text-ink no-underline hover:bg-[#FA8900] hover:text-ink">
                      Buy now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {results.length > limit && (
            <button type="button" onClick={() => setLimit((n) => n + 24)} className="btn btn-outline mt-4 self-center">
              Show more ({results.length - limit} left)
            </button>
          )}

          {/* Complete processes */}
          <div className="mt-6 flex flex-col gap-3">
            <h2 className="m-0 font-display text-2xl font-bold">Complete processes — save 10%</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {BUNDLES.map((b) => {
                const bi = b.ids.map(byId);
                const full = bi.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
                return (
                  <div key={b.name} className="flex w-[300px] shrink-0 flex-col gap-2 rounded-xl border border-line bg-white p-4">
                    <div className="text-[12px] text-muted">{b.depts}</div>
                    <div className="font-display text-lg font-bold">{b.name}</div>
                    <div className="text-[13px] text-ink-2">{bi.map((p) => p.name).join(" → ")}</div>
                    <div className="mt-auto">
                      <b className="font-display text-xl">{fmt(full * 0.9)}</b> <span className="text-sm text-ok">save 10% vs buying separately</span>
                    </div>
                    <button type="button" onClick={() => addMany(b.ids)} className="min-h-[40px] cursor-pointer rounded-full border-0 bg-amber text-sm font-semibold text-ink">
                      Add all {b.ids.length} to cart
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Plan drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(21,23,26,0.5)]" onClick={() => setCartOpen(false)}>
          <aside
            role="dialog"
            aria-label="Your cart"
            className="flex h-full w-full max-w-[400px] flex-col gap-3 overflow-y-auto bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="font-display text-2xl font-bold">Your cart</div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close" className="min-h-[44px] min-w-[44px] cursor-pointer border-0 bg-transparent text-2xl">×</button>
            </div>
            {justAdded && (
              <div className="rounded-lg bg-[#E5F4E4] px-3 py-2 text-[14px] font-semibold text-ok">✓ Added: {justAdded.name}</div>
            )}
            {items.length === 0 && <div className="text-ink-2">Your cart is empty.</div>}
            {items.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3 border-b border-line pb-2.5">
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium">{p.name}</span>
                  <button type="button" onClick={() => remove(p.id)} className="cursor-pointer self-start border-0 bg-transparent p-0 text-[13px] text-clay underline">Remove</button>
                </div>
                <span className="font-mono text-[14px]">{priceLabel(p)}</span>
              </div>
            ))}
            {discount > 0 && (
              <div className="flex justify-between text-[15px] text-ok"><span>3+ items, 10% off</span><span className="font-mono">−{fmt(discount)}</span></div>
            )}
            {items.length > 0 && (
              <>
                {oneOff > 0 && (
                  <div className="flex items-baseline justify-between">
                  <span className="text-muted">One-off build</span>
                  <span className="font-display text-3xl font-bold">{fmt(oneOff - discount)}</span>
                  </div>
                )}
                {monthly > 0 && (
                  <div className="flex items-baseline justify-between"><span className="text-muted">Monthly</span><span className="font-display text-xl font-bold">{fmt(monthly)}/mo</span></div>
                )}
                {items.length < 3 && oneOff > 0 && <div className="text-[13px] text-ink-2">Add {3 - items.length} more for 10% off the build.</div>}
                <Link href={`/checkout/?plan=${plan.join(",")}`} className="btn btn-primary">Proceed to checkout</Link>
              </>
            )}
            <button type="button" onClick={() => setCartOpen(false)} className="btn btn-outline">Keep browsing</button>
            <div className="mt-2 text-[12px] text-muted">UK, Australian and Canadian prices are fixed local prices; other currencies are shown for guidance. Final scope confirmed on your setup form.</div>
          </aside>
        </div>
      )}

      {open && (
        <ProductDetail p={open} inPlan={inPlan(open.id)} onAdd={() => { add(open); setOpen(null); }} onClose={() => setOpen(null)}>
          {BUNDLES.filter((b) => b.ids.includes(open.id)).slice(0, 1).map((b) => {
            const bi = b.ids.map(byId);
            const full = bi.filter((p) => !p.monthly).reduce((a, p) => a + p.price, 0);
            return (
              <div key={b.name} className="mt-2 flex flex-col gap-2.5 rounded-xl border border-line p-4">
                <div className="font-semibold">Often added together — {b.name}</div>
                <div className="flex flex-wrap items-center gap-2 text-[14px]">
                  {bi.map((p, i) => (
                    <span key={p.id} className="flex items-center gap-2">
                      <span className={`rounded-md border px-2.5 py-1.5 ${p.id === open.id ? "border-clay" : "border-line"}`}>{p.name}</span>
                      {i < bi.length - 1 && <span className="text-muted">+</span>}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>Total: <b>{fmt(full * 0.9)}</b> <span className="text-sm text-ok">save 10% vs buying separately</span></span>
                  <button type="button" onClick={() => { addMany(b.ids); setOpen(null); }} className="min-h-[40px] cursor-pointer rounded-full border-0 bg-amber px-4 text-sm font-semibold text-ink">
                    Add all {b.ids.length} to cart
                  </button>
                </div>
              </div>
            );
          })}
        </ProductDetail>
      )}
    </main>
  );
}
