"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Wallet, Wifi, Shield } from "lucide-react";
import type { Country } from "@/lib/countries";
import { TIER_CONFIG } from "@/lib/countries";
import { getCountryScores } from "@/lib/scoring";

/* ── Slug → ISO-3166 alpha-3 ────────────────────────────────────── */

const COUNTRY_ISO_MAP: Record<string, string> = {
  "philippines": "PHL", "thailand": "THA", "indonesia": "IDN", "malaysia": "MYS",
  "vietnam": "VNM", "cambodia": "KHM", "kenya": "KEN", "nigeria": "NGA",
  "uganda": "UGA", "rwanda": "RWA", "tanzania": "TZA", "ethiopia": "ETH",
  "bolivia": "BOL", "colombia": "COL", "mexico": "MEX", "peru": "PER",
  "venezuela": "VEN", "dominican-republic": "DOM", "costa-rica": "CRI",
  "india": "IND", "pakistan": "PAK", "morocco": "MAR", "brazil": "BRA",
  "argentina": "ARG", "chile": "CHL", "china": "CHN", "mongolia": "MNG",
  "south-africa": "ZAF", "russia": "RUS", "ukraine": "UKR", "poland": "POL",
  "romania": "ROU", "turkey": "TUR", "kazakhstan": "KAZ", "algeria": "DZA",
  "libya": "LBY", "usa": "USA", "canada": "CAN", "australia": "AUS",
  "uk": "GBR", "france": "FRA", "germany": "DEU", "spain": "ESP",
  "italy": "ITA", "sweden": "SWE", "japan": "JPN", "south-korea": "KOR",
  "saudi-arabia": "SAU", "egypt": "EGY", "iran": "IRN",
  "portugal": "PRT", "taiwan": "TWN", "panama": "PAN", "hungary": "HUN",
  "czech-republic": "CZE", "bulgaria": "BGR", "serbia": "SRB", "croatia": "HRV",
  "georgia": "GEO", "estonia": "EST", "greece": "GRC", "united-arab-emirates": "ARE",
  "mauritius": "MUS", "cyprus": "CYP", "malta": "MLT", "montenegro": "MNE",
  "albania": "ALB", "north-macedonia": "MKD", "sri-lanka": "LKA", "laos": "LAO",
  "ecuador": "ECU", "guatemala": "GTM", "paraguay": "PRY", "uruguay": "URY",
  "cuba": "CUB", "jamaica": "JAM", "singapore": "SGP",
  "netherlands": "NLD", "belgium": "BEL", "austria": "AUT", "switzerland": "CHE",
  "norway": "NOR", "denmark": "DNK", "finland": "FIN", "ireland": "IRL",
  "slovakia": "SVK", "lithuania": "LTU", "latvia": "LVA", "slovenia": "SVN",
  "luxembourg": "LUX", "iceland": "ISL", "bosnia-and-herzegovina": "BIH", "moldova": "MDA",
  "belarus": "BLR",
};

/* ── Centroid coords [lat, lng] for pulsing markers ─────────────── */

