"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import dynamic from "next/dynamic";
import type { Country } from "@/lib/countries";
import { TIER_CONFIG } from "@/lib/countries";

const WorldGlobe = dynamic(() => import("@/components/WorldGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center md:h-[600px] xl:h-[800px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-emerald-500/20" />
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
        </div>
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
          Initializing Map
        </p>
      </div>
    </div>
  ),
});

/* ── Animated number counter ─────────────────────────────────────── */

function AnimatedCounter({
  value,
  label,
  suffix = "",
  isActive = false,
  onClick,
}: {
  value: number;
  label: string;
  suffix?: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || !numberRef.current) return;
    hasAnimated.current = true;

    const duration = 1800;
    const to = value;
    let start: number | null = null;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Custom ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      if (numberRef.current) {
        numberRef.current.textContent =
          Math.round(to * eased).toString() + suffix;
      }
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, value, suffix]);

  return (
    <div
      ref={containerRef}
      className={`group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border px-5 py-4 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer
        ${isActive 
          ? "border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
          : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.03]"
        }`}
      onClick={onClick}
    >
      <span
        ref={numberRef}
        className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-2xl font-black tabular-nums text-transparent sm:text-3xl"
      >
        0{suffix}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-zinc-400">
        {label}
      </span>
    </div>
  );
}

/* ── Main Section ────────────────────────────────────────────────── */

export default function GlobeSection({
  countries,
  onRequestSignup,
  unlockGlobe = false,
  forceBlurred = false,
}: {
  countries: Country[];
  onRequestSignup?: () => void;
  /** When true (premium / dev), the globe never blurs. */
  unlockGlobe?: boolean;
  /** When true, keep the globe blurred immediately (e.g. persisted homepage lock). */
  forceBlurred?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [globeBlurred, setGlobeBlurred] = useState(false);

  // Give visitors more breathing room before the homepage map soft-locks.
  useEffect(() => {
    if (unlockGlobe) {
      setGlobeBlurred(false);
      return;
    }
    if (forceBlurred) {
      setGlobeBlurred(true);
      return;
    }
    const t = setTimeout(() => setGlobeBlurred(true), 12000);
    return () => clearTimeout(t);
  }, [forceBlurred, unlockGlobe]);

  const toggleFilter = (filterName: string) => {
    setActiveFilter(prev => prev === filterName ? null : filterName);
  };

  /* Scroll-linked transforms for background */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const stats = useMemo(() => {
    const tiers: Record<string, number> = {};
    const regions = new Set<string>();
    for (const c of countries) {
      tiers[c.datingEase] = (tiers[c.datingEase] || 0) + 1;
      regions.add(c.region);
    }
    return {
      total: countries.length,
      topPicks: (tiers["Very Easy"] || 0) + (tiers["Easy"] || 0),
      veryEasy: tiers["Very Easy"] || 0,
      regions: regions.size,
    };
  }, [countries]);

  const tiers = ["Very Easy", "Easy", "Normal", "Hard", "Improbable"] as const;

  return (
    <div ref={sectionRef} className="relative mt-8 w-full md:mt-12">
      {/* ── Parallax atmospheric glow ─────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0 -top-40 -bottom-40 z-0 overflow-hidden"
        style={{ y: bgY }}
      >
        <div className="absolute left-1/2 top-1/4 h-[800px] w-[1200px] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.04)_0%,_transparent_60%)] blur-[100px]" />
        <div className="absolute left-1/4 top-1/2 h-[600px] w-[800px] -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.02)_0%,_transparent_60%)] blur-[80px]" />
      </motion.div>

      {/* High-end dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10">
        {/* Header + Legend */}
        <motion.div
          className="mx-auto mb-6 flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 drop-shadow-md">
              Global Overview
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-white/[0.05] bg-zinc-900/40 px-5 py-2 backdrop-blur-xl">
            {tiers.map((tier) => {
              const isFaded = activeFilter && activeFilter !== tier && activeFilter !== "Top Picks";
              const isTopPickActive = activeFilter === "Top Picks" && (tier === "Very Easy" || tier === "Easy");
              const isFullyActive = activeFilter === tier || isTopPickActive;
              
              return (
                <button 
                  key={tier} 
                  onClick={() => toggleFilter(tier)}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    isFaded ? "opacity-30 grayscale" : "opacity-100"
                  } ${isFullyActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "hover:scale-105"}`}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: TIER_CONFIG[tier]?.hex,
                      boxShadow: `0 0 10px ${TIER_CONFIG[tier]?.hex}`,
                    }}
                  />
                  <span className={`text-[9px] font-semibold ${isFullyActive ? "text-white" : "text-zinc-400"}`}>
                    {tier}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Massive Edge-to-Edge Map Container ─────────────────── */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-8 bg-gradient-to-r from-zinc-950/80 to-transparent sm:w-16 md:w-24 lg:w-32 xl:w-48" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-8 bg-gradient-to-l from-zinc-950/80 to-transparent sm:w-16 md:w-24 lg:w-32 xl:w-48" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent md:h-32" />

          <motion.div
            className="mx-auto w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1920px] cursor-grab active:cursor-grabbing"
          >
            <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-zinc-950/60 px-4 py-1.5 text-[9px] font-semibold tracking-widest text-zinc-400 backdrop-blur-md">
              SCROLL / PINCH TO ZOOM • DRAG TO PAN
            </div>

            {/* Globe with time-delayed blur */}
            <div className="relative">
              <motion.div
                animate={{ filter: globeBlurred && !unlockGlobe ? "blur(8px)" : "blur(0px)" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              >
                <WorldGlobe countries={countries} activeFilter={activeFilter} />
              </motion.div>

              {/* Blur overlay + signup prompt */}
              <AnimatePresence>
                {globeBlurred && !unlockGlobe && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-30 flex items-center justify-center"
                    style={{ background: "radial-gradient(ellipse at center, rgba(9,9,11,0.55) 0%, rgba(9,9,11,0.82) 100%)" }}
                  >
                    <div className="text-center px-6">
                      <p className="text-base font-bold text-white sm:text-lg">
                        Sign up to explore the full map
                      </p>
                      <p className="mt-1.5 text-sm text-zinc-400">
                        See every country ranked on the globe
                      </p>
                      <button
                        onClick={onRequestSignup}
                        className="mt-4 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
                      >
                        Create Free Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Animated Stat Counters ─────────────────────────────── */}
        <motion.div
          className="relative z-30 mx-auto -mt-8 grid max-w-4xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4 md:-mt-16 md:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
          }}
        >
          <AnimatedCounter 
            value={stats.total} 
            label="Ranked" 
            isActive={!activeFilter}
            onClick={() => setActiveFilter(null)}
          />
          <AnimatedCounter 
            value={stats.topPicks} 
            label="Top Picks" 
            isActive={activeFilter === "Top Picks"}
            onClick={() => toggleFilter("Top Picks")}
          />
          <AnimatedCounter 
            value={stats.veryEasy} 
            label="Very Easy" 
            isActive={activeFilter === "Very Easy"}
            onClick={() => toggleFilter("Very Easy")}
          />
          <AnimatedCounter 
            value={stats.regions} 
            label="Regions" 
            // Note: Regions isn't a filter toggle right now, just stat display
          />
        </motion.div>
      </div>
    </div>
  );
}
