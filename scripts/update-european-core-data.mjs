/**
 * Updates Supabase Countries with complete core data for European countries.
 * Data source: scripts/european-core-data.json (same as supabase/seed-european-core-data.sql).
 * Sources: GDP = World Bank (current US$, 2022). Height = NCD-RisC. Religion = CIA Factbook. Pros/cons = community-curated.
 * Run: node scripts/update-european-core-data.mjs (requires .env.local with Supabase keys)
 * Alternative: run supabase/seed-european-core-data.sql in Supabase SQL Editor for same result.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const dataPath = path.join(__dirname, "european-core-data.json");
const raw = fs.readFileSync(dataPath, "utf8");
const data = JSON.parse(raw);

// Remove _sources key
const slugs = Object.keys(data).filter((k) => !k.startsWith("_"));

async function run() {
  console.log(`Updating core data for ${slugs.length} countries...`);
  let ok = 0;
  let err = 0;
  for (const slug of slugs) {
    const row = data[slug];
    const update = {
      reddit_pros: row.reddit_pros ?? "",
      reddit_cons: row.reddit_cons ?? "",
      avg_height_male: row.avg_height_male ?? "",
      avg_height_female: row.avg_height_female ?? "",
      gdp_per_capita: row.gdp_per_capita ?? "",
      majority_religion: row.majority_religion ?? "",
    };
    const { error } = await supabase.from("Countries").update(update).eq("slug", slug);
    if (error) {
      console.error(slug, error.message);
      err++;
    } else {
      ok++;
    }
  }
  console.log(`Done. Updated: ${ok}, errors: ${err}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
