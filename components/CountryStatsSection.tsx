"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, DollarSign, Ruler, Globe2,
  Baby, Calendar, Layers, Heart, ChevronDown,
} from "lucide-react";
import type { Country } from "@/lib/countries";
import { getPopulationPyramid } from "@/lib/populationDemographics";
import { getMedianAgeBySlug, getEthnicHomogeneityBySlug, getHomogeneityLabel, WORLD_MEDIAN_AGE } from "@/lib/demographicsIndex";
import { getOutGroupMarriagePct, hasEurostatMarriageData } from "@/lib/marriageTrendsIndex";
import { getFertilityRate, getFertilityLabel, US_FERTILITY_RATE, REPLACEMENT_RATE } from "@/lib/fertilityData";
import SourceLink from "@/components/SourceLink";

// ─── Constants ────────────────────────────────────────────────────────────────
type TabId = "population" | "economy" | "physical" | "society";
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "population", label: "Population",  icon: BarChart3  },
  { id: "economy",    label: "Economy",     icon: DollarSign },
  { id: "physical",   label: "Physical",    icon: Ruler      },
  { id: "society",    label: "Society",     icon: Globe2     },
];

const US_GDP       = 80000;
const US_MALE_H    = 176.9;
const US_FEMALE_H  = 163.3;
const US_BMI       = 29.7;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseH = (h: string): number => {
  if (!h) return 0;
  const m = h.match(/(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  return v < 3 ? v * 100 : v;
};

const parseGdp = (g: string): number =>
  parseInt((g || "0").replace(/[^0-9]/g, ""), 10) || 0;

const fmtGdp = (n: number): string =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

// ─── Population pyramid helpers ───────────────────────────────────────────────
const DERIVED_BANDS = ["0-14", "15-24", "25-39", "40-54", "55-64", "65+"] as const;
type DerivedBand = (typeof DERIVED_BANDS)[number];
const DATING_BANDS = new Set<DerivedBand>(["25-39"]);

type BandRow = { band: DerivedBand; malePct: number; femalePct: number };

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
  const pyrA = useMemo(() => deriveBands(getPopulationPyramid(country.slug)), [country.slug]);
  const pyrB = useMemo(
    () => (compare ? deriveBands(getPopulationPyramid(compare.slug)) : null),
    [compare]
  );

  const maxVal = useMemo(() => {
    let max = 0;
    for (const b of pyrA) { max = Math.max(max, b.malePct, b.femalePct); }
    if (pyrB) for (const b of pyrB) { max = Math.max(max, b.malePct, b.femalePct); }
    return Math.ceil(max / 2) * 2;
  }, [pyrA, pyrB]);

  return (
    <div className="px-4 py-6 sm:px-6">
      {/* Legend */}
      <div className="mb-5 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <div className="h-3 w-3 rounded-sm bg-sky-500" />
            <div className="h-3 w-3 rounded-sm bg-pink-500" />
          </div>
          <span className="font-semibold text-zinc-200">{country.name}</span>
        </div>
        {pyrB && compare && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="h-3 w-3 rounded-sm bg-sky-300/40 border border-sky-400/40" />
              <div className="h-3 w-3 rounded-sm bg-pink-300/40 border border-pink-400/40" />
            </div>
            <span className="text-zinc-400">{compare.name}</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/8 px-2.5 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="font-semibold text-amber-300 text-[10px]">25–39 Prime Dating Age</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="mb-1 flex items-center">
        <div className="flex flex-1 justify-end pr-3">
          <span className="mr-10 text-[10px] font-bold uppercase tracking-widest text-sky-400">Male ♂</span>
        </div>
        <div className="w-14 shrink-0" />
        <div className="flex flex-1 pl-3">
          <span className="ml-10 text-[10px] font-bold uppercase tracking-widest text-pink-400">Female ♀</span>
        </div>
      </div>

      {/* Chart rows */}
      <div className="flex flex-col gap-2">
        {[...DERIVED_BANDS].reverse().map((band, i) => {
          const rowA   = pyrA.find((p) => p.band === band)!;
          const rowB   = pyrB?.find((p) => p.band === band);
          const isDating = DATING_BANDS.has(band);
          const cM  = (rowA.malePct   / maxVal) * 100;
          const cF  = (rowA.femalePct / maxVal) * 100;
          const bM  = rowB ? (rowB.malePct   / maxVal) * 100 : 0;
          const bF  = rowB ? (rowB.femalePct / maxVal) * 100 : 0;

          return (
            <div
              key={band}
              className={`relative flex items-center rounded-xl px-2 py-2 transition-colors ${
                isDating
                  ? "bg-amber-400/[0.07] ring-1 ring-inset ring-amber-400/25"
                  : "bg-zinc-900/40"
              }`}
            >
              {/* Male side */}
              <div className="flex flex-1 items-center justify-end gap-2 pr-2">
                <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-zinc-100">
                  {rowA.malePct.toFixed(1)}%
                </span>
                <div className="relative flex h-9 flex-1 items-center justify-end overflow-hidden rounded-l-md bg-zinc-800/30">
                  {/* Compare shadow bar */}
                  {rowB && (
                    <div
                      className="absolute right-0 h-full rounded-l-md border border-sky-400/30 bg-sky-400/15"
                      style={{ width: `${bM}%` }}
                    />
                  )}
                  {/* Main bar */}
                  <motion.div
                    className={`absolute right-0 h-full rounded-l-md ${
                      isDating
                        ? "bg-gradient-to-l from-sky-400 to-sky-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        : "bg-sky-700/90"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cM}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Age label */}
              <div className="w-14 shrink-0 text-center">
                <div className={`text-xs font-black ${isDating ? "text-amber-300" : "text-zinc-300"}`}>
                  {band}
                </div>
                {isDating && (
                  <div className="text-[8px] font-semibold uppercase tracking-wider text-amber-500/70">
                    ★ dating
                  </div>
                )}
              </div>

              {/* Female side */}
              <div className="flex flex-1 items-center gap-2 pl-2">
                <div className="relative flex h-9 flex-1 items-center overflow-hidden rounded-r-md bg-zinc-800/30">
                  {rowB && (
                    <div
                      className="absolute left-0 h-full rounded-r-md border border-pink-400/30 bg-pink-400/15"
                      style={{ width: `${bF}%` }}
                    />
                  )}
                  <motion.div
                    className={`absolute left-0 h-full rounded-r-md ${
                      isDating
                        ? "bg-gradient-to-r from-pink-400 to-pink-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        : "bg-pink-700/90"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cF}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                  />
                </div>
                <span className="w-10 text-left text-[11px] font-semibold tabular-nums text-zinc-100">
                  {rowA.femalePct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis scale */}
      <div className="mt-2 flex items-center">
        <div className="flex flex-1 justify-end pr-2">
          <div className="flex w-[calc(100%-3.5rem)] justify-between px-0.5">
            {[maxVal, maxVal / 2, 0].map((t) => (
              <span key={t} className="text-[9px] text-zinc-600">{t}%</span>
            ))}
          </div>
        </div>
        <div className="w-14" />
        <div className="flex flex-1 pl-2">
          <div className="flex w-[calc(100%-3.5rem)] justify-between px-0.5">
            {[0, maxVal / 2, maxVal].map((t) => (
              <span key={t} className="text-[9px] text-zinc-600">{t}%</span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-zinc-600">
        % of total population per age group split by sex · <SourceLink sourceKey="demographicsPopulation" />
      </p>
    </div>
  );
}

// ─── TAB: Economy ─────────────────────────────────────────────────────────────
function EconomyTab({ country, compare }: { country: Country; compare: Country | null }) {
  const entries = useMemo(() => {
    const main    = { label: country.name,  flag: country.flagEmoji,  gdp: parseGdp(country.gdpPerCapita), barColor: "from-emerald-600 to-emerald-400", textColor: "text-emerald-300" };
    const usEntry = { label: "United States", flag: "🇺🇸",            gdp: US_GDP,                         barColor: "from-zinc-600 to-zinc-500",       textColor: "text-zinc-300"    };
    if (compare) {
      return [
        main,
        { label: compare.name, flag: compare.flagEmoji, gdp: parseGdp(compare.gdpPerCapita), barColor: "from-sky-700 to-sky-500", textColor: "text-sky-300" },
        usEntry,
      ];
    }
    return [main, usEntry];
  }, [country, compare]);

  const maxGdp = Math.max(...entries.map((e) => e.gdp)) * 1.12;

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
          const pct = (entry.gdp / maxGdp) * 100;
          return (
            <div key={entry.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{entry.flag}</span>
                  <span className="text-sm font-semibold text-zinc-200">{entry.label}</span>
                </div>
                <span className={`text-2xl font-black tabular-nums tracking-tight ${entry.textColor}`}>
                  {fmtGdp(entry.gdp)}
                </span>
              </div>
              <div className="relative h-10 w-full overflow-hidden rounded-xl bg-zinc-800/50">
                <motion.div
                  className={`h-full rounded-xl bg-gradient-to-r ${entry.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.18, ease: "easeOut" }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center px-4">
                  <span className="text-xs font-semibold text-white/50">
                    {fmtGdp(entry.gdp)} / person / year
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
  const maleA   = parseH(country.avgHeightMale)   || US_MALE_H;
  const femaleA = parseH(country.avgHeightFemale) || US_FEMALE_H;
  const maleB   = compare ? (parseH(compare.avgHeightMale)   || US_MALE_H)   : null;
  const femaleB = compare ? (parseH(compare.avgHeightFemale) || US_FEMALE_H) : null;

  const allH = [maleA, femaleA, US_MALE_H, US_FEMALE_H, maleB, femaleB].filter(Boolean) as number[];
  const minH = Math.floor(Math.min(...allH) / 5) * 5 - 5;
  const maxH = Math.ceil(Math.max(...allH)  / 5) * 5 + 5;
  const hPct = (h: number) => ((h - minH) / (maxH - minH)) * 100;

  const bmiA = country.avgBmi ?? null;
  const bmiB = compare?.avgBmi ?? null;

  const bmiColor = (bmi: number | null) => {
    if (!bmi) return "text-zinc-500";
    if (bmi < 25)   return "text-emerald-400";
    if (bmi < 27.5) return "text-lime-400";
    if (bmi < 30)   return "text-amber-400";
    return "text-red-400";
  };
  const bmiBarColor = (bmi: number) =>
    bmi < 25 ? "#10b981" : bmi < 27.5 ? "#84cc16" : bmi < 30 ? "#f59e0b" : "#ef4444";

  type HeightEntry = { name: string; flag: string; h: number; barColor: string };

  const heightRows: { label: string; icon: string; entries: HeightEntry[] }[] = [
    {
      label: "Male", icon: "♂",
      entries: [
        { name: country.name,    flag: country.flagEmoji,  h: maleA,    barColor: "bg-sky-500"     },
        ...(compare && maleB   ? [{ name: compare.name,   flag: compare.flagEmoji, h: maleB,   barColor: "bg-sky-400/50"  }] : []),
        { name: "United States", flag: "🇺🇸",             h: US_MALE_H, barColor: "bg-zinc-500/80" },
      ],
    },
    {
      label: "Female", icon: "♀",
      entries: [
        { name: country.name,    flag: country.flagEmoji,  h: femaleA,    barColor: "bg-pink-500"    },
        ...(compare && femaleB ? [{ name: compare.name,   flag: compare.flagEmoji, h: femaleB, barColor: "bg-pink-400/50"  }] : []),
        { name: "United States", flag: "🇺🇸",             h: US_FEMALE_H, barColor: "bg-zinc-500/80" },
      ],
    },
  ];

  type BmiEntry = { name: string; flag: string; bmi: number | null };

  const bmiRows: BmiEntry[] = [
    { name: country.name,    flag: country.flagEmoji, bmi: bmiA   },
    ...(compare ? [{ name: compare.name,   flag: compare.flagEmoji, bmi: bmiB   }] : []),
    { name: "United States", flag: "🇺🇸",            bmi: US_BMI },
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
                        <motion.div
                          className={`absolute left-0 top-0 h-full ${entry.barColor} rounded-md`}
                          initial={{ width: 0 }}
                          animate={{ width: `${hPct(entry.h)}%` }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-[11px] font-bold tabular-nums text-zinc-200">
                        {entry.h.toFixed(1)} cm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">Scale: {minH}–{maxH} cm</p>
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
              <div key={entry.name} className="flex items-center gap-4">
                <span className="w-5 shrink-0 text-base">{entry.flag}</span>
                <span className="w-28 shrink-0 truncate text-[11px] text-zinc-400">{entry.name}</span>
                {entry.bmi != null ? (
                  <>
                    <div className="relative flex-1 h-7 overflow-hidden rounded-lg bg-zinc-800/50">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-lg"
                        style={{ background: bmiBarColor(entry.bmi) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((entry.bmi / 40) * 100, 100)}%` }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                    </div>
                    <span className={`w-12 shrink-0 text-right text-lg font-black tabular-nums ${bmiColor(entry.bmi)}`}>
                      {entry.bmi.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-600 flex-1">No data</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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
  const mariA = getOutGroupMarriagePct(aSlug);
  const mariB = bSlug ? getOutGroupMarriagePct(bSlug) : null;

  type FRow = { name: string; flag: string; tfr: number };
  type ARow = { name: string; flag: string; age: number };
  type HRow = { name: string; flag: string; homo: number };
  type MRow = { name: string; flag: string; pct: number | null };

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
  const marriageRows: MRow[] = [
    { name: country.name, flag: country.flagEmoji, pct: mariA },
    ...(compare ? [{ name: compare.name, flag: compare.flagEmoji, pct: mariB ?? null }] : []),
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

        {/* Out-Group Marriage */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Out-Group Marriage</span>
            </div>
            <SourceLink sourceKey={hasEurostatMarriageData(aSlug) ? "marriageEurope" : "marriageGlobal"} />
          </div>
          <div className="space-y-3.5">
            {marriageRows.map((entry) => (
              <div key={entry.name}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{entry.flag}</span>
                    <span className="text-[11px] text-zinc-400">{entry.name}</span>
                  </div>
                  {entry.pct != null ? (
                    <span className="text-sm font-black tabular-nums text-rose-300">{entry.pct}%</span>
                  ) : (
                    <span className="text-[10px] text-zinc-600">No data</span>
                  )}
                </div>
                {entry.pct != null && (
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-700 to-rose-400"
                      style={{ width: `${Math.min(entry.pct * 3, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-zinc-600">
            % of native–foreign-born marriages. Higher = more open to international partners.
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
  const [compareSlug, setCompareSlug] = useState<string>(
    country.slug === "usa" ? "philippines" : "usa"
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
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            <span className="text-[10px] text-zinc-500">Compare with</span>
            <span className="text-lg">{compare?.flagEmoji ?? "🌍"}</span>
            <span className="font-semibold">{compare?.name ?? "—"}</span>
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
