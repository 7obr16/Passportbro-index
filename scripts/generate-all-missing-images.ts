/**
 * Generate all images that can show as "missing" on the site, using project standards (fal.ai Nano Banana 2).
 * - BMI: public/bmi/us-*.png, public/bmi/country/{slug}-{gender}.png (age 25, ethnicity + BMI, white bg)
 * - Women portrait: public/women/{slug}.png (single portrait, white bg, head-and-shoulders)
 * - Women group: public/women-group/{slug}.png (8 women in a row, white bg)
 * Skips existing unless --force. Run: npx tsx scripts/generate-all-missing-images.ts [--force] [--type bmi|women|women-group|all]
 */

import "dotenv/config";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fal } from "@fal-ai/client";
import { COUNTRY_BMI, US_BMI } from "../lib/bmiData";
import { getCountryDisplayName } from "../lib/countryDisplayNames";
import {
  WOMEN_GROUP_IMAGE,
  getSinglePortraitPrompt,
  getGroupPortraitPrompt,
} from "../lib/womenGroupImages";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "..", ".env.local") });

const ROOT = path.join(__dirname, "..", "public");
const BMI_DIR = path.join(ROOT, "bmi");
const COUNTRY_BMI_DIR = path.join(BMI_DIR, "country");
const WOMEN_DIR = path.join(ROOT, "women");
const WOMEN_GROUP_DIR = path.join(ROOT, "women-group");
const DELAY_MS = 1400;
const BMI_REFERENCE_AGE = 25;

async function downloadToFile(url: string, filePath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
}

async function generateWithPrompt(
  prompt: string,
  outPath: string,
  aspectRatio: "3:4" | "16:9" = "3:4"
): Promise<void> {
  const result = await fal.subscribe("fal-ai/nano-banana-2", {
    input: {
      prompt,
      num_images: 1,
      aspect_ratio: aspectRatio,
      output_format: "png",
      resolution: "1K",
    },
    logs: false,
  });
  const data = result.data as { images: Array<{ url: string }> };
  const imageUrl = data?.images?.[0]?.url;
  if (!imageUrl) throw new Error("No image in result");
  await downloadToFile(imageUrl, outPath);
}

// --- BMI (same standards as generate-bmi-images.ts) ---
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
function bodyShapeInstruction(bmi: number): string {
  if (bmi >= 30)
    return "The body must look clearly obese: substantial weight, rounded abdomen, full figure. Not slim, not athletic, not thin.";
  if (bmi >= 27)
    return "The body must look overweight: visible softness, roundness, clearly not slim or thin. Do not depict a slender or fit body.";
  if (bmi >= 25)
    return "The body must look overweight (BMI 25–30): visible softness, not slim. Do not depict a thin or slender body.";
  if (bmi >= 18.5) return "Body proportionate for that BMI, neither thin nor heavy.";
  return "Body slender and lean for that BMI (underweight).";
}
function buildBmiPrompt(countryName: string, gender: "female" | "male", bmi: number): string {
  const subject = gender === "female" ? "woman" : "man";
  const clothes = gender === "female" ? "sports bra and leggings" : "tank top and shorts";
  const category = bmiCategory(bmi);
  const bodyInstr = bodyShapeInstruction(bmi);
  const bmiStr = bmi.toFixed(1);
  return `A ${countryName} ${subject}, exactly age ${BMI_REFERENCE_AGE}, with body shape that accurately matches BMI ${bmiStr} kg/m² (${category}). ${bodyInstr} The person must visibly look like average BMI ${bmiStr}, not thinner. ${SAME_FORMAT} Wearing simple tight-fitting dark clothes like ${clothes} so the body shape is clearly visible.`;
}

