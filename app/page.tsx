import { DollarSign, Wifi, Shield } from "lucide-react";

const cities = [
  {
    name: "Bangkok",
    country: "Thailand",
    costPerMonth: 1400,
    internetSpeed: 250,
    safetyScore: 7.5,
    datingScore: 8.8,
    imageUrl:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Manila",
    country: "Philippines",
    costPerMonth: 1100,
    internetSpeed: 120,
    safetyScore: 6.8,
    datingScore: 8.5,
    imageUrl:
      "https://images.unsplash.com/photo-1591077438983-40f3c7c34167?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Medellín",
    country: "Colombia",
    costPerMonth: 1200,
    internetSpeed: 200,
    safetyScore: 7.2,
    datingScore: 8.2,
    imageUrl:
      "https://images.unsplash.com/photo-1563122875-ef333df587f8?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-zinc-900 antialiased">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 md:px-8 md:pt-8">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-white/80 py-3 backdrop-blur-md md:rounded-full md:px-5 md:py-2 md:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold tracking-[0.18em] text-white">
              PI
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700">
                Passport Index
              </p>
              <p className="text-xs text-zinc-500">
                Nomad-style city ranking for expats
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <button className="hidden rounded-full px-3 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 md:inline-flex">
              Cities
            </button>
            <button className="hidden rounded-full px-3 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 md:inline-flex">
              Methodology
            </button>
            <button className="rounded-full border border-zinc-300 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black">
              Login
            </button>
          </nav>
        </header>

        <main className="mt-10 grid flex-1 gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section className="flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Tailored for expats & long‑term travelers
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
                Find your next{" "}
                <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 bg-clip-text text-transparent">
                  passport city
                </span>
                .
              </h1>
              <p className="max-w-xl text-balance text-sm leading-relaxed text-zinc-600 sm:text-base">
                Passport Index ranks cities by real-world expat priorities:
                cost of living, internet speed, safety and dating culture. This
                is the static MVP preview before we plug into live data and
                social features.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Phase 1 · Static directory
              </div>
              <p className="text-zinc-500">
                Next.js · Tailwind CSS · Supabase (coming soon)
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <p className="font-medium text-zinc-700">Early sample cities</p>
              <p className="text-zinc-500">
                Sorted by overall vibe · Dummy data
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {cities.map((city) => (
                <article
                  key={city.name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1.5 hover:border-zinc-300 hover:shadow-lg"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs text-zinc-100">
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]">
                        FEATURED
                      </span>
                      <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px]">
                        Dating score {city.datingScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-start justify-between gap-4 p-4">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                        {city.name}
                      </h2>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        {city.country}
                      </p>
                    </div>
                    <button className="mt-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-white">
                      View details
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 bg-zinc-50/60 px-4 py-3 text-[11px] text-zinc-600">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <DollarSign className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Cost / month
                        </p>
                        <p className="text-xs font-semibold">
                          ${city.costPerMonth.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <Wifi className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Internet
                        </p>
                        <p className="text-xs font-semibold">
                          {city.internetSpeed} Mbps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Shield className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Safety
                        </p>
                        <p className="text-xs font-semibold">
                          {city.safetyScore.toFixed(1)}/10
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-5 text-[11px] text-zinc-500">
          <p>Passport Index · Phase 1 · Static UI only</p>
          <p className="text-zinc-500">Next: Supabase, auth & real reviews.</p>
        </footer>
      </div>
    </div>
  );
}
