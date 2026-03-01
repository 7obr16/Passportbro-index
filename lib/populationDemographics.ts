/**
 * Population demographics by age and sex. US used as standard reference for comparison.
 * Sources: UN World Population Prospects (WPP), CIA World Factbook age structure / sex ratio.
 * @see https://population.un.org/wpp/
 * @see https://www.cia.gov/the-world-factbook/field/age-structure/
 * @see https://www.cia.gov/the-world-factbook/field/sex-ratio/
 */

export const AGE_BAND_LABELS = ["0-14", "15-24", "25-54", "55-64", "65+"] as const;
export type AgeBandKey = (typeof AGE_BAND_LABELS)[number];

export type AgeDistribution = Record<AgeBandKey, number>;
export type SexSplit = { malePct: number; femalePct: number };

/** US reference (UN WPP / CIA style). All percentages of total population. */
export const US_POPULATION_REFERENCE: { age: AgeDistribution; sex: SexSplit } = {
  age: { "0-14": 18.2, "15-24": 12.8, "25-54": 38.9, "55-64": 12.2, "65+": 17.9 },
  sex: { malePct: 49.2, femalePct: 50.8 },
};

/** Age distribution (% of total population) by country slug. UN/CIA style. */
export const POPULATION_AGE_BY_SLUG: Record<string, AgeDistribution> = {
  usa: { "0-14": 18.2, "15-24": 12.8, "25-54": 38.9, "55-64": 12.2, "65+": 17.9 },
  philippines: { "0-14": 32.0, "15-24": 18.5, "25-54": 37.2, "55-64": 6.8, "65+": 5.5 },
  thailand: { "0-14": 16.2, "15-24": 13.2, "25-54": 43.2, "55-64": 13.0, "65+": 14.4 },
  indonesia: { "0-14": 26.2, "15-24": 16.8, "25-54": 41.2, "55-64": 8.5, "65+": 7.3 },
  malaysia: { "0-14": 22.8, "15-24": 15.2, "25-54": 43.2, "55-64": 10.2, "65+": 8.6 },
  vietnam: { "0-14": 22.5, "15-24": 14.8, "25-54": 43.8, "55-64": 10.2, "65+": 8.7 },
  cambodia: { "0-14": 29.8, "15-24": 17.5, "25-54": 38.5, "55-64": 7.8, "65+": 6.4 },
  kenya: { "0-14": 38.5, "15-24": 19.2, "25-54": 33.8, "55-64": 4.5, "65+": 4.0 },
  nigeria: { "0-14": 41.0, "15-24": 19.5, "25-54": 30.8, "55-64": 4.2, "65+": 4.5 },
  uganda: { "0-14": 47.5, "15-24": 21.2, "25-54": 26.2, "55-64": 2.8, "65+": 2.3 },
  rwanda: { "0-14": 39.2, "15-24": 19.8, "25-54": 33.2, "55-64": 4.2, "65+": 3.6 },
  tanzania: { "0-14": 42.5, "15-24": 19.5, "25-54": 30.5, "55-64": 4.0, "65+": 3.5 },
  ethiopia: { "0-14": 39.2, "15-24": 20.2, "25-54": 32.0, "55-64": 4.2, "65+": 4.4 },
  bolivia: { "0-14": 30.2, "15-24": 18.2, "25-54": 37.2, "55-64": 7.5, "65+": 6.9 },
  colombia: { "0-14": 23.2, "15-24": 16.5, "25-54": 41.2, "55-64": 9.8, "65+": 9.3 },
  mexico: { "0-14": 26.2, "15-24": 17.2, "25-54": 40.2, "55-64": 8.5, "65+": 7.9 },
  peru: { "0-14": 26.5, "15-24": 17.2, "25-54": 39.5, "55-64": 8.5, "65+": 8.3 },
  venezuela: { "0-14": 26.8, "15-24": 16.8, "25-54": 39.2, "55-64": 8.2, "65+": 9.0 },
  "dominican-republic": { "0-14": 27.2, "15-24": 17.5, "25-54": 39.2, "55-64": 8.2, "65+": 7.9 },
  "costa-rica": { "0-14": 21.2, "15-24": 14.5, "25-54": 42.2, "55-64": 11.2, "65+": 10.9 },
  india: { "0-14": 26.0, "15-24": 17.8, "25-54": 41.2, "55-64": 8.2, "65+": 6.8 },
  pakistan: { "0-14": 35.5, "15-24": 19.8, "25-54": 35.2, "55-64": 5.2, "65+": 4.3 },
  morocco: { "0-14": 26.8, "15-24": 16.8, "25-54": 40.2, "55-64": 8.5, "65+": 7.7 },
  brazil: { "0-14": 21.2, "15-24": 15.5, "25-54": 43.5, "55-64": 10.5, "65+": 9.3 },
  argentina: { "0-14": 23.5, "15-24": 15.2, "25-54": 42.2, "55-64": 10.2, "65+": 8.9 },
  chile: { "0-14": 19.8, "15-24": 13.5, "25-54": 43.2, "55-64": 12.2, "65+": 11.3 },
  china: { "0-14": 17.2, "15-24": 11.8, "25-54": 47.5, "55-64": 12.5, "65+": 11.0 },
  mongolia: { "0-14": 31.2, "15-24": 15.8, "25-54": 40.2, "55-64": 7.2, "65+": 5.6 },
  "south-africa": { "0-14": 28.5, "15-24": 18.2, "25-54": 41.2, "55-64": 6.8, "65+": 5.3 },
  russia: { "0-14": 17.2, "15-24": 9.8, "25-54": 43.5, "55-64": 13.2, "65+": 16.3 },
  ukraine: { "0-14": 15.2, "15-24": 9.5, "25-54": 42.5, "55-64": 13.5, "65+": 19.3 },
  poland: { "0-14": 14.8, "15-24": 10.2, "25-54": 43.5, "55-64": 13.5, "65+": 18.0 },
  romania: { "0-14": 15.2, "15-24": 10.0, "25-54": 42.2, "55-64": 12.8, "65+": 19.8 },
  turkey: { "0-14": 23.5, "15-24": 15.2, "25-54": 43.2, "55-64": 9.5, "65+": 8.6 },
  kazakhstan: { "0-14": 26.8, "15-24": 13.5, "25-54": 42.2, "55-64": 9.5, "65+": 8.0 },
  algeria: { "0-14": 29.2, "15-24": 16.8, "25-54": 39.5, "55-64": 7.8, "65+": 6.7 },
  libya: { "0-14": 33.2, "15-24": 17.5, "25-54": 38.2, "55-64": 5.8, "65+": 5.3 },
  canada: { "0-14": 15.8, "15-24": 12.2, "25-54": 39.5, "55-64": 13.2, "65+": 19.3 },
  australia: { "0-14": 18.5, "15-24": 12.8, "25-54": 41.2, "55-64": 12.2, "65+": 15.3 },
  uk: { "0-14": 17.5, "15-24": 11.8, "25-54": 40.2, "55-64": 12.5, "65+": 18.0 },
  france: { "0-14": 18.0, "15-24": 11.5, "25-54": 38.5, "55-64": 12.8, "65+": 19.2 },
  germany: { "0-14": 13.8, "15-24": 9.8, "25-54": 38.2, "55-64": 14.2, "65+": 24.0 },
  spain: { "0-14": 14.2, "15-24": 9.8, "25-54": 42.2, "55-64": 13.2, "65+": 20.6 },
  italy: { "0-14": 12.8, "15-24": 9.2, "25-54": 40.5, "55-64": 13.5, "65+": 24.0 },
  sweden: { "0-14": 17.5, "15-24": 11.2, "25-54": 39.2, "55-64": 12.2, "65+": 19.9 },
  japan: { "0-14": 11.8, "15-24": 9.2, "25-54": 36.5, "55-64": 12.5, "65+": 30.0 },
  "south-korea": { "0-14": 12.2, "15-24": 10.5, "25-54": 41.2, "55-64": 15.2, "65+": 20.9 },
  "saudi-arabia": { "0-14": 25.2, "15-24": 16.5, "25-54": 45.2, "55-64": 7.5, "65+": 5.6 },
  egypt: { "0-14": 33.2, "15-24": 18.5, "25-54": 37.2, "55-64": 5.8, "65+": 5.3 },
  iran: { "0-14": 24.2, "15-24": 15.8, "25-54": 43.2, "55-64": 9.2, "65+": 7.6 },
  portugal: { "0-14": 13.2, "15-24": 10.2, "25-54": 40.5, "55-64": 13.5, "65+": 22.6 },
  netherlands: { "0-14": 16.2, "15-24": 11.8, "25-54": 38.5, "55-64": 13.2, "65+": 19.3 },
  belgium: { "0-14": 17.2, "15-24": 11.5, "25-54": 39.2, "55-64": 12.8, "65+": 19.3 },
  austria: { "0-14": 14.2, "15-24": 10.5, "25-54": 41.2, "55-64": 13.5, "65+": 20.6 },
  switzerland: { "0-14": 15.2, "15-24": 10.8, "25-54": 41.2, "55-64": 13.2, "65+": 19.6 },
  norway: { "0-14": 17.8, "15-24": 12.2, "25-54": 39.5, "55-64": 12.5, "65+": 18.0 },
  denmark: { "0-14": 16.5, "15-24": 12.0, "25-54": 38.8, "55-64": 12.8, "65+": 19.9 },
  finland: { "0-14": 16.2, "15-24": 11.2, "25-54": 37.5, "55-64": 13.2, "65+": 21.9 },
  ireland: { "0-14": 20.5, "15-24": 12.5, "25-54": 42.2, "55-64": 11.2, "65+": 13.6 },
  greece: { "0-14": 14.2, "15-24": 10.2, "25-54": 42.2, "55-64": 13.2, "65+": 20.2 },
  "czech-republic": { "0-14": 15.2, "15-24": 10.2, "25-54": 42.2, "55-64": 13.2, "65+": 19.2 },
  hungary: { "0-14": 14.5, "15-24": 10.0, "25-54": 41.5, "55-64": 13.5, "65+": 20.5 },
  croatia: { "0-14": 14.2, "15-24": 10.2, "25-54": 41.2, "55-64": 13.5, "65+": 20.9 },
  serbia: { "0-14": 14.5, "15-24": 10.5, "25-54": 41.2, "55-64": 13.2, "65+": 20.6 },
  bulgaria: { "0-14": 14.2, "15-24": 9.8, "25-54": 42.5, "55-64": 13.5, "65+": 20.0 },
  slovakia: { "0-14": 15.5, "15-24": 11.2, "25-54": 41.2, "55-64": 12.8, "65+": 19.3 },
  lithuania: { "0-14": 15.2, "15-24": 10.5, "25-54": 41.5, "55-64": 13.2, "65+": 19.6 },
  latvia: { "0-14": 15.2, "15-24": 10.2, "25-54": 41.2, "55-64": 13.5, "65+": 19.9 },
  estonia: { "0-14": 16.2, "15-24": 11.2, "25-54": 40.5, "55-64": 13.2, "65+": 18.9 },
  slovenia: { "0-14": 14.5, "15-24": 9.8, "25-54": 42.5, "55-64": 13.8, "65+": 19.4 },
  luxembourg: { "0-14": 16.5, "15-24": 12.2, "25-54": 41.2, "55-64": 12.5, "65+": 17.6 },
  malta: { "0-14": 14.2, "15-24": 11.2, "25-54": 42.5, "55-64": 13.2, "65+": 18.9 },
  cyprus: { "0-14": 16.2, "15-24": 12.5, "25-54": 42.2, "55-64": 12.2, "65+": 16.9 },
  iceland: { "0-14": 20.2, "15-24": 13.2, "25-54": 39.5, "55-64": 12.2, "65+": 14.9 },
  montenegro: { "0-14": 18.2, "15-24": 12.2, "25-54": 41.2, "55-64": 12.5, "65+": 15.9 },
  "north-macedonia": { "0-14": 16.5, "15-24": 11.5, "25-54": 42.2, "55-64": 12.5, "65+": 17.3 },
  albania: { "0-14": 17.2, "15-24": 12.5, "25-54": 41.2, "55-64": 11.5, "65+": 17.6 },
  "bosnia-and-herzegovina": { "0-14": 14.2, "15-24": 11.2, "25-54": 42.5, "55-64": 13.2, "65+": 18.9 },
  moldova: { "0-14": 18.2, "15-24": 12.5, "25-54": 41.2, "55-64": 11.8, "65+": 15.3 },
};

/** Sex split (CIA / UN). Male and female as % of total; sum = 100. */
export const POPULATION_SEX_BY_SLUG: Record<string, SexSplit> = {
  usa: { malePct: 49.2, femalePct: 50.8 },
  philippines: { malePct: 50.2, femalePct: 49.8 },
  thailand: { malePct: 48.5, femalePct: 51.5 },
  indonesia: { malePct: 49.8, femalePct: 50.2 },
  malaysia: { malePct: 50.5, femalePct: 49.5 },
  vietnam: { malePct: 49.2, femalePct: 50.8 },
  cambodia: { malePct: 49.0, femalePct: 51.0 },
  kenya: { malePct: 49.5, femalePct: 50.5 },
  nigeria: { malePct: 50.2, femalePct: 49.8 },
  uganda: { malePct: 49.8, femalePct: 50.2 },
  rwanda: { malePct: 49.2, femalePct: 50.8 },
  tanzania: { malePct: 49.5, femalePct: 50.5 },
  ethiopia: { malePct: 49.5, femalePct: 50.5 },
  bolivia: { malePct: 49.5, femalePct: 50.5 },
  colombia: { malePct: 49.2, femalePct: 50.8 },
  mexico: { malePct: 49.0, femalePct: 51.0 },
  peru: { malePct: 49.5, femalePct: 50.5 },
  venezuela: { malePct: 49.2, femalePct: 50.8 },
  "dominican-republic": { malePct: 50.2, femalePct: 49.8 },
  "costa-rica": { malePct: 50.0, femalePct: 50.0 },
  india: { malePct: 51.5, femalePct: 48.5 },
  pakistan: { malePct: 51.2, femalePct: 48.8 },
  morocco: { malePct: 49.5, femalePct: 50.5 },
  brazil: { malePct: 49.2, femalePct: 50.8 },
  argentina: { malePct: 49.0, femalePct: 51.0 },
  chile: { malePct: 49.2, femalePct: 50.8 },
  china: { malePct: 51.2, femalePct: 48.8 },
  mongolia: { malePct: 50.0, femalePct: 50.0 },
  "south-africa": { malePct: 49.5, femalePct: 50.5 },
  russia: { malePct: 46.2, femalePct: 53.8 },
  ukraine: { malePct: 46.0, femalePct: 54.0 },
  poland: { malePct: 48.5, femalePct: 51.5 },
  romania: { malePct: 48.5, femalePct: 51.5 },
  turkey: { malePct: 50.2, femalePct: 49.8 },
  kazakhstan: { malePct: 48.8, femalePct: 51.2 },
  algeria: { malePct: 50.5, femalePct: 49.5 },
  libya: { malePct: 51.0, femalePct: 49.0 },
  canada: { malePct: 49.5, femalePct: 50.5 },
  australia: { malePct: 49.5, femalePct: 50.5 },
  uk: { malePct: 49.2, femalePct: 50.8 },
  france: { malePct: 48.5, femalePct: 51.5 },
  germany: { malePct: 49.2, femalePct: 50.8 },
  spain: { malePct: 49.0, femalePct: 51.0 },
  italy: { malePct: 48.8, femalePct: 51.2 },
  sweden: { malePct: 49.5, femalePct: 50.5 },
  japan: { malePct: 48.5, femalePct: 51.5 },
  "south-korea": { malePct: 49.8, femalePct: 50.2 },
  "saudi-arabia": { malePct: 57.5, femalePct: 42.5 },
  egypt: { malePct: 50.5, femalePct: 49.5 },
  iran: { malePct: 50.5, femalePct: 49.5 },
  portugal: { malePct: 48.2, femalePct: 51.8 },
  netherlands: { malePct: 49.5, femalePct: 50.5 },
  belgium: { malePct: 49.2, femalePct: 50.8 },
  austria: { malePct: 49.2, femalePct: 50.8 },
  switzerland: { malePct: 49.5, femalePct: 50.5 },
  norway: { malePct: 50.2, femalePct: 49.8 },
  denmark: { malePct: 49.5, femalePct: 50.5 },
  finland: { malePct: 49.2, femalePct: 50.8 },
  ireland: { malePct: 49.5, femalePct: 50.5 },
  greece: { malePct: 49.2, femalePct: 50.8 },
  "czech-republic": { malePct: 49.2, femalePct: 50.8 },
  hungary: { malePct: 48.2, femalePct: 51.8 },
  croatia: { malePct: 48.2, femalePct: 51.8 },
  serbia: { malePct: 48.5, femalePct: 51.5 },
  bulgaria: { malePct: 48.5, femalePct: 51.5 },
  slovakia: { malePct: 49.0, femalePct: 51.0 },
  lithuania: { malePct: 47.8, femalePct: 52.2 },
  latvia: { malePct: 46.8, femalePct: 53.2 },
  estonia: { malePct: 47.5, femalePct: 52.5 },
  slovenia: { malePct: 49.2, femalePct: 50.8 },
  luxembourg: { malePct: 49.5, femalePct: 50.5 },
  malta: { malePct: 49.5, femalePct: 50.5 },
  cyprus: { malePct: 50.2, femalePct: 49.8 },
  iceland: { malePct: 50.5, femalePct: 49.5 },
  montenegro: { malePct: 48.5, femalePct: 51.5 },
  "north-macedonia": { malePct: 49.5, femalePct: 50.5 },
  albania: { malePct: 50.5, femalePct: 49.5 },
  "bosnia-and-herzegovina": { malePct: 49.2, femalePct: 50.8 },
  moldova: { malePct: 47.8, femalePct: 52.2 },
};

