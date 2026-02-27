import { supabase } from "./supabase";

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
  climate: string;
  hasNightlife: boolean;
  hasBeach: boolean;
  hasNature: boolean;
  safetyLevel: string;
  healthcareQuality: string;
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
  receptiveness: string;
  local_values: string;
  english_proficiency: string;
  budget_tier: string;
  visa_ease: string;
  internet_speed: string;
  climate: string;
  has_nightlife: boolean;
  has_beach: boolean;
  has_nature: boolean;
  safety_level: string;
  healthcare_quality: string;
};

function rowToCountry(row: CountryRow): Country {
  return {
    slug: row.slug,
    name: row.name,
    region: row.region,
    flagEmoji: row.flag_emoji,
    datingEase: row.dating_ease,
    datingEaseScore: row.dating_ease_score,
    redditPros: row.reddit_pros,
    redditCons: row.reddit_cons,
    avgHeightMale: row.avg_height_male,
    avgHeightFemale: row.avg_height_female,
    gdpPerCapita: row.gdp_per_capita,
    majorityReligion: row.majority_religion,
    imageUrl: row.image_url,
    womenImageUrl: row.women_image_url || "",
    receptiveness: row.receptiveness || "Medium",
    localValues: row.local_values || "Mixed",
    englishProficiency: row.english_proficiency || "Moderate",
    budgetTier: row.budget_tier || "$1k-$2k",
    visaEase: row.visa_ease || "Visa-Free",
    internetSpeed: row.internet_speed || "Moderate",
    climate: row.climate || "Temperate",
    hasNightlife: row.has_nightlife || false,
    hasBeach: row.has_beach || false,
    hasNature: row.has_nature || false,
    safetyLevel: row.safety_level || "Safe",
    healthcareQuality: row.healthcare_quality || "Moderate",
  };
}

export const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; text: string }> = {
  "Very Easy": { label: "Very Easy", color: "emerald", bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-400" },
  "Easy":      { label: "Easy",      color: "lime",    bg: "bg-lime-500",    border: "border-lime-400",    text: "text-lime-400" },
  "Normal":    { label: "Normal",    color: "amber",   bg: "bg-amber-500",   border: "border-amber-400",   text: "text-amber-400" },
  "Hard":      { label: "Hard",      color: "orange",  bg: "bg-orange-500",  border: "border-orange-400",  text: "text-orange-400" },
  "Improbable":{ label: "Improbable",color: "red",     bg: "bg-red-500",     border: "border-red-400",     text: "text-red-400" },
};

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
