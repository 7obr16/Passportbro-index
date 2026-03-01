/**
 * Print standardized image prompts for Nano Banana Pro 2 (or any text-to-image tool).
 * Same format as existing country images: single portrait (white bg) + 8-women group.
 *
 * Usage: npx tsx scripts/print-image-prompts.ts
 *        npx tsx scripts/print-image-prompts.ts --europe  (only new European countries)
 *
 * Save outputs as: public/women/{slug}.png (single), public/women-group/{slug}.png (group).
 */

import {
  getSinglePortraitPrompt,
  getGroupPortraitPrompt,
  WOMEN_GROUP_IMAGE,
} from "../lib/womenGroupImages";

const EUROPEAN_SLUGS = [
  "portugal", "netherlands", "belgium", "austria", "switzerland", "norway",
  "denmark", "finland", "ireland", "greece", "czech-republic", "hungary",
  "croatia", "serbia", "bulgaria", "slovakia", "lithuania", "latvia", "estonia",
  "slovenia", "luxembourg", "malta", "cyprus", "iceland", "montenegro",
  "north-macedonia", "albania", "bosnia-and-herzegovina", "moldova",
] as const;

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function main() {
  const onlyEurope = process.argv.includes("--europe");
  const slugs = onlyEurope
    ? [...EUROPEAN_SLUGS]
    : Object.keys(WOMEN_GROUP_IMAGE).sort();

  console.log("# Image prompts — same format as existing (Nano Banana Pro 2)\n");
  console.log("- **Single:** `public/women/{slug}.png`");
  console.log("- **Group:** `public/women-group/{slug}.png`\n");

  for (const slug of slugs) {
    const single = getSinglePortraitPrompt(slug);
    const group = getGroupPortraitPrompt(slug);
    if (!single || !group) continue;

    const label = slugToLabel(slug);
    console.log(`## ${label} (${slug})`);
    console.log("- **Single:**", single);
    console.log("- **Group:**", group);
    console.log("");
  }

  console.log("---");
  console.log("Slugs for this run:", slugs.join(", "));
}

main();
