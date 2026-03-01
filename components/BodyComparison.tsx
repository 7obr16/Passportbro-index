"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, ImageOff } from "lucide-react";
import { US_BMI, hasCountryBmiImage } from "@/lib/bmiData";

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

/** US reference: same American images for every comparison (left panel). */
function getUsImagePath(gender: "male" | "female") {
  return `/bmi/us-${gender}.png`;
}

/** Country reference: ethnicity- and BMI-accurate image when available (right panel). */
function getCountryImagePath(slug: string, gender: "male" | "female") {
  return `/bmi/country/${slug}-${gender}.png`;
}

export default function BodyComparison({ countrySlug, countryName, bmiMale, bmiFemale }: Props) {
  const [mode, setMode] = useState<"female" | "male">("female");

  const countryBmi = mode === "male" ? bmiMale : bmiFemale;
  const usBmi = mode === "male" ? US_BMI.male : US_BMI.female;

  const countryCat = useMemo(() => getBmiLabel(countryBmi), [countryBmi]);
  const usCat = useMemo(() => getBmiLabel(usBmi), [usBmi, mode]);

  const hasCountryImage = hasCountryBmiImage(countrySlug);

  const usSubject = { label: "US Average", bmi: usBmi, cat: usCat, isUs: true };
  const countrySubject = {
    label: countryName,
    bmi: countryBmi,
    cat: countryCat,
    isUs: false,
    imagePath: getCountryImagePath(countrySlug, mode),
  };

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
            {/* Left: US Average – fixed American reference image */}
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.35 }}
            >
              <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/60">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={getUsImagePath(mode)}
                    alt={`US average ${mode} body type at BMI ${usBmi}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 40vw, 200px"
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

            {/* Right: Country – ethnicity + BMI accurate when we have the image */}
            <motion.div
              className="flex flex-1 flex-col items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              {hasCountryImage ? (
                <>
                  <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/60">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={countrySubject.imagePath}
                        alt={`${countryName} average ${mode} body type at BMI ${countryBmi}`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 40vw, 200px"
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
              ) : (
                <div className="flex w-full flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/30 px-4 py-6">
                  <ImageOff className="h-8 w-8 text-zinc-600" />
                  <span className="mt-2 text-center text-[11px] font-medium text-zinc-500">
                    Reference image for {countryName} coming soon
                  </span>
                  <span className="mt-1 text-[10px] text-zinc-600">
                    BMI {countryBmi.toFixed(1)} · {countryCat.label}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4">
        <p className="text-center text-[9px] leading-relaxed text-zinc-600">
          US: same reference. Country: AI-generated with ethnicity and BMI in prompt.
        </p>
      </div>
    </div>
  );
}
