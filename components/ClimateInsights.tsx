"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Sun, Moon, ChevronDown, Thermometer, MapPin } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import SourceLink from "@/components/SourceLink";
import { getCitiesForCountry, type CityClimate } from "@/lib/cityClimateData";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Props = {
  slug: string;
  countryName: string;
  climate: string;
  hasBeach: boolean;
  hasNature: boolean;
};

type TempView = "avg" | "day" | "night" | "all";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const SOUTHERN_HEMISPHERE = new Set([
  "argentina","brazil","chile","australia","south-africa","tanzania","indonesia",
  "peru","new-zealand","uruguay","paraguay","bolivia","ecuador",
]);

/** scale = react-simple-maps projectionConfig scale (higher = more zoomed in) */
const MAP_VIEW: Record<string, { center: [number, number]; scale: number }> = {
  // Asia
  philippines:          { center: [122, 12],    scale: 1400 },
  thailand:             { center: [101, 13],    scale: 1200 },
  indonesia:            { center: [118, -2],    scale:  700 },
  vietnam:              { center: [107, 16],    scale: 1400 },
  cambodia:             { center: [105, 12.5],  scale: 2200 },
  malaysia:             { center: [112, 4],     scale: 1000 },
  india:                { center: [80, 22],     scale:  800 },
  japan:                { center: [138, 37],    scale: 1200 },
  "south-korea":        { center: [128, 36],    scale: 2400 },
  china:                { center: [105, 35],    scale:  550 },
  // Americas
  usa:                  { center: [-97, 38],    scale:  620 },
  canada:               { center: [-96, 60],    scale:  430 },
  mexico:               { center: [-102, 24],   scale:  950 },
  colombia:             { center: [-74, 4],     scale: 1100 },
  brazil:               { center: [-52, -10],   scale:  580 },
  argentina:            { center: [-65, -35],   scale:  650 },
  peru:                 { center: [-75, -9],    scale: 1050 },
  "costa-rica":         { center: [-84, 10],    scale: 3000 },
  "dominican-republic": { center: [-70, 19],    scale: 3200 },
  // Europe
  uk:                   { center: [-2, 54],     scale: 1500 },
  france:               { center: [2.5, 46.5],  scale: 1500 },
  germany:              { center: [10.5, 51.2], scale: 1800 },
  italy:                { center: [12.5, 42],   scale: 1400 },
  portugal:             { center: [-8, 39.5],   scale: 2200 },
  greece:               { center: [23, 38.5],   scale: 1800 },
  spain:                { center: [-3.5, 40],   scale: 1500 },
  poland:               { center: [19.5, 52],   scale: 1800 },
  ukraine:              { center: [32, 49],     scale: 1300 },
  russia:               { center: [60, 63],     scale:  280 },
  turkey:               { center: [35, 39],     scale: 1300 },
  // Africa & Middle East
  morocco:              { center: [-5.5, 32],   scale: 1600 },
  egypt:                { center: [30, 27],     scale: 1100 },
  kenya:                { center: [38, -1],     scale: 1500 },
  nigeria:              { center: [8, 9],       scale: 1200 },
  "saudi-arabia":       { center: [45, 24],     scale:  900 },
  // Africa south
  "south-africa":       { center: [25, -29],    scale: 1100 },
  // Oceania
  australia:            { center: [134, -26],   scale:  470 },
};

function tempColor(c: number): string {
  if (c <= 0)  return "#93c5fd";
  if (c <= 5)  return "#60a5fa";
  if (c <= 10) return "#38bdf8";
  if (c <= 15) return "#34d399";
  if (c <= 20) return "#86efac";
  if (c <= 24) return "#fde68a";
  if (c <= 27) return "#fbbf24";
  if (c <= 30) return "#f97316";
  if (c <= 34) return "#ef4444";
  return "#dc2626";
}

