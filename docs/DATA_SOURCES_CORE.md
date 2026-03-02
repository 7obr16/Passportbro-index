# Core data sources (all countries)

All country core data uses **the same initial sources** so rankings and comparisons are consistent and not confusing.

## Fields and sources

| Field | Source | Notes |
|-------|--------|--------|
| **GDP per capita** | World Bank (current US$, 2022) | Indicator: NY.GDP.PCAP.CD |
| **Average height (M/F)** | NCD-RisC / national statistics | Mean height by country and sex |
| **Majority religion** | CIA World Factbook | Primary religion / non-religious |
| **Reddit pros/cons** | Community-curated | Same tone and format across countries |

## European countries (newly added)

- **Core data** (reddit_pros, reddit_cons, avg_height_male, avg_height_female, gdp_per_capita, majority_religion) is in:
  - `scripts/european-core-data.json` (single source of truth for content)
  - `supabase/seed-european-core-data.sql` (same data, run in Supabase to update DB)
- **Apply to Supabase**: run `seed-european-core-data.sql` in SQL Editor, or run `node scripts/update-european-core-data.mjs` (reads JSON, updates by slug).

## Other indexes (same sources app-wide)

- **Safety**: Global Peace Index (GPI) — `lib/safetyIndex.ts`
- **Affordability**: Numbeo Cost of Living — `lib/affordabilityIndex.ts`
- **Friendly/receptiveness**: Gallup Migrant Acceptance — `lib/friendlinessIndex.ts`
- **BMI**: WHO / NCD-RisC — `lib/bmiData.ts`
- **Population/age**: UN World Population Prospects — `lib/populationDemographics.ts`
- **English**: EF English Proficiency Index — `lib/englishProficiencyIndex.ts`

All countries (including European) have entries in these libs so every country is **100% complete** for dashboard, leaderboard, and Stats & Comparisons.
