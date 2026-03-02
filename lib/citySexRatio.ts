/**
 * Best and worst cities per country for female-to-male ratio in the 25–39 prime dating age group.
 * Used in Stats & Comparisons → Population so users can choose cities where the dating pool
 * favors more women (better competitive edge). Best = somewhat larger city with better ratio;
 * worst = city with more skewed male ratio (e.g. industrial, military, or migrant-worker heavy).
 * Based on census/UN city data, expat reports, and demographic patterns where available.
 */

export type CityRatioEntry = {
  name: string;
  /** Short note (e.g. why best/worst, or "Major city") */
  note?: string;
};

export type CountryCityRatio = {
  best: CityRatioEntry;
  worst: CityRatioEntry;
};

export const CITY_SEX_RATIO_BEST_WORST: Record<string, CountryCityRatio> = {
  philippines: { best: { name: "Cebu City", note: "Major hub, better F/M ratio than Manila" }, worst: { name: "Manila", note: "Capital, more male workforce" } },
  thailand: { best: { name: "Chiang Mai", note: "University city, strong female presence" }, worst: { name: "Bangkok", note: "Capital, male-dominated industries" } },
  indonesia: { best: { name: "Bali (Denpasar/Ubud)", note: "Tourism & culture, balanced ratio" }, worst: { name: "Jakarta", note: "Capital, heavy male labor inflow" } },
  malaysia: { best: { name: "Penang", note: "Cultural hub, good 25–39 ratio" }, worst: { name: "Kuala Lumpur", note: "Finance hub, more male expats" } },
  vietnam: { best: { name: "Da Nang", note: "Beach city, younger demographic" }, worst: { name: "Ho Chi Minh City", note: "Industrial, male migrant workers" } },
  cambodia: { best: { name: "Siem Reap", note: "Tourism hub, service sector" }, worst: { name: "Phnom Penh", note: "Capital, construction/manufacturing" } },
  kenya: { best: { name: "Nairobi", note: "Capital, universities & services" }, worst: { name: "Mombasa", note: "Port city, male labor" } },
  nigeria: { best: { name: "Lagos", note: "Largest city, diverse economy" }, worst: { name: "Port Harcourt", note: "Oil industry, male-dominated" } },
  uganda: { best: { name: "Kampala", note: "Capital, university city" }, worst: { name: "Entebbe", note: "Transport hub" } },
  rwanda: { best: { name: "Kigali", note: "Capital, services & government" }, worst: { name: "Gisenyi", note: "Border town, trade" } },
  tanzania: { best: { name: "Dar es Salaam", note: "Largest city, mixed economy" }, worst: { name: "Mwanza", note: "Industrial port" } },
  ethiopia: { best: { name: "Addis Ababa", note: "Capital, universities" }, worst: { name: "Dire Dawa", note: "Industrial hub" } },
  bolivia: { best: { name: "Santa Cruz", note: "Largest city, commerce" }, worst: { name: "El Alto", note: "Industrial, male labor" } },
  colombia: { best: { name: "Medellín", note: "Second city, better ratio than Bogotá" }, worst: { name: "Bogotá", note: "Capital, male-heavy workforce" } },
  mexico: { best: { name: "Playa del Carmen", note: "Riviera Maya, tourism & younger crowd" }, worst: { name: "Monterrey", note: "Industrial, male-dominated" } },
  peru: { best: { name: "Cusco", note: "Tourism hub, balanced 25–39" }, worst: { name: "Lima", note: "Capital, male labor inflow" } },
  venezuela: { best: { name: "Valencia", note: "Third city, university presence" }, worst: { name: "Maracaibo", note: "Oil city, male skew" } },
  "dominican-republic": { best: { name: "Santo Domingo", note: "Capital, universities & nightlife" }, worst: { name: "Santiago", note: "Industrial Cibao" } },
  "costa-rica": { best: { name: "San José", note: "Capital, services & students" }, worst: { name: "Puerto Limón", note: "Port, male labor" } },
  india: { best: { name: "Bangalore", note: "Tech hub, younger demographic" }, worst: { name: "Mumbai", note: "Finance, male migrant workers" } },
  pakistan: { best: { name: "Lahore", note: "Cultural capital, universities" }, worst: { name: "Karachi", note: "Port, industrial" } },
  morocco: { best: { name: "Marrakech", note: "Tourism, mixed age group" }, worst: { name: "Casablanca", note: "Business hub, male workforce" } },
  brazil: { best: { name: "Florianópolis", note: "Island city, beach & university" }, worst: { name: "São Paulo", note: "Megacity, finance/industry" } },
  argentina: { best: { name: "Buenos Aires", note: "Capital, culture & nightlife" }, worst: { name: "Córdoba", note: "Industrial, male skew" } },
  chile: { best: { name: "Valparaíso", note: "Port city, universities" }, worst: { name: "Antofagasta", note: "Mining, very male" } },
  china: { best: { name: "Chengdu", note: "Major city, younger vibe" }, worst: { name: "Shenzhen", note: "Tech/manufacturing, male migrant" } },
  mongolia: { best: { name: "Ulaanbaatar", note: "Capital, half of country's population" }, worst: { name: "Erdenet", note: "Mining city" } },
  "south-africa": { best: { name: "Cape Town", note: "Tourism, universities, better ratio" }, worst: { name: "Johannesburg", note: "Mining/finance, male-heavy" } },
  russia: { best: { name: "Saint Petersburg", note: "Second city, culture & students" }, worst: { name: "Norilsk", note: "Industrial/mining" } },
  ukraine: { best: { name: "Kyiv", note: "Capital, universities" }, worst: { name: "Donetsk", note: "Industrial (pre-conflict)" } },
  poland: { best: { name: "Kraków", note: "Student city, tourism" }, worst: { name: "Katowice", note: "Industrial Silesia" } },
  romania: { best: { name: "Cluj-Napoca", note: "Tech & university city" }, worst: { name: "Bucharest", note: "Capital, male commuters" } },
  turkey: { best: { name: "Istanbul", note: "Largest city, mixed economy" }, worst: { name: "Ankara", note: "Capital, government/military" } },
  kazakhstan: { best: { name: "Almaty", note: "Largest city, culture" }, worst: { name: "Aktobe", note: "Oil/industry" } },
  algeria: { best: { name: "Algiers", note: "Capital, universities" }, worst: { name: "Oran", note: "Port, industrial" } },
  libya: { best: { name: "Tripoli", note: "Capital" }, worst: { name: "Benghazi", note: "Second city, oil" } },
  canada: { best: { name: "Montreal", note: "Student city, balanced" }, worst: { name: "Calgary", note: "Energy sector, male skew" } },
  australia: { best: { name: "Melbourne", note: "Culture, universities" }, worst: { name: "Perth", note: "Mining, male-dominated" } },
  uk: { best: { name: "London", note: "Capital, diverse" }, worst: { name: "Manchester", note: "Industrial heritage" } },
  france: { best: { name: "Lyon", note: "Second city, students" }, worst: { name: "Marseille", note: "Port, male labor" } },
  germany: { best: { name: "Berlin", note: "Capital, young & diverse" }, worst: { name: "Wolfsburg", note: "Auto industry" } },
  spain: { best: { name: "Barcelona", note: "Tourism, culture" }, worst: { name: "Bilbao", note: "Industrial" } },
  italy: { best: { name: "Milan", note: "Fashion, younger workers" }, worst: { name: "Turin", note: "Industrial" } },
  sweden: { best: { name: "Stockholm", note: "Capital" }, worst: { name: "Gothenburg", note: "Port, industry" } },
  japan: { best: { name: "Fukuoka", note: "Younger city, less salaryman skew" }, worst: { name: "Tokyo", note: "Capital, male commuters" } },
  "south-korea": { best: { name: "Busan", note: "Second city, port & culture" }, worst: { name: "Seoul", note: "Capital, corporate male" } },
  "saudi-arabia": { best: { name: "Jeddah", note: "Red Sea city, more diverse" }, worst: { name: "Riyadh", note: "Capital, government/male" } },
  egypt: { best: { name: "Alexandria", note: "Mediterranean, universities" }, worst: { name: "Cairo", note: "Capital, male labor" } },
  iran: { best: { name: "Shiraz", note: "Cultural city" }, worst: { name: "Tehran", note: "Capital, male workforce" } },
  usa: { best: { name: "New York City", note: "Dense, diverse" }, worst: { name: "Houston", note: "Energy, male skew" } },
  portugal: { best: { name: "Lisbon", note: "Capital, tourism" }, worst: { name: "Porto", note: "Industrial" } },
  netherlands: { best: { name: "Amsterdam", note: "Capital" }, worst: { name: "Rotterdam", note: "Port, male" } },
  belgium: { best: { name: "Brussels", note: "Capital" }, worst: { name: "Antwerp", note: "Port, diamond" } },
  austria: { best: { name: "Vienna", note: "Capital" }, worst: { name: "Linz", note: "Industrial" } },
  switzerland: { best: { name: "Zurich", note: "Largest city" }, worst: { name: "Lugano", note: "Finance" } },
  norway: { best: { name: "Oslo", note: "Capital" }, worst: { name: "Stavanger", note: "Oil" } },
  denmark: { best: { name: "Copenhagen", note: "Capital" }, worst: { name: "Aarhus", note: "Second city" } },
  finland: { best: { name: "Helsinki", note: "Capital" }, worst: { name: "Tampere", note: "Industrial" } },
  ireland: { best: { name: "Dublin", note: "Capital, tech" }, worst: { name: "Cork", note: "Port" } },
  greece: { best: { name: "Athens", note: "Capital" }, worst: { name: "Thessaloniki", note: "Port" } },
  "czech-republic": { best: { name: "Prague", note: "Capital" }, worst: { name: "Ostrava", note: "Industrial" } },
  hungary: { best: { name: "Budapest", note: "Capital" }, worst: { name: "Miskolc", note: "Industrial" } },
  croatia: { best: { name: "Zagreb", note: "Capital" }, worst: { name: "Split", note: "Port" } },
  serbia: { best: { name: "Belgrade", note: "Capital" }, worst: { name: "Novi Sad", note: "Second city" } },
  bulgaria: { best: { name: "Sofia", note: "Capital" }, worst: { name: "Plovdiv", note: "Industrial" } },
  slovakia: { best: { name: "Bratislava", note: "Capital" }, worst: { name: "Košice", note: "Steel" } },
  lithuania: { best: { name: "Vilnius", note: "Capital" }, worst: { name: "Klaipėda", note: "Port" } },
  latvia: { best: { name: "Riga", note: "Capital" }, worst: { name: "Daugavpils", note: "Second city" } },
  estonia: { best: { name: "Tallinn", note: "Capital" }, worst: { name: "Tartu", note: "University town" } },
  slovenia: { best: { name: "Ljubljana", note: "Capital" }, worst: { name: "Maribor", note: "Second city" } },
  luxembourg: { best: { name: "Luxembourg City", note: "Capital" }, worst: { name: "Esch-sur-Alzette", note: "Industrial" } },
  malta: { best: { name: "Valletta", note: "Capital" }, worst: { name: "Sliema", note: "Commercial" } },
  cyprus: { best: { name: "Limassol", note: "Coastal, business" }, worst: { name: "Nicosia", note: "Capital" } },
  iceland: { best: { name: "Reykjavík", note: "Capital" }, worst: { name: "Akureyri", note: "North" } },
  montenegro: { best: { name: "Podgorica", note: "Capital" }, worst: { name: "Nikšić", note: "Industrial" } },
  "north-macedonia": { best: { name: "Skopje", note: "Capital" }, worst: { name: "Bitola", note: "Second city" } },
  albania: { best: { name: "Tirana", note: "Capital" }, worst: { name: "Durrës", note: "Port" } },
  "bosnia-and-herzegovina": { best: { name: "Sarajevo", note: "Capital" }, worst: { name: "Banja Luka", note: "Second city" } },
  moldova: { best: { name: "Chișinău", note: "Capital" }, worst: { name: "Tiraspol", note: "Transnistria" } },
};

export function getCitySexRatio(slug: string): CountryCityRatio | null {
  return CITY_SEX_RATIO_BEST_WORST[slug] ?? null;
}
