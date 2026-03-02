# BMI body comparison images

Same format for every image: **age 25**, **full body** (head to knees), **standing**, **plain white background**, **same camera distance and framing**. Only ethnicity and body shape (by BMI) change.

## Reference (left side in comparison)

- **`us-female.png`** – US typical woman at US average female BMI (~29.3)
- **`us-male.png`** – US typical man at US average male BMI (~29.1)

These two files are the fixed reference shown on the left for every country comparison.

## Per-country (right side)

- **`country/{slug}-female.png`** – Typical woman from that country (ethnicity + country’s average female BMI)
- **`country/{slug}-male.png`** – Typical man from that country (ethnicity + country’s average male BMI)

Example: `country/dominican-republic-female.png` = Dominican woman, body matching that country’s average female BMI (~28.4). Same framing as US ref.

USA does not have files under `country/`; the USA page uses the same US reference image on both sides.

## Generating images

From the project root:

```bash
npm run generate-bmi-images
```

Uses fal.ai Nano Banana 2; requires `FAL_KEY` in `.env.local`. Skips existing files unless you pass `--force`. To generate only specific countries:

```bash
npx tsx scripts/generate-bmi-images.ts dominican-republic thailand
```

To generate only the US reference images:

```bash
npx tsx scripts/generate-bmi-images.ts usa
```

This writes `us-female.png` and `us-male.png` into `public/bmi/`.
