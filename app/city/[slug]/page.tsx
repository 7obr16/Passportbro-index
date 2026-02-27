import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Wifi,
  Shield,
  Heart,
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
} from "lucide-react";
import { getCityBySlug, getAllSlugs } from "@/lib/cities";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) notFound();

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-zinc-900 antialiased">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-[11px] font-bold tracking-widest text-white">
              PI
            </div>
            <span className="text-sm font-semibold text-zinc-800">
              Passport Index
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm transition hover:border-zinc-300 md:inline-flex"
            >
              <Globe className="h-3 w-3" />
              All cities
            </Link>
            <button className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-6 md:pt-8">
        {/* ── Back button ──────────────────────────────────────── */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all cities
        </Link>

        {/* ── Hero image ───────────────────────────────────────── */}
        <div className="relative mb-10 h-72 w-full overflow-hidden rounded-2xl shadow-md md:h-96">
          <img
            src={city.imageUrl}
            alt={city.name}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-300">
              <MapPin className="h-3.5 w-3.5" />
              {city.country}
            </p>
            <h1 className="mt-1.5 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {city.name}
            </h1>
          </div>
        </div>

        {/* ── Stats strip ──────────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: DollarSign,
              color: "emerald",
              label: "Cost / month",
              value: `$${city.costPerMonth.toLocaleString()}`,
            },
            {
              icon: Wifi,
              color: "sky",
              label: "Internet",
              value: `${city.internetSpeed} Mbps`,
            },
            {
              icon: Shield,
              color: "amber",
              label: "Safety",
              value: `${city.safetyScore.toFixed(1)}/10`,
            },
            {
              icon: Heart,
              color: "rose",
              label: "Dating",
              value: `${city.datingScore.toFixed(1)}/10`,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            const bgMap: Record<string, string> = {
              emerald: "bg-emerald-50 text-emerald-600",
              sky: "bg-sky-50 text-sky-600",
              amber: "bg-amber-50 text-amber-600",
              rose: "bg-rose-50 text-rose-500",
            };
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgMap[stat.color]}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Description ──────────────────────────────────────── */}
        <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Overview
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-600">
            {city.description}
          </p>
        </div>

        {/* ── Pros & Cons ──────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/60 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Pros for Passport Bros
            </h2>
            <ul className="space-y-3">
              {city.pros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-2.5 text-sm leading-snug text-zinc-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200/60 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              <XCircle className="h-4 w-4 text-rose-400" />
              Cons to consider
            </h2>
            <ul className="space-y-3">
              {city.cons.map((con) => (
                <li
                  key={con}
                  className="flex items-start gap-2.5 text-sm leading-snug text-zinc-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CTA placeholder ──────────────────────────────────── */}
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-700">
            Want to see reviews from real expats in {city.name}?
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            User reviews & ratings are coming in Phase 3 after auth is
            set up.
          </p>
          <button className="mt-5 rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800">
            Get notified
          </button>
        </div>
      </div>
    </div>
  );
}
