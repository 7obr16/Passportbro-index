/**
 * Friendliness / receptiveness to foreigners (expats & visitors).
 * Primary source: InterNations Expat Insider "Ease of Settling In" (2024) – how welcome
 * expats feel, local friendliness, ease of making friends. Countries like Philippines,
 * Mexico, Costa Rica rank at the top. Fallback: Gallup Migrant Acceptance Index for
 * countries not in the InterNations survey.
 * @see https://www.internations.org/expat-insider/2024/ease-of-settling-in-index-40452
 * @see https://news.gallup.com/poll/216377/new-index-shows-least-accepting-countries-migrants.aspx
 */

/** InterNations Ease of Settling In rank (1 = friendliest, 53 = least). Only countries in survey. */
const INTERNATIONS_SETTLING_IN_RANK: Record<string, number> = {
  "costa-rica": 1,
  "mexico": 2,
  "philippines": 3,
  "indonesia": 4,
  "brazil": 5,
  "thailand": 6,
  "colombia": 8,
  "kenya": 9,
  "greece": 10,
  "spain": 11,
  "vietnam": 13,
  "south-korea": 36,
  "canada": 39,
  "turkey": 40,
  "hungary": 44,
  "denmark": 45,
  "switzerland": 46,
  "czech-republic": 47,
  "sweden": 48,
  "austria": 49,
  "finland": 50,
  "germany": 51,
  "norway": 52,
};

const INTERNATIONS_MAX_RANK = 53;

/** Gallup 0–9 (migration acceptance). Fallback for countries not in InterNations. */
const GALLUP_ACCEPTANCE: Record<string, number> = {
  "philippines": 6.9,
  "thailand": 7.0,
  "indonesia": 6.8,
  "malaysia": 6.4,
  "vietnam": 6.2,
  "cambodia": 6.6,
  "kenya": 7.4,
  "nigeria": 7.76,
  "uganda": 7.2,
  "rwanda": 8.16,
  "tanzania": 7.1,
  "ethiopia": 6.9,
  "bolivia": 6.5,
  "colombia": 6.8,
  "mexico": 6.4,
  "peru": 6.3,
  "venezuela": 6.0,
  "dominican-republic": 6.2,
  "costa-rica": 7.2,
  "india": 5.97,
  "pakistan": 5.2,
  "morocco": 5.8,
  "brazil": 6.95,
  "argentina": 6.5,
  "chile": 6.2,
  "china": 5.4,
  "mongolia": 5.8,
  "south-africa": 6.63,
  "russia": 4.3,
  "ukraine": 4.0,
  "poland": 3.8,
  "romania": 3.5,
  "turkey": 4.73,
  "kazakhstan": 5.0,
  "algeria": 5.2,
  "libya": 5.0,
  "usa": 7.86,
  "canada": 8.14,
  "australia": 7.98,
  "uk": 7.5,
  "france": 6.8,
  "germany": 7.48,
  "spain": 7.73,
  "italy": 6.2,
  "sweden": 7.92,
  "japan": 5.6,
  "south-korea": 5.4,
  "saudi-arabia": 4.8,
  "egypt": 5.5,
  "iran": 3.8,
  "portugal": 6.8,
  "netherlands": 7.6,
  "belgium": 7.2,
  "austria": 6.5,
  "switzerland": 7.4,
  "norway": 7.8,
  "denmark": 7.4,
  "finland": 7.2,
  "ireland": 8.0,
  "greece": 5.2,
  "czech-republic": 4.5,
  "hungary": 3.8,
  "croatia": 4.8,
  "serbia": 4.2,
  "bulgaria": 4.0,
  "slovakia": 4.2,
  "lithuania": 4.8,
  "latvia": 5.0,
  "estonia": 5.2,
  "slovenia": 5.0,
  "luxembourg": 7.6,
  "malta": 6.2,
  "cyprus": 5.8,
  "iceland": 7.8,
  "montenegro": 4.5,
  "north-macedonia": 4.2,
  "albania": 4.5,
  "bosnia-and-herzegovina": 4.0,
  "moldova": 4.0,
};

const GALLUP_MAX = 9;

/**
 * Convert InterNations rank (1 = best) to 0–100 score.
 */
function scoreFromInterNationsRank(rank: number): number {
  const r = Math.max(1, Math.min(INTERNATIONS_MAX_RANK, rank));
  return Math.round((100 * (INTERNATIONS_MAX_RANK - r)) / (INTERNATIONS_MAX_RANK - 1));
}

/**
 * Convert Gallup 0–9 to 0–100 (fallback).
 */
export function getFriendlinessScoreFromGallup(gallup: number): number {
  const clamped = Math.max(0, Math.min(GALLUP_MAX, gallup));
  return Math.round((clamped / GALLUP_MAX) * 100);
}

/**
 * Get numeric friendliness score (0–100). Uses InterNations Ease of Settling In
 * where available; otherwise Gallup Migrant Acceptance. Higher = more welcoming.
 */
export function getFriendlinessScoreBySlug(slug: string): number {
  const rank = INTERNATIONS_SETTLING_IN_RANK[slug];
  if (rank != null) return scoreFromInterNationsRank(rank);
  const gallup = GALLUP_ACCEPTANCE[slug] ?? 5.0;
  return getFriendlinessScoreFromGallup(gallup);
}

/**
 * Whether the country has InterNations Ease of Settling In data (vs Gallup fallback).
 */
export function hasInterNationsFriendlinessData(slug: string): boolean {
  return slug in INTERNATIONS_SETTLING_IN_RANK;
}

/**
 * Derive display label from numeric score for filters and UI.
 */
export function getFriendlinessLabelFromScore(score: number): "High" | "Medium" | "Low" {
  if (score >= 72) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

/**
 * Display value for UI: 0–100 score and optional InterNations rank.
 * Use for "Local friendliness" / "Foreigner acceptance" sections.
 */
export function getFriendlinessDisplay(slug: string): {
  score: number;
  source: "internations" | "gallup";
  rank?: number;
  label: string;
  color: string;
} {
  const score = getFriendlinessScoreBySlug(slug);
  const rank = INTERNATIONS_SETTLING_IN_RANK[slug];
  const source = rank != null ? "internations" : "gallup";
  if (score >= 85) return { score, source, rank, label: "Very welcoming", color: "text-emerald-400" };
  if (score >= 70) return { score, source, rank, label: "Welcoming", color: "text-lime-400" };
  if (score >= 50) return { score, source, rank, label: "Moderate", color: "text-amber-400" };
  if (score >= 30) return { score, source, rank, label: "Cautious", color: "text-orange-400" };
  return { score, source, rank, label: "Unwelcoming", color: "text-red-400" };
}

/** Raw Gallup score (0–9). Only meaningful when source is gallup; used for fallback display. */
export function getGallupScore(slug: string): number {
  return GALLUP_ACCEPTANCE[slug] ?? 5.0;
}

/** Human-readable label for a 0–9 Gallup score (used when showing Gallup fallback). */
export function getGallupLabel(score: number): { label: string; color: string } {
  if (score >= 8.0) return { label: "Very Welcoming", color: "text-emerald-400" };
  if (score >= 6.5) return { label: "Welcoming", color: "text-lime-400" };
  if (score >= 5.0) return { label: "Moderate", color: "text-amber-400" };
  if (score >= 3.5) return { label: "Cautious", color: "text-orange-400" };
  return { label: "Unwelcoming", color: "text-red-400" };
}

export { GALLUP_ACCEPTANCE, INTERNATIONS_SETTLING_IN_RANK };
