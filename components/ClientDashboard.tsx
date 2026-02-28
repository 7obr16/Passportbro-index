"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Users, DollarSign, Cross, Filter, Star, Wifi, Heart, Shield } from "lucide-react";
import type { Country } from "@/lib/countries";
import { TIER_CONFIG } from "@/lib/countries";
import GlobeSection from "@/components/GlobeSection";
import FilterSidebar, { FiltersState, createDefaultFilters } from "@/components/FilterSidebar";
import CountryMark from "@/components/CountryMark";
import { getCountryScores } from "@/lib/scoring";

const TIERS = ["Very Easy", "Easy", "Possible", "Normal", "Hard", "Improbable", "N/A"] as const;

const TIER_BADGE: Record<string, string> = {
  "Very Easy":  "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  "Easy":       "bg-emerald-500/5 text-emerald-300/80 ring-emerald-500/20",
  "Possible":   "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  "Normal":     "bg-zinc-500/10 text-zinc-400 ring-zinc-600/20",
  "Hard":       "bg-zinc-600/10 text-zinc-500 ring-zinc-700/20",
  "Improbable": "bg-zinc-700/10 text-zinc-500 ring-zinc-700/20",
  "N/A":        "bg-zinc-800/10 text-zinc-600 ring-zinc-800/20",
};

const TIER_BAR: Record<string, string> = {
  "Very Easy":  "bg-emerald-500",
  "Easy":       "bg-emerald-500/70",
  "Possible":   "bg-zinc-500",
  "Normal":     "bg-zinc-600",
  "Hard":       "bg-zinc-700",
  "Improbable": "bg-zinc-700",
  "N/A":        "bg-zinc-800",
};

type Props = {
  initialCountries: Country[];
};

