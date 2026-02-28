import type { Country } from "./countries";
import { getSafetyScoreBySlug } from "./safetyIndex";
import { getFriendlinessScoreBySlug } from "./friendlinessIndex";
import { getAffordabilityScoreBySlug } from "./affordabilityIndex";

export type LeaderboardSortKey =
  | "overall"
  | "dating"
  | "cost"
  | "internet"
  | "friendly"
  | "safety";

export type ScoreBreakdown = {
  overall: number;
  dating: number;
  cost: number;
  internet: number;
  friendly: number;
  safety: number;
};

// Legacy: cost now comes from affordabilityIndex (Numbeo). Kept for any external callers.
export const getBudgetScore = (gdpPerCapita: string) => {
  const numeric = parseInt(gdpPerCapita.replace(/[^0-9]/g, "") || "0", 10);
  if (!numeric) return 50;
  if (numeric < 5000) return 100;
  if (numeric < 10000) return 80;
  if (numeric < 20000) return 60;
  if (numeric < 40000) return 40;
  return 25;
};

// Internet score: assumes major nomad hubs inside each country can usually access good fibre / 5G,
// even when the national average is lower.
export const getInternetScore = (speed: string, mbps?: number) => {
  if (mbps !== undefined) {
    if (mbps >= 200) return 100;
    if (mbps >= 100) return 90;
    if (mbps >= 50) return 80;
    return 70;
  }
  if (speed === "Fast") return 100;
  if (speed === "Moderate") return 90;
  return 70; // "Slow" countries still get workable speeds in big cities
};

// Legacy: friendly now comes from friendlinessIndex (Gallup). Kept for any external callers.
export const getReceptivenessScore = (rec: string) => {
  if (rec === "High") return 100;
  if (rec === "Medium") return 50;
  return 15;
};

// Kept for any legacy callers; new code uses getSafetyScoreBySlug for granular GPI scores.
export const getSafetyScore = (safety: string) => {
  if (safety === "Very Safe") return 100;
  if (safety === "Safe") return 75;
  if (safety === "Moderate") return 40;
  return 15;
};

export function getCountryScores(country: Country): ScoreBreakdown {
  const dating = country.datingEaseScore; // already 0-100 from PPB / map score
  const cost = getAffordabilityScoreBySlug(country.slug);   // Numbeo cost-of-living → affordability 0-100
  const internet = getInternetScore(country.internetSpeed, country.internetMbps);
  const friendly = getFriendlinessScoreBySlug(country.slug); // Gallup Migrant Acceptance → 0-100
  const safety = getSafetyScoreBySlug(country.slug);

  // Overall blends dating with the same sub-metrics used on the main page
  const overall =
    0.6 * dating +
    0.1 * cost +
    0.1 * internet +
    0.1 * friendly +
    0.1 * safety;

  return {
    overall,
    dating,
    cost,
    internet,
    friendly,
    safety,
  };
}

export type LeaderboardCountry = Country & {
  scores: ScoreBreakdown;
};

export function sortLeaderboard(
  countries: Country[],
  sortKey: LeaderboardSortKey,
): LeaderboardCountry[] {
  const withScores = countries.map((country) => ({
    ...country,
    scores: getCountryScores(country),
  }));

  return withScores.sort((a, b) => {
    if (sortKey === "overall") return b.scores.overall - a.scores.overall;
    if (sortKey === "dating") return b.scores.dating - a.scores.dating;
    if (sortKey === "cost") return b.scores.cost - a.scores.cost;
    if (sortKey === "internet") return b.scores.internet - a.scores.internet;
    if (sortKey === "friendly") return b.scores.friendly - a.scores.friendly;
    return b.scores.safety - a.scores.safety;
  });
}
