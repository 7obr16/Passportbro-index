import * as cheerio from 'cheerio';
import fs from 'fs';
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COUNTRIES = [
  "philippines", "thailand", "indonesia", "malaysia", "vietnam", "cambodia", "kenya", "nigeria",
  "uganda", "rwanda", "tanzania", "ethiopia", "bolivia", "colombia", "mexico", "peru",
  "venezuela", "dominican-republic", "costa-rica", "india", "pakistan", "morocco", "brazil",
  "argentina", "chile", "china", "mongolia", "south-africa", "russia", "ukraine", "poland",
  "romania", "turkey", "kazakhstan", "algeria", "libya", "usa", "canada", "australia", "uk",
  "france", "germany", "spain", "italy", "sweden", "japan", "south-korea", "saudi-arabia",
  "egypt", "iran"
];

async function searchUnsplash(query, count = 1) {
  try {
    const res = await fetch('https://unsplash.com/s/photos/' + encodeURIComponent(query));
    const html = await res.text();
    const $ = cheerio.load(html);
    const images = [];
    $('img[src^="https://images.unsplash.com/photo-"]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('profile') && !src.includes('premium')) {
        const cleanSrc = src.split('?')[0] + '?auto=format&fit=crop&w=1600&q=80';
        if (!images.includes(cleanSrc)) {
          images.push(cleanSrc);
        }
        if (images.length >= count) {
          return false; // break
        }
      }
    });
    return count === 1 ? (images[0] || null) : images;
  } catch (e) {
    console.error("Failed to fetch for", query, e.message);
    return count === 1 ? null : [];
  }
}

async function run() {
  const galleryData = {};

  for (const slug of COUNTRIES) {
    console.log("Fetching images for", slug);
    const name = slug.replace('-', ' ');
    
    const main = await searchUnsplash(`${name} landscape`, 1);
    const city = await searchUnsplash(`${name} city skyline`, 6);
    const nature = await searchUnsplash(`${name} nature`, 6);
    const people = await searchUnsplash(`${name} street culture`, 6);
    const lifestyle = await searchUnsplash(`${name} travel lifestyle`, 6);

    // Update main image in DB
    if (main) {
      await supabase.from("Countries").update({ image_url: main }).eq("slug", slug);
    }

    galleryData[slug] = {
      city: city.length ? city : (main ? [main] : []),
      nature: nature.length ? nature : (main ? [main] : []),
      people: people.length ? people : (main ? [main] : []),
      lifestyle: lifestyle.length ? lifestyle : (main ? [main] : []),
    };
    
    // Sleep to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  const fileOutput = `// Auto-generated high-quality Unsplash image URLs
export type CountryGalleryEntry = {
  city: string | string[];
  nature: string | string[];
  people: string | string[];
  lifestyle: string | string[];
};

export const COUNTRY_GALLERY: Record<string, CountryGalleryEntry> = ${JSON.stringify(galleryData, null, 2)};
`;

  fs.writeFileSync("./lib/countryImages.ts", fileOutput);
  console.log("Done fetching images!");
}

run();