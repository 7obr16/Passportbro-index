/**
 * Print BMI image prompts for generating in Cursor with Nano Banana Pro.
 * No API key needed. Copy each prompt into Cursor's image generator, then save
 * the image to public/bmi/country/{slug}-{gender}.png
 *
 * Run: npx tsx scripts/print-bmi-cursor-prompts.ts
 * Optional: pass slugs to limit (e.g. npx tsx scripts/print-bmi-cursor-prompts.ts costa-rica mexico)
 */

import { COUNTRY_BMI, US_BMI } from "../lib/bmiData";
import { getCountryDisplayName } from "../lib/countryDisplayNames";

const AGE = 25;

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal weight";
  if (bmi < 30) return "overweight";
  return "obese";
}

function bodyShapeInstruction(bmi: number): string {
  if (bmi >= 30)
    return "Body must look clearly obese (BMI 30+): substantial weight, rounded abdomen, full figure. Do not depict a slim or athletic body.";
  if (bmi >= 25)
    return "Body must look clearly overweight (BMI 25–30): visible softness, some roundness, not slim or thin. Do not depict a slender body.";
  if (bmi >= 18.5)
    return "Body must look normal weight for that BMI: proportionate, neither thin nor heavy.";
  return "Body must look underweight for that BMI: slender, lean build.";
}

const SAME_FORMAT =
  "Full body, standing straight, front view, plain white background, even neutral lighting, same camera distance and framing, photorealistic, anthropometric reference style, face not the focus.";

function buildPrompt(countryName: string, gender: "female" | "male", bmi: number): string {
  const subject = gender === "female" ? "woman" : "man";
  const clothes = gender === "female" ? "sports bra and leggings" : "tank top and shorts";
  const category = bmiCategory(bmi);
  const bodyInstr = bodyShapeInstruction(bmi);
  return `A ${countryName} ${subject}, exactly age ${AGE}, with body shape that accurately matches BMI ${bmi.toFixed(1)} kg/m² (${category}). ${bodyInstr} ${SAME_FORMAT} Wearing simple tight-fitting dark ${clothes} so body shape is clearly visible.`;
}

const entries = { ...COUNTRY_BMI, usa: US_BMI };
const onlySlugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

console.log("# BMI prompts for Nano Banana Pro (Cursor)\n");
console.log("Save each image as: public/bmi/country/{slug}-{gender}.png\n");
console.log("---\n");

for (const [slug, data] of Object.entries(entries)) {
  if (!data) continue;
  if (onlySlugs.length && !onlySlugs.includes(slug)) continue;
  const name = slug === "usa" ? "American" : getCountryDisplayName(slug);
  for (const gender of ["female", "male"] as const) {
    const bmi = gender === "female" ? data.female : data.male;
    if (bmi == null) continue;
    const prompt = buildPrompt(name, gender, bmi);
    const filename = `${slug}-${gender}.png`;
    console.log(`## ${filename} (BMI ${bmi.toFixed(1)})\n");
    console.log(`${prompt}\n`);
    console.log(`Save as: \`public/bmi/country/${filename}\`\n`);
  }
}
