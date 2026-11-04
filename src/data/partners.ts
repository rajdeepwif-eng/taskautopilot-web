/**
 * Approved referral partners: code → firm name as it should be shown to clients.
 * Add a partner here after they sign the partner terms. Unknown codes are still recorded, just not displayed by name.
 */
export const PARTNERS: Record<string, string> = {
  // SMITHCO: "Smith & Co Bookkeeping",
};
export const partnerName = (code: string) => (code ? PARTNERS[code.toUpperCase()] ?? "" : "");
