import type { Country } from "./countries";

export type LeaderboardSortKey =
  | "overall"
  | "dating"
  | "affordable"
  | "lifestyle"
  | "safest";

type ScoreBreakdown = {
  overall: number;
  dating: number;
  cost: number;
  lifestyle: number;
  safetyHealthcare: number;
};

const RECEPTIVENESS_POINTS: Record<string, number> = {
  High: 10,
  Medium: 5,
  Low: 1,
};

const ENGLISH_POINTS: Record<string, number> = {
  High: 10,
  Moderate: 6,
  Low: 2,
};

const BUDGET_POINTS: Record<string, number> = {
  "<$1k": 10,
  "$1k-$2k": 7,
  "$2k-$3k": 4,
  "$3k+": 1,
};

const INTERNET_POINTS: Record<string, number> = {
  Fast: 10,
  Moderate: 5,
  Slow: 1,
};

const CLIMATE_POINTS: Record<string, number> = {
  Tropical: 9,
  Temperate: 8,
  Cold: 4,
};

const VISA_POINTS: Record<string, number> = {
  "Visa-Free": 10,
  "e-Visa": 7,
  Difficult: 2,
};

const VIBE_POINTS = 8;

const SAFETY_POINTS: Record<string, number> = {
  "Very Safe": 10,
  Safe: 7,
  Moderate: 4,
  Dangerous: 1,
};

const HEALTHCARE_POINTS: Record<string, number> = {
  High: 10,
  Moderate: 6,
  Low: 2,
};

const fallback = (value: string, table: Record<string, number>, defaultValue = 5) =>
  table[value] ?? defaultValue;

const avg = (...values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const round1 = (value: number) => Math.round(value * 10) / 10;

export function getCountryScores(country: Country): ScoreBreakdown {
  const dating = avg(
    fallback(country.receptiveness, RECEPTIVENESS_POINTS),
    fallback(country.englishProficiency, ENGLISH_POINTS),
  );

  const cost = fallback(country.budgetTier, BUDGET_POINTS);

  const lifestyle = avg(
    fallback(country.internetSpeed, INTERNET_POINTS),
    fallback(country.climate, CLIMATE_POINTS),
    fallback(country.visaEase, VISA_POINTS),
    VIBE_POINTS,
  );

  const safetyHealthcare = avg(
    fallback(country.safetyLevel, SAFETY_POINTS),
    fallback(country.healthcareQuality, HEALTHCARE_POINTS),
  );

  return {
    overall: country.datingEaseScore / 10,
    dating: round1(dating),
    cost: round1(cost),
    lifestyle: round1(lifestyle),
    safetyHealthcare: round1(safetyHealthcare),
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
    if (sortKey === "affordable") return b.scores.cost - a.scores.cost;
    if (sortKey === "lifestyle") return b.scores.lifestyle - a.scores.lifestyle;
    return b.scores.safetyHealthcare - a.scores.safetyHealthcare;
  });
}
