"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  Users,
  DollarSign,
  SkipForward,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import type { Country } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import CountryMark from "@/components/CountryMark";

// ─── Quick-option config ─────────────────────────────────────────────────────

type QuickOption = { label: string; value: number; active: string; emoji?: string };

const DATING_OPTIONS: QuickOption[] = [
  { label: "Hard",   value: 3, active: "border-red-500/70    bg-red-500/20    text-red-300",       emoji: "😤" },
  { label: "Normal", value: 6, active: "border-amber-400/70  bg-amber-400/15  text-amber-300",     emoji: "😐" },
  { label: "Easy",   value: 9, active: "border-emerald-400/70 bg-emerald-400/20 text-emerald-300", emoji: "😍" },
];
const SAFETY_OPTIONS: QuickOption[] = [
  { label: "Unsafe",   value: 3, active: "border-red-500/70    bg-red-500/20    text-red-300",       emoji: "⚠️" },
  { label: "OK",       value: 6, active: "border-amber-400/70  bg-amber-400/15  text-amber-300",     emoji: "🛡️" },
  { label: "Safe",     value: 9, active: "border-emerald-400/70 bg-emerald-400/20 text-emerald-300", emoji: "✅" },
];
const FRIENDLINESS_OPTIONS: QuickOption[] = [
  { label: "Cold",     value: 3, active: "border-red-500/70    bg-red-500/20    text-red-300",       emoji: "🥶" },
  { label: "Neutral",  value: 6, active: "border-amber-400/70  bg-amber-400/15  text-amber-300",     emoji: "🤝" },
  { label: "Friendly", value: 9, active: "border-emerald-400/70 bg-emerald-400/20 text-emerald-300", emoji: "❤️" },
];
const COST_OPTIONS: QuickOption[] = [
  { label: "Cheap",     value: 1, active: "border-emerald-400/70 bg-emerald-400/20 text-emerald-300", emoji: "💰" },
  { label: "Moderate",  value: 3, active: "border-amber-400/70  bg-amber-400/15  text-amber-300",     emoji: "💵" },
  { label: "Expensive", value: 5, active: "border-red-500/70    bg-red-500/20    text-red-300",       emoji: "💸" },
];

const INACTIVE =
  "border-zinc-700/40 bg-zinc-800/30 text-zinc-500 hover:border-zinc-600/70 hover:bg-zinc-700/50 hover:text-zinc-200";

// ─── Category row ────────────────────────────────────────────────────────────

