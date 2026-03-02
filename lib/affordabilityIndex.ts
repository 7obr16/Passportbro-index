/**
 * Estimated monthly cost of living index for a single foreign visitor/expat
 * living comfortably (decent apartment, eating out regularly, entertainment).
 * Based on Numbeo Cost of Living Index 2024–2025 with a ~30% expat buffer
 * applied to countries where tourists typically spend more than locals.
 * Numbeo baseline: New York City = 100. Lower = cheaper.
 * Source: https://www.numbeo.com/cost-of-living/rankings_by_country.jsp
 */
const NUMBEO_COST_INDEX: Record<string, number> = {
  // ── Deep Asia ───────────────────────────────────────────────────────────────
  "philippines": 40,   // ~$1.1k/mo comfortable; bumped slightly for expat premium
  "thailand":    48,   // ~$1.3k/mo (Chiang Mai) to $1.6k (Bangkok)
  "indonesia":   44,   // ~$1.2k/mo; Bali higher, Jakarta mid
  "malaysia":    48,   // ~$1.3k/mo; KL is affordable for expats
  "vietnam":     42,   // ~$1.1k/mo; HCMC / Hanoi
  "cambodia":    40,   // ~$1.0k/mo; Phnom Penh
  "mongolia":    44,   // ~$1.2k/mo; Ulaanbaatar
  "taiwan":      62,   // ~$2.1k/mo; Taipei
  "singapore":   100,  // ~$5k+/mo; global high-cost city state
  "laos":        34,   // ~$900/mo; Vientiane/Luang Prabang
  "sri-lanka":   36,   // ~$1.0k/mo; Colombo + expat buffer
  "japan":       82,   // ~$3.5k/mo; Tokyo — expensive but under $5k comfortably
  "south-korea": 78,   // ~$2.8k/mo; Seoul
  "china":       50,   // ~$1.5k/mo; tier-1 cities higher
  "india":       22,   // ~$600/mo; extremely cheap
  "pakistan":    18,   // ~$500/mo
  // ── SE Africa ───────────────────────────────────────────────────────────────
  "kenya":       28,   // ~$800/mo; Nairobi budget expat life
  "nigeria":     20,   // ~$600/mo
  "uganda":      34,   // ~$900/mo
  "rwanda":      37,   // ~$1.0k/mo; Kigali surprisingly modern
  "tanzania":    38,   // ~$1.0k/mo
  "ethiopia":    44,   // ~$1.1k/mo; Addis Ababa
  "south-africa":45,   // ~$1.3k/mo; Cape Town / Johannesburg
  "mauritius":   62,   // ~$2.0k/mo; resort island premium
  // ── Latin America ───────────────────────────────────────────────────────────
  "bolivia":     37,   // ~$1.0k/mo
  "colombia":    38,   // ~$1.1k/mo; Medellín / Bogotá
  "mexico":      40,   // ~$1.2k/mo; CDMX / Guadalajara
  "peru":        40,   // ~$1.1k/mo; Lima
  "venezuela":   28,   // cheap in USD terms due to economic situation
  "dominican-republic": 50,  // ~$1.5k/mo; tourist areas can be pricier
  "costa-rica":  60,   // ~$2.0k/mo; expat-popular, relatively expensive
  "brazil":      45,   // ~$1.3k/mo; São Paulo / Rio higher
  "argentina":   36,   // ~$1.0k/mo; cheap since economic devaluation
  "chile":       55,   // ~$1.8k/mo; Santiago is priciest in S.America
  "ecuador":     42,
  "paraguay":    36,
  "uruguay":     55,
  "panama":      58,
  "guatemala":   38,
  "cuba":        48,
  "jamaica":     52,
  // ── MENA / Central Asia ─────────────────────────────────────────────────────
  "morocco":     40,   // ~$1.1k/mo
  "egypt":       34,   // ~$900/mo; very cheap post-devaluation
  "algeria":     36,   // ~$1.0k/mo
  "libya":       22,   // ~$600/mo
  "saudi-arabia":55,   // ~$1.8k/mo; no alcohol, but housing/food cheap
  "united-arab-emirates": 75, // Dubai expensive but tax-free salaries
  "iran":        28,   // extremely cheap in USD (sanctions context)
  "turkey":      44,   // ~$1.2k/mo; post-inflation still affordable
  "kazakhstan":  40,   // ~$1.1k/mo; Almaty
  "georgia":     42,   // ~$1.1k/mo; Tbilisi expat favourite
  // ── Eastern Europe / Former Soviet ──────────────────────────────────────────
  "russia":      32,   // ~$900/mo; cheap but access limited
  "ukraine":     30,   // ~$850/mo; war context
  "poland":      48,   // ~$1.4k/mo; Warsaw/Kraków
  "romania":     44,   // ~$1.2k/mo; Bucharest
  "hungary":     44,   // ~$1.2k/mo; Budapest
  "czech-republic": 50, // ~$1.5k/mo; Prague popular with expats
  "bulgaria":    42,   // ~$1.1k/mo
  "serbia":      44,   // ~$1.2k/mo; Belgrade
  "croatia":     55,   // ~$1.8k/mo; coastal areas expensive in summer
  "albania":     44,   // ~$1.2k/mo; underrated budget destination
  "north-macedonia": 44,
  "montenegro":  50,   // ~$1.5k/mo
  "estonia":     60,   // ~$2.0k/mo; Tallinn (most expensive Baltics)
  "lithuania":   55,   // ~$1.8k/mo; Vilnius
  "latvia":      55,   // ~$1.8k/mo; Riga
  "slovenia":    58,   // ~$1.9k/mo; Ljubljana
  "slovakia":    50,   // ~$1.5k/mo; Bratislava
  "bosnia-and-herzegovina": 40,
  "moldova":     38,
  "belarus":     40,
  // ── Western / Northern Europe ────────────────────────────────────────────────
  "portugal":    58,   // ~$2.0k/mo; Lisbon/Porto affordable vs rest of W.Europe
  "spain":       62,   // ~$2.2k/mo; Madrid/Barcelona
  "italy":       65,   // ~$2.5k/mo; Rome/Milan
  "greece":      60,   // ~$2.0k/mo; Athens
  "malta":       65,   // ~$2.3k/mo
  "cyprus":      65,   // ~$2.3k/mo
  "germany":     72,   // ~$3.0k/mo; Berlin, Munich
  "uk":          75,   // ~$3.2k/mo; London especially expensive
  "france":      75,   // ~$3.2k/mo; Paris
  "netherlands": 75,   // ~$3.2k/mo; Amsterdam
  "belgium":     72,   // ~$2.9k/mo
  "austria":     72,   // ~$2.9k/mo; Vienna
  "sweden":      75,   // ~$3.3k/mo
  "finland":     75,   // ~$3.2k/mo
  "ireland":     80,   // ~$3.5k/mo; Dublin very expensive
  "norway":      108,  // ~$5.5k/mo; extremely expensive
  "denmark":     92,   // ~$4.5k/mo
  "luxembourg":  98,   // ~$5.0k/mo
  "switzerland": 120,  // ~$6.0k/mo; most expensive country in Europe
  "iceland":     108,  // ~$5.5k/mo
  // ── Other anglosphere / developed ───────────────────────────────────────────
  "usa":         75,   // ~$3.5k/mo avg; NYC/LA/SF much higher
  "canada":      70,   // ~$3.0k/mo; Toronto/Vancouver pricier
  "australia":   75,   // ~$3.2k/mo; Sydney/Melbourne
};

