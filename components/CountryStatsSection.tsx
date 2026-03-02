"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, DollarSign, Ruler, Globe2,
  Baby, Calendar, Layers, Users, ChevronDown,
} from "lucide-react";
import type { Country } from "@/lib/countries";
import { getPopulationPyramid } from "@/lib/populationDemographics";
import { getCitySexRatio } from "@/lib/citySexRatio";
import { getCitiesForCountry } from "@/lib/citiesPrimeAge";
import CitiesPrimeAgeMap from "@/components/CitiesPrimeAgeMap";
import { getMedianAgeBySlug, getEthnicHomogeneityBySlug, getHomogeneityLabel, WORLD_MEDIAN_AGE } from "@/lib/demographicsIndex";
import { getFriendlinessScoreBySlug, getFriendlinessDisplay, hasInterNationsFriendlinessData } from "@/lib/friendlinessIndex";
import { getFertilityRate, getFertilityLabel, US_FERTILITY_RATE, REPLACEMENT_RATE } from "@/lib/fertilityData";
import SourceLink from "@/components/SourceLink";
import BodyComparison from "@/components/BodyComparison";

// ─── Constants ────────────────────────────────────────────────────────────────
type TabId = "population" | "economy" | "physical" | "society";
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "population", label: "Population",  icon: BarChart3  },
  { id: "economy",    label: "Economy",     icon: DollarSign },
  { id: "physical",   label: "Physical",    icon: Ruler      },
  { id: "society",    label: "Society",     icon: Globe2     },
];

// World Bank global GDP per capita average ~$13,200 (2022)
const WORLD_AVG_GDP = 13200;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseH = (h: string): number | null => {
  if (!h) return null;
  const m = h.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return v < 3 ? v * 100 : v;
};

const parseGdp = (g: string): number | null => {
  const n = parseInt((g || "0").replace(/[^0-9]/g, ""), 10) || 0;
  return n > 0 ? n : null;
};

const fmtGdp = (n: number): string =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

// ─── Population pyramid helpers ───────────────────────────────────────────────
const DERIVED_BANDS = ["0-14", "15-24", "25-39", "40-54", "55-64", "65+"] as const;
type DerivedBand = (typeof DERIVED_BANDS)[number];
const DATING_BANDS = new Set<DerivedBand>(["25-39"]);

type BandRow = { band: DerivedBand; malePct: number; femalePct: number };

/** Female vs male ratio in this age group. Positive = more females (good); negative = more males (bad). */
function getRatioSeverity(malePct: number, femalePct: number): {
  label: string;
  isFavorable: boolean;
  className: string;
} {
  const diff = femalePct - malePct; // positive = more women
  const abs = Math.abs(diff);
  if (abs < 0.3) {
    return { label: "Balanced", isFavorable: true, className: "text-zinc-400" };
  }
  if (diff > 0) {
    // More females than males — favorable
    if (abs >= 3) return { label: "Highly favorable ♀", isFavorable: true, className: "text-emerald-400" };
    if (abs >= 1.5) return { label: "Very favorable ♀", isFavorable: true, className: "text-emerald-500/90" };
    if (abs >= 0.5) return { label: "Favorable ♀", isFavorable: true, className: "text-lime-500/90" };
    return { label: "Slightly favorable ♀", isFavorable: true, className: "text-lime-600/80" };
  }
  // More males than females — unfavorable
  if (abs >= 4) return { label: "Severely unfavorable", isFavorable: false, className: "text-red-400" };
  if (abs >= 2.5) return { label: "Very unfavorable", isFavorable: false, className: "text-orange-400" };
  if (abs >= 1) return { label: "Unfavorable", isFavorable: false, className: "text-amber-400" };
  return { label: "Slightly unfavorable", isFavorable: false, className: "text-amber-500/80" };
}

function deriveBands(raw: { band: string; malePct: number; femalePct: number }[]): BandRow[] {
  const g = (band: string) => raw.find((r) => r.band === band) ?? { malePct: 0, femalePct: 0 };
  const b = g("25-54");
  return [
    { band: "0-14",  malePct: g("0-14").malePct,  femalePct: g("0-14").femalePct  },
    { band: "15-24", malePct: g("15-24").malePct, femalePct: g("15-24").femalePct },
    { band: "25-39", malePct: b.malePct  * 0.52,  femalePct: b.femalePct  * 0.52  },
    { band: "40-54", malePct: b.malePct  * 0.48,  femalePct: b.femalePct  * 0.48  },
    { band: "55-64", malePct: g("55-64").malePct, femalePct: g("55-64").femalePct },
    { band: "65+",   malePct: g("65+").malePct,   femalePct: g("65+").femalePct   },
  ];
}

// ─── TAB: Population ─────────────────────────────────────────────────────────
function PopulationTab({ country, compare }: { country: Country; compare: Country | null }) {
  const cityRatio = getCitySexRatio(country.slug);
  const pyrA = useMemo(() => deriveBands(getPopulationPyramid(country.slug)), [country.slug]);
  const pyrB = useMemo(
    () => (compare ? deriveBands(getPopulationPyramid(compare.slug)) : null),
    [compare]
  );

  const maxVal = useMemo(() => {
    let max = 0;
    for (const b of pyrA) { max = Math.max(max, b.malePct, b.femalePct); }
    if (pyrB) for (const b of pyrB) { max = Math.max(max, b.malePct, b.femalePct); }
    return Math.ceil((max + 1) / 2) * 2;
  }, [pyrA, pyrB]);

  const hasCompare = pyrB !== null && compare !== null;
  const gridCols = "grid-cols-[1fr_3.5rem_1fr]";

  return (
    <div className="px-4 py-6 sm:px-6">

      {/* Legend */}
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {/* Main country */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="h-2 w-10 rounded-sm bg-sky-500" />
            <div className="h-2 w-10 rounded-sm bg-pink-500" />
          </div>
          <div className="leading-none">
            <div className="text-[10px] text-sky-400">♂ Male</div>
            <div className="text-[10px] text-pink-400">♀ Female</div>
          </div>
          <span className="ml-1 text-xs font-bold text-zinc-200">{country.name}</span>
        </div>

        {/* Compare country */}
        {hasCompare && compare && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="h-2 w-10 rounded-sm bg-teal-500" />
              <div className="h-2 w-10 rounded-sm bg-amber-500" />
            </div>
            <div className="leading-none">
              <div className="text-[10px] text-teal-400">♂ Male</div>
              <div className="text-[10px] text-amber-400">♀ Female</div>
            </div>
            <span className="ml-1 text-xs font-bold text-zinc-400">{compare.name}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.07] px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] font-semibold text-amber-300">20–39 Prime Dating Window</span>
        </div>
      </div>

      {/* Column headers */}
      <div className={`mb-1.5 grid ${gridCols} items-center`}>
        <div className="text-right pr-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">♂ Male</span>
        </div>
        <div className="text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Age</span>
        </div>
        <div className="pl-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-pink-400">Female ♀</span>
        </div>
      </div>

      {/* Pyramid rows */}
      <div className="flex flex-col gap-1.5">
        {[...DERIVED_BANDS].reverse().map((band, i) => {
          const rowA     = pyrA.find((p) => p.band === band)!;
          const rowB     = pyrB?.find((p) => p.band === band);
          const isDating = DATING_BANDS.has(band);

          const mPct  = (rowA.malePct   / maxVal) * 100;
          const fPct  = (rowA.femalePct / maxVal) * 100;
          const bMPct = rowB ? (rowB.malePct   / maxVal) * 100 : 0;
          const bFPct = rowB ? (rowB.femalePct / maxVal) * 100 : 0;
          const ratio = getRatioSeverity(rowA.malePct, rowA.femalePct);

          return (
            <div
              key={band}
              className={`grid ${gridCols} items-center rounded-xl px-1.5 py-1.5 transition-colors ${
                isDating
                  ? "bg-amber-400/[0.07] ring-1 ring-inset ring-amber-400/25"
                  : "bg-zinc-900/30 hover:bg-zinc-900/50"
              }`}
            >
              {/* ── Male side ── */}
              <div className="flex items-center justify-end gap-2 pr-1.5">
                {/* Value labels — stacked if compare active */}
                <div className="flex w-[3.75rem] shrink-0 flex-col items-end gap-0.5 leading-none">
                  <span className={`text-xs font-bold tabular-nums ${isDating ? "text-sky-300" : "text-zinc-200"}`}>
                    {rowA.malePct.toFixed(1)}%
                  </span>
                  {rowB && (
                    <span className="text-[9px] font-semibold tabular-nums text-teal-400">
                      {rowB.malePct.toFixed(1)}%
                    </span>
                  )}
                </div>
                {/* Stacked bar tracks — grows right-to-left */}
                <div className={`flex flex-1 flex-col gap-0.5 ${hasCompare ? "h-12" : "h-9"}`}>
                  {/* Main country bar */}
                  <div className="relative flex-1 overflow-hidden rounded-l-md bg-zinc-800/40">
                    <motion.div
                      className={`absolute right-0 h-full rounded-l-md ${
                        isDating
                          ? "bg-gradient-to-l from-sky-400 to-sky-600 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                          : "bg-sky-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${mPct}%` }}
                      transition={{ duration: 0.75, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  {/* Compare bar — teal, clearly different from sky */}
                  {hasCompare && (
                    <div className="relative flex-1 overflow-hidden rounded-l-md bg-zinc-800/40">
                      <motion.div
                        className={`absolute right-0 h-full rounded-l-md ${
                          isDating
                            ? "bg-gradient-to-l from-teal-400 to-teal-600 shadow-[0_0_8px_rgba(45,212,191,0.35)]"
                            : "bg-teal-600/90"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bMPct}%` }}
                        transition={{ duration: 0.75, delay: i * 0.07, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Age label + ratio severity ── */}
              <div className="flex flex-col items-center justify-center gap-0.5 px-1">
                <span className={`text-[11px] font-black leading-none ${isDating ? "text-amber-300" : "text-zinc-300"}`}>
                  {band}
                </span>
                {isDating && (
                  <span className="text-[7px] font-bold uppercase tracking-wide text-amber-500/70">★ prime</span>
                )}
                <span className={`text-[9px] font-medium leading-tight text-center ${ratio.className}`} title={ratio.isFavorable ? "More women than men in this age group" : "More men than women in this age group"}>
                  {ratio.label}
                </span>
              </div>

              {/* ── Female side ── */}
              <div className="flex items-center gap-2 pl-1.5">
                {/* Stacked bar tracks — grows left-to-right */}
                <div className={`flex flex-1 flex-col gap-0.5 ${hasCompare ? "h-12" : "h-9"}`}>
                  {/* Main country bar */}
                  <div className="relative flex-1 overflow-hidden rounded-r-md bg-zinc-800/40">
                    <motion.div
                      className={`absolute left-0 h-full rounded-r-md ${
                        isDating
                          ? "bg-gradient-to-r from-pink-400 to-pink-600 shadow-[0_0_10px_rgba(244,114,182,0.4)]"
                          : "bg-pink-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${fPct}%` }}
                      transition={{ duration: 0.75, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  {/* Compare bar — amber, clearly different from pink */}
                  {hasCompare && (
                    <div className="relative flex-1 overflow-hidden rounded-r-md bg-zinc-800/40">
                      <motion.div
                        className={`absolute left-0 h-full rounded-r-md ${
                          isDating
                            ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(251,191,36,0.35)]"
                            : "bg-amber-600/90"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bFPct}%` }}
                        transition={{ duration: 0.75, delay: i * 0.07, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
                {/* Value labels */}
                <div className="flex w-[3.75rem] shrink-0 flex-col items-start gap-0.5 leading-none">
                  <span className={`text-xs font-bold tabular-nums ${isDating ? "text-pink-300" : "text-zinc-200"}`}>
                    {rowA.femalePct.toFixed(1)}%
                  </span>
                  {rowB && (
                    <span className="text-[9px] font-semibold tabular-nums text-amber-400">
                      {rowB.femalePct.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis scale */}
      <div className={`mt-1.5 grid ${gridCols}`}>
        <div className="flex justify-between pr-1.5 pl-16 text-[9px] text-zinc-600">
          <span>{maxVal}%</span>
          <span>{maxVal / 2}%</span>
          <span>0</span>
        </div>
        <div />
        <div className="flex justify-between pl-1.5 pr-16 text-[9px] text-zinc-600">
          <span>0</span>
          <span>{maxVal / 2}%</span>
          <span>{maxVal}%</span>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] text-zinc-600">
        % of total population per age group · <SourceLink sourceKey="demographicsPopulation" />
      </p>
      <p className="mt-1.5 text-center text-[9px] text-zinc-600">
        Ratio: more ♀ than ♂ in an age group is favorable; more ♂ than ♀ is unfavorable (severity shown).
      </p>

      {/* Cities map & list (25–39 ratio + population) — show when we have city ratio and/or city list */}
      {(cityRatio || getCitiesForCountry(country.slug).length > 0) && (() => {
        const cities = getCitiesForCountry(country.slug);
        const hasMapAndList = cities.length > 0;
        const best = hasMapAndList ? cities[0] : null;
        const worst = hasMapAndList ? cities[cities.length - 1] : null;
        return (
          <div className="mt-6 space-y-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-500/90">
              Best & worst cities (20–39 prime age)
            </p>
            <p className="mb-4 text-[11px] text-zinc-500">
              Cities with the best and worst female-to-male ratio in the prime dating window (ages 20–39). More women = larger dating pool and better competitive edge.
              {hasMapAndList && " Map: circle size = population; color = ratio."}
            </p>
            {hasMapAndList && (
              <div>
                <CitiesPrimeAgeMap countrySlug={country.slug} countryName={country.name} />
              </div>
            )}
            {hasMapAndList ? (
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  All cities ({cities.length}) — sorted by ratio (best first)
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {cities.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-950/40 px-3 py-2"
                    >
                      <span className="text-xs font-medium text-zinc-200">{c.name}</span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span
                          className={
                            c.womenPer100Men >= 102
                              ? "text-emerald-400 font-semibold"
                              : c.womenPer100Men >= 98
                                ? "text-amber-400"
                                : "text-zinc-500"
                          }
                        >
                          {c.womenPer100Men} ♀/100♂
                        </span>
                        <span className="text-zinc-600">
                          {c.population >= 1000 ? (c.population / 1000).toFixed(1) + "M" : c.population + "k"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {best && worst && (
                  <p className="mt-4 flex flex-wrap gap-4 justify-center text-[10px] text-zinc-500">
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-400/90">
                      Best: {best.name} ({best.womenPer100Men} ♀/100♂)
                    </span>
                    <span className="rounded border border-zinc-700/60 bg-zinc-800/30 px-2 py-1 text-zinc-400">
                      Worst: {worst.name} ({worst.womenPer100Men} ♀/100♂)
                    </span>
                  </p>
                )}
              </div>
            ) : cityRatio ? (
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500/80">Best for ratio</p>
                    <p className="mt-1 text-sm font-bold text-zinc-100">{cityRatio.best.name}</p>
                    {cityRatio.best.note && (
                      <p className="mt-0.5 text-[11px] text-zinc-500">{cityRatio.best.note}</p>
                    )}
                    <p className="mt-2 text-[10px] text-emerald-400/90">More women in 20–39 → better dating odds</p>
                  </div>
                  <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/50 px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Worst for ratio</p>
                    <p className="mt-1 text-sm font-bold text-zinc-300">{cityRatio.worst.name}</p>
                    {cityRatio.worst.note && (
                      <p className="mt-0.5 text-[11px] text-zinc-500">{cityRatio.worst.note}</p>
                    )}
                    <p className="mt-2 text-[10px] text-zinc-500">More men in 20–39 → harder competition</p>
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] text-zinc-500">
                  Prefer the best city when possible — you get a larger pool of single women and a better competitive edge.
                </p>
              </div>
            ) : null}
          </div>
        );
      })()}
    </div>
  );
}

// ─── TAB: Economy ─────────────────────────────────────────────────────────────
function EconomyTab({ country, compare }: { country: Country; compare: Country | null }) {
  const entries = useMemo(() => {
    const main       = { label: country.name,   flag: country.flagEmoji,  gdp: parseGdp(country.gdpPerCapita),  barColor: "from-emerald-600 to-emerald-400", textColor: "text-emerald-300" };
    const worldEntry = { label: "World Avg",    flag: "🌍",               gdp: WORLD_AVG_GDP as number | null,  barColor: "from-zinc-700 to-zinc-600",       textColor: "text-zinc-400"   };
    if (compare) {
      return [
        main,
        { label: compare.name, flag: compare.flagEmoji, gdp: parseGdp(compare.gdpPerCapita), barColor: "from-sky-700 to-sky-500", textColor: "text-sky-300" },
        worldEntry,
      ];
    }
    return [main, worldEntry];
  }, [country, compare]);

  const numeric = entries.map((e) => e.gdp).filter((v): v is number => v != null && v > 0);
  const maxGdp = (numeric.length ? Math.max(...numeric) : WORLD_AVG_GDP) * 1.12;

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-100">GDP per Capita</h3>
        <SourceLink sourceKey="gdp" />
      </div>
      <p className="mb-8 text-xs text-zinc-500">
        Higher = stronger economy, typically higher cost of living for visitors.
      </p>

      <div className="flex flex-col gap-6">
        {entries.map((entry, i) => {
          const pct = entry.gdp ? (entry.gdp / maxGdp) * 100 : 0;
          return (
            <div key={entry.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{entry.flag}</span>
                  <span className="text-sm font-semibold text-zinc-200">{entry.label}</span>
                </div>
                <span className={`text-2xl font-black tabular-nums tracking-tight ${entry.textColor}`}>
                  {entry.gdp ? fmtGdp(entry.gdp) : "No data"}
                </span>
              </div>
              <div className="relative h-10 w-full overflow-hidden rounded-xl bg-zinc-800/50">
                {entry.gdp ? (
                  <motion.div
                    className={`h-full rounded-xl bg-gradient-to-r ${entry.barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: i * 0.18, ease: "easeOut" }}
                  />
                ) : (
                  <div className="h-full w-full border border-dashed border-zinc-700/70 rounded-xl" />
                )}
                <div className="pointer-events-none absolute inset-0 flex items-center px-4">
                  <span className="text-xs font-semibold text-white/50">
                    {entry.gdp ? `${fmtGdp(entry.gdp)} / person / year` : "No verified GDP data yet"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4">
        <p className="text-[11px] leading-relaxed text-zinc-400">
          Countries with lower GDP typically offer better purchasing power for foreign visitors and expats.
          Combined with the cost-of-living score, this gives a clearer picture of day-to-day affordability.
        </p>
      </div>
    </div>
  );
}

// ─── TAB: Physical ────────────────────────────────────────────────────────────
function PhysicalTab({ country, compare }: { country: Country; compare: Country | null }) {
  const maleA   = parseH(country.avgHeightMale);
  const femaleA = parseH(country.avgHeightFemale);
  const maleB   = compare ? parseH(compare.avgHeightMale) : null;
  const femaleB = compare ? parseH(compare.avgHeightFemale) : null;

  const allH = [maleA, femaleA, maleB, femaleB].filter((v): v is number => v != null && v > 0);
  const hasHeightData = allH.length > 0;
  const minH = hasHeightData ? Math.floor(Math.min(...allH) / 5) * 5 - 5 : 140;
  const maxH = hasHeightData ? Math.ceil(Math.max(...allH)  / 5) * 5 + 5 : 200;
  const hPct = (h: number) => ((h - minH) / (maxH - minH)) * 100;

  const bmiColor = (bmi: number | null) => {
    if (!bmi) return "text-zinc-500";
    if (bmi < 25)   return "text-emerald-400";
    if (bmi < 27.5) return "text-lime-400";
    if (bmi < 30)   return "text-amber-400";
    return "text-red-400";
  };
  const bmiBarColor = (bmi: number) =>
    bmi < 25 ? "#10b981" : bmi < 27.5 ? "#84cc16" : bmi < 30 ? "#f59e0b" : "#ef4444";

  type HeightEntry = { name: string; flag: string; h: number | null; barColor: string };

  const heightRows: { label: string; icon: string; entries: HeightEntry[] }[] = [
    {
      label: "Male", icon: "♂",
      entries: [
        { name: country.name, flag: country.flagEmoji, h: maleA, barColor: "bg-sky-500" },
        ...(compare && maleB ? [{ name: compare.name, flag: compare.flagEmoji, h: maleB, barColor: "bg-sky-300/60" }] : []),
      ],
    },
    {
      label: "Female", icon: "♀",
      entries: [
        { name: country.name, flag: country.flagEmoji, h: femaleA, barColor: "bg-pink-500" },
        ...(compare && femaleB ? [{ name: compare.name, flag: compare.flagEmoji, h: femaleB, barColor: "bg-pink-300/60" }] : []),
      ],
    },
  ];

  type BmiEntry = { name: string; flag: string; male: number | null; female: number | null };

  const bmiRows: BmiEntry[] = [
    { name: country.name, flag: country.flagEmoji, male: country.avgBmiMale ?? null, female: country.avgBmiFemale ?? null },
    ...(compare ? [{ name: compare.name, flag: compare.flagEmoji, male: compare.avgBmiMale ?? null, female: compare.avgBmiFemale ?? null }] : []),
  ];

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Height */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">Average Height</h3>
            <SourceLink sourceKey="height" />
          </div>
          <div className="space-y-6">
            {heightRows.map((row) => (
              <div key={row.label}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  {row.icon} {row.label}
                </p>
                <div className="space-y-2.5">
                  {row.entries.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 text-base">{entry.flag}</span>
                      <span className="w-28 shrink-0 truncate text-[11px] text-zinc-400">{entry.name}</span>
                      <div className="relative flex-1 h-6 overflow-hidden rounded-md bg-zinc-800/50">
                        {entry.h != null ? (
                          <motion.div
                            className={`absolute left-0 top-0 h-full ${entry.barColor} rounded-md`}
                            initial={{ width: 0 }}
                            animate={{ width: `${hPct(entry.h)}%` }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                          />
                        ) : (
                          <div className="h-full w-full border border-dashed border-zinc-700/70 rounded-md" />
                        )}
                      </div>
                      <span className="w-16 shrink-0 text-right text-[11px] font-bold tabular-nums text-zinc-200">
                        {entry.h != null ? `${entry.h.toFixed(1)} cm` : "No data"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">
            {hasHeightData ? `Scale: ${minH}–${maxH} cm` : "No verified height data yet"}
          </p>
        </div>

        {/* BMI */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">Average BMI</h3>
            <SourceLink sourceKey="bmi" />
          </div>

          {/* BMI colour scale */}
          <div className="mb-1 relative h-3 w-full rounded-full overflow-hidden flex">
            <div className="flex-[2.5] bg-blue-500/30 rounded-l-full" />
            <div className="flex-[3.25] bg-emerald-500/40" />
            <div className="flex-[2.5] bg-amber-400/40" />
            <div className="flex-[3] bg-red-500/40 rounded-r-full" />
          </div>
          <div className="mb-6 flex justify-between text-[9px] text-zinc-500">
            <span>Under&shy;weight</span>
            <span>Normal &lt;25</span>
            <span>Over&shy;weight</span>
            <span>Obese &gt;30</span>
          </div>

          <div className="space-y-5">
            {bmiRows.map((entry) => (
              <div key={entry.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{entry.flag}</span>
                  <span className="text-[11px] text-zinc-400 font-medium">{entry.name}</span>
                </div>
                {[
                  { label: "♂ Male",   bmi: entry.male,   barClass: "bg-sky-500" },
                  { label: "♀ Female", bmi: entry.female, barClass: "bg-pink-500" },
                ].map(({ label, bmi, barClass }) => (
                  <div key={label} className="flex items-center gap-3 pl-6">
                    <span className="w-16 shrink-0 text-[10px] text-zinc-500">{label}</span>
                    {bmi != null ? (
                      <>
                        <div className="relative flex-1 h-5 overflow-hidden rounded-md bg-zinc-800/50">
                          <motion.div
                            className={`absolute left-0 top-0 h-full rounded-md ${barClass}`}
                            style={{ opacity: 0.8 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                          />
                        </div>
                        <span className={`w-10 shrink-0 text-right text-sm font-bold tabular-nums ${bmiColor(bmi)}`}>
                          {bmi.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-zinc-600 flex-1">No data</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body type reference: US vs country */}
      {country.avgBmiMale != null && country.avgBmiFemale != null && (
        <div className="mt-10">
          <BodyComparison
            countrySlug={country.slug}
            countryName={country.name}
            bmiMale={country.avgBmiMale}
            bmiFemale={country.avgBmiFemale}
          />
        </div>
      )}
    </div>
  );
}

// ─── TAB: Society ─────────────────────────────────────────────────────────────
function SocietyTab({ country, compare }: { country: Country; compare: Country | null }) {
  const aSlug = country.slug;
  const bSlug = compare?.slug;

  const tfrA  = getFertilityRate(aSlug);
  const tfrB  = bSlug ? getFertilityRate(bSlug) : null;
  const ageA  = getMedianAgeBySlug(aSlug);
  const ageB  = bSlug ? getMedianAgeBySlug(bSlug) : null;
  const homoA = getEthnicHomogeneityBySlug(aSlug);
  const homoB = bSlug ? getEthnicHomogeneityBySlug(bSlug) : null;
  const friendlyA = getFriendlinessDisplay(aSlug);
  const friendlyB = bSlug ? getFriendlinessDisplay(bSlug) : null;
  const usFriendly = getFriendlinessDisplay("usa");

  type FRow = { name: string; flag: string; tfr: number };
  type ARow = { name: string; flag: string; age: number };
  type HRow = { name: string; flag: string; homo: number };
  type FriendlyRow = { name: string; flag: string; score: number; label: string; color: string };

  const fertilityRows: FRow[] = [
    { name: country.name,    flag: country.flagEmoji, tfr: tfrA           },
    ...(compare && tfrB  != null ? [{ name: compare.name,   flag: compare.flagEmoji, tfr: tfrB }] : []),
    { name: "US ref",        flag: "🇺🇸",            tfr: US_FERTILITY_RATE },
  ];
  const ageRows: ARow[] = [
    { name: country.name,    flag: country.flagEmoji, age: ageA         },
    ...(compare && ageB  != null ? [{ name: compare.name,   flag: compare.flagEmoji, age: ageB }] : []),
    { name: "World avg",     flag: "🌍",              age: WORLD_MEDIAN_AGE },
  ];
  const homoRows: HRow[] = [
    { name: country.name, flag: country.flagEmoji, homo: homoA },
    ...(compare && homoB != null ? [{ name: compare.name, flag: compare.flagEmoji, homo: homoB }] : []),
  ];
  const friendlinessRows: FriendlyRow[] = [
    { name: country.name, flag: country.flagEmoji, score: friendlyA.score, label: friendlyA.label, color: friendlyA.color },
    ...(compare && friendlyB != null ? [{ name: compare.name, flag: compare.flagEmoji, score: friendlyB.score, label: friendlyB.label, color: friendlyB.color }] : []),
    { name: "US ref", flag: "🇺🇸", score: usFriendly.score, label: usFriendly.label, color: usFriendly.color },
  ];

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Fertility */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Fertility Rate</span>
            </div>
            <SourceLink sourceKey="fertility" />
          </div>
          <div className="space-y-3.5">
            {fertilityRows.map((entry) => {
              const lbl = getFertilityLabel(entry.tfr);
              return (
                <div key={entry.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{entry.flag}</span>
                      <span className="text-[11px] text-zinc-400">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black tabular-nums ${lbl.color}`}>{entry.tfr.toFixed(2)}</span>
                      <span className={`text-[9px] ${lbl.color} opacity-70`}>{lbl.label}</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((entry.tfr / 6) * 100, 100)}%`,
                        background: entry.tfr >= 2.1 ? "#10b981" : entry.tfr >= 1.5 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                    {/* Replacement tick */}
                    <div className="absolute top-0 h-full w-0.5 bg-emerald-400/50" style={{ left: `${(REPLACEMENT_RATE / 6) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">Green tick = replacement rate (2.1)</p>
        </div>

        {/* Median Age */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Median Age</span>
            </div>
            <SourceLink sourceKey="demographicsAge" />
          </div>
          <div className="space-y-3.5">
            {ageRows.map((entry) => (
              <div key={entry.name}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{entry.flag}</span>
                    <span className="text-[11px] text-zinc-400">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black tabular-nums text-violet-300">{entry.age} yrs</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                    style={{ width: `${(entry.age / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">Scale 0–50 years</p>
        </div>

        {/* Ethnic Homogeneity */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Ethnic Homogeneity</span>
            </div>
            <SourceLink sourceKey="demographicsEthnic" />
          </div>
          <div className="space-y-3.5">
            {homoRows.map((entry) => {
              const lbl = getHomogeneityLabel(entry.homo);
              return (
                <div key={entry.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{entry.flag}</span>
                      <span className="text-[11px] text-zinc-400">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black tabular-nums text-violet-300">{entry.homo}%</span>
                      <span className="text-[9px] text-zinc-500">{lbl}</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                    <div className="h-full rounded-full bg-violet-500/70" style={{ width: `${entry.homo}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Friendliness */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Local Friendliness</span>
            </div>
            <SourceLink sourceKey={hasInterNationsFriendlinessData(aSlug) ? "internations" : "gallup"} />
          </div>
          <div className="space-y-3.5">
            {friendlinessRows.map((entry) => (
              <div key={entry.name}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{entry.flag}</span>
                    <span className="text-[11px] text-zinc-400">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-black tabular-nums ${entry.color}`}>
                      {entry.score}
                    </span>
                    <span className={`text-[9px] ${entry.color} opacity-70`}>{entry.label}</span>
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${entry.score}%`,
                      background: entry.score >= 70 ? "#10b981" : entry.score >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">
            InterNations Ease of Settling In (0–100). How welcome expats feel, local friendliness, ease of making friends. Gallup used where InterNations has no data.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
type Props = {
  country: Country;
  allCountries: Country[];
};

export default function CountryStatsSection({ country, allCountries }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("population");
  // Default to US comparison unless we're already on the US page
  const [compareSlug, setCompareSlug] = useState<string>(() =>
    country.slug === "usa" ? "" : "usa"
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  const sortedCountries = useMemo(
    () => [...allCountries].sort((a, b) => a.name.localeCompare(b.name)),
    [allCountries]
  );

  const compare = useMemo(
    () => sortedCountries.find((c) => c.slug === compareSlug && c.slug !== country.slug) ?? null,
    [sortedCountries, compareSlug, country.slug]
  );

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/60">

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/50 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-zinc-100 sm:text-lg">Stats & Comparisons</h2>
          <p className="mt-0.5 text-[10px] text-zinc-500">
            Population · Economy · Physical · Society — switch tabs to explore
          </p>
        </div>

        {/* Country picker */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen((p) => !p)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
              compareSlug
                ? "border-emerald-600/50 bg-emerald-900/20 text-zinc-200 hover:border-emerald-500/60"
                : "border-zinc-700 bg-zinc-800/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <span className="text-[10px] text-zinc-500">Compare</span>
            {compareSlug && compare ? (
              <>
                <span className="text-lg">{compare.flagEmoji}</span>
                <span className="font-semibold text-zinc-200">{compare.name}</span>
              </>
            ) : (
              <span className="font-medium">Off</span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${pickerOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 max-h-72 w-52 overflow-y-auto overscroll-contain rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60"
              >
                {/* Off option */}
                <button
                  onClick={() => { setCompareSlug(""); setPickerOpen(false); }}
                  className={`flex w-full items-center gap-2 border-b border-zinc-800 px-3 py-2 text-left text-sm transition hover:bg-zinc-800 ${
                    !compareSlug ? "bg-zinc-800/80 text-zinc-100" : "text-zinc-400"
                  }`}
                >
                  <span className="text-base">✕</span>
                  <span>No comparison</span>
                </button>
                {sortedCountries
                  .filter((c) => c.slug !== country.slug)
                  .map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => { setCompareSlug(c.slug); setPickerOpen(false); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-zinc-800 ${
                        c.slug === compareSlug ? "bg-zinc-800/80 text-zinc-100" : "text-zinc-400"
                      }`}
                    >
                      <span className="text-base">{c.flagEmoji}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-zinc-800/50 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-semibold transition ${
              activeTab === tab.id ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="stats-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {activeTab === "population" && <PopulationTab country={country} compare={compare} />}
          {activeTab === "economy"    && <EconomyTab    country={country} compare={compare} />}
          {activeTab === "physical"   && <PhysicalTab   country={country} compare={compare} />}
          {activeTab === "society"    && <SocietyTab    country={country} compare={compare} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
