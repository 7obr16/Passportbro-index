"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CloudRain, ThermometerSun } from "lucide-react";

type Props = {
  slug: string;
  countryName: string;
  climate: string;
  hasBeach: boolean;
  hasNature: boolean;
};

type MetricMode = "both" | "temperature" | "rainfall";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SOUTHERN_HEMISPHERE = new Set([
  "argentina",
  "brazil",
  "chile",
  "australia",
  "south-africa",
  "tanzania",
  "indonesia",
]);

function rotateByHalfYear(values: number[]): number[] {
  return [...values.slice(6), ...values.slice(0, 6)];
}

function buildClimateSeries(climate: string, slug: string, hasBeach: boolean, hasNature: boolean) {
  const profile = climate.toLowerCase();
  let temp = [24, 25, 27, 29, 31, 32, 32, 31, 30, 28, 26, 24];
  let rain = [40, 35, 45, 70, 110, 160, 180, 170, 130, 90, 60, 45];

  if (profile === "temperate") {
    temp = [7, 9, 12, 16, 20, 24, 27, 27, 23, 18, 12, 8];
    rain = [80, 70, 65, 60, 65, 75, 85, 85, 80, 85, 90, 85];
  } else if (profile === "cold") {
    temp = [-6, -4, 1, 8, 15, 20, 23, 21, 15, 8, 1, -4];
    rain = [45, 40, 40, 45, 55, 70, 90, 85, 65, 60, 55, 50];
  }

  if (hasBeach) {
    rain = rain.map((v, i) => v + (i >= 4 && i <= 9 ? 20 : 10));
  }
  if (hasNature) {
    rain = rain.map((v, i) => v + (i >= 5 && i <= 8 ? 15 : 5));
  }

  if (SOUTHERN_HEMISPHERE.has(slug)) {
    temp = rotateByHalfYear(temp);
    rain = rotateByHalfYear(rain);
  }

  return { temp, rain };
}

function bestMonths(temp: number[], rain: number[]) {
  const score = temp.map((t, i) => {
    const comfort = 100 - Math.abs(24 - t) * 4;
    const rainPenalty = rain[i] > 140 ? (rain[i] - 140) * 0.5 : 0;
    return comfort - rainPenalty;
  });

  const ranked = score
    .map((v, i) => ({ i, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 4)
    .map((x) => MONTHS[x.i]);

  return ranked;
}

export default function ClimateInsights({
  slug,
  countryName,
  climate,
  hasBeach,
  hasNature,
}: Props) {
  const [mode, setMode] = useState<MetricMode>("both");
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);

  const { temp, rain } = useMemo(
    () => buildClimateSeries(climate, slug, hasBeach, hasNature),
    [climate, slug, hasBeach, hasNature],
  );

  const topMonths = useMemo(() => bestMonths(temp, rain), [temp, rain]);
  const tempMin = Math.min(...temp) - 3;
  const tempMax = Math.max(...temp) + 3;
  const rainMax = Math.max(...rain) + 20;

  const w = 900;
  const h = 260;
  const pad = 24;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  const points = temp
    .map((v, i) => {
      const x = pad + (i / 11) * plotW;
      const y = pad + ((tempMax - v) / (tempMax - tempMin)) * plotH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Climate & Weather by Month</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Interactive forecast profile for {countryName}: temperature, rainfall, and seasonality trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["both", "temperature", "rainfall"] as MetricMode[]).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                mode === item
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {item === "both" ? "Both" : item === "temperature" ? "Temperature" : "Rainfall"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-[260px] w-[900px]">
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#3f3f46" strokeWidth="1" />
          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad + (i / 4) * plotH;
            return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#27272a" strokeWidth="1" />;
          })}

          {(mode === "both" || mode === "rainfall") &&
            rain.map((v, i) => {
              const x = pad + (i / 11) * plotW;
              const barW = plotW / 12 - 8;
              const barH = ((v - 0) / rainMax) * (plotH - 10);
              return (
                <motion.rect
                  key={`rain-${i}`}
                  x={x - barW / 2}
                  y={h - pad - barH}
                  width={barW}
                  height={barH}
                  rx={4}
                  fill={hoverMonth === i ? "#38bdf8" : "#0ea5e9"}
                  fillOpacity={hoverMonth === i ? 0.85 : 0.5}
                  initial={{ height: 0, y: h - pad }}
                  animate={{ height: barH, y: h - pad - barH }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                />
              );
            })}

          {(mode === "both" || mode === "temperature") && (
            <>
              <motion.polyline
                points={points}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
              {temp.map((v, i) => {
                const x = pad + (i / 11) * plotW;
                const y = pad + ((tempMax - v) / (tempMax - tempMin)) * plotH;
                return (
                  <circle
                    key={`temp-${i}`}
                    cx={x}
                    cy={y}
                    r={hoverMonth === i ? 6 : 4}
                    fill={hoverMonth === i ? "#fbbf24" : "#f59e0b"}
                  />
                );
              })}
            </>
          )}

          {MONTHS.map((m, i) => {
            const x = pad + (i / 11) * plotW;
            return (
              <g key={m} onMouseEnter={() => setHoverMonth(i)} onMouseLeave={() => setHoverMonth(null)}>
                <rect x={x - 18} y={h - pad} width={36} height={20} fill="transparent" />
                <text x={x} y={h - 8} textAnchor="middle" fill="#a1a1aa" fontSize="10">
                  {m}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ThermometerSun className="h-4 w-4" />
            Temperature Range
          </p>
          <p className="text-sm text-zinc-200">
            {Math.min(...temp)}C to {Math.max(...temp)}C across the year.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-sky-300">
            <CloudRain className="h-4 w-4" />
            Rainfall Profile
          </p>
          <p className="text-sm text-zinc-200">
            Peak monthly rainfall around {Math.max(...rain)} mm.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <p className="mb-1 text-xs font-semibold text-emerald-300">Best Months</p>
          <p className="text-sm text-zinc-200">{topMonths.join(", ")}</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        Notes: This is an interactive climate profile designed for decision support and visual comparison. It blends
        monthly seasonality with each country&apos;s climate type and lifestyle context.
      </p>
    </section>
  );
}

