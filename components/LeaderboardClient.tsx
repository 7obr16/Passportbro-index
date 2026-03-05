"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, ExternalLink, Heart, DollarSign, Wifi, Users, Shield, Star, Lock, ArrowRight } from "lucide-react";
import type { Country } from "@/lib/countries";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";
import {
  type LeaderboardSortKey,
  sortLeaderboard,
  type LeaderboardCountry,
} from "@/lib/scoring";
import SourceLink from "@/components/SourceLink";
import { countryCodeFromFlagEmoji } from "@/lib/flagUtils";
import { NUMBEO_COST_INDEX } from "@/lib/affordabilityIndex";
import { GPI_RANK } from "@/lib/safetyIndex";
import { GALLUP_ACCEPTANCE, INTERNATIONS_SETTLING_IN_RANK } from "@/lib/friendlinessIndex";
import { hasAccess } from "@/lib/access";
import { supabase } from "@/lib/supabase";
import SignupModal from "@/components/SignupModal";

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
  const [hasPaid, setHasPaid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      setUserEmail(user.email ?? null);
      supabase.from("profiles").select("has_paid").eq("id", user.id).single()
        .then(({ data: p }) => setHasPaid(p?.has_paid ?? false));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const user = session?.user;
      if (!user) { setHasPaid(false); setUserEmail(null); return; }
      setUserEmail(user.email ?? null);
      supabase.from("profiles").select("has_paid").eq("id", user.id).single()
        .then(({ data: p }) => setHasPaid(p?.has_paid ?? false));
    });
    return () => subscription.unsubscribe();
  }, []);

  // Leaderboard uses "overall" as the slug sentinel — no country-specific free sample
  const canAccess = hasAccess({ has_paid: hasPaid, email: userEmail }, "__leaderboard__");

  const ranked = useMemo(() => {
    const parseHeight = (h: string) => {
      const m = h?.match(/(\d+(?:\.\d+)?)/);
      if (!m) return null;
      const v = parseFloat(m[1]);
      return v < 3 ? v * 100 : v;
    };
    const parseGdp = (g: string) => parseInt((g || "").replace(/[^0-9]/g, ""), 10) || 0;

    const verified = countries.filter((c) => {
      const hM = parseHeight(c.avgHeightMale);
      const hF = parseHeight(c.avgHeightFemale);
      const hasCoreCardData =
        hM != null &&
        hF != null &&
        parseGdp(c.gdpPerCapita) > 0 &&
        !!c.majorityReligion &&
        c.majorityReligion !== "N/A";

      // Keep leaderboard objective metrics strictly linked to known source rows.
      const hasObjectiveIndexes =
        c.slug in NUMBEO_COST_INDEX &&
        c.slug in GPI_RANK &&
        (c.slug in INTERNATIONS_SETTLING_IN_RANK || c.slug in GALLUP_ACCEPTANCE);

      return hasCoreCardData && hasObjectiveIndexes;
    });

    return sortLeaderboard(verified, selected);
  }, [countries, selected]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-5 sm:pt-8">
      <div className="mb-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:mb-8 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Sort by</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-all sm:px-4 sm:text-[11px] ${
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
          const flagCode = COUNTRY_FLAG_CODE[country.slug] ?? countryCodeFromFlagEmoji(country.flagEmoji);
          const isTop3 = idx < 3;
          const isLocked = !canAccess && idx >= 3;

          return (
            <motion.div
              key={`${country.slug}-${selected}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
            >
              {/* Paywall banner — injected once between row 3 and row 4 */}
              {idx === 3 && !canAccess && (
                <div className="mb-2 flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-zinc-900/80 px-4 py-4 shadow-lg ring-1 ring-white/[0.04]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">Unlock the Full Ranking</p>
                    <p className="text-xs text-zinc-500">Rows 4–{ranked.length} are locked. Get full access to see every country ranked.</p>
                  </div>
                  <button
                    onClick={() => setPaywallOpen(true)}
                    className="group flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-emerald-400"
                  >
                    Unlock
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}

            <div
              className={`overflow-hidden rounded-xl border transition-colors ${
                isTop3
                  ? "border-emerald-500/20 bg-zinc-900/70"
                  : isLocked
                  ? "border-zinc-800/40 bg-zinc-900/20"
                  : "border-zinc-800/60 bg-zinc-900/40"
              } ${isLocked ? "relative" : ""}`}
            >
              {/* Blur overlay for locked rows */}
              {isLocked && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[3px]">
                  <Lock className="h-4 w-4 text-zinc-700" />
                </div>
              )}

              <button
                disabled={isLocked}
                onClick={() => !isLocked && setOpenSlug(isOpen ? null : country.slug)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition sm:gap-4 sm:px-4 sm:py-3 ${
                  isLocked ? "cursor-default opacity-40 select-none" : "hover:bg-zinc-800/30"
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs ${
                  isTop3
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-zinc-800/80 text-zinc-400"
                }`}>
                  {idx + 1}
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 sm:h-7 sm:w-7">
                    {flagCode ? (
                      <ReactCountryFlag
                        countryCode={flagCode}
                        svg
                        style={{ width: "1.1em", height: "1.1em" }}
                      />
                    ) : country.flagEmoji ? (
                      <span className="text-sm leading-none">{country.flagEmoji}</span>
                    ) : (
                      <span className="text-[9px] text-zinc-600">--</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-zinc-100 sm:text-sm">{country.name}</p>
                    <p className="hidden text-[10px] text-zinc-600 sm:block">{country.region}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="hidden text-[9px] uppercase tracking-wider text-zinc-600 sm:block">
                    {SORT_OPTIONS.find(o => o.id === selected)?.label}
                  </p>
                  <p className={`text-base font-black tabular-nums sm:text-lg ${
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
                {isOpen && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-zinc-800/50"
                  >
                    <div className="grid grid-cols-2 gap-2 px-3 py-3 sm:grid-cols-3 sm:px-4 sm:py-4 lg:grid-cols-6">
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
            </div>{/* end row card */}
            </motion.div>
          );
        })}
      </div>

      <SignupModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />

      {/* Data sources — same reference as country detail, dashboard, globe; getCountryScores only */}
      <div className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Data sources</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
          Leaderboard scores use the same reference data and the same scoring function (<code className="rounded bg-zinc-800/80 px-1 text-[10px]">getCountryScores</code>) as country profiles, the dashboard, and the globe. Safety = safetyIndex (Numbeo), Cost = affordabilityIndex (Numbeo), Friendly = friendlinessIndex (InterNations / Gallup), Internet = Speedtest, Dating = curated. No separate dataset.
        </p>
        <ul className="mt-4 space-y-2 text-[11px] text-zinc-500">
          <li className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="font-medium text-zinc-400">Safety</span>
            <span className="text-zinc-600">·</span>
            <SourceLink sourceKey="safety" className="text-zinc-500 hover:text-zinc-300" />
            <span className="text-zinc-600">(Safety Index: crime / day-to-day)</span>
          </li>
          <li className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="font-medium text-zinc-400">Cost (affordability)</span>
            <span className="text-zinc-600">·</span>
            <SourceLink sourceKey="affordability" className="text-zinc-500 hover:text-zinc-300" />
          </li>
          <li className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="font-medium text-zinc-400">Friendly (local friendliness)</span>
            <span className="text-zinc-600">·</span>
            <SourceLink sourceKey="internations" className="text-zinc-500 hover:text-zinc-300" />
            <span className="text-zinc-600">(Ease of Settling In; Gallup fallback)</span>
          </li>
          <li className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="font-medium text-zinc-400">Internet</span>
            <span className="text-zinc-600">·</span>
            <SourceLink sourceKey="internet" className="text-zinc-500 hover:text-zinc-300" />
            <span className="text-zinc-600">(Speedtest Global Index)</span>
          </li>
          <li className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="font-medium text-zinc-400">Dating</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">Curated score (same as country profile and dashboard).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
