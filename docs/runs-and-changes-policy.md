# Runs, changes and how a product is explained (6 Nov 2026)

## Decisions (owner, 6 Nov 2026)
- Small changes free for 14 days after go-live. Bug fixes free for 90 days.
- After 90 days, fixes need a support plan (Run Lite). Changes after 14 days use fixed bands: Small $150, Medium $450, Large quoted.
- Runs: copy how reputable, fast-growing companies charge (research below).

## How others charge for usage
| Company | Model | Grade |
|---|---|---|
| n8n | Plan by executions per month. One run counts however many steps it has. Starter €20 for 2.5k, Pro €50 for 10k, Business €667 for 40k (annual). Overage capped (n8n.io/pricing, read 6 Nov 2026; docs.n8n.io "Understand executions") | fact · Primary |
| Zapier | Tasks per action step. Overage 1.25x (annual) or 2.5x (monthly), capped at 3x the plan, then paused (zapier.com/blog/what-is-a-task-in-zapier) | fact · Primary |
| Make | Credits per module. Upgrade, buy extra, or auto-purchase (help.make.com/credits) | fact · Primary |
| Pilot (done-for-you bookkeeping) | Priced by volume. Billed the difference if exceeded; reviewed on a 3-month average (pilot.com/faq) | fact · Primary |
| CallRail Voice Assist | $95 base includes 50 calls, then $1 a call (callrail.com blog) | fact · Primary |
| Relevance AI | $29 plan includes 2.5k actions, then $80 per 1,000 (Activepieces, Oct 2026) | Lead |
| Agencies (BULDRR, Taskip) | Platform costs billed direct, not marked up, or capped in the contract. 2 weeks of support for a single workflow, 30 days for a system | likely · Moderate |

**Pattern:** nobody sells unlimited usage. A fixed fee includes a stated allowance, there is a clear band above it, and overage is capped or alerted. *(fact · Strong)*

**n8n licence:** agencies may build and run client workflows on their own instance if clients don't access it. They may not sell n8n hosting as a service (docs.n8n.io licence FAQ). *(fact · Primary)*

## What the site now does
- Customer's own n8n account, so runs are paid at cost to n8n and cost us nothing. A calculator shows runs a month, the n8n plan that fits, and a warning on 1-minute timers (43,200 runs).
- Every product page shows four things:
  - A 4-box picture: starts → does → you stay in charge (amber) → result (blue).
  - "You choose at setup".
  - "What happens if…".
  - "What you're buying" (included, not included, you'll need), the runs calculator, and the after-go-live timeline and change bands.
- Why this format:
  - Flowcharts beat prose for accuracy and speed (Human Factors 17(2), 1975).
  - BPMN notation gives non-experts no benefit (SBES 2015).
  - Words plus a picture beat words alone (Mayer, multimedia principle).

## ASSUMED — confirm
- Run Lite includes one small change a month.
- Support prices for the 28 builds that had none: under $1,000 → $50–100/mo; under $3,000 → $100–200/mo; otherwise $150–300/mo.
- We alert at 80% of the n8n plan.
- New product 146 "Payments to invoices — with your sign-off" at $3,900, 20 days, support $150–300/mo.
- No hosted-by-us option yet. It is allowed under the n8n licence, but would need run bands priced.

## Deliberately not used
Agency "guide" blogs that sell courses (AFFStudio, betonai), and voice-AI comparisons written by competing vendors, used for price levels only.

## Panel review (6 Nov 2026): psychologist/UX, 5 CEOs, automation engineer
Research (11 sources):
- NN/g, dwell time: the first 10 s decide whether people stay. *(Primary)*
- NN/g, F-pattern: people scan, so the outcome goes first. *(Primary)*
- Lindgaard 2006: a visual judgement forms in about 50 ms. *(Moderate)*
- Mayer: words plus pictures beat words alone in 9 of 9 studies. *(Primary)*
- Larkin & Simon 1987: diagrams cut search effort. *(Primary)*
- van Gog, Paas & Sweller 2010: worked examples help novices. *(Primary)*
- Scheibehenne 2010: choice overload is about zero on average, so recommend one default. *(Primary)*
- Kahneman & Tversky: loss aversion. *(Primary)*
- Suwelack 2011: guarantees raise purchase intent. *(Lead)*
- Gartner and SMB Group: buyers self-serve and want a trial or proof. *(Strong)*
- GOV.UK and NN/g: plain language. *(Moderate)*
- Baymard: images get looked at first. *(Primary)*

Changes made:
- An "In short" line under the title.
- A "This is an example — we build it around how you work" switcher: we don't do it yet / VA or bookkeeper / by hand / partly automated / on our website / our software could do it.
- An all-in cost line in the buy box.
- A "Book a free call" button. The assistant now reassures when someone says it's complicated or that they do it differently, confirms the software they named, checks their tools, and takes a call request.
- Costs and changes folded into one section.

Not done yet:
- A worked example for each product (only 146 has a mock-up).
- Real reviews (none exist yet, so none shown).
- Local currency on non-UK/AU/CA pages.
