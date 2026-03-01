/**
 * Total Fertility Rate (TFR) — average number of children per woman.
 * Source: World Bank (SP.DYN.TFRT.IN), latest available year 2021–2023.
 * @see https://data.worldbank.org/indicator/SP.DYN.TFRT.IN
 *
 * US reference: 1.62 (2023).
 * Replacement rate: 2.10.
 */

export const US_FERTILITY_RATE = 1.62;
export const REPLACEMENT_RATE  = 2.10;

export const FERTILITY_RATE: Record<string, number> = {
  // Southeast Asia
  philippines:          2.7,
  thailand:             1.3,
  indonesia:            2.2,
  malaysia:             1.7,
  vietnam:              2.0,
  cambodia:             2.5,

  // Africa
  kenya:                3.4,
  nigeria:              5.2,
  uganda:               4.7,
  rwanda:               4.0,
  tanzania:             4.8,
  ethiopia:             4.1,
  "south-africa":       2.3,
  algeria:              2.9,
  libya:                2.2,
  morocco:              2.3,
  egypt:                2.9,

  // Latin America & Caribbean
  bolivia:              2.6,
  colombia:             1.7,
  mexico:               1.8,
  peru:                 2.2,
  venezuela:            2.2,
  "dominican-republic": 2.3,
  "costa-rica":         1.5,
  brazil:               1.7,
  argentina:            2.2,
  chile:                1.5,

  // South / Central Asia
  india:                2.0,
  pakistan:             3.3,
  kazakhstan:           2.8,
  mongolia:             2.7,

  // Middle East
  "saudi-arabia":       2.4,
  iran:                 1.7,
  turkey:               1.9,

  // East Asia
  china:                1.1,
  japan:                1.2,
  "south-korea":        0.7,

  // Eastern Europe / Former Soviet
  russia:               1.5,
  ukraine:              1.2,
  poland:               1.3,
  romania:              1.6,

  // Anglosphere
  usa:                  1.62,
  canada:               1.4,
  australia:            1.6,
  uk:                   1.5,

  // Western Europe
  france:               1.8,
  germany:              1.5,
  spain:                1.2,
  italy:                1.2,
  sweden:               1.5,
  portugal:             1.4,
  netherlands:          1.5,
  belgium:              1.6,
  austria:              1.5,
  switzerland:          1.5,
  luxembourg:           1.4,

  // Nordic
  norway:               1.5,
  denmark:              1.7,
  finland:              1.4,
  ireland:              1.8,
  iceland:              1.7,

  // Southern Europe
  greece:               1.3,
  malta:                1.1,
  cyprus:               1.3,

  // Central Europe
  "czech-republic":     1.8,
  hungary:              1.6,
  slovakia:             1.5,
  slovenia:             1.6,

  // Balkans
  croatia:              1.5,
  serbia:               1.5,
  bulgaria:             1.6,
  montenegro:           1.7,
  "north-macedonia":    1.5,
  albania:              1.6,
  "bosnia-and-herzegovina": 1.3,

  // Baltics
  lithuania:            1.6,
  latvia:               1.5,
  estonia:              1.6,

  // Others
  moldova:              1.6,
};

export function getFertilityRate(slug: string): number {
  return FERTILITY_RATE[slug] ?? US_FERTILITY_RATE;
}

/** Label describing the fertility context */
export function getFertilityLabel(tfr: number): { label: string; color: string } {
  if (tfr >= 4.0)  return { label: "Very High",        color: "text-emerald-400" };
  if (tfr >= 2.5)  return { label: "Above Replacement", color: "text-emerald-300" };
  if (tfr >= 2.1)  return { label: "At Replacement",   color: "text-lime-400"    };
  if (tfr >= 1.5)  return { label: "Below Replacement", color: "text-amber-400"  };
  return              { label: "Very Low",             color: "text-red-400"    };
}
