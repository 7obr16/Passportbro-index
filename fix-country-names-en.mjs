import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const ENGLISH_NAMES_BY_SLUG = {
  "philippines": "Philippines",
  "thailand": "Thailand",
  "indonesia": "Indonesia",
  "malaysia": "Malaysia",
  "vietnam": "Vietnam",
  "cambodia": "Cambodia",
  "kenya": "Kenya",
  "nigeria": "Nigeria",
  "uganda": "Uganda",
  "rwanda": "Rwanda",
  "tanzania": "Tanzania",
  "ethiopia": "Ethiopia",
  "bolivia": "Bolivia",
  "colombia": "Colombia",
  "mexico": "Mexico",
  "peru": "Peru",
  "venezuela": "Venezuela",
  "dominican-republic": "Dominican Republic",
  "costa-rica": "Costa Rica",
  "india": "India",
  "pakistan": "Pakistan",
  "morocco": "Morocco",
  "brazil": "Brazil",
  "argentina": "Argentina",
  "chile": "Chile",
  "china": "China",
  "mongolia": "Mongolia",
  "south-africa": "South Africa",
  "russia": "Russia",
  "ukraine": "Ukraine",
  "poland": "Poland",
  "romania": "Romania",
  "turkey": "Turkey",
  "kazakhstan": "Kazakhstan",
  "algeria": "Algeria",
  "libya": "Libya",
  "usa": "United States",
  "canada": "Canada",
  "australia": "Australia",
  "uk": "United Kingdom",
  "france": "France",
  "germany": "Germany",
  "spain": "Spain",
  "italy": "Italy",
  "sweden": "Sweden",
  "japan": "Japan",
  "south-korea": "South Korea",
  "saudi-arabia": "Saudi Arabia",
  "egypt": "Egypt",
  "iran": "Iran",
};

async function run() {
  for (const [slug, name] of Object.entries(ENGLISH_NAMES_BY_SLUG)) {
    const { error } = await supabase.from("Countries").update({ name }).eq("slug", slug);
    if (error) {
      console.error(`Failed updating ${slug}:`, error.message);
    }
  }
  console.log("Country names updated to English.");
}

run();
