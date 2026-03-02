# BMI images – generate in Cursor with Nano Banana Pro

Use **Cursor’s image generator (Nano Banana Pro)** with the prompts below. Save each image as `public/bmi/country/{slug}-{gender}.png`.

**Format for every image:** Age 25, full body, standing, front view, plain white background, same distance/framing. Body shape must match the BMI (overweight = visible softness, not thin).

---

## USA (already generated)
- `usa-female.png` – BMI 29.3
- `usa-male.png` – BMI 29.1

## Dominican Republic (already generated)
- `dominican-republic-female.png` – BMI 28.4
- `dominican-republic-male.png` – BMI 26.8

---

## Remaining countries

For each row, generate one image with the given description, then save as `public/bmi/country/{slug}-{gender}.png`.

| Slug | Gender | BMI | Save as | Prompt |
|------|--------|-----|---------|--------|
| philippines | female | 24.1 | philippines-female.png | A Philippines woman, exactly age 25, with body shape that accurately matches BMI 24.1 kg/m² (normal weight). Body must look normal weight for that BMI: proportionate, neither thin nor heavy. Full body, standing straight, front view, plain white background, even neutral lighting, same camera distance and framing, photorealistic, anthropometric reference style, face not the focus. Wearing simple tight-fitting dark sports bra and leggings so body shape is clearly visible. |
| philippines | male | 23.5 | philippines-male.png | A Philippines man, exactly age 25, with body shape that accurately matches BMI 23.5 kg/m² (normal weight). Body must look normal weight for that BMI: proportionate, neither thin nor heavy. Full body, standing straight, front view, plain white background, even neutral lighting, same camera distance and framing, photorealistic, anthropometric reference style, face not the focus. Wearing simple tight-fitting dark tank top and shorts so body shape is clearly visible. |
| thailand | female | 25.2 | thailand-female.png | A Thailand woman, exactly age 25, with body shape that accurately matches BMI 25.2 kg/m² (overweight). Body must look clearly overweight: visible softness, some roundness, not slim or thin. Full body, standing straight, front view, plain white background, even neutral lighting, same camera distance and framing, photorealistic, anthropometric reference style, face not the focus. Wearing simple tight-fitting dark sports bra and leggings so body shape is clearly visible. |
| thailand | male | 24.0 | thailand-male.png | A Thailand man, exactly age 25, with body shape that accurately matches BMI 24.0 kg/m² (normal weight). Body must look normal weight for that BMI: proportionate, neither thin nor heavy. Full body, standing straight, front view, plain white background, even neutral lighting, same camera distance and framing, photorealistic, anthropometric reference style, face not the focus. Wearing simple tight-fitting dark tank top and shorts so body shape is clearly visible. |

*(Full list can be printed with: `npx tsx scripts/print-bmi-cursor-prompts.ts`)*
