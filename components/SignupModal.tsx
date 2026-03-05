"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, MapPin, X, Globe, ArrowRight, Lock, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type AuthModalMode = "signup" | "login";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  countryName?: string;
  onContinue?: () => void;
  dismissible?: boolean;
  initialMode?: AuthModalMode;
};

const BENEFITS = [
  "Save your favorite destinations",
  "Access premium city stats",
  "Join the global discussion",
];

const MAP_PINS = [
  { top: "28%", left: "22%" },
  { top: "52%", left: "58%" },
  { top: "38%", left: "72%" },
  { top: "62%", left: "38%" },
  { top: "20%", left: "48%" },
];

export default function SignupModal({
  isOpen,
  onClose,
  countryName,
  dismissible = true,
  initialMode = "signup",
}: Props) {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(false);
    setResetSent(false);
  };

  const switchMode = (next: AuthModalMode) => {
    setMode(next);
    reset();
  };

  const handleClose = () => {
    if (!dismissible) return;
    onClose();
    setTimeout(reset, 300);
  };

  // ── Sign Up: email only, random password, redirect to Stripe ──
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const randomPassword = (() => {
      if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
      }
      return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    })();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password: randomPassword,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    const userId = data.user?.id ?? "";
    const base = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK!;
    const stripeUrl = new URL(base);
    stripeUrl.searchParams.set("client_reference_id", userId);
    stripeUrl.searchParams.set("prefilled_email", email);

    setTimeout(() => {
      window.location.href = stripeUrl.toString();
    }, 1200);
  };

  // ── Sign In: email + password ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    handleClose();
  };

  // ── Forgot password: sends a reset email ──
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    setLoading(true);
    setError(null);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    setLoading(false);
    setResetSent(true);
  };

  const headline =
    mode === "login"
      ? <>Welcome back to <span className="text-emerald-400">Passport Bros</span></>
      : countryName
      ? <>Unlock detailed insights for <span className="text-emerald-400">{countryName}</span></>
      : <>Unlock the Full <span className="text-emerald-400">Passport Bros</span> Experience</>;

  const subheadline =
    mode === "login"
      ? "Sign in to your account to access your premium content."
      : countryName
      ? `See cost of living, dating scene, safety scores, and everything the brotherhood says about ${countryName}.`
      : "Get access to detailed city guides, cost of living breakdowns, and connect with the global brotherhood.";

  const hookBanner = countryName
    ? `✦  UNLOCK ${countryName.toUpperCase()} — FREE FOR EARLY MEMBERS`
    : "✦   FREE ACCESS FOR EARLY MEMBERS";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissible ? handleClose : undefined}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#1c1c1f] shadow-2xl ring-1 ring-white/[0.08]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 0 60px -15px rgba(16,185,129,0.25), 0 32px 64px -16px rgba(0,0,0,0.85)",
            }}
          >
            {dismissible && (
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-20 rounded-md p-1 text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex flex-col md:flex-row">
              {/* LEFT */}
              <div className="flex flex-col justify-between border-b border-zinc-800/60 bg-zinc-900/60 p-8 md:w-[44%] md:border-b-0 md:border-r md:p-10">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/20">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400">PASSPORT BROS</span>
                  </div>
                  <h2 className="mb-3 text-2xl font-bold leading-[1.2] tracking-tight text-white md:text-[1.65rem]">
                    {headline}
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-zinc-400">{subheadline}</p>
                  <ul className="space-y-3">
                    {BENEFITS.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/20">
                          <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
                        </span>
                        <span className="text-sm text-zinc-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Shield className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-emerald-400">OFFICIAL MEMBER ACCESS</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">Verified community platform</p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-1 flex-col md:w-[56%]">
                {/* Map visual header */}
                <div className="relative h-44 overflow-hidden bg-zinc-950">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
                      backgroundSize: "36px 36px",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 70% at 50% 60%, rgba(16,185,129,0.10) 0%, transparent 70%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-32 w-32 text-emerald-500/10" strokeWidth={0.6} />
                  </div>
                  {MAP_PINS.map((pos, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <span className="block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400/30" />
                    </motion.div>
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-3 pt-8">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-300">{hookBanner}</span>
                  </div>
                </div>

                {/* Form */}
                <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                  {/* Tabs */}
                  <div className="mb-6 flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
                    {(["signup", "login"] as AuthModalMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => switchMode(m)}
                        className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                          mode === m
                            ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {m === "signup" ? "Sign Up" : "Sign In"}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Sign-up success */}
                    {success && mode === "signup" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/20">
                          <Check className="h-7 w-7 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Account created — redirecting…</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                          Taking you to secure checkout to unlock full access.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key={`form-${mode}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        onSubmit={mode === "signup" ? handleSignup : handleLogin}
                        className="space-y-4"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-bold tracking-tight text-white">
                            {mode === "login" ? "Sign in to your account" : countryName ? `Get the full ${countryName} breakdown` : "Start your journey"}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-500">
                            {mode === "login" ? "Enter your email and password" : "Free account · Takes 10 seconds"}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold tracking-widest text-zinc-500">EMAIL</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
                          />
                        </div>

                        {/* Password — only for sign in */}
                        {mode === "login" && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold tracking-widest text-zinc-500">PASSWORD</label>
                              <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className="text-[10px] text-zinc-500 transition hover:text-emerald-400 disabled:opacity-50"
                              >
                                {resetSent ? "✓ Reset email sent" : "Forgot password?"}
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
                              />
                              <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                            </div>
                          </div>
                        )}

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400"
                          >
                            {error}
                          </motion.p>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                              {mode === "login" ? "Signing in…" : "Creating account…"}
                            </span>
                          ) : mode === "login" ? (
                            <>
                              Sign In
                              <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                          ) : (
                            <>
                              Join the Brotherhood
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
