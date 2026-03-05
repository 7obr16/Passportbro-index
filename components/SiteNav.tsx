"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Globe, Menu, Plane, Trophy, X, LogIn, LogOut, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SignupModal, { type AuthModalMode } from "@/components/SignupModal";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/",            label: "Countries",   icon: Globe },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/charts",      label: "Charts",      icon: BarChart3 },
  { href: "/visa",        label: "Visa Globe",  icon: Plane },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthModalMode>("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const openAuth = (mode: AuthModalMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
  };

  const visibleLinks = NAV_LINKS.filter((l) => l.href !== pathname);

  // Short display for the logged-in email
  const shortEmail = user?.email
    ? user.email.length > 22
      ? user.email.slice(0, 19) + "…"
      : user.email
    : "";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-[10px] font-black tracking-widest text-black">
              PB
            </div>
            <span className="text-sm font-semibold text-zinc-100">
              Passport Index
            </span>
          </Link>

          {/* Desktop links + auth + theme toggle */}
          <div className="hidden items-center gap-1 md:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-200"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="mx-2 h-4 w-px bg-zinc-800" />

            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[11px] font-medium text-zinc-300">{shortEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-[11px] font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-[11px] font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 text-[11px] font-bold text-black transition hover:bg-emerald-400"
                >
                  Join Free
                </button>
              </div>
            )}

          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-200 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-zinc-800/40 md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60"
                  >
                    <link.icon className="h-4 w-4 text-zinc-500" />
                    {link.label}
                  </Link>
                ))}

                <div className="my-1 border-t border-zinc-800/60" />

                {user ? (
                  <>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2">
                      <User className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-zinc-300">{shortEmail}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-200"
                    >
                      <LogOut className="h-4 w-4 text-zinc-500" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60"
                    >
                      <LogIn className="h-4 w-4 text-zinc-500" />
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuth("signup")}
                      className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      <Globe className="h-4 w-4" />
                      Join Free
                    </button>
                  </>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth modal — rendered at nav level so it's always available */}
      <SignupModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        dismissible
      />
    </>
  );
}
