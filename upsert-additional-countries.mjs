import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADDITIONAL = [
  ["portugal", "Portugal", "Europe"],
  ["taiwan", "Taiwan", "East Asia"],
  ["panama", "Panama", "Central America"],
  ["hungary", "Hungary", "Europe"],
  ["czech-republic", "Czech Republic", "Europe"],
  ["bulgaria", "Bulgaria", "Europe"],
  ["serbia", "Serbia", "Europe"],
  ["croatia", "Croatia", "Europe"],
  ["georgia", "Georgia", "Europe / Asia"],
  ["estonia", "Estonia", "Europe"],
  ["greece", "Greece", "Europe"],
  ["united-arab-emirates", "United Arab Emirates", "Middle East"],
  ["mauritius", "Mauritius", "Africa"],
  ["cyprus", "Cyprus", "Europe"],
  ["malta", "Malta", "Europe"],
  ["montenegro", "Montenegro", "Europe"],
  ["albania", "Albania", "Europe"],
  ["north-macedonia", "North Macedonia", "Europe"],
  ["sri-lanka", "Sri Lanka", "South Asia"],
  ["laos", "Laos", "Southeast Asia"],
  ["ecuador", "Ecuador", "South America"],
  ["guatemala", "Guatemala", "Central America"],
  ["paraguay", "Paraguay", "South America"],
  ["uruguay", "Uruguay", "South America"],
];

const rows = ADDITIONAL.map(([slug, name, region]) => ({
  slug,
  name,
  region,
  dating_ease: "Normal",
  dating_ease_score: 55,
  reddit_pros: "Community data currently being expanded.",
  reddit_cons: "Community data currently being expanded.",
  avg_height_male: "N/A",
  avg_height_female: "N/A",
  gdp_per_capita: "N/A",
  majority_religion: "N/A",
  image_url: `https://picsum.photos/seed/${slug}-country/1200/800`,
  flag_emoji: "",
}));

const { error } = await supabase.from("Countries").upsert(rows, { onConflict: "slug" });

if (error) {
  console.error("Upsert failed:", error.message);
  process.exit(1);
}

console.log(`Upserted ${rows.length} additional countries.`);
