"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, Search, Plane, CheckCircle2, ShieldAlert, Clock,
  Globe2, FileText, Trophy, BarChart3, Globe, Lock, ArrowRight, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SignupModal from "@/components/SignupModal";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

// ─── Types ─────────────────────────────────────────────────────────────────

type VisaData = {
  countries: string[];
  matrix: Record<string, Record<string, string>>;
};

type VisaCategory = "free" | "arrival" | "eta" | "required" | "other" | "self";

type PassportScore = {
  country: string;
  rank: number;
  free: number;
  arrival: number;
  eta: number;
  required: number;
  other: number;
  mobilityScore: number; // free + arrival
  accessScore: number;   // free + arrival + eta
  total: number;
};

// ─── Constants ─────────────────────────────────────────────────────────────

const VISA_CATEGORIES: Record<VisaCategory, { label: string; color: string; hex: string; icon: typeof Plane }> = {
  free:     { label: "Visa Free",       color: "text-emerald-400", hex: "#10b981", icon: CheckCircle2 },
  arrival:  { label: "Visa on Arrival", color: "text-sky-400",     hex: "#38bdf8", icon: Plane },
  eta:      { label: "eTA / e-Visa",    color: "text-amber-400",   hex: "#fbbf24", icon: FileText },
  required: { label: "Visa Required",   color: "text-red-400",     hex: "#ef4444", icon: ShieldAlert },
  other:    { label: "Other",           color: "text-zinc-400",    hex: "#71717a", icon: Clock },
  self:     { label: "Home Country",    color: "text-indigo-400",  hex: "#818cf8", icon: Globe2 },
};

const GEOJSON_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

const GEO_NAME_OVERRIDES: Record<string, string> = {
  "United States of America": "United States",
  "United Republic of Tanzania": "Tanzania",
  "Republic of the Congo": "Congo",
  "Democratic Republic of the Congo": "DR Congo",
  "Ivory Coast": "Ivory Coast",
  "Côte d'Ivoire": "Ivory Coast",
  "Dem. Rep. Congo": "DR Congo",
  "Central African Rep.": "Central African Republic",
  "S. Sudan": "South Sudan",
  "Eq. Guinea": "Equatorial Guinea",
  "W. Sahara": "Western Sahara",
  "Solomon Is.": "Solomon Islands",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Dominican Rep.": "Dominican Republic",
  "Falkland Is.": "Falkland Islands",
  "Fr. S. Antarctic Lands": "French Southern Territories",
  "N. Cyprus": "Cyprus",
  "Somaliland": "Somalia",
  "eSwatini": "Swaziland",
  "Czech Rep.": "Czech Republic",
  "Lao PDR": "Laos",
  "Korea": "South Korea",
  "Dem. Rep. Korea": "North Korea",
};

