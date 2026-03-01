"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  getPopulationPyramid,
  US_PYRAMID_REFERENCE,
  AGE_BAND_LABELS,
} from "@/lib/populationDemographics";
import SourceLink from "@/components/SourceLink";

type Props = {
  slug: string;
  countryName: string;
};

export default function PopulationPyramid({ slug, countryName }: Props) {
  const pyramid = useMemo(() => getPopulationPyramid(slug), [slug]);
  
  // Find max value to scale the bars (usually around 12-25%)
  const maxVal = useMemo(() => {
    let max = 0;
    for (const b of pyramid) {
      if (b.malePct > max) max = b.malePct;
      if (b.femalePct > max) max = b.femalePct;
    }
    for (const b of US_PYRAMID_REFERENCE) {
      if (b.malePct > max) max = b.malePct;
      if (b.femalePct > max) max = b.femalePct;
    }
    // Round up to nearest 5% for axis max
    return Math.ceil(max / 5) * 5;
  }, [pyramid]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
            <BarChart3 className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Population Structure</p>
            <p className="text-xs font-semibold text-zinc-200">Age & Sex Pyramid vs US</p>
          </div>
        </div>
        <SourceLink sourceKey="demographicsPopulation" />
      </div>

      {/* Pyramid Chart */}
      <div className="flex-1 px-5 py-6 flex flex-col justify-center">
        {/* Legend */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-500/80" />
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Male</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 bg-zinc-600/50" />
              <span className="text-[9px] text-zinc-500">US Ref</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Female</span>
            <div className="h-2 w-2 rounded-full bg-pink-500/80" />
          </div>
        </div>

        {/* Chart Rows */}
        <div className="flex flex-col gap-2.5">
          {[...AGE_BAND_LABELS].reverse().map((band, i) => {
            const row = pyramid.find((p) => p.band === band)!;
            const usRow = US_PYRAMID_REFERENCE.find((p) => p.band === band)!;
            
            const cM = (row.malePct / maxVal) * 100;
            const cF = (row.femalePct / maxVal) * 100;
            const usM = (usRow.malePct / maxVal) * 100;
            const usF = (usRow.femalePct / maxVal) * 100;

            return (
              <div key={band} className="flex items-center w-full">
                {/* Male Bar (Right aligned) */}
                <div className="flex-1 flex justify-end items-center relative h-5 pr-1">
                  <span className="absolute left-0 text-[9px] text-zinc-500 opacity-0 sm:opacity-100 hidden sm:block">
                    {row.malePct.toFixed(1)}%
                  </span>
                  <div className="absolute right-0 h-full border border-zinc-600/50 rounded-l-sm" style={{ width: `${usM}%` }} />
                  <motion.div 
                    className="h-full bg-sky-500/80 rounded-l-sm relative z-10" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${cM}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                </div>
                
                {/* Age Label */}
                <div className="w-12 shrink-0 text-center text-[10px] font-semibold text-zinc-400">
                  {band}
                </div>
                
                {/* Female Bar (Left aligned) */}
                <div className="flex-1 flex justify-start items-center relative h-5 pl-1">
                  <div className="absolute left-0 h-full border border-zinc-600/50 rounded-r-sm" style={{ width: `${usF}%` }} />
                  <motion.div 
                    className="h-full bg-pink-500/80 rounded-r-sm relative z-10" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${cF}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                  <span className="absolute right-0 text-[9px] text-zinc-500 opacity-0 sm:opacity-100 hidden sm:block">
                    {row.femalePct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* X Axis scale indicator */}
        <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-600">
          <span>{maxVal}%</span>
          <span>0%</span>
          <span>{maxVal}%</span>
        </div>
      </div>
      
      {/* Footer note */}
      <div className="mt-auto px-5 pb-5 pt-0">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3 text-center">
          <p className="text-[10px] leading-relaxed text-zinc-500">
            Shows % of total population by age and sex. Overlay represents United States structure.
          </p>
        </div>
      </div>
    </div>
  );
}
