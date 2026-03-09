"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Users, DollarSign, Cross, Filter, Star, Wifi, Heart, Shield } from "lucide-react";
import type { Country } from "@/lib/countries";
import { TIER_CONFIG } from "@/lib/countries";
import GlobeSection from "@/components/GlobeSection";
import SignupModal from "@/components/SignupModal";
import FilterSidebar, { FiltersState, createDefaultFilters } from "@/components/FilterSidebar";
import CountryMark from "@/components/CountryMark";
import { getCountryScores } from "@/lib/scoring";
import { hasAccess } from "@/lib/access";
import { supabase } from "@/lib/supabase";
const TIERS = ["Very Easy", "Easy", "Normal", "Hard", "Improbable", "N/A"] as const;

const TIER_BADGE: Record<string, string> = {
  "Very Easy":  "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  "Easy":       "bg-emerald-500/5 text-emerald-300/80 ring-emerald-500/20",
  "Normal":     "bg-zinc-500/10 text-zinc-400 ring-zinc-600/20",
  "Hard":       "bg-zinc-600/10 text-zinc-500 ring-zinc-700/20",
  "Improbable": "bg-zinc-700/10 text-zinc-500 ring-zinc-700/20",
  "N/A":        "bg-zinc-800/10 text-zinc-600 ring-zinc-800/20",
};

const TIER_BAR: Record<string, string> = {
  "Very Easy":  "bg-emerald-500",
  "Easy":       "bg-emerald-500/70",
  "Normal":     "bg-zinc-600",
  "Hard":       "bg-zinc-700",
  "Improbable": "bg-zinc-700",
  "N/A":        "bg-zinc-800",
};

type Props = {
  initialCountries: Country[];
};

const FILTERS_STORAGE_KEY = "passport-filters-v1";
const HOME_PAYWALL_LOCK_KEY = "passport-home-paywall-locked-v1";
const HOME_PAYWALL_GRACE_MS = 18000;
const HOME_CURTAIN_TRIGGER_OFFSET_PX = 260;
const HOME_LOCK_TRIGGER_OFFSET_PX = 820;

