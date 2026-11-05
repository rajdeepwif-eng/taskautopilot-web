"use client";

import { useMemo, useState } from "react";
import { dealById, DealId } from "@/lib/deals";
import { APPROVAL_VALID_DAYS, DOCUMENTS, VERDICT_TEXT, assess, checksFor, riskGrade, Verdict } from "@/lib/dealRules";

const CHIP: Record<Verdict, string> = { pass: "bg-[#E7F6EC] text-[#0B6B2E]", refer: "bg-[#FFF4E5] text-[#8A4B00]", decline: "bg-[#FDECEA] text-[#B12704]" };
const GRADE: Record<string, string> = { A: "bg-[#E7F6EC] text-[#0B6B2E]", B: "bg-[#EEF4FF] text-[#1D4ED8]", C: "bg-[#FFF4E5] text-[#8A4B00]", D: "bg-[#FDECEA] text-[#B12704]" };
const EXAMPLE = { deal: "results", name: "Dave Hughes", email: "dave@example.co.uk", company: "Hughes Plumbing Ltd", companyNumber: "01234567", country: "United Kingdom", stage: "£200k–£750k", legalForm: "Limited company / LLC / corporation", trading: "Over 3 years", role: "Owner / director", projectValue: "1,000–5,000", gainType: "Late invoices recovered", baselineMonths: "6–12 months", dataSystem: "Xero", dataAccess: "Yes", goal: "Invoices go out late and we chase by hand.", pack: { at: "2026-11-05T09:12:00.000Z" } };
const DECISIONS = ["Approve", "Approve with conditions", "Decline — offer another way to pay", "Refer to second approver"];
const now = () => new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

/**
 * Internal: paste an application (the JSON from the lead alert) to get a credit-memo style approval pack —
 * summary, risk grade with reasons, the checks to run (required ones gate approval), conditions before
 * work starts, two-person sign-off, approval expiry and an audit trail to copy or print.
 * Rules come from src/lib/dealRules.ts. Before launch this must sit behind a login (see /launch/).
 */
