import type { Metadata } from "next";
import Link from "next/link";
import { REFERRALS_LIVE, REFERRAL_CREDIT_USD } from "@/lib/launch";
import { fmt } from "@/lib/catalogue";
import { seoTitle } from "@/lib/geo";

export const metadata: Metadata = {
  title: seoTitle("Refer a business owner"),
  robots: REFERRALS_LIVE ? undefined : { index: false, follow: false },
};

export default function ReferPage() {
  if (!REFERRALS_LIVE) {
    return (
      <main className="wrap flex flex-col gap-3 pb-16 pt-12">
        <h1 className="m-0 font-display text-3xl font-bold">Client referrals open soon</h1>
        <p className="m-0 text-ink-2">Our referral scheme for clients starts after launch. Are you an accountant or bookkeeper? <Link href="/partners/">See the partner program</Link>.</p>
      </main>
    );
  }
  return (
    <main className="wrap flex flex-col gap-6 pb-16 pt-12">
      <div className="kicker">For our clients</div>
      <h1 className="m-0 max-w-[860px] font-display text-[clamp(30px,4.5vw,46px)] font-bold leading-[1.08] tracking-tight">Know an owner drowning in admin? You both get {fmt(REFERRAL_CREDIT_USD)} off.</h1>
      <ol className="m-0 grid grid-cols-1 gap-3 p-0 md:grid-cols-3">
        {["Share your link (from your welcome email) with another business owner.", `They get ${fmt(REFERRAL_CREDIT_USD)} off their first build.`, `When they buy, you get ${fmt(REFERRAL_CREDIT_USD)} credit off your next build or support plan.`].map((x, i) => (
          <li key={x} className="card flex list-none gap-3 p-5 text-[15px]"><b className="text-muted">0{i + 1}</b><span>{x}</span></li>
        ))}
      </ol>
      <p className="m-0 text-[13px] text-muted">Credit applies to builds bought through your link. Terms: <Link href="/legal/terms/">see our terms</Link>.</p>
    </main>
  );
}
