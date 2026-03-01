/**
 * Manual dating ease and score overrides (e.g. for new European countries).
 * When present, these override the database values so ranking, globe, and filters work without DB update.
 * Tier must be one of: Very Easy | Easy | Normal | Hard | Improbable | N/A
 * Score 0–100 (higher = easier dating).
 */

export type DatingOverride = { ease: string; score: number };

/** European countries – manual dating input. Overrides DB when present. */
export const DATING_OVERRIDES: Record<string, DatingOverride> = {
  portugal: { ease: "Hard", score: 35 },
  netherlands: { ease: "Improbable", score: 15 },
  belgium: { ease: "Improbable", score: 15 },
  austria: { ease: "Improbable", score: 15 },
  switzerland: { ease: "Improbable", score: 15 },
  norway: { ease: "Improbable", score: 15 },
  denmark: { ease: "Improbable", score: 15 },
  finland: { ease: "Improbable", score: 15 },
  ireland: { ease: "Improbable", score: 15 },
  greece: { ease: "Hard", score: 35 },
  "czech-republic": { ease: "Hard", score: 35 },
  hungary: { ease: "Hard", score: 35 },
  croatia: { ease: "Hard", score: 35 },
  serbia: { ease: "Hard", score: 35 },
  bulgaria: { ease: "Hard", score: 35 },
  slovakia: { ease: "Hard", score: 35 },
  lithuania: { ease: "Hard", score: 35 },
  latvia: { ease: "Hard", score: 35 },
  estonia: { ease: "Hard", score: 35 },
  slovenia: { ease: "Hard", score: 35 },
  luxembourg: { ease: "Improbable", score: 15 },
  malta: { ease: "Improbable", score: 15 },
  cyprus: { ease: "Hard", score: 35 },
  iceland: { ease: "Improbable", score: 15 },
  montenegro: { ease: "Hard", score: 35 },
  "north-macedonia": { ease: "Normal", score: 52 },
  albania: { ease: "Hard", score: 35 },
  "bosnia-and-herzegovina": { ease: "Normal", score: 52 },
  moldova: { ease: "Normal", score: 52 },
};

export function getDatingOverride(slug: string): DatingOverride | undefined {
  return DATING_OVERRIDES[slug];
}
