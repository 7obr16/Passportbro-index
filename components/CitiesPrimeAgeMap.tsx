"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  getCitiesForCountry,
  getAllCitiesWithRatio,
  type CityPrimeAge,
} from "@/lib/citiesPrimeAge";
import SourceLink from "@/components/SourceLink";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MAP_VIEW: Record<string, { center: [number, number]; zoom: number }> = {
  philippines: { center: [122, 12], zoom: 4.5 },
  thailand: { center: [101, 13], zoom: 5 },
  indonesia: { center: [118, -2], zoom: 3 },
  vietnam: { center: [107, 16], zoom: 4 },
  colombia: { center: [-74, 4.5], zoom: 4 },
  mexico: { center: [-102, 23], zoom: 3.5 },
  brazil: { center: [-52, -14], zoom: 2.5 },
  argentina: { center: [-64, -38], zoom: 2.5 },
  peru: { center: [-76, -10], zoom: 4 },
  "costa-rica": { center: [-84, 10], zoom: 9 },
  "dominican-republic": { center: [-70, 19], zoom: 10 },
  cambodia: { center: [105, 12.5], zoom: 7 },
  malaysia: { center: [109, 4], zoom: 4 },
  india: { center: [79, 22], zoom: 3.5 },
  japan: { center: [138, 37], zoom: 5 },
  "south-korea": { center: [128, 36], zoom: 8 },
  china: { center: [105, 35], zoom: 2.5 },
  usa: { center: [-98, 39], zoom: 2.5 },
  uk: { center: [-2, 54], zoom: 5 },
  spain: { center: [-3.5, 37], zoom: 5 },
  germany: { center: [10.5, 51.2], zoom: 6 },
  france: { center: [2.5, 46.5], zoom: 5 },
  italy: { center: [12.5, 42], zoom: 5 },
  kenya: { center: [38, -1], zoom: 5 },
  nigeria: { center: [8, 9.5], zoom: 4.5 },
  "south-africa": { center: [25, -29], zoom: 4 },
  morocco: { center: [-6.5, 32], zoom: 5 },
  egypt: { center: [30, 27], zoom: 4 },
  turkey: { center: [35, 39], zoom: 5 },
  poland: { center: [19.5, 52], zoom: 6 },
  romania: { center: [25, 46], zoom: 6 },
  portugal: { center: [-10, 38], zoom: 6 },
  netherlands: { center: [5, 52], zoom: 6 },
  canada: { center: [-95, 56], zoom: 2 },
  australia: { center: [134, -26], zoom: 2.5 },
  russia: { center: [55, 55], zoom: 1.5 },
  ukraine: { center: [31, 49], zoom: 6 },
  chile: { center: [-70, -35], zoom: 2.5 },
  tanzania: { center: [35, -6.5], zoom: 5 },
  ethiopia: { center: [40, 9], zoom: 4 },
  uganda: { center: [32, 1], zoom: 7 },
  rwanda: { center: [29.9, -1.9], zoom: 12 },
  bolivia: { center: [-64.5, -17], zoom: 4 },
  venezuela: { center: [-66, 8], zoom: 4.5 },
  pakistan: { center: [69, 30], zoom: 4 },
  "saudi-arabia": { center: [44, 24], zoom: 3.5 },
  greece: { center: [24, 38.5], zoom: 6 },
  "czech-republic": { center: [15.5, 49.8], zoom: 8 },
  hungary: { center: [19.5, 47], zoom: 8 },
  croatia: { center: [16.5, 44], zoom: 7 },
  serbia: { center: [21, 44], zoom: 8 },
  sweden: { center: [17, 62], zoom: 4 },
  norway: { center: [10, 62], zoom: 4 },
  denmark: { center: [10, 56], zoom: 6 },
  finland: { center: [26, 64], zoom: 4 },
  ireland: { center: [-8, 53.5], zoom: 6 },
  iran: { center: [53, 32.5], zoom: 3.5 },
  kazakhstan: { center: [68, 48], zoom: 3 },
  mongolia: { center: [103, 46.5], zoom: 3 },
  algeria: { center: [3, 28], zoom: 3 },
  estonia: { center: [25.5, 59], zoom: 10 },
  bulgaria: { center: [25.5, 42.7], zoom: 8 },
  slovakia: { center: [19.5, 48.7], zoom: 7 },
  lithuania: { center: [24, 55.3], zoom: 7 },
  latvia: { center: [25, 57], zoom: 7 },
  slovenia: { center: [14.5, 46], zoom: 8 },
  iceland: { center: [-18.5, 65], zoom: 5 },
  malta: { center: [14.4, 35.9], zoom: 20 },
  cyprus: { center: [33.3, 35], zoom: 14 },
  albania: { center: [20, 41], zoom: 9 },
  "north-macedonia": { center: [21.7, 41.5], zoom: 12 },
  montenegro: { center: [19.3, 42.5], zoom: 12 },
  "bosnia-and-herzegovina": { center: [17.8, 44], zoom: 8 },
  moldova: { center: [29, 47], zoom: 8 },
};

type CityWithRatio = CityPrimeAge & { womenPer100Men: number };

function getColor(ratio: number): string {
  if (ratio >= 105) return "#10b981";
  if (ratio >= 100) return "#34d399";
  if (ratio >= 95) return "#fbbf24";
  if (ratio >= 90) return "#f59e0b";
  return "#ef4444";
}

