/**
 * Launch switches. Flip to true when each piece is really live.
 * PAYMENTS_LIVE: Stripe Checkout connected. FORMS_LIVE: lead forms post to a real inbox (e.g. n8n webhook).
 */
export const PAYMENTS_LIVE = false;
export const FORMS_LIVE = false;

/** Shown after a lead form is submitted while forms are not connected yet. */
export const FORM_NOT_SENT = "Thanks — our inbox opens at launch, so this wasn't sent yet. Please check back soon.";

/** Where lead forms post when FORMS_LIVE is true (e.g. an n8n webhook URL). Empty until set. */
export const LEAD_ENDPOINT = "";
/** Your Google Business Profile "write a review" link. Empty until the profile exists. */
export const GOOGLE_REVIEW_URL = "";
/**
 * Client referral scheme. Off until you confirm the reward and terms —
 * the /refer/ page stays hidden from search and navigation while false.
 */
export const REFERRALS_LIVE = false;
export const REFERRAL_CREDIT_USD = 100; // ASSUMED — confirm before switching REFERRALS_LIVE on
