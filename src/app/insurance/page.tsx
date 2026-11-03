import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = { title: "Automation for insurance agencies & claims teams — TaskAutopilot" };

export default function InsurancePage() {
  return (
    <IndustryPage
      c={{
        kicker: "INSURANCE AGENCIES · MGAs · CLAIMS TEAMS",
        title: "Quote faster, renew more, and start every claim with a complete file.",
        lede: "Quote requests, follow-ups, renewals and first notice of loss handled automatically — so your agents sell and your adjusters adjust.",
        pains: [
          { t: "Quotes go cold", d: "Shoppers often buy from whoever answers first. Every request gets captured and followed up until the customer decides." },
          { t: "Renewals slip", d: "Policies are contacted at 60, 30 and 7 days out, with changes flagged to an agent before the date passes." },
          { t: "Claims arrive half-complete", d: "Photos, reports and policy documents are read, filed and chased, so the handler starts on a full file." },
        ],
        productIds: [45, 46, 7, 32],
        apps: "AgencyZoom, EZLynx, Applied Epic, HawkSoft, Guidewire, Duck Creek, Outlook, Gmail",
        ctaNote: "Insurance data needs care. Before any build we agree in writing what data is used, where it is stored and who can see it — and your compliance lead or counsel signs it off.",
        care: [
          { t: "Your accounts, your data", d: "Built inside systems you own. We get only the access the workflow needs, and you can remove it at any time." },
          { t: "A person approves", d: "Customer messages, coverage questions and claim decisions go to your staff for approval — automation does the admin, not the judgement." },
          { t: "Written data agreement", d: "A data processing agreement and sub-processor list before go-live, reviewed by your counsel." },
        ],
      }}
    />
  );
}
