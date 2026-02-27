"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { Country } from "@/lib/countries";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";
import {
  type LeaderboardSortKey,
  sortLeaderboard,
  type LeaderboardCountry,
} from "@/lib/scoring";

type Props = {
  countries: Country[];
};

const SORT_OPTIONS: { id: LeaderboardSortKey; label: string }[] = [
  { id: "overall", label: "Overall Passport Score" },
  { id: "dating", label: "Top Dating Success" },
  { id: "affordable", label: "Most Affordable" },
  { id: "lifestyle", label: "Best Lifestyle & Remote Work" },
  { id: "safest", label: "Safest" },
];

const scoreForView = (country: LeaderboardCountry, selected: LeaderboardSortKey) => {
  if (selected === "overall") return country.scores.overall;
  if (selected === "dating") return country.scores.dating;
  if (selected === "affordable") return country.scores.cost;
  if (selected === "lifestyle") return country.scores.lifestyle;
  return country.scores.safetyHealthcare;
};

export default function LeaderboardClient({ countries }: Props) {
  const [selected, setSelected] = useState<LeaderboardSortKey>("overall");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const ranked = useMemo(() => sortLeaderboard(countries, selected), [countries, selected]);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-8">
      <div className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ranking Criteria</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                selected === option.id
                  ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {ranked.map((country, idx) => {
          const score = scoreForView(country, selected);
          const isOpen = openSlug === country.slug;
          const flagCode = COUNTRY_FLAG_CODE[country.slug];

          return (
            <motion.div
              key={`${country.slug}-${selected}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenSlug(isOpen ? null : country.slug)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-zinc-800/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-xs font-bold text-zinc-200">
                  {idx + 1}
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                    {flagCode ? (
                      <ReactCountryFlag
                        countryCode={flagCode}
                        svg
                        style={{ width: "1.1em", height: "1.1em" }}
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-500">NA</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">{country.name}</p>
                    <p className="text-xs text-zinc-500">{country.region}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">Score</p>
                  <p className="text-lg font-black text-emerald-300">{score.toFixed(1)}</p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-zinc-800/70"
                  >
                    <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Dating</p>
                        <p className="mt-1 text-sm font-bold text-zinc-100">{country.scores.dating.toFixed(1)} / 10</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Cost</p>
                        <p className="mt-1 text-sm font-bold text-zinc-100">{country.scores.cost.toFixed(1)} / 10</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Lifestyle</p>
                        <p className="mt-1 text-sm font-bold text-zinc-100">{country.scores.lifestyle.toFixed(1)} / 10</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Safety & Healthcare</p>
                        <p className="mt-1 text-sm font-bold text-zinc-100">{country.scores.safetyHealthcare.toFixed(1)} / 10</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end px-4 pb-4">
                      <Link
                        href={`/country/${country.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                      >
                        View Country Details
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