const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  PHL: [12.8, 121.8], THA: [15.9, 100.9], IDN: [-0.8, 113.9], MYS: [4.2, 101.9],
  VNM: [14.1, 108.3], KHM: [12.6, 104.9], KEN: [-0.02, 37.9], NGA: [9.1, 8.7],
  UGA: [1.4, 32.3], RWA: [-1.9, 29.9], TZA: [-6.4, 34.9], ETH: [9.1, 40.5],
  BOL: [-16.3, -63.6], COL: [4.6, -74.3], MEX: [23.6, -102.6], PER: [-9.2, -75.0],
  VEN: [6.4, -66.6], DOM: [18.7, -70.2], CRI: [9.7, -83.8],
  IND: [20.6, 79.0], PAK: [30.4, 69.3], MAR: [31.8, -7.1], BRA: [-14.2, -51.9],
  ARG: [-38.4, -63.6], CHL: [-35.7, -71.5], CHN: [35.9, 104.2], MNG: [46.9, 103.8],
  ZAF: [-30.6, 22.9], RUS: [61.5, 105.3], UKR: [48.4, 31.2], POL: [51.9, 19.1],
  ROU: [45.9, 25.0], TUR: [39.0, 35.2], KAZ: [48.0, 68.0], DZA: [28.0, 1.7],
  LBY: [26.3, 17.2], USA: [37.1, -95.7], CAN: [56.1, -106.3], AUS: [-25.3, 133.8],
  GBR: [55.4, -3.4], FRA: [46.2, 2.2], DEU: [51.2, 10.4], ESP: [40.5, -3.7],
  ITA: [41.9, 12.6], SWE: [60.1, 18.6], JPN: [36.2, 138.3], KOR: [35.9, 127.8],
  SAU: [23.9, 45.1], EGY: [26.8, 30.8], IRN: [32.4, 53.7],
  PRT: [39.4, -8.2], TWN: [23.7, 121.0], PAN: [8.5, -80.8], HUN: [47.2, 19.5],
  CZE: [49.8, 15.5], BGR: [42.7, 25.5], SRB: [44.0, 21.0], HRV: [45.1, 15.2],
  GEO: [42.3, 43.4], EST: [58.6, 25.0], GRC: [39.1, 21.8], ARE: [23.4, 53.8],
  MUS: [-20.3, 57.6], CYP: [35.1, 33.4], MLT: [35.9, 14.4], MNE: [42.7, 19.4],
  ALB: [41.2, 20.2], MKD: [41.5, 21.7], LKA: [7.9, 80.8], LAO: [19.9, 102.5],
  ECU: [-1.8, -78.2], GTM: [15.8, -90.2], PRY: [-23.4, -58.4], URY: [-32.5, -55.8],
  CUB: [21.5, -77.8], JAM: [18.1, -77.3], SGP: [1.35, 103.8],
  NLD: [52.1, 5.3], BEL: [50.5, 4.5], AUT: [47.5, 14.6], CHE: [46.8, 8.2],
  NOR: [60.5, 8.5], DNK: [56.3, 9.5], FIN: [64.0, 26.0], IRL: [53.4, -8.2],
  SVK: [48.7, 19.7], LTU: [55.2, 24.0], LVA: [56.9, 24.6], SVN: [46.1, 14.8],
  LUX: [49.8, 6.1], ISL: [64.9, -19.0], BIH: [43.9, 17.9], MDA: [47.4, 28.4],
};

const GEO_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = { 
  countries: Country[];
  activeFilter?: string | null;
  /** When false, clicking a country does not navigate (e.g. for inline homepage globe that opens expanded view first). */
  navigateOnCountryClick?: boolean;
};

