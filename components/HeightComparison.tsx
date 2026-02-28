"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler } from "lucide-react";

type Props = {
  countryName: string;
  maleHeight: string;
  femaleHeight: string;
};

const US_REFERENCE_CM = { male: 175, female: 162 } as const;

function parseHeightCm(value: string): number | null {
  const cleaned = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num <= 0) return null;
  if (num > 0 && num < 3) return Math.round(num * 100);
  return Math.round(num);
}

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

const MALE_SILHOUETTE =
  "M50,4 C38,4 28,12 28,24 C28,36 38,44 50,44 C62,44 72,36 72,24 C72,12 62,4 50,4 Z M42,48 C38,50 26,54 18,60 C12,64 8,76 8,104 C8,122 9,130 12,134 L18,132 C16,122 16,98 20,78 C22,88 22,104 22,122 C22,130 23,136 24,142 C22,172 20,202 18,232 C18,252 18,262 20,270 L34,272 C36,268 36,260 34,240 C34,214 38,180 44,152 C46,146 48,144 50,142 C52,144 54,146 56,152 C62,180 66,214 66,240 C64,260 64,268 66,272 L80,270 C82,262 82,252 82,232 C80,202 78,172 76,142 C77,136 78,130 78,122 C78,104 78,88 80,78 C84,98 84,122 82,132 L88,134 C91,130 92,122 92,104 C92,76 88,64 82,60 C74,54 62,50 58,48 Z";

const FEMALE_SILHOUETTE =
  "M50,4 C38,4 28,12 28,24 C28,36 38,44 50,44 C62,44 72,36 72,24 C72,12 62,4 50,4 Z M42,48 C38,50 28,54 22,58 C16,62 12,74 12,100 C12,118 13,126 16,130 L22,128 C20,118 20,96 24,78 C26,86 26,100 26,116 C24,124 22,132 22,140 C20,148 18,156 20,162 C22,170 28,174 32,170 C28,192 24,218 22,240 C22,256 22,264 24,272 L38,272 C40,266 40,258 38,242 C38,222 40,192 44,158 C46,150 48,146 50,144 C52,146 54,150 56,158 C60,192 62,222 62,242 C60,258 60,266 62,272 L76,272 C78,264 78,256 78,240 C76,218 72,192 68,170 C72,174 78,170 80,162 C82,156 80,148 78,140 C78,132 76,124 74,116 C74,100 74,86 76,78 C80,96 80,118 78,128 L84,130 C87,126 88,118 88,100 C88,74 84,62 78,58 C72,54 62,50 58,48 Z";

const SCENE_H = 220;
const FLOOR_Y = 24;
const MAX_FIG_PX = SCENE_H * 0.72;

