"use client";

import { useState } from "react";
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
} from "lucide-react";
import type { Country } from "@/lib/countries";
import { getCountryScores } from "@/lib/scoring";
import { getPros, getCons } from "@/lib/communityIntel";
import CountryMark from "@/components/CountryMark";
import ClimateInsights from "@/components/ClimateInsights";
import AirQualityMap from "@/components/AirQualityMap";
import HeightComparison from "@/components/HeightComparison";
import GdpVisual from "@/components/GdpVisual";
import SiteNav from "@/components/SiteNav";
import CountryGlobe from "@/components/CountryGlobe";
import { TIER_CONFIG } from "@/lib/countries";

type Props = {
  country: Country;
  gallery: { key: "nightlife" | "food" | "city" | "beaches"; label: string; images: string[] }[];
  womenGroupImageUrl?: string | null;
};

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
  "Very Easy": "bg-emerald-500", "Easy": "bg-emerald-500/70", "Possible": "bg-zinc-500", "Normal": "bg-zinc-600",
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
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const SCORE_ITEMS: { key: "dating" | "cost" | "internet" | "friendly" | "safety"; label: string; icon: typeof Star }[] = [
  { key: "dating", label: "Dating", icon: Heart },
  { key: "cost", label: "Cost", icon: DollarSign },
  { key: "internet", label: "Internet", icon: Wifi },
  { key: "friendly", label: "Friendly", icon: Users },
  { key: "safety", label: "Safety", icon: Shield },
];

export default function CountryDetailClient({ country, gallery, womenGroupImageUrl }: Props) {
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isIntelOpen, setIsIntelOpen] = useState(true);
  const [expandPros, setExpandPros] = useState(false);
  const [expandCons, setExpandCons] = useState(false);
  const [activeGalleryKey, setActiveGalleryKey] = useState<null | Props["gallery"][number]["key"]>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const tierHex = TIER_CONFIG[country.datingEase]?.hex ?? "#71717a";

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
    { icon: MessageSquare, label: "English",     score: Math.round(country.englishProficiency === "High" ? 85 : country.englishProficiency === "Moderate" ? 55 : 25), value: country.englishProficiency },
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <motion.div
        className="mx-auto max-w-5xl px-5 pb-20 pt-6 md:pt-8"
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
        <motion.div variants={itemVariants} className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Left: 3D Globe highlighting this country */}
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-zinc-950 md:h-80">
            <CountryGlobe slug={country.slug} tierHex={tierHex} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <div className="flex items-center gap-3">
                <CountryMark slug={country.slug} name={country.name} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    {country.region}
                  </p>
                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
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
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-zinc-800/80 md:h-80">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
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
        <motion.div variants={itemVariants} className="mb-8">
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Passport Bro score
            </p>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums tracking-tight text-white">
                  {Math.round(scores.overall)}
                </span>
                <span className="text-sm font-medium text-zinc-500">/ 100 overall</span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8">
                {SCORE_ITEMS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{label}</span>
                    <span className="text-sm font-bold tabular-nums text-zinc-200">{Math.round(scores[key])}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Country Visual Gallery */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-bold text-zinc-100">Country Visuals</h2>
            <p className="text-xs text-zinc-500">Nightlife · Food & cafés · City & streets · Beaches & nature</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How Women Look — 8 women group (standardized format, white background) */}
        {womenGroupImageUrl && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-lg font-bold text-zinc-100">How Women Look</h2>
              <p className="text-xs text-zinc-500">Typical look · 8 women, same format (AI generated)</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
              <img
                src={womenGroupImageUrl}
                alt={`Typical women in ${country.name} — 8 women group`}
                loading="lazy"
                className="w-full object-contain max-h-[420px] bg-white"
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
                className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring" as const, stiffness: 260, damping: 22 }}
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
                      <div className="relative flex h-[70vh] max-h-[520px] w-full items-center justify-center bg-zinc-900">
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

                      <div className="flex gap-2 overflow-x-auto border-t border-zinc-800 bg-zinc-950/90 px-3 py-3">
                        {images.map((img, idx) => (
                          <button
                            key={img}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border transition ${
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
        <motion.div variants={itemVariants} className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <button 
            onClick={() => setIsIntelOpen(!isIntelOpen)}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-zinc-900/60"
          >
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-zinc-500" />
                Community Intel
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Pros and cons from a passport bro perspective — Reddit, forums, and community reports.
              </p>
            </div>
            <motion.div
              animate={{ rotate: isIntelOpen ? 180 : 0 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
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
                <div className="grid gap-4 p-6 pt-4 md:grid-cols-2 md:items-stretch">
                  {/* Pros */}
                  <motion.div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-5">
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
                  <motion.div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-5">
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Physical Stats comparison */}
        <motion.div variants={itemVariants} className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <button 
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-zinc-900/60"
          >
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-500" />
                Physical & Demographic Stats
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Average height, GDP, and religious demographics.
              </p>
            </div>
            <motion.div
              animate={{ rotate: isStatsOpen ? 180 : 0 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isStatsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-t border-zinc-800/50"
              >
                <div className="p-5">
                  {/* Religion tag */}
                  <div className="mb-4 flex items-center justify-end">
                    <span className="text-[11px] text-zinc-500">
                      Religion: <span className="font-semibold text-zinc-300">{country.majorityReligion}</span>
                    </span>
                  </div>

                  {/* Side-by-side panels, equal height */}
                  <div className="grid gap-4 lg:grid-cols-2 items-stretch">
                    <HeightComparison
                      countryName={country.name}
                      maleHeight={country.avgHeightMale}
                      femaleHeight={country.avgHeightFemale}
                    />
                    <GdpVisual gdpPerCapita={country.gdpPerCapita} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={itemVariants} className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-center text-[11px] text-zinc-500">
          All opinions are sourced from community forums and represent consensus, not professional advice.
          Always do your own research before traveling.
        </motion.div>
      </motion.div>
    </div>
  );
}