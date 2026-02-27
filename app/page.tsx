import Link from "next/link";
import { Globe } from "lucide-react";
import { getCountries } from "@/lib/countries";
import ClientDashboard from "@/components/ClientDashboard";

export const revalidate = 60;

export default async function Home() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[11px] font-black tracking-widest text-black">
              PB
            </div>
            <span className="text-sm font-bold text-zinc-100">
              Passport Bro Index
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400 md:inline-flex">
              <Globe className="h-3 w-3" />
              {countries.length} countries ranked
            </span>
            <button className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-emerald-400">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <ClientDashboard initialCountries={countries} />
    </div>
  );
}