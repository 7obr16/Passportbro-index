import { getCountries } from "@/lib/countries";
import LeaderboardClient from "@/components/LeaderboardClient";
import SiteNav from "@/components/SiteNav";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-5 pt-10 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Leaderboard
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
          {countries.length} countries ranked by weighted scoring across dating, cost, internet, safety, and more.
        </p>
      </section>

      <LeaderboardClient countries={countries} />
    </div>
  );
}
