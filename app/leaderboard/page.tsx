import { getCountries } from "@/lib/countries";
import LeaderboardClient from "@/components/LeaderboardClient";
import SiteNav from "@/components/SiteNav";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-4 pt-6 text-center sm:px-5 sm:pt-10">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-zinc-500 sm:mt-3 sm:text-sm">
          {countries.length} countries ranked by weighted scoring across dating, cost, internet, safety, and more.
        </p>
      </section>

      <LeaderboardClient countries={countries} />
    </div>
  );
}
