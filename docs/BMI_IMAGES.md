# BMI comparison images

The body comparison shows **US typical** (left) vs **country typical** (right). All images use the **same format**: age **25**, full body, standing, plain white background, same distance and framing. Only **ethnicity and body (BMI)** change per image.

## Image set

1. **US reference (2 images)** – used as the left side in every comparison.
   - `public/bmi/us-female.png` – American woman, age 25, BMI 29.3 (US average).
   - `public/bmi/us-male.png` – American man, age 25, BMI 29.1 (US average).

2. **Per-country (2 images per country)** – right side; typical ethnicity and that country’s average BMI.
   - `public/bmi/country/{slug}-female.png`
   - `public/bmi/country/{slug}-male.png`
   - Example: `dominican-republic-female.png` = Dominican woman, age 25, BMI 28.4, same format as US.

**Total:** 2 + (number of countries × 2) images (e.g. ~100 countries → ~202 images).

## Standard (same for every image)

- **Age:** 25
- **Pose:** Full body, standing straight, front view
- **Background:** Plain white
- **Lighting:** Even, neutral
- **Framing:** Same distance and crop
- **Body:** Must match the displayed BMI (e.g. BMI 28 → overweight build, not thin)

## Generating images

1. **Get prompts:**  
   `npx tsx scripts/print-bmi-country-prompts.ts`  
   Prints the US ref prompts first, then every country with slug, gender, BMI and save path.

2. **Generate** with your preferred tool (e.g. Nano Banana Pro 2 in Cursor, or fal.ai). Use the exact same format for every image; only ethnicity and BMI change.

3. **Save** US refs to `public/bmi/us-female.png` and `public/bmi/us-male.png`. Save country images to `public/bmi/country/{slug}-{gender}.png`.

When an image is missing, the UI shows a “missing” placeholder for that side.

## Code

- **Paths:** `lib/bmiData.ts` — `getUsRefImagePath()`, `getBmiCountryImagePath()`, `getAllBmiCountrySlugs()`, `BMI_REFERENCE_AGE`
- **UI:** `components/BodyComparison.tsx` — left: US ref; right: country image; placeholder if load fails
