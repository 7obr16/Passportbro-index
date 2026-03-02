/**
 * Manual dating ease and score overrides (e.g. for new European countries).
 * When present, these override the database values so ranking, globe, and filters work without DB update.
 * Tier must be one of: Very Easy | Easy | Normal | Hard | Improbable | N/A
 * Score 0–100 (higher = easier dating).
 */

export type DatingOverride = { ease: string; score: number };

/** Manual dating input. Overrides DB when present. */
export const DATING_OVERRIDES: Record<string, DatingOverride> = {
  // Very Easy tier (80+)
  philippines: { ease: "Very Easy", score: 100 },
  kenya: { ease: "Very Easy", score: 100 },
  nigeria: { ease: "Very Easy", score: 95 },
  rwanda: { ease: "Very Easy", score: 95 },
  uganda: { ease: "Very Easy", score: 95 },
  thailand: { ease: "Very Easy", score: 90 },
  tanzania: { ease: "Very Easy", score: 90 },
  vietnam: { ease: "Very Easy", score: 90 },
  bolivia: { ease: "Very Easy", score: 90 },
  // Adjusted down due to legal / cultural constraints
  indonesia: { ease: "Easy", score: 70 },
  malaysia: { ease: "Easy", score: 68 },
  india: { ease: "Very Easy", score: 84 },
  cambodia: { ease: "Very Easy", score: 83 },
  "dominican-republic": { ease: "Very Easy", score: 83 },
  venezuela: { ease: "Very Easy", score: 83 },
  peru: { ease: "Very Easy", score: 80 },
  colombia: { ease: "Very Easy", score: 80 },

  // Easy tier (65-79)
  "costa-rica": { ease: "Easy", score: 77 },
  mexico: { ease: "Easy", score: 75 },
  "south-africa": { ease: "Easy", score: 75 },
  brazil: { ease: "Easy", score: 73 },
  mongolia: { ease: "Easy", score: 73 },
  chile: { ease: "Easy", score: 70 },
  china: { ease: "Normal", score: 60 },
  morocco: { ease: "Easy", score: 67 },
  argentina: { ease: "Easy", score: 65 },
  pakistan: { ease: "Easy", score: 65 },
  ecuador: { ease: "Easy", score: 70 },
  paraguay: { ease: "Easy", score: 75 },
  uruguay: { ease: "Easy", score: 75 },
  panama: { ease: "Easy", score: 70 },
  guatemala: { ease: "Easy", score: 65 },
  taiwan: { ease: "Easy", score: 70 },
  laos: { ease: "Easy", score: 75 },
  "sri-lanka": { ease: "Easy", score: 65 },
  mauritius: { ease: "Easy", score: 70 },
  georgia: { ease: "Easy", score: 65 },

  // Normal tier (55-64)
  romania: { ease: "Normal", score: 55 },
  kazakhstan: { ease: "Normal", score: 55 },
  bulgaria: { ease: "Normal", score: 55 },
  hungary: { ease: "Normal", score: 55 },

  // Hard tier (41-54)
  "north-macedonia": { ease: "Hard", score: 52 },
  "bosnia-and-herzegovina": { ease: "Hard", score: 52 },
  moldova: { ease: "Hard", score: 52 },
  turkey: { ease: "Hard", score: 50 },
  albania: { ease: "Hard", score: 50 },
  russia: { ease: "Hard", score: 50 },
  ukraine: { ease: "Hard", score: 50 },
  portugal: { ease: "Hard", score: 50 },
  serbia: { ease: "Hard", score: 50 },
  croatia: { ease: "Hard", score: 48 },
  greece: { ease: "Hard", score: 45 },
  "czech-republic": { ease: "Hard", score: 45 },
  poland: { ease: "Hard", score: 45 },
  spain: { ease: "Hard", score: 45 },
  belarus: { ease: "Hard", score: 45 },

  // Improbable tier (40 or under)
  cyprus: { ease: "Improbable", score: 40 },
  montenegro: { ease: "Improbable", score: 40 },
  estonia: { ease: "Improbable", score: 40 },
  malta: { ease: "Improbable", score: 35 },
  italy: { ease: "Improbable", score: 35 },
  slovakia: { ease: "Improbable", score: 35 },
  lithuania: { ease: "Improbable", score: 35 },
  latvia: { ease: "Improbable", score: 35 },
  slovenia: { ease: "Improbable", score: 35 },
  germany: { ease: "Improbable", score: 30 },
  japan: { ease: "Improbable", score: 30 },
  canada: { ease: "Improbable", score: 30 },
  usa: { ease: "Improbable", score: 25 },
  uk: { ease: "Improbable", score: 20 },
  ethiopia: { ease: "Very Easy", score: 80 },
  cuba: { ease: "Improbable", score: 40 },
  jamaica: { ease: "Hard", score: 50 },
  "united-arab-emirates": { ease: "Improbable", score: 20 },
  singapore: { ease: "Improbable", score: 30 },
  netherlands: { ease: "Improbable", score: 15 },
  belgium: { ease: "Improbable", score: 15 },
  austria: { ease: "Improbable", score: 15 },
  switzerland: { ease: "Improbable", score: 15 },
  norway: { ease: "Improbable", score: 15 },
  denmark: { ease: "Improbable", score: 15 },
  finland: { ease: "Improbable", score: 15 },
  ireland: { ease: "Improbable", score: 15 },
  luxembourg: { ease: "Improbable", score: 15 },
  iceland: { ease: "Improbable", score: 15 },
};

export function getDatingOverride(slug: string): DatingOverride | undefined {
  return DATING_OVERRIDES[slug];
}
