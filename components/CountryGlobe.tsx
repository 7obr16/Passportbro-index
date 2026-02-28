"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

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
};

type Props = {
  slug: string;
  tierHex: string;
};

export default function CountryGlobe({ slug, tierHex }: Props) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoJson, setGeoJson] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 320 });
  const [ready, setReady] = useState(false);

  const targetIso = COUNTRY_ISO_MAP[slug] ?? "";
  const centroid = targetIso ? COUNTRY_CENTROIDS[targetIso] : null;

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then(setGeoJson);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 120;
    controls.maxDistance = 600;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.8;

    if (centroid) {
      globeRef.current.pointOfView({ lat: centroid[0], lng: centroid[1], altitude: 2.2 }, 1200);
    }

    setReady(true);
  }, [centroid]);

  const isTarget = useCallback(
    (feature: any) => feature?.properties?.ISO_A3 === targetIso,
    [targetIso]
  );

  const ringData = useMemo(() => {
    if (!centroid) return [];
    return [{ lat: centroid[0], lng: centroid[1], maxR: 4, propagationSpeed: 1.5, repeatPeriod: 1800, color: tierHex }];
  }, [centroid, tierHex]);

  const pointData = useMemo(() => {
    if (!centroid) return [];
    return [{ lat: centroid[0], lng: centroid[1], size: 0.5, color: tierHex }];
  }, [centroid, tierHex]);

  if (!geoJson) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Globe
          ref={globeRef}
          onGlobeReady={handleGlobeReady}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="rgba(120, 180, 255, 1)"
          atmosphereAltitude={0.18}
          polygonsData={geoJson.features}
          polygonsTransitionDuration={600}
          polygonAltitude={(d: any) => (isTarget(d) ? 0.06 : -0.001)}
          polygonCapColor={(d: any) => {
            if (isTarget(d)) return tierHex + "e6";
            return "rgba(0,0,0,0)";
          }}
          polygonSideColor={(d: any) => {
            if (isTarget(d)) return tierHex + "80";
            return "rgba(0,0,0,0)";
          }}
          polygonStrokeColor={(d: any) => {
            if (isTarget(d)) return "rgba(255,255,255,0.6)";
            return "rgba(255,255,255,0.04)";
          }}
          polygonLabel={() => ""}
          pointsData={pointData}
          pointAltitude={0.07}
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
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-500" />
        </div>
      )}
    </div>
  );
}