export default function DealReviewClient() {
  const [raw, setRaw] = useState("");
  const [done, setDone] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [conds, setConds] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [second, setSecond] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const app = useMemo(() => { try { const j = JSON.parse(raw); return j.data ?? j; } catch { return null; } }, [raw]);
  const deal = (app?.deal ?? "") as DealId;
  const d = app ? dealById(deal) : undefined;
  const res = d ? assess(deal, app) : null;
  const checks = d ? checksFor(deal, app) : [];
  const docs = d ? DOCUMENTS[deal] : [];
  const grade = res ? riskGrade(res.flags) : null;
  const reqOpen = checks.filter((c) => c.required && !done[c.label]);
  const big = app?.projectValue === "Over 20,000" || app?.deal === "equity" || app?.deal === "succession" || app?.deal === "hybrid";
  const needSecond = !!grade && (grade.grade === "C" || grade.grade === "D" || big);
  const approving = /^Approve/.test(decision);
  const blockers = [
    ...(approving && reqOpen.length ? [`${reqOpen.length} required check${reqOpen.length > 1 ? "s" : ""} still open`] : []),
    ...(approving && grade?.grade === "D" ? ["Grade D — restructure the deal rather than approve"] : []),
    ...(decision && !reviewer.trim() ? ["Add the reviewer's name"] : []),
    ...(approving && needSecond && !second.trim() ? ["Second approver needed (grade C/D, over 20,000, or a shares deal)"] : []),
    ...(approving && second.trim() && second.trim().toLowerCase() === reviewer.trim().toLowerCase() ? ["Second approver must be a different person"] : []),
    ...(decision === "Approve with conditions" && !conds.trim() ? ["List the conditions"] : []),
  ];
  const ready = !!decision && blockers.length === 0;
  const expiry = new Date(Date.now() + APPROVAL_VALID_DAYS * 864e5).toISOString().slice(0, 10);
  const stamp = (msg: string) => setLog((l) => [...l, `${now()} · ${reviewer.trim() || "reviewer?"} · ${msg}`]);
  const reset = () => { setDone({}); setDecision(""); setLog([]); setConds(""); setNotes(""); };

  const record = d && res && grade ? [
    `CREDIT MEMO — ${app.company} · ${d.name}`,
    `Applicant: ${app.name} <${app.email}> · ${app.role || "role not given"} · ${app.country} · ${app.legalForm || "?"} ${app.companyNumber ? "#" + app.companyNumber : ""}`,
    `Requested: ${d.name}${app.term ? " over " + app.term : ""} · project ${app.projectValue || "not given"} · revenue ${app.stage} · trading ${app.trading || "?"}`,
    `Received: ${app.pack?.at ? String(app.pack.at).replace("T", " ").slice(0, 16) + " UTC" : "unknown"}`,
    `Risk grade: ${grade.grade} (${grade.text}) · first pass: ${VERDICT_TEXT[res.verdict]}`,
    ...res.flags.map((x) => `  - ${x.verdict}: ${x.reason}`),
    `Checks: ${checks.filter((c) => done[c.label]).length}/${checks.length} done; required open: ${reqOpen.length ? reqOpen.map((c) => c.label).join("; ") : "none"}`,
    ...checks.filter((c) => done[c.label]).map((c) => `  ✓ ${c.label} — ${done[c.label]}`),
    `Decision: ${decision || "not set"}${decision ? ` · valid until ${expiry}` : ""}`,
    ...(conds.trim() ? ["Conditions before work starts:", ...conds.trim().split("\n").map((x) => "  □ " + x)] : []),
    ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
    `Reviewer: ${reviewer || "—"} · Second approver: ${second || (needSecond ? "REQUIRED" : "not required")}`,
    ...(log.length ? ["Audit trail:", ...log.map((x) => "  " + x)] : []),
  ].join("\n") : "";

  return (
    <main className="wrap flex max-w-[980px] flex-col gap-5 pb-16 pt-10 print:pt-0">
      <div className="kicker">Internal · deal review</div>
      <h1 className="m-0 font-display text-3xl font-bold">Approve a deal in one place</h1>
      <div className="rounded-lg border border-[#B12704] bg-[#FDECEA] px-3 py-2 text-[13.5px] print:hidden" data-testid="internal-warning"><b>Internal tool, pre-launch.</b> Nothing here is saved or sent. Before live applications arrive, this moves behind a login and loads applications by ID — never paste real applicant data into a shared computer.</div>
      <p className="m-0 max-w-[720px] text-ink-2 print:hidden">Paste an application from the lead alert. You get a credit memo: summary, risk grade, the checks (required ones must be ticked before approval), conditions, two-person sign-off and an audit trail to copy or print. A person always makes the final call; this is not legal or tax advice.</p>
      <div className="flex flex-col gap-2 print:hidden">
        <textarea aria-label="Application JSON" rows={6} value={raw} onChange={(e) => { setRaw(e.target.value); reset(); }} placeholder='{"deal":"monthly","company":"…"}' className="font-mono text-[12.5px]" data-testid="review-input" />
        <button type="button" className="btn btn-outline self-start !min-h-[40px]" onClick={() => { setRaw(JSON.stringify(EXAMPLE, null, 2)); reset(); }}>Load an example</button>
      </div>
      {raw && !d && <div role="alert" className="text-sm text-[#B12704]">That doesn&apos;t look like an application — paste the JSON from the lead alert.</div>}
      {d && res && grade && (
        <>
          <section className="card flex flex-col gap-3 p-5" data-testid="review-pack">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="m-0 text-xl font-bold">{app.company}</h2>
              <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${GRADE[grade.grade]}`} data-testid="review-grade">Risk {grade.grade} · {grade.text}</span>
              <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${CHIP[res.verdict]}`} data-testid="review-verdict">{VERDICT_TEXT[res.verdict]}</span>
            </div>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:grid-cols-4" data-testid="review-summary">
              {[["Way to pay", d.name], ["Term", app.term || "—"], ["Project size", app.projectValue || "not given"], ["Revenue", app.stage || "—"], ["Applicant", `${app.name} (${app.role || "role?"})`], ["Business", `${app.legalForm || "?"}${app.companyNumber ? " · " + app.companyNumber : ""}`], ["Country", app.country || "—"], ["Trading", app.trading || "—"]].map(([k, v]) => (
                <div key={k}><dt className="text-[12px] uppercase tracking-wide text-muted">{k}</dt><dd className="m-0 font-semibold">{v}</dd></div>
              ))}
            </dl>
            {res.flags.length ? <ul className="m-0 flex flex-col gap-1 pl-5 text-[14px]">{res.flags.map((x) => <li key={x.reason}><b className="capitalize">{x.verdict}:</b> {x.reason}</li>)}</ul> : <p className="m-0 text-[14px] text-ink-2">No flags from the answers. That isn&apos;t an approval — run the checks below.</p>}
          </section>
          <section className="card flex flex-col gap-2 p-5">
            <h2 className="m-0 text-lg font-bold">Checks before approval ({checks.filter((c) => done[c.label]).length}/{checks.length} · {reqOpen.length} required open)</h2>
            {checks.map((c) => (
              <label key={c.label} className="flex items-start gap-2 text-[14px]"><input type="checkbox" className="mt-1" checked={!!done[c.label]} onChange={(e) => { const on = e.target.checked; setDone((x) => { const n = { ...x }; if (on) n[c.label] = `${now()} by ${reviewer.trim() || "reviewer?"}`; else delete n[c.label]; return n; }); stamp(`${on ? "ticked" : "unticked"}: ${c.label}`); }} />
                <span><b>{c.label}</b>{c.required && <span className="ml-1 rounded bg-ink px-1.5 text-[11px] font-semibold text-white">Required</span>}{c.url && <> · <a href={c.url} target="_blank" rel="noopener">open</a></>}<br /><span className="text-ink-2">{c.why}</span>{done[c.label] && <><br /><span className="text-[12px] text-muted">Done {done[c.label]}</span></>}</span></label>
            ))}
          </section>
          <section className="card flex flex-col gap-2 p-5">
            <h2 className="m-0 text-lg font-bold">Documents to close it</h2>
            <ol className="m-0 flex flex-col gap-1 pl-5 text-[14px] text-ink-2">{docs.map((x) => <li key={x}>{x}</li>)}</ol>
          </section>
          <section className="card flex flex-col gap-3 p-5">
            <h2 className="m-0 text-lg font-bold">Decision</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">Reviewer<input value={reviewer} onChange={(e) => setReviewer(e.target.value)} data-testid="reviewer" /></label>
              <label className="flex flex-col gap-1.5 text-sm"><span>Second approver {needSecond ? <b className="text-[#B12704]">(required)</b> : <span className="text-muted">(not required)</span>}</span><input value={second} onChange={(e) => setSecond(e.target.value)} data-testid="second" /></label>
            </div>
            <div className="flex flex-wrap gap-2">{DECISIONS.map((x) => <button key={x} type="button" aria-pressed={decision === x} onClick={() => { setDecision(x); stamp(`decision set: ${x}`); }} className={`min-h-[44px] cursor-pointer rounded-lg border px-3 text-sm ${decision === x ? "border-2 border-ink bg-ink text-white" : "border-line bg-white"}`}>{x}</button>)}</div>
            <label className="flex flex-col gap-1.5 text-sm">Conditions before work starts (one per line)<textarea rows={3} value={conds} onChange={(e) => setConds(e.target.value)} placeholder={"3 months' bank statements\nDirector guarantee signed (solicitor)"} /></label>
            <label className="flex flex-col gap-1.5 text-sm">Notes<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            {decision && (blockers.length ? <div role="status" className="rounded-lg bg-[#FFF4E5] p-3 text-[14px]" data-testid="review-blockers"><b>Not ready to sign off:</b><ul className="m-0 mt-1 pl-5">{blockers.map((b) => <li key={b}>{b}</li>)}</ul></div>
              : <div role="status" className="rounded-lg bg-[#E7F6EC] p-3 text-[14px] text-[#0B6B2E]" data-testid="review-ready"><b>Ready to record.</b> {approving ? `Approval valid until ${expiry} (${APPROVAL_VALID_DAYS} days) — rerun the checks after that.` : ""}</div>)}
            <pre className="m-0 whitespace-pre-wrap rounded-lg bg-paper p-3 text-[12.5px]" data-testid="review-record">{record}</pre>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button type="button" disabled={!ready} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50" data-testid="review-copy" onClick={() => { stamp("memo copied"); navigator.clipboard?.writeText(record).then(() => setCopied(true), () => setCopied(false)); }}>{copied ? "Copied" : "Copy credit memo"}</button>
              <button type="button" disabled={!ready} className="btn btn-outline disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { stamp("memo printed"); window.print(); }}>Print / save as PDF</button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
