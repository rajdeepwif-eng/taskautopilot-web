"use client";

import { useMemo, useState } from "react";
import { dealById, DealId } from "@/lib/deals";
import { DOCUMENTS, VERDICT_TEXT, assess, checksFor, Verdict } from "@/lib/dealRules";

const CHIP: Record<Verdict, string> = { pass: "bg-[#E7F6EC] text-[#0B6B2E]", refer: "bg-[#FFF4E5] text-[#8A4B00]", decline: "bg-[#FDECEA] text-[#B12704]" };
const EXAMPLE = { deal: "results", name: "Dave Hughes", email: "dave@example.co.uk", company: "Hughes Plumbing Ltd", companyNumber: "01234567", country: "United Kingdom", stage: "£200k–£750k", legalForm: "Limited company / LLC / corporation", trading: "Over 3 years", role: "Owner / director", gainType: "Late invoices recovered", baselineMonths: "6–12 months", dataSystem: "Xero", dataAccess: "Yes", goal: "Invoices go out late and we chase by hand." };

/**
 * Internal: paste an application (the JSON from the lead email/alert) to get the approval pack —
 * first-pass verdict and reasons, the checks to run with official links, documents to request,
 * and a decision record to copy into the CRM. Rules come from src/lib/dealRules.ts.
 */
export default function DealReviewClient() {
  const [raw, setRaw] = useState("");
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const app = useMemo(() => { try { const j = JSON.parse(raw); return j.data ?? j; } catch { return null; } }, [raw]);
  const deal = (app?.deal ?? "") as DealId;
  const d = app ? dealById(deal) : undefined;
  const res = d ? assess(deal, app) : null;
  const checks = d ? checksFor(deal, app) : [];
  const docs = d ? DOCUMENTS[deal] : [];
  const record = d && res ? [
    `DEAL REVIEW — ${app.company} (${d.name})`, `Applicant: ${app.name} <${app.email}> · ${app.country} · ${app.stage}`,
    `First-pass: ${VERDICT_TEXT[res.verdict]}${res.flags.length ? " — " + res.flags.map((x) => x.reason).join(" | ") : ""}`,
    `Checks done: ${checks.filter((_, i) => done[i]).length}/${checks.length}${checks.some((_, i) => !done[i]) ? " (open: " + checks.filter((_, i) => !done[i]).map((x) => x.label).join("; ") + ")" : ""}`,
    `Decision: ${decision || "not set"}${notes ? " — " + notes : ""}`, `Reviewed: ${new Date().toISOString().slice(0, 10)}`,
  ].join("\n") : "";

  return (
    <main className="wrap flex max-w-[980px] flex-col gap-5 pb-16 pt-10">
      <div className="kicker">Internal · deal review</div>
      <h1 className="m-0 font-display text-3xl font-bold">Approve a deal in one place</h1>
      <p className="m-0 max-w-[720px] text-ink-2">Paste an application from the lead alert. You get the first-pass verdict, the checks to run (with official links), the documents to request, and a decision note to copy. A person always makes the final call; this is not legal or tax advice.</p>
      <div className="flex flex-col gap-2">
        <textarea aria-label="Application JSON" rows={6} value={raw} onChange={(e) => { setRaw(e.target.value); setDone({}); setDecision(""); }} placeholder='{"deal":"monthly","company":"…"}' className="font-mono text-[12.5px]" data-testid="review-input" />
        <button type="button" className="btn btn-outline self-start !min-h-[40px]" onClick={() => { setRaw(JSON.stringify(EXAMPLE, null, 2)); setDone({}); }}>Load an example</button>
      </div>
      {raw && !d && <div role="alert" className="text-sm text-[#B12704]">That doesn&apos;t look like an application — paste the JSON from the lead alert.</div>}
      {d && res && (
        <>
          <section className="card flex flex-col gap-2 p-5" data-testid="review-pack">
            <div className="flex flex-wrap items-center gap-3"><h2 className="m-0 text-xl font-bold">{app.company}</h2><span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${CHIP[res.verdict]}`} data-testid="review-verdict">{VERDICT_TEXT[res.verdict]}</span></div>
            <div className="text-[14px] text-ink-2">{d.name} · {app.name} ({app.role || "role not given"}) · {app.country} · {app.stage} · trading {app.trading || "?"}</div>
            {res.flags.length ? <ul className="m-0 flex flex-col gap-1 pl-5 text-[14px]">{res.flags.map((x) => <li key={x.reason}><b className="capitalize">{x.verdict}:</b> {x.reason}</li>)}</ul> : <p className="m-0 text-[14px] text-ok">No flags from the answers — run the checks below.</p>}
          </section>
          <section className="card flex flex-col gap-2 p-5">
            <h2 className="m-0 text-lg font-bold">Checks before approval ({checks.filter((_, i) => done[i]).length}/{checks.length})</h2>
            {checks.map((c, i) => (
              <label key={c.label} className="flex items-start gap-2 text-[14px]"><input type="checkbox" className="mt-1" checked={!!done[i]} onChange={(e) => setDone({ ...done, [i]: e.target.checked })} />
                <span><b>{c.label}</b>{c.url && <> · <a href={c.url} target="_blank" rel="noopener">open</a></>}<br /><span className="text-ink-2">{c.why}</span></span></label>
            ))}
          </section>
          <section className="card flex flex-col gap-2 p-5">
            <h2 className="m-0 text-lg font-bold">Documents to close it</h2>
            <ol className="m-0 flex flex-col gap-1 pl-5 text-[14px] text-ink-2">{docs.map((x) => <li key={x}>{x}</li>)}</ol>
          </section>
          <section className="card flex flex-col gap-3 p-5">
            <h2 className="m-0 text-lg font-bold">Decision</h2>
            <div className="flex flex-wrap gap-2">{["Approve", "Approve with conditions", "Decline — offer another way to pay"].map((x) => <button key={x} type="button" aria-pressed={decision === x} onClick={() => setDecision(x)} className={`min-h-[44px] cursor-pointer rounded-lg border px-3 text-sm ${decision === x ? "border-2 border-ink bg-ink text-white" : "border-line bg-white"}`}>{x}</button>)}</div>
            <textarea rows={2} aria-label="Conditions or notes" placeholder="Conditions or notes (e.g. 3 months' bank statements; director guarantee)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <pre className="m-0 whitespace-pre-wrap rounded-lg bg-paper p-3 text-[12.5px]" data-testid="review-record">{record}</pre>
            <button type="button" className="btn btn-primary self-start" onClick={() => { navigator.clipboard?.writeText(record).then(() => setCopied(true), () => setCopied(false)); }}>{copied ? "Copied" : "Copy decision note"}</button>
          </section>
        </>
      )}
    </main>
  );
}
