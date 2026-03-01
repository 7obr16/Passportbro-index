"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Wallet, Wifi, Shield, Star } from "lucide-react";
import { Country, TIER_CONFIG } from "@/lib/countries";
import { getCountryScores } from "@/lib/scoring";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

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
  "cuba": "CUB", "jamaica": "JAM",
  "netherlands": "NLD", "belgium": "BEL", "austria": "AUT", "switzerland": "CHE",
  "norway": "NOR", "denmark": "DNK", "finland": "FIN", "ireland": "IRL",
  "slovakia": "SVK", "lithuania": "LTU", "latvia": "LVA", "slovenia": "SVN",
  "luxembourg": "LUX", "iceland": "ISL", "bosnia-and-herzegovina": "BIH", "moldova": "MDA",
};

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
  CUB: [21.5, -77.8], JAM: [18.1, -77.3],
  NLD: [52.1, 5.3], BEL: [50.5, 4.5], AUT: [47.5, 14.6], CHE: [46.8, 8.2],
  NOR: [60.5, 8.5], DNK: [56.3, 9.5], FIN: [64.0, 26.0], IRL: [53.4, -8.2],
  SVK: [48.7, 19.7], LTU: [55.2, 24.0], LVA: [56.9, 24.6], SVN: [46.1, 14.8],
  LUX: [49.8, 6.1], ISL: [64.9, -19.0], BIH: [43.9, 17.9], MDA: [47.4, 28.4],
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = {
  countries: Country[];
};

export default function WorldGlobe({ countries }: Props) {
  const router = useRouter();
  const globeRef = useRef<any>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [hoverD, setHoverD] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const w = el.offsetWidth || el.clientWidth || 0;
      const h = el.offsetHeight || el.clientHeight || 0;
      if (w > 0 && h > 0) {
        setDimensions({ width: w, height: h });
      }
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });
    ro.observe(el);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        requestAnimationFrame(() => {
          requestAnimationFrame(updateDimensions);
        });
      }
    };
    const onOrientationChange = () => {
      requestAnimationFrame(() => updateDimensions());
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("resize", updateDimensions);
    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  // Delayed re-measure after mount (catches layout not yet settled, e.g. after nav-back or orientation change)
  useEffect(() => {
    const t = setTimeout(updateDimensions, 100);
    const t2 = setTimeout(updateDimensions, 400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [updateDimensions]);

  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;
    // On mobile: disable touch rotate so page scroll works; globe auto-rotates instead
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouch) {
      controls.enableRotate = false;
    }
    setReady(true);
  }, []);

  const getCountryFromFeature = useMemo(() => {
    const isoToCountry = new Map<string, Country>();
    for (const c of countries) {
      const iso = COUNTRY_ISO_MAP[c.slug];
      if (iso) isoToCountry.set(iso, c);
    }
    return (feature: any) => isoToCountry.get(feature?.properties?.ISO_A3) ?? null;
  }, [countries]);

  const glowPoints = useMemo(() => {
    return countries
      .map((c) => {
        const iso = COUNTRY_ISO_MAP[c.slug];
        const coords = iso ? COUNTRY_CENTROIDS[iso] : null;
        if (!coords) return null;
        const hex = TIER_CONFIG[c.datingEase]?.hex || "#71717a";
        return { lat: coords[0], lng: coords[1], color: hex, country: c, size: 0.35 };
      })
      .filter(Boolean) as { lat: number; lng: number; color: string; country: Country; size: number }[];
  }, [countries]);

  const ringData = useMemo(() => {
    return glowPoints.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      maxR: 2.5,
      propagationSpeed: 1.2,
      repeatPeriod: 2000,
      color: p.color,
    }));
  }, [glowPoints]);

  const handlePolygonHover = useCallback(
    (d: any) => {
      setHoverD(d);
      setHoveredCountry(d ? getCountryFromFeature(d) : null);
    },
    [getCountryFromFeature]
  );

  const handlePolygonClick = useCallback(
    (d: any) => {
      const c = getCountryFromFeature(d);
      if (c) router.push(`/country/${c.slug}`);
    },
    [getCountryFromFeature, router]
  );

  if (!geoJson) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  const hoveredScores = hoveredCountry ? getCountryScores(hoveredCountry) : null;

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
      className="relative h-full w-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
      onMouseMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({
          x: event.clientX - rect.left + 16,
          y: event.clientY - rect.top + 16,
        });
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Globe
          ref={globeRef}
          onGlobeReady={handleGlobeReady}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere={true}
          atmosphereColor="rgba(120, 180, 255, 1)"
          atmosphereAltitude={0.2}
          polygonsData={geoJson.features}
          polygonsTransitionDuration={400}
          polygonAltitude={(d: any) => {
            const c = getCountryFromFeature(d);
            if (!c) return -0.001;
            return d === hoverD ? 0.035 : 0.008;
          }}
          polygonCapColor={(d: any) => {
            const c = getCountryFromFeature(d);
            if (!c) return "rgba(0, 0, 0, 0)";
            const hex = TIER_CONFIG[c.datingEase]?.hex || "#71717a";
            if (d === hoverD) return hexToRgba(hex, 0.92);
            return hexToRgba(hex, 0.55);
          }}
          polygonSideColor={(d: any) => {
            const c = getCountryFromFeature(d);
            if (!c) return "rgba(0, 0, 0, 0)";
            const hex = TIER_CONFIG[c.datingEase]?.hex || "#71717a";
            return d === hoverD ? hexToRgba(hex, 0.7) : hexToRgba(hex, 0.2);
          }}
          polygonStrokeColor={(d: any) => {
            const c = getCountryFromFeature(d);
            if (!c) return "rgba(0, 0, 0, 0)";
            return d === hoverD ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)";
          }}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          polygonLabel={() => ""}
          pointsData={glowPoints}
          pointAltitude={0.01}
          pointRadius="size"
          pointColor="color"
          pointsMerge={false}
          ringsData={ringData}
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringAltitude={0.015}
        />
      </motion.div>

      {/* Loading shimmer */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-500" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Loading globe</p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCountry && hoveredScores && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="pointer-events-none absolute z-30 w-[240px] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/85 shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a" }}
            />

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{hoveredCountry.flagEmoji}</span>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{hoveredCountry.name}</p>
                    <p className="text-[10px] text-zinc-500">{hoveredCountry.region}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${tierBadgeColor[hoveredCountry.datingEase] || tierBadgeColor["N/A"]}`}
                >
                  {hoveredCountry.datingEase}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-3 flex items-center gap-2">
                <Star className="h-3 w-3 text-amber-400" />
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: TIER_CONFIG[hoveredCountry.datingEase]?.hex || "#71717a" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredScores.overall}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-300">{hoveredScores.overall.toFixed(0)}</span>
              </div>

              {/* Stats grid */}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {[
                  { icon: Heart, label: "Dating", value: hoveredCountry.datingEase, score: hoveredScores.friendly },
                  { icon: Wallet, label: "Budget", value: hoveredCountry.budgetTier, score: hoveredScores.cost },
                  { icon: Shield, label: "Safety", value: hoveredCountry.safetyLevel, score: hoveredScores.safety },
                  { icon: Wifi, label: "Internet", value: hoveredCountry.internetSpeed, score: hoveredScores.internet },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5">
                    <stat.icon className="h-3 w-3 shrink-0 text-zinc-500" />
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-zinc-200">{stat.value}</p>
                      <p className="text-[9px] text-zinc-600">{stat.label}</p>
                    </div>
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