const COST_INDEX_MIN = 18;
const COST_INDEX_MAX = 90;

/**
 * Convert Numbeo cost index (lower = cheaper) to 0–100 affordability (100 = most affordable).
 */
export function getAffordabilityScoreFromCostIndex(costIndex: number): number {
  const clamped = Math.max(COST_INDEX_MIN, Math.min(COST_INDEX_MAX, costIndex));
  // Affordability = inverse of cost: (max - cost) / (max - min) * 100
  return Math.round(((COST_INDEX_MAX - clamped) / (COST_INDEX_MAX - COST_INDEX_MIN)) * 100);
}

/**
 * Get numeric affordability score (0–100) for a country slug.
 * Uses Numbeo 2024; unknown slugs get default 50.
 */
export function getAffordabilityScoreBySlug(slug: string): number {
  const cost = NUMBEO_COST_INDEX[slug] ?? 50;
  return getAffordabilityScoreFromCostIndex(cost);
}

/**
 * Derive budget tier label from affordability score (0–100, higher = cheaper).
 *
 * Tier → approx Numbeo cost range → realistic comfortable expat monthly spend:
 *  <$1k    score ≥ 86  → cost ≤ 28  → India, Pakistan, Nigeria, Libya
 *  $1k–$2k score 55–85 → cost 29–50 → SE Asia, Latin America budget, E.Europe budget
 *  $2k–$3k score 36–54 → cost 51–67 → Southern/Eastern Europe, China, Mid LatAm
 *  $3k–$5k score  5–35 → cost 68–87 → W.Europe, USA, Canada, Japan, Australia
 *  $5k+    score  < 5  → cost > 87  → Switzerland, Norway, Iceland, Denmark, Luxembourg
 */
export function getBudgetTierFromScore(score: number): string {
  if (score >= 86) return "<$1k";
  if (score >= 55) return "$1k-$2k";
  if (score >= 36) return "$2k-$3k";
  if (score >= 5)  return "$3k-$5k";
  return "$5k+";
}

export { NUMBEO_COST_INDEX };
