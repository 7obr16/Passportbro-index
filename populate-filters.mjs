import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RECEPTIVENESS = ["High", "Medium", "Low"];
const LOCAL_VALUES = ["Traditional", "Mixed", "Modern"];
const ENGLISH = ["High", "Moderate", "Low"];
const BUDGET = ["<$1k", "$1k-$2k", "$2k-$3k", "$3k+"];
const VISA = ["Visa-Free", "e-Visa", "Difficult"];
const INTERNET = ["Fast", "Moderate", "Slow"];
const CLIMATE = ["Tropical", "Temperate", "Cold"];
const SAFETY = ["Very Safe", "Safe", "Moderate"];
const HEALTHCARE = ["High", "Moderate", "Low"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const { data: countries } = await supabase.from("Countries").select("id");
  if (!countries) return;

  for (const c of countries) {
    const { error } = await supabase
      .from("Countries")
      .update({
        receptiveness: rand(RECEPTIVENESS),
        local_values: rand(LOCAL_VALUES),
        english_proficiency: rand(ENGLISH),
        budget_tier: rand(BUDGET),
        visa_ease: rand(VISA),
        internet_speed: rand(INTERNET),
        climate: rand(CLIMATE),
        has_nightlife: Math.random() > 0.3,
        has_beach: Math.random() > 0.5,
        has_nature: Math.random() > 0.2,
        safety_level: rand(SAFETY),
        healthcare_quality: rand(HEALTHCARE),
      })
      .eq("id", c.id);
      
    if (error) console.error("Error updating:", error.message);
  }
  console.log("Updated filters for all countries");
}

main();