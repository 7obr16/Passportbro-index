import Link from "next/link";
import { BarChart3, Globe } from "lucide-react";
import { getCountries } from "@/lib/countries";
import LeaderboardClient from "@/components/LeaderboardClient";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[11px] font-black tracking-widest text-black">
              PB
            </div>
            <span className="text-sm font-bold text-zinc-100">Passport Bro Index</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
            >
              Home
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
              <BarChart3 className="h-3 w-3" />
              Leaderboard
            </span>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-5 pt-10 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          <Globe className="h-3.5 w-3.5" />
          {countries.length} countries
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Passport Bro Leaderboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
          Dynamic rankings based on weighted scoring for dating success, affordability,
          lifestyle, safety, and healthcare.
        </p>
      </section>

      <LeaderboardClient countries={countries} />
    </div>
  );
}
