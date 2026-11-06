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

/**
 * Capacity: the date the next build can start, e.g. "2026-11-18". Shown on checkout and offer pages
 * so demand never outruns delivery. Empty = not shown.
 */
export const NEXT_BUILD_START = "";

/**
 * Tracking IDs. All empty = no tracking scripts and no cookie banner.
 * Set them when the accounts exist; a consent banner then appears and nothing loads until a visitor accepts.
 */
export const GA4_ID = ""; // e.g. "G-XXXXXXX"
export const GOOGLE_ADS_ID = ""; // e.g. "AW-123456789"
export const GOOGLE_ADS_CONVERSION_LABEL = ""; // the reservation/purchase conversion label
export const META_PIXEL_ID = ""; // e.g. "1234567890"

/**
 * Your meeting-booking link (e.g. Google Calendar appointment page or Calendly). Empty until set:
 * the assistant and product pages then take a call request with preferred times instead.
 */
export const BOOKING_URL = "";

/**
 * Live AI interviewer: the n8n webhook URL of the "TaskAutoMode · Website interview assistant" workflow.
 * Empty = the guided (no-AI) assistant is used. Set it only after the workflow is tested and switched on.
 */
export const ASSISTANT_ENDPOINT = "";

/** Home-page hero video (MP4/WebM URL, e.g. the Higgsfield film). Empty = the photo is shown. */
export const HERO_VIDEO_URL = "";
