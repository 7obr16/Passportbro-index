import { getCountries } from "@/lib/countries";
import ClientDashboard from "@/components/ClientDashboard";
import SiteNav from "@/components/SiteNav";

export const revalidate = 60;

export default async function Home() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      {/* Main Content Area */}
      <ClientDashboard initialCountries={countries} />
    </div>
  );
}