export default function ClientDashboard({ initialCountries }: Props) {
  const [filters, setFilters] = useState<FiltersState>(() => createDefaultFilters());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    return initialCountries.filter((c) => {
      if (filters.maxGdp < 80000) {
        const countryGdp = parseInt(c.gdpPerCapita.replace(/[^0-9]/g, "") || "0", 10);
        if (countryGdp > filters.maxGdp) return false;
      }
      if (filters.datingDifficulty.length) {
        // Treat dating difficulty as "Max Difficulty"
        const diffLevels = { "Very Easy": 1, "Easy": 2, "Possible": 3, "Normal": 4, "Hard": 5, "Improbable": 6, "N/A": 7 };
        const maxSelectedLevel = Math.max(...filters.datingDifficulty.map(d => diffLevels[d as keyof typeof diffLevels] || 0));
        const countryLevel = diffLevels[c.datingEase as keyof typeof diffLevels] || 7;
        
        if (countryLevel > maxSelectedLevel) return false;
      }
      if (filters.receptiveness.length) {
        // Treat receptiveness as "Minimum Receptiveness"
        const recLevels = { "Low": 1, "Medium": 2, "High": 3 };
        const minSelectedLevel = Math.min(...filters.receptiveness.map(s => recLevels[s as keyof typeof recLevels] || 3));
        const countryLevel = recLevels[c.receptiveness as keyof typeof recLevels] || 1;
        
        if (countryLevel < minSelectedLevel) return false;
      }
      if (filters.localValues.length && !filters.localValues.includes(c.localValues)) return false;
      if (filters.englishProficiency.length) {
        // Treat english as "Minimum Proficiency"
        const engLevels = { "Low": 1, "Moderate": 2, "High": 3 };
        const minSelectedLevel = Math.min(...filters.englishProficiency.map(s => engLevels[s as keyof typeof engLevels] || 3));
        const countryLevel = engLevels[c.englishProficiency as keyof typeof engLevels] || 1;
        
        if (countryLevel < minSelectedLevel) return false;
      }
      if (filters.monthlyBudget.length) {
        // Treat budget as "Max Budget" (inclusive of cheaper options)
        const budgetLevels = { "<$1k": 1, "$1k-$2k": 2, "$2k-$3k": 3, "$3k+": 4 };
        const maxSelectedLevel = Math.max(...filters.monthlyBudget.map(b => budgetLevels[b as keyof typeof budgetLevels] || 0));
        const countryLevel = budgetLevels[c.budgetTier as keyof typeof budgetLevels] || 4;
        
        if (countryLevel > maxSelectedLevel) return false;
      }
      if (filters.internetSpeed.length) {
        // Treat internet as "Minimum Speed"
        const speedLevels = { "Slow": 1, "Moderate": 2, "Fast": 3 };
        const minSelectedLevel = Math.min(...filters.internetSpeed.map(s => speedLevels[s as keyof typeof speedLevels] || 3));
        const countryLevel = speedLevels[c.internetSpeed as keyof typeof speedLevels] || 1;
        
        if (countryLevel < minSelectedLevel) return false;
      }
      if (filters.climate.length && !filters.climate.includes(c.climate)) return false;
      if (filters.safetyLevel.length) {
        // Treat safety as "Minimum Safety" (inclusive of safer options)
        const safetyLevels = { "Dangerous": 1, "Moderate": 2, "Safe": 3, "Very Safe": 4 };
        const minSelectedLevel = Math.min(...filters.safetyLevel.map(s => safetyLevels[s as keyof typeof safetyLevels] || 4));
        const countryLevel = safetyLevels[c.safetyLevel as keyof typeof safetyLevels] || 1;
        
        if (countryLevel < minSelectedLevel) return false;
      }
      if (filters.healthcareQuality.length) {
        // Treat healthcare as "Minimum Quality"
        const healthLevels = { "Low": 1, "Moderate": 2, "High": 3 };
        const minSelectedLevel = Math.min(...filters.healthcareQuality.map(s => healthLevels[s as keyof typeof healthLevels] || 3));
        const countryLevel = healthLevels[c.healthcareQuality as keyof typeof healthLevels] || 1;
        
        if (countryLevel < minSelectedLevel) return false;
      }

      // Vibes (AND logic within vibes if multiple selected)
      if (filters.vibe.length) {
        if (filters.vibe.includes("Great Nightlife") && !c.hasNightlife) return false;
        if (filters.vibe.includes("Beach Access") && !c.hasBeach) return false;
        if (filters.vibe.includes("Nature/Mountains") && !c.hasNature) return false;
      }

      return true;
    });
  }, [initialCountries, filters]);

  const grouped = TIERS.map((tier) => ({
    tier,
    config: TIER_CONFIG[tier],
    countries: filteredCountries.filter((c) => c.datingEase === tier),
  })).filter((group) => group.countries.length > 0);

  return (
    <div className="flex w-full">
      <FilterSidebar 
        filters={filters} 
        setFilters={setFilters} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8">
          
          {/* Mobile Filter Toggle */}
          <div className="mb-6 flex justify-end lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Hero with Globe */}
          <section className="relative flex flex-col items-center">
            <div className="relative z-10 text-center">
              <a
                href="https://www.reddit.com/r/passportbros"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md transition hover:border-emerald-500/40 hover:bg-emerald-500/15"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Sourced from Reddit r/passportbros
              </a>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                The Passport Bro{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  Index
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 drop-shadow-md">
                Every country ranked by <strong className="text-zinc-200">dating ease</strong> based
                on real Reddit consensus. Includes GDP per capita, average height,
                religion, and what the community actually says.
              </p>
            </div>

            {/* Interactive Globe - Now only receives filtered countries! */}
            <GlobeSection countries={filteredCountries} />
          </section>

          {/* Tier sections */}
          <div className="relative z-10 mt-8 space-y-12 md:mt-0">
            {grouped.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                <p>No countries match your selected filters.</p>
                <button 
                  onClick={() => setFilters(createDefaultFilters())}
                  className="mt-4 text-sm text-emerald-500 hover:text-emerald-400"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              grouped.map(({ tier, countries: tierCountries }) => (
                <section key={tier}>
                  {/* Tier header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`h-8 w-2 rounded-full ${TIER_BAR[tier]}`} />
                    <h2 className="text-lg font-bold tracking-tight text-zinc-100">
                      {tier}
                    </h2>
                    <span className="text-sm text-zinc-500">
                      {tierCountries.length} {tierCountries.length === 1 ? "country" : "countries"}
                    </span>
                  </div>

                  {/* Country cards */}
                  <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <AnimatePresence>
                      {tierCountries.map((country) => {
                        const scores = getCountryScores(country);
                        const hoverStats = [
                          { label: "Overall", score: scores.overall, icon: Star, text: scores.overall.toFixed(0) },
                          { label: "Cost", score: scores.cost, icon: DollarSign, text: country.budgetTier },
                          { label: "Internet", score: scores.internet, icon: Wifi, text: country.internetSpeed },
                          { label: "Friendly", score: scores.friendly, icon: Heart, text: country.receptiveness },
                          { label: "Safety", score: scores.safety, icon: Shield, text: country.safetyLevel },
                        ];

                        return (
                          <motion.div
                            key={country.slug}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link
                              href={`/country/${country.slug}`}
                              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
                            >
                            {/* Tier color strip */}
                            <div className={`h-1 w-full ${TIER_BAR[tier]}`} />

                            {/* Image */}
                            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-zinc-900">
                              <img
                                src={country.womenImageUrl || country.imageUrl}
                                alt={country.name}
                                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                              
                              {/* Hover Overlay with Stats */}
                              <div className="absolute inset-0 z-20 flex flex-col justify-start bg-zinc-950/85 px-4 pt-3 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                                <div className="space-y-2">
                                  {hoverStats.map((stat, i) => (
                                    <div key={stat.label} className="group/stat flex items-center gap-2.5">
                                      <div className="flex w-[68px] shrink-0 items-center gap-1.5 text-[10px] font-medium text-zinc-300">
                                        <stat.icon className="h-3 w-3 text-zinc-500" />
                                        {stat.label}
                                      </div>
                                      <div className="relative h-4 flex-1 overflow-hidden rounded-md bg-zinc-800/60">
                                        <div 
                                          className="h-full w-0 rounded-md transition-all duration-1000 ease-out group-hover:[width:var(--score)]"
                                          style={{ 
                                            "--score": `${stat.score}%`, 
                                            backgroundColor: stat.score >= 70 ? "rgba(16, 185, 129, 0.45)" : stat.score >= 40 ? "rgba(16, 185, 129, 0.2)" : "rgba(113, 113, 122, 0.3)",
                                            transitionDelay: `${i * 60}ms`
                                          } as React.CSSProperties}
                                        />
                                        <span
                                          className="absolute inset-y-0 left-2 flex items-center text-[9px] font-bold tracking-wider text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                          style={{ transitionDelay: `${i * 60 + 300}ms` }}
                                        >
                                          {stat.text}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Absolute Badges (Stay above overlay) */}
                              <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <CountryMark slug={country.slug} name={country.name} compact />
                                  <h3 className="truncate text-sm font-bold text-white drop-shadow-lg">
                                    {country.name}
                                  </h3>
                                </div>
                              </div>
                              <span className={`absolute right-2 top-2 z-30 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 transition-opacity duration-300 group-hover:opacity-0 ${TIER_BADGE[tier]}`}>
                                {tier}
                              </span>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-1 flex-col gap-2 px-3 py-3">
                              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                                {country.redditPros}
                              </p>
                              <div className="mt-auto flex items-center gap-3 border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-500">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {country.gdpPerCapita}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {country.avgHeightFemale}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Cross className="h-3 w-3" />
                                  {country.majorityReligion}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex shrink-0 items-center justify-between border-t border-zinc-800/50 px-3 py-2">
                              <span className="text-[10px] text-zinc-600">{country.region}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-zinc-700 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                            </div>
                          </Link>
                        </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </section>
              ))
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 border-t border-zinc-800 pt-6 text-center text-[11px] text-zinc-600">
            <p>Passport Bro Index · Data sourced from Reddit communities</p>
            <p className="mt-1">This is community opinion, not professional advice. Always do your own research.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}