/**
 * What each trade photo shows, as the three steps the automation took — so the photo (the result)
 * comes with the workflow behind it. Each links to the product we actually sell for it.
 */
export type Story = { steps: [string, string, string]; product: number; works: string; ready?: false };

export const PHOTO_STORIES: Record<string, Story> = {
  hero: { steps: ["Dave calls while you're under a sink", "Your AI assistant answers and books him in", "The job is in your diary and Dave gets a text"], product: 11, works: "Jobber, ServiceM8, Tradify" },
  trades: { steps: ["Your quote goes quiet", "Your AI assistant follows up politely", "Dave accepts and pays the deposit"], product: 13, works: "Jobber, ServiceM8, Tradify" },
  clinics: { steps: ["Patients are due a check-up", "Your AI assistant texts each one a booking link", "Appointments appear in your practice diary"], product: 33, works: "Dentally, Cliniko, Jane" },
  restaurants: { steps: ["Dave asks for a table after hours", "Your AI assistant checks the floor plan and books it", "Confirmed booking, plus a reminder the day before"], product: 35, works: "OpenTable, ResDiary, SevenRooms" },
  "equipment-hire": { steps: ["Dave books a digger at 11:40pm", "Your AI assistant checks ID, takes the deposit and gets the agreement signed", "The booking is ready when you open the yard"], product: 5, works: "Point of Rental, MCS-rm, Xero" },
  farming: { steps: ["You finish spraying Field 7", "Your AI assistant logs product, field, time and weather", "The record is audit-ready for Red Tractor"], product: 88, works: "Gatekeeper, Farmable, Excel" },
  "food-production": { steps: ["Chillers are checked through the shift", "Your AI assistant logs every temperature", "Your HACCP log is complete for the auditor"], product: 81, works: "FoodDocs, Safefood 360, Excel" },
  logistics: { steps: ["Dave signs for his delivery", "Your AI assistant files the photo and signature", "Proof of delivery goes to the customer straight away"], product: 29, works: "Mandata, Samsara, Xero" },
  manufacturing: { steps: ["Dave Engineering emails a PDF purchase order", "Your AI assistant reads it", "The order is entered with quantities and due date"], product: 36, works: "Katana, Unleashed, Sage" },
  "office-teams": { steps: ["Your team meeting ends", "Your AI assistant turns the notes into tasks", "Each person has their task and due date"], product: 93, works: "Asana, Microsoft Teams, Google Workspace" },
  professional: { steps: ["Your bank feed comes in overnight", "Your AI assistant matches every transaction", "214 reconciled before you've had a coffee"], product: 23, works: "Xero, QuickBooks, Sage" },
  property: { steps: ["Tenant Dave reports a leak with a photo", "Your AI assistant books the plumber", "Dave is kept updated without you chasing"], product: 34, works: "Reapit, Alto, Arthur Online" },
  retail: { steps: ["Dave leaves £86 in his basket", "Your AI assistant sends a friendly reminder", "He comes back and the order is paid"], product: 20, works: "Shopify, WooCommerce, Klaviyo" },
  "busy-professionals": { steps: ["200 emails land while you travel", "Your AI assistant sorts them and drafts replies", "Only the 3 that need you are waiting"], product: 96, works: "Outlook, Gmail" },
};
