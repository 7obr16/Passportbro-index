"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
import { US_BMI_REFERENCE } from "@/lib/bmiData";

type Props = {
  countryName: string;
  countryBmi: number;
};

function getBmiImage(bmi: number, gender: "male" | "female") {
  if (bmi < 21) return `/bmi/${gender}-slim.png`;
  if (bmi < 25) return `/bmi/${gender}-normal.png`;
  if (bmi < 30) return `/bmi/${gender}-overweight.png`;
  return `/bmi/${gender}-obese.png`;
}

function getBmiLabel(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60a5fa" };
  if (bmi < 25) return { label: "Normal", color: "#34d399" };
  if (bmi < 30) return { label: "Overweight", color: "#fbbf24" };
  return { label: "Obese", color: "#f87171" };
}

export default function BodyComparison({ countryName, countryBmi }: Props) {
  const [mode, setMode] = useState<"female" | "male">("female");

  const usBmi = US_BMI_REFERENCE;
  const countryCat = useMemo(() => getBmiLabel(countryBmi), [countryBmi]);
  const usCat = useMemo(() => getBmiLabel(usBmi), [usBmi]);

  const subjects = [
    { label: "US Average", bmi: usBmi, cat: usCat },
    { label: countryName, bmi: countryBmi, cat: countryCat },
  ];

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

      {/* Photo comparison */}
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
            {subjects.map(({ label, bmi, cat }, i) => (
              <motion.div
                key={label}
                className="flex flex-1 flex-col items-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
              >
                {/* Photo */}
                <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/60">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={getBmiImage(bmi, mode)}
                      alt={`${label} average body type at BMI ${bmi}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 40vw, 200px"
                    />
                  </div>
                </div>

                {/* Label */}
                <div className="mt-3 flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {label}
                  </span>
                  <span className="text-sm font-black text-zinc-100">
                    {bmi.toFixed(1)}{" "}
                    <span className="text-[10px] font-medium text-zinc-500">BMI</span>
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                    style={{
                      color: cat.color,
                      background: `${cat.color}18`,
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4">
        <p className="text-center text-[9px] leading-relaxed text-zinc-600">
          AI-generated reference based on WHO BMI data. Does not represent any individual.
        </p>
      </div>
    </div>
  );
}
