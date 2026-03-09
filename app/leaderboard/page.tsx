import Link from "next/link";
import { getCountries } from "@/lib/countries";
import { DATA_SOURCES } from "@/lib/dataSources";
import LeaderboardClient from "@/components/LeaderboardClient";
import SiteNavWithSuspense from "@/components/SiteNavWithSuspense";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const countries = await getCountries();
  const safety = DATA_SOURCES.safety;
  const affordability = DATA_SOURCES.affordability;
  const friendly = DATA_SOURCES.internations;
  const internet = DATA_SOURCES.internet;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNavWithSuspense />

      <section className="mx-auto max-w-5xl px-4 pt-6 text-center sm:px-5 sm:pt-10">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-zinc-500 sm:mt-3 sm:text-sm">
          {countries.length} countries ranked by weighted scoring. Same data and same scoring logic as country pages and dashboard.
        </p>
        <div className="mx-auto mt-3 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Sources (same reference everywhere)</p>
          <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
            <span>Safety: <Link href={safety.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200 hover:decoration-zinc-400">{safety.label}</Link></span>
            <span>Cost: <Link href={affordability.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200 hover:decoration-zinc-400">{affordability.label}</Link></span>
            <span>Friendly: <Link href={friendly.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200 hover:decoration-zinc-400">{friendly.label}</Link></span>
            <span>Internet: <Link href={internet.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-200 hover:decoration-zinc-400">{internet.label}</Link></span>
            <span>Dating: curated (same as country profile)</span>
          </p>
        </div>
      </section>

      <LeaderboardClient countries={countries} />
    </div>
  );
}
