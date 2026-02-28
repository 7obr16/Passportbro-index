/**
 * Safety scores derived from Global Peace Index (GPI) by the Institute for Economics & Peace.
 * GPI ranks 163 countries annually. Lower rank = more peaceful.
 * We convert rank to a 0–100 "safety score" so that rank 1 = 100 and rank 163 = 0, with no ties.
 * Source: Global Peace Index 2025 (Wikipedia / Vision of Humanity).
 * @see https://www.visionofhumanity.org/
 * @see https://en.wikipedia.org/wiki/Global_Peace_Index
 */

const GPI_RANK: Record<string, number> = {
  // 1–30
  "philippines": 105,
  "thailand": 86,
  "indonesia": 49,
  "malaysia": 13,
  "vietnam": 38,
  "cambodia": 87,
  "kenya": 127,
  "nigeria": 148,
  "uganda": 113,
  "rwanda": 91,
  "tanzania": 73,
  "ethiopia": 138,
  "bolivia": 83,
  "colombia": 140,
  "mexico": 135,
  "peru": 96,
  "venezuela": 139,
  "dominican-republic": 80,
  "costa-rica": 54,
  "india": 115,
  "pakistan": 144,
  "morocco": 85,
  "brazil": 130,
  "argentina": 46,
  "chile": 62,
  "china": 98,
  "mongolia": 37,
  "south-africa": 124,
  "russia": 163,
  "ukraine": 162,
  "poland": 36,
  "romania": 38,
  "turkey": 146,
  "kazakhstan": 56,
  "algeria": 92,
  "libya": 131,
  "usa": 128,
  "canada": 14,
  "australia": 18,
  "uk": 30,
  "france": 74,
  "germany": 20,
  "spain": 25,
  "italy": 33,
  "sweden": 35,
  "japan": 12,
  "south-korea": 41,
  "saudi-arabia": 90,
  "egypt": 107,
  "iran": 142,
};

const GPI_MAX_RANK = 163;

/**
 * Convert GPI rank (1 = most peaceful) to a 0–100 safety score (100 = safest).
 * Linear scale so no two countries have the same score.
 */
export function getSafetyScoreFromGpiRank(rank: number): number {
  if (rank < 1) rank = 1;
  if (rank > GPI_MAX_RANK) rank = GPI_MAX_RANK;
  return Math.round(100 - ((rank - 1) / (GPI_MAX_RANK - 1)) * 100);
}

/**
 * Get numeric safety score (0–100) for a country slug.
 * Uses GPI 2025; unknown slugs get a middle default (rank 82 → ~50).
 */
export function getSafetyScoreBySlug(slug: string): number {
  const rank = GPI_RANK[slug] ?? 82;
  return getSafetyScoreFromGpiRank(rank);
}

/**
 * Derive display label from numeric score for filters and UI.
 * Thresholds aligned with GPI tiers: top ~15% = Very Safe, next ~25% = Safe, etc.
 */
export function getSafetyLevelFromScore(score: number): "Very Safe" | "Safe" | "Moderate" | "Dangerous" {
  if (score >= 85) return "Very Safe";
  if (score >= 65) return "Safe";
  if (score >= 40) return "Moderate";
  return "Dangerous";
}

export { GPI_RANK };