async function runBmi(force: boolean): Promise<{ done: number; skipped: number }> {
  let done = 0;
  let skipped = 0;
  const jobs: { slug: string; gender: "female" | "male"; bmi: number; outPath: string }[] = [];

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
  for (const [slug, data] of Object.entries(COUNTRY_BMI)) {
    if (!data || slug === "usa") continue;
    if (data.female != null)
      jobs.push({
        slug,
        gender: "female",
        bmi: data.female,
        outPath: path.join(COUNTRY_BMI_DIR, `${slug}-female.png`),
      });
    if (data.male != null)
      jobs.push({
        slug,
        gender: "male",
        bmi: data.male,
        outPath: path.join(COUNTRY_BMI_DIR, `${slug}-male.png`),
      });
  }

  for (const { slug, gender, bmi, outPath } of jobs) {
    if (!force && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }
    try {
      const name = slug === "usa" ? "American" : getCountryDisplayName(slug);
      const prompt = buildBmiPrompt(name, gender, bmi);
      await generateWithPrompt(prompt, outPath, "3:4");
      done++;
      console.log(`[BMI] ${path.relative(ROOT, outPath)}`);
    } catch (e) {
      console.error(`[BMI] Failed ${slug}-${gender}:`, e);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  return { done, skipped };
}

// --- Women portrait (single) ---
async function runWomen(force: boolean): Promise<{ done: number; skipped: number }> {
  let done = 0;
  let skipped = 0;
  const slugs = Object.keys(WOMEN_GROUP_IMAGE);

  for (const slug of slugs) {
    const outPath = path.join(WOMEN_DIR, `${slug}.png`);
    if (!force && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }
    const prompt = getSinglePortraitPrompt(slug);
    if (!prompt) continue;
    try {
      await generateWithPrompt(prompt, outPath, "3:4");
      done++;
      console.log(`[Women] ${path.relative(ROOT, outPath)}`);
    } catch (e) {
      console.error(`[Women] Failed ${slug}:`, e);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  return { done, skipped };
}

// --- Women group (8 in a row) ---
async function runWomenGroup(force: boolean): Promise<{ done: number; skipped: number }> {
  let done = 0;
  let skipped = 0;
  const slugs = Object.keys(WOMEN_GROUP_IMAGE);

  for (const slug of slugs) {
    const outPath = path.join(WOMEN_GROUP_DIR, `${slug}.png`);
    if (!force && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }
    const prompt = getGroupPortraitPrompt(slug);
    if (!prompt) continue;
    try {
      await generateWithPrompt(prompt, outPath, "16:9");
      done++;
      console.log(`[Women-group] ${path.relative(ROOT, outPath)}`);
    } catch (e) {
      console.error(`[Women-group] Failed ${slug}:`, e);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  return { done, skipped };
}

async function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const typeArg = argv.find((a) => a.startsWith("--type="));
  const type = typeArg ? typeArg.split("=")[1] : argv.includes("--type") ? argv[argv.indexOf("--type") + 1] : "all";
  const runType = type === "bmi" || type === "women" || type === "women-group" ? type : "all";

  const key = process.env.FAL_KEY;
  if (!key) {
    console.error("Missing FAL_KEY. Add to .env.local or: FAL_KEY=your_key npx tsx scripts/generate-all-missing-images.ts");
    console.error("Get key: https://fal.ai/dashboard/keys");
    process.exit(1);
  }
  fal.config({ credentials: key });

  fs.mkdirSync(BMI_DIR, { recursive: true });
  fs.mkdirSync(COUNTRY_BMI_DIR, { recursive: true });
  fs.mkdirSync(WOMEN_DIR, { recursive: true });
  fs.mkdirSync(WOMEN_GROUP_DIR, { recursive: true });

  let totalDone = 0;
  let totalSkipped = 0;

  if (runType === "all" || runType === "bmi") {
    console.log("\n--- BMI (US ref + country/gender) ---");
    const r = await runBmi(force);
    totalDone += r.done;
    totalSkipped += r.skipped;
  }
  if (runType === "all" || runType === "women") {
    console.log("\n--- Women portrait (single) ---");
    const r = await runWomen(force);
    totalDone += r.done;
    totalSkipped += r.skipped;
  }
  if (runType === "all" || runType === "women-group") {
    console.log("\n--- Women group (8 in a row) ---");
    const r = await runWomenGroup(force);
    totalDone += r.done;
    totalSkipped += r.skipped;
  }

  console.log(`\nDone. Generated: ${totalDone}, skipped (existing): ${totalSkipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
