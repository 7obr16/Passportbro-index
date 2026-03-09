import { Suspense } from "react";
import { getCountries } from "@/lib/countries";
import SiteNavWithSuspense from "@/components/SiteNavWithSuspense";
import ClientDashboard from "@/components/ClientDashboard";

export const revalidate = 60;

export default async function Home() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNavWithSuspense />

      <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
        <ClientDashboard initialCountries={countries} />
      </Suspense>
    </div>
  );
}