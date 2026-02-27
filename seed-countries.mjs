import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COUNTRIES = [
  ["philippines", "Philippines", "Southeast Asia", "Very Easy"],
  ["thailand", "Thailand", "Southeast Asia", "Very Easy"],
  ["indonesia", "Indonesia", "Southeast Asia", "Very Easy"],
  ["malaysia", "Malaysia", "Southeast Asia", "Very Easy"],
  ["vietnam", "Vietnam", "Southeast Asia", "Very Easy"],
  ["cambodia", "Cambodia", "Southeast Asia", "Very Easy"],
  ["kenya", "Kenya", "Africa", "Very Easy"],
  ["nigeria", "Nigeria", "Africa", "Very Easy"],
  ["uganda", "Uganda", "Africa", "Very Easy"],
  ["rwanda", "Rwanda", "Africa", "Very Easy"],
  ["tanzania", "Tanzania", "Africa", "Very Easy"],
  ["ethiopia", "Ethiopia", "Africa", "Very Easy"],
  ["bolivia", "Bolivia", "South America", "Very Easy"],
  ["colombia", "Colombia", "South America", "Very Easy"],
  ["mexico", "Mexico", "North America", "Very Easy"],
  ["peru", "Peru", "South America", "Very Easy"],
  ["venezuela", "Venezuela", "South America", "Very Easy"],
  ["dominican-republic", "Dominican Republic", "Caribbean", "Very Easy"],
  ["costa-rica", "Costa Rica", "Central America", "Very Easy"],
  ["india", "India", "South Asia", "Very Easy"],
  ["pakistan", "Pakistan", "South Asia", "Very Easy"],
  ["morocco", "Morocco", "North Africa", "Very Easy"],
  ["brazil", "Brazil", "South America", "Easy"],
  ["argentina", "Argentina", "South America", "Easy"],
  ["chile", "Chile", "South America", "Easy"],
  ["china", "China", "East Asia", "Easy"],
  ["mongolia", "Mongolia", "Central Asia", "Easy"],
  ["south-africa", "South Africa", "Africa", "Easy"],
  ["russia", "Russia", "Europe / Asia", "Easy"],
  ["ukraine", "Ukraine", "Europe", "Easy"],
  ["poland", "Poland", "Europe", "Easy"],
  ["romania", "Romania", "Europe", "Easy"],
  ["turkey", "Turkey", "Europe / Asia", "Easy"],
  ["kazakhstan", "Kazakhstan", "Central Asia", "Easy"],
  ["algeria", "Algeria", "North Africa", "Easy"],
  ["libya", "Libya", "North Africa", "Easy"],
  ["usa", "United States", "North America", "Normal"],
  ["canada", "Canada", "North America", "Normal"],
  ["australia", "Australia", "Oceania", "Normal"],
  ["uk", "United Kingdom", "Europe", "Normal"],
  ["france", "France", "Europe", "Normal"],
  ["germany", "Germany", "Europe", "Normal"],
  ["spain", "Spain", "Europe", "Normal"],
  ["italy", "Italy", "Europe", "Normal"],
  ["sweden", "Sweden", "Europe", "Hard"],
  ["japan", "Japan", "East Asia", "Hard"],
  ["south-korea", "South Korea", "East Asia", "Hard"],
  ["saudi-arabia", "Saudi Arabia", "Middle East", "Hard"],
  ["egypt", "Egypt", "North Africa", "Normal"],
  ["iran", "Iran", "Middle East", "Improbable"],
];

const SCORE = {
  "Very Easy": 90,
  Easy: 75,
  Normal: 55,
  Hard: 35,
  Improbable: 20,
};

const rows = COUNTRIES.map(([slug, name, region, datingEase]) => ({
  slug,
  name,
  region,
  dating_ease: datingEase,
  dating_ease_score: SCORE[datingEase],
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
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} countries.`);
