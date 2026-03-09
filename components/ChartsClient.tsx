"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import SignupModal from "@/components/SignupModal";
import type { Country } from "@/lib/countries";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";
import { getCountryScores } from "@/lib/scoring";
import { countryCodeFromFlagEmoji } from "@/lib/flagUtils";
import { hasAccess } from "@/lib/access";
import { supabase } from "@/lib/supabase";

type MetricOption = {
  id: string;
  label: string;
  getValue: (c: Country, scores: ReturnType<typeof getCountryScores>) => number;
  format: (v: number) => string;
  reverseDomain?: boolean;
};

const parseHeightCm = (h: string) => {
  const match = h.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 170;
  const val = parseFloat(match[1]);
  return val < 3 ? val * 100 : val;
};

const parseGdp = (g: string) => {
  const num = parseInt(g.replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

const METRICS: MetricOption[] = [
  { id: "overall", label: "Overall Passport Score", getValue: (c, s) => s.overall, format: (v) => v.toFixed(0) },
  { id: "dating", label: "Dating Ease Score", getValue: (c, s) => s.dating, format: (v) => v.toFixed(0) },
  { id: "cost", label: "Affordability Score", getValue: (c, s) => s.cost, format: (v) => v.toFixed(0) },
  { id: "internet", label: "Internet Score", getValue: (c, s) => s.internet, format: (v) => v.toFixed(0) },
  { id: "safety", label: "Safety Score", getValue: (c, s) => s.safety, format: (v) => v.toFixed(0) },
  { id: "friendly", label: "Friendly / Receptiveness Score", getValue: (c, s) => s.friendly, format: (v) => v.toFixed(0) },
  { id: "gdp", label: "GDP Per Capita ($)", getValue: (c) => parseGdp(c.gdpPerCapita), format: (v) => `$${v.toLocaleString()}` },
  { id: "heightM", label: "Avg Male Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightMale), format: (v) => `${v.toFixed(1)} cm` },
  { id: "heightF", label: "Avg Female Height (cm)", getValue: (c) => parseHeightCm(c.avgHeightFemale), format: (v) => `${v.toFixed(1)} cm` },
];

const formatTick = (metric: MetricOption, value: number) => {
  if (metric.id === "gdp") {
    if (value >= 100000) return `$${Math.round(value / 1000)}k`;
    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
    return `$${Math.round(value)}`;
  }
  if (["overall", "dating", "cost", "internet", "safety", "friendly"].includes(metric.id)) return value.toFixed(0);
  if (metric.id === "heightM" || metric.id === "heightF") return value.toFixed(0);
  return metric.format(value);
};

export default function ChartsClient({ countries }: { countries: Country[] }) {
  const [metricId, setMetricId] = useState<string>("dating");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hasPaid, setHasPaid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [nativePreviewLocked, setNativePreviewLocked] = useState(false);
  const [pageScrollY, setPageScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions((d) => ({ ...d, width: w }));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lightweight auth sync for charts section — same rules as leaderboard/home.
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
        .then(({ data: profile }) => setHasPaid(profile?.has_paid ?? false));
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
        .then(({ data: profile }) => setHasPaid(profile?.has_paid ?? false));
    });

    return () => subscription.unsubscribe();
  }, []);

  const isNativeApp = searchParams.get("nativeApp") === "1";
  const isNativePremium = searchParams.get("nativePremium") === "1";
  const showNativeFreemium = isNativeApp && !isNativePremium;
  const canAccessCharts = showNativeFreemium
    ? false
    : isNativeApp
      ? isNativePremium
      : hasAccess({ has_paid: hasPaid, email: userEmail }, "__charts__");

  useEffect(() => {
    if (!showNativeFreemium) {
      setNativePreviewLocked(false);
      setPageScrollY(0);
      return;
    }

    const onScroll = () => setPageScrollY(typeof window !== "undefined" ? window.scrollY : 0);
    const timer = window.setTimeout(() => setNativePreviewLocked(true), 3800);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [showNativeFreemium]);

  const openUnlockFlow = useCallback(() => {
    if (
      showNativeFreemium &&
      typeof window !== "undefined" &&
      (window as unknown as { ReactNativeWebView?: { postMessage: (value: string) => void } }).ReactNativeWebView
    ) {
      (
        window as unknown as { ReactNativeWebView: { postMessage: (value: string) => void } }
      ).ReactNativeWebView.postMessage(JSON.stringify({ type: "show-paywall" }));
      return;
    }

    setPaywallOpen(true);
  }, [showNativeFreemium]);

  const nativeCurtainBlur = nativePreviewLocked ? Math.min(2.8, 0.9 + pageScrollY / 420) : 0;
  const nativeCurtainOpacity = nativePreviewLocked ? Math.min(0.14, 0.06 + pageScrollY / 2400) : 0;

  const metric = METRICS.find((m) => m.id === metricId)!;

  const { rows, usValue, valueMin, valueMax } = useMemo(() => {
    const withScores = countries.map((c) => {
      const scores = getCountryScores(c);
      const value = metric.getValue(c, scores);
      return { country: c, value };
    }).filter((r) => !isNaN(r.value));

    const us = withScores.find((r) => r.country.slug === "usa");
    const usValue = us?.value ?? 0;

    const values = withScores.map((r) => r.value);
    let valueMin = Math.min(...values);
    let valueMax = Math.max(...values);
    const pad = (valueMax - valueMin) * 0.05 || 1;
    valueMin = Math.min(valueMin, usValue) - pad;
    valueMax = Math.max(valueMax, usValue) + pad;

    const rows = [...withScores].sort((a, b) => b.value - a.value);

    return { rows, usValue, valueMin, valueMax };
  }, [countries, metric]);

  const isMobile = dimensions.width < 640;
  const padding = {
    top: isNativeApp ? 42 : 50,
    right: isMobile ? (isNativeApp ? 42 : 50) : 80,
    bottom: isNativeApp ? 20 : 24,
    left: isMobile ? (isNativeApp ? 30 : 36) : 140,
  };
  const graphWidth = dimensions.width - padding.left - padding.right;
  const rowHeight = isNativeApp && isMobile ? 20 : 22;
  const graphHeight = rows.length * rowHeight;
  const contentHeight = padding.top + graphHeight + padding.bottom;
  const viewportHeight = isNativeApp
    ? Math.min(560, Math.max(340, contentHeight))
    : Math.min(620, Math.max(380, contentHeight));

  const getX = (val: number) => padding.left + ((val - valueMin) / (valueMax - valueMin)) * graphWidth;

  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = (valueMax - valueMin) / 5;
    for (let i = 0; i <= 5; i++) ticks.push(valueMin + step * i);
    return ticks;
  }, [valueMin, valueMax]);

  return (
    <div className="relative w-full">
      {showNativeFreemium && nativePreviewLocked && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[28vh] sm:h-[32vh]"
          style={{
            background: `linear-gradient(to top, rgba(9,9,11,${nativeCurtainOpacity}) 0%, rgba(9,9,11,${nativeCurtainOpacity * 0.55}) 45%, transparent 100%)`,
            backdropFilter: `blur(${nativeCurtainBlur}px)`,
            WebkitBackdropFilter: `blur(${nativeCurtainBlur}px)`,
            maskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0.28) 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0.28) 75%, transparent 100%)",
          }}
          aria-hidden
        />
      )}

      {/* Blurred layer wrapping the entire chart area */}
      <div
        className={!canAccessCharts && !showNativeFreemium ? "pointer-events-none select-none" : ""}
        style={!canAccessCharts && !showNativeFreemium ? { filter: "blur(6px)", opacity: 0.6 } : {}}
      >
      {/* Single metric selector */}
      <div
        className={`flex flex-col items-stretch gap-2 text-sm sm:flex-row sm:items-center sm:justify-center ${
          isNativeApp ? "mb-3 sm:mb-5" : "mb-4 sm:mb-6"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`shrink-0 text-zinc-500 ${isNativeApp ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}>
            Metric:
          </span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={metricId}
              onChange={(e) => setMetricId(e.target.value)}
              className={`w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 pl-3 pr-8 text-zinc-200 outline-none hover:border-zinc-700 focus:border-emerald-500/50 sm:w-auto ${
                isNativeApp
                  ? "py-1.5 text-[11px] sm:min-w-[200px] sm:text-xs"
                  : "py-2 text-xs sm:min-w-[220px] sm:py-1.5 sm:text-sm"
              }`}
            >
              {METRICS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
        <p className={`text-zinc-500 ${isNativeApp ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-xs"}`}>
          Countries compared on one metric. Vertical line = <strong className="text-zinc-400">US (reference)</strong>.
        </p>
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto rounded-2xl border border-zinc-800/80 bg-[#111113] shadow-2xl"
        style={{ height: viewportHeight }}
      >
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: viewportHeight }}>
          <div className="relative w-full" style={{ width: dimensions.width, minHeight: contentHeight }}>
          <svg width={dimensions.width} height={contentHeight} className="block font-sans">
          <defs>
            <linearGradient id="usRefGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0)" />
              <stop offset="50%" stopColor="rgba(251, 191, 36, 0.35)" />
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
            </linearGradient>
          </defs>

          {/* Grid lines (vertical ticks for value axis) */}
          {xTicks.map((tick, i) => {
            const tx = getX(tick);
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={tx}
                  y1={padding.top}
                  x2={tx}
                  y2={padding.top + graphHeight}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={tx}
                  y={padding.top + graphHeight + 18}
                  fill="#71717a"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {formatTick(metric, tick)}
                </text>
              </g>
            );
          })}

          {/* US reference line (vertical, in the middle of the value range) */}
          {rows.length > 0 && (
            <g>
              <rect
                x={getX(usValue) - 1}
                y={padding.top}
                width={2}
                height={graphHeight}
                fill="url(#usRefGrad)"
              />
              <line
                x1={getX(usValue)}
                y1={padding.top}
                x2={getX(usValue)}
                y2={padding.top + graphHeight}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={getX(usValue)}
                y={padding.top - 10}
                fill="#fbbf24"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                US (reference)
              </text>
            </g>
          )}

          {/* Axis label */}
          <text
            x={padding.left + graphWidth / 2}
            y={contentHeight - 6}
            fill="#a1a1aa"
            fontSize={isMobile ? 9 : 11}
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            {metric.label.toUpperCase()}
          </text>
          </svg>

          {/* Country rows: flag + name + bar (overlay) */}
          <div className="absolute inset-0">
            <div className="relative w-full" style={{ height: contentHeight }}>
          {rows.map((row, i) => {
            const xEnd = getX(row.value);
            const isUs = row.country.slug === "usa";
            const isHovered = hoveredSlug === row.country.slug;
            const flagCode =
              COUNTRY_FLAG_CODE[row.country.slug] ??
              countryCodeFromFlagEmoji(row.country.flagEmoji);
            const y = padding.top + i * rowHeight + rowHeight / 2;

            return (
              <motion.div
                key={row.country.slug}
                className="absolute left-0 right-0 flex items-center cursor-default"
                style={{
                  top: padding.top + i * rowHeight,
                  height: rowHeight,
                  paddingLeft: padding.left,
                  paddingRight: padding.right,
                }}
                onMouseEnter={() => setHoveredSlug(row.country.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {/* Flag */}
                <div
                  className="absolute left-2 flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 sm:left-4"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  {flagCode ? (
                    <ReactCountryFlag countryCode={flagCode} svg style={{ width: "1.1em", height: "1.1em" }} />
                  ) : row.country.flagEmoji ? (
                    <span className="text-[13px] leading-none">
                      {row.country.flagEmoji}
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold text-zinc-500">{row.country.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Country name */}
                <div
                  className="absolute left-8 flex items-center sm:left-12"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <span
                    className={`truncate text-[10px] sm:text-xs ${isUs ? "font-bold text-amber-400" : "text-zinc-400"} ${isHovered ? "text-zinc-200" : ""}`}
                    style={{ maxWidth: isMobile ? 72 : 120 }}
                  >
                    {row.country.name}
                  </span>
                </div>

                {/* Bar from left to value */}
                <div
                  className="absolute h-2 overflow-hidden rounded-r"
                  style={{
                    left: padding.left,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: xEnd - padding.left,
                    background: isUs
                      ? "linear-gradient(90deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.5) 100%)"
                      : isHovered
                        ? "linear-gradient(90deg, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.7) 100%)"
                        : "linear-gradient(90deg, rgba(113,113,122,0.2) 0%, rgba(113,113,122,0.4) 100%)",
                  }}
                />

                {/* Value label at end of bar */}
                <div
                  className="absolute flex items-center text-[9px] font-bold tabular-nums text-zinc-300 sm:text-[10px]"
                  style={{
                    left: xEnd + 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {metric.format(row.value)}
                </div>
              </motion.div>
            );
          })}
            </div>
          </div>
        </div>

        {/* Tooltip on hover */}
        <AnimatePresence>
          {hoveredSlug && (() => {
            const row = rows.find((r) => r.country.slug === hoveredSlug);
            if (!row) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="pointer-events-none absolute z-20 rounded-lg border border-zinc-700/60 bg-zinc-950/95 px-3 py-2 shadow-xl backdrop-blur"
                style={{
                  left: Math.min(getX(row.value) + 12, dimensions.width - 180),
                  top: padding.top + rows.findIndex((r) => r.country.slug === hoveredSlug) * rowHeight - 36,
                }}
              >
                <div className="flex items-center gap-2">
                  {COUNTRY_FLAG_CODE[row.country.slug] && (
                    <ReactCountryFlag
                      countryCode={COUNTRY_FLAG_CODE[row.country.slug]}
                      svg
                      style={{ width: "1em", height: "1em" }}
                    />
                  )}
                  <span className="text-xs font-bold text-white">{row.country.name}</span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-400">
                  {metric.label}: <span className="font-semibold text-emerald-400">{metric.format(row.value)}</span>
                  {row.country.slug !== "usa" && (
                    <span className="ml-1 text-zinc-500">
                      (US: {metric.format(usValue)})
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
        </div>
      </div>
      </div>

      {showNativeFreemium && nativePreviewLocked && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 pt-20">
          <div className="pointer-events-auto w-full max-w-sm rounded-xl border border-white/[0.08] bg-zinc-900/95 px-4 py-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.04]">
            <p className="text-sm font-semibold text-white">Keep exploring the chart preview</p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Compare a few countries for free, then unlock every metric and full chart access.
            </p>
            <button
              type="button"
              onClick={openUnlockFlow}
              className="mt-3 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              Get full access
            </button>
          </div>
        </div>
      )}

      {/* Paywall overlay card for charts */}
      {!canAccessCharts && !showNativeFreemium && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-10">
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/[0.07] bg-zinc-900/95 p-7 text-center shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.04]">
            <p className="text-lg font-bold tracking-tight text-white">
              Unlock interactive charts
            </p>
            <p className="mt-1.5 text-sm text-zinc-400">
              Create a free account to compare countries on dating, cost, safety, height, and more.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => setPaywallOpen(true)}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => setPaywallOpen(true)}
                className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Sign In
              </button>
            </div>
            <p className="mt-4 text-[11px] text-zinc-600">
              No credit card required to create a free account.
            </p>
          </div>
        </div>
      )}

      <SignupModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
      />
    </div>
  );
}
