import { supabase } from "./supabase";

export type City = {
  slug: string;
  name: string;
  country: string;
  costPerMonth: number;
  internetSpeed: number;
  safetyScore: number;
  datingScore: number;
  imageUrl: string;
  description: string;
  pros: string[];
  cons: string[];
};

/** Row shape coming from the Supabase "Cities" table (capitalised columns). */
type CityRow = {
  Slug: string;
  Name: string;
  Country: string;
  Cost_per_month: number;
  Internet_speed: number;
  Safety_score: number;
  Dating_score: number;
  Image_url: string;
  Description: string;
  Pros: string[];
  Cons: string[];
};

function rowToCity(row: CityRow): City {
  return {
    slug: row.Slug,
    name: row.Name,
    country: row.Country,
    costPerMonth: row.Cost_per_month,
    internetSpeed: row.Internet_speed,
    safetyScore: row.Safety_score,
    datingScore: row.Dating_score,
    imageUrl: row.Image_url,
    description: row.Description,
    pros: row.Pros ?? [],
    cons: row.Cons ?? [],
  };
}

/** Fetch all cities from Supabase, falling back to static data on error. */
export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from("Cities")
    .select("*")
    .order("Name");

  if (error || !data) {
    console.error(
      "Supabase fetch failed, using static fallback.",
      "\n  Code:", error?.code,
      "\n  Message:", error?.message,
      "\n  Hint:", error?.hint,
      "\n  URL set:", !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      "\n  Key set:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    return fallbackCities;
  }

  return (data as CityRow[]).map(rowToCity);
}

/** Fetch a single city by slug from Supabase. */
export async function getCityBySlug(
  slug: string,
): Promise<City | undefined> {
  const { data, error } = await supabase
    .from("Cities")
    .select("*")
    .eq("Slug", slug)
    .single();

  if (error || !data) {
    console.error(
      "Supabase single-city fetch failed, using static fallback.",
      "\n  Code:", error?.code,
      "\n  Message:", error?.message,
    );
    return fallbackCities.find((c) => c.slug === slug);
  }

  return rowToCity(data as CityRow);
}

/** Fetch all slugs (used for generateStaticParams). */
export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("Cities")
    .select("Slug");

  if (error || !data) return fallbackCities.map((c) => c.slug);
  return (data as { Slug: string }[]).map((r) => r.Slug);
}

// ── Static fallback data (used when Supabase is unreachable) ────────────

const fallbackCities: City[] = [
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    costPerMonth: 1400,
    internetSpeed: 250,
    safetyScore: 7.5,
    datingScore: 8.8,
    imageUrl:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
    description:
      "Bangkok is the ultimate passport-bro basecamp. The city blends a frenetic energy with surprisingly affordable luxury — you can rent a modern condo with a rooftop pool for under $700/month, eat world-class street food for $2 a plate, and still be a short MRT ride from one of Asia's most vibrant nightlife scenes. The expat community here is enormous, the coworking scene is mature, and fiber internet is cheap and fast.",
    pros: [
      "Ultra-affordable cost of living with high quality of life",
      "Exceptional street food and restaurant scene",
      "Fast, cheap fiber internet in most areas",
      "Huge international expat & nomad community",
      "Very easy visa access (60-day tourist + extensions)",
      "World-class healthcare at a fraction of Western prices",
    ],
    cons: [
      "Oppressive heat and humidity for most of the year",
      "Air quality can be poor in Feb–Apr",
      "Traffic congestion in central areas",
      "Language barrier outside tourist zones",
    ],
  },
  {
    slug: "manila",
    name: "Manila",
    country: "Philippines",
    costPerMonth: 1100,
    internetSpeed: 120,
    safetyScore: 6.8,
    datingScore: 8.5,
    imageUrl:
      "https://images.unsplash.com/photo-1591077438983-40f3c7c34167?auto=format&fit=crop&w=1200&q=80",
    description:
      "Manila is Southeast Asia's most underrated expat city. Filipinos are English-first by default — no language barrier, no culture shock. The BGC (Bonifacio Global City) district offers polished coworking spaces, rooftop bars and a walkable grid that feels nothing like the chaos of old Manila. Living costs are the lowest in this index, making it ideal for stretching savings while building an online business.",
    pros: [
      "100% English-speaking — zero language barrier",
      "Lowest cost of living in the index",
      "Extremely warm and welcoming locals",
      "US-influenced culture makes integration easy",
      "BGC and Makati offer world-class amenities",
      "Direct flights to most of Asia",
    ],
    cons: [
      "Internet can be unreliable outside BGC/Makati",
      "Traffic is among the worst in Southeast Asia",
      "Safety requires staying in expat-friendly zones",
      "Humidity and typhoon season (June–November)",
    ],
  },
  {
    slug: "medellin",
    name: "Medellín",
    country: "Colombia",
    costPerMonth: 1200,
    internetSpeed: 200,
    safetyScore: 7.2,
    datingScore: 8.2,
    imageUrl:
      "https://images.unsplash.com/photo-1563122875-ef333df587f8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Medellín has pulled off one of the most remarkable urban transformations of the 21st century. Once the world's most dangerous city, it is now a design-forward, tech-savvy metropolis with a permanent spring climate at 1,500 m altitude. El Poblado and Laureles are expat hotspots packed with specialty coffee shops, coworking spaces and a dating scene that punches well above its weight. The city attracts digital nomads, startup founders and remote workers from across the globe.",
    pros: [
      "Eternal spring climate (22–26°C year-round)",
      "Thriving startup and digital nomad ecosystem",
      "Excellent specialty coffee culture",
      "Good internet infrastructure in expat neighborhoods",
      "Very affordable compared to US/Europe",
      "Spanish immersion opportunity",
    ],
    cons: [
      "Spanish required outside expat bubbles",
      "Altitude can take 1–2 weeks to adjust to",
      "Some petty crime in areas outside Poblado/Laureles",
      "Long flight times from Europe and Asia",
    ],
  },
];