function getRadius(populationThousands: number, maxPop: number): number {
  const minR = 2;
  const maxR = 7;
  if (maxPop <= 0) return minR;
  const t = Math.log10(populationThousands + 1) / Math.log10(maxPop + 1);
  return minR + t * (maxR - minR);
}

type Props = {
  /** When set, show only this country's cities and center map. */
  countrySlug?: string;
  countryName?: string;
};

export default function CitiesPrimeAgeMap({ countrySlug, countryName }: Props) {
  const [hovered, setHovered] = useState<CityWithRatio | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => {
    if (countrySlug) return getCitiesForCountry(countrySlug);
    return getAllCitiesWithRatio();
  }, [countrySlug]);

  const view = useMemo(() => {
    if (countrySlug && MAP_VIEW[countrySlug])
      return MAP_VIEW[countrySlug];
    const lngs = cities.map((c) => c.lng);
    const lats = cities.map((c) => c.lat);
    const cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    return { center: [cLng, cLat] as [number, number], zoom: 2 };
  }, [countrySlug, cities]);

  const projectionConfig = useMemo(
    () => ({
      center: view.center,
      scale: 147 * view.zoom,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view]
  );

  const maxPop = useMemo(
    () => Math.max(...cities.map((c) => c.population), 1),
    [cities]
  );

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/50 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-500/90">
          Cities (20–39 prime age) · ratio & population
        </p>
        <SourceLink sourceKey="demographicsPopulation" />
      </div>

      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: 380 }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={projectionConfig}
          width={800}
          height={380}
          style={{ width: "100%", height: "100%", display: "block" }}
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

            {cities.map((city, i) => {
              const color = getColor(city.womenPer100Men);
              const r = getRadius(city.population, maxPop);
              const isH = hovered?.name === city.name && hovered?.countrySlug === city.countrySlug;

              return (
                <Marker
                  key={`${city.countrySlug}-${city.name}-${i}`}
                  coordinates={[city.lng, city.lat]}
                  onMouseEnter={() => setHovered(city)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                  >
                    <circle
                      r={r * 1.7}
                      fill={color}
                      fillOpacity={isH ? 0.2 : 0.08}
                      className="transition-all duration-200"
                    />
                    <circle
                      r={isH ? r + 1 : r}
                      fill={color}
                      fillOpacity={isH ? 0.95 : 0.75}
                      stroke={isH ? "#fff" : "rgba(0,0,0,0.15)"}
                      strokeWidth={isH ? 1 : 0.4}
                      className="cursor-pointer transition-all duration-150"
                    />
                    {isH && (
                      <>
                        <line
                          x1={0}
                          y1={-(r + 2)}
                          x2={0}
                          y2={-(r + 12)}
                          stroke="#52525b"
                          strokeWidth={0.6}
                        />
                        <rect
                          x={-Math.min(city.name.length * 2.8 + 20, 80)}
                          y={-(r + 28)}
                          width={Math.min(city.name.length * 5.6 + 24, 160)}
                          height={36}
                          rx={6}
                          fill="#18181b"
                          fillOpacity={0.98}
                          stroke={color}
                          strokeWidth={0.5}
                          strokeOpacity={0.5}
                        />
                        <text
                          textAnchor="middle"
                          y={-(r + 18)}
                          fill="#e4e4e7"
                          fontSize={9}
                          fontWeight="600"
                          fontFamily="system-ui, sans-serif"
                          className="pointer-events-none select-none"
                        >
                          {city.name}
                        </text>
                        <text
                          textAnchor="middle"
                          y={-(r + 8)}
                          fill="#a1a1aa"
                          fontSize={8}
                          fontFamily="system-ui, sans-serif"
                          className="pointer-events-none select-none"
                        >
                          {city.womenPer100Men} ♀/100♂ · {(city.population / 1000).toFixed(1)}M
                        </text>
                      </>
                    )}
                  </motion.g>
                </Marker>
              );
            })}
        </ComposableMap>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.1 }}
              className="pointer-events-none absolute z-20 rounded-xl border border-zinc-700/80 bg-zinc-950/96 p-3 shadow-2xl backdrop-blur-md"
              style={{
                left: Math.min(
                  mousePos.x + 18,
                  (containerRef.current?.offsetWidth ?? 700) - 220
                ),
                top: Math.max(mousePos.y - 80, 8),
                width: 200,
                borderColor: `${getColor(hovered.womenPer100Men)}40`,
              }}
            >
              <p className="text-xs font-bold text-zinc-100">{hovered.name}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className="text-lg font-black tabular-nums"
                  style={{ color: getColor(hovered.womenPer100Men) }}
                >
                  {hovered.womenPer100Men}
                </span>
                <span className="text-[10px] text-zinc-500">women per 100 men (20–39)</span>
              </div>
              <p className="mt-1 text-[10px] text-zinc-500">
                Pop. {(hovered.population >= 1000 ? (hovered.population / 1000).toFixed(1) + "M" : hovered.population + "k")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-zinc-800/50 px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[9px] text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> More women (better ratio)
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Balanced
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-red-500" /> More men (tougher)
        </span>
        <span className="text-[9px] text-zinc-600">· Circle size = population</span>
      </div>

      <p className="border-t border-zinc-800/50 px-4 py-2 text-center text-[9px] text-zinc-600">
        Ratio from country demographics (UN WPP) + city type. Population: UN / national statistics.
      </p>
    </div>
  );
}