export default function WorldGlobe({ countries, activeFilter = null, navigateOnCountryClick = true }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isoToCountry = useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countries) {
      const iso = COUNTRY_ISO_MAP[c.slug];
      if (iso) map.set(iso, c);
    }
    return map;
  }, [countries]);

  const nameToCountry = useMemo(() => {
    const normalize = (v: string) =>
      v
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    const aliases: Record<string, string> = {
      "united states of america": "usa",
      "united states": "usa",
      "united kingdom": "uk",
      "russian federation": "russia",
      "korea south": "south-korea",
      "south korea": "south-korea",
      "north macedonia": "north-macedonia",
      "czechia": "czech-republic",
      "uae": "united-arab-emirates",
      "cote divoire": "cote-divoire",
    };
    const map = new Map<string, Country>();
    for (const c of countries) {
      map.set(normalize(c.name), c);
      map.set(normalize(c.slug.replace(/-/g, " ")), c);
    }
    for (const [alias, slug] of Object.entries(aliases)) {
      const country = countries.find((c) => c.slug === slug);
      if (country) map.set(normalize(alias), country);
    }
    return { map, normalize };
  }, [countries]);

  const markerData = useMemo(() => {
    return countries
      .map((c) => {
        const iso = COUNTRY_ISO_MAP[c.slug];
        const coords = iso ? COUNTRY_CENTROIDS[iso] : null;
        if (!coords) return null;
        const hex = TIER_CONFIG[c.datingEase]?.hex || "#71717a";
        const isTopTier = c.datingEase === "Very Easy" || c.datingEase === "Easy";
        return {
          slug: c.slug,
          name: c.name,
          coordinates: [coords[1], coords[0]] as [number, number],
          color: hex,
          isTopTier,
        };
      })
      .filter(Boolean) as {
      slug: string;
      name: string;
      coordinates: [number, number];
      color: string;
      isTopTier: boolean;
    }[];
  }, [countries]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: event.clientX - rect.left + 20,
      y: event.clientY - rect.top + 20,
    });
  }, []);

  const hoveredScores = hoveredCountry
    ? getCountryScores(hoveredCountry)
    : null;

  const tierBadgeColor: Record<string, string> = {
    "Very Easy": "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    "Easy": "border-lime-500/40 bg-lime-500/15 text-lime-300",
    "Normal": "border-amber-500/40 bg-amber-500/15 text-amber-300",
    "Hard": "border-orange-500/40 bg-orange-500/15 text-orange-300",
    "Improbable": "border-red-500/40 bg-red-500/15 text-red-300",
    "N/A": "border-zinc-500/40 bg-zinc-500/15 text-zinc-300",
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredCountry(null)}
    >
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 200, center: [0, 0] }}
        width={1000}
        height={620}
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <ZoomableGroup 
          center={[0, 0]} 
          zoom={1}
          minZoom={1}
          maxZoom={8}
          translateExtent={[[-200, -200], [1200, 700]]}
        >
          <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Sphere
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.5}
          fill="rgba(20,24,30,0.4)"
          id="sphere"
        />

        <Graticule stroke="rgba(255, 255, 255, 0.04)" strokeWidth={0.5} />

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const iso = geo.properties?.ISO_A3;
              const byIso = iso ? isoToCountry.get(iso) : undefined;
              const geoName =
                geo.properties?.NAME_LONG ||
                geo.properties?.NAME ||
                geo.properties?.ADMIN ||
                "";
              const byName = geoName
                ? nameToCountry.map.get(nameToCountry.normalize(geoName))
                : undefined;
              const country = byIso ?? byName;
              
              // Determine if this country should be highlighted or greyed out
              let isActive = true;
              if (activeFilter && country) {
                if (activeFilter === "Top Picks") {
                  isActive = country.datingEase === "Very Easy" || country.datingEase === "Easy";
                } else {
                  isActive = country.datingEase === activeFilter;
                }
              } else if (activeFilter && !country) {
                isActive = false;
              }

              const tierHex = country && isActive
                ? TIER_CONFIG[country.datingEase]?.hex || "#71717a"
                : null;
              const isHovered = hoveredCountry?.slug === country?.slug;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(country || null)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    if (country && navigateOnCountryClick) {
                      router.push(`/country/${country.slug}`);
                    }
                  }}
                  className="transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    default: {
                      fill: tierHex
                        ? hexToRgba(tierHex, 0.45)
                        : (activeFilter && country ? "rgba(42, 42, 48, 0.2)" : "rgba(42, 42, 48, 0.5)"),
                      stroke: tierHex
                        ? hexToRgba(tierHex, 0.6)
                        : (activeFilter && country ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.08)"),
                      strokeWidth: 0.3,
                      outline: "none",
                      cursor: country && isActive ? "pointer" : "default",
                    },
                    hover: {
                      fill: tierHex
                        ? hexToRgba(tierHex, 0.85)
                        : "rgba(60, 60, 68, 0.7)",
                      stroke: country && isActive
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.15)",
                      strokeWidth: country && isActive ? 0.7 : 0.3,
                      outline: "none",
                      cursor: country && isActive ? "pointer" : "default",
                      filter: country && isActive ? "url(#glow)" : "none",
                      zIndex: 10,
                    },
                    pressed: {
                      fill: tierHex
                        ? hexToRgba(tierHex, 1)
                        : "rgba(80, 80, 88, 0.8)",
                      stroke: "#ffffff",
                      strokeWidth: 0.9,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* High-tech pulsing SVG markers */}
        {markerData.map((m, i) => {
          // If filtering is active, only show markers that match the filter
          if (activeFilter) {
            if (activeFilter === "Top Picks") {
              if (m.color !== TIER_CONFIG["Very Easy"]?.hex && m.color !== TIER_CONFIG["Easy"]?.hex) return null;
            } else {
              if (m.color !== TIER_CONFIG[activeFilter]?.hex) return null;
            }
          }
          
          return (
            <Marker key={m.slug} coordinates={m.coordinates}>
            <g>
              {/* Inner dot */}
              <circle 
                r={m.isTopTier ? 1.5 : 0.8} 
                fill={m.color} 
                opacity={0.9} 
                filter={m.isTopTier ? "url(#glow)" : ""}
              />
              
              {/* Complex radar ping for top tiers */}
              {m.isTopTier && (
                <>
                  <circle r={1.5} fill="none" stroke={m.color} strokeWidth={0.3} opacity={0}>
                    <animate
                      attributeName="r"
                      from="1.5"
                      to="8"
                      dur="3s"
                      begin={`${i * 0.1}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="3s"
                      begin={`${i * 0.1}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r={1.5} fill="none" stroke={m.color} strokeWidth={0.2} opacity={0}>
                    <animate
                      attributeName="r"
                      from="1.5"
                      to="6"
                      dur="3s"
                      begin={`${i * 0.1 + 1.5}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="3s"
                      begin={`${i * 0.1 + 1.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </g>
          </Marker>
          );
        })}
        </ZoomableGroup>
      </ComposableMap>

      {/* ── Floating Data Tooltip ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {hoveredCountry && hoveredScores && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-none absolute z-50 w-[260px] overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950/80 shadow-[0_30px_100px_rgba(0,0,0,0.9),_0_0_40px_rgba(255,255,255,0.05)_inset] backdrop-blur-2xl"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          >
            {/* Top gradient glow line */}
            <div
              className="h-1 w-full opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a"}, transparent)`,
              }}
            />
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-lg shadow-inner border border-white/[0.05]">
                    {hoveredCountry.flagEmoji}
                  </span>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold leading-tight text-white drop-shadow-md">
                      {hoveredCountry.name}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-500">
                      {hoveredCountry.region}
                    </p>
                  </div>
                </div>
                <span
                  className={`mt-0.5 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    tierBadgeColor[hoveredCountry.datingEase] ??
                    tierBadgeColor["N/A"]
                  }`}
                  style={{
                    boxShadow: `0 0 12px ${hexToRgba(TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a", 0.2)}`
                  }}
                >
                  {hoveredCountry.datingEase}
                </span>
              </div>

              {/* Advanced Score Bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-3 w-3 text-rose-500" />
                    Dating Score
                  </span>
                  <span className="text-white">{hoveredScores.dating.toFixed(0)}</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/80 shadow-inner">
                  <motion.div
                    className="absolute bottom-0 left-0 top-0 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${hexToRgba(TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a", 0.5)}, ${TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a"})`,
                      boxShadow: `0 0 10px ${TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a"}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredScores.dating}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Premium Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { icon: Heart, label: "Friendliness", value: hoveredCountry.receptiveness },
                  { icon: Wallet, label: "Budget", value: hoveredCountry.budgetTier },
                  { icon: Shield, label: "Safety", value: hoveredCountry.safetyLevel },
                  { icon: Wifi, label: "Internet", value: hoveredCountry.internetSpeed },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group flex flex-col gap-1 rounded-xl border border-white/[0.03] bg-white/[0.02] p-2 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      <stat.icon className="h-3 w-3" />
                      {stat.label}
                    </div>
                    <p className="pl-4 text-[11px] font-bold text-zinc-200 transition-colors group-hover:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