function tempColorOpaque(c: number, opacity = 0.18): string {
  const hex = tempColor(c);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function tempLabel(c: number): string {
  if (c <= 0)  return "Freezing";
  if (c <= 10) return "Cold";
  if (c <= 16) return "Cool";
  if (c <= 22) return "Mild";
  if (c <= 27) return "Warm";
  if (c <= 32) return "Hot";
  return "Very Hot";
}

function rotateByHalfYear(values: number[]): number[] {
  return [...values.slice(6), ...values.slice(0, 6)];
}

function hash01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

function buildClimateSeries(climate: string, slug: string, hasBeach: boolean, hasNature: boolean) {
  const profile = climate.toLowerCase();
  const r1 = hash01(`${slug}-a`);
  const r2 = hash01(`${slug}-b`);
  const r3 = hash01(`${slug}-c`);

  const base =
    profile === "tropical"
      ? { mean: 27, amp: 3.2, nightDelta: 6.0, rainBase: 70, rainAmp: 90 }
      : profile === "arid"
        ? { mean: 28, amp: 12, nightDelta: 9.0, rainBase: 4, rainAmp: 6 }
        : profile === "cold"
          ? { mean: 8, amp: 14, nightDelta: 8.5, rainBase: 45, rainAmp: 35 }
          : { mean: 16, amp: 10, nightDelta: 7.0, rainBase: 65, rainAmp: 30 };

  const mean = base.mean + (r1 - 0.5) * (profile === "tropical" ? 2 : profile === "arid" ? 2 : 4);
  const amp  = base.amp  + (r2 - 0.5) * (profile === "tropical" ? 1.2 : profile === "arid" ? 1.5 : 2.5);
  const nightDelta = base.nightDelta + (r3 - 0.5) * 1.8;

  const seasonShift = profile === "tropical" ? 0.5 : profile === "arid" ? 0 : 0;
  const avg = Array.from({ length: 12 }, (_, i) => {
    const t = (i / 12) * Math.PI * 2;
    return Math.round((mean - Math.cos(t + seasonShift) * amp) * 10) / 10;
  });

  const day = avg.map((v, i) => {
    const swing = profile === "tropical" ? 3.2 : profile === "arid" ? 4.5 : profile === "cold" ? 5.0 : 4.2;
    const wobble = Math.sin((i / 12) * Math.PI * 2 + r2) * 0.6;
    return Math.round((v + swing / 2 + wobble) * 10) / 10;
  });
  const night = avg.map((v, i) => {
    const wobble = Math.sin((i / 12) * Math.PI * 2 + r3) * 0.7;
    return Math.round((v - nightDelta / 2 + wobble) * 10) / 10;
  });

  const rain = Array.from({ length: 12 }, (_, i) => {
    const t = (i / 12) * Math.PI * 2;
    const monsoon = profile === "tropical"
      ? Math.max(0, Math.sin(t - 0.6))
      : profile === "arid"
        ? 0.1 + 0.15 * Math.sin(t + 0.5)
        : 0.25 + 0.25 * Math.sin(t + 1.2);
    let v = (base.rainBase + base.rainAmp * monsoon) * (0.85 + r1 * 0.3);
    if (hasBeach && profile !== "arid") v += profile === "tropical" ? 20 : 10;
    if (hasNature && profile !== "arid") v += profile === "tropical" ? 15 : 8;
    return Math.round(Math.max(0, v));
  });

  const rot = (arr: number[]) => SOUTHERN_HEMISPHERE.has(slug) ? rotateByHalfYear(arr) : arr;
  return { day: rot(day), night: rot(night), avg: rot(avg), rain: rot(rain) };
}

function bestMonths(avgTemp: number[], rain: number[]) {
  return avgTemp
    .map((t, i) => ({ i, v: (100 - Math.abs(24 - t) * 3.2) - (rain[i] > 140 ? (rain[i] - 140) * 0.5 : 0) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 4)
    .map((x) => MONTHS[x.i]);
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function cityToSeries(city: CityClimate) {
  return {
    avg:   city.months.map((m) => m.avg),
    day:   city.months.map((m) => m.high),
    night: city.months.map((m) => m.low),
    rain:  city.months.map((m) => m.rain),
  };
}

export default function ClimateInsights({ slug, countryName, climate, hasBeach, hasNature }: Props) {
  const cities = useMemo(() => getCitiesForCountry(slug), [slug]);
  const [selectedCity, setSelectedCity] = useState<string | null>(cities[0]?.name ?? null);
  const [tempView, setTempView] = useState<TempView>("all");
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const activeCity = useMemo(
    () => cities.find((c) => c.name === selectedCity) ?? null,
    [cities, selectedCity],
  );

  const series = useMemo(() => {
    if (activeCity) return cityToSeries(activeCity);
    return buildClimateSeries(climate, slug, hasBeach, hasNature);
  }, [activeCity, climate, slug, hasBeach, hasNature]);

  const { day, night, avg, rain } = series;

  const topMonths = useMemo(() => bestMonths(avg, rain), [avg, rain]);
  const tempMin = Math.min(...night) - 4;
  const tempMax = Math.max(...day) + 4;
  const rainMax = Math.max(...rain) + 30;

  const w = 900;
  const h = 320;
  const padLeft = 48;
  const padRight = 52;
  const padTop = 28;
  const padBottom = 44;
  const plotW = w - padLeft - padRight;
  const plotH = h - padTop - padBottom;

  const toX = (i: number) => padLeft + (i / 11) * plotW;
  const tempToY = (v: number) => padTop + ((tempMax - v) / (tempMax - tempMin)) * plotH;

  const ptsAvg   = avg.map((v, i) => ({ x: toX(i), y: tempToY(v), v }));
  const ptsDay   = day.map((v, i) => ({ x: toX(i), y: tempToY(v), v }));
  const ptsNight = night.map((v, i) => ({ x: toX(i), y: tempToY(v), v }));

  const pathAvg   = smoothPath(ptsAvg);
  const pathDay   = smoothPath(ptsDay);
  const pathNight = smoothPath(ptsNight);

  const bandPath = (() => {
    const top = smoothPath(ptsDay);
    const botPts = [...ptsNight].reverse();
    const bot = smoothPath(botPts);
    const last = ptsDay[ptsDay.length - 1];
    const first = botPts[0];
    return `${top} L ${last.x} ${last.y} L ${first.x} ${first.y} ${bot.replace("M", "L")} Z`;
  })();

  const tempTicks = (() => {
    const range = tempMax - tempMin;
    const step = range <= 20 ? 5 : 10;
    const start = Math.ceil(tempMin / step) * step;
    const ticks = [];
    for (let v = start; v <= tempMax; v += step) ticks.push(v);
    return ticks;
  })();

  const colW = plotW / 12;

  const TEMP_VIEWS: { id: TempView; label: string; icon?: typeof Sun }[] = [
    { id: "all",   label: "Day + Night" },
    { id: "avg",   label: "Average" },
    { id: "day",   label: "Daytime", icon: Sun },
    { id: "night", label: "Night",   icon: Moon },
  ];

  const mapView = MAP_VIEW[slug] ?? { center: [0, 20] as [number, number], scale: 160 };
  const hasCities = cities.length > 0;

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden sm:mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/30 sm:p-5 md:p-6"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-zinc-100 sm:text-base">Climate & Weather</h2>
          <p className="mt-0.5 text-[10px] text-zinc-500 sm:text-[11px]">
            Monthly temperature and rainfall
            {activeCity ? ` · ${activeCity.name}` : ` · ${countryName}`}
            {" · "}<SourceLink sourceKey="climate" className="text-zinc-500" />
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-500"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-3 pb-4 pt-0 sm:px-5 sm:pb-5 md:px-6 md:pb-6">

          {/* City selector: map + pills */}
          {hasCities && (
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start">
              {/* Geographic mini-map */}
              <div className="relative flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/80"
                   style={{ width: "100%", maxWidth: 320, minHeight: 190 }}>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ center: mapView.center, scale: mapView.scale }}
                  style={{ width: "100%", height: 190 }}
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: { fill: "#27272a", stroke: "#52525b", strokeWidth: 0.4, outline: "none" },
                            hover:   { fill: "#27272a", stroke: "#52525b", strokeWidth: 0.4, outline: "none" },
                            pressed: { fill: "#27272a", stroke: "#52525b", strokeWidth: 0.4, outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {cities.map((city) => {
                    const isActive = city.name === selectedCity;
                    const avgAnnual = city.months.reduce((s, m) => s + m.avg, 0) / 12;
                    return (
                      <Marker key={city.name} coordinates={[city.lng, city.lat]}>
                        <circle
                          r={isActive ? 6 : 4}
                          fill={isActive ? tempColor(avgAnnual) : "#52525b"}
                          stroke={isActive ? "#ffffff" : "#3f3f46"}
                          strokeWidth={isActive ? 1.5 : 0.8}
                          style={{ cursor: "pointer", transition: "all 0.15s" }}
                          onClick={() => setSelectedCity(city.name)}
                        />
                        {isActive && (
                          <text
                            textAnchor="middle"
                            y={-10}
                            style={{
                              fontSize: 8,
                              fill: "#e4e4e7",
                              fontFamily: "system-ui",
                              fontWeight: 600,
                              pointerEvents: "none",
                            }}
                          >
                            {city.name}
                          </text>
                        )}
                      </Marker>
                    );
                  })}
                </ComposableMap>

                <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[8px] text-zinc-600">
                  <MapPin className="h-2.5 w-2.5" />
                  <span>Click a city</span>
                </div>
              </div>

              {/* City pill buttons */}
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Select City
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((city) => {
                    const isActive = city.name === selectedCity;
                    const avgAnnual = city.months.reduce((s, m) => s + m.avg, 0) / 12;
                    return (
                      <button
                        key={city.name}
                        onClick={() => setSelectedCity(city.name)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "border-transparent text-zinc-900"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                        style={isActive ? { backgroundColor: tempColor(avgAnnual) } : {}}
                      >
                        <span
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: isActive ? "rgba(0,0,0,0.3)" : tempColor(avgAnnual) }}
                        />
                        {city.name}
                      </button>
                    );
                  })}
                </div>
                {/* Mini legend: color = annual avg temp */}
                {activeCity && (
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-500">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>
                      <span className="font-semibold text-zinc-300">{activeCity.name}</span>
                      {" · "}Annual avg{" "}
                      <span className="font-semibold" style={{ color: tempColor(activeCity.months.reduce((s, m) => s + m.avg, 0) / 12) }}>
                        {(activeCity.months.reduce((s, m) => s + m.avg, 0) / 12).toFixed(1)}°C
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Temp view controls */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {TEMP_VIEWS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTempView(t.id)}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                  tempView === t.id
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {t.icon && <t.icon className="h-3 w-3" />}
                {t.label}
              </button>
            ))}

            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <Thermometer className="h-3 w-3 text-zinc-600" />
              <div className="flex h-2.5 w-28 overflow-hidden rounded-full">
                {["#93c5fd","#38bdf8","#34d399","#86efac","#fde68a","#fbbf24","#f97316","#ef4444","#dc2626"].map((c) => (
                  <div key={c} style={{ flex: 1, backgroundColor: c }} />
                ))}
              </div>
              <div className="flex gap-2 text-[8px] text-zinc-600">
                <span>Cold</span>
                <span>Hot</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCity ?? "country"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-x-auto rounded-xl border border-zinc-800/50 bg-[#080809]"
            >
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="h-[320px] w-full min-w-[600px]"
                onMouseLeave={() => setHoverMonth(null)}
              >
                <defs>
                  <linearGradient id="rainBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                <defs>
                  {avg.map((v, i) => (
                    <linearGradient key={`cgrad-${i}`} id={`cgrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={tempColor(v)} stopOpacity="0.28" />
                      <stop offset="100%" stopColor={tempColor(v)} stopOpacity="0.03" />
                    </linearGradient>
                  ))}
                </defs>

                {avg.map((v, i) => {
                  const x = padLeft + (i / 12) * plotW;
                  const isH = hoverMonth === i;
                  return (
                    <motion.rect
                      key={`col-${i}`}
                      x={x} y={padTop} width={colW} height={plotH}
                      fill={isH ? tempColor(v) : `url(#cgrad-${i})`}
                      fillOpacity={isH ? 0.22 : 1}
                      className="transition-all duration-200"
                    />
                  );
                })}

                {tempTicks.map((v) => {
                  const y = tempToY(v);
                  return (
                    <g key={`grid-${v}`}>
                      <line x1={padLeft} y1={y} x2={w - padRight} y2={y} stroke="#27272a" strokeWidth="0.5" />
                      <text x={padLeft - 8} y={y + 3.5} textAnchor="end" fill={tempColor(v)} fontSize="9" fontFamily="system-ui" opacity={0.8}>{v}°</text>
                    </g>
                  );
                })}

                {rain.map((v, i) => {
                  const x = toX(i);
                  const barW = Math.min(plotW / 14, 34);
                  const barH = (v / rainMax) * plotH;
                  const isH = hoverMonth === i;
                  return (
                    <motion.rect
                      key={`rain-${i}`}
                      x={x - barW / 2} y={padTop + plotH - barH} width={barW} height={barH} rx={3}
                      fill={isH ? "#60a5fa" : "url(#rainBarGrad)"} fillOpacity={isH ? 0.5 : 1}
                      initial={{ height: 0, y: padTop + plotH }}
                      animate={{ height: isOpen ? barH : 0, y: isOpen ? padTop + plotH - barH : padTop + plotH }}
                      transition={{ duration: 0.5, delay: i * 0.025, ease: "easeOut" }}
                    />
                  );
                })}

                {tempView === "all" && (
                  <motion.path d={bandPath} fill="#ffffff" fillOpacity={0.03}
                    initial={{ opacity: 0 }} animate={{ opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.5 }} />
                )}

                {(tempView === "all" || tempView === "night") && (
                  <motion.path d={pathNight} fill="none" stroke="#60a5fa" strokeWidth="1.5"
                    strokeLinecap="round" strokeDasharray="5 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: isOpen ? 1 : 0, opacity: isOpen ? 0.65 : 0 }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                )}

                {(tempView === "all" || tempView === "day") && (
                  <motion.path d={pathDay} fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: isOpen ? 1 : 0, opacity: isOpen ? 0.7 : 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.05 }} />
                )}

                {(tempView === "avg" || tempView === "all") && (
                  <motion.path d={pathAvg} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                )}

                {(tempView === "avg" || tempView === "all") &&
                  ptsAvg.map((p, i) => (
                    <circle key={`dot-${i}`} cx={p.x} cy={p.y}
                      r={hoverMonth === i ? 6 : 3.5} fill={tempColor(p.v)}
                      stroke="#080809" strokeWidth={hoverMonth === i ? 1.5 : 0.5}
                      className="transition-all duration-150" />
                  ))}

                {MONTHS.map((m, i) => {
                  const x = toX(i);
                  const isH = hoverMonth === i;
                  const hitX = padLeft + (i / 12) * plotW;
                  return (
                    <g key={m} onMouseEnter={() => setHoverMonth(i)} onMouseLeave={() => setHoverMonth(null)} style={{ cursor: "pointer" }}>
                      <text x={x} y={h - 12} textAnchor="middle" fill={isH ? tempColor(avg[i]) : "#3f3f46"}
                        fontSize="10" fontWeight={isH ? "700" : "400"} fontFamily="system-ui" pointerEvents="none">{m}</text>
                      {isH && <line x1={x} y1={padTop} x2={x} y2={padTop + plotH} stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="3 3" pointerEvents="none" />}
                      <rect x={hitX} y={padTop} width={colW} height={plotH + padBottom} fill="transparent"
                        style={{ pointerEvents: "all" }}
                        aria-label={`${MONTHS_FULL[i]} – Avg ${avg[i]}°, Day ${day[i]}°, Night ${night[i]}°, Rain ${rain[i]} mm`} />
                    </g>
                  );
                })}

                <text x={w - padRight + 8} y={padTop + 4} textAnchor="start" fill="#27272a" fontSize="8" fontFamily="system-ui">mm</text>

                {hoverMonth != null && (() => {
                  const avgT = avg[hoverMonth];
                  const col = tempColor(avgT);
                  const tx = Math.min(w - padRight - 180, Math.max(padLeft, toX(hoverMonth) - 80));
                  const ty = padTop + 4;
                  return (
                    <g>
                      <rect x={tx} y={ty} width={172} height={92} rx={8} fill="#0a0a0c" fillOpacity={0.95} stroke={col} strokeWidth="0.4" strokeOpacity="0.4" />
                      <text x={tx + 12} y={ty + 18} fill="#e4e4e7" fontSize="11" fontWeight="700" fontFamily="system-ui">{MONTHS_FULL[hoverMonth]}</text>
                      <text x={tx + 120} y={ty + 18} fill={col} fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">{tempLabel(avgT)}</text>
                      <text x={tx + 12} y={ty + 36} fill={col} fontSize="10" fontFamily="system-ui">Avg {avgT}°</text>
                      <text x={tx + 72} y={ty + 36} fill="#f97316" fontSize="10" fontFamily="system-ui">Day {day[hoverMonth]}°</text>
                      <text x={tx + 12} y={ty + 52} fill="#60a5fa" fontSize="10" fontFamily="system-ui">Night {night[hoverMonth]}°</text>
                      <text x={tx + 72} y={ty + 52} fill="#3b82f6" fontSize="10" fontFamily="system-ui">Rain {rain[hoverMonth]} mm</text>
                      <rect x={tx + 12} y={ty + 64} width={148} height={6} rx={3} fill="#1a1a1c" />
                      <motion.rect x={tx + 12} y={ty + 64} width={Math.max(4, ((avgT - tempMin) / (tempMax - tempMin)) * 148)} height={6} rx={3} fill={col} fillOpacity={0.7} />
                      <text x={tx + 12} y={ty + 82} fill="#3f3f46" fontSize="8" fontFamily="system-ui">cold</text>
                      <text x={tx + 148} y={ty + 82} fill="#3f3f46" fontSize="8" fontFamily="system-ui" textAnchor="end">hot</text>
                    </g>
                  );
                })()}
              </svg>

              {hoverMonth != null && (
                <div
                  className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-zinc-700/80 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm"
                  style={{ borderLeftWidth: 3, borderLeftColor: tempColor(avg[hoverMonth]) }}
                >
                  <p className="mb-1.5 text-xs font-bold text-zinc-100">
                    {MONTHS_FULL[hoverMonth]}
                    <span className="ml-2 font-semibold" style={{ color: tempColor(avg[hoverMonth]) }}>
                      {tempLabel(avg[hoverMonth])}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-zinc-400">
                    <span>Avg <span className="font-semibold text-zinc-200">{avg[hoverMonth]}°C</span></span>
                    <span>Day <span className="font-semibold text-orange-400">{day[hoverMonth]}°C</span></span>
                    <span>Night <span className="font-semibold text-sky-400">{night[hoverMonth]}°C</span></span>
                    <span>Rain <span className="font-semibold text-blue-400">{rain[hoverMonth]} mm</span></span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Summary row */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 px-3 py-2.5">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                <Sun className="h-3 w-3" />
                Temperature Range
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold" style={{ color: tempColor(Math.min(...avg)) }}>
                  {Math.min(...avg).toFixed(0)}°
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${tempColor(Math.min(...avg))}, ${tempColor(Math.max(...avg))})` }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: tempColor(Math.max(...avg)) }}>
                  {Math.max(...avg).toFixed(0)}°
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 px-3 py-2.5">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                <CloudRain className="h-3 w-3" />
                Peak Rainfall
              </p>
              <p className="text-xs text-zinc-300">{Math.max(...rain)} mm/month</p>
            </div>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 px-3 py-2.5">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider" style={{ color: tempColor(24) }}>
                Best Months
              </p>
              <div className="flex flex-wrap gap-1">
                {topMonths.map((m) => {
                  const mi = MONTHS.indexOf(m);
                  const t = avg[mi] ?? 22;
                  return (
                    <span key={m} className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ backgroundColor: tempColorOpaque(t, 0.15), color: tempColor(t) }}>
                      {m}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
