/**
 * Generate BMI body images: one per country per gender (ethnicity + BMI), plus fixed US reference.
 * All images: same format (white background, standing, same distance), age 25.
 * - US reference (left side in comparison): public/bmi/us-female.png, public/bmi/us-male.png
 * - Per country: public/bmi/country/{slug}-{gender}.png
 * Uses fal.ai Nano Banana 2. Skips existing unless --force.
 * Run: npx tsx scripts/generate-bmi-images.ts [--force] [slug1 slug2 ...]
 */

import "dotenv/config";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fal } from "@fal-ai/client";
import { COUNTRY_BMI, US_BMI } from "../lib/bmiData";
import { getCountryDisplayName } from "../lib/countryDisplayNames";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "..", ".env.local") });

const BMI_REFERENCE_AGE = 25;
const BMI_DIR = path.join(__dirname, "..", "public", "bmi");
const COUNTRY_DIR = path.join(BMI_DIR, "country");
const DELAY_MS = 1200;

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal weight";
  if (bmi < 30) return "overweight";
  return "obese";
}

const SAME_FORMAT =
  "Full body, standing straight, front view, plain white background, " +
  "even neutral lighting, same camera distance and framing for every image, " +
  "photorealistic, anthropometric reference style, face not the focus.";

/** Strong wording so the model does not depict a thin body when BMI is overweight/obese. */
function bodyShapeInstruction(bmi: number): string {
  if (bmi >= 30)
    return "The body must look clearly obese: substantial weight, rounded abdomen, full figure. Not slim, not athletic, not thin.";
  if (bmi >= 27)
    return "The body must look overweight: visible softness, roundness, clearly not slim or thin. Do not depict a slender or fit body.";
  if (bmi >= 25)
    return "The body must look overweight (BMI 25–30): visible softness, not slim. Do not depict a thin or slender body.";
  if (bmi >= 18.5)
    return "Body proportionate for that BMI, neither thin nor heavy.";
  return "Body slender and lean for that BMI (underweight).";
}

function buildPrompt(countryName: string, gender: "female" | "male", bmi: number): string {
  const subject = gender === "female" ? "woman" : "man";
  const clothes = gender === "female" ? "sports bra and leggings" : "tank top and shorts";
  const category = bmiCategory(bmi);
  const bodyInstr = bodyShapeInstruction(bmi);
  const bmiStr = bmi.toFixed(1);
  return `A ${countryName} ${subject}, exactly age ${BMI_REFERENCE_AGE}, with body shape that accurately matches BMI ${bmiStr} kg/m² (${category}). ${bodyInstr} The person must visibly look like average BMI ${bmiStr}, not thinner. ${SAME_FORMAT} Wearing simple tight-fitting dark clothes like ${clothes} so the body shape is clearly visible.`;
}

async function downloadToFile(url: string, filePath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
}

async function generateOne(
  slug: string,
  gender: "female" | "male",
  bmi: number,
  outPath: string
): Promise<void> {
  const name = slug === "usa" ? "American" : getCountryDisplayName(slug);
  const prompt = buildPrompt(name, gender, bmi);

  const result = await fal.subscribe("fal-ai/nano-banana-2", {
    input: {
      prompt,
      num_images: 1,
      aspect_ratio: "3:4",
      output_format: "png",
      resolution: "1K",
    },
    logs: false,
  });

  const data = result.data as { images: Array<{ url: string }> };
  const imageUrl = data?.images?.[0]?.url;
  if (!imageUrl) throw new Error(`No image in result for ${slug}-${gender}`);
  await downloadToFile(imageUrl, outPath);
}

type Job = { slug: string; gender: "female" | "male"; bmi: number; outPath: string };

async function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const onlySlugs = argv.filter((a) => !a.startsWith("--"));
  const key = process.env.FAL_KEY;
  if (!key) {
    console.error("Missing FAL_KEY. Add to .env.local or run: FAL_KEY=your_key npm run generate-bmi-images");
    console.error("Get your key at https://fal.ai/dashboard/keys");
    process.exit(1);
  }
  fal.config({ credentials: key });

  fs.mkdirSync(COUNTRY_DIR, { recursive: true });

  const jobs: Job[] = [];

  // 1) US reference images (fixed left-side comparison): public/bmi/us-female.png, us-male.png
  if (!onlySlugs.length || onlySlugs.includes("usa")) {
    if (US_BMI.female != null)
      jobs.push({
        slug: "usa",
        gender: "female",
        bmi: US_BMI.female,
        outPath: path.join(BMI_DIR, "us-female.png"),
      });
    if (US_BMI.male != null)
      jobs.push({
        slug: "usa",
        gender: "male",
        bmi: US_BMI.male,
        outPath: path.join(BMI_DIR, "us-male.png"),
      });
  }

  // 2) Per-country images: public/bmi/country/{slug}-{gender}.png (exclude usa; usa uses us-*.png as ref)
  for (const [slug, data] of Object.entries(COUNTRY_BMI)) {
    if (!data || slug === "usa") continue;
    if (onlySlugs.length && !onlySlugs.includes(slug)) continue;
    if (data.female != null)
      jobs.push({
        slug,
        gender: "female",
        bmi: data.female,
        outPath: path.join(COUNTRY_DIR, `${slug}-female.png`),
      });
    if (data.male != null)
      jobs.push({
        slug,
        gender: "male",
        bmi: data.male,
        outPath: path.join(COUNTRY_DIR, `${slug}-male.png`),
      });
  }

  let done = 0;
  let skipped = 0;
  for (const { slug, gender, bmi, outPath } of jobs) {
    if (!force && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }
    try {
      await generateOne(slug, gender, bmi, outPath);
      done++;
      console.log(`[${done + skipped}/${jobs.length}] ${path.relative(path.join(BMI_DIR, "..", ".."), outPath)}`);
    } catch (e) {
      console.error(`Failed ${slug}-${gender}:`, e);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  console.log(`Done. Generated: ${done}, skipped (existing): ${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
