import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = { title: "Automation for law firms — TaskAutopilot" };

export default function LegalFirmsPage() {
  return (
    <IndustryPage
      c={{
        kicker: "LAW FIRMS · SMALL & MID-SIZE PRACTICES",
        title: "Turn more inquiries into signed clients — without your team chasing forms.",
        lede: "Every inquiry answered fast, intake forms and documents collected automatically, and your staff freed for billable work.",
        pains: [
          { t: "Inquiries wait", d: "A prospective client who waits until tomorrow often calls another firm. Every inquiry gets a reply and a booking link within a minute." },
          { t: "Intake is chasing", d: "Forms, IDs and documents are requested, checked for gaps and chased automatically until the file is complete." },
          { t: "Missed calls are lost matters", d: "Calls you can't take get an instant text back and a booking link, day or night." },
        ],
        productIds: [32, 10, 7, 11],
        apps: "Clio, MyCase, PracticePanther, Lawmatics, Microsoft 365, Google Workspace, DocuSign",
        ctaNote: "Client confidentiality comes first. We agree in writing what data the automation touches and where it is stored, and your firm's rules on conflicts and privilege stay with your lawyers.",
        care: [
          { t: "No legal judgement automated", d: "Automation collects and organises. Conflict checks, advice and engagement decisions stay with your lawyers." },
          { t: "Your accounts, your data", d: "Built inside your practice-management and document systems, with only the access the workflow needs." },
          { t: "Written data agreement", d: "A data processing agreement and sub-processor list before go-live, for your firm to review." },
        ],
      }}
    />
  );
}
