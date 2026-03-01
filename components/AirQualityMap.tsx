"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  AIR_QUALITY_DATA,
  getAqiCategory,
  type CityAQI,
  type CountryAirQuality,
} from "@/lib/airQualityData";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Props = { slug: string; countryName: string };

const MAP_VIEW: Record<string, { center: [number, number]; zoom: number }> = {
  "philippines":        { center: [122, 12],    zoom: 4.5 },
  "indonesia":          { center: [118, -2],    zoom: 3 },
  "japan":              { center: [138, 37],    zoom: 5 },
  "malaysia":           { center: [109, 4],     zoom: 4 },
  "south-korea":        { center: [128, 36],    zoom: 8 },
  "taiwan":             { center: [121, 23.5],  zoom: 9 },
  "vietnam":            { center: [107, 16],    zoom: 4 },
  "thailand":           { center: [101, 13],    zoom: 5 },
  "cambodia":           { center: [105, 12.5],  zoom: 7 },
  "laos":               { center: [103, 18.5],  zoom: 6 },
  "sri-lanka":          { center: [80.7, 7.8],  zoom: 9 },
  "india":              { center: [79, 22],     zoom: 3.5 },
  "united-arab-emirates": { center: [54, 24],   zoom: 9 },
  "egypt":              { center: [30, 27],     zoom: 4 },
  "turkey":             { center: [35, 39],     zoom: 5 },
  "greece":             { center: [24, 38.5],   zoom: 6 },
  "italy":              { center: [12.5, 42],   zoom: 5 },
  "spain":              { center: [-3.5, 37],   zoom: 5 },
  "portugal":           { center: [-10, 38],    zoom: 6 },
  "croatia":            { center: [16.5, 44],   zoom: 7 },
  "chile":              { center: [-70, -35],   zoom: 2.5 },
  "argentina":          { center: [-64, -38],   zoom: 2.5 },
  "brazil":             { center: [-52, -14],   zoom: 2.5 },
  "mexico":             { center: [-102, 23],   zoom: 3.5 },
  "colombia":           { center: [-74, 4.5],   zoom: 4 },
  "peru":               { center: [-76, -10],   zoom: 4 },
  "costa-rica":         { center: [-84, 10],    zoom: 9 },
  "panama":             { center: [-80, 8.5],   zoom: 9 },
  "ecuador":            { center: [-79, -1.5],  zoom: 4.5 },
  "dominican-republic": { center: [-70, 19],    zoom: 10 },
  "kenya":              { center: [38, -1],     zoom: 5 },
  "tanzania":           { center: [35, -6.5],   zoom: 5 },
  "south-africa":       { center: [25, -29],    zoom: 4 },
  "morocco":            { center: [-6.5, 32],   zoom: 5 },
  "georgia":            { center: [43.5, 42],   zoom: 9 },
  "estonia":            { center: [25.5, 59],   zoom: 10 },
  "malta":              { center: [14.4, 35.9], zoom: 20 },
  "cyprus":             { center: [33.3, 35],   zoom: 14 },
  "montenegro":         { center: [19.3, 42.5], zoom: 12 },
  "albania":            { center: [20, 41],     zoom: 9 },
  "north-macedonia":    { center: [21.7, 41.5], zoom: 12 },
  "mauritius":          { center: [57.5, -20.2],zoom: 16 },
  "hungary":            { center: [19.5, 47],   zoom: 8 },
  "czech-republic":     { center: [15.5, 49.8], zoom: 8 },
  "bulgaria":           { center: [25.5, 42.7], zoom: 8 },
  "serbia":             { center: [21, 44],     zoom: 8 },
  "romania":            { center: [25, 46],     zoom: 6 },
  "poland":             { center: [19.5, 52],   zoom: 6 },
  "guatemala":          { center: [-90.5, 15.5],zoom: 9 },
  "paraguay":           { center: [-58, -23],   zoom: 6 },
  "uruguay":            { center: [-56, -33],   zoom: 7 },
  "usa":                { center: [-98, 39],    zoom: 2.5 },
  "uk":                 { center: [-2, 54],     zoom: 5 },
  "france":             { center: [2.5, 46.5],  zoom: 5 },
  "germany":            { center: [10.5, 51.2], zoom: 6 },
  "australia":          { center: [134, -26],   zoom: 2.5 },
  "canada":             { center: [-95, 56],    zoom: 2 },
  "sweden":             { center: [17, 62],     zoom: 4 },
  "russia":             { center: [55, 55],     zoom: 1.5 },
  "ukraine":            { center: [31, 49],     zoom: 6 },
  "china":              { center: [105, 35],    zoom: 2.5 },
  "pakistan":           { center: [69, 30],     zoom: 4 },
  "kazakhstan":         { center: [68, 48],     zoom: 3 },
  "iran":               { center: [53, 32.5],   zoom: 3.5 },
  "algeria":            { center: [3, 28],      zoom: 3 },
  "libya":              { center: [17, 28],     zoom: 3.5 },
  "mongolia":           { center: [103, 46.5],  zoom: 3 },
  "nigeria":            { center: [8, 9.5],     zoom: 4.5 },
  "rwanda":             { center: [29.9, -1.9], zoom: 12 },
  "uganda":             { center: [32, 1],      zoom: 7 },
  "ethiopia":           { center: [40, 9],      zoom: 4 },
  "bolivia":            { center: [-64.5, -17], zoom: 4 },
  "venezuela":          { center: [-66, 8],     zoom: 4.5 },
  "saudi-arabia":       { center: [44, 24],     zoom: 3.5 },
};

