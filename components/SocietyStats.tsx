"use client";

import { useMemo } from "react";
import { Calendar, Layers, Heart, Globe2 } from "lucide-react";
import {
  getMedianAgeBySlug,
  getEthnicHomogeneityBySlug,
  getHomogeneityLabel,
  WORLD_MEDIAN_AGE,
} from "@/lib/demographicsIndex";
import {
  getOutGroupMarriagePct,
  hasEurostatMarriageData,
} from "@/lib/marriageTrendsIndex";
import SourceLink from "@/components/SourceLink";

type Props = {
  slug: string;
};

export default function SocietyStats({ slug }: Props) {
  // Age
  const medianAge = useMemo(() => getMedianAgeBySlug(slug), [slug]);
  const deltaAge = medianAge - WORLD_MEDIAN_AGE;

  // Ethnic
  const homogeneity = useMemo(() => getEthnicHomogeneityBySlug(slug), [slug]);
  const homogeneityLabel = useMemo(() => getHomogeneityLabel(homogeneity), [homogeneity]);

  // Marriage
  const outGroupPct = useMemo(() => getOutGroupMarriagePct(slug), [slug]);
  const hasMarriageData = useMemo(() => hasEurostatMarriageData(slug), [slug]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
            <Globe2 className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Society Overview</p>
            <p className="text-xs font-semibold text-zinc-200">Age, Ethnicity & Marriage</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5 gap-5">
        {/* Median Age block */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">Median Age</span>
            </div>
            <SourceLink sourceKey="demographicsAge" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-violet-300">{medianAge}</span>
            <span className="text-xs text-zinc-500">years</span>
          </div>
          <p className="mt-1 text-[10px] text-zinc-500">
            {deltaAge > 0 ? `+${deltaAge.toFixed(1)} years` : `${deltaAge.toFixed(1)} years`} vs world average (~{WORLD_MEDIAN_AGE})
          </p>
        </div>

        <div className="h-px bg-zinc-800/50" />

        {/* Ethnic Homogeneity block */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">Ethnic Homogeneity</span>
            </div>
            <SourceLink sourceKey="demographicsEthnic" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-violet-300">{homogeneity}%</span>
            </div>
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
              {homogeneityLabel}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/50">
            <div className="h-full bg-violet-500/70" style={{ width: `${homogeneity}%` }} />
          </div>
        </div>

        <div className="h-px bg-zinc-800/50" />

        {/* Marriage Trends block */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">Out-Group Marriage</span>
            </div>
            <SourceLink sourceKey={hasMarriageData ? "marriageEurope" : "marriageGlobal"} />
          </div>
          {outGroupPct != null ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-violet-300">{outGroupPct}%</span>
                <span className="text-[10px] text-zinc-500">of marriages</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                Mixed (native–foreign-born) marriages. Higher % generally indicates more openness to international partners.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/40 p-3">
              <p className="text-[11px] font-medium text-zinc-400 mb-1">Limited Data</p>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                No harmonized rate available. See UN World Marriage Data for regional context.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
