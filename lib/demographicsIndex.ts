/**
 * Demographics: median age and ethnic homogeneity by country.
 * Sources:
 * - Median age: CIA World Factbook 2024 estimates (Wikipedia "List of countries by median age").
 * - Ethnic homogeneity: Fearon's ethnic fractionalization index (0 = homogeneous, 1 = very diverse).
 *   We store fractionalization and derive homogeneity as (1 - frac). Wikipedia "List of countries by ethnic and cultural diversity level".
 * @see https://en.wikipedia.org/wiki/List_of_countries_by_median_age
 * @see https://en.wikipedia.org/wiki/List_of_countries_by_ethnic_and_cultural_diversity_level
 */

/** Median age in years (CIA 2024 est.). */
export const MEDIAN_AGE: Record<string, number> = {
  philippines: 25.7,
  thailand: 41.5,
  indonesia: 31.5,
  malaysia: 31.8,
  vietnam: 33.1,
  cambodia: 27.9,
  kenya: 21.2,
  nigeria: 19.3,
  uganda: 16.2,
  rwanda: 20.8,
  tanzania: 19.1,
  ethiopia: 20.4,
  bolivia: 26.6,
  colombia: 32.7,
  mexico: 30.8,
  peru: 30.2,
  venezuela: 31.0,
  "dominican-republic": 29.2,
  "costa-rica": 35.5,
  india: 29.8,
  pakistan: 22.9,
  morocco: 30.6,
  brazil: 35.1,
  argentina: 33.3,
  chile: 36.9,
  china: 40.2,
  mongolia: 31.5,
  "south-africa": 30.4,
  russia: 41.9,
  ukraine: 44.9,
  poland: 42.9,
  romania: 45.5,
  turkey: 34.0,
  kazakhstan: 31.9,
  algeria: 29.1,
  libya: 26.2,
  usa: 38.9,
  canada: 42.6,
  australia: 38.1,
  uk: 40.8,
  france: 42.6,
  germany: 46.8,
  spain: 46.8,
  italy: 48.4,
  sweden: 41.1,
  japan: 49.9,
  "south-korea": 45.5,
  "saudi-arabia": 32.4,
  egypt: 24.4,
  iran: 33.8,
  // European (CIA 2024)
  portugal: 46.4,
  netherlands: 43.3,
  belgium: 42.0,
  austria: 44.9,
  switzerland: 43.0,
  norway: 40.5,
  denmark: 42.2,
  finland: 43.3,
  ireland: 39.2,
  greece: 46.5,
  "czech-republic": 43.8,
  hungary: 44.5,
  croatia: 44.6,
  serbia: 43.3,
  bulgaria: 45.1,
  slovakia: 42.2,
  lithuania: 45.1,
  latvia: 44.9,
  estonia: 43.7,
  slovenia: 45.5,
  luxembourg: 40.2,
  malta: 43.2,
  cyprus: 39.2,
  iceland: 37.8,
  montenegro: 39.8,
  "north-macedonia": 40.0,
  albania: 38.2,
  "bosnia-and-herzegovina": 43.9,
  moldova: 38.5,
};

/** Ethnic fractionalization 0–1 (Fearon). Higher = more diverse. Homogeneity = 1 - this. */
export const ETHNIC_FRACTIONALIZATION: Record<string, number> = {
  philippines: 0.2385,
  thailand: 0.6338,
  indonesia: 0.7351,
  malaysia: 0.588,
  vietnam: 0.2383,
  cambodia: 0.2105,
  kenya: 0.8588,
  nigeria: 0.8505,
  uganda: 0.9302,
  rwanda: 0.3238,
  tanzania: 0.7353,
  ethiopia: 0.7235,
  bolivia: 0.7396,
  colombia: 0.6014,
  mexico: 0.5418,
  peru: 0.6566,
  venezuela: 0.4966,
  "dominican-republic": 0.4294,
  "costa-rica": 0.2368,
  india: 0.4182,
  pakistan: 0.7098,
  morocco: 0.4841,
  brazil: 0.5408,
  argentina: 0.255,
  chile: 0.1861,
  china: 0.1538,
  mongolia: 0.3682,
  "south-africa": 0.7517,
  russia: 0.2452,
  ukraine: 0.4737,
  poland: 0.1183,
  romania: 0.3069,
  turkey: 0.32,
  kazakhstan: 0.6171,
  algeria: 0.3394,
  libya: 0.792,
  usa: 0.4901,
  canada: 0.7124,
  australia: 0.0929,
  uk: 0.1211,
  france: 0.1727,
  germany: 0.1682,
  spain: 0.4165,
  italy: 0.1145,
  sweden: 0.06,
  japan: 0.0119,
  "south-korea": 0.002,
  "saudi-arabia": 0.18,
  egypt: 0.1836,
  iran: 0.6684,
  // European (Fearon / Wikipedia ethnic diversity)
  portugal: 0.069,
  netherlands: 0.207,
  belgium: 0.556,
  austria: 0.204,
  switzerland: 0.474,
  norway: 0.136,
  denmark: 0.127,
  finland: 0.133,
  ireland: 0.156,
  greece: 0.106,
  "czech-republic": 0.323,
  hungary: 0.154,
  croatia: 0.333,
  serbia: 0.417,
  bulgaria: 0.381,
  slovakia: 0.254,
  lithuania: 0.322,
  latvia: 0.540,
  estonia: 0.513,
  slovenia: 0.203,
  luxembourg: 0.556,
  malta: 0.198,
  cyprus: 0.423,
  iceland: 0.033,
  montenegro: 0.258,
  "north-macedonia": 0.426,
  albania: 0.223,
  "bosnia-and-herzegovina": 0.712,
  moldova: 0.555,
};

const WORLD_MEDIAN_AGE = 31;

/** Get median age for a country slug. Default 31 (world). */
export function getMedianAgeBySlug(slug: string): number {
  return MEDIAN_AGE[slug] ?? WORLD_MEDIAN_AGE;
}

/** Get ethnic homogeneity 0–100 (100 = fully homogeneous). Fearon fractionalization → (1 - frac) * 100. */
export function getEthnicHomogeneityBySlug(slug: string): number {
  const frac = ETHNIC_FRACTIONALIZATION[slug] ?? 0.5;
  return Math.round((1 - frac) * 100);
}

/** Label for homogeneity band. */
export function getHomogeneityLabel(homogeneity: number): string {
  if (homogeneity >= 85) return "Very high";
  if (homogeneity >= 65) return "High";
  if (homogeneity >= 45) return "Moderate";
  if (homogeneity >= 25) return "Low";
  return "Very low";
}

export { WORLD_MEDIAN_AGE };
