import { getCountries } from "@/lib/countries";
import SiteNav from "@/components/SiteNav";
import ChartsClient from "@/components/ChartsClient";

export const revalidate = 60;

export default async function ChartsPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Interactive Data Charts
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Compare various metrics and discover correlations between dating ease, cost of living, safety, and more.
          </p>
        </div>
        
        <ChartsClient countries={countries} />
      </section>
    </div>
  );
}