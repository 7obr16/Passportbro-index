#!/usr/bin/env node
/**
 * Outputs exact prompts to generate BMI reference images.
 * All images: age 25, plain white background, full body standing, same distance/framing.
 * Each image must visually match the BMI number (e.g. BMI 28 = overweight build, not thin).
 * Run: node scripts/bmi-ref-image-prompts.mjs
 * Generate each image with the given prompt and save as public/bmi/ref/<filename>.
 */

const BMI_REFERENCE_AGE = 25;
const BUCKETS = [20, 22, 24, 26, 28, 30, 32];

function bmiCategory(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal weight";
  if (bmi < 30) return "overweight";
  return "obese";
}

/** Same format for every image so all are congruent. */
const SAME_FORMAT =
  "Full body, standing straight, front view, plain white background, " +
  "even neutral lighting, same camera distance and framing for every image, " +
  "photorealistic, anthropometric reference style, face not the focus.";

function buildPrompt(gender, bmiBucket) {
  const subject = gender === "female" ? "woman" : "man";
  const category = bmiCategory(bmiBucket);
  return (
    `A ${subject}, age ${BMI_REFERENCE_AGE}, with body shape and build that clearly corresponds to BMI ${bmiBucket} kg/m² (${category}). ` +
    `The body must look like average BMI ${bmiBucket}, not thinner or heavier. ` +
    SAME_FORMAT
  );
}

const out = [];
for (const gender of ["female", "male"]) {
  for (const bucket of BUCKETS) {
    const filename = `${gender}-${bucket}.png`;
    out.push({
      filename,
      path: `public/bmi/ref/${filename}`,
      gender,
      bmiBucket: bucket,
      prompt: buildPrompt(gender, bucket),
    });
  }
}

console.log(JSON.stringify(out, null, 2));