const DEFAULT_AGE: AgeDistribution = { "0-14": 25, "15-24": 15, "25-54": 40, "55-64": 10, "65+": 10 };
const DEFAULT_SEX: SexSplit = { malePct: 50, femalePct: 50 };

export function getAgeDistribution(slug: string): AgeDistribution {
  return POPULATION_AGE_BY_SLUG[slug] ?? DEFAULT_AGE;
}

export function getSexSplit(slug: string): SexSplit {
  return POPULATION_SEX_BY_SLUG[slug] ?? DEFAULT_SEX;
}

export type PyramidBand = { band: AgeBandKey; malePct: number; femalePct: number };
export type PyramidData = PyramidBand[];

/** Generates population pyramid data (M/F split per age band) scaled to the country's overall sex ratio */
export function getPopulationPyramid(slug: string): PyramidData {
  const ageDist = getAgeDistribution(slug);
  const sexSplit = getSexSplit(slug);

  // Base biological/demographic typical M/F ratios by age:
  // Young = slightly more male, Old = significantly more female
  const baseRatios: Record<AgeBandKey, { m: number; f: number }> = {
    "0-14": { m: 1.05, f: 1.0 },
    "15-24": { m: 1.05, f: 1.0 },
    "25-54": { m: 1.02, f: 1.0 },
    "55-64": { m: 0.95, f: 1.0 },
    "65+": { m: 0.80, f: 1.0 },
  };

  let totalRawM = 0;
  let totalRawF = 0;
  const rawBands = AGE_BAND_LABELS.map((band) => {
    const totalPct = ageDist[band];
    const r = baseRatios[band];
    const rawM = totalPct * (r.m / (r.m + r.f));
    const rawF = totalPct * (r.f / (r.m + r.f));
    totalRawM += rawM;
    totalRawF += rawF;
    return { band, rawM, rawF };
  });

  // Normalize to match the country's exact overall sex split
  const mScale = totalRawM > 0 ? sexSplit.malePct / totalRawM : 1;
  const fScale = totalRawF > 0 ? sexSplit.femalePct / totalRawF : 1;

  return rawBands.map((b) => ({
    band: b.band,
    malePct: b.rawM * mScale,
    femalePct: b.rawF * fScale,
  }));
}

export const US_PYRAMID_REFERENCE = getPopulationPyramid("usa");
