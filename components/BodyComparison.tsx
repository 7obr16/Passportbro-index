"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, ImageOff } from "lucide-react";
import {
  US_BMI,
  hasCountryBmiImage,
  getBmiRefImagePath,
  BMI_REFERENCE_AGE,
} from "@/lib/bmiData";

type Props = {
  countrySlug: string;
  countryName: string;
  bmiMale: number;
  bmiFemale: number;
};

function getBmiLabel(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
  if (bmi < 25) return { label: "Normal", color: "#34d399" };
  if (bmi < 30) return { label: "Overweight", color: "#fbbf24" };
  return { label: "Obese", color: "#f87171" };
}

/** Legacy US image (fallback when ref image fails). */
function getUsLegacyPath(gender: "male" | "female") {
  return `/bmi/us-${gender}.png`;
}

/** Legacy country image (fallback when ref image fails). */
function getCountryLegacyPath(slug: string, gender: "male" | "female") {
  return `/bmi/country/${slug}-${gender}.png`;
}

export default function BodyComparison({ countrySlug, countryName, bmiMale, bmiFemale }: Props) {
  const [mode, setMode] = useState<"female" | "male">("female");
  const [usRefFailed, setUsRefFailed] = useState(false);
  const [countryRefFailed, setCountryRefFailed] = useState(false);

  const countryBmi = mode === "male" ? bmiMale : bmiFemale;
  const usBmi = mode === "male" ? US_BMI.male : US_BMI.female;

  const countryCat = useMemo(() => getBmiLabel(countryBmi), [countryBmi]);
  const usCat = useMemo(() => getBmiLabel(usBmi), [usBmi, mode]);

  const hasCountryLegacyImage = hasCountryBmiImage(countrySlug);

  const usImageSrc = usRefFailed ? getUsLegacyPath(mode) : getBmiRefImagePath(mode, usBmi);
  const countryImageSrc =
    countryRefFailed && hasCountryLegacyImage
      ? getCountryLegacyPath(countrySlug, mode)
      : getBmiRefImagePath(mode, countryBmi);
  const showCountryPlaceholder =
    countryRefFailed && !hasCountryLegacyImage;

  useEffect(() => {
    setUsRefFailed(false);
    setCountryRefFailed(false);
  }, [mode]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
            <Camera className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              Body Type Reference
            </p>
            <p className="text-xs font-semibold text-zinc-200">
              Average Body at BMI
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-full border border-zinc-800 bg-zinc-900 p-0.5">
          {(["female", "male"] as const).map((k) => (
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

      {/* Photo comparison: US (left) always same reference; Country (right) ethnicity-specific when available */}
      <div className="flex-1 px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="flex h-full gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Left: US Average – BMI ref image (age 25, same format) or legacy fallback */}
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.35 }}
            >
              <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/60">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={usImageSrc}
                    alt={`US average ${mode} body type at BMI ${usBmi.toFixed(1)} (age ${BMI_REFERENCE_AGE})`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 45vw, (max-width: 1200px) 35vw, 420px"
                    quality={90}
                    onError={() => setUsRefFailed(true)}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  US Average
                </span>
                <span className="text-sm font-black text-zinc-100">
                  {usBmi.toFixed(1)}{" "}
                  <span className="text-[10px] font-medium text-zinc-500">BMI</span>
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                  style={{ color: usCat.color, background: `${usCat.color}18` }}
                >
                  {usCat.label}
                </span>
              </div>
            </motion.div>

            {/* Right: Country – BMI ref image (age 25, same format) so body matches number */}
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              {showCountryPlaceholder ? (
                <div className="flex w-full flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/30 px-4 py-6">
                  <ImageOff className="h-8 w-8 text-zinc-600" />
                  <span className="mt-2 text-center text-[11px] font-medium text-zinc-500">
                    Reference image for {countryName} coming soon
                  </span>
                  <span className="mt-1 text-[10px] text-zinc-600">
                    BMI {countryBmi.toFixed(1)} · {countryCat.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/60">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={countryImageSrc}
                        alt={`${countryName} average ${mode} body type at BMI ${countryBmi.toFixed(1)} (age ${BMI_REFERENCE_AGE})`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 45vw, (max-width: 1200px) 35vw, 420px"
                        quality={90}
                        onError={() => setCountryRefFailed(true)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col items-center gap-0.5">
                    <span className="max-w-[120px] truncate text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {countryName}
                    </span>
                    <span className="text-sm font-black text-zinc-100">
                      {countryBmi.toFixed(1)}{" "}
                      <span className="text-[10px] font-medium text-zinc-500">BMI</span>
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        color: countryCat.color,
                        background: `${countryCat.color}18`,
                      }}
                    >
                      {countryCat.label}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4">
        <p className="text-center text-[9px] leading-relaxed text-zinc-600">
          Age {BMI_REFERENCE_AGE} · Same format for all: white background, standing, same distance. Image matches average BMI (bucket).
        </p>
      </div>
    </div>
  );
}
