import { COUNTRY_BMI, US_BMI } from "../lib/bmiData.ts";
import { getCountryDisplayName } from "../lib/countryDisplayNames.ts";

const BMI_REFERENCE_AGE = 25;

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

function buildPrompt(countryName: string, gender: "female" | "male", bmi: number) {
  const subject = gender === "female" ? "woman" : "man";
  const clothes = gender === "female" ? "sports bra and leggings" : "tank top and shorts";
  const category = bmiCategory(bmi);
  return `A ${countryName} ${subject}, age ${BMI_REFERENCE_AGE}, with body shape and build that clearly corresponds to BMI ${bmi.toFixed(1)} kg/m² (${category}). The body must look like average BMI ${bmi.toFixed(1)}, not thinner or heavier. ${SAME_FORMAT} wearing simple tight-fitting dark clothes like ${clothes} so the body shape is clearly visible.`;
}

function main() {
  console.log("# BMI Image Prompts – Same format for all (white bg, standing, same distance)\n");
  console.log("1) US reference (2 images) – used as left side in every comparison.\n");
  console.log("2) Per-country (2 images per country) – right side; ethnicity + that country's average BMI.\n");

  // --- US reference (fixed left-side image for all comparisons) ---
  console.log("## US reference (save under public/bmi/)\n");
  console.log("- **us-female.png** (BMI " + US_BMI.female.toFixed(1) + "):", buildPrompt("American", "female", US_BMI.female));
  console.log("- **us-male.png** (BMI " + US_BMI.male.toFixed(1) + "):", buildPrompt("American", "male", US_BMI.male));
  console.log("");

  // --- Per-country (one woman + one man per country, same format) ---
  console.log("## Per-country (save under public/bmi/country/{slug}-{gender}.png)\n");
  const allCountries = { ...COUNTRY_BMI };
  const slugs = Object.keys(allCountries).sort();

  for (const slug of slugs) {
    const data = allCountries[slug];
    if (!data) continue;
    const name = slug === "usa" ? "American" : getCountryDisplayName(slug);
    console.log(`## ${name} (${slug})`);
    if (data.female) {
      console.log(`- **Female (BMI ${data.female.toFixed(1)}):**`, buildPrompt(name, "female", data.female));
      console.log(`  Save as: \`public/bmi/country/${slug}-female.png\``);
    }
    if (data.male) {
      console.log(`- **Male (BMI ${data.male.toFixed(1)}):**`, buildPrompt(name, "male", data.male));
      console.log(`  Save as: \`public/bmi/country/${slug}-male.png\``);
    }
    console.log("");
  }

  console.log("Total: 2 US ref + " + (slugs.length * 2) + " country images = " + (2 + slugs.length * 2) + " images.");
}

main();