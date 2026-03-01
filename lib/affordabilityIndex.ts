/**
 * Affordability for visitors/nomads: derived from Numbeo Cost of Living Index.
 * Numbeo index: New York = 100; lower = cheaper. We convert to 0–100 "affordability" (100 = most affordable).
 * Source: Numbeo Cost of Living Index 2024 (user-contributed, country-level).
 * @see https://www.numbeo.com/cost-of-living/rankings_by_country.jsp
 */

const NUMBEO_COST_INDEX: Record<string, number> = {
  // Numbeo Cost of Living Index (approx 2024; lower = cheaper)
  "philippines": 36,
  "thailand": 44,
  "indonesia": 42,
  "malaysia": 45,
  "vietnam": 40,
  "cambodia": 38,
  "kenya": 25,
  "nigeria": 19.3,
  "uganda": 32,
  "rwanda": 35,
  "tanzania": 38,
  "ethiopia": 43,
  "bolivia": 35,
  "colombia": 32,
  "mexico": 35,
  "peru": 38,
  "venezuela": 28,
  "dominican-republic": 48,
  "costa-rica": 58,
  "india": 22.2,
  "pakistan": 18.5,
  "morocco": 38,
  "brazil": 42,
  "argentina": 35,
  "chile": 52,
  "china": 48,
  "mongolia": 42,
  "south-africa": 42,
  "russia": 29.5,
  "ukraine": 28.6,
  "poland": 45,
  "romania": 42,
  "turkey": 42,
  "kazakhstan": 38,
  "algeria": 35,
  "libya": 21.2,
  "usa": 72.9,
  "canada": 68.4,
  "australia": 72.8,
  "uk": 65,
  "france": 72,
  "germany": 65,
  "spain": 58,
  "italy": 62,
  "sweden": 72,
  "japan": 85,
  "south-korea": 75,
  "saudi-arabia": 52,
  "egypt": 32,
  "iran": 28,
  // European (Numbeo cost of living; lower = cheaper)
  "portugal": 52,
  "netherlands": 72,
  "belgium": 70,
  "austria": 72,
  "switzerland": 118,
  "norway": 105,
  "denmark": 88,
  "finland": 72,
  "ireland": 78,
  "greece": 58,
  "czech-republic": 48,
  "hungary": 42,
  "croatia": 52,
  "serbia": 42,
  "bulgaria": 40,
  "slovakia": 48,
  "lithuania": 52,
  "latvia": 52,
  "estonia": 58,
  "slovenia": 55,
  "luxembourg": 95,
  "malta": 65,
  "cyprus": 62,
  "iceland": 105,
  "montenegro": 48,
  "north-macedonia": 42,
  "albania": 42,
  "bosnia-and-herzegovina": 38,
  "moldova": 38,
};

const COST_INDEX_MIN = 18;
const COST_INDEX_MAX = 90;

/**
 * Convert Numbeo cost index (lower = cheaper) to 0–100 affordability (100 = most affordable).
 */
export function getAffordabilityScoreFromCostIndex(costIndex: number): number {
  const clamped = Math.max(COST_INDEX_MIN, Math.min(COST_INDEX_MAX, costIndex));
  // Affordability = inverse of cost: (max - cost) / (max - min) * 100
  return Math.round(((COST_INDEX_MAX - clamped) / (COST_INDEX_MAX - COST_INDEX_MIN)) * 100);
}

/**
 * Get numeric affordability score (0–100) for a country slug.
 * Uses Numbeo 2024; unknown slugs get default 50.
 */
export function getAffordabilityScoreBySlug(slug: string): number {
  const cost = NUMBEO_COST_INDEX[slug] ?? 50;
  return getAffordabilityScoreFromCostIndex(cost);
}

/**
 * Derive budget tier label for display (aligned with filter options).
 */
export function getBudgetTierFromScore(score: number): string {
  if (score >= 75) return "<$1k";
  if (score >= 55) return "$1k-$2k";
  if (score >= 35) return "$2k-$3k";
  return "$3k+";
}

export { NUMBEO_COST_INDEX };
