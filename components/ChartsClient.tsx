"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import type { Country } from "@/lib/countries";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";
import { getCountryScores } from "@/lib/scoring";

type MetricOption = {
  id: string;
  label: string;
  getValue: (c: Country, scores: ReturnType<typeof getCountryScores>) => number;
  format: (v: number) => string;
  reverseDomain?: boolean; // If true, lower is better (e.g. rank)
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

const formatAxisTickLabel = (metric: MetricOption, value: number) => {
  if (metric.id === "gdp") {
    if (value >= 100000) return `$${Math.round(value / 1000)}k`;
    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
    return `$${Math.round(value)}`;
  }

  if (metric.id === "overall" || metric.id === "dating" || metric.id === "cost" || metric.id === "internet" || metric.id === "safety" || metric.id === "friendly") {
    return value.toFixed(0);
  }

  if (metric.id === "heightM" || metric.id === "heightF") {
    return value.toFixed(0);
  }

  return metric.format(value);
};

const METRICS: MetricOption[] = [
  { id: "overall", label: "Overall Passport Score", getValue: (c, s) => s.overall, format: (v) => v.toFixed(0) },
  { id: "dating", label: "Dating Ease Score", getValue: (c) => c.datingEaseScore, format: (v) => v.toFixed(0) },
  { id: "cost", label: "Affordability Score", getValue: (c, s) => s.cost, format: (v) => v.toFixed(0) },
  { id: "internet", label: "Internet Score", getValue: (c, s) => s.internet, format: (v) => v.toFixed(0) },
  { id: "safety", label: "Safety Score", getValue: (c, s) => s.safety, format: (v) => v.toFixed(0) },
  { id: "friendly", label: "Friendly / Receptiveness Score", getValue: (c, s) => s.friendly, format: (v) => v.toFixed(0) },
  { id: "gdp", label: "GDP Per Capita ($)", getValue: (c) => parseGdp(c.gdpPerCapita), format: (v) => `$${v.toLocaleString()}` },
  { id: "heightM", label: "Avg Male Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightMale), format: (v) => `${v.toFixed(1)} cm` },
  { id: "heightF", label: "Avg Female Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightFemale), format: (v) => `${v.toFixed(1)} cm` },
];

export default function ChartsClient({ countries }: { countries: Country[] }) {
  const [xAxisId, setXAxisId] = useState<string>("gdp");
  const [yAxisId, setYAxisId] = useState<string>("overall");
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions({
          width: w,
          height: w < 640 ? Math.max(350, window.innerHeight * 0.5) : Math.max(500, window.innerHeight * 0.6),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const xMetric = METRICS.find((m) => m.id === xAxisId)!;
  const yMetric = METRICS.find((m) => m.id === yAxisId)!;

  const dataPoints = useMemo(() => {
    return countries.map((c) => {
      const scores = getCountryScores(c);
      return {
        country: c,
        x: xMetric.getValue(c, scores),
        y: yMetric.getValue(c, scores),
      };
    }).filter(p => !isNaN(p.x) && !isNaN(p.y));
  }, [countries, xMetric, yMetric]);

  const { xMin, xMax, yMin, yMax, trendline } = useMemo(() => {
    if (dataPoints.length === 0) return { xMin: 0, xMax: 100, yMin: 0, yMax: 100, trendline: null };
    
    const xs = dataPoints.map(p => p.x);
    const ys = dataPoints.map(p => p.y);
    
    let xMin = Math.min(...xs);
    let xMax = Math.max(...xs);
    let yMin = Math.min(...ys);
    let yMax = Math.max(...ys);

    // Padding
    const xPad = (xMax - xMin) * 0.05 || 10;
    const yPad = (yMax - yMin) * 0.05 || 10;
    
    xMin -= xPad;
    xMax += xPad;
    yMin -= yPad;
    yMax += yPad;

    // Linear Regression
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = dataPoints.length;
    for (const p of dataPoints) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const y1 = slope * xMin + intercept;
    const y2 = slope * xMax + intercept;

    return { xMin, xMax, yMin, yMax, trendline: { x1: xMin, y1, x2: xMax, y2 } };
  }, [dataPoints]);

  const isMobile = dimensions.width < 640;
  const padding = isMobile
    ? { top: 30, right: 16, bottom: 50, left: 44 }
    : { top: 40, right: 120, bottom: 60, left: 60 };
  const graphWidth = dimensions.width - padding.left - padding.right;
  const graphHeight = dimensions.height - padding.top - padding.bottom;

  const getX = (val: number) => padding.left + ((val - xMin) / (xMax - xMin)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - yMin) / (yMax - yMin)) * graphHeight;

  // Generate nice ticks
  const xTicks = useMemo(() => {
    const ticks = [];
    const step = (xMax - xMin) / 5;
    for (let i = 0; i <= 5; i++) ticks.push(xMin + step * i);
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (yMax - yMin) / 5;
    for (let i = 0; i <= 5; i++) ticks.push(yMin + step * i);
    return ticks;
  }, [yMin, yMax]);

  return (
    <div className="w-full">
      {/* Selectors */}
      <div className="mb-4 flex flex-col items-stretch gap-2 text-sm sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-zinc-500 sm:text-sm">X-Axis:</span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={xAxisId}
              onChange={(e) => setXAxisId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-3 pr-8 text-xs text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50 sm:w-auto sm:py-1.5 sm:text-sm"
            >
              {METRICS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <span className="hidden text-zinc-700 sm:block">vs</span>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-zinc-500 sm:text-sm">Y-Axis:</span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={yAxisId}
              onChange={(e) => setYAxisId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-3 pr-8 text-xs text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50 sm:w-auto sm:py-1.5 sm:text-sm"
            >
              {METRICS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={containerRef} 
        className="relative w-full rounded-2xl border border-zinc-800/80 bg-[#111113] shadow-2xl overflow-hidden"
        style={{ height: dimensions.height }}
      >
        <svg width={dimensions.width} height={dimensions.height} className="block font-sans">
          <defs>
            <linearGradient id="trendlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.08)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.4)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.08)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines X */}
          {xTicks.map((tick, i) => {
            const tx = getX(tick);
            const ty = dimensions.height - padding.bottom + 22;
            return (
              <g key={`x-tick-${i}`}>
                <line
                  x1={tx}
                  y1={padding.top}
                  x2={tx}
                  y2={dimensions.height - padding.bottom}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="#71717a"
                  fontSize="9"
                  textAnchor="end"
                  transform={`rotate(-32 ${tx} ${ty})`}
                >
                  {formatAxisTickLabel(xMetric, tick)}
                </text>
              </g>
            );
          })}

          {/* Grid lines Y */}
          {yTicks.map((tick, i) => (
            <g key={`y-tick-${i}`}>
              <line 
                x1={padding.left} y1={getY(tick)} 
                x2={dimensions.width - padding.right} y2={getY(tick)} 
                stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" 
              />
              <text
                x={padding.left - 12}
                y={getY(tick) + 3}
                fill="#71717a"
                fontSize="9"
                textAnchor="end"
              >
                {formatAxisTickLabel(yMetric, tick)}
              </text>
            </g>
          ))}

          {/* Axis Labels */}
          <text 
            x={padding.left + graphWidth / 2} 
            y={dimensions.height - (isMobile ? 8 : 15)} 
            fill="#a1a1aa" fontSize={isMobile ? 9 : 12} fontWeight="600" textAnchor="middle" letterSpacing="0.05em"
          >
            {xMetric.label.toUpperCase()}
          </text>

          <text 
            x={- (padding.top + graphHeight / 2)} 
            y={isMobile ? 10 : 20} 
            transform="rotate(-90)"
            fill="#a1a1aa" fontSize={isMobile ? 9 : 12} fontWeight="600" textAnchor="middle" letterSpacing="0.05em"
          >
            {yMetric.label.toUpperCase()}
          </text>

          {/* Trendline */}
          {trendline && (
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              x1={getX(trendline.x1)}
              y1={getY(trendline.y1)}
              x2={getX(trendline.x2)}
              y2={getY(trendline.y2)}
              stroke="url(#trendlineGrad)"
              strokeWidth="2"
            />
          )}

          {/* Hover crosshairs rendered in SVG */}
          {hoveredPoint && (() => {
            const px = getX(hoveredPoint.x);
            const py = getY(hoveredPoint.y);
            return (
              <g>
                <line x1={px} y1={py} x2={px} y2={dimensions.height - padding.bottom} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                <line x1={px} y1={py} x2={padding.left} y2={py} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              </g>
            );
          })()}
        </svg>

        {/* HTML Flag Overlay — positioned above the SVG */}
        {dataPoints.map((point) => {
          const px = getX(point.x);
          const py = getY(point.y);
          const isHovered = hoveredPoint?.country.slug === point.country.slug;
          const flagCode = COUNTRY_FLAG_CODE[point.country.slug];
          const size = isMobile ? 20 : 26;

          return (
            <motion.div
              key={point.country.slug}
              className="absolute flex flex-col items-center"
              style={{
                left: px - size / 2,
                top: py - size / 2,
                width: size,
                height: size,
                zIndex: isHovered ? 15 : 5,
              }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              onTouchStart={() => setHoveredPoint(hoveredPoint?.country.slug === point.country.slug ? null : point)}
            >
              {/* Country name label — above flag on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="pointer-events-none absolute -top-5 whitespace-nowrap rounded bg-zinc-900/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-100 shadow-lg"
                  >
                    {point.country.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Flag circle */}
              <div
                className={`flex cursor-crosshair items-center justify-center rounded-full border-2 transition-all duration-150 ${
                  isHovered
                    ? "scale-[1.4] border-emerald-400 shadow-lg shadow-emerald-500/30"
                    : "border-zinc-700/50 hover:border-zinc-500"
                }`}
                style={{ width: size, height: size, background: "#18181b" }}
              >
                {flagCode ? (
                  <div className="flex items-center justify-center overflow-hidden rounded-full" style={{ width: size - 4, height: size - 4 }}>
                    <ReactCountryFlag
                      countryCode={flagCode}
                      svg
                      style={{ width: "1.6em", height: "1.6em", display: "block" }}
                    />
                  </div>
                ) : (
                  <span className="text-[8px] font-bold text-zinc-500">
                    {point.country.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Hover Tooltip Overlay */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-none absolute z-30 flex min-w-[200px] flex-col rounded-xl border border-zinc-700/50 bg-zinc-950/92 p-4 shadow-2xl backdrop-blur-xl"
              style={{
                left: isMobile
                  ? Math.max(8, Math.min(getX(hoveredPoint.x) - 90, dimensions.width - 216))
                  : Math.min(getX(hoveredPoint.x) + 20, dimensions.width - 230),
                top: isMobile
                  ? Math.max(8, getY(hoveredPoint.y) - 120)
                  : Math.min(getY(hoveredPoint.y) - 30, dimensions.height - 130),
              }}
            >
              <div className="flex items-center gap-2.5">
                {COUNTRY_FLAG_CODE[hoveredPoint.country.slug] && (
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
                    <ReactCountryFlag
                      countryCode={COUNTRY_FLAG_CODE[hoveredPoint.country.slug]}
                      svg
                      style={{ width: "1.2em", height: "1.2em" }}
                    />
                  </div>
                )}
                <div>
                  <span className="text-sm font-bold text-white">{hoveredPoint.country.name}</span>
                  <span className="ml-2 text-[10px] text-zinc-500">{hoveredPoint.country.region}</span>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">{xMetric.label}</span>
                  <span className="font-bold tabular-nums text-emerald-400">
                    {xMetric.format(hoveredPoint.x)}
                  </span>
                </div>
                <div className="h-px bg-zinc-800/60" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">{yMetric.label}</span>
                  <span className="font-bold tabular-nums text-emerald-400">
                    {yMetric.format(hoveredPoint.y)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}