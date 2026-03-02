# BMI reference images (age 25, same format)

Place here the 14 reference images so the body comparison matches each country’s average BMI.

**Files needed:** `female-20.png`, `female-22.png`, `female-24.png`, `female-26.png`, `female-28.png`, `female-30.png`, `female-32.png`, and the same for `male-*`.

**How to generate:** See [docs/BMI_IMAGES.md](../../docs/BMI_IMAGES.md) and run `node scripts/bmi-ref-image-prompts.mjs` for the exact prompt for each file.

Until these exist, the app falls back to legacy US/country images where available.