function getView(cities: CityAQI[], slug: string) {
  if (MAP_VIEW[slug]) return MAP_VIEW[slug];
  const lats = cities.map((c) => c.lat);
  const lngs = cities.map((c) => c.lng);
  const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs)) || 5;
  const z = span > 30 ? 2 : span > 15 ? 3 : span > 8 ? 5 : span > 4 ? 7 : 10;
  return { center: [cLng, cLat] as [number, number], zoom: z };
}

const AQI_LEVELS = [
  { level: 1, label: "Good",          range: "0–50",   color: "#22c55e", widthPct: 16.7 },
  { level: 2, label: "Moderate",      range: "51–100",  color: "#eab308", widthPct: 16.7 },
  { level: 3, label: "Sensitive",     range: "101–150", color: "#f97316", widthPct: 16.7 },
  { level: 4, label: "Unhealthy",     range: "151–200", color: "#ef4444", widthPct: 16.7 },
  { level: 5, label: "Very Unhealthy",range: "201–300", color: "#a855f7", widthPct: 16.7 },
  { level: 6, label: "Hazardous",     range: "300+",    color: "#be185d", widthPct: 16.5 },
];

function dotR(aqi: number) {
  return aqi <= 50 ? 6 : aqi <= 100 ? 7 : aqi <= 150 ? 8 : aqi <= 200 ? 9 : 10;
}

