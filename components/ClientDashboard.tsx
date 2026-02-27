"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Users, DollarSign, Cross, Filter } from "lucide-react";
import type { Country } from "@/lib/countries";
import { TIER_CONFIG } from "@/lib/countries";
import GlobeSection from "@/components/GlobeSection";
import FilterSidebar, { FiltersState, DEFAULT_FILTERS } from "@/components/FilterSidebar";

const TIERS = ["Very Easy", "Easy", "Normal", "Hard", "Improbable"] as const;

const TIER_BADGE: Record<string, string> = {
  "Very Easy":  "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  "Easy":       "bg-lime-500/10 text-lime-400 ring-lime-500/30",
  "Normal":     "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  "Hard":       "bg-orange-500/10 text-orange-400 ring-orange-500/30",
  "Improbable": "bg-red-500/10 text-red-400 ring-red-500/30",
};

const TIER_BAR: Record<string, string> = {
  "Very Easy":  "bg-emerald-500",
  "Easy":       "bg-lime-500",
  "Normal":     "bg-amber-500",
  "Hard":       "bg-orange-500",
  "Improbable": "bg-red-500",
};

type Props = {
  initialCountries: Country[];
};

export default function ClientDashboard({ initialCountries }: Props) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    return initialCountries.filter((c) => {
      if (filters.datingDifficulty.length && !filters.datingDifficulty.includes(c.datingEase)) return false;
      if (filters.receptiveness.length && !filters.receptiveness.includes(c.receptiveness)) return false;
      if (filters.localValues.length && !filters.localValues.includes(c.localValues)) return false;
      if (filters.englishProficiency.length && !filters.englishProficiency.includes(c.englishProficiency)) return false;
      if (filters.monthlyBudget.length && !filters.monthlyBudget.includes(c.budgetTier)) return false;
      if (filters.visaEase.length && !filters.visaEase.includes(c.visaEase)) return false;
      if (filters.internetSpeed.length && !filters.internetSpeed.includes(c.internetSpeed)) return false;
      if (filters.climate.length && !filters.climate.includes(c.climate)) return false;
      if (filters.safetyLevel.length && !filters.safetyLevel.includes(c.safetyLevel)) return false;
      if (filters.healthcareQuality.length && !filters.healthcareQuality.includes(c.healthcareQuality)) return false;

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
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Sourced from Reddit r/passportbros
              </p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                The Passport Bro{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 bg-clip-text text-transparent">
                  Country Tier List
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
                  onClick={() => setFilters(DEFAULT_FILTERS)}
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
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {tierCountries.map((country) => (
                      <Link
                        key={country.slug}
                        href={`/country/${country.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
                      >
                        {/* Tier color strip */}
                        <div className={`h-1 w-full ${TIER_BAR[tier]}`} />

                        {/* Image */}
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={country.womenImageUrl || country.imageUrl}
                            alt={country.name}
                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                          <div className="absolute bottom-2 left-3 flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white drop-shadow-lg">
                              {country.name}
                            </h3>
                          </div>
                          <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${TIER_BADGE[tier]}`}>
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
                        <div className="flex items-center justify-between border-t border-zinc-800/50 px-3 py-2">
                          <span className="text-[10px] text-zinc-600">{country.region}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-700 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
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