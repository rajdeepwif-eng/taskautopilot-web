/** Integration pages: one per app our buyers already use. Product lists come from the catalogue. */
export type Integration = { slug: string; name: string; who: string; intro: string; products: number[] | "auto"; match?: string; note: string };

export const INTEGRATIONS: Integration[] = [
  { slug: "xero", name: "Xero", who: "small businesses and their accountants", intro: "Automations that read, write and reconcile in your own Xero organisation — invoices out, reminders sent, bills booked and bank lines matched.", products: "auto", match: "xero", note: "Connected with Xero's own sign-in (OAuth). We never see your password, and you can disconnect at any time from Xero." },
  { slug: "quickbooks", name: "QuickBooks", who: "small businesses and their bookkeepers", intro: "Automations on top of QuickBooks Online — invoices raised from jobs, reminders until paid, receipts and bills read and booked.", products: "auto", match: "quickbooks", note: "Connected with Intuit's own sign-in (OAuth). We never see your password, and you can disconnect at any time." },
  { slug: "jobber", name: "Jobber", who: "home-service businesses", intro: "Add the pieces Jobber users ask for most: missed calls texted back, quotes followed up until the customer decides, and reviews requested after every paid job.", products: [11, 13, 15, 22, 26], note: "Connected through Jobber's API with your approval. Exactly what is read and written is confirmed on your setup form." },
  { slug: "servicem8", name: "ServiceM8", who: "tradies and field-service teams", intro: "Automations around ServiceM8: every missed call answered by text, quotes chased politely, invoices reminded and reviews requested when a job is paid.", products: [11, 13, 15, 22], note: "Connected through ServiceM8's API with your approval. Exactly what is read and written is confirmed on your setup form." },
];

export const integrationBySlug = (s: string) => INTEGRATIONS.find((i) => i.slug === s)!;