export default function AirQualityMap({ slug, countryName }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [hovered, setHovered] = useState<CityAQI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const data: CountryAirQuality | null = AIR_QUALITY_DATA[slug] ?? null;
  const sorted = useMemo(() => (data ? [...data.cities].sort((a, b) => a.aqi - b.aqi) : []), [data]);
  const view = useMemo(() => (data ? getView(data.cities, slug) : { center: [0, 0] as [number, number], zoom: 1 }), [data, slug]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  if (!data) return null;

  const oCat = getAqiCategory(data.overall);
  const TrendIcon = data.trend === "improving" ? TrendingUp : data.trend === "worsening" ? TrendingDown : Minus;

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden sm:mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/30 sm:p-5 md:p-6"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-zinc-100 sm:text-base">Air Quality</h2>
          <p className="mt-0.5 text-[10px] text-zinc-500 sm:text-[11px]">
            AQI for {countryName}&apos;s cities and tourist hubs
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden border-t border-zinc-800/40"
          >
            <div className="px-3 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 md:px-6 md:pb-6">

              {/* Overall score + AQI scale */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                {/* Big overall badge */}
                <div
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 shrink-0"
                  style={{ borderColor: `${oCat.color}30`, backgroundColor: `${oCat.color}08` }}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-600">Overall AQI</span>
                    <span className="text-2xl font-black tabular-nums leading-none" style={{ color: oCat.color }}>{data.overall}</span>
                    <span className="text-[10px] font-semibold" style={{ color: oCat.color }}>{oCat.label}</span>
                  </div>
                  <div className="h-10 w-px bg-zinc-800" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-600">{oCat.sublabel}</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`h-3 w-3 ${data.trend === "improving" ? "text-emerald-400" : data.trend === "worsening" ? "text-red-400" : "text-zinc-500"}`} />
                      <span className="text-[9px] capitalize text-zinc-500">{data.trend}</span>
                    </div>
                  </div>
                </div>

                {/* AQI Reference scale */}
                <div className="flex-1">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">AQI Reference Scale (US EPA Standard)</p>
                  <div className="flex h-3 overflow-hidden rounded-full">
                    {AQI_LEVELS.map((lvl) => (
                      <div
                        key={lvl.label}
                        title={`${lvl.label}: ${lvl.range}`}
                        className="transition-opacity"
                        style={{ width: `${lvl.widthPct}%`, backgroundColor: lvl.color, opacity: oCat.level === lvl.level ? 1 : 0.35 }}
                      />
                    ))}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {AQI_LEVELS.map((lvl) => (
                      <div key={lvl.label} className="flex items-center gap-1">
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: lvl.color, opacity: oCat.level === lvl.level ? 1 : 0.4 }}
                        />
                        <span
                          className="text-[8px] font-medium"
                          style={{ color: oCat.level === lvl.level ? lvl.color : "#52525b" }}
                        >
                          {lvl.label} {oCat.level === lvl.level && "← now"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-xl border border-zinc-800/40 bg-[#08080a]"
                onMouseMove={onMove}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ center: view.center, scale: view.zoom * 150 }}
                  width={800}
                  height={420}
                  style={{ width: "100%", height: "auto", display: "block" }}
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#141416"
                          stroke="#1e1e21"
                          strokeWidth={0.3}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {data.cities.map((city) => {
                    const cat = getAqiCategory(city.aqi);
                    const r = dotR(city.aqi);
                    const isH = hovered?.name === city.name;

                    return (
                      <Marker
                        key={city.name}
                        coordinates={[city.lng, city.lat]}
                        onMouseEnter={() => setHovered(city)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <circle r={r * 2.4} fill={cat.color} fillOpacity={isH ? 0.15 : 0.07} className="transition-all duration-200" />
                        <circle
                          r={isH ? r + 2 : r}
                          fill={cat.color}
                          fillOpacity={isH ? 0.9 : 0.75}
                          stroke={isH ? "#fff" : cat.trackColor}
                          strokeWidth={isH ? 1.5 : 0.8}
                          strokeOpacity={isH ? 0.8 : 0.4}
                          className="cursor-pointer transition-all duration-150"
                        />
                        <text
                          textAnchor="middle"
                          y={3.5}
                          fill="#fff"
                          fontSize={isH ? 8 : 6.5}
                          fontWeight="700"
                          fontFamily="system-ui, sans-serif"
                          className="pointer-events-none select-none"
                          opacity={0.95}
                        >
                          {city.aqi}
                        </text>
                        {isH && (
                          <>
                            <line x1={0} y1={-(r + 3)} x2={0} y2={-(r + 10)} stroke="#52525b" strokeWidth={0.6} />
                            <rect
                              x={-city.name.length * 2.8 - 6}
                              y={-(r + 26)}
                              width={city.name.length * 5.6 + 12}
                              height={16}
                              rx={4}
                              fill="#18181b"
                              fillOpacity={0.95}
                              stroke={cat.color}
                              strokeWidth={0.5}
                              strokeOpacity={0.5}
                            />
                            <text
                              textAnchor="middle"
                              y={-(r + 14)}
                              fill="#e4e4e7"
                              fontSize={9}
                              fontWeight="600"
                              fontFamily="system-ui, sans-serif"
                              className="pointer-events-none select-none"
                            >
                              {city.name}
                            </text>
                          </>
                        )}
                      </Marker>
                    );
                  })}
                </ComposableMap>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hovered && (() => {
                    const hcat = getAqiCategory(hovered.aqi);
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.1 }}
                        className="pointer-events-none absolute z-20 rounded-xl border bg-zinc-950/96 p-3.5 shadow-2xl backdrop-blur-md"
                        style={{
                          width: 210,
                          left: Math.min(mousePos.x + 18, (containerRef.current?.offsetWidth ?? 700) - 225),
                          top: Math.max(mousePos.y - 70, 8),
                          borderColor: `${hcat.color}30`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-zinc-100">{hovered.name}</p>
                          <span
                            className="shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold"
                            style={{ backgroundColor: `${hcat.color}15`, color: hcat.color }}
                          >
                            {hcat.label}
                          </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black tabular-nums" style={{ color: hcat.color }}>
                            {hovered.aqi}
                          </span>
                          <span className="text-[10px] text-zinc-600">AQI</span>
                        </div>
                        {/* Mini scale bar showing where this AQI falls */}
                        <div className="mt-2 flex h-2 overflow-hidden rounded-full">
                          {AQI_LEVELS.map((lvl) => (
                            <div
                              key={lvl.label}
                              style={{
                                width: `${lvl.widthPct}%`,
                                backgroundColor: lvl.color,
                                opacity: hcat.level === lvl.level ? 1 : 0.2,
                              }}
                            />
                          ))}
                        </div>
                        {hovered.tourismNote && (
                          <p className="mt-2 text-[9px] leading-snug text-zinc-500">{hovered.tourismNote}</p>
                        )}
                        <p className="mt-1.5 text-[9px] text-zinc-700">{hcat.sublabel}</p>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* City cards */}
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((city) => {
                  const cat = getAqiCategory(city.aqi);
                  const isH = hovered?.name === city.name;
                  return (
                    <div
                      key={city.name}
                      onMouseEnter={() => setHovered(city)}
                      onMouseLeave={() => setHovered(null)}
                      className="flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors cursor-default"
                      style={{
                        borderColor: isH ? `${cat.color}40` : "rgba(39,39,42,0.4)",
                        backgroundColor: isH ? `${cat.color}08` : "rgba(9,9,11,0.4)",
                      }}
                    >
                      {/* Color-coded AQI chip */}
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black tabular-nums"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}25` }}
                      >
                        {city.aqi}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-zinc-200">{city.name}</p>
                        {city.tourismNote && <p className="truncate text-[9px] text-zinc-600">{city.tourismNote}</p>}
                      </div>
                      <span className="shrink-0 text-[8px] font-semibold" style={{ color: cat.color }}>{cat.label}</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2.5 text-[9px] text-zinc-700">
                Annual median AQI — IQAir / WHO data. Based on US EPA standard scale.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
