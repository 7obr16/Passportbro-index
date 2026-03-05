"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  Users,
  ThumbsUp,
  ThumbsDown,
  Heart,
  MessageSquare,
  Shield,
  Wifi,
  Sun,
  Activity,
  Palmtree,
  Moon,
  Mountain,
  ChevronDown,
  Star,
  Lock,
  ArrowRight,
} from "lucide-react";
import { hasAccess } from "@/lib/access";
import SignupModal from "@/components/SignupModal";
import type { Country } from "@/lib/countries";
import { getCountryScores } from "@/lib/scoring";
import { getPros, getCons } from "@/lib/communityIntel";
import { getEnglishScore0To100 } from "@/lib/englishProficiencyIndex";
import CountryMark from "@/components/CountryMark";
import ClimateInsights from "@/components/ClimateInsights";
import AirQualityMap from "@/components/AirQualityMap";
import CountryStatsSection from "@/components/CountryStatsSection";
import BodyComparison from "@/components/BodyComparison";
import SourceLink from "@/components/SourceLink";
import SiteNav from "@/components/SiteNav";
import CountryGlobe from "@/components/CountryGlobe";
import { TIER_CONFIG } from "@/lib/countries";
import RateCountryModal from "@/components/RateCountryModal";
import { supabase } from "@/lib/supabase";

type Props = {
  country: Country;
  allCountries: Country[];
  gallery: { key: "nightlife" | "food" | "city" | "beaches"; label: string; images: string[] }[];
  womenGroupImageUrl?: string | null;
};

const TIER_BADGE: Record<string, string> = {
  "Very Easy":  "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  "Easy":       "bg-emerald-500/5 text-emerald-300/80 ring-emerald-500/20",
  "Normal":     "bg-zinc-500/10 text-zinc-400 ring-zinc-600/20",
  "Hard":       "bg-zinc-600/10 text-zinc-500 ring-zinc-700/20",
  "Improbable": "bg-zinc-700/10 text-zinc-500 ring-zinc-700/20",
  "N/A":        "bg-zinc-800/10 text-zinc-600 ring-zinc-800/20",
};

