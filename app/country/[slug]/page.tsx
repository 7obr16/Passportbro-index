import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  DollarSign,
  Users,
  Cross,
  Ruler,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Heart,
  MessageSquare,
  Shield,
  Wifi,
  Sun,
  Wallet,
  Activity,
  Plane,
  Palmtree,
  Moon,
  Mountain
} from "lucide-react";
import { getCountryBySlug, getAllSlugs, TIER_CONFIG } from "@/lib/countries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

const TIER_BADGE: Record<string, string> = {
  "Very Easy":  "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  "Easy":       "bg-lime-500/10 text-lime-300 ring-lime-500/30",
  "Normal":     "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  "Hard":       "bg-orange-500/10 text-orange-300 ring-orange-500/30",
  "Improbable": "bg-red-500/10 text-red-300 ring-red-500/30",
};

const TIER_BAR: Record<string, string> = {
  "Very Easy": "bg-emerald-500", "Easy": "bg-lime-500", "Normal": "bg-amber-500",
  "Hard": "bg-orange-500", "Improbable": "bg-red-500",
};

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const tier = TIER_CONFIG[country.datingEase];

  const datingStats = [
    { icon: Heart, label: "Receptiveness", value: country.receptiveness },
    { icon: Users, label: "Local Values", value: country.localValues },
    { icon: MessageSquare, label: "English Level", value: country.englishProficiency },
  ];

  const logisticsStats = [
    { icon: Wallet, label: "Monthly Budget", value: country.budgetTier },
    { icon: Plane, label: "Visa Ease", value: country.visaEase },
    { icon: Wifi, label: "Internet Speed", value: country.internetSpeed },
  ];

  const lifestyleStats = [
    { icon: Shield, label: "Safety", value: country.safetyLevel },
    { icon: Activity, label: "Healthcare", value: country.healthcareQuality },
    { icon: Sun, label: "Climate", value: country.climate },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[11px] font-black tracking-widest text-black">
              PB
            </div>
            <span className="text-sm font-bold text-zinc-100">Passport Bro Index</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-700 md:inline-flex"
            >
              <Globe className="h-3 w-3" />
              All countries
            </Link>
            <button className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-emerald-400">
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-6 md:pt-8">
        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to tier list
        </Link>

        {/* Images */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Main Country Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-80">
            <img src={country.imageUrl} alt={country.name} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className={`absolute left-0 top-0 h-full w-1.5 ${TIER_BAR[country.datingEase]}`} />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    {country.region}
                  </p>
                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                    {country.name}
                  </h1>
                </div>
              </div>
            </div>
            <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ring-1 ${TIER_BADGE[country.datingEase]}`}>
              {country.datingEase}
            </span>
          </div>

          {/* Women Image */}
          {country.womenImageUrl && (
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-zinc-800/80 md:h-80">
              <img src={country.womenImageUrl} alt={`Typical women in ${country.name}`} className="h-full w-full object-cover object-top" />
              <div className="absolute bottom-4 left-4 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md">
                Typical Look (AI Generated)
              </div>
            </div>
          )}
        </div>

        {/* Deep Dive Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Dating & Social */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-5 text-[11px] font-black uppercase tracking-widest text-zinc-500">
              Dating & Social
            </h2>
            <div className="space-y-4">
              {datingStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Finance & Logistics */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-5 text-[11px] font-black uppercase tracking-widest text-zinc-500">
              Logistics
            </h2>
            <div className="space-y-4">
              {logisticsStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle & Environment */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-5 text-[11px] font-black uppercase tracking-widest text-zinc-500">
              Lifestyle
            </h2>
            <div className="space-y-4">
              {lifestyleStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-100">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vibes & Features Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {country.hasNightlife && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-medium text-purple-400">
              <Moon className="h-3.5 w-3.5" /> Great Nightlife
            </span>
          )}
          {country.hasBeach && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-400">
              <Palmtree className="h-3.5 w-3.5" /> Beach Access
            </span>
          )}
          {country.hasNature && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
              <Mountain className="h-3.5 w-3.5" /> Nature / Mountains
            </span>
          )}
        </div>

        {/* Reddit Consensus */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pros */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400">
              <ThumbsUp className="h-4 w-4" />
              Community Intel: Pros
            </h2>
            <p className="text-sm leading-relaxed text-emerald-100/80">
              &ldquo;{country.redditPros}&rdquo;
            </p>
          </div>

          {/* Cons */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-red-400">
              <ThumbsDown className="h-4 w-4" />
              Community Intel: Cons
            </h2>
            <p className="text-sm leading-relaxed text-red-100/80">
              &ldquo;{country.redditCons}&rdquo;
            </p>
          </div>
        </div>

        {/* Physical Stats comparison */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Male Avg Height</p>
              <p className="mt-1 text-base font-bold">{country.avgHeightMale}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Female Avg Height</p>
              <p className="mt-1 text-base font-bold">{country.avgHeightFemale}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">GDP per Capita</p>
              <p className="mt-1 text-base font-bold">{country.gdpPerCapita}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Majority Religion</p>
              <p className="mt-1 text-base font-bold">{country.majorityReligion}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-center text-[11px] text-zinc-500">
          All opinions are sourced from community forums and represent consensus, not professional advice.
          Always do your own research before traveling.
        </div>
      </div>
    </div>
  );
}
