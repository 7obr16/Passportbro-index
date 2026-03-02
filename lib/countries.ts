import { supabase } from "./supabase";
import { COUNTRY_FILTER_DATA, DEFAULT_COUNTRY_FILTER_META } from "./countryFilterData";
import { getSafetyScoreBySlug, getSafetyLevelFromScore } from "./safetyIndex";
import { getFriendlinessScoreBySlug, getFriendlinessLabelFromScore } from "./friendlinessIndex";
import { getAffordabilityScoreBySlug, getBudgetTierFromScore } from "./affordabilityIndex";
import { getEnglishProficiencyBySlug } from "./englishProficiencyIndex";
import { getCountryBmi } from "./bmiData";
import { getDatingOverride } from "./datingOverrides";
import { getCountryDisplayName } from "./countryDisplayNames";

export type Country = {
  slug: string;
  name: string;
  region: string;
  flagEmoji: string;
  datingEase: string;
  datingEaseScore: number;
  redditPros: string;
  redditCons: string;
  avgHeightMale: string;
  avgHeightFemale: string;
  gdpPerCapita: string;
  majorityReligion: string;
  imageUrl: string;
  womenImageUrl?: string;
  receptiveness: string;
  localValues: string;
  englishProficiency: string;
  budgetTier: string;
  visaEase: string;
  internetSpeed: string;
  internetMbps?: number;
  climate: string;
  hasNightlife: boolean;
  hasBeach: boolean;
  hasNature: boolean;
  safetyLevel: string;
  healthcareQuality: string;
  avgBmiMale?: number;
  avgBmiFemale?: number;
};

type CountryRow = {
  slug: string;
  name: string;
  region: string;
  flag_emoji: string;
  dating_ease: string;
  dating_ease_score: number;
  reddit_pros: string;
  reddit_cons: string;
  avg_height_male: string;
  avg_height_female: string;
  gdp_per_capita: string;
  majority_religion: string;
  image_url: string;
  women_image_url?: string;
};

const PORTRAIT_AVAILABLE = new Set([
  "philippines", "thailand", "indonesia", "malaysia", "vietnam", "cambodia", "kenya",
  "nigeria", "uganda", "rwanda", "tanzania", "ethiopia", "bolivia", "colombia", "mexico",
  "peru", "venezuela", "dominican-republic", "costa-rica", "india", "pakistan", "morocco",
  "brazil", "argentina", "chile", "china", "mongolia", "south-africa", "russia", "ukraine",
  "poland", "romania", "turkey", "kazakhstan", "algeria", "libya", "usa", "canada",
  "australia", "uk", "france", "germany", "spain", "italy", "sweden", "japan",
  "south-korea", "saudi-arabia", "egypt", "iran",
  "portugal", "netherlands", "belgium", "austria", "switzerland", "norway", "denmark",
  "finland", "ireland", "greece", "czech-republic", "hungary", "croatia", "serbia",
  "bulgaria", "slovakia", "lithuania", "latvia", "estonia", "slovenia", "luxembourg",
  "malta", "cyprus", "iceland", "montenegro", "north-macedonia", "albania",
  "bosnia-and-herzegovina", "moldova", "taiwan", "singapore", "laos", "sri-lanka",
  "ecuador", "paraguay", "uruguay", "panama", "guatemala", "cuba", "jamaica",
  "georgia", "united-arab-emirates", "mauritius", "belarus"
]);

/** Canonical dating tiers only. "Possible" is treated as "Normal". */
const DATING_EASE_CANONICAL: Record<string, string> = {
  Possible: "Normal",
  "Normal to hard": "Hard",
  "normal to hard": "Hard",
};

function normalizeDatingEase(ease: string): string {
  if (!ease) return "N/A";
  // Convert "very easy" to "Very Easy"
  if (ease.toLowerCase() === "very easy") return "Very Easy";
  if (ease.toLowerCase() === "easy") return "Easy";
  if (ease.toLowerCase() === "normal") return "Normal";
  if (ease.toLowerCase() === "hard") return "Hard";
  if (ease.toLowerCase() === "improbable") return "Improbable";
  
  return DATING_EASE_CANONICAL[ease] ?? ease;
}

const DATING_TIER_SCORE: Record<string, number> = {
  "Very Easy": 95,
  "Easy": 80,
  "Normal": 65,
  "Hard": 45,
  "Improbable": 25,
  "N/A": 50,
};

