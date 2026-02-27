import Link from "next/link";
import {
  DollarSign,
  Wifi,
  Shield,
  Heart,
  MapPin,
  ArrowRight,
  Globe,
} from "lucide-react";
import { getCities } from "@/lib/cities";

export const revalidate = 60;

export default async function Home() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-zinc-900 antialiased">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-[11px] font-bold tracking-widest text-white">
              PI
            </div>
            <span className="text-sm font-semibold text-zinc-800">
              Passport Index
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-500 shadow-sm md:inline-flex">
              <Globe className="h-3 w-3" />
              {cities.length} cities
            </span>
            <button className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:pt-16">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live data from Supabase
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Find your next{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 bg-clip-text text-transparent">
              passport city
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-500">
            We rank cities by what actually matters to expats & nomads —
            cost&nbsp;of&nbsp;living, internet speed, safety and dating culture.
          </p>
        </section>

        {/* ── City Grid ────────────────────────────────────────── */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/city/${city.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h2 className="text-lg font-semibold leading-tight text-white drop-shadow-sm">
                      {city.name}
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-200">
                      <MapPin className="h-3 w-3" />
                      {city.country}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                    {city.datingScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid flex-1 grid-cols-3 divide-x divide-zinc-100 px-1 py-3">
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <DollarSign className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-xs font-semibold text-zinc-900">
                    ${city.costPerMonth.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-400">/ month</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Wifi className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-xs font-semibold text-zinc-900">
                    {city.internetSpeed} Mbps
                  </p>
                  <p className="text-[10px] text-zinc-400">internet</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Shield className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-xs font-semibold text-zinc-900">
                    {city.safetyScore.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-zinc-400">safety</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5">
                <p className="text-[11px] text-zinc-400">View city profile</p>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="mt-16 flex flex-col items-center gap-2 border-t border-zinc-200 pt-6 text-center text-[11px] text-zinc-400">
          <p>Passport Index · Phase 2 · Powered by Supabase</p>
          <p>
            Next up: user auth, reviews & social meetups.
          </p>
        </footer>
      </div>
    </div>
  );
}