export default function HeightComparison({ countryName, maleHeight, femaleHeight }: Props) {
  const [mode, setMode] = useState<"male" | "female">("male");

  const heights = useMemo(() => ({
    maleCm: parseHeightCm(maleHeight) ?? 170,
    femaleCm: parseHeightCm(femaleHeight) ?? 160,
  }), [maleHeight, femaleHeight]);

  const cfg = useMemo(() => {
    if (mode === "male") return { country: heights.maleCm, us: US_REFERENCE_CM.male, accent: "#38bdf8", usAccent: "#34d399" };
    return { country: heights.femaleCm, us: US_REFERENCE_CM.female, accent: "#f472b6", usAccent: "#34d399" };
  }, [mode, heights]);

  const delta = cfg.country - cfg.us;
  const tallest = Math.max(cfg.country, cfg.us);
  const pxPerCm = MAX_FIG_PX / tallest;
  const usPx = cfg.us * pxPerCm;
  const countryPx = cfg.country * pxPerCm;

  // Ruler
  const shortest = Math.min(cfg.country, cfg.us);
  const rulerMin = Math.floor((shortest - 10) / 10) * 10;
  const rulerMax = Math.ceil((tallest + 8) / 10) * 10;
  const rulerH = SCENE_H - FLOOR_Y - 10;
  const cmToPx = (cm: number) => ((cm - rulerMin) / (rulerMax - rulerMin)) * rulerH;
  const ticks = useMemo(() => {
    const r: number[] = [];
    for (let v = rulerMin; v <= rulerMax; v += 5) r.push(v);
    return r;
  }, [rulerMin, rulerMax]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Ruler className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Height Comparison</p>
            <p className="text-xs font-semibold text-zinc-200">{countryName} vs US</p>
          </div>
        </div>

        {/* Gender toggle */}
        <div className="flex items-center rounded-full border border-zinc-800 bg-zinc-900 p-0.5">
          {(["male", "female"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`rounded-full px-3.5 py-1 text-[10px] font-bold transition-all ${
                mode === k
                  ? k === "male"
                    ? "bg-sky-500/20 text-sky-400"
                    : "bg-pink-500/20 text-pink-400"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {k === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Delta badge + units row */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black tracking-tight text-zinc-100">{cfg.country}</span>
          <span className="text-xs text-zinc-500">cm</span>
          <span className="ml-1 text-sm text-zinc-600">·</span>
          <span className="text-xs text-zinc-500">{cmToFeetInches(cfg.country)}</span>
        </div>
        {delta !== 0 && (
          <motion.span
            key={`${mode}-delta`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              delta > 0 ? "bg-emerald-500/12 text-emerald-400" : "bg-red-500/12 text-red-400"
            }`}
          >
            {delta > 0 ? "+" : ""}{delta} cm vs US
          </motion.span>
        )}
      </div>

      {/* Scene */}
      <div className="relative flex-1 px-4 pb-4">
        <div
          className="relative w-full overflow-hidden rounded-xl bg-zinc-950"
          style={{ height: SCENE_H + 60 }}
        >
          {/* Subtle radial bg */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(39,39,42,0.6),transparent)]" />

          {/* Floor line */}
          <div className="absolute left-10 right-4" style={{ bottom: FLOOR_Y }}>
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
          </div>

          {/* Ruler */}
          <div className="absolute left-2 z-10" style={{ bottom: FLOOR_Y, height: rulerH }}>
            {ticks.map((cm) => {
              const y = cmToPx(cm);
              const isMajor = cm % 10 === 0;
              return (
                <div
                  key={cm}
                  className="absolute flex items-center"
                  style={{ bottom: y, transform: "translateY(50%)" }}
                >
                  <div
                    className={isMajor ? "w-3 bg-zinc-700" : "w-1.5 bg-zinc-800"}
                    style={{ height: 1 }}
                  />
                  {isMajor && (
                    <span className="ml-1 text-[7px] tabular-nums text-zinc-600">{cm}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid lines */}
          {ticks
            .filter((cm) => cm % 10 === 0)
            .map((cm) => (
              <div
                key={`gl-${cm}`}
                className="absolute left-10 right-4 border-t border-zinc-900/70"
                style={{ bottom: FLOOR_Y + cmToPx(cm) }}
              />
            ))}

          {/* Figures */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-10"
              style={{ height: SCENE_H + 60 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {([
                { heightPx: usPx, color: cfg.usAccent, label: "US Avg", cm: cfg.us, delay: 0 },
                { heightPx: countryPx, color: cfg.accent, label: countryName, cm: cfg.country, delay: 0.1 },
              ] as const).map(({ heightPx, color, label, cm, delay }) => {
                const widthPx = heightPx * (100 / 276);
                return (
                  <div key={label} className="relative flex flex-col items-center" style={{ width: 88 }}>
                    {/* Height tag — positioned above head */}
                    <motion.div
                      className="absolute z-20 flex flex-col items-center"
                      style={{ bottom: FLOOR_Y + heightPx + 8 }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: delay + 0.45, duration: 0.3 }}
                    >
                      <div className="flex flex-col items-center rounded-lg border border-white/8 bg-zinc-900/90 px-2.5 py-1.5 backdrop-blur-sm">
                        <span className="text-[11px] font-bold text-white leading-none">{cm} cm</span>
                        <span className="mt-0.5 text-[9px] text-zinc-500">{cmToFeetInches(cm)}</span>
                      </div>
                      <div className="mt-0.5 h-2 w-px bg-zinc-700" />
                    </motion.div>

                    {/* Silhouette */}
                    <motion.div
                      className="absolute left-1/2"
                      style={{ bottom: FLOOR_Y, height: heightPx, width: widthPx, x: "-50%" }}
                      initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                      animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
                      transition={{
                        clipPath: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
                        opacity: { duration: 0.15, delay },
                      }}
                    >
                      <div
                        className="absolute inset-0 scale-110 opacity-20 blur-xl"
                        style={{ background: color }}
                      />
                      <svg
                        viewBox="0 0 100 276"
                        preserveAspectRatio="xMidYMax meet"
                        className="h-full w-full"
                        style={{ filter: `drop-shadow(0 1px 6px ${color}28)` }}
                      >
                        <defs>
                          <linearGradient id={`hg-${label.replace(/\s/g, "")}`} x1="0.5" y1="0" x2="0.5" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.45" />
                          </linearGradient>
                        </defs>
                        <path
                          d={mode === "male" ? MALE_SILHOUETTE : FEMALE_SILHOUETTE}
                          fill={`url(#hg-${label.replace(/\s/g, "")})`}
                        />
                      </svg>
                    </motion.div>

                    {/* Floor shadow */}
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/60 blur-sm"
                      style={{ bottom: FLOOR_Y - 3, width: widthPx * 0.9, height: 5 }}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 0.5, scaleX: 1 }}
                      transition={{ delay: delay + 0.25, duration: 0.35 }}
                    />

                    {/* Name */}
                    <motion.p
                      className="absolute whitespace-nowrap text-center text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600"
                      style={{ bottom: 6 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: delay + 0.15 }}
                    >
                      {label}
                    </motion.p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