function rowToCountry(row: CountryRow): Country {
  const meta = COUNTRY_FILTER_DATA[row.slug] ?? DEFAULT_COUNTRY_FILTER_META;
  const datingOverride = getDatingOverride(row.slug);
  const rawEase = datingOverride?.ease ?? row.dating_ease;
  const normalizedEase = normalizeDatingEase(rawEase);
  const womenPortrait = PORTRAIT_AVAILABLE.has(row.slug)
    ? `/women/${row.slug}.png`
    : row.image_url;

  return {
    slug: row.slug,
    name: getCountryDisplayName(row.slug) === row.slug ? row.name : getCountryDisplayName(row.slug),
    region: row.region,
    flagEmoji: row.flag_emoji,
    datingEase: normalizedEase,
    datingEaseScore: datingOverride?.score ?? (DATING_TIER_SCORE[normalizedEase] ?? 50),
    redditPros: row.reddit_pros,
    redditCons: row.reddit_cons,
    avgHeightMale: row.avg_height_male,
    avgHeightFemale: row.avg_height_female,
    gdpPerCapita: row.gdp_per_capita,
    majorityReligion: row.majority_religion,
    imageUrl: row.image_url,
    womenImageUrl: row.women_image_url || womenPortrait,
    receptiveness: getFriendlinessLabelFromScore(getFriendlinessScoreBySlug(row.slug)),
    localValues: meta.localValues,
    englishProficiency: getEnglishProficiencyBySlug(row.slug),
    budgetTier: getBudgetTierFromScore(getAffordabilityScoreBySlug(row.slug)),
    visaEase: meta.visaEase,
    internetSpeed: meta.internetSpeed,
    internetMbps: meta.internetMbps,
    climate: meta.climate,
    hasNightlife: meta.vibe.includes("Great Nightlife"),
    hasBeach: meta.vibe.includes("Beach Access"),
    hasNature: meta.vibe.includes("Nature/Mountains"),
    safetyLevel: getSafetyLevelFromScore(getSafetyScoreBySlug(row.slug)),
    healthcareQuality: meta.healthcareQuality,
    avgBmiMale: getCountryBmi(row.slug)?.male,
    avgBmiFemale: getCountryBmi(row.slug)?.female,
  };
}

export const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; text: string; hex: string }> = {
  "Very Easy":  { label: "Very Easy",  color: "emerald", bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-400", hex: "#059669" },
  "Easy":       { label: "Easy",      color: "lime",    bg: "bg-lime-500",    border: "border-lime-400",    text: "text-lime-400",    hex: "#84cc16" },
  "Normal":     { label: "Normal",    color: "amber",   bg: "bg-amber-500",   border: "border-amber-400",   text: "text-amber-400",   hex: "#f59e0b" },
  "Hard":       { label: "Hard",      color: "orange",  bg: "bg-orange-500",  border: "border-orange-400",  text: "text-orange-400",  hex: "#f97316" },
  "Improbable": { label: "Improbable",color: "red",     bg: "bg-red-600",     border: "border-red-500",     text: "text-red-500",     hex: "#dc2626" },
  "N/A":        { label: "N/A",       color: "zinc",    bg: "bg-zinc-500",    border: "border-zinc-400",   text: "text-zinc-400",    hex: "#71717a" },
};

/**
 * Get a color based on the exact dating score (0-100).
 * Higher scores within each tier get more vibrant/intense colors.
 * Creates a smooth gradient effect across the entire scale.
 *
 * NEW TIER RANGES:
 * - 80+ = Very Easy (emerald green)
 * - 65-80 = Easy (lime green)
 * - 55-65 = Normal (amber)
 * - 50-55 = Possible (orange)
 * - 40-50 = Hard (red-orange)
 * - 40 or under = Improbable (deep red)
 */
export function getScoreColor(score: number): string {
  // Clamp score to 0-100
  const s = Math.max(0, Math.min(100, score));

  // Color gradients for each tier range
  if (s >= 80) {
    // Very Easy: 80-100 - Emerald to bright green
    const intensity = (s - 80) / 20; // 0 to 1
    return interpolateColor("#059669", "#34d399", intensity);
  } else if (s >= 65) {
    // Easy: 65-80 - Lime green to yellow-green
    const intensity = (s - 65) / 15;
    return interpolateColor("#65a30d", "#a3e635", intensity);
  } else if (s >= 55) {
    // Normal: 55-65 - Amber to yellow
    const intensity = (s - 55) / 10;
    return interpolateColor("#d97706", "#fbbf24", intensity);
  } else if (s >= 50) {
    // Possible: 50-55 - Orange to amber-orange
    const intensity = (s - 50) / 5;
    return interpolateColor("#f97316", "#fbbf24", intensity);
  } else if (s >= 40) {
    // Hard: 40-50 - Reddish-orange to orange-red
    const intensity = (s - 40) / 10;
    return interpolateColor("#9f1239", "#ea580c", intensity);
  } else {
    // Improbable: 0-40 - Deep dark red to bright red
    const intensity = s / 40;
    return interpolateColor("#450a0a", "#dc2626", intensity);
  }
}

/**
 * Interpolate between two hex colors.
 * factor 0 = color1, factor 1 = color2
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from("Countries")
    .select("*")
    .order("dating_ease_score", { ascending: false })
    .order("name");

  if (error || !data) {
    console.error("Supabase fetch failed:", error?.message);
    return [];
  }

  return (data as CountryRow[]).map(rowToCountry);
}

export async function getCountryBySlug(slug: string): Promise<Country | undefined> {
  const { data, error } = await supabase
    .from("Countries")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Supabase single fetch failed:", error?.message);
    return undefined;
  }

  return rowToCountry(data as CountryRow);
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("Countries")
    .select("slug");

  if (error || !data) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}
