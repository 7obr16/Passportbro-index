"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Wallet, Wifi } from "lucide-react";
import { Country } from "@/lib/countries";

// Dynamically import react-globe.gl to avoid SSR issues
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
  "ecuador": "ECU", "guatemala": "GTM", "paraguay": "PRY", "uruguay": "URY"
};

// Rough lat/lng anchors for top destinations.
const HOTSPOT_COORDS: Record<string, [number, number]> = {
  "philippines": [14.6, 121.0],
  "colombia": [4.7, -74.1],
  "thailand": [13.8, 100.5],
  "vietnam": [10.8, 106.7],
  "brazil": [-22.9, -43.2],
  "mexico": [19.4, -99.1],
  "indonesia": [-6.2, 106.8],
  "dominican-republic": [18.5, -69.9],
  "peru": [-12.0, -77.0],
  "argentina": [-34.6, -58.4],
  "malaysia": [3.1, 101.7],
  "turkey": [41.0, 28.9],
  "romania": [44.4, 26.1],
  "poland": [52.2, 21.0],
  "spain": [40.4, -3.7],
  "japan": [35.7, 139.7],
  "costa-rica": [9.9, -84.1],
  "morocco": [33.6, -7.6],
  "kenya": [-1.3, 36.8],
  "south-africa": [-33.9, 18.4],
};

const ORIGIN_HUBS: Array<{ lat: number; lng: number }> = [
  { lat: 40.71, lng: -74.0 },   // New York
  { lat: 51.5, lng: -0.12 },    // London
  { lat: -33.86, lng: 151.2 },  // Sydney
  { lat: 1.35, lng: 103.82 },   // Singapore
];

type Props = {
  countries: Country[];
};

export default function WorldGlobe({ countries }: Props) {
  const router = useRouter();
  const globeRef = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [geoJson, setGeoJson] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [hoverD, setHoverD] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch GeoJSON data for the polygons
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Setup auto-rotation
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false; // Disable zoom for a cleaner presentation
    }
  }, [geoJson]);

  // Helper to find our DB country from a GeoJSON feature
  const getCountryFromFeature = useMemo(() => {
    return (feature: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const iso = feature.properties.ISO_A3;
      return countries.find((c) => COUNTRY_ISO_MAP[c.slug] === iso);
    };
  }, [countries]);

  const hotspotRings = useMemo(() => {
    return countries
      .filter((country) => {
        const goodDating = country.datingEase === "Very Easy" || country.datingEase === "Easy";
        const affordable = country.budgetTier === "<$1k" || country.budgetTier === "$1k-$2k";
        return goodDating && affordable && HOTSPOT_COORDS[country.slug];
      })
      .sort((a, b) => b.datingEaseScore - a.datingEaseScore)
      .slice(0, 10)
      .map((country) => {
        const [lat, lng] = HOTSPOT_COORDS[country.slug];
        return { lat, lng, slug: country.slug };
      });
  }, [countries]);

  const flightArcs = useMemo(() => {
    const topDestinations = countries
      .filter((country) => HOTSPOT_COORDS[country.slug])
      .sort((a, b) => b.datingEaseScore - a.datingEaseScore)
      .slice(0, 5);

    return topDestinations.map((country, idx) => {
      const hub = ORIGIN_HUBS[idx % ORIGIN_HUBS.length];
      const [endLat, endLng] = HOTSPOT_COORDS[country.slug];

      return {
        startLat: hub.lat,
        startLng: hub.lng,
        endLat,
        endLng,
      };
    });
  }, [countries]);

  if (!geoJson) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  const vibeTag = hoveredCountry
    ? hoveredCountry.hasNightlife
      ? "Great Nightlife"
      : hoveredCountry.hasBeach
        ? "Beach Access"
        : "Nature/Mountains"
    : "";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
      onMouseMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({
          x: event.clientX - rect.left + 14,
          y: event.clientY - rect.top + 14,
        });
      }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
        polygonsData={geoJson.features}
        ringsData={hotspotRings}
        ringColor={() => "#10b981"}
        ringMaxRadius={5}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={700}
        arcsData={flightArcs}
        arcColor={() => ["rgba(255,255,255,0.1)", "rgba(16, 185, 129, 0.8)"]}
        arcDashLength={0.4}
        arcDashGap={2}
        arcDashAnimateTime={2000}
        polygonTransitionDuration={800}
        polygonAltitude={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          return c ? 0.01 : 0.005;
        }}
        polygonCapColor={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (!c) return "rgba(39, 39, 42, 0.2)";
          if (hoverD === d) return "rgba(16, 185, 129, 1)";
          return "rgba(16, 185, 129, 0.9)";
        }}
        polygonSideColor={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          return c ? "rgba(16, 185, 129, 0.35)" : "rgba(39, 39, 42, 0.2)";
        }}
        polygonStrokeColor={() => "#27272a"} // zinc-800
        onPolygonHover={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          setHoverD(d);
          const c = d ? getCountryFromFeature(d) : null;
          setHoveredCountry(c ?? null);
        }}
        onPolygonClick={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (c) {
            router.push(`/country/${c.slug}`);
          }
        }}
      />

      <AnimatePresence>
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute z-30 min-w-[200px] rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-md"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            <p className="text-sm font-bold text-white">{hoveredCountry.name}</p>
            <span className="mt-2 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              {vibeTag}
            </span>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Heart className="h-3 w-3" />
                  <span className="text-[10px]">Dating</span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-zinc-100">{hoveredCountry.datingEase}</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Wallet className="h-3 w-3" />
                  <span className="text-[10px]">Budget</span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-zinc-100">{hoveredCountry.budgetTier}</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px]">Internet</span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-zinc-100">{hoveredCountry.internetSpeed}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
