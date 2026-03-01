import { supabase } from "./supabase";
import { COUNTRY_FILTER_DATA, DEFAULT_COUNTRY_FILTER_META } from "./countryFilterData";
import { getSafetyScoreBySlug, getSafetyLevelFromScore } from "./safetyIndex";
import { getFriendlinessScoreBySlug, getFriendlinessLabelFromScore } from "./friendlinessIndex";
import { getAffordabilityScoreBySlug, getBudgetTierFromScore } from "./affordabilityIndex";
import { getEnglishProficiencyBySlug } from "./englishProficiencyIndex";
import { getCountryBmi } from "./bmiData";
import { getDatingOverride } from "./datingOverrides";
import { getCountryDisplayName } from "./countryDisplayNames";

const CURATED_SLUGS = Object.keys(COUNTRY_FILTER_DATA);

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
  "bosnia-and-herzegovina", "moldova",
]);

/** Canonical dating tiers only. "Possible" is treated as "Normal". */
const DATING_EASE_CANONICAL: Record<string, string> = {
  Possible: "Normal",
  "Normal to hard": "Hard",
  "normal to hard": "Hard",
};

function normalizeDatingEase(ease: string): string {
  return DATING_EASE_CANONICAL[ease] ?? ease;
}

function rowToCountry(row: CountryRow): Country {
  const meta = COUNTRY_FILTER_DATA[row.slug] ?? DEFAULT_COUNTRY_FILTER_META;
  const datingOverride = getDatingOverride(row.slug);
  const rawEase = datingOverride?.ease ?? row.dating_ease;
  const womenPortrait = PORTRAIT_AVAILABLE.has(row.slug)
    ? `/women/${row.slug}.png`
    : row.image_url;

  return {
    slug: row.slug,
    name: getCountryDisplayName(row.slug),
    region: row.region,
    flagEmoji: row.flag_emoji,
    datingEase: normalizeDatingEase(rawEase),
    datingEaseScore: datingOverride?.score ?? row.dating_ease_score,
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
  "Improbable": { label: "Improbable",color: "red",     bg: "bg-red-500",     border: "border-red-400",     text: "text-red-400",     hex: "#dc2626" },
  "N/A":        { label: "N/A",       color: "zinc",    bg: "bg-zinc-500",    border: "border-zinc-400",   text: "text-zinc-400",    hex: "#71717a" },
};

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from("Countries")
    .select("*")
    .in("slug", CURATED_SLUGS)
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
    .select("slug")
    .in("slug", CURATED_SLUGS);

  if (error || !data) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}
