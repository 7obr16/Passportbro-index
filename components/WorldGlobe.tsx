"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  "saudi-arabia": "SAU", "egypt": "EGY", "iran": "IRN"
};

const TIER_COLORS: Record<string, string> = {
  "Very Easy": "#10b981", // emerald-500
  "Easy": "#84cc16",      // lime-500
  "Normal": "#f59e0b",    // amber-500
  "Hard": "#f97316",      // orange-500
  "Improbable": "#ef4444",// red-500
};

type Props = {
  countries: Country[];
};

export default function WorldGlobe({ countries }: Props) {
  const router = useRouter();
  const globeRef = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [geoJson, setGeoJson] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [hoverD, setHoverD] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
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

  if (!geoJson) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
        polygonsData={geoJson.features}
        polygonAltitude={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (!c) return 0.005;
          if (hoverD === d) return 0.06;
          return 0.02;
        }}
        polygonCapColor={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (!c) return "#18181b"; // zinc-900 for unmentioned
          if (hoverD === d) return "#ffffff";
          return TIER_COLORS[c.datingEase];
        }}
        polygonSideColor={() => "#09090b"} // zinc-950
        polygonStrokeColor={() => "#27272a"} // zinc-800
        polygonLabel={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (!c) return "";
          return `
            <div class="rounded-lg border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 shadow-xl backdrop-blur-md">
              <div class="flex items-center gap-2 font-bold">
                <span>${c.name}</span>
              </div>
              <div class="mt-1 text-xs text-zinc-400">
                Tier: <span style="color: ${TIER_COLORS[c.datingEase]}">${c.datingEase}</span>
              </div>
            </div>
          `;
        }}
        onPolygonHover={setHoverD}
        onPolygonClick={(d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const c = getCountryFromFeature(d);
          if (c) {
            router.push(`/country/${c.slug}`);
          }
        }}
      />
    </div>
  );
}
