"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import type { Country } from "@/lib/countries";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";
import { getCountryScores } from "@/lib/scoring";
import { countryCodeFromFlagEmoji } from "@/lib/flagUtils";

type MetricOption = {
  id: string;
  label: string;
  getValue: (c: Country, scores: ReturnType<typeof getCountryScores>) => number;
  format: (v: number) => string;
  reverseDomain?: boolean;
};

const parseHeightCm = (h: string) => {
  const match = h.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 170;
  const val = parseFloat(match[1]);
  return val < 3 ? val * 100 : val;
};

const parseGdp = (g: string) => {
  const num = parseInt(g.replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

const METRICS: MetricOption[] = [
  { id: "overall", label: "Overall Passport Score", getValue: (c, s) => s.overall, format: (v) => v.toFixed(0) },
  { id: "dating", label: "Dating Ease Score", getValue: (c, s) => s.dating, format: (v) => v.toFixed(0) },
  { id: "cost", label: "Affordability Score", getValue: (c, s) => s.cost, format: (v) => v.toFixed(0) },
  { id: "internet", label: "Internet Score", getValue: (c, s) => s.internet, format: (v) => v.toFixed(0) },
  { id: "safety", label: "Safety Score", getValue: (c, s) => s.safety, format: (v) => v.toFixed(0) },
  { id: "friendly", label: "Friendly / Receptiveness Score", getValue: (c, s) => s.friendly, format: (v) => v.toFixed(0) },
  { id: "gdp", label: "GDP Per Capita ($)", getValue: (c) => parseGdp(c.gdpPerCapita), format: (v) => `$${v.toLocaleString()}` },
  { id: "heightM", label: "Avg Male Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightMale), format: (v) => `${v.toFixed(1)} cm` },
  { id: "heightF", label: "Avg Female Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightFemale), format: (v) => `${v.toFixed(1)} cm` },
];

const formatTick = (metric: MetricOption, value: number) => {
  if (metric.id === "gdp") {
    if (value >= 100000) return `$${Math.round(value / 1000)}k`;
    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
    return `$${Math.round(value)}`;
  }
  if (["overall", "dating", "cost", "internet", "safety", "friendly"].includes(metric.id)) return value.toFixed(0);
  if (metric.id === "heightM" || metric.id === "heightF") return value.toFixed(0);
  return metric.format(value);
};

export default function ChartsClient({ countries }: { countries: Country[] }) {
  const [metricId, setMetricId] = useState<string>("dating");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions((d) => ({ ...d, width: w }));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const metric = METRICS.find((m) => m.id === metricId)!;

  const { rows, usValue, valueMin, valueMax } = useMemo(() => {
    const withScores = countries.map((c) => {
      const scores = getCountryScores(c);
      const value = metric.getValue(c, scores);
      return { country: c, value };
    }).filter((r) => !isNaN(r.value));

    const us = withScores.find((r) => r.country.slug === "usa");
    const usValue = us?.value ?? 0;

    const values = withScores.map((r) => r.value);
    let valueMin = Math.min(...values);
    let valueMax = Math.max(...values);
    const pad = (valueMax - valueMin) * 0.05 || 1;
    valueMin = Math.min(valueMin, usValue) - pad;
    valueMax = Math.max(valueMax, usValue) + pad;

    const rows = [...withScores].sort((a, b) => b.value - a.value);

    return { rows, usValue, valueMin, valueMax };
  }, [countries, metric]);

  const isMobile = dimensions.width < 640;
  const padding = { top: 50, right: isMobile ? 50 : 80, bottom: 24, left: isMobile ? 36 : 140 };
  const graphWidth = dimensions.width - padding.left - padding.right;
  const rowHeight = 22;
  const graphHeight = rows.length * rowHeight;
  const contentHeight = padding.top + graphHeight + padding.bottom;
  const viewportHeight = Math.min(620, Math.max(380, contentHeight));

  const getX = (val: number) => padding.left + ((val - valueMin) / (valueMax - valueMin)) * graphWidth;

  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = (valueMax - valueMin) / 5;
    for (let i = 0; i <= 5; i++) ticks.push(valueMin + step * i);
    return ticks;
  }, [valueMin, valueMax]);

  return (
    <div className="w-full">
      {/* Single metric selector */}
      <div className="mb-4 flex flex-col items-stretch gap-2 text-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-center">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-zinc-500 sm:text-sm">Metric:</span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={metricId}
              onChange={(e) => setMetricId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-3 pr-8 text-xs text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50 sm:w-auto sm:min-w-[220px] sm:py-1.5 sm:text-sm"
            >
              {METRICS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
        <p className="text-[11px] text-zinc-500 sm:text-xs">
          Countries compared on one metric. Vertical line = <strong className="text-zinc-400">US (reference)</strong>.
        </p>
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto rounded-2xl border border-zinc-800/80 bg-[#111113] shadow-2xl"
        style={{ height: viewportHeight }}
      >
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: viewportHeight }}>
          <div className="relative w-full" style={{ width: dimensions.width, minHeight: contentHeight }}>
          <svg width={dimensions.width} height={contentHeight} className="block font-sans">
          <defs>
            <linearGradient id="usRefGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0)" />
              <stop offset="50%" stopColor="rgba(251, 191, 36, 0.35)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
            </linearGradient>
          </defs>

          {/* Grid lines (vertical ticks for value axis) */}
          {xTicks.map((tick, i) => {
            const tx = getX(tick);
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={tx}
                  y1={padding.top}
                  x2={tx}
                  y2={padding.top + graphHeight}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={tx}
                  y={padding.top + graphHeight + 18}
                  fill="#71717a"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {formatTick(metric, tick)}
                </text>
              </g>
            );
          })}

          {/* US reference line (vertical, in the middle of the value range) */}
          {rows.length > 0 && (
            <g>
              <rect
                x={getX(usValue) - 1}
                y={padding.top}
                width={2}
                height={graphHeight}
                fill="url(#usRefGrad)"
              />
              <line
                x1={getX(usValue)}
                y1={padding.top}
                x2={getX(usValue)}
                y2={padding.top + graphHeight}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={getX(usValue)}
                y={padding.top - 10}
                fill="#fbbf24"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                US (reference)
              </text>
            </g>
          )}

          {/* Axis label */}
          <text
            x={padding.left + graphWidth / 2}
            y={contentHeight - 6}
            fill="#a1a1aa"
            fontSize={isMobile ? 9 : 11}
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            {metric.label.toUpperCase()}
          </text>
          </svg>

          {/* Country rows: flag + name + bar (overlay) */}
          <div className="absolute inset-0">
            <div className="relative w-full" style={{ height: contentHeight }}>
          {rows.map((row, i) => {
            const xEnd = getX(row.value);
            const isUs = row.country.slug === "usa";
            const isHovered = hoveredSlug === row.country.slug;
            const flagCode =
              COUNTRY_FLAG_CODE[row.country.slug] ??
              countryCodeFromFlagEmoji(row.country.flagEmoji);
            const y = padding.top + i * rowHeight + rowHeight / 2;

            return (
              <motion.div
                key={row.country.slug}
                className="absolute left-0 right-0 flex items-center cursor-default"
                style={{
                  top: padding.top + i * rowHeight,
                  height: rowHeight,
                  paddingLeft: padding.left,
                  paddingRight: padding.right,
                }}
                onMouseEnter={() => setHoveredSlug(row.country.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {/* Flag */}
                <div
                  className="absolute left-2 flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 sm:left-4"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  {flagCode ? (
                    <ReactCountryFlag countryCode={flagCode} svg style={{ width: "1.1em", height: "1.1em" }} />
                  ) : row.country.flagEmoji ? (
                    <span className="text-[13px] leading-none">
                      {row.country.flagEmoji}
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold text-zinc-500">{row.country.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Country name */}
                <div
                  className="absolute left-8 flex items-center sm:left-12"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <span
                    className={`truncate text-[10px] sm:text-xs ${isUs ? "font-bold text-amber-400" : "text-zinc-400"} ${isHovered ? "text-zinc-200" : ""}`}
                    style={{ maxWidth: isMobile ? 72 : 120 }}
                  >
                    {row.country.name}
                  </span>
                </div>

                {/* Bar from left to value */}
                <div
                  className="absolute h-2 overflow-hidden rounded-r"
                  style={{
                    left: padding.left,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: xEnd - padding.left,
                    background: isUs
                      ? "linear-gradient(90deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.5) 100%)"
                      : isHovered
                        ? "linear-gradient(90deg, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.7) 100%)"
                        : "linear-gradient(90deg, rgba(113,113,122,0.2) 0%, rgba(113,113,122,0.4) 100%)",
                  }}
                />

                {/* Value label at end of bar */}
                <div
                  className="absolute flex items-center text-[9px] font-bold tabular-nums text-zinc-300 sm:text-[10px]"
                  style={{
                    left: xEnd + 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {metric.format(row.value)}
                </div>
              </motion.div>
            );
          })}
            </div>
          </div>
        </div>

        {/* Tooltip on hover */}
        <AnimatePresence>
          {hoveredSlug && (() => {
            const row = rows.find((r) => r.country.slug === hoveredSlug);
            if (!row) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="pointer-events-none absolute z-20 rounded-lg border border-zinc-700/60 bg-zinc-950/95 px-3 py-2 shadow-xl backdrop-blur"
                style={{
                  left: Math.min(getX(row.value) + 12, dimensions.width - 180),
                  top: padding.top + rows.findIndex((r) => r.country.slug === hoveredSlug) * rowHeight - 36,
                }}
              >
                <div className="flex items-center gap-2">
                  {COUNTRY_FLAG_CODE[row.country.slug] && (
                    <ReactCountryFlag
                      countryCode={COUNTRY_FLAG_CODE[row.country.slug]}
                      svg
                      style={{ width: "1em", height: "1em" }}
                    />
                  )}
                  <span className="text-xs font-bold text-white">{row.country.name}</span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-400">
                  {metric.label}: <span className="font-semibold text-emerald-400">{metric.format(row.value)}</span>
                  {row.country.slug !== "usa" && (
                    <span className="ml-1 text-zinc-500">
                      (US: {metric.format(usValue)})
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
