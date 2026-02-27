const cities = [
  {
    name: "Bangkok",
    country: "Thailand",
    costPerMonth: 1400,
    internetSpeed: 250,
    safetyScore: 7.5,
    datingScore: 8.8,
  },
  {
    name: "Manila",
    country: "Philippines",
    costPerMonth: 1100,
    internetSpeed: 120,
    safetyScore: 6.8,
    datingScore: 8.5,
  },
  {
    name: "Medellín",
    country: "Colombia",
    costPerMonth: 1200,
    internetSpeed: 200,
    safetyScore: 7.2,
    datingScore: 8.2,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-zinc-50 antialiased">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 ring-1 ring-zinc-700/80">
              <span className="text-xs font-semibold tracking-[0.18em] text-zinc-200">
                PI
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Passport Index
              </p>
              <p className="text-xs text-zinc-500">
                Cities for modern expats & nomads
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-400 shadow-[0_0_0_1px_rgba(24,24,27,0.9)] backdrop-blur md:flex">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/40">
              ●
            </span>
            Live index · Phase 1 · Static preview
          </div>
        </header>

        <main className="mt-12 grid flex-1 gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <section className="flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-400 shadow-[0_0_0_1px_rgba(24,24,27,0.9)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Tailored for expats & long-term travelers
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
                Find your next{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-500 bg-clip-text text-transparent">
                  passport city
                </span>
                .
              </h1>
              <p className="max-w-xl text-balance text-sm leading-relaxed text-zinc-400 sm:text-base">
                Passport Index ranks cities by real-world expat priorities:
                cost of living, internet speed, safety and dating culture. This
                is the static MVP preview before we plug into live data and
                social features.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                Phase 1 · Static directory
              </div>
              <p className="text-zinc-500">
                Next.js · Tailwind CSS · Dark mode first
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <p>Early sample cities</p>
              <p className="text-zinc-400">
                Sorted by overall vibe · Dummy data
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {cities.map((city) => (
                <article
                  key={city.name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-zinc-900/80 p-4 shadow-[0_0_0_1px_rgba(24,24,27,0.85)] transition-transform duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                >
                  <div className="absolute inset-0 opacity-0 mix-blend-screen blur-3xl transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-10 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.10),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.10),transparent_55%)]" />
                  </div>

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
                        {city.name}
                      </h2>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {city.country}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-right text-[11px] font-medium text-emerald-300">
                      Dating score{" "}
                      <span className="ml-1 font-semibold">
                        {city.datingScore.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-4 grid grid-cols-3 gap-3 text-[11px] text-zinc-400">
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        Cost / month
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-50">
                        ${city.costPerMonth.toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Mid‑term stay
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        Internet
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-50">
                        {city.internetSpeed} Mbps
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Typical coworking
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        Safety
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-50">
                        {city.safetyScore.toFixed(1)}/10
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Expat‑friendly areas
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex items-center justify-between text-[11px] text-zinc-500">
                    <p>Click-through city pages coming in the next step.</p>
                    <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[10px]">
                      Static preview
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-10 flex items-center justify-between border-t border-zinc-900/80 pt-6 text-[11px] text-zinc-500">
          <p>Passport Index · Phase 1 · UI only</p>
          <p className="text-zinc-600">
            Next: Supabase, auth & real reviews.
          </p>
        </footer>
      </div>
    </div>
  );
}
