"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Props = {
  gdpPerCapita: string;
};

const US_GDP = 70_000;
const WORLD_GDP = 15_000;
const MAX_GDP = 80_000;

function parseGdp(value: string): number | null {
  const num = Number.parseInt(value.replace(/[^0-9]/g, "") || "0", 10);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.min(num, MAX_GDP);
}

function fmt(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

const BARS = [
  { key: "world", label: "World Avg", color: "#52525b", trackColor: "rgba(82,82,91,0.12)", gdp: WORLD_GDP },
  { key: "us",    label: "US",        color: "#34d399", trackColor: "rgba(52,211,153,0.10)", gdp: US_GDP },
] as const;

export default function GdpVisual({ gdpPerCapita }: Props) {
  const rawGdp = useMemo(() => parseGdp(gdpPerCapita), [gdpPerCapita]);
  const countryGdp = rawGdp ?? 0;

  const ratioToUs = US_GDP > 0 && countryGdp > 0 ? countryGdp / US_GDP : 0;
  const deltaToUs = countryGdp - US_GDP;
  const pct = Math.round(ratioToUs * 100);

  const trendIcon =
    ratioToUs >= 0.9 ? <Minus className="h-3.5 w-3.5" />
    : ratioToUs >= 0.5 ? <TrendingDown className="h-3.5 w-3.5" />
    : <TrendingDown className="h-3.5 w-3.5" />;

  const trendColor =
    ratioToUs >= 1.1 ? "text-emerald-400"
    : ratioToUs >= 0.9 ? "text-zinc-400"
    : ratioToUs >= 0.5 ? "text-amber-400"
    : "text-red-400";

  const descriptor =
    !rawGdp || rawGdp <= 0 ? "No income data"
    : ratioToUs >= 1.1 ? "Higher income than the US"
    : ratioToUs >= 0.9 ? "On par with US income"
    : ratioToUs >= 0.5 ? "Around half of US income"
    : "Significantly below US income";

  const allBars = [
    ...BARS,
    {
      key: "country",
      label: "This Country",
      color: "#fbbf24",
      trackColor: "rgba(251,191,36,0.10)",
      gdp: countryGdp,
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Economy Snapshot</p>
            <p className="text-xs font-semibold text-zinc-200">GDP per Capita vs US</p>
          </div>
        </div>
      </div>

      {/* Key stat */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-black tracking-tight ${countryGdp > 0 ? trendColor : "text-zinc-600"}`}>
            {countryGdp > 0 ? `${pct}%` : "—"}
          </span>
          <span className="text-xs text-zinc-500">of US</span>
        </div>
        {countryGdp > 0 && (
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${trendColor} bg-white/[0.04]`}>
            {trendIcon}
            {deltaToUs === 0
              ? "On par"
              : deltaToUs > 0
                ? `+${fmt(Math.abs(deltaToUs))} vs US`
                : `${fmt(Math.abs(deltaToUs))} below US`}
          </span>
        )}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3 px-5 pb-2">
        {allBars.map((bar, i) => {
          const barPct = MAX_GDP ? (bar.gdp / MAX_GDP) * 100 : 0;
          const isCountry = bar.key === "country";
          return (
            <motion.div
              key={bar.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: bar.color }} />
                  <span className={`text-[11px] font-medium ${isCountry ? "text-zinc-200" : "text-zinc-500"}`}>
                    {bar.label}
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-semibold ${isCountry ? "text-zinc-200" : "text-zinc-500"}`}>
                  {bar.gdp > 0 ? `$${bar.gdp.toLocaleString()}` : "—"}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full" style={{ background: bar.trackColor || "rgba(255,255,255,0.04)" }}>
                <div className="absolute inset-0 rounded-full bg-white/[0.03]" />
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(barPct, bar.gdp > 0 ? 1 : 0)}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Descriptor footer */}
      <div className="mt-auto px-5 pb-5 pt-3">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-zinc-400">{descriptor}</p>
          {countryGdp > 0 && ratioToUs < 1 && (
            <p className="mt-1 text-[10px] text-zinc-600">
              Local purchasing power may be significantly higher than GDP suggests.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
