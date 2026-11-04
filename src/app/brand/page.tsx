import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Brand kit | TaskAutoMode" }, robots: { index: false, follow: false } };

const B = process.env.PAGES_BASE_PATH || "";
const FILES: [string, string, string][] = [
  ["Logo + tagline (light)", "taskautomode-logo-tagline", "white or light backgrounds"],
  ["Logo + tagline (dark)", "taskautomode-logo-tagline-dark", "navy or dark backgrounds"],
  ["Logo (light)", "taskautomode-logo", "small spaces, light"],
  ["Logo (dark)", "taskautomode-logo-dark", "small spaces, dark"],
  ["App icon", "taskautomode-icon", "social profile pictures, app icons"],
  ["Browser-tab icon", "taskautomode-favicon", "16–32 px only"],
];
const COLOURS: [string, string, string][] = [
  ["Navy", "#131921", "text, dark backgrounds"],
  ["Orange", "#FF9900", "switch and 'AutoMode' on dark"],
  ["Deep orange", "#D9730D", "switch and 'AutoMode' on white (readable)"],
  ["White", "#FFFFFF", "knob, text on dark"],
  ["Slate", "#4A5360", "tagline on white"],
];

/** Internal: everything a printer, designer or partner needs to use the brand correctly. */
export default function BrandPage() {
  return (
    <main className="wrap flex flex-col gap-8 pb-16 pt-10">
      <div className="kicker">Internal · brand kit</div>
      <h1 className="m-0 font-display text-[clamp(28px,4vw,40px)] font-bold">TaskAutoMode brand kit</h1>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FILES.map(([n, f, use]) => (
          <div key={f} className="card flex flex-col gap-3 p-5">
            <div className={`flex min-h-[120px] items-center justify-center rounded-lg p-4 ${f.includes("dark") ? "bg-[#131921]" : "bg-white border border-line"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${B}/brand/${f}.svg`} alt={n} className="max-h-[90px] max-w-full" />
            </div>
            <div><b>{n}</b> <span className="text-[14px] text-muted">— {use}</span></div>
            <div className="flex gap-4 text-[14px]"><a href={`${B}/brand/${f}.svg`} download>SVG (print, any size)</a><a href={`${B}/brand/${f}.png`} download>PNG (web, office)</a></div>
          </div>
        ))}
      </section>
      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-xl font-bold">Colours</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {COLOURS.map(([n, hex, use]) => (
            <div key={hex} className="flex flex-col gap-1 text-[14px]"><span className="h-14 rounded-lg border border-line" style={{ background: hex }} /><b>{n}</b><code>{hex}</code><span className="text-muted">{use}</span></div>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card flex flex-col gap-2 p-5">
          <h2 className="m-0 text-xl font-bold">Words</h2>
          <ul className="m-0 flex flex-col gap-1.5 pl-5 text-[15px] text-ink-2">
            <li><b>Name:</b> TaskAutoMode — one word, capital T, A and M. Never &quot;Task Auto Mode&quot; or &quot;TaskAutomode&quot;.</li>
            <li><b>Tagline (official):</b> Everyday tasks, automated for you</li>
            <li><b>Campaign line (ads, vans, flyers):</b> Switch on. Get your time back.</li>
            <li><b>Font:</b> Inter ExtraBold for the logo and headings (free from Google Fonts)</li>
          </ul>
        </div>
        <div className="card flex flex-col gap-2 p-5">
          <h2 className="m-0 text-xl font-bold">Do / don&apos;t</h2>
          <ul className="m-0 flex flex-col gap-1.5 pl-5 text-[15px] text-ink-2">
            <li>✅ Leave clear space around the logo at least the height of the knob.</li>
            <li>✅ Use the deep-orange version on white, the bright version on navy.</li>
            <li>✅ Keep the switch ON (knob on the right) — it&apos;s the whole idea.</li>
            <li>❌ Don&apos;t stretch, rotate, outline or add shadows.</li>
            <li>❌ Don&apos;t change the colours or put the logo on busy photos.</li>
            <li>❌ Don&apos;t add arrows or smiles (keeps us clear of big-brand look-alikes).</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
