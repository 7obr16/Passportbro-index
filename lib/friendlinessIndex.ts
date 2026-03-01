/**
 * Friendliness / receptiveness to foreigners, derived from Gallup Migrant Acceptance Index.
 * Scale 0–9 (Gallup): "Would you accept migrants as neighbors / living in your country / in your family?"
 * We convert to 0–100 for scoring. Higher = more welcoming.
 * Sources: Gallup Migrant Acceptance Index (2017–2019; most recent published).
 * @see https://news.gallup.com/poll/216377/new-index-shows-least-accepting-countries-migrants.aspx
 * @see https://news.gallup.com/opinion/gallup/245528/revisiting-least-accepting-countries-migrants.aspx
 */

const GALLUP_ACCEPTANCE: Record<string, number> = {
  // Gallup 0–9 scale (published or region-consistent estimates)
  "philippines": 6.9,
  "thailand": 7.0,
  "indonesia": 6.8,
  "malaysia": 6.4,
  "vietnam": 6.2,
  "cambodia": 6.6,
  "kenya": 7.4,
  "nigeria": 7.76,  // Gallup
  "uganda": 7.2,
  "rwanda": 8.16,   // Gallup (top tier)
  "tanzania": 7.1,
  "ethiopia": 6.9,
  "bolivia": 6.5,
  "colombia": 6.8,
  "mexico": 6.4,
  "peru": 6.3,
  "venezuela": 6.0,
  "dominican-republic": 6.2,
  "costa-rica": 7.2,
  "india": 5.97,    // Gallup
  "pakistan": 5.2,
  "morocco": 5.8,
  "brazil": 6.95,   // Gallup
  "argentina": 6.5,
  "chile": 6.2,
  "china": 5.4,
  "mongolia": 5.8,
  "south-africa": 6.63, // Gallup
  "russia": 4.3,    // Gallup (low)
  "ukraine": 4.0,
  "poland": 3.8,
  "romania": 3.5,
  "turkey": 4.73,   // Gallup
  "kazakhstan": 5.0,
  "algeria": 5.2,
  "libya": 5.0,
  "usa": 7.86,      // Gallup
  "canada": 8.14,   // Gallup (top)
  "australia": 7.98, // Gallup
  "uk": 7.5,
  "france": 6.8,
  "germany": 7.48,  // Gallup
  "spain": 7.73,    // Gallup
  "italy": 6.2,
  "sweden": 7.92,   // Gallup
  "japan": 5.6,
  "south-korea": 5.4,
  "saudi-arabia": 4.8,
  "egypt": 5.5,
  "iran": 3.8,
  // European (Gallup Migrant Acceptance Index)
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
 * Convert Gallup 0–9 score to 0–100 (100 = most welcoming).
 */
export function getFriendlinessScoreFromGallup(gallup: number): number {
  const clamped = Math.max(0, Math.min(GALLUP_MAX, gallup));
  return Math.round((clamped / GALLUP_MAX) * 100);
}

/**
 * Get numeric friendliness score (0–100) for a country slug.
 * Uses Gallup Migrant Acceptance Index; unknown slugs get default 55.
 */
export function getFriendlinessScoreBySlug(slug: string): number {
  const gallup = GALLUP_ACCEPTANCE[slug] ?? 5.0;
  return getFriendlinessScoreFromGallup(gallup);
}

/**
 * Derive display label from numeric score for filters and UI.
 */
export function getFriendlinessLabelFromScore(score: number): "High" | "Medium" | "Low" {
  if (score >= 72) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

/** Raw Gallup Migrant Acceptance Index score (0–9) for a slug. Default 5.0 for unknown. */
export function getGallupScore(slug: string): number {
  return GALLUP_ACCEPTANCE[slug] ?? 5.0;
}

/** Human-readable label for a Gallup 0–9 score. */
export function getGallupLabel(score: number): { label: string; color: string } {
  if (score >= 8.0) return { label: "Very Welcoming",  color: "text-emerald-400" };
  if (score >= 6.5) return { label: "Welcoming",       color: "text-lime-400"    };
  if (score >= 5.0) return { label: "Moderate",        color: "text-amber-400"   };
  if (score >= 3.5) return { label: "Cautious",        color: "text-orange-400"  };
  return                    { label: "Unwelcoming",    color: "text-red-400"     };
}

export { GALLUP_ACCEPTANCE };
