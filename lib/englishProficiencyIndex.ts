/**
 * English proficiency by country from the EF English Proficiency Index (EF EPI).
 * EF Education First publishes annual rankings from millions of test-takers.
 * Bands: Very high (600+), High (550–599), Moderate (500–549), Low (450–499), Very low (<450).
 * Source: EF EPI 2025 report (data from 2024 tests). Wikipedia / EF.
 * @see https://en.wikipedia.org/wiki/EF_English_Proficiency_Index
 * @see https://www.ef.com/epi/
 */

export type EnglishProficiencyBand =
  | "Very high"
  | "High"
  | "Moderate"
  | "Low"
  | "Very low";

/** EF EPI score (approx 350–650). Not in list = use default. */
const EF_EPI_SCORE: Record<string, number> = {
  philippines: 569,
  thailand: 402,
  indonesia: 471,
  malaysia: 581,
  vietnam: 500,
  cambodia: 390,
  kenya: 593,
  nigeria: 569,
  uganda: 518,
  rwanda: 417,
  tanzania: 479,
  ethiopia: 499,
  bolivia: 521,
  colombia: 480,
  mexico: 440,
  peru: 519,
  venezuela: 520,
  "dominican-republic": 503,
  "costa-rica": 516,
  india: 484,
  pakistan: 493,
  morocco: 492,
  brazil: 482,
  argentina: 575,
  chile: 517,
  china: 464,
  mongolia: 447,
  "south-africa": 602,
  russia: 521,
  ukraine: 526,
  poland: 600,
  romania: 605,
  turkey: 488,
  kazakhstan: 417,
  algeria: 468,
  libya: 395,
  usa: 620,       // English primary; treat as very high
  canada: 620,    // English/French; treat as very high
  australia: 620,
  uk: 620,
  france: 539,
  germany: 615,
  spain: 540,
  italy: 513,
  sweden: 609,
  japan: 446,
  "south-korea": 522,
  "saudi-arabia": 404,
  egypt: 459,
  iran: 492,
  // European (EF EPI 2024)
  portugal: 558,
  netherlands: 647,
  belgium: 584,
  austria: 577,
  switzerland: 616,
  norway: 632,
  denmark: 632,
  finland: 625,
  ireland: 618,
  greece: 549,
  "czech-republic": 597,
  hungary: 578,
  croatia: 588,
  serbia: 552,
  bulgaria: 562,
  slovakia: 584,
  lithuania: 592,
  latvia: 578,
  estonia: 598,
  slovenia: 592,
  luxembourg: 616,
  malta: 562,
  cyprus: 578,
  iceland: 593,
  montenegro: 532,
  "north-macedonia": 512,
  albania: 498,
  "bosnia-and-herzegovina": 488,
  moldova: 522,
};

/** Convert EF EPI score to band (EF EPI 2025 thresholds). */
export function getEnglishBandFromScore(score: number): EnglishProficiencyBand {
  if (score >= 600) return "Very high";
  if (score >= 550) return "High";
  if (score >= 500) return "Moderate";
  if (score >= 450) return "Low";
  return "Very low";
}

/** Get EF EPI score for a country slug. Unknown = 500 (Moderate). */
export function getEnglishScoreBySlug(slug: string): number {
  return EF_EPI_SCORE[slug] ?? 500;
}

/** Get display band for a country slug (EF EPI 2025). */
export function getEnglishProficiencyBySlug(slug: string): EnglishProficiencyBand {
  return getEnglishBandFromScore(getEnglishScoreBySlug(slug));
}

/** 0–100 score for UI (e.g. bars). Very high=100, Very low=0. */
export function getEnglishScore0To100(slug: string): number {
  const raw = getEnglishScoreBySlug(slug);
  // EF roughly 350–650; map to 0–100
  const clamped = Math.max(350, Math.min(650, raw));
  return Math.round(((clamped - 350) / 300) * 100);
}

export { EF_EPI_SCORE };