function CategoryRow({
  icon: Icon,
  label,
  options,
  selected,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  options: QuickOption[];
  selected: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex w-[100px] shrink-0 items-center gap-1.5 sm:w-[110px]">
        <Icon className="h-3 w-3 text-zinc-500 sm:h-3.5 sm:w-3.5" />
        <span className="text-[11px] font-semibold text-zinc-400 sm:text-xs">{label}</span>
      </div>
      <div className="flex flex-1 gap-1 sm:gap-1.5">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 sm:py-2.5 text-[11px] font-bold transition-all duration-100 active:scale-95 ${
                isSelected ? `${opt.active} ring-1 ring-white/10 shadow-md scale-[1.02]` : INACTIVE
              }`}
            >
              {opt.emoji && (
                <span className="hidden text-xs leading-none sm:inline">{opt.emoji}</span>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type QuickVote = {
  dating: number | null;
  safety: number | null;
  friendliness: number | null;
  cost: number | null;
};

type Props = {
  countries: Country[];
  onRequestSignup: () => void;
};

const QUEUE_SIZE = 15;

// ─── Main component ──────────────────────────────────────────────────────────

export default function CommunityVoteSection({ countries, onRequestSignup }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [alreadyRatedSlugs, setAlreadyRatedSlugs] = useState<Set<string>>(new Set());
  // Map slug → community rating count, for popularity sorting
  const [ratingCounts, setRatingCounts] = useState<Map<string, number>>(new Map());
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [queue, setQueue] = useState<Country[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [sessionRated, setSessionRated] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const [votes, setVotes] = useState<QuickVote>({ dating: null, safety: null, friendliness: null, cost: null });
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Auth + fetch counts + already-rated ────────────────────────────────
  useEffect(() => {
    async function init(uid: string | null) {
      // Always fetch global rating counts (for popularity ordering)
      const { data: countRows } = await supabase
        .from("country_ratings")
        .select("country_slug");
      if (countRows) {
        const map = new Map<string, number>();
        for (const row of countRows) {
          const slug = row.country_slug as string;
          map.set(slug, (map.get(slug) ?? 0) + 1);
        }
        setRatingCounts(map);
      }

      if (uid) {
        const { data: rows } = await supabase
          .from("country_ratings")
          .select("country_slug")
          .eq("user_id", uid);
        if (rows) {
          setAlreadyRatedSlugs(new Set(rows.map((r) => r.country_slug as string)));
        }
      }
      setLoadingAuth(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      init(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setAlreadyRatedSlugs(new Set());
        return;
      }
      const { data: rows } = await supabase
        .from("country_ratings")
        .select("country_slug")
        .eq("user_id", uid);
      if (rows) {
        setAlreadyRatedSlugs(new Set(rows.map((r) => r.country_slug as string)));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Build queue — sorted by community rating count DESC ─────────────────
  useEffect(() => {
    if (loadingAuth) return;
    const unrated = countries.filter((c) => !alreadyRatedSlugs.has(c.slug));
    // Sort by most community ratings first (most popular / most discussed)
    const sorted = [...unrated].sort(
      (a, b) => (ratingCounts.get(b.slug) ?? 0) - (ratingCounts.get(a.slug) ?? 0)
    );
    setQueue(sorted.slice(0, QUEUE_SIZE));
    setQueueIndex(0);
    setVotes({ dating: null, safety: null, friendliness: null, cost: null });
  }, [countries, alreadyRatedSlugs, ratingCounts, loadingAuth]);

  const currentCountry = queue[queueIndex] ?? null;
  const isDone = !loadingAuth && (queue.length === 0 || queueIndex >= queue.length);
  const canSubmit =
    votes.dating !== null &&
    votes.safety !== null &&
    votes.friendliness !== null &&
    votes.cost !== null;

  const advance = useCallback((dir: 1 | -1 = 1) => {
    setDirection(dir);
    setJustSubmitted(false);
    setVotes({ dating: null, safety: null, friendliness: null, cost: null });
    setQueueIndex((i) => i + 1);
  }, []);

  const handleSkip = useCallback(() => advance(1), [advance]);

  const handleSubmit = useCallback(async () => {
    if (!currentCountry) return;
    if (!userId) { onRequestSignup(); return; }
    if (!canSubmit) return;

    setSubmitting(true);
    const { error } = await supabase.from("country_ratings").upsert(
      {
        user_id: userId,
        country_slug: currentCountry.slug,
        dating_rating: votes.dating,
        safety_rating: votes.safety,
        friendliness_rating: votes.friendliness,
        cost_rating: votes.cost,
        comment: null,
      },
      { onConflict: "user_id,country_slug" }
    );
    setSubmitting(false);

    if (!error) {
      setAlreadyRatedSlugs((prev) => new Set([...prev, currentCountry.slug]));
      setSessionRated((n) => n + 1);
      setJustSubmitted(true);
      setTimeout(() => advance(1), 550);
    }
  }, [canSubmit, currentCountry, userId, votes, onRequestSignup, advance]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canSubmit && !submitting) handleSubmit();
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded, canSubmit, submitting, handleSubmit, handleSkip]);

  const progressPct = queue.length > 0 ? (queueIndex / queue.length) * 100 : 0;
  const communityCount = currentCountry ? (ratingCounts.get(currentCountry.slug) ?? 0) : 0;

  // ── Collapsed teaser ─────────────────────────────────────────────────────
  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mb-10 max-w-3xl"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="group w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-5 py-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-100">Quick Rate Countries</p>
                <p className="text-[11px] text-zinc-500">
                  Help shape community rankings · ~5 sec per country
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sessionRated > 0 && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  {sessionRated} rated
                </span>
              )}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-zinc-700">
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8">
        <div className="flex items-center justify-center gap-3 py-6">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
          <span className="text-xs text-zinc-500">Loading…</span>
        </div>
      </div>
    );
  }

  // ── Expanded ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mb-10 max-w-3xl"
    >
      {/* Header row */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            Quick Rate
          </span>
          {sessionRated > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <TrendingUp className="h-2.5 w-2.5" />
              {sessionRated} rated
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[11px] text-zinc-600 transition hover:text-zinc-400"
        >
          Collapse
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-[3px] w-full overflow-hidden rounded-full bg-zinc-800/60">
        <motion.div
          className="h-full rounded-full bg-emerald-500"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-2xl ring-1 ring-white/[0.04]">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Done state ── */}
          {isDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center px-6 py-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 18, stiffness: 280, delay: 0.1 }}
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30"
              >
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </motion.div>
              <h3 className="text-base font-bold text-white">You&apos;re all caught up!</h3>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-400">
                {sessionRated > 0
                  ? `You rated ${sessionRated} ${sessionRated === 1 ? "country" : "countries"} this session — your votes directly shape the rankings.`
                  : "You've already rated all the countries in this queue. Check back as more get added."}
              </p>
              <button
                onClick={() => setIsExpanded(false)}
                className="mt-6 rounded-lg bg-zinc-800 px-5 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700"
              >
                Got it
              </button>
            </motion.div>

          ) : currentCountry ? (

            /* ── Active voting card ── */
            <motion.div
              key={currentCountry.slug}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row"
            >
              {/* ── Left: Full image panel ── */}
              <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
                {/* Blurred background fill */}
                <img
                  src={currentCountry.womenImageUrl || currentCountry.imageUrl}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-xl brightness-50"
                />
                {/* Sharp main image */}
                <img
                  src={currentCountry.womenImageUrl || currentCountry.imageUrl}
                  alt={currentCountry.name}
                  className="relative h-full w-full object-cover object-center"
                />
                {/* Bottom gradient on mobile so text is legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent sm:hidden" />
                {/* Right fade on desktop blending into form */}
                <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-zinc-900/80 sm:block" />

                {/* Country identity — bottom-left */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                  <CountryMark
                    slug={currentCountry.slug}
                    name={currentCountry.name}
                    flagEmoji={currentCountry.flagEmoji}
                    compact
                  />
                  <div>
                    <h3 className="text-base font-black leading-tight text-white drop-shadow-lg">
                      {currentCountry.name}
                    </h3>
                    <p className="text-[10px] text-zinc-300/70">{currentCountry.region}</p>
                  </div>
                </div>

                {/* Progress + community count — top-right */}
                <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tabular-nums text-zinc-200 backdrop-blur-sm">
                    {queueIndex + 1} / {queue.length}
                  </span>
                  {communityCount > 0 && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 backdrop-blur-sm">
                      {communityCount} vote{communityCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Right: Rating form ── */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div className="space-y-2.5 sm:space-y-3">
                  <CategoryRow
                    icon={Heart}
                    label="Dating Ease"
                    options={DATING_OPTIONS}
                    selected={votes.dating}
                    onSelect={(v) => setVotes((p) => ({ ...p, dating: v }))}
                  />
                  <CategoryRow
                    icon={Shield}
                    label="Safety"
                    options={SAFETY_OPTIONS}
                    selected={votes.safety}
                    onSelect={(v) => setVotes((p) => ({ ...p, safety: v }))}
                  />
                  <CategoryRow
                    icon={Users}
                    label="Friendliness"
                    options={FRIENDLINESS_OPTIONS}
                    selected={votes.friendliness}
                    onSelect={(v) => setVotes((p) => ({ ...p, friendliness: v }))}
                  />
                  <CategoryRow
                    icon={DollarSign}
                    label="Cost of Living"
                    options={COST_OPTIONS}
                    selected={votes.cost}
                    onSelect={(v) => setVotes((p) => ({ ...p, cost: v }))}
                  />
                </div>

                {/* Action bar */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={submitting}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-2.5 text-[11px] font-semibold text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-40"
                  >
                    <SkipForward className="h-3 w-3" />
                    Skip
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!!userId && (!canSubmit || submitting || justSubmitted)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed ${
                      !userId
                        ? "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                        : justSubmitted
                          ? "bg-emerald-600 text-white"
                          : canSubmit
                            ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                            : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Saving…
                      </>
                    ) : justSubmitted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Saved!
                      </>
                    ) : !userId ? (
                      "Sign in to Submit"
                    ) : (
                      <>
                        Submit & Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {!canSubmit && !justSubmitted && !!userId && (
                  <p className="mt-2 text-center text-[10px] text-zinc-600">
                    Select all 4 to submit
                  </p>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-center text-[10px] text-zinc-700">
        Quick votes feed into community rankings · Use the full rating form on country pages for details
      </p>
    </motion.div>
  );
}
