/**
 * Launch switches. Flip to true when each piece is really live.
 * PAYMENTS_LIVE: Stripe Checkout connected. FORMS_LIVE: lead forms post to a real inbox (e.g. n8n webhook).
 */
export const PAYMENTS_LIVE = false;
export const FORMS_LIVE = false;

/** Shown after a lead form is submitted while forms are not connected yet. */
export const FORM_NOT_SENT = "Thanks — our inbox opens at launch, so this wasn't sent yet. Please check back soon.";
