"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Minus } from "lucide-react";
import { US_BMI_REFERENCE } from "@/lib/bmiData";

type Props = {
  countryName: string;
  countryBmi: number;
};

function getBmiCat(bmi: number) {
  if (bmi < 18.5)
    return { label: "Underweight", color: "#60a5fa", trackColor: "rgba(96,165,250,0.10)" };
  if (bmi < 25)
    return { label: "Normal", color: "#34d399", trackColor: "rgba(52,211,153,0.10)" };
  if (bmi < 30)
    return { label: "Overweight", color: "#fbbf24", trackColor: "rgba(251,191,36,0.10)" };
  return { label: "Obese", color: "#f87171", trackColor: "rgba(248,113,113,0.10)" };
}

const US_BMI = US_BMI_REFERENCE;

const BARS = [
  { key: "world", label: "World Avg", bmi: 24.5, color: "#52525b", trackColor: "rgba(82,82,91,0.12)" },
  { key: "us", label: "US", bmi: US_BMI, color: "#fbbf24", trackColor: "rgba(251,191,36,0.10)" },
] as const;

const MAX_BMI = 36;

export default function BmiComparison({ countryName, countryBmi }: Props) {
  const cat = useMemo(() => getBmiCat(countryBmi), [countryBmi]);
  const usCat = useMemo(() => getBmiCat(US_BMI), []);
  const delta = countryBmi - US_BMI;
  const ratio = US_BMI > 0 ? countryBmi / US_BMI : 0;

  const trendIcon =
    ratio >= 0.95 && ratio <= 1.05
      ? <Minus className="h-3.5 w-3.5" />
      : <TrendingDown className="h-3.5 w-3.5" />;

  const trendColor =
    delta > 2 ? "text-red-400"
    : delta > 0 ? "text-amber-400"
    : delta > -2 ? "text-zinc-400"
    : "text-emerald-400";

  const descriptor =
    delta > 3 ? "Significantly higher BMI than the US"
    : delta > 1 ? "Higher BMI than the US average"
    : delta > -1 ? "Similar BMI to the US average"
    : delta > -3 ? "Lower BMI than the US average"
    : "Significantly lower BMI than the US";

  const allBars = [
    ...BARS,
    {
      key: "country",
      label: countryName,
      bmi: countryBmi,
      color: cat.color,
      trackColor: cat.trackColor,
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
            <svg className="h-3.5 w-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v17" /><path d="M5 10h14" /><path d="M5 14h14" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">BMI Index</p>
            <p className="text-xs font-semibold text-zinc-200">Average BMI vs US</p>
          </div>
        </div>
      </div>

      {/* Key stat */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black tracking-tight text-zinc-100">
            {countryBmi.toFixed(1)}
          </span>
          <span className="text-xs text-zinc-500">BMI</span>
          <span className="ml-0.5 text-sm text-zinc-700">·</span>
          <span className="text-xs font-semibold" style={{ color: cat.color }}>
            {cat.label}
          </span>
        </div>
        {delta !== 0 && (
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${trendColor} bg-white/[0.04]`}
          >
            {trendIcon}
            {Math.abs(delta) < 0.1
              ? "On par"
              : delta > 0
                ? `+${delta.toFixed(1)} vs US`
                : `${delta.toFixed(1)} vs US`}
          </span>
        )}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3 px-5 pb-2">
        {allBars.map((bar, i) => {
          const barPct = (bar.bmi / MAX_BMI) * 100;
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
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: bar.color }}
                  />
                  <span
                    className={`text-[11px] font-medium ${isCountry ? "text-zinc-200" : "text-zinc-500"}`}
                  >
                    {bar.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono font-semibold ${isCountry ? "text-zinc-200" : "text-zinc-500"}`}
                  >
                    {bar.bmi.toFixed(1)}
                  </span>
                  <span
                    className="rounded px-1 py-0.5 text-[8px] font-bold uppercase"
                    style={{
                      color: getBmiCat(bar.bmi).color,
                      background: getBmiCat(bar.bmi).trackColor,
                    }}
                  >
                    {getBmiCat(bar.bmi).label}
                  </span>
                </div>
              </div>
              <div
                className="relative h-2 overflow-hidden rounded-full"
                style={{ background: bar.trackColor }}
              >
                <div className="absolute inset-0 rounded-full bg-white/[0.03]" />
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(barPct, 1)}%` }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.07,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Descriptor footer */}
      <div className="mt-auto px-5 pb-5 pt-3">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-zinc-400">
            {descriptor}
          </p>
          <p className="mt-1 text-[10px] text-zinc-600">
            WHO categories: Normal 18.5–25 · Overweight 25–30 · Obese 30+
          </p>
        </div>
      </div>
    </div>
  );
}
