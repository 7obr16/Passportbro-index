"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Wifi, MessageSquare, Check, DollarSign, Shield, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  countrySlug: string;
  countryName: string;
  userId: string;
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

type RatingRowProps = {
  value: number;
  onChange: (v: number) => void;
  icon: React.ElementType;
  label: string;
  starColor: string;
};

function StarRow({ value, onChange, icon: Icon, label, starColor }: RatingRowProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-sm font-medium text-zinc-300">{label}</span>
      </div>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform active:scale-90"
            aria-label={`${star} star`}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hovered || value)
                  ? `${starColor} fill-current`
                  : "text-zinc-700"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RateCountryModal({
  isOpen,
  onClose,
  countrySlug,
  countryName,
  userId,
}: Props) {
  const [safetyRating, setSafetyRating] = useState(0);
  const [costRating, setCostRating] = useState(0);
  const [friendlinessRating, setFriendlinessRating] = useState(0);
  const [internetMbps, setInternetMbps] = useState("");
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
          setSafetyRating(data.safety_rating);
          setCostRating(data.cost_rating);
          setFriendlinessRating(data.friendliness_rating);
          setInternetMbps(data.internet_speed_mbps?.toString() ?? "");
          setComment(data.comment ?? "");
        } else {
          setIsExisting(false);
        }
        setFetchingExisting(false);
      });
  }, [isOpen, userId, countrySlug]);

  const resetForm = () => {
    setSafetyRating(0);
    setCostRating(0);
    setFriendlinessRating(0);
    setInternetMbps("");
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
    safetyRating > 0 && costRating > 0 && friendlinessRating > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setErrorMsg(null);

    const { error } = await supabase.from("country_ratings").upsert(
      {
        user_id: userId,
        country_slug: countrySlug,
        safety_rating: safetyRating,
        cost_rating: costRating,
        friendliness_rating: friendlinessRating,
        internet_speed_mbps: internetMbps ? parseInt(internetMbps, 10) : null,
        comment: comment.trim() || null,
      },
      { onConflict: "user_id,country_slug" }
    );

    if (error) {
      setSubmitState("error");
      setErrorMsg(error.message);
    } else {
      setSubmitState("success");
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#1c1c1f] shadow-2xl ring-1 ring-white/[0.08]"
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

                      <div className="space-y-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Your Experience
                        </p>
                        <StarRow
                          value={safetyRating}
                          onChange={setSafetyRating}
                          icon={Shield}
                          label="Safety"
                          starColor="text-sky-400"
                        />
                        <div className="h-px bg-zinc-800/60" />
                        <StarRow
                          value={friendlinessRating}
                          onChange={setFriendlinessRating}
                          icon={Users}
                          label="Friendliness"
                          starColor="text-amber-400"
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
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

                      <div className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                          <span className="flex-1 text-sm font-medium text-zinc-300">
                            Internet Speed
                            <span className="ml-1.5 text-[10px] font-normal text-zinc-600">(optional)</span>
                          </span>
                          <div className="relative">
                            <input
                              type="number"
                              min={1}
                              max={10000}
                              value={internetMbps}
                              onChange={(e) => setInternetMbps(e.target.value)}
                              placeholder="e.g. 50"
                              className="w-28 rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-3 py-2 pr-12 text-right text-sm text-white outline-none placeholder:text-zinc-600 transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                              Mbps
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
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
                          Rate all three categories to submit
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