// Country name → flag emoji via ISO-3166-1-alpha-2
const COUNTRY_FLAGS: Record<string, string> = {
  "Afghanistan": "🇦🇫", "Albania": "🇦🇱", "Algeria": "🇩🇿", "Andorra": "🇦🇩",
  "Angola": "🇦🇴", "Antigua and Barbuda": "🇦🇬", "Argentina": "🇦🇷", "Armenia": "🇦🇲",
  "Australia": "🇦🇺", "Austria": "🇦🇹", "Azerbaijan": "🇦🇿", "Bahamas": "🇧🇸",
  "Bahrain": "🇧🇭", "Bangladesh": "🇧🇩", "Barbados": "🇧🇧", "Belarus": "🇧🇾",
  "Belgium": "🇧🇪", "Belize": "🇧🇿", "Benin": "🇧🇯", "Bhutan": "🇧🇹",
  "Bolivia": "🇧🇴", "Bosnia and Herzegovina": "🇧🇦", "Botswana": "🇧🇼", "Brazil": "🇧🇷",
  "Brunei": "🇧🇳", "Bulgaria": "🇧🇬", "Burkina Faso": "🇧🇫", "Burundi": "🇧🇮",
  "Cambodia": "🇰🇭", "Cameroon": "🇨🇲", "Canada": "🇨🇦", "Cape Verde": "🇨🇻",
  "Central African Republic": "🇨🇫", "Chad": "🇹🇩", "Chile": "🇨🇱", "China": "🇨🇳",
  "Colombia": "🇨🇴", "Comoros": "🇰🇲", "Congo": "🇨🇬", "Costa Rica": "🇨🇷",
  "Croatia": "🇭🇷", "Cuba": "🇨🇺", "Cyprus": "🇨🇾", "Czech Republic": "🇨🇿",
  "DR Congo": "🇨🇩", "Denmark": "🇩🇰", "Djibouti": "🇩🇯", "Dominica": "🇩🇲",
  "Dominican Republic": "🇩🇴", "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "El Salvador": "🇸🇻",
  "Equatorial Guinea": "🇬🇶", "Eritrea": "🇪🇷", "Estonia": "🇪🇪", "Ethiopia": "🇪🇹",
  "Fiji": "🇫🇯", "Finland": "🇫🇮", "France": "🇫🇷", "Gabon": "🇬🇦",
  "Gambia": "🇬🇲", "Georgia": "🇬🇪", "Germany": "🇩🇪", "Ghana": "🇬🇭",
  "Greece": "🇬🇷", "Grenada": "🇬🇩", "Guatemala": "🇬🇹", "Guinea": "🇬🇳",
  "Guinea-Bissau": "🇬🇼", "Guyana": "🇬🇾", "Haiti": "🇭🇹", "Honduras": "🇭🇳",
  "Hong Kong": "🇭🇰", "Hungary": "🇭🇺", "Iceland": "🇮🇸", "India": "🇮🇳",
  "Indonesia": "🇮🇩", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ireland": "🇮🇪",
  "Israel": "🇮🇱", "Italy": "🇮🇹", "Ivory Coast": "🇨🇮", "Jamaica": "🇯🇲",
  "Japan": "🇯🇵", "Jordan": "🇯🇴", "Kazakhstan": "🇰🇿", "Kenya": "🇰🇪",
  "Kiribati": "🇰🇮", "Kosovo": "🇽🇰", "Kuwait": "🇰🇼", "Kyrgyzstan": "🇰🇬",
  "Laos": "🇱🇦", "Latvia": "🇱🇻", "Lebanon": "🇱🇧", "Lesotho": "🇱🇸",
  "Liberia": "🇱🇷", "Libya": "🇱🇾", "Liechtenstein": "🇱🇮", "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺", "Macao": "🇲🇴", "Madagascar": "🇲🇬", "Malawi": "🇲🇼",
  "Malaysia": "🇲🇾", "Maldives": "🇲🇻", "Mali": "🇲🇱", "Malta": "🇲🇹",
  "Marshall Islands": "🇲🇭", "Mauritania": "🇲🇷", "Mauritius": "🇲🇺", "Mexico": "🇲🇽",
  "Micronesia": "🇫🇲", "Moldova": "🇲🇩", "Monaco": "🇲🇨", "Mongolia": "🇲🇳",
  "Montenegro": "🇲🇪", "Morocco": "🇲🇦", "Mozambique": "🇲🇿", "Myanmar": "🇲🇲",
  "Namibia": "🇳🇦", "Nauru": "🇳🇷", "Nepal": "🇳🇵", "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿", "Nicaragua": "🇳🇮", "Niger": "🇳🇪", "Nigeria": "🇳🇬",
  "North Korea": "🇰🇵", "North Macedonia": "🇲🇰", "Norway": "🇳🇴", "Oman": "🇴🇲",
  "Pakistan": "🇵🇰", "Palau": "🇵🇼", "Palestine": "🇵🇸", "Panama": "🇵🇦",
  "Papua New Guinea": "🇵🇬", "Paraguay": "🇵🇾", "Peru": "🇵🇪", "Philippines": "🇵🇭",
  "Poland": "🇵🇱", "Portugal": "🇵🇹", "Qatar": "🇶🇦", "Romania": "🇷🇴",
  "Russia": "🇷🇺", "Rwanda": "🇷🇼", "Saint Kitts and Nevis": "🇰🇳", "Saint Lucia": "🇱🇨",
  "Saint Vincent and the Grenadines": "🇻🇨", "Samoa": "🇼🇸", "San Marino": "🇸🇲",
  "Sao Tome and Principe": "🇸🇹", "Saudi Arabia": "🇸🇦", "Senegal": "🇸🇳",
  "Serbia": "🇷🇸", "Seychelles": "🇸🇨", "Sierra Leone": "🇸🇱", "Singapore": "🇸🇬",
  "Slovakia": "🇸🇰", "Slovenia": "🇸🇮", "Solomon Islands": "🇸🇧", "Somalia": "🇸🇴",
  "South Africa": "🇿🇦", "South Korea": "🇰🇷", "South Sudan": "🇸🇸", "Spain": "🇪🇸",
  "Sri Lanka": "🇱🇰", "Sudan": "🇸🇩", "Suriname": "🇸🇷", "Swaziland": "🇸🇿",
  "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Syria": "🇸🇾", "Taiwan": "🇹🇼",
  "Tajikistan": "🇹🇯", "Tanzania": "🇹🇿", "Thailand": "🇹🇭", "Timor-Leste": "🇹🇱",
  "Togo": "🇹🇬", "Tonga": "🇹🇴", "Trinidad and Tobago": "🇹🇹", "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷", "Turkmenistan": "🇹🇲", "Tuvalu": "🇹🇻", "Uganda": "🇺🇬",
  "Ukraine": "🇺🇦", "United Arab Emirates": "🇦🇪", "United Kingdom": "🇬🇧",
  "United States": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Vanuatu": "🇻🇺",
  "Vatican": "🇻🇦", "Venezuela": "🇻🇪", "Vietnam": "🇻🇳", "Yemen": "🇾🇪",
  "Zambia": "🇿🇲", "Zimbabwe": "🇿🇼",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyVisa(status: string, isSelf: boolean): VisaCategory {
  if (isSelf) return "self";
  const s = status.toLowerCase().trim();
  if (s === "visa free" || s === "visa not required" || s === "freedom of movement" || s.includes("free")) return "free";
  if (s.includes("on arrival") || s === "visa on arrival") return "arrival";
  if (s.includes("e-visa") || s.includes("eta") || s.includes("evisa") || s.includes("electronic")) return "eta";
  if (s.includes("required") || s === "-1" || s === "visa refused" || s.includes("admission refused")) return "required";
  const num = Number(s);
  if (!isNaN(num) && num > 0) return "free";
  return "other";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function computeRankings(visaData: VisaData): PassportScore[] {
  const scores: Omit<PassportScore, "rank">[] = visaData.countries.map((country) => {
    const row = visaData.matrix[country] ?? {};
    let free = 0, arrival = 0, eta = 0, required = 0, other = 0;
    for (const [dest, status] of Object.entries(row)) {
      if (dest === country) continue;
      const cat = classifyVisa(status, false);
      if (cat === "free") free++;
      else if (cat === "arrival") arrival++;
      else if (cat === "eta") eta++;
      else if (cat === "required") required++;
      else other++;
    }
    const total = free + arrival + eta + required + other;
    return {
      country,
      free, arrival, eta, required, other,
      mobilityScore: free + arrival,
      accessScore: free + arrival + eta,
      total,
    };
  });

  scores.sort((a, b) => b.mobilityScore - a.mobilityScore || b.free - a.free);

  let rank = 1;
  return scores.map((s, i) => {
    if (i > 0 && s.mobilityScore === scores[i - 1].mobilityScore && s.free === scores[i - 1].free) {
      return { ...s, rank: scores[i - 1].mobilityScore === scores[i].mobilityScore ? rank : ++rank };
    }
    rank = i + 1;
    return { ...s, rank };
  });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-base">🥇</span>;
  if (rank === 2) return <span className="text-base">🥈</span>;
  if (rank === 3) return <span className="text-base">🥉</span>;
  return (
    <span className="w-7 text-center text-xs font-bold tabular-nums text-zinc-500">
      {rank}
    </span>
  );
}

function ScoreBar({ free, arrival, eta, required, total }: Pick<PassportScore, "free" | "arrival" | "eta" | "required" | "total">) {
  if (total === 0) return null;
  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      {free > 0 && <div style={{ width: pct(free), background: "#10b981" }} />}
      {arrival > 0 && <div style={{ width: pct(arrival), background: "#38bdf8" }} />}
      {eta > 0 && <div style={{ width: pct(eta), background: "#fbbf24" }} />}
      {required > 0 && <div style={{ width: pct(required), background: "#ef4444" }} />}
    </div>
  );
}

// ─── Ranking Table ──────────────────────────────────────────────────────────

function PassportRankingTable({
  rankings,
  passport,
  onSelect,
  hasPaid,
  onUnlock,
}: {
  rankings: PassportScore[];
  passport: string;
  onSelect: (country: string) => void;
  hasPaid: boolean;
  onUnlock: () => void;
}) {
  const [query, setQuery] = useState("");
  const [showCount, setShowCount] = useState(50);
  const FREE_ROWS = 10;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q ? rankings.filter((r) => r.country.toLowerCase().includes(q)) : rankings;
  }, [rankings, query]);

  const visible = filtered.slice(0, showCount);
  const selectedRank = rankings.find((r) => r.country === passport);

  return (
    <div className="w-full">
      {/* Sticky header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Passport Power Ranking</h2>
          <p className="text-xs text-zinc-500">Ranked by visa-free + on-arrival access · {rankings.length} passports</p>
        </div>
        {selectedRank && (
          <motion.div
            key={passport}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5"
          >
            <span className="text-xl">{COUNTRY_FLAGS[passport] ?? "🌐"}</span>
            <div>
              <p className="text-xs font-bold text-white">{passport}</p>
              <p className="text-[10px] text-amber-400">Rank #{selectedRank.rank} · {selectedRank.mobilityScore} mobility</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowCount(50); }}
          placeholder="Search passport..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 pl-9 pr-4 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
        />
      </div>

      {/* Column headers */}
      <div className="mb-1 grid grid-cols-[40px_1fr_80px_1fr] items-center gap-3 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
        <span>Rank</span>
        <span>Country</span>
        <span className="text-right">Score</span>
        <span>Breakdown</span>
      </div>

      {/* Rows */}
      <div className="space-y-0.5">
        {visible.map((r, idx) => {
          const flag = COUNTRY_FLAGS[r.country] ?? "🌐";
          const isSelected = r.country === passport;
          const isTop3 = r.rank <= 3;
          const isLocked = !hasPaid && idx >= FREE_ROWS;

          return (
            <div key={r.country} className={isLocked ? "relative" : ""}>
              {/* Paywall banner injected once at the lock boundary */}
              {idx === FREE_ROWS && !hasPaid && (
                <div className="mb-1 flex items-center gap-3 rounded-xl border border-amber-500/15 bg-zinc-900/80 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <Lock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white">Unlock full passport rankings</p>
                    <p className="text-[11px] text-zinc-500">Rows {FREE_ROWS + 1}–{rankings.length} require an account.</p>
                  </div>
                  <button
                    onClick={onUnlock}
                    className="group flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-amber-400"
                  >
                    Unlock
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}

              {isLocked && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[4px]">
                  <Lock className="h-3.5 w-3.5 text-zinc-700" />
                </div>
              )}

              <motion.button
                onClick={() => !isLocked && onSelect(r.country)}
                disabled={isLocked}
                className={`grid w-full grid-cols-[40px_1fr_80px_1fr] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                  isLocked
                    ? "cursor-default select-none opacity-30"
                    : isSelected
                    ? "bg-amber-500/10 ring-1 ring-amber-500/30"
                    : isTop3
                    ? "bg-zinc-900/60 hover:bg-zinc-900"
                    : "hover:bg-zinc-900/40"
                }`}
                whileHover={isLocked ? {} : { x: 2 }}
                transition={{ duration: 0.1 }}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  <MedalBadge rank={r.rank} />
                </div>

                {/* Country */}
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-base leading-none">{flag}</span>
                  <span className={`truncate text-xs font-semibold ${isSelected ? "text-amber-300" : "text-zinc-200"}`}>
                    {r.country}
                  </span>
                </div>

                {/* Score */}
                <div className="text-right">
                  <span className={`text-sm font-black ${isTop3 ? "text-white" : "text-zinc-300"}`}>
                    {r.mobilityScore}
                  </span>
                  <p className="text-[8px] text-zinc-600">countries</p>
                </div>

                {/* Breakdown bar + mini stats */}
                <div className="space-y-1">
                  <ScoreBar
                    free={r.free}
                    arrival={r.arrival}
                    eta={r.eta}
                    required={r.required}
                    total={r.total}
                  />
                  <div className="flex items-center gap-2 text-[8px] text-zinc-600">
                    <span className="text-emerald-500">{r.free}F</span>
                    <span className="text-sky-500">{r.arrival}A</span>
                    <span className="text-amber-500">{r.eta}E</span>
                    <span className="text-red-500">{r.required}R</span>
                  </div>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Load more — only for paid users or within the free window */}
      {filtered.length > showCount && hasPaid && (
        <button
          onClick={() => setShowCount((n) => n + 50)}
          className="mt-4 w-full rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
        >
          Show more ({filtered.length - showCount} remaining)
        </button>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

type ClickedCountry = {
  name: string;
  flag: string;
  status: string;
  cat: VisaCategory;
};

export default function VisaGlobeClient() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [geoJson, setGeoJson] = useState<any>(null);
  const [visaData, setVisaData] = useState<VisaData | null>(null);
  const [passport, setPassport] = useState("United States");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoverD, setHoverD] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"globe" | "ranking">("globe");

  // Auth / paywall state
  const [hasPaid, setHasPaid] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallCountry, setPaywallCountry] = useState<string | undefined>();
  const [clickedCountry, setClickedCountry] = useState<ClickedCountry | null>(null);
  const [nativePreviewLocked, setNativePreviewLocked] = useState(false);
  const [pageScrollY, setPageScrollY] = useState(0);

  useEffect(() => {
    const fetchProfile = async (uid: string) => {
      const { data } = await supabase.from("profiles").select("has_paid").eq("id", uid).single();
      setHasPaid(data?.has_paid ?? false);
    };
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.id) fetchProfile(data.session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user.id) fetchProfile(session.user.id);
      else setHasPaid(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetch(GEOJSON_URL).then((r) => r.json()).then(setGeoJson);
    fetch("/visa-matrix.json").then((r) => r.json()).then(setVisaData);
  }, []);

  const isNativeApp = searchParams.get("nativeApp") === "1";
  const isNativePremium = searchParams.get("nativePremium") === "1";
  const showNativeFreemium = isNativeApp && !isNativePremium;
  const canAccessVisa = showNativeFreemium ? false : isNativeApp ? isNativePremium : hasPaid;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: isNativeApp
            ? Math.max(420, Math.min(610, window.innerHeight * 0.64))
            : Math.max(480, Math.min(700, window.innerHeight * 0.72)),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isNativeApp]);

  useEffect(() => {
    if (!showNativeFreemium) {
      setNativePreviewLocked(false);
      setPageScrollY(0);
      return;
    }

    const onScroll = () => setPageScrollY(typeof window !== "undefined" ? window.scrollY : 0);
    const timer = window.setTimeout(() => setNativePreviewLocked(true), 3800);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [showNativeFreemium]);

  const openUnlockFlow = useCallback(
    (countryName?: string, openImmediately = true) => {
      setPaywallCountry(countryName);

      if (
        showNativeFreemium &&
        typeof window !== "undefined" &&
        (window as unknown as { ReactNativeWebView?: { postMessage: (value: string) => void } }).ReactNativeWebView
      ) {
        if (!openImmediately) {
          setNativePreviewLocked(true);
          return;
        }

        (
          window as unknown as { ReactNativeWebView: { postMessage: (value: string) => void } }
        ).ReactNativeWebView.postMessage(JSON.stringify({ type: "show-paywall" }));
        return;
      }

      if (showNativeFreemium && !openImmediately) {
        setNativePreviewLocked(true);
        return;
      }

      setPaywallOpen(true);
    },
    [showNativeFreemium]
  );

  const nativeCurtainBlur = nativePreviewLocked ? Math.min(2.9, 1 + pageScrollY / 420) : 0;
  const nativeCurtainOpacity = nativePreviewLocked ? Math.min(0.15, 0.06 + pageScrollY / 2400) : 0;

  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 180;
    controls.maxDistance = 500;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    setReady(true);
  }, []);

  const passportMatrix = useMemo(() => visaData?.matrix?.[passport] ?? {}, [visaData, passport]);

  const getCountryName = useCallback((feature: any): string => {
    const name = feature?.properties?.NAME || feature?.properties?.name || "";
    return GEO_NAME_OVERRIDES[name] || name;
  }, []);

  const getVisaCat = useCallback(
    (feature: any): VisaCategory => {
      const name = getCountryName(feature);
      if (name === passport) return "self";
      const status = passportMatrix[name];
      if (!status) return "other";
      return classifyVisa(status, false);
    },
    [passportMatrix, passport, getCountryName]
  );

  const stats = useMemo(() => {
    const counts: Record<VisaCategory, number> = { free: 0, arrival: 0, eta: 0, required: 0, other: 0, self: 0 };
    if (!visaData) return counts;
    for (const [dest, status] of Object.entries(passportMatrix)) {
      const cat = classifyVisa(status, dest === passport);
      counts[cat]++;
    }
    counts.self = 1;
    return counts;
  }, [passportMatrix, visaData, passport]);

  const rankings = useMemo(() => (visaData ? computeRankings(visaData) : []), [visaData]);

  const filteredCountries = useMemo(() => {
    if (!visaData) return [];
    const q = search.toLowerCase();
    return visaData.countries.filter((c) => c.toLowerCase().includes(q));
  }, [visaData, search]);

  const categorizedCountries = useMemo(() => {
    const map: Record<VisaCategory, { name: string; status: string }[]> = {
      free: [], arrival: [], eta: [], required: [], other: [], self: [],
    };
    if (!visaData) return map;
    for (const [dest, status] of Object.entries(passportMatrix)) {
      const cat = classifyVisa(status, dest === passport);
      if (cat !== "self") map[cat].push({ name: dest, status });
    }
    for (const key of Object.keys(map) as VisaCategory[]) {
      map[key].sort((a, b) => a.name.localeCompare(b.name));
    }
    return map;
  }, [passportMatrix, passport, visaData]);

  const [expandedCat, setExpandedCat] = useState<VisaCategory | null>(null);
  const [catSearch, setCatSearch] = useState("");

  const handlePolygonHover = useCallback((d: any) => setHoverD(d), []);

  const handlePolygonClick = useCallback(
    (d: any) => {
      const name = getCountryName(d);
      if (!name || name === passport) return;

      if (!canAccessVisa) {
        openUnlockFlow(name, false);
        return;
      }

      const status = passportMatrix[name] ?? "Unknown";
      const cat = classifyVisa(status, false);
      setClickedCountry({ name, flag: COUNTRY_FLAGS[name] ?? "🌐", status, cat });
    },
    [canAccessVisa, getCountryName, openUnlockFlow, passport, passportMatrix]
  );

  const hoveredName = hoverD ? getCountryName(hoverD) : null;
  const hoveredStatus = hoveredName ? passportMatrix[hoveredName] : null;
  const hoveredCat = hoverD ? getVisaCat(hoverD) : null;

  const handleRankSelect = (country: string) => {
    setPassport(country);
    setActiveTab("globe");
  };

  return (
    <div className="w-full">
      {showNativeFreemium && nativePreviewLocked && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[28vh] sm:h-[32vh]"
          style={{
            background: `linear-gradient(to top, rgba(9,9,11,${nativeCurtainOpacity}) 0%, rgba(9,9,11,${nativeCurtainOpacity * 0.55}) 45%, transparent 100%)`,
            backdropFilter: `blur(${nativeCurtainBlur}px)`,
            WebkitBackdropFilter: `blur(${nativeCurtainBlur}px)`,
            maskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0.28) 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, rgba(0,0,0,0.82) 38%, rgba(0,0,0,0.28) 75%, transparent 100%)",
          }}
          aria-hidden
        />
      )}

      {/* Tabs */}
      <div
        className={`flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 w-fit ${
          isNativeApp ? "mb-4" : "mb-6"
        }`}
      >
        {[
          { id: "globe", label: "Visa Globe", icon: Globe },
          { id: "ranking", label: "Passport Rankings", icon: Trophy },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as "globe" | "ranking")}
            className={`relative flex items-center rounded-lg font-bold transition-all ${
              isNativeApp ? "gap-1.5 px-3 py-1.5 text-[11px]" : "gap-2 px-4 py-2 text-xs"
            } ${
              activeTab === id
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "globe" ? (
          <motion.div
            key="globe"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {/* Passport selector + legend */}
            <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${isNativeApp ? "mb-4" : "mb-6"}`}>
              <div className="relative w-full max-w-xs">
                <label
                  className={`mb-1.5 block font-bold uppercase tracking-[0.2em] text-amber-500/80 ${
                    isNativeApp ? "text-[9px]" : "text-[10px]"
                  }`}
                >
                  Your Passport
                </label>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex w-full items-center justify-between rounded-xl border border-amber-500/30 bg-zinc-900/80 font-semibold text-white backdrop-blur-md transition hover:border-amber-500/50 ${
                    isNativeApp ? "px-3 py-2.5 text-[13px]" : "px-4 py-3 text-sm"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{COUNTRY_FLAGS[passport] ?? "🌐"}</span>
                    {passport}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-amber-500/70 transition ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-zinc-800 p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search countries..."
                            autoFocus
                            className="w-full rounded-lg bg-zinc-900 py-2 pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-500/40"
                          />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto p-1">
                        {filteredCountries.map((c) => (
                          <button
                            key={c}
                            onClick={() => { setPassport(c); setDropdownOpen(false); setSearch(""); }}
                            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                              c === passport ? "bg-amber-500/15 font-bold text-amber-400" : "text-zinc-300 hover:bg-zinc-800"
                            }`}
                          >
                            <span>{COUNTRY_FLAGS[c] ?? "🌐"}</span>
                            {c}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`flex flex-wrap items-center ${isNativeApp ? "gap-2.5" : "gap-3"}`}>
                {(["free", "arrival", "eta", "required"] as VisaCategory[]).map((cat) => {
                  const cfg = VISA_CATEGORIES[cat];
                  return (
                    <div key={cat} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: cfg.hex }} />
                      <span className="text-[10px] font-semibold text-zinc-400">{cfg.label}</span>
                      <span className={`text-[10px] font-bold ${cfg.color}`}>{stats[cat]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary cards */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 ${isNativeApp ? "mb-4 gap-2.5" : "mb-5 gap-3"}`}>
              {(["free", "arrival", "eta", "required"] as VisaCategory[]).map((cat) => {
                const cfg = VISA_CATEGORIES[cat];
                const Icon = cfg.icon;
                const isOpen = expandedCat === cat;
                return (
                  <div key={cat} className="col-span-1">
                    <button
                      onClick={() => { setExpandedCat(isOpen ? null : cat); setCatSearch(""); }}
                      className={`flex w-full items-center rounded-xl border text-left transition-all ${
                        isNativeApp ? "gap-2.5 px-3 py-2.5" : "gap-3 px-4 py-3"
                      } ${
                        isOpen
                          ? "rounded-b-none border-b-0 border-zinc-700 bg-zinc-900"
                          : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
                      }`}
                    >
                      <div
                        className={`flex shrink-0 items-center justify-center rounded-lg ${isNativeApp ? "h-8 w-8" : "h-9 w-9"}`}
                        style={{ background: hexToRgba(cfg.hex, 0.15) }}
                      >
                        <Icon className="h-4 w-4" style={{ color: cfg.hex }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-black leading-tight text-white ${isNativeApp ? "text-base" : "text-lg"}`}>{stats[cat]}</p>
                        <p className="text-[10px] text-zinc-500">{cfg.label}</p>
                      </div>
                      <ChevronDown
                        className="h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: isOpen ? cfg.hex : undefined }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden rounded-b-xl border border-t-0 border-zinc-700 bg-zinc-900"
                          style={{ borderColor: `${cfg.hex}30` }}
                        >
                          <div className="border-b border-zinc-800 p-2">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-600" />
                              <input
                                value={catSearch}
                                onChange={(e) => setCatSearch(e.target.value)}
                                placeholder={`Search ${cfg.label.toLowerCase()}...`}
                                className="w-full rounded-lg bg-zinc-800/60 py-1.5 pl-7 pr-2.5 text-[11px] text-zinc-300 outline-none placeholder:text-zinc-600"
                              />
                            </div>
                          </div>
                          <div className="max-h-52 overflow-y-auto p-2 [scrollbar-width:thin]">
                            {categorizedCountries[cat]
                              .filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                              .map((c) => (
                                <div
                                  key={c.name}
                                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition hover:bg-white/[0.03]"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{COUNTRY_FLAGS[c.name] ?? "🌐"}</span>
                                    <span className="text-[11px] font-medium text-zinc-300">{c.name}</span>
                                  </div>
                                  <span
                                    className="ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize"
                                    style={{ background: hexToRgba(cfg.hex, 0.12), color: cfg.hex }}
                                  >
                                    {c.status.length > 18 ? c.status.slice(0, 17) + "…" : c.status}
                                  </span>
                                </div>
                              ))}
                            {categorizedCountries[cat].filter((c) =>
                              c.name.toLowerCase().includes(catSearch.toLowerCase())
                            ).length === 0 && (
                              <p className="py-4 text-center text-[11px] text-zinc-600">No results</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Globe */}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0a0a0c] cursor-grab active:cursor-grabbing"
              style={{ height: dimensions.height }}
              onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;
                setMousePos({ x: e.clientX - rect.left + 16, y: e.clientY - rect.top + 16 });
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {geoJson && (
                  <GlobeGL
                    ref={globeRef}
                    onGlobeReady={handleGlobeReady}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    showAtmosphere={true}
                    atmosphereColor="rgba(100,160,255,1)"
                    atmosphereAltitude={0.18}
                    polygonsData={geoJson.features}
                    polygonsTransitionDuration={300}
                    polygonAltitude={(d: any) => {
                      const cat = getVisaCat(d);
                      if (d === hoverD) return 0.04;
                      if (cat === "self") return 0.025;
                      if (cat === "free") return 0.012;
                      if (cat === "arrival" || cat === "eta") return 0.008;
                      return 0.002;
                    }}
                    polygonCapColor={(d: any) => {
                      const cat = getVisaCat(d);
                      const cfg = VISA_CATEGORIES[cat];
                      if (d === hoverD) return hexToRgba(cfg.hex, 0.95);
                      if (cat === "other") return "rgba(30,30,32,0.3)";
                      return hexToRgba(cfg.hex, cat === "self" ? 0.8 : 0.6);
                    }}
                    polygonSideColor={(d: any) => {
                      const cat = getVisaCat(d);
                      const cfg = VISA_CATEGORIES[cat];
                      return d === hoverD ? hexToRgba(cfg.hex, 0.6) : hexToRgba(cfg.hex, 0.15);
                    }}
                    polygonStrokeColor={(d: any) => {
                      if (d === hoverD) return "rgba(255,255,255,0.45)";
                      const cat = getVisaCat(d);
                      if (cat === "other") return "rgba(255,255,255,0.02)";
                      return "rgba(255,255,255,0.06)";
                    }}
                    onPolygonHover={handlePolygonHover}
                    onPolygonClick={handlePolygonClick}
                    polygonLabel={() => ""}
                  />
                )}
              </motion.div>

              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-500" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Loading visa globe</p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {hoverD && hoveredName && hoveredCat && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    className="pointer-events-none absolute z-30 w-[210px] overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/90 shadow-[0_16px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl"
                    style={{ left: mousePos.x, top: mousePos.y }}
                  >
                    <div className="h-1 w-full" style={{ background: VISA_CATEGORIES[hoveredCat].hex }} />
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{COUNTRY_FLAGS[hoveredName] ?? "🌐"}</span>
                        <p className="text-sm font-bold text-white">{hoveredName}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {(() => {
                          const cfg = VISA_CATEGORIES[hoveredCat];
                          const Icon = cfg.icon;
                          return (
                            <>
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-md"
                                style={{ background: hexToRgba(cfg.hex, 0.15) }}
                              >
                                <Icon className="h-3 w-3" style={{ color: cfg.hex }} />
                              </div>
                              <div>
                                <p className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</p>
                                {hoveredStatus && hoveredCat !== "self" && (
                                  <p className="text-[9px] text-zinc-500 capitalize">{hoveredStatus}</p>
                                )}
                                {!canAccessVisa && hoveredCat !== "self" && (
                                  <p className="mt-1 flex items-center gap-1 text-[9px] text-amber-500/80">
                                    <Lock className="h-2.5 w-2.5" />
                                    {showNativeFreemium ? "Preview mode" : "Click to unlock details"}
                                  </p>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click-detail panel — shown when a paid user clicks a country */}
              <AnimatePresence>
                {clickedCountry && canAccessVisa && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ type: "spring", damping: 28, stiffness: 360 }}
                    className="absolute bottom-4 left-4 z-40 w-72 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 shadow-[0_24px_64px_rgba(0,0,0,0.9)] backdrop-blur-xl"
                  >
                    <div className="h-1 w-full" style={{ background: VISA_CATEGORIES[clickedCountry.cat].hex }} />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl leading-none">{clickedCountry.flag}</span>
                          <div>
                            <p className="font-bold text-white">{clickedCountry.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                              Visa requirement for {passport}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setClickedCountry(null)}
                          className="mt-0.5 rounded-md p-1 text-zinc-600 transition hover:text-zinc-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div
                        className="mt-3 flex items-center gap-2.5 rounded-xl p-3"
                        style={{ background: hexToRgba(VISA_CATEGORIES[clickedCountry.cat].hex, 0.10) }}
                      >
                        {(() => {
                          const cfg = VISA_CATEGORIES[clickedCountry.cat];
                          const Icon = cfg.icon;
                          return (
                            <>
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                style={{ background: hexToRgba(cfg.hex, 0.18) }}
                              >
                                <Icon className="h-4 w-4" style={{ color: cfg.hex }} />
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</p>
                                <p className="mt-0.5 text-[11px] capitalize text-zinc-400">
                                  {clickedCountry.status}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="mt-3 flex items-center gap-2 border-t border-zinc-800/60 pt-3">
                        <Plane className="h-3.5 w-3.5 text-zinc-500" />
                        <p className="text-[11px] text-zinc-500">
                          Mobility score: {passport} has{" "}
                          <span className="font-semibold text-zinc-300">
                            {stats.free + stats.arrival}
                          </span>{" "}
                          visa-free + on-arrival destinations
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom-right badge — nudges non-paid users to click a country */}
              {!canAccessVisa && !showNativeFreemium && ready && (
                <button
                  onClick={() => openUnlockFlow()}
                  className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-zinc-950/90 px-3 py-2 text-[11px] font-semibold text-amber-400/80 backdrop-blur-xl transition hover:border-amber-500/40 hover:text-amber-300"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Click a country to unlock visa details
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ranking"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-5"
          >
            {rankings.length > 0 ? (
              <PassportRankingTable
                rankings={rankings}
                passport={passport}
                onSelect={handleRankSelect}
                hasPaid={canAccessVisa}
                onUnlock={() => openUnlockFlow()}
              />
            ) : (
              <div className="flex h-40 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-500" />
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-4 text-[9px] text-zinc-600">
              <span className="font-bold uppercase tracking-widest">Legend:</span>
              {[
                { label: "F = Visa Free", color: "#10b981" },
                { label: "A = On Arrival", color: "#38bdf8" },
                { label: "E = e-Visa/eTA", color: "#fbbf24" },
                { label: "R = Visa Required", color: "#ef4444" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
              <span className="ml-auto">Score = Visa Free + On Arrival</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showNativeFreemium && nativePreviewLocked && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 pt-20">
          <div className="pointer-events-auto w-full max-w-sm rounded-xl border border-white/[0.08] bg-zinc-900/95 px-4 py-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.04]">
            <p className="text-sm font-semibold text-white">
              {paywallCountry ? `Unlock visa details for ${paywallCountry}` : "Explore the visa preview"}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Keep browsing the globe and rankings, then unlock full visa details for every destination.
            </p>
            <button
              type="button"
              onClick={() => openUnlockFlow(paywallCountry, true)}
              className="mt-3 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              Get full access
            </button>
          </div>
        </div>
      )}

      <SignupModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        countryName={paywallCountry}
      />
    </div>
  );
}
