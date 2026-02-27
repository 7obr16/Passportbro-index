import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "fs";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const files = fs.readdirSync("./public/women").filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const slug = file.replace("women-", "").replace(".png", "");
    const url = `/women/${file}`;
    
    const { error } = await supabase
      .from("Countries")
      .update({ women_image_url: url })
      .eq("slug", slug);
      
    if (error) {
      console.error(`Error updating ${slug}:`, error);
    } else {
      console.log(`Updated ${slug} with ${url}`);
    }
  }
}

main();