"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import type { Country } from "@/lib/countries";
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
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(500, window.innerHeight * 0.6),
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

  const padding = { top: 40, right: 120, bottom: 60, left: 60 };
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
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">X-Axis:</span>
          <div className="relative">
            <select
              value={xAxisId}
              onChange={(e) => setXAxisId(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-8 text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50"
            >
              {METRICS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <span className="text-zinc-700">vs</span>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Y-Axis:</span>
          <div className="relative">
            <select
              value={yAxisId}
              onChange={(e) => setYAxisId(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-8 text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50"
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
            y={dimensions.height - 15} 
            fill="#a1a1aa" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="0.05em"
          >
            {xMetric.label.toUpperCase()}
          </text>

          <text 
            x={- (padding.top + graphHeight / 2)} 
            y={20} 
            transform="rotate(-90)"
            fill="#a1a1aa" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="0.05em"
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

          {/* Data Points */}
          {dataPoints.map((point, i) => {
            const px = getX(point.x);
            const py = getY(point.y);
            const isHovered = hoveredPoint?.country.slug === point.country.slug;
            
            return (
              <g 
                key={point.country.slug}
                className="cursor-crosshair outline-none"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Invisible larger hit area */}
                <circle cx={px} cy={py} r="15" fill="transparent" />
                
                {/* Connecting line to axes on hover */}
                {isHovered && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <line x1={px} y1={py} x2={px} y2={dimensions.height - padding.bottom} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                    <line x1={px} y1={py} x2={padding.left} y2={py} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                  </motion.g>
                )}

                {/* Dot */}
                <motion.circle
                  initial={{ cx: px, cy: py, r: 0 }}
                  animate={{ 
                    cx: px, 
                    cy: py, 
                    r: isHovered ? 6 : 3,
                    fill: isHovered ? "#34d399" : "#10b981"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  filter={isHovered ? "url(#glow)" : undefined}
                />

                {/* Country label (only on hover to avoid overlap) */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    fill: isHovered ? "#ffffff" : "#a1a1aa",
                    fontWeight: isHovered ? "700" : "400"
                  }}
                  x={px + 6}
                  y={py + 3}
                  fontSize="8"
                  style={{ pointerEvents: "none" }}
                  className="uppercase tracking-wider"
                >
                  {point.country.name}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-none absolute z-20 flex min-w-[200px] flex-col rounded-xl border border-zinc-700/50 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-md"
              style={{
                left: Math.min(getX(hoveredPoint.x) + 15, dimensions.width - 220),
                top: Math.min(getY(hoveredPoint.y) + 15, dimensions.height - 120),
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredPoint.country.flagEmoji}</span>
                <span className="font-bold text-white">{hoveredPoint.country.name}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between gap-4 border-b border-zinc-800/60 pb-1">
                  <span>{xMetric.label}</span>
                  <span className="font-semibold text-emerald-400">
                    {xMetric.format(hoveredPoint.x)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 pt-0.5">
                  <span>{yMetric.label}</span>
                  <span className="font-semibold text-emerald-400">
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