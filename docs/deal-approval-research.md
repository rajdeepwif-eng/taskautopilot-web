# TaskAutoMode: how each way-to-pay deal is approved and closed (research 5 Nov 2026)

Not legal or tax advice. Thresholds marked "house rule" are ours, not sourced. Built into the site as src/lib/dealRules.ts, /apply/ and /deal-review/.

| Way to pay | Collect | Key checks | Approval rule | Documents | Main sources |
|---|---|---|---|---|---|
| Pay monthly (in-house) | Company no., trading length, director, business-purpose declaration, credit-check consent | Companies House, disqualified directors, CCJs (TrustOnline), business credit score, account in company name | Pass 51+ score, refer 26–50 or <12 months' trading, decline ≤25 / CCJ (house rule on Experian bands); sole traders & partnerships → finance partner (UK CCA) | Instalment agreement, DD/ACH mandate, CA/NY disclosure if applicable | legislation.gov.uk (CCA notes), ASIC, CFPB Reg B, CA DFPI, NY DFS, Experian Delphi, gov.uk late-payment interest |
| Finance it (partner) | Company, contact, order value, consent to share | Registry only; partner runs KYC/credit and takes the risk | Partner decides; never override a decline in-house | Merchant agreement, partner terms, no-recourse confirmation | iwocaPay, Credit Key FAQs, Tabit/Merchant Growth, Shift |
| Pay from results | Gain type, baseline months, system of record, data access | M&V plan (IPMVP 14 elements), risk/responsibility matrix | Pass 12+ months' baseline + read access; refer 6–12 months; decline none / no access (house rule) | Gainshare agreement + baseline schedule, M&V plan, monthly signed reports, independent-expert disputes | DOE FEMP M&V, FEMP RRP matrix, EVO IPMVP, GAO-15-432 |
| Part cash, part shares | Cap table, articles/SHA, valuation basis, director authority | Filings vs cap table, pre-emption, valuation (409A US) | Refer if no cap table or own-estimate valuation | Term sheet, subscription (shares for services), SHA, resolutions, SH01 (UK) / Form D (US), 83(b) | gov.uk SH01, Companies Act s.555, SEC 506(b), IRS Form 15620, HMRC BIM40051, Carta, Ashurst Perkins Coie |
| Automation for equity | Team, cap table incl. SAFEs, IP assignments, runway | PSC register, sanctions (UK single list), IP chain | Decline if IP not owned; refer if runway <6 months or cap table unclear | NDA → term sheet → DD → service agreement with milestones → subscription → deed of adherence → filings | YC deal, Techstars terms, Carta advisor data, BVCA via Davis Polk, BDO on 83(b), NSIA (Paul Weiss) |
| Selling or retiring | 3 years' accounts, add-backs, top-customer share, debts/charges, change-of-control | Accounts vs tax returns, charges register, litigation, KYC/AML | Refer if <3 years' accounts, a customer >20% (house rule), or arrears | NDA → IM → heads of terms → DD → SPA/APA + disclosure → completion; earn-out/loan note with security; management agreement + option | BizBuySell 2025 (2.61× SDE median), ICAEW earn-out guideline 2023, gov.uk BADR & EOT, IRS Pub 537, SBA SOP 50 10 8 summary |

Gaps to close with a lawyer/accountant: CA/NY scope for in-house plans, Canada business-credit rules, Shift AU risk terms, UK corporation-tax on shares received for services, security for deferred consideration, management-agreement structure.


## Council audit, 5 Nov 2026: corrections applied

| Way to pay | Grade after audit | Fixed |
|---|---|---|
| Monthly | Strong / primary (CCA, Experian Delphi, TrustOnline) | CCA scope narrowed to sole traders and partnerships of 2–3 partners; art 60F exemption added; art 60C needs the FCA prescribed declaration, not a tick box; US disclosure laws now 10 states (CA, CT, FL, GA, KS, MO, NY, TX, UT, VA); Delphi 0–1 means decline |
| Finance | Lead (partner terms only) | Credit-broking flag (RAO art 36A) for sole traders and small partnerships; partner named in the consent wording |
| Results | Strong (IPMVP, DOE FEMP, GAO); baseline months are a house rule | IPMVP is "used by analogy" |
| Hybrid / Equity | Strong / primary (s.555, IRS 15620) | SH01 cited to Companies Act s.555; NSI Act check added |
| Succession | Mixed: BizBuySell is one source (a lead) | 2.61× relabelled as the *average* cash-flow multiple; BADR 18% from 6 Apr 2026 (£1m lifetime); EOT 50% relief, which can't be combined with BADR |

Checks added: Companies House ID verification (since 18 Nov 2025); individual sanctions and PEP screening; VAT check; Gazette and Individual Insolvency Register; Confirmation of Payee; affordability; US own KYC (BOI no longer covers US companies); ASIC banned and disqualified list plus Director ID; provincial registries in Canada.

Links replaced: disqualified-officers search, the sanctions search service, ASIC's free company search, legislation.gov.uk s.555.

Still a lead or house rule: the finance partner's no-recourse term (confirm per contract), revenue thresholds, top customer over 20%, and 30-day approval validity.
