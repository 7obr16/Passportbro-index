/**
 * Marriage trends: share of married persons in "out-group" (mixed) marriages —
 * i.e. one partner native-born, one foreign-born (often used as a proxy for
 * openness to international/foreign partners).
 *
 * Source: Eurostat, "Merging populations: A look at marriages with foreign-born
 * persons in European countries" (Statistics in focus 29/2012), 2008–2010.
 * https://ec.europa.eu/eurostat/documents/3433488/5584928/KS-SF-12-029-EN.PDF
 *
 * For non-European countries, comparable harmonized data is scarce; we show
 * "Limited data" and link to UN World Marriage Data.
 */

/** Percentage of married persons in mixed (native–foreign-born) marriages. null = no Eurostat data. */
export const OUT_GROUP_MARRIAGE_PCT: Record<string, number | null> = {
  // Eurostat 2008–10 (European countries)
  uk: 12,
  france: 12,
  germany: 11,
  spain: 7,
  italy: 7,
  sweden: 10,
  poland: 3,
  romania: 1,
  russia: null,
  ukraine: null,
  turkey: null,
  portugal: 6,
  "czech-republic": 6,
  austria: 10,
  belgium: 9,
  netherlands: 9,
  ireland: 12,
  estonia: 14,
  latvia: 20,
  lithuania: 6,
  luxembourg: 15,
  switzerland: 20,
  cyprus: 12,
  greece: 5,
  hungary: 4,
  slovakia: 3,
  bulgaria: 2,
  croatia: 5,
  slovenia: 8,
  malta: 9,
  denmark: 8,
  finland: 6,
  norway: 10,
  iceland: 11,
  // Non-European: no Eurostat metric; null
  philippines: null,
  thailand: null,
  indonesia: null,
  malaysia: null,
  vietnam: null,
  cambodia: null,
  kenya: null,
  nigeria: null,
  uganda: null,
  rwanda: null,
  tanzania: null,
  ethiopia: null,
  bolivia: null,
  colombia: null,
  mexico: null,
  peru: null,
  venezuela: null,
  "dominican-republic": null,
  "costa-rica": null,
  india: null,
  pakistan: null,
  morocco: null,
  brazil: null,
  argentina: null,
  chile: null,
  china: null,
  mongolia: null,
  "south-africa": null,
  kazakhstan: null,
  algeria: null,
  libya: null,
  usa: null,
  canada: null,
  australia: null,
  japan: null,
  "south-korea": null,
  "saudi-arabia": null,
  egypt: null,
  iran: null,
  serbia: null,
  montenegro: null,
  "north-macedonia": null,
  albania: null,
  "bosnia-and-herzegovina": null,
  moldova: null,
};

/** Eurostat report PDF (European data). */
export const MARRIAGE_SOURCE_EUROSTAT =
  "https://ec.europa.eu/eurostat/documents/3433488/5584928/KS-SF-12-029-EN.PDF/4c0917f8-9cfa-485b-a638-960c00d66da4";

/** UN World Marriage Data (global context). */
export const MARRIAGE_SOURCE_UN = "https://population.un.org/MarriageData/Index.html";

export function getOutGroupMarriagePct(slug: string): number | null {
  return OUT_GROUP_MARRIAGE_PCT[slug] ?? null;
}

export function hasEurostatMarriageData(slug: string): boolean {
  const pct = OUT_GROUP_MARRIAGE_PCT[slug];
  return pct !== undefined && pct !== null;
}