const TIER_BAR: Record<string, string> = {
  "Very Easy": "bg-emerald-500", "Easy": "bg-emerald-500/70", "Normal": "bg-zinc-600",
  "Hard": "bg-zinc-700", "Improbable": "bg-zinc-700", "N/A": "bg-zinc-800",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const SCORE_ITEMS: { key: "dating" | "cost" | "internet" | "friendly" | "safety"; label: string; icon: typeof Star }[] = [
  { key: "dating", label: "Dating", icon: Heart },
  { key: "cost", label: "Cost", icon: DollarSign },
  { key: "internet", label: "Internet", icon: Wifi },
  { key: "friendly", label: "Friendly", icon: Users },
  { key: "safety", label: "Safety", icon: Shield },
];

type CommunityStats = {
  count: number;
  avgDating: number;
  avgSafety: number;
  avgCost: number;
  avgFriendliness: number;
};

type MemberComment = {
  id: string;
  userId: string;
  comment: string;
  datingRating: number;
  safetyRating: number;
  costRating: number;
  friendlinessRating: number;
  createdAt: string;
};

const COST_DISPLAY = ["Very Cheap", "Cheap", "Moderate", "Expensive", "Very Expensive"];

export default function CountryDetailClient({ country, allCountries, gallery, womenGroupImageUrl }: Props) {
  const [isIntelOpen, setIsIntelOpen] = useState(true);
  const [expandPros, setExpandPros] = useState(false);
  const [expandCons, setExpandCons] = useState(false);
  const [activeGalleryKey, setActiveGalleryKey] = useState<null | Props["gallery"][number]["key"]>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const tierHex = TIER_CONFIG[country.datingEase]?.hex ?? "#71717a";

  // Auth + community rating state
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"signup" | "login">("signup");

  const openPaywall = (mode: "signup" | "login" = "signup") => {
    setPaywallMode(mode);
    setPaywallOpen(true);
  };
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [memberComments, setMemberComments] = useState<MemberComment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("id", uid)
      .single();
    setHasPaid(data?.has_paid ?? false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setUserId(user?.id ?? null);
      setUserEmail(user?.email ?? null);
      if (user?.id) fetchProfile(user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUserId(user?.id ?? null);
      setUserEmail(user?.email ?? null);
      if (user?.id) fetchProfile(user.id);
      else setHasPaid(false);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCommunityData = useCallback(() => {
    supabase
      .from("country_ratings")
      .select("id, user_id, dating_rating, safety_rating, cost_rating, friendliness_rating, comment, created_at")
      .eq("country_slug", country.slug)
      .then(({ data, error }) => {
        // Silently ignore errors (e.g. table not yet in schema cache)
        if (error || !data || data.length === 0) {
          setCommunityStats({ count: 0, avgDating: 0, avgSafety: 0, avgCost: 0, avgFriendliness: 0 });
          setMemberComments([]);
          return;
        }
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        setCommunityStats({
          count: data.length,
          avgDating: avg(data.map((d) => d.dating_rating)),
          avgSafety: avg(data.map((d) => d.safety_rating)),
          avgCost: avg(data.map((d) => d.cost_rating)),
          avgFriendliness: avg(data.map((d) => d.friendliness_rating)),
        });
        setMemberComments(
          data
            .filter((d) => d.comment)
            .map((d) => ({
              id: d.id,
              userId: d.user_id,   // kept only for "your review" highlight
              comment: d.comment!,
              datingRating: d.dating_rating,
              safetyRating: d.safety_rating,
              costRating: d.cost_rating,
              friendlinessRating: d.friendliness_rating,
              createdAt: d.created_at,
            }))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      });
  }, [country.slug]);

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const scores = getCountryScores(country);
  const prosList = getPros(country.slug, country.redditPros);
  const consList = getCons(country.slug, country.redditCons);
  const initialShow = 3;
  const prosVisible = expandPros ? prosList : prosList.slice(0, initialShow);
  const consVisible = expandCons ? consList : consList.slice(0, initialShow);
  const prosMore = Math.max(0, prosList.length - initialShow);
  const consMore = Math.max(0, consList.length - initialShow);

  const allStats = [
    { icon: Heart,         label: "Dating",     score: scores.dating,   value: country.datingEase },
    { icon: DollarSign,    label: "Cost",        score: scores.cost,     value: country.budgetTier },
    { icon: Wifi,          label: "Internet",    score: scores.internet, value: country.internetMbps ? `${country.internetSpeed} (${Math.round(country.internetMbps)} Mbps)` : country.internetSpeed },
    { icon: Users,         label: "Friendly",    score: scores.friendly, value: country.receptiveness },
    { icon: Shield,        label: "Safety",      score: scores.safety,   value: country.safetyLevel },
    { icon: Activity,      label: "Healthcare",  score: Math.round(country.healthcareQuality === "High" ? 85 : country.healthcareQuality === "Moderate" ? 55 : 30), value: country.healthcareQuality },
    { icon: MessageSquare, label: "English",     score: getEnglishScore0To100(country.slug), value: country.englishProficiency },
    { icon: Sun,           label: "Climate",     score: Math.round(country.climate === "Tropical" ? 75 : country.climate === "Temperate" ? 70 : 50), value: country.climate },
  ];

  const radarStats = allStats.slice(0, 6);
  const radarAngles = radarStats.map((_, i) => (i / radarStats.length) * Math.PI * 2 - Math.PI / 2);
  const radarR = 90;
  const radarCx = 110;
  const radarCy = 110;
  const radarPt = (angle: number, pct: number) => ({
    x: radarCx + Math.cos(angle) * radarR * pct,
    y: radarCy + Math.sin(angle) * radarR * pct,
  });
  const radarPath = radarStats
    .map((s, i) => {
      const p = radarPt(radarAngles[i], s.score / 100);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ") + " Z";

  const canAccess = hasAccess({ has_paid: hasPaid, email: userEmail }, country.slug);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <motion.div
        className="mx-auto max-w-5xl px-4 pb-20 pt-4 sm:px-5 md:pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Back */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to tier list
          </Link>
        </motion.div>

        {/* Hero: left = interactive globe, right = typical look */}
        <motion.div variants={itemVariants} className="mb-6 grid gap-3 sm:mb-8 sm:gap-4 md:grid-cols-2">
          {/* Left: 3D Globe highlighting this country */}
          <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-zinc-950 sm:h-64 md:h-80">
            <CountryGlobe slug={country.slug} tierHex={tierHex} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <CountryMark slug={country.slug} name={country.name} flagEmoji={country.flagEmoji} />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 sm:text-xs">
                    {country.region}
                  </p>
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                    {country.name}
                  </h1>
                </div>
              </div>
            </div>
            <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ring-1 ${TIER_BADGE[country.datingEase]}`}>
              {country.datingEase}
            </span>
          </div>

          {/* Right: Single typical look */}
          {country.womenImageUrl && (
            <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-zinc-800/80 sm:h-64 md:h-80">
              <motion.img
                initial={{ scale: 1.15 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                src={country.womenImageUrl}
                alt={`Typical women in ${country.name}`}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md">
                Typical Look (AI Generated)
              </div>
            </div>
          )}
        </motion.div>

        {/* Passport Bro Score — always visible so you don't have to go back to menu */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
            {/* Header row: label + Rate button */}
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Passport Bro score
              </p>
              <div className="group/rate relative">
                <button
                  onClick={() => {
                    if (userId) setIsRatingModalOpen(true);
                    else openPaywall("login");
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                    userId
                      ? "cursor-pointer border-emerald-600/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                      : "cursor-pointer border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  <Star className="h-3 w-3" />
                  {userId ? "Rate this Country" : "Sign in to Rate"}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 md:gap-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tabular-nums tracking-tight text-white sm:text-4xl">
                    {Math.round(scores.overall)}
                  </span>
                  <span className="text-sm font-medium text-zinc-500">/ 100 overall</span>
                </div>
                {(country.slug === "indonesia" || country.slug === "malaysia") && (
                  <p className="max-w-xl text-[10px] leading-relaxed text-zinc-400">
                    {country.slug === "indonesia" && (
                      <>
                        Legal note: Indonesia&apos;s revised national Criminal Code (<span className="italic">KUHP</span>)
                        contains articles that can criminalize sex outside of marriage if reported by close relatives,
                        which means casual relationships can carry real legal risk for both locals and foreigners.
                      </>
                    )}
                    {country.slug === "malaysia" && (
                      <>
                        Cultural note: Malaysia is a majority-Muslim country, and Islamic law applies to Muslims
                        alongside civil law in many states. Social norms and some local regulations are conservative
                        around dating, public affection, and sex outside marriage.
                      </>
                    )}
                  </p>
                )}
              </div>
              <div className="hidden h-8 w-px bg-zinc-800 sm:block" />
              <div className="grid grid-cols-3 gap-x-3 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-6 md:gap-x-8">
                {SCORE_ITEMS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-1.5 sm:gap-2">
                    <Icon className="h-3 w-3 text-zinc-500 sm:h-3.5 sm:w-3.5" />
                    <span className="text-[10px] text-zinc-500 sm:text-xs">{label}</span>
                    <span className="text-xs font-bold tabular-nums text-zinc-200 sm:text-sm">
                      {Math.round(scores[key])}
                    </span>
                    {key === "safety" && <SourceLink sourceKey="safety" className="ml-0.5" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── PREMIUM CONTENT — locked behind paywall ── */}
        <div className="relative">
          {/* Blurred layer */}
          <div className={!canAccess ? "pointer-events-none select-none blur-[3px] opacity-50" : ""}>

        {/* Country Visual Gallery */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-base font-bold text-zinc-100 sm:text-lg">Country Visuals</h2>
            <p className="text-[10px] text-zinc-500 sm:text-xs">Nightlife · Food · City · Beaches</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {gallery.map((item, idx) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 cursor-pointer"
                onClick={() => {
                  setActiveGalleryKey(item.key);
                  setActiveImageIndex(0);
                }}
              >
                <img
                  src={item.images[0]}
                  alt={`${country.name} ${item.label}`}
                  loading="lazy"
                  className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How Women Look — 8 women group (standardized format) */}
        {womenGroupImageUrl && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-lg font-bold text-zinc-100">How Women Look</h2>
              <p className="text-xs text-zinc-500">Typical look · 8 women, same format (AI generated)</p>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 sm:aspect-[16/9]">
              <img
                src={womenGroupImageUrl}
                alt={`Typical women in ${country.name} — 8 women group`}
                loading="lazy"
                className="block h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>
        )}

        {/* Gallery Lightbox */}
        <AnimatePresence>
          {activeGalleryKey && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative flex h-full max-h-[90vh] w-full flex-col overflow-hidden border-zinc-800 bg-zinc-950/95 sm:mx-4 sm:h-auto sm:max-w-4xl sm:rounded-2xl sm:border"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Photo Set</p>
                    <p className="text-sm font-semibold text-zinc-100">
                      {country.name} ·{" "}
                      {gallery.find((g) => g.key === activeGalleryKey)?.label ?? ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveGalleryKey(null)}
                    className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
                  >
                    Close
                  </button>
                </div>

                {(() => {
                  const active = gallery.find((g) => g.key === activeGalleryKey);
                  if (!active) return null;
                  const images = active.images.length ? active.images : [country.imageUrl];
                  const current = images[Math.min(activeImageIndex, images.length - 1)];

                  return (
                    <>
                      <div className="relative flex h-[50vh] w-full items-center justify-center bg-zinc-900 sm:h-[70vh] sm:max-h-[520px]">
                        <motion.img
                          key={current}
                          src={current}
                          alt={`${country.name} ${active.label}`}
                          className="max-h-full max-w-full object-contain"
                          initial={{ opacity: 0.3, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-[11px] text-zinc-200">
                          {active.label} · {activeImageIndex + 1} / {images.length}
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto border-t border-zinc-800 bg-zinc-950/90 px-3 py-2 sm:py-3">
                        {images.map((img, idx) => (
                          <button
                            key={img}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition sm:h-20 sm:w-32 ${
                              idx === activeImageIndex
                                ? "border-emerald-500"
                                : "border-zinc-800 hover:border-zinc-600"
                            }`}
                          >
                            <img
                              src={img}
                              alt={`${country.name} thumbnail ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {idx === activeImageIndex && (
                              <div className="pointer-events-none absolute inset-0 ring-2 ring-emerald-500/60" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <ClimateInsights
            slug={country.slug}
            countryName={country.name}
            climate={country.climate}
            hasBeach={country.hasBeach}
            hasNature={country.hasNature}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AirQualityMap slug={country.slug} countryName={country.name} />
        </motion.div>

        {/* Stats Visual */}
        <motion.div variants={itemVariants} className="mb-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
          <div className="grid md:grid-cols-[240px_1fr]">
            {/* Radar Chart */}
            <div className="flex flex-col items-center justify-center border-b border-zinc-800/40 p-6 md:border-b-0 md:border-r">
              <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-lg">
                {/* Grid rings */}
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <polygon
                    key={pct}
                    points={radarAngles
                      .map((a) => {
                        const p = radarPt(a, pct);
                        return `${p.x},${p.y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth={pct === 1 ? 0.8 : 0.4}
                  />
                ))}
                {/* Axis lines */}
                {radarAngles.map((a, i) => {
                  const outer = radarPt(a, 1);
                  return (
                    <line key={i} x1={radarCx} y1={radarCy} x2={outer.x} y2={outer.y} stroke="#27272a" strokeWidth={0.4} />
                  );
                })}
                {/* Filled area */}
                <motion.polygon
                  points={radarStats
                    .map((s, i) => {
                      const p = radarPt(radarAngles[i], s.score / 100);
                      return `${p.x},${p.y}`;
                    })
                    .join(" ")}
                  fill="#10b981"
                  fillOpacity={0.12}
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                {/* Dots + labels */}
                {radarStats.map((s, i) => {
                  const p = radarPt(radarAngles[i], s.score / 100);
                  const lp = radarPt(radarAngles[i], 1.18);
                  return (
                    <g key={s.label}>
                      <circle cx={p.x} cy={p.y} r={3} fill="#10b981" />
                      <text
                        x={lp.x}
                        y={lp.y + 3.5}
                        textAnchor="middle"
                        fill="#71717a"
                        fontSize={8}
                        fontWeight="600"
                        fontFamily="system-ui, sans-serif"
                      >
                        {s.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black tabular-nums text-emerald-400">{Math.round(scores.overall)}</span>
                <span className="text-[10px] text-zinc-600">/ 100 overall</span>
              </div>
            </div>

            {/* Bar breakdown */}
            <div className="p-5 md:p-6">
              <div className="space-y-3">
                {allStats.map((stat, idx) => (
                  <div key={stat.label} className="group">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-[11px] font-semibold text-zinc-300">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">{stat.value}</span>
                        <span className={`text-xs font-bold tabular-nums ${
                          stat.score >= 70 ? "text-emerald-400" : stat.score >= 40 ? "text-zinc-200" : "text-zinc-500"
                        }`}>
                          {stat.score}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800/60">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.score}%` }}
                        transition={{ duration: 0.8, delay: 0.1 + idx * 0.06, ease: "easeOut" }}
                        style={{
                          backgroundColor: stat.score >= 70 ? "#10b981" : stat.score >= 40 ? "#3f3f46" : "#27272a",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {country.internetMbps && (
                <p className="mt-4 text-[8px] text-zinc-700">
                  Internet: Median Fixed Broadband — Speedtest Global Index
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Vibes & Features Tags */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-wrap gap-2">
          {country.hasNightlife && (
            <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300">
              <Moon className="h-3.5 w-3.5 text-zinc-500" /> Great Nightlife
            </motion.span>
          )}
          {country.hasBeach && (
            <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300">
              <Palmtree className="h-3.5 w-3.5 text-zinc-500" /> Beach Access
            </motion.span>
          )}
          {country.hasNature && (
            <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300">
              <Mountain className="h-3.5 w-3.5 text-zinc-500" /> Nature / Mountains
            </motion.span>
          )}
        </motion.div>

        {/* Reddit Consensus */}
        <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden sm:mt-8">
          <button 
            onClick={() => setIsIntelOpen(!isIntelOpen)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-900/60 sm:p-6"
          >
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 sm:text-lg">
                <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500 sm:h-5 sm:w-5" />
                Community Intel
              </h2>
              <p className="mt-0.5 text-[10px] text-zinc-500 sm:mt-1 sm:text-xs">
                Pros, cons & member experiences — Reddit, forums, community data
              </p>
            </div>
            <motion.div
              animate={{ rotate: isIntelOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isIntelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-t border-zinc-800/50"
              >
                <div className="grid gap-3 p-4 pt-3 sm:gap-4 sm:p-6 sm:pt-4 md:grid-cols-2 md:items-stretch">
                  {/* Pros */}
                  <motion.div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4 sm:p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400">
                      <ThumbsUp className="h-3.5 w-3.5 shrink-0" />
                      Pros
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-emerald-400">
                        {prosList.length}
                      </span>
                    </h2>
                    <ul className="flex-1 space-y-3">
                      {prosVisible.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/80" aria-hidden />
                          <span className="min-w-0 flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex shrink-0 flex-col gap-1">
                      {prosMore > 0 && !expandPros && (
                        <button
                          type="button"
                          onClick={() => setExpandPros(true)}
                          className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 py-2.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
                        >
                          Show {prosMore} more
                        </button>
                      )}
                      {expandPros && prosMore > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandPros(false)}
                          className="text-[11px] font-medium text-zinc-500 transition hover:text-zinc-400"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </motion.div>

                  {/* Cons */}
                  <motion.div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4 sm:p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-red-400">
                      <ThumbsDown className="h-3.5 w-3.5 shrink-0" />
                      Cons
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-red-400">
                        {consList.length}
                      </span>
                    </h2>
                    <ul className="flex-1 space-y-3">
                      {consVisible.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/80" aria-hidden />
                          <span className="min-w-0 flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex shrink-0 flex-col gap-1">
                      {consMore > 0 && !expandCons && (
                        <button
                          type="button"
                          onClick={() => setExpandCons(true)}
                          className="w-full rounded-lg border border-red-500/30 bg-red-500/5 py-2.5 text-[11px] font-semibold text-red-400 transition hover:bg-red-500/10"
                        >
                          Show {consMore} more
                        </button>
                      )}
                      {expandCons && consMore > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandCons(false)}
                          className="text-[11px] font-medium text-zinc-500 transition hover:text-zinc-400"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* ─── Member Experiences ─── */}
                <div className="border-t border-zinc-800/50 px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <Users className="h-3.5 w-3.5 text-zinc-500" />
                      Member Experiences
                      {memberComments.length > 0 && (
                        <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-400">
                          {memberComments.length}
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() => {
                        if (userId) setIsRatingModalOpen(true);
                        else openPaywall("login");
                      }}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                        userId
                          ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                          : "border-zinc-700/50 bg-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      <MessageSquare className="h-3 w-3" />
                      {userId ? "Share Experience" : "Sign in to Share"}
                    </button>
                  </div>

                  {memberComments.length > 0 ? (
                    <div className="space-y-2.5">
                      {(showAllComments ? memberComments : memberComments.slice(0, 3)).map((mc) => {
                        const isOwn = mc.userId === userId;
                        const date = new Date(mc.createdAt);
                        const timeAgo = (() => {
                          const diffMs = Date.now() - date.getTime();
                          const diffDays = Math.floor(diffMs / 86_400_000);
                          if (diffDays < 1) return "Today";
                          if (diffDays === 1) return "Yesterday";
                          if (diffDays < 30) return `${diffDays}d ago`;
                          if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
                          return `${Math.floor(diffDays / 365)}y ago`;
                        })();
                        return (
                          <div
                            key={mc.id}
                            className={`rounded-xl border p-3.5 sm:p-4 ${
                              isOwn
                                ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                                : "border-zinc-800/50 bg-zinc-950/50"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                    isOwn
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : "bg-zinc-800 text-zinc-500"
                                  }`}
                                >
                                  {isOwn ? "You" : "M"}
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-400">
                                  {isOwn ? "Your review" : "Community member"}
                                </span>
                                <span className="text-[10px] text-zinc-600">{timeAgo}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                                <span className="flex items-center gap-0.5" title="Dating">
                                  <Heart className="h-2.5 w-2.5" />
                                  {mc.datingRating}
                                </span>
                                <span className="flex items-center gap-0.5" title="Safety">
                                  <Shield className="h-2.5 w-2.5" />
                                  {mc.safetyRating}
                                </span>
                                <span className="flex items-center gap-0.5" title="Friendly">
                                  <Users className="h-2.5 w-2.5" />
                                  {mc.friendlinessRating}
                                </span>
                                <span className="flex items-center gap-0.5" title="Cost">
                                  <DollarSign className="h-2.5 w-2.5" />
                                  {"$".repeat(mc.costRating)}
                                </span>
                              </div>
                            </div>
                            <p className="text-[13px] leading-relaxed text-zinc-300">
                              {mc.comment}
                            </p>
                          </div>
                        );
                      })}

                      {memberComments.length > 3 && !showAllComments && (
                        <button
                          type="button"
                          onClick={() => setShowAllComments(true)}
                          className="w-full rounded-lg border border-zinc-800/50 bg-zinc-950/50 py-2.5 text-[11px] font-semibold text-zinc-500 transition hover:border-zinc-700/60 hover:text-zinc-300"
                        >
                          Show {memberComments.length - 3} more experiences
                        </button>
                      )}
                      {showAllComments && memberComments.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setShowAllComments(false)}
                          className="text-[11px] font-medium text-zinc-600 transition hover:text-zinc-400"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-[12px] text-zinc-600">No reviews yet — be the first to share your experience.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Full-width tabbed stats section */}
        <motion.div variants={itemVariants} className="mt-6">
          <CountryStatsSection country={country} allCountries={allCountries} />
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={itemVariants} className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-center text-[11px] text-zinc-500">
          All opinions are sourced from community forums and represent consensus, not professional advice.
          Always do your own research before traveling.
        </motion.div>

          {/* ── end blurred layer ── */}
          </div>

          {/* Top-fade to smooth transition from free → locked content */}
          {!canAccess && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-zinc-950 to-transparent" />
          )}

          {/* Paywall overlay card */}
          {!canAccess && (
            <div className="pointer-events-none absolute inset-0 z-20 flex justify-center px-4 pt-16">
              <div className="pointer-events-auto sticky top-24 h-fit w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-zinc-900/95 p-8 text-center shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.06]"
                style={{ boxShadow: "0 0 60px -15px rgba(16,185,129,0.2), 0 32px 64px -16px rgba(0,0,0,0.8)" }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <Lock className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Unlock Full{" "}
                  <span className="text-emerald-400">{country.name}</span>{" "}
                  Breakdown
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Get detailed stats, community intel, climate data, and everything the brotherhood says about {country.name}.
                </p>
                <ul className="mt-5 space-y-2 text-left">
                  {[
                    "Full score radar & stat breakdown",
                    "Community intel — pros & cons",
                    "Climate insights & air quality",
                    "Cost of living deep-dive",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <svg className="h-2.5 w-2.5 text-emerald-400" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openPaywall("signup")}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
                >
                  Unlock Full Access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="mt-3 text-[11px] text-zinc-600">
                  🇵🇭 Philippines is always free — it&apos;s our sample country
                </p>
              </div>
            </div>
          )}
        </div>{/* end paywall wrapper */}

      </motion.div>

      {/* Community rating modal — only mounted when user is logged in */}
      {userId && (
        <RateCountryModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          countrySlug={country.slug}
          countryName={country.name}
          userId={userId}
          onRated={fetchCommunityData}
        />
      )}

      {/* Paywall / auth modal */}
      <SignupModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        countryName={paywallMode === "signup" ? country.name : undefined}
        initialMode={paywallMode}
      />
    </div>
  );
}