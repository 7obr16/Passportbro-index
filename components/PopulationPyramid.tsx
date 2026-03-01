"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  getPopulationPyramid,
  US_PYRAMID_REFERENCE,
} from "@/lib/populationDemographics";
import SourceLink from "@/components/SourceLink";

type Props = {
  slug: string;
  countryName: string;
};

// Derived 6-band labels including split 25-54 → 25-39 + 40-54
const DERIVED_BANDS = ["0-14", "15-24", "25-39", "40-54", "55-64", "65+"] as const;
type DerivedBand = (typeof DERIVED_BANDS)[number];

// Bands that represent the prime passport bro dating age
const DATING_BANDS = new Set<DerivedBand>(["25-39"]);

type DerivedRow = { band: DerivedBand; malePct: number; femalePct: number };

/** Split the 5-band pyramid into 6 bands by splitting 25-54 → 25-39 + 40-54 (~52/48) */
function deriveSixBands(raw: { band: string; malePct: number; femalePct: number }[]): DerivedRow[] {
  const get = (band: string) => raw.find((r) => r.band === band)!;
  const base2554 = get("25-54");
  return [
    { band: "0-14",  ...get("0-14")  },
    { band: "15-24", ...get("15-24") },
    { band: "25-39", band: "25-39", malePct: base2554.malePct  * 0.52, femalePct: base2554.femalePct  * 0.52 },
    { band: "40-54", band: "40-54", malePct: base2554.malePct  * 0.48, femalePct: base2554.femalePct  * 0.48 },
    { band: "55-64", ...get("55-64") },
    { band: "65+",   ...get("65+")   },
  ] as DerivedRow[];
}

export default function PopulationPyramid({ slug, countryName }: Props) {
  const rawPyramid = useMemo(() => getPopulationPyramid(slug), [slug]);
  const pyramid    = useMemo(() => deriveSixBands(rawPyramid), [rawPyramid]);
  const usRef      = useMemo(() => deriveSixBands(US_PYRAMID_REFERENCE), []);

  const maxVal = useMemo(() => {
    let max = 0;
    for (const b of [...pyramid, ...usRef]) {
      if (b.malePct  > max) max = b.malePct;
      if (b.femalePct > max) max = b.femalePct;
    }
    return Math.ceil(max / 2) * 2; // round up to nearest 2%
  }, [pyramid, usRef]);

  // Grid ticks: 0, half, full
  const ticks = [0, maxVal / 2, maxVal];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/70 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
            <BarChart3 className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Population Structure</p>
            <p className="text-xs font-semibold text-zinc-100">Age & Sex Pyramid vs US</p>
          </div>
        </div>
        <SourceLink sourceKey="demographicsPopulation" />
      </div>

      {/* Legend row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300">Male</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-px w-5 border-t border-dashed border-zinc-500" />
            <span className="text-[9px] text-zinc-500">US avg</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/8 px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] font-semibold text-amber-300">Prime Dating Age</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Female</span>
          <div className="h-2.5 w-2.5 rounded-sm bg-pink-500" />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-1.5">
          {[...DERIVED_BANDS].reverse().map((band, i) => {
            const row   = pyramid.find((p) => p.band === band)!;
            const usRow = usRef.find((p) => p.band === band)!;
            const isDating = DATING_BANDS.has(band);

            const cMPct = (row.malePct   / maxVal) * 100;
            const cFPct = (row.femalePct / maxVal) * 100;
            const usMPct = (usRow.malePct   / maxVal) * 100;
            const usFPct = (usRow.femalePct / maxVal) * 100;

            return (
              <div
                key={band}
                className={`relative flex items-center rounded-lg px-2 py-1 ${
                  isDating ? "bg-amber-400/[0.05] ring-1 ring-inset ring-amber-400/15" : ""
                }`}
              >
                {/* Dating label on left edge */}
                {isDating && band === "25-39" && (
                  <span className="absolute -left-0 -top-0 z-20 hidden text-[8px] font-bold uppercase tracking-wider text-amber-400/70 sm:block">
                    ★
                  </span>
                )}

                {/* Male side */}
                <div className="flex flex-1 items-center justify-end gap-1.5 pr-2">
                  <span className="w-8 text-right text-[10px] font-semibold tabular-nums text-zinc-200">
                    {row.malePct.toFixed(1)}%
                  </span>
                  <div className="relative flex h-6 flex-1 items-center justify-end overflow-visible">
                    {/* Grid lines */}
                    {ticks.slice(1).map((t) => (
                      <div
                        key={t}
                        className="absolute top-0 h-full w-px bg-zinc-800/50"
                        style={{ right: `${(t / maxVal) * 100}%` }}
                      />
                    ))}
                    {/* US reference outline */}
                    <div
                      className="absolute right-0 h-4 rounded-l-sm border border-dashed border-zinc-500/60 bg-transparent"
                      style={{ width: `${usMPct}%` }}
                    />
                    {/* Country bar */}
                    <motion.div
                      className={`absolute right-0 h-4 rounded-l-sm ${
                        isDating
                          ? "bg-gradient-to-l from-sky-400 to-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                          : "bg-gradient-to-l from-sky-600/80 to-sky-700/80"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cMPct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Age label centre */}
                <div
                  className={`w-12 shrink-0 text-center text-[10px] font-bold ${
                    isDating ? "text-amber-300" : "text-zinc-300"
                  }`}
                >
                  {band}
                </div>

                {/* Female side */}
                <div className="flex flex-1 items-center gap-1.5 pl-2">
                  <div className="relative flex h-6 flex-1 items-center overflow-visible">
                    {ticks.slice(1).map((t) => (
                      <div
                        key={t}
                        className="absolute top-0 h-full w-px bg-zinc-800/50"
                        style={{ left: `${(t / maxVal) * 100}%` }}
                      />
                    ))}
                    <div
                      className="absolute left-0 h-4 rounded-r-sm border border-dashed border-zinc-500/60 bg-transparent"
                      style={{ width: `${usFPct}%` }}
                    />
                    <motion.div
                      className={`absolute left-0 h-4 rounded-r-sm ${
                        isDating
                          ? "bg-gradient-to-r from-pink-400 to-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                          : "bg-gradient-to-r from-pink-600/80 to-pink-700/80"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cFPct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-8 text-left text-[10px] font-semibold tabular-nums text-zinc-200">
                    {row.femalePct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis scale */}
        <div className="mt-2 flex items-center px-2">
          {/* Male side */}
          <div className="flex flex-1 justify-end pr-2">
            <div className="flex w-[calc(100%-2.5rem)] justify-between">
              {[...ticks].reverse().map((t) => (
                <span key={t} className="text-[9px] text-zinc-600">{t}%</span>
              ))}
            </div>
          </div>
          <div className="w-12" />
          {/* Female side */}
          <div className="flex flex-1 pl-2">
            <div className="flex w-[calc(100%-2.5rem)] justify-between">
              {ticks.map((t) => (
                <span key={t} className="text-[9px] text-zinc-600">{t}%</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-1">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-2">
          <span className="text-[9px] font-bold text-amber-400">★</span>
          <p className="text-[10px] text-zinc-400">
            <span className="font-semibold text-amber-300">25–39</span> is the prime passport bro dating window.
            {" "}Dashed outline = US reference. % of total population.
          </p>
        </div>
      </div>
    </div>
  );
}
