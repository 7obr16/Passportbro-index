import { Suspense } from "react";
import { getCountries } from "@/lib/countries";
import SiteNavWithSuspense from "@/components/SiteNavWithSuspense";
import ChartsClient from "@/components/ChartsClient";

export const revalidate = 60;

export default async function ChartsPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNavWithSuspense />

      <section className="mx-auto max-w-7xl px-3 pt-5 sm:px-5 sm:pt-8">
        <div className="mb-5 text-center sm:mb-8">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
            Interactive Charts
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400 sm:mt-2 sm:text-sm">
            Compare countries on a single metric with the US as reference.
          </p>
        </div>

        <Suspense fallback={<div className="min-h-[40vh] bg-zinc-950" />}>
          <ChartsClient countries={countries} />
        </Suspense>
      </section>
    </div>
  );
}