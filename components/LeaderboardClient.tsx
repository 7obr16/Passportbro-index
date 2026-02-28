"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, ExternalLink, Heart, DollarSign, Wifi, Users, Shield, Star } from "lucide-react";
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
  { id: "overall",  label: "Overall Score" },
  { id: "dating",   label: "Dating Success" },
  { id: "cost",     label: "Most Affordable" },
  { id: "internet", label: "Best Internet" },
  { id: "friendly", label: "Most Friendly" },
  { id: "safety",   label: "Safest" },
];

const BREAKDOWN: { key: keyof LeaderboardCountry["scores"]; label: string; icon: typeof Star; extra?: (c: LeaderboardCountry) => string }[] = [
  { key: "overall",  label: "Overall",  icon: Star },
  { key: "dating",   label: "Dating",   icon: Heart,      extra: (c) => c.datingEase },
  { key: "cost",     label: "Cost",     icon: DollarSign,  extra: (c) => c.budgetTier },
  { key: "internet", label: "Internet", icon: Wifi,        extra: (c) => c.internetSpeed },
  { key: "friendly", label: "Friendly", icon: Users,       extra: (c) => c.receptiveness },
  { key: "safety",   label: "Safety",   icon: Shield,      extra: (c) => c.safetyLevel },
];

export default function LeaderboardClient({ countries }: Props) {
  const [selected, setSelected] = useState<LeaderboardSortKey>("overall");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const ranked = useMemo(() => sortLeaderboard(countries, selected), [countries, selected]);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-8">
      <div className="mb-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Sort by</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all ${
                selected === option.id
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {ranked.map((country, idx) => {
          const score = country.scores[selected];
          const isOpen = openSlug === country.slug;
          const flagCode = COUNTRY_FLAG_CODE[country.slug];
          const isTop3 = idx < 3;

          return (
            <motion.div
              key={`${country.slug}-${selected}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
              className={`overflow-hidden rounded-xl border transition-colors ${
                isTop3
                  ? "border-emerald-500/20 bg-zinc-900/70"
                  : "border-zinc-800/60 bg-zinc-900/40"
              }`}
            >
              <button
                onClick={() => setOpenSlug(isOpen ? null : country.slug)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-zinc-800/30"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isTop3
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-zinc-800/80 text-zinc-400"
                }`}>
                  {idx + 1}
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                    {flagCode ? (
                      <ReactCountryFlag
                        countryCode={flagCode}
                        svg
                        style={{ width: "1.1em", height: "1.1em" }}
                      />
                    ) : (
                      <span className="text-[9px] text-zinc-600">--</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">{country.name}</p>
                    <p className="text-[10px] text-zinc-600">{country.region}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                    {SORT_OPTIONS.find(o => o.id === selected)?.label}
                  </p>
                  <p className={`text-lg font-black tabular-nums ${
                    score >= 70 ? "text-emerald-400" : score >= 40 ? "text-zinc-200" : "text-zinc-400"
                  }`}>
                    {score.toFixed(0)}
                  </p>
                </div>

                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-zinc-800/50"
                  >
                    <div className="grid gap-2 px-4 py-4 sm:grid-cols-3 lg:grid-cols-6">
                      {BREAKDOWN.map((item) => {
                        const val = country.scores[item.key];
                        const extra = item.extra?.(country);
                        return (
                          <div key={item.key} className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <item.icon className="h-3 w-3 text-zinc-600" />
                              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{item.label}</p>
                            </div>
                            <p className={`mt-1 text-sm font-bold tabular-nums ${
                              val >= 70 ? "text-emerald-400" : val >= 40 ? "text-zinc-200" : "text-zinc-500"
                            }`}>
                              {val.toFixed(0)}
                            </p>
                            {extra && (
                              <p className="mt-0.5 text-[10px] text-zinc-600">{extra}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-end border-t border-zinc-800/30 px-4 py-3">
                      <Link
                        href={`/country/${country.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 transition hover:text-emerald-400"
                      >
                        View Details
                        <ExternalLink className="h-3 w-3" />
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
