/**
 * Which photo each product page shows: products that do the same job share one photo, so every
 * image shows that product's actual result. Slugs are photos in src/assets (hero.jpg or trades/*.jpg).
 * A product whose photo isn't live yet shows none (never a picture of a different job).
 */
const JOBS: Record<string, number[]> = {
  hero: [7, 8, 10, 11, 40, 55, 56, 64, 66, 108, 120],
  trades: [13, 14, 109, 121, 122],
  clinics: [33],
  restaurants: [35],
  "equipment-hire": [4, 5, 6, 130],
  farming: [87, 88, 89, 116],
  "food-production": [81, 82, 83, 84, 85, 86],
  logistics: [26, 29, 133],
  manufacturing: [21, 36, 58, 68, 69, 115],
  "office-teams": [50, 53, 61, 62, 63, 93, 101, 107, 111],
  professional: [23, 24, 42, 59, 123, 31],
  property: [34, 119],
  retail: [16, 20, 28, 131, 136],
  "busy-professionals": [92, 96, 140, 49],
  "job-reviews": [1, 2, 15, 43, 57, 65],
  "job-invoices": [22, 41, 124, 125],
  "job-dashboard": [25, 127, 128, 137, 141],
  "job-social": [17, 142, 143, 144, 145],
  "job-inspections": [37, 47, 48, 60, 91, 97, 98, 113, 135, 139],
  "job-insurance": [45, 46, 38],
  "job-recruiting": [110],
  "job-courses": [70, 71, 72, 73, 74, 75, 76, 77, 78, 102, 103, 104, 105, 106, 100],
  "job-alerts": [39, 80, 44, 52, 134],
  "job-staff": [30, 79, 94, 112],
};
/** Products still waiting for a photo of their own job (they show the category art meanwhile). */
export const PHOTO_PENDING = [3, 9, 12, 18, 19, 27, 32, 51, 54, 67, 90, 95, 99, 117, 118, 126, 129, 132, 138];
export const PRODUCT_PHOTO: Record<number, string> = Object.fromEntries(Object.entries(JOBS).flatMap(([slug, ids]) => ids.map((id) => [id, slug])));
