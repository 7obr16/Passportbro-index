"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";

type Props = {
  countryName: string;
  maleHeight: string;
  femaleHeight: string;
};

const US_REFERENCE_CM = {
  male: 175,
  female: 162,
} as const;

function parseHeightCm(value: string): number | null {
  const cleaned = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num <= 0) return null;
  // If value is in meters (e.g. 1.70), convert to cm.
  if (num > 0 && num < 3) return Math.round(num * 100);
  // Otherwise assume cm.
  return Math.round(num);
}

type AvatarProps = React.SVGProps<SVGSVGElement> & { color?: string };

const MaleAvatar = ({ color, ...props }: AvatarProps) => (
  <svg viewBox="0 0 24 50" fill={color} {...props}>
    <circle cx="12" cy="5" r="4.5" />
    <path d="M16 11H8C5.2 11 3 13.2 3 16v9c0 1.1.9 2 2 2h2v19c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V33h2v13c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V27h2c1.1 0 2-.9 2-2v-9c0-2.8-2.2-5-5-5z" />
  </svg>
);

const FemaleAvatar = ({ color, ...props }: AvatarProps) => (
  <svg viewBox="0 0 24 50" fill={color} {...props}>
    <circle cx="12" cy="5" r="4.5" />
    <path d="M16 11H8c-2.5 0-4.6 1.8-5 4.3l-1.8 11.2c-.2 1.3.8 2.5 2.1 2.5h3.2L8 46c.1 1.1 1.1 2 2.2 2h1.6c1.1 0 2-.9 2-2V35h2v11c0 1.1.9 2 2 2h1.6c1.1 0 2.1-.9 2.2-2l1.5-17h3.2c1.3 0 2.3-1.2 2.1-2.5L21 15.3c-.4-2.5-2.5-4.3-5-4.3z" />
  </svg>
);

export default function HeightComparison({ countryName, maleHeight, femaleHeight }: Props) {
  const [mode, setMode] = useState<"male" | "female">("male");

  const heights = useMemo(() => {
    const maleCm = parseHeightCm(maleHeight) ?? 0;
    const femaleCm = parseHeightCm(femaleHeight) ?? 0;
    const max = 200; // Fixed view window max
    return { maleCm, femaleCm, max };
  }, [maleHeight, femaleHeight]);

  const config = useMemo(() => {
    if (mode === "male") {
      return {
        label: "Male Avg",
        country: heights.maleCm,
        us: US_REFERENCE_CM.male,
        accent: "#38bdf8", // Sky blue
        glow: "rgba(56, 189, 248, 0.4)",
        Avatar: MaleAvatar,
      };
    } else {
      return {
        label: "Female Avg",
        country: heights.femaleCm,
        us: US_REFERENCE_CM.female,
        accent: "#f472b6", // Pink
        glow: "rgba(244, 114, 182, 0.4)",
        Avatar: FemaleAvatar,
      };
    }
  }, [mode, heights.maleCm, heights.femaleCm]);

  // Height as a percentage of the container (max 200cm)
  const getPct = (cm: number) => Math.min(100, Math.max(0, (cm / heights.max) * 100));

  const countryPct = getPct(config.country);
  const usPct = getPct(config.us);
  const delta = config.country - config.us;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Height Comparison</p>
          <h3 className="mt-1 flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Ruler className="h-4 w-4 text-emerald-400" />
            {countryName} vs US
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            3D Avatar representation of average height.
          </p>
        </div>

        <div className="flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 p-1">
          {(["male", "female"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                mode === k
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {k === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Scene Container */}
      <div className="relative mt-6 flex h-[280px] w-full flex-col items-center justify-end overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 pb-[40px] [perspective:1000px]">
        
        {/* Background Depth Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950/80 to-zinc-950" />

        {/* 3D Floor Grid */}
        <div 
          className="absolute bottom-[-100px] h-[200px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(39,39,42,0.4)_0%,_transparent_70%)]"
          style={{ transform: "rotateX(70deg)" }}
        />
        <div 
          className="absolute bottom-4 h-8 w-[240px] rounded-[100%] bg-black/60 blur-md"
        />

        {/* The Avatars */}
        <div className="relative z-10 flex w-[240px] items-end justify-between px-2">
          
          {/* US Avatar */}
          <div className="group relative flex w-[60px] flex-col items-center">
            <motion.div
              className="absolute -top-8 whitespace-nowrap text-[11px] font-bold text-zinc-400"
              initial={false}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              US {config.us} cm
            </motion.div>
            <motion.div
              className="relative w-full origin-bottom drop-shadow-xl"
              initial={false}
              animate={{ height: `${usPct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ height: `${usPct}%` }} // absolute height bound
            >
              {/* Fake 3D glow behind US avatar */}
              <div className="absolute inset-0 -z-10 scale-110 bg-emerald-500/10 blur-xl transition-opacity duration-300 group-hover:bg-emerald-500/20" />
              
              <config.Avatar 
                color="#10b981" 
                className="h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-90"
                preserveAspectRatio="xMidYMax meet" 
              />
            </motion.div>
            <p className="absolute -bottom-6 text-[10px] font-medium text-zinc-500">US Ref</p>
          </div>

          {/* Dotted Ruler Line */}
          <motion.div 
            className="absolute left-[60px] right-[60px] border-t border-dashed border-zinc-600/50"
            initial={false}
            animate={{ bottom: `${usPct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />

          {/* Country Avatar */}
          <div className="group relative flex w-[60px] flex-col items-center">
            <motion.div
              className="absolute -top-10 flex flex-col items-center whitespace-nowrap"
              initial={false}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold backdrop-blur-md" style={{ color: config.accent }}>
                {config.country} cm
                <span className={`text-[10px] ${delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-zinc-400"}`}>
                  ({delta > 0 ? "+" : ""}{delta})
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative w-full origin-bottom drop-shadow-2xl"
              initial={false}
              animate={{ height: `${countryPct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={{ height: `${countryPct}%` }} // absolute height bound
            >
              {/* Fake 3D glow behind Country avatar */}
              <motion.div 
                className="absolute inset-0 -z-10 scale-110 blur-xl transition-opacity duration-300" 
                style={{ backgroundColor: config.glow }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <config.Avatar 
                color={config.accent} 
                className="h-full w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                preserveAspectRatio="xMidYMax meet" 
              />
            </motion.div>
            <p className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-zinc-300">{countryName}</p>
          </div>

        </div>
      </div>
    </div>
  );
}