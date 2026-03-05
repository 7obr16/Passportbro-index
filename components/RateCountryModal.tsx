"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Check, DollarSign, Shield, Users, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  countrySlug: string;
  countryName: string;
  userId: string;
  onRated?: () => void;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const COST_LABELS = [
  "Very Cheap",
  "Cheap",
  "Moderate",
  "Expensive",
  "Very Expensive",
] as const;

const COST_ACTIVE: Record<number, string> = {
  1: "border-emerald-400/80 bg-emerald-500  text-black",
  2: "border-lime-400/80   bg-lime-500    text-black",
  3: "border-amber-300/80  bg-amber-400   text-black",
  4: "border-orange-400/80 bg-orange-500  text-black",
  5: "border-red-400/80    bg-red-500     text-black",
};

const COST_INACTIVE =
  "border-zinc-700/50 bg-zinc-800 text-zinc-500 hover:bg-zinc-700/80 hover:text-zinc-300";

// ─── Slider row for 0-10 subjective ratings ─────────────────────

type SliderRowProps = {
  value: number;
  onChange: (v: number) => void;
  icon: React.ElementType;
  label: string;
  lowLabel: string;
  highLabel: string;
  accentColor: string;
  trackGradient: string;
};

function SliderRow({
  value,
  onChange,
  icon: Icon,
  label,
  lowLabel,
  highLabel,
  accentColor,
  trackGradient,
}: SliderRowProps) {
  const pct = (value / 10) * 100;

  return (
    <div className="py-1">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-300">{label}</span>
        </div>
        <span
          className={`min-w-[2.5rem] text-right text-lg font-black tabular-nums ${
            value === 0 ? "text-zinc-600" : accentColor
          }`}
        >
          {value}<span className="text-xs font-semibold text-zinc-600">/10</span>
        </span>
      </div>

      <div className="relative h-8 px-0.5">
        {/* Track background */}
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-800" />
        {/* Filled track */}
        <div
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: trackGradient }}
        />
        {/* Dot markers */}
        <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-[1px]">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={`relative z-10 h-2 w-2 rounded-full transition-all ${
                i <= value
                  ? i === value
                    ? "h-4 w-4 -translate-y-[0.15rem] ring-2 ring-white/20 shadow-lg"
                    : "opacity-70"
                  : "bg-zinc-700"
              }`}
              style={i <= value ? { background: trackGradient.includes("gradient") ? undefined : trackGradient } : undefined}
              aria-label={`${i}`}
            />
          ))}
        </div>
        {/* Invisible range input for drag support */}
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="mt-0.5 flex justify-between text-[9px] text-zinc-600">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

// ─── Main modal ─────────────────────────────────────────────────

export default function RateCountryModal({
  isOpen,
  onClose,
  countrySlug,
  countryName,
  userId,
  onRated,
}: Props) {
  const [datingRating, setDatingRating] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);
  const [friendlinessRating, setFriendlinessRating] = useState(0);
  const [costRating, setCostRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    setFetchingExisting(true);
    supabase
      .from("country_ratings")
      .select("*")
      .eq("user_id", userId)
      .eq("country_slug", countrySlug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setIsExisting(true);
          setDatingRating(data.dating_rating ?? 0);
          setSafetyRating(data.safety_rating ?? 0);
          setFriendlinessRating(data.friendliness_rating ?? 0);
          setCostRating(data.cost_rating ?? 0);
          setComment(data.comment ?? "");
        } else {
          setIsExisting(false);
        }
        setFetchingExisting(false);
      });
  }, [isOpen, userId, countrySlug]);

  const resetForm = () => {
    setDatingRating(0);
    setSafetyRating(0);
    setFriendlinessRating(0);
    setCostRating(0);
    setComment("");
    setIsExisting(false);
    setErrorMsg(null);
    setSubmitState("idle");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (submitState !== "success") resetForm();
    }, 300);
  };

  const canSubmit =
    datingRating > 0 && safetyRating > 0 && friendlinessRating > 0 && costRating > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setErrorMsg(null);

    const { error } = await supabase.from("country_ratings").upsert(
      {
        user_id: userId,
        country_slug: countrySlug,
        dating_rating: datingRating,
        safety_rating: safetyRating,
        friendliness_rating: friendlinessRating,
        cost_rating: costRating,
        comment: comment.trim() || null,
      },
      { onConflict: "user_id,country_slug" }
    );

    if (error) {
      console.error("[RateCountryModal] Supabase upsert error:", error);
      setSubmitState("error");
      setErrorMsg(
        error.code === "42P01"
          ? "The ratings table doesn't exist yet. Please run the setup SQL in Supabase first."
          : error.code === "42501" || error.code === "PGRST301"
            ? "Permission denied. Check that RLS policies allow authenticated inserts."
            : `Could not save your rating: ${error.message ?? "Unknown error"}`,
      );
    } else {
      setSubmitState("success");
      onRated?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-[#1c1c1f] shadow-2xl ring-1 ring-white/[0.08]"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Community Data
                </p>
                <h2 className="text-base font-bold text-zinc-100">
                  Rate {countryName}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center px-6 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30"
                  >
                    <Check className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">Thank you for contributing!</h3>
                  <p className="mt-2 max-w-xs text-sm text-zinc-400">
                    Your rating for <span className="font-semibold text-zinc-200">{countryName}</span> helps make
                    the Passport Index more accurate for everyone.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-7 rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="px-5 py-5"
                >
                  {fetchingExisting ? (
                    <div className="flex items-center justify-center py-10">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
                    </div>
                  ) : (
                    <>
                      {isExisting && (
                        <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2.5 text-[11px] text-emerald-400">
                          You&apos;ve already rated this country — editing your previous submission.
                        </div>
                      )}

                      {/* Dating Ease */}
                      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Your Experience
                        </p>
                        <SliderRow
                          value={datingRating}
                          onChange={setDatingRating}
                          icon={Heart}
                          label="Dating Ease"
                          lowLabel="Very Hard"
                          highLabel="Very Easy"
                          accentColor="text-rose-400"
                          trackGradient="#f43f5e"
                        />
                      </div>

                      {/* Safety */}
                      <div className="mt-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <SliderRow
                          value={safetyRating}
                          onChange={setSafetyRating}
                          icon={Shield}
                          label="Safety"
                          lowLabel="Unsafe"
                          highLabel="Very Safe"
                          accentColor="text-sky-400"
                          trackGradient="#38bdf8"
                        />
                      </div>

                      {/* Friendliness */}
                      <div className="mt-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <SliderRow
                          value={friendlinessRating}
                          onChange={setFriendlinessRating}
                          icon={Users}
                          label="Friendliness"
                          lowLabel="Unfriendly"
                          highLabel="Very Friendly"
                          accentColor="text-amber-400"
                          trackGradient="#fbbf24"
                        />
                      </div>

                      {/* Cost of Living */}
                      <div className="mt-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-zinc-500" />
                          <span className="text-sm font-medium text-zinc-300">Cost of Living</span>
                          {costRating > 0 && (
                            <span className="ml-auto text-[11px] font-semibold text-zinc-400">
                              {COST_LABELS[costRating - 1]}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {COST_LABELS.map((label, i) => {
                            const val = i + 1;
                            const isActive = costRating === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setCostRating(val)}
                                title={label}
                                className={`rounded-lg border py-2.5 text-[11px] font-bold transition-all active:scale-95 ${
                                  isActive ? COST_ACTIVE[val] : COST_INACTIVE
                                }`}
                              >
                                {"$".repeat(val)}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-1.5 flex justify-between text-[9px] text-zinc-600">
                          <span>Very Cheap</span>
                          <span>Very Expensive</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mt-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <div className="mb-2.5 flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="text-sm font-medium text-zinc-300">
                            Comment
                            <span className="ml-1.5 text-[10px] font-normal text-zinc-600">(optional)</span>
                          </span>
                          <span className="ml-auto text-[10px] tabular-nums text-zinc-600">
                            {comment.length}/500
                          </span>
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience living or visiting here…"
                          maxLength={500}
                          rows={3}
                          className="w-full resize-none rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </div>

                      {submitState === "error" && errorMsg && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-xs text-red-400"
                        >
                          {errorMsg}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={!canSubmit || submitState === "submitting"}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitState === "submitting" ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                            Saving…
                          </>
                        ) : isExisting ? (
                          "Update Rating"
                        ) : (
                          "Submit Rating"
                        )}
                      </button>

                      {!canSubmit && (
                        <p className="mt-2 text-center text-[10px] text-zinc-600">
                          Rate all four categories to submit
                        </p>
                      )}
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
