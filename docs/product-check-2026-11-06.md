# Product check — every product (6 Nov 2026)

Method: each product's apps checked against (1) n8n's own node registry (via n8n MCP — native node or HTTP API), (2) the vendor's API docs / policy, (3) an independent integration report where access looked restricted. Native n8n node = Primary.

Result: 144 products · 125 correct · 19 fixed.

No native n8n node (use HTTP Request + vendor API): DocuSign, Zoho Books, Sage, Klaviyo, Search Console, Instagram (via Facebook Graph API), Jobber, Square, SafetyCulture, PandaDoc, GoCardless, Deputy, Connecteam, Canva, Power BI, GoHighLevel.

| ID | Product | Verdict |
|---|---|---|
| 1 | Local SEO Lite | Correct |
| 2 | Local SEO Growth | Correct |
| 3 | Location landing pages | Correct |
| 4 | Website that books & takes payment | Correct |
| 5 | Booking platform Pro | Correct |
| 6 | Customer & staff portal | Correct |
| 7 | AI phone receptionist | Correct |
| 8 | AI website & WhatsApp assistant | Correct |
| 9 | Company knowledge assistant | Correct |
| 10 | Instant lead reply & booking | Correct |
| 11 | Missed-call text-back | Fixed: Landlines cannot text |
| 12 | AI outbound prospecting | Correct |
| 13 | Quote follow-up chaser | Correct |
| 14 | Lead scoring & routing | Correct |
| 15 | Review requests & replies | Fixed: Review gating removed |
| 16 | Email follow-up & win-back | Correct |
| 17 | Social media on autopilot | Fixed: TikTok needs app audit |
| 18 | Google & Meta ads management | Correct |
| 19 | Wasted ad spend audit | Correct |
| 20 | Abandoned cart & post-purchase flows | Correct |
| 21 | Supplier invoice reader | Correct |
| 22 | Automated invoice reminders & collections | Correct |
| 23 | Nightly bank matching | Fixed: Renamed bank matching; Xero API cannot reconcile |
| 24 | Receipts & expenses | Fixed: Dext has no open API — removed |
| 25 | Owner dashboard | Correct |
| 26 | Job scheduling & dispatch | Correct |
| 27 | Stock in & out by QR scan | Correct |
| 28 | Orders sync | Fixed: Toast/DoorDash partner-gated |
| 29 | Proof of delivery & job sign-off | Correct |
| 30 | Staff onboarding & shift schedules | Correct |
| 31 | CRM & accounts sync | Correct |
| 32 | Client intake & document collection | Correct |
| 33 | Patient booking, reminders & intake | Correct |
| 34 | Tenant & maintenance requests | Correct |
| 35 | Reservations & no-show reminders | Correct |
| 36 | Documents to data | Correct |
| 37 | Inspections & defect follow-up | Correct |
| 38 | Expiry & renewal reminders | Correct |
| 39 | Failure alerts & daily watchdog | Correct |
| 40 | Never miss a job — Solo | Correct |
| 41 | Invoice & chase — Solo | Correct |
| 42 | Receipts to tidy books — Solo | Fixed: Same as 24 |
| 43 | Reviews & repeat work — Solo | Fixed: Review gating removed |
| 44 | Solo Care | Correct |
| 45 | Insurance quote intake, follow-up & renewals | Fixed: Insurance systems vendor-gated |
| 46 | Claims intake (FNOL) & document triage | Fixed: Claims systems vendor-gated |
| 47 | SafetyCulture setup & automation | Correct |
| 48 | Forms to workflow (Google Forms, Microsoft Forms, Jotform) | Correct |
| 49 | AI Chief of Staff — one daily brief | Correct |
| 50 | Assistant & team progress report | Correct |
| 51 | Research on any task | Correct |
| 52 | Ops engineer — weekly improvement ideas | Correct |
| 53 | Strategy to action plan | Correct |
| 54 | SOP writer — tasks your team can follow | Correct |
| 55 | Missed-call text-back — DIY kit | Correct |
| 56 | Instant lead reply — DIY kit | Correct |
| 57 | Review requests — DIY kit | Correct |
| 58 | Supplier invoice reader — DIY kit | Correct |
| 59 | Nightly bank matching — DIY kit | Fixed: Same as 23 |
| 60 | Forms to workflow — DIY kit | Correct |
| 61 | Delegate from chat — message to Asana task | Correct |
| 62 | Staff accountability system in Asana | Correct |
| 63 | Weekly team review & scorecard | Correct |
| 64 | WhatsApp Business setup & automations | Correct |
| 65 | Google Business Profile & reviews — managed | Fixed: Review gating removed |
| 66 | AI voice calls — confirmations & follow-ups | Correct |
| 67 | Auto-translate messages & documents | Correct |
| 68 | Invoices & documents to Excel | Correct |
| 69 | Invoices to Excel — DIY kit | Correct |
| 70 | Automate your business in 30 days (self-paced) | Correct |
| 71 | Run your team from Asana & Slack (self-paced) | Correct |
| 72 | Build your AI Chief of Staff (self-paced) | Correct |
| 73 | n8n for operations managers (self-paced) | Correct |
| 74 | Automation Builder — live cohort with 1-to-1 builds | Correct |
| 75 | Team workshop — one day, your workflows | Correct |
| 76 | Team license — any course for up to 10 staff | Correct |
| 77 | Managing with AI — delegation & accountability (for managers) | Correct |
| 78 | Safety & compliance automation | Correct |
| 79 | GPS clock in & clock out | Fixed: Homebase API Enterprise-only |
| 80 | CCTV watch — alerts that matter | Fixed: Cameras need events/API |
| 81 | BRCGS & HACCP audit-ready records (factories) | Correct |
| 82 | Batch records & traceability | Correct |
| 83 | Supplier approval & certificate tracker | Correct |
| 84 | Complaints, non-conformances & CAPA | Correct |
| 85 | Cleaning & hygiene schedules with proof | Correct |
| 86 | Production planning & daily line report | Correct |
| 87 | Farm operations schedule & field tasks | Correct |
| 88 | Spray & input records | Correct |
| 89 | Harvest, yield & sales tracker | Correct |
| 90 | Crop problem photo triage | Correct |
| 91 | Machinery maintenance & fuel log | Correct |
| 92 | Office admin autopilot | Correct |
| 93 | Meeting notes to tasks | Correct |
| 94 | Leave & holiday requests | Correct |
| 95 | Purchase requests & approvals | Correct |
| 96 | Email inbox autopilot | Correct |
| 97 | Checklist control & defect close-out | Correct |
| 98 | Site & machine planned maintenance | Correct |
| 99 | Custom trackers — any process, one place | Correct |
| 100 | Staff training on autopilot | Correct |
| 101 | Goals & strategic planning system | Correct |
| 102 | AI-powered strategy & goal planning (owners & leadership teams) | Correct |
| 103 | Practical AI at work — team license (up to 25 staff) | Correct |
| 104 | Data & dashboards for managers | Correct |
| 105 | Certified Automation Practitioner | Correct |
| 106 | Founder's Automation Mastermind — 12 weeks | Correct |
| 107 | Employee performance reviews (EPRs) on autopilot | Correct |
| 108 | 24/7 AI sales agent — WhatsApp & website | Correct |
| 109 | Full CRM — from first inquiry to paid invoice | Correct |
| 110 | Recruiting autopilot — resumes to booked interviews | Fixed: Indeed API partner-only |
| 111 | AI executive assistant — calendar, agendas, notes & research | Correct |
| 112 | Payroll prep — hours to payroll, checked | Fixed: Gusto/ADP partner-gated |
| 113 | Vehicle & machinery daily checks | Correct |
| 115 | Purchase to pay — PO, goods receipt, invoice match | Correct |
| 116 | Farm audit-ready records (GLOBALG.A.P., PrimusGFS, USDA GAP, Red Tractor) | Correct |
| 117 | Property deal finder & deal packs | Correct |
| 118 | Property listing autopilot | Correct |
| 119 | Renovation project management | Correct |
| 120 | Starter — try one automation for $99 | Correct |
| 121 | Contract, e-signature & deposit | Correct |
| 122 | Client welcome & onboarding | Correct |
| 123 | Payments received — matched, receipted, thanked | Correct |
| 124 | Customer statements & aged-debt report | Correct |
| 125 | Recurring & stage-payment billing | Correct |
| 126 | New-customer credit check & limits | Fixed: Credit data needs a subscription |
| 127 | 13-week cash-flow forecast | Correct |
| 128 | Tax prep pack for your accountant | Correct |
| 129 | Supplier price tracker & best-deal finder | Correct |
| 130 | Equipment utilization & idle-asset alerts | Correct |
| 131 | Returns & exchanges portal | Correct |
| 132 | Clinical notes assistant | Correct |
| 133 | Detention & extra-charge capture | Correct |
| 134 | Company health checks & monthly internal audit | Correct |
| 135 | Systemise any document — form, checklist or SOP | Correct |
| 136 | Stock control, KPIs & cost per product | Correct |
| 137 | Financial reporting & management dashboards | Correct |
| 138 | Refinance pack — from finished works to new mortgage | Correct |
| 139 | Commercial & industrial build project control | Correct |
| 140 | Personal admin autopilot — bills, renewals, family & travel | Correct |
| 141 | Money at a glance — spending, bills & net-worth dashboard | Fixed: TikTok needs app audit |
| 142 | Short videos made for you | Fixed: TikTok needs app audit |
| 143 | Video auto-creator | Correct |
| 144 | Job photos to social posts | Correct |
| 145 | Social auto-posting — DIY kit | Correct |