export default function ClientDashboard({ initialCountries }: Props) {
  const searchParams = useSearchParams();
  const isNativeApp = searchParams.get("nativeApp") === "1";
  const isNativePremium = searchParams.get("nativePremium") === "1";

  // Always start with defaults (SSR-safe). The useEffect below restores from
  // sessionStorage on the first client render without overwriting anything.
  const [filters, setFilters] = useState<FiltersState>(createDefaultFilters);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isFirstRun = useRef(true);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [scrollCurtain, setScrollCurtain] = useState(false);
  const [cardsBlurred, setCardsBlurred] = useState(false);
  const paywallTriggered = useRef(false);
  const tierSectionRef = useRef<HTMLDivElement>(null);
  const [homePaywallEligible, setHomePaywallEligible] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const openPaywall = useCallback(() => setPaywallOpen(true), []);
  const activateHomepageBlur = useCallback(() => {
    paywallTriggered.current = true;
    setCardsBlurred(true);
    try {
      localStorage.setItem(HOME_PAYWALL_LOCK_KEY, "1");
    } catch {
      // Ignore storage failures and still lock for the current session.
    }
  }, []);

  // Keep local auth state in sync so premium users bypass the homepage blur/paywall.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) {
        setHasPaid(false);
        setUserEmail(null);
        return;
      }
      setUserEmail(user.email ?? null);
      supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single()
        .then(({ data: profile }) => {
          setHasPaid(profile?.has_paid ?? false);
        });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        setHasPaid(false);
        setUserEmail(null);
        return;
      }
      setUserEmail(user.email ?? null);
      supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single()
        .then(({ data: profile }) => {
          setHasPaid(profile?.has_paid ?? false);
        });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Synthetic slug for the homepage — premium / admin / dev users bypass all blurs.
  const webAccessHome = hasAccess({ has_paid: hasPaid, email: userEmail }, "__homepage__");
  const canAccessHome = isNativeApp ? isNativePremium : webAccessHome;
  const shouldBlurHome = !canAccessHome && cardsBlurred;
  const showNativePaywallCta = isNativeApp && !canAccessHome;

  // Homepage lock now uses a longer grace window and only hard-locks
  // after the user has also scrolled into the country list.
  useEffect(() => {
    if (canAccessHome) {
      setCardsBlurred(false);
      setScrollCurtain(false);
      setHomePaywallEligible(false);
      setPaywallOpen(false);
      paywallTriggered.current = false;
      return;
    }

    let wasPreviouslyLocked = false;
    try {
      wasPreviouslyLocked = localStorage.getItem(HOME_PAYWALL_LOCK_KEY) === "1";
    } catch {
      wasPreviouslyLocked = false;
    }

    if (wasPreviouslyLocked) {
      paywallTriggered.current = true;
      setCardsBlurred(true);
      setHomePaywallEligible(true);
      return;
    }

    setCardsBlurred(false);
    setHomePaywallEligible(false);
    const graceTimer = window.setTimeout(() => {
      setHomePaywallEligible(true);
    }, HOME_PAYWALL_GRACE_MS);

    return () => {
      clearTimeout(graceTimer);
    };
  }, [canAccessHome]);

  // First invocation: load saved filters from sessionStorage.
  // Every subsequent invocation (when filters actually change): persist them.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      try {
        const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
        if (raw) setFilters(prev => ({ ...prev, ...JSON.parse(raw) }));
      } catch { /* ignore */ }
      return; // don't save on the first run — we just loaded
    }
    try {
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch { /* ignore */ }
  }, [filters]);

  // Soft curtain appears only after the grace window; the persistent blur
  // activates once the user scrolls past the first few countries.
  useEffect(() => {
    if (canAccessHome) return;

    function onScroll() {
      const y = window.scrollY;
      const sectionTop = tierSectionRef.current
        ? tierSectionRef.current.getBoundingClientRect().top + window.scrollY
        : 0;
      const curtainStart = sectionTop + HOME_CURTAIN_TRIGGER_OFFSET_PX;
      const lockStart = sectionTop + HOME_LOCK_TRIGGER_OFFSET_PX;

      setScrollCurtain(homePaywallEligible && y > curtainStart);

      if (!paywallTriggered.current && homePaywallEligible && y > lockStart) {
        activateHomepageBlur();
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activateHomepageBlur, canAccessHome, homePaywallEligible]);

  const filteredCountries = useMemo(() => {
    return initialCountries.filter((c) => {
      if (filters.maxGdp < 80000) {
        const countryGdp = parseInt(c.gdpPerCapita.replace(/[^0-9]/g, "") || "0", 10);
        if (countryGdp > filters.maxGdp) return false;
      }
      if (filters.datingDifficulty.length) {
        // Treat dating difficulty as "Max Difficulty"
        const diffLevels = { "Very Easy": 1, "Easy": 2, "Normal": 3, "Hard": 4, "Improbable": 5, "N/A": 6 };
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
        // Min. English proficiency: Very low=1 … Very high=5
        const engLevels: Record<string, number> = { "Very low": 1, "Low": 2, "Moderate": 3, "High": 4, "Very high": 5 };
        const minSelectedLevel = Math.min(...filters.englishProficiency.map(s => engLevels[s] ?? 5));
        const countryLevel = engLevels[c.englishProficiency] ?? 1;
        if (countryLevel < minSelectedLevel) return false;
      }
      if (filters.monthlyBudget.length) {
        // Treat budget as "Max Budget" (inclusive of cheaper options)
        const budgetLevels = { "<$1k": 1, "$1k-$2k": 2, "$2k-$3k": 3, "$3k-$5k": 4, "$5k+": 5 };
        const maxSelectedLevel = Math.max(...filters.monthlyBudget.map(b => budgetLevels[b as keyof typeof budgetLevels] || 0));
        const countryLevel = budgetLevels[c.budgetTier as keyof typeof budgetLevels] || 5;
        
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
    <div className="relative">
      <div className="flex w-full">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="flex-1 min-w-0 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-5">
          
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
          <section className="relative flex w-full max-w-full flex-col items-center overflow-hidden">
            <div className="relative z-10 text-center">
              <a
                href="https://www.reddit.com/r/passportbros"
                target="_blank"
                rel="noopener noreferrer"
                className={`mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md transition hover:border-emerald-500/40 hover:bg-emerald-500/15 ${
                  isNativeApp ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Sourced from Reddit r/passportbros
              </a>
              <h1
                className={`font-black tracking-tight ${
                  isNativeApp
                    ? "text-[30px] sm:text-[40px] md:text-5xl lg:text-6xl"
                    : "text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
                }`}
              >
                The Passport Bro{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  Index
                </span>
              </h1>
              <p
                className={`mx-auto mt-4 leading-relaxed text-zinc-400 drop-shadow-md ${
                  isNativeApp ? "max-w-xl text-[13px] sm:text-[15px]" : "max-w-2xl text-sm sm:text-base"
                }`}
              >
                Every country ranked by <strong className="text-zinc-200">dating ease</strong> based
                on real Reddit consensus. Includes GDP per capita, average height,
                religion, and what the community actually says.
              </p>
            </div>

            {/* Interactive Globe */}
            <GlobeSection
              countries={filteredCountries}
              onRequestSignup={openPaywall}
              unlockGlobe={canAccessHome}
              forceBlurred={shouldBlurHome}
            />
          </section>

          {/* Tier sections — blurs after time/scroll threshold */}
          <div ref={tierSectionRef} className="relative z-10 mt-6 md:mt-0">
          <motion.div
            animate={{ filter: shouldBlurHome ? "blur(4px)" : "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="space-y-8 pointer-events-none-when-blurred"
            style={{ pointerEvents: shouldBlurHome ? "none" : undefined }}
          >
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
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-5 w-1.5 rounded-full ${TIER_BAR[tier]}`} />
                    <h2 className="text-base font-bold tracking-tight text-zinc-100">
                      {tier}
                    </h2>
                    <span className="text-xs text-zinc-500">
                      {tierCountries.length} {tierCountries.length === 1 ? "country" : "countries"}
                    </span>
                  </div>

                  {/* Country cards */}
                  <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

                              {/* Always-visible metric overlays — fade on hover */}
                              <div className="absolute left-2 top-2 z-30 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-[3px] backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
                                <Star
                                  className="h-2.5 w-2.5"
                                  style={{ color: scores.overall >= 70 ? "#34d399" : scores.overall >= 50 ? "#fbbf24" : "#a1a1aa" }}
                                />
                                <span
                                  className="text-[11px] font-bold tabular-nums leading-none"
                                  style={{ color: scores.overall >= 70 ? "#34d399" : scores.overall >= 50 ? "#fbbf24" : "#a1a1aa" }}
                                >
                                  {scores.overall.toFixed(0)}
                                </span>
                              </div>

                              <div className="absolute right-2 top-2 z-30 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-[3px] backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
                                <Wifi className="h-2.5 w-2.5 text-sky-400/80" />
                                <span className="text-[10px] font-semibold tabular-nums leading-none text-white/85">
                                  {country.internetMbps ?? country.internetSpeed}
                                </span>
                                {country.internetMbps != null && (
                                  <span className="text-[7px] font-medium leading-none text-zinc-400">Mbps</span>
                                )}
                              </div>

                              {/* Bottom row: name left, cost + safety right */}
                              <div className="absolute bottom-2 left-3 right-2 z-30 flex items-end justify-between gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <CountryMark slug={country.slug} name={country.name} flagEmoji={country.flagEmoji} compact />
                                  <h3 className="truncate text-sm font-bold text-white drop-shadow-lg">
                                    {country.name}
                                  </h3>
                                </div>
                                <div className="flex shrink-0 items-center gap-1 transition-opacity duration-300 group-hover:opacity-0">
                                  <span className="rounded-md bg-black/50 px-1.5 py-[3px] text-[9px] font-semibold leading-none text-emerald-300/90 backdrop-blur-sm">
                                    {country.budgetTier}<span className="text-zinc-500">/mo</span>
                                  </span>
                                  <span className="flex items-center rounded-md bg-black/50 p-[3px] backdrop-blur-sm">
                                    <Shield
                                      className="h-2.5 w-2.5"
                                      style={{ color: scores.safety >= 65 ? "#34d399" : scores.safety >= 40 ? "#fbbf24" : "#f87171" }}
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-1 flex-col gap-2 px-3 py-3">
                              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                                {country.redditPros}
                              </p>

                              {/* Mobile-only: compact score pills (touch devices can't hover) */}
                              <div className="mt-1 flex flex-wrap gap-1.5 sm:hidden">
                                {hoverStats.slice(0, 4).map((stat) => (
                                  <span key={stat.label} className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                                    <stat.icon className="h-2.5 w-2.5 text-zinc-500" />
                                    {stat.label} <span className={stat.score >= 70 ? "text-emerald-400" : "text-zinc-300"}>{stat.score.toFixed(0)}</span>
                                  </span>
                                ))}
                              </div>

                              <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-500">
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
          </motion.div>

          {/* Cards blur overlay — fades in when blurred; native app: CTA opens in-app purchase, rest scroll-through */}
          {shouldBlurHome && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              className={`absolute inset-0 z-20 flex items-start justify-center pt-24 ${showNativePaywallCta ? "pointer-events-none" : "pointer-events-auto"}`}
              style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.6) 20%, rgba(9,9,11,0.92) 60%)" }}
            >
              <div className="pointer-events-auto mx-4 mt-8 w-full max-w-sm rounded-2xl border border-white/[0.07] bg-zinc-900/95 p-7 text-center shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.04]">
                <p className="text-lg font-bold text-white">
                  {showNativePaywallCta ? "Unlock all ranked countries" : "See all ranked countries"}
                </p>
                <p className="mt-1.5 text-sm text-zinc-400">
                  {showNativePaywallCta
                    ? "Subscribe in the app to unlock the full list and every country."
                    : "Create a free account to browse the full list and unlock every country."}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {showNativePaywallCta ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window !== "undefined" && (window as unknown as { ReactNativeWebView?: { postMessage: (s: string) => void } }).ReactNativeWebView) {
                          (window as unknown as { ReactNativeWebView: { postMessage: (s: string) => void } }).ReactNativeWebView.postMessage(JSON.stringify({ type: "show-paywall" }));
                        }
                      }}
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
                    >
                      Unlock with Premium
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={openPaywall}
                        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
                      >
                        Create Free Account
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        onClick={openPaywall}
                        className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
                {!showNativePaywallCta && (
                  <p className="mt-4 text-[11px] text-zinc-600">No credit card required to create a free account.</p>
                )}
              </div>
            </motion.div>
          )}
          </div>{/* end tier wrapper */}

          {/* Footer */}
          <footer className="mt-16 border-t border-zinc-800 pt-6 text-center text-[11px] text-zinc-600">
            <p>Passport Bro Index · Data sourced from Reddit communities</p>
            <p className="mt-1">This is community opinion, not professional advice. Always do your own research.</p>
          </footer>
          </div>
        </div>
      </div>

      {/* ── Bottom blur curtain — appears after scroll; fades in gradually ── */}
      {scrollCurtain && (
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 h-[42vh]"
          style={{
            background: "linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.5) 35%, rgba(9,9,11,0.15) 65%, transparent 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.4) 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.4) 55%, transparent 100%)",
          }}
        />
      )}

      {/* Explicit signup modal — opened by CTA buttons, not automatically */}
      <SignupModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        dismissible
      />
    </div>
  );
}