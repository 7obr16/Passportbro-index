/**
 * Community Intel: pros and cons per country from a passport bro perspective.
 * Sourced from Reddit r/passportbros, r/digitalnomad, and travel forums.
 * Used to show expandable lists on the country detail page.
 */

export type CommunityIntel = { pros: string[]; cons: string[] };

function splitFallback(s: string): string[] {
  if (!s?.trim()) return [];
  return s
    .split(/\n|\.\s+(?=[A-Z])|(?<=\.)\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export const COMMUNITY_INTEL: Record<string, CommunityIntel> = {
  philippines: {
    pros: [
      "English widely spoken; easy to communicate and date.",
      "Very affordable: $1k–1.5k/month comfortable in Manila or Cebu.",
      "Women are generally warm, family-oriented, and open to foreign men.",
      "Strong dating app presence; many locals use Tinder/Bumble.",
      "Visa-free entry for many nationalities; long stays possible.",
      "Beach and city options; Palawan, Boracay, Cebu very popular.",
      "Friendly culture; locals often go out of their way to help.",
      "Low cost of living; great value for food, transport, rent.",
    ],
    cons: [
      "Scams and gold-digging stories; some women expect financial support.",
      "Traffic in Manila is severe; can waste hours daily.",
      "Infrastructure outside main cities can be rough.",
      "Heat and humidity year-round; can be exhausting.",
      "Dating culture can feel transactional for some.",
      "Healthcare quality varies; serious issues may require medical travel.",
    ],
  },
  thailand: {
    pros: [
      "Very popular with digital nomads and passport bros; established scene.",
      "Great nightlife in Bangkok, Phuket, Chiang Mai.",
      "Affordable: $1.5k–2.5k/month for a good lifestyle.",
      "Visa options (tourist, education, elite) allow long stays.",
      "Good food, beaches, and mix of city and nature.",
      "Women are often approachable; dating apps and bars both work.",
      "Generally safe; infrastructure and healthcare decent in cities.",
      "Strong expat community; easy to meet like-minded people.",
    ],
    cons: [
      "Tourist areas can feel saturated; some women target foreigners.",
      "Visa runs and rules can be stressful long-term.",
      "Bangkok pollution and traffic; Chiang Mai burning season.",
      "Language barrier outside tourist hubs.",
      "Scams (gem, tuk-tuk, etc.) if you look like a new tourist.",
    ],
  },
  indonesia: {
    pros: [
      "Bali is a major hub; great for networking and dating.",
      "Very affordable; $1.2k–2k/month possible in Bali/Jakarta.",
      "Diverse: beaches, volcanoes, cities; visa-free for many.",
      "Women can be traditional and family-oriented; serious relationship potential.",
      "Strong digital nomad community in Bali.",
      "Rich culture and nature; lots to explore.",
    ],
    cons: [
      "Outside Bali, English drops and dating gets harder.",
      "Conservative in many areas; public displays and dress matter.",
      "Traffic in Jakarta is among the worst in the world.",
      "Visa on arrival is short; long-term stay needs planning.",
      "Some areas less safe; do research by region.",
    ],
  },
  malaysia: {
    pros: [
      "Kuala Lumpur is modern, affordable, good internet.",
      "English common in cities; easy to get around.",
      "Mix of Malay, Chinese, Indian culture; diverse dating pool.",
      "Generally safe and good infrastructure.",
      "Visa-free or easy e-visa for many; Penang, KL popular.",
      "Food is excellent and cheap.",
    ],
    cons: [
      "More reserved than Thailand/Philippines; dating can feel slower.",
      "Alcohol expensive; nightlife less dominant than in Thailand.",
      "Conservative in some states; rules vary by region.",
      "Less of a “passport bro” hub so fewer shared experiences.",
    ],
  },
  vietnam: {
    pros: [
      "Very affordable; $1k–1.8k/month in Hanoi or Ho Chi Minh.",
      "Young population; lots of single women and dating app activity.",
      "Visa options allow long stays; many nomads stay months.",
      "Great food, coffee culture, and motorbike lifestyle.",
      "Women often interested in foreigners; approachable in cities.",
      "Beaches (Da Nang, Nha Trang) and cities both viable.",
    ],
    cons: [
      "English level lower than Philippines; communication can be tough.",
      "Traffic and noise in big cities; pollution in Hanoi.",
      "Visa rules change; need to stay updated.",
      "Some women expect marriage or serious commitment quickly.",
      "Scams (overcharging, fake tours) if you don’t know the ropes.",
    ],
  },
  colombia: {
    pros: [
      "Medellín and Bogotá are major passport bro hubs; huge community.",
      "Women are often seen as very attractive and approachable.",
      "Vibrant nightlife; salsa, reggaeton, dating scene active.",
      "Affordable by Western standards; $1.5k–2.5k/month.",
      "Visa-free for many; 90 days often extendable.",
      "Warm culture; people are social and outgoing.",
    ],
    cons: [
      "Safety varies by city and area; need to know where to avoid.",
      "Dating can feel transactional; “gringo pricing” and gold-digging stories.",
      "Altitude in Bogotá; Medellín generally easier.",
      "Language: Spanish almost essential for best results.",
      "Scams and petty crime; don’t flash wealth or walk alone at night in wrong areas.",
    ],
  },
  brazil: {
    pros: [
      "Rio and São Paulo have legendary nightlife and dating scene.",
      "Women are often open, fun, and physically attractive by Western standards.",
      "Beach culture, festivals, and social life are top-tier.",
      "Visa-free for many nationalities for 90 days.",
      "Warm, outgoing culture; easy to make friends and dates.",
    ],
    cons: [
      "Safety is a real concern; robbery and violence in some areas.",
      "Portuguese is important; English not widely spoken.",
      "Cost in Rio/SP can be higher than other Latin American cities.",
      "Dating can be intense; jealousy and drama reported by some.",
      "Bureaucracy and infrastructure can be frustrating.",
    ],
  },
  argentina: {
    pros: [
      "Safest country in South America; good infrastructure.",
      "Buenos Aires is cultured, European-feel; great food and nightlife.",
      "Women are often educated and stylish; serious dating possible.",
      "Visa-free for many; affordable once you’re there (peso volatility).",
      "Wine, steak, tango; high quality of life for the cost.",
    ],
    cons: [
      "Colder culture; women are less approachable than in Brazil or Colombia.",
      "Economic instability; inflation and exchange rate can be confusing.",
      "English is not widespread; Spanish needed.",
      "Dating can feel more formal and slower than in Colombia.",
    ],
  },
  mexico: {
    pros: [
      "Close to USA; easy flights and many Americans already there.",
      "Mexico City, Playa del Carmen, Tulum, CDMX have strong nomad scenes.",
      "Affordable in many areas; $1.5k–2.5k/month.",
      "Visa-free or FMM for 180 days for many.",
      "Dating apps and nightlife active; women often open to foreigners.",
      "Great food, culture, and variety of climates.",
    ],
    cons: [
      "Safety varies a lot by region; cartel and crime in some areas.",
      "Tourist zones can feel overrun and expensive.",
      "Language: Spanish helps a lot outside expat bubbles.",
      "Scams and “gringo tax”; need street smarts.",
    ],
  },
  "costa-rica": {
    pros: [
      "Very safe for the region; stable and peaceful.",
      "Good healthcare and infrastructure; popular with retirees and nomads.",
      "Beaches and nature; relaxed lifestyle.",
      "English spoken in tourist and expat areas.",
      "Visa options for longer stays; welcoming to foreigners.",
    ],
    cons: [
      "More expensive than most of Central America; $2k–3k/month common.",
      "Dating scene smaller and less “passport bro” focused.",
      "Women can be more reserved than in Colombia or Brazil.",
      "Rainy season can be long and intense.",
    ],
  },
  "dominican-republic": {
    pros: [
      "Santo Domingo and Punta Cana have nightlife and beach life.",
      "Affordable; visa-free for many.",
      "Women are often warm and open; dating apps and bars both work.",
      "Caribbean vibe; music, dancing, relaxed attitude.",
    ],
    cons: [
      "Safety in parts of Santo Domingo and other cities can be sketchy.",
      "Sanky panky culture; some women target tourists.",
      "Infrastructure and healthcare inconsistent outside resorts.",
    ],
  },
  peru: {
    pros: [
      "Lima has a growing scene; affordable and good food.",
      "Cusco and Sacred Valley attract travelers and nomads.",
      "Women can be traditional and family-oriented.",
      "Visa-free for many; rich culture and history.",
    ],
    cons: [
      "Safety in Lima varies by district; petty crime and theft.",
      "English not widely spoken; Spanish important.",
      "Dating scene less established than Colombia or Brazil.",
    ],
  },
  ecuador: {
    pros: [
      "Quito and Cuenca are cheap and popular with retirees.",
      "Dollarized economy; no currency hassle.",
      "Visa options for long-term stay; low cost of living.",
      "Mountain and coast; varied geography.",
    ],
    cons: [
      "Smaller dating and nomad scene.",
      "Altitude in Quito; safety and petty crime in some areas.",
    ],
  },
  "south-africa": {
    pros: [
      "Cape Town and Johannesburg have nightlife and expat communities.",
      "English is an official language; easy communication.",
      "Beautiful nature; wine country, beaches, safari.",
      "Affordable for those earning in USD/EUR.",
    ],
    cons: [
      "Safety is a major concern; crime and inequality high.",
      "Dating scene can feel segregated; need to be careful where you go.",
      "Infrastructure and power issues (load shedding).",
    ],
  },
  poland: {
    pros: [
      "Kraków and Warsaw are affordable European cities.",
      "Women are often attractive; many speak some English.",
      "Safe, good infrastructure; EU standards.",
      "Visa-free for many; Schengen rules apply.",
    ],
    cons: [
      "Colder culture; approachability lower than in Latin America or SEA.",
      "Less of a “passport bro” destination; more traditional dating.",
      "Winter can be long and dark.",
    ],
  },
  romania: {
    pros: [
      "Bucharest and Cluj are cheap by EU standards.",
      "Women are often good-looking; nightlife is active.",
      "Safe in main cities; visa-free for many (Schengen).",
    ],
    cons: [
      "English level variable; Romanian needed outside bubbles.",
      "Less established nomad community than in Poland or Portugal.",
    ],
  },
  turkey: {
    pros: [
      "Istanbul is a huge city with history, nightlife, and dating.",
      "Affordable; e-visa easy for many.",
      "Mix of European and Middle Eastern culture; diverse.",
    ],
    cons: [
      "Political and safety concerns in some periods.",
      "Conservative in some areas; dating can be nuanced.",
      "Currency volatility; inflation can affect costs.",
    ],
  },
  japan: {
    pros: [
      "Very safe; excellent infrastructure and service.",
      "Tokyo and Osaka have nightlife and dating apps.",
      "Unique culture; high quality of life.",
    ],
    cons: [
      "Expensive; language barrier is significant.",
      "Dating culture is different; women can be reserved.",
      "Less of a classic “passport bro” destination.",
    ],
  },
  "south-korea": {
    pros: [
      "Seoul is modern, safe, good nightlife.",
      "Dating apps and foreigner-friendly venues exist.",
      "Good infrastructure and food.",
    ],
    cons: [
      "Expensive; competitive and work-focused culture.",
      "Dating can feel formal; language helps a lot.",
    ],
  },
  usa: {
    pros: [
      "No visa needed for citizens; huge variety of cities and scenes.",
      "High income potential; best for earning then traveling.",
    ],
    cons: [
      "Expensive; dating in major cities can be competitive and costly.",
      "Less “passport bro” angle; most content is about leaving the USA.",
    ],
  },
  uk: {
    pros: [
      "London has everything but is expensive.",
      "English-speaking; no language barrier.",
    ],
    cons: [
      "Very high cost of living; dating can be tough and expensive.",
      "Weather and vibe not typically “passport bro”.",
    ],
  },
  cambodia: {
    pros: [
      "Very affordable; Phnom Penh and Siem Reap popular.",
      "Visa runs and long-term stays common.",
      "Friendly locals; relaxed vibe.",
    ],
    cons: [
      "English limited outside tourist areas; infrastructure basic.",
      "Dating scene smaller; some targeting of foreigners.",
      "Safety and scams in places; do research.",
    ],
  },
  kenya: {
    pros: [
      "Nairobi has expat scene; English is official.",
      "Safari and coast; diverse options.",
    ],
    cons: [
      "Safety in Nairobi varies; petty crime and scams.",
      "Dating scene not as established as in Latin America or SEA.",
    ],
  },
  nigeria: {
    pros: [
      "Lagos is a huge city; English widely spoken.",
      "Vibrant culture and nightlife.",
    ],
    cons: [
      "Safety concerns; scams (e.g. advance-fee) well known.",
      "Infrastructure and bureaucracy challenging.",
      "Not a typical passport bro hub; do thorough research.",
    ],
  },
  india: {
    pros: [
      "Very affordable; Goa and Bangalore have nomad scenes.",
      "Huge population; dating apps active in cities.",
    ],
    cons: [
      "Conservative in many areas; culture shock and scams.",
      "Infrastructure and pollution in big cities.",
      "Visa and bureaucracy can be tedious.",
    ],
  },
  egypt: {
    pros: [
      "Historical sites; Red Sea resorts; affordable.",
      "Visa on arrival or e-visa for many.",
    ],
    cons: [
      "Harassment and hustling; women travelers report issues.",
      "Dating culture very different; conservative.",
      "Safety and scams; need to be street-smart.",
    ],
  },
  morocco: {
    pros: [
      "Marrakech, Fes, Tangier; mix of culture and affordability.",
      "Visa-free for many; good for short trips.",
    ],
    cons: [
      "Hustling and scams common in tourist zones.",
      "Conservative; dating and nightlife limited.",
      "Language: Arabic and French more useful than English.",
    ],
  },
  chile: {
    pros: [
      "Santiago is safe and developed; wine and nature.",
      "Stable economy; good infrastructure.",
    ],
    cons: [
      "More expensive than other South American countries.",
      "Colder culture; less approachable than Colombia or Brazil.",
    ],
  },
  venezuela: {
    pros: [
      "Women often cited as very attractive; once popular with travelers.",
      "Cheap if you have hard currency.",
    ],
    cons: [
      "Safety and instability; not recommended for most.",
      "Infrastructure and healthcare collapsed in many areas.",
    ],
  },
  bolivia: {
    pros: [
      "Very affordable; La Paz, Santa Cruz.",
      "Visa-free or easy for many.",
    ],
    cons: [
      "Altitude in La Paz; safety and petty crime in places.",
      "Smaller dating and nomad scene.",
    ],
  },
  russia: {
    pros: [
      "Moscow and St Petersburg; culture and nightlife.",
      "Women often interested in foreigners in cities.",
    ],
    cons: [
      "Visa and political situation; not recommended for many nationals.",
      "Language barrier; English not widespread.",
    ],
  },
  ukraine: {
    pros: [
      "Kyiv had a strong scene before the war; beautiful women, affordable.",
    ],
    cons: [
      "Active conflict; not a viable destination currently.",
    ],
  },
  france: {
    pros: [
      "Paris and other cities; culture, food, romance.",
      "Schengen visa-free for many.",
    ],
    cons: [
      "Expensive; French needed for best dating results.",
      "Less “passport bro” angle; competitive dating.",
    ],
  },
  spain: {
    pros: [
      "Barcelona, Madrid; great lifestyle and nightlife.",
      "Affordable compared to northern Europe.",
    ],
    cons: [
      "Pickpocketing and tourist scams in big cities.",
      "Spanish helps a lot; dating can be competitive.",
    ],
  },
  italy: {
    pros: [
      "Rome, Milan, Naples; culture, food, beauty.",
      "Schengen; good for Euro trips.",
    ],
    cons: [
      "Expensive in major cities; Italian helps for dating.",
      "Bureaucracy and inefficiency can frustrate.",
    ],
  },
  germany: {
    pros: [
      "Berlin, Munich; safe, good infrastructure.",
      "English in cities; strong economy.",
    ],
    cons: [
      "Expensive; dating culture can feel reserved.",
      "Less of a classic passport bro destination.",
    ],
  },
  canada: {
    pros: [
      "Safe, English/French; high quality of life.",
      "Good for earning then traveling.",
    ],
    cons: [
      "Expensive; dating in Toronto/Vancouver competitive.",
      "Cold winters; not a low-cost destination.",
    ],
  },
  australia: {
    pros: [
      "Sydney, Melbourne; beaches, lifestyle, English.",
      "Safe and developed.",
    ],
    cons: [
      "Very expensive; visa and distance from rest of world.",
      "Dating scene competitive in cities.",
    ],
  },
  sweden: {
    pros: [
      "Safe, high quality of life; English widely spoken.",
    ],
    cons: [
      "Very expensive; reserved culture; cold winters.",
    ],
  },
  "saudi-arabia": {
    pros: [
      "Riyadh, Jeddah opening up; visa easier for tourists.",
    ],
    cons: [
      "Very conservative; dating and nightlife highly restricted.",
      "Not a typical passport bro destination.",
    ],
  },
  iran: {
    pros: [
      "Rich culture and history; hospitable people.",
    ],
    cons: [
      "Conservative; no dating scene for foreigners in that sense.",
      "Visa and political issues for many nationals.",
    ],
  },
  china: {
    pros: [
      "Huge cities; unique culture; women interested in foreigners in tier-1 cities.",
    ],
    cons: [
      "Visa and Great Firewall; language barrier big.",
      "Dating and nightlife restricted compared to SEA.",
    ],
  },
  mongolia: {
    pros: [
      "Unique; visa-free for many; adventure.",
    ],
    cons: [
      "Small population; harsh climate; limited dating scene.",
    ],
  },
  kazakhstan: {
    pros: [
      "Almaty; mix of Central Asian and Russian influence; affordable.",
    ],
    cons: [
      "Language; smaller expat and dating scene.",
    ],
  },
  algeria: {
    pros: [
      "North African culture; Mediterranean coast.",
    ],
    cons: [
      "Visa and safety; conservative; not a typical nomad hub.",
    ],
  },
  libya: {
    pros: [],
    cons: [
      "Unstable; not recommended for travel or dating.",
    ],
  },
  uganda: {
    pros: [
      "Kampala; English official; affordable.",
    ],
    cons: [
      "Safety and scams; smaller dating scene.",
    ],
  },
  rwanda: {
    pros: [
      "Safe, clean; Kigali is orderly.",
    ],
    cons: [
      "Small; conservative; limited nightlife and dating scene.",
    ],
  },
  tanzania: {
    pros: [
      "Dar es Salaam, Zanzibar; beach and city.",
    ],
    cons: [
      "Safety variable; English in places.",
    ],
  },
  ethiopia: {
    pros: [
      "Addis Ababa; unique culture; visa on arrival.",
    ],
    cons: [
      "Infrastructure and safety; conservative in many areas.",
    ],
  },
  pakistan: {
    pros: [
      "Very affordable; mountains and culture.",
    ],
    cons: [
      "Safety and conservative culture; not a typical dating destination.",
    ],
  },
  // European countries — data from standard sources; dating left for manual input
  portugal: { pros: ["Safe; Schengen; good infrastructure and beaches."], cons: ["Dating: add your input."] },
  netherlands: { pros: ["Very safe; excellent English; strong infrastructure."], cons: ["Expensive; dating: add your input."] },
  belgium: { pros: ["Central EU; multilingual; safe."], cons: ["Dating: add your input."] },
  austria: { pros: ["Very safe; Alps; high quality of life."], cons: ["Expensive; dating: add your input."] },
  switzerland: { pros: ["Very safe; nature; high quality of life."], cons: ["Very expensive; dating: add your input."] },
  norway: { pros: ["Very safe; nature; English widely spoken."], cons: ["Very expensive; dating: add your input."] },
  denmark: { pros: ["Very safe; English widely spoken; bike-friendly."], cons: ["Expensive; dating: add your input."] },
  finland: { pros: ["Very safe; nature; good English."], cons: ["Reserved culture; expensive; dating: add your input."] },
  ireland: { pros: ["Very safe; English; friendly culture."], cons: ["Expensive; dating: add your input."] },
  greece: { pros: ["Schengen; beaches; history; affordable by EU standards."], cons: ["Dating: add your input."] },
  "czech-republic": { pros: ["Affordable; safe; good nightlife in Prague."], cons: ["Dating: add your input."] },
  hungary: { pros: ["Affordable; Budapest nightlife; safe."], cons: ["Dating: add your input."] },
  croatia: { pros: ["Coast; Schengen; relatively affordable."], cons: ["Dating: add your input."] },
  serbia: { pros: ["Affordable; Belgrade nightlife; visa-free for many."], cons: ["Dating: add your input."] },
  bulgaria: { pros: ["Very affordable; Black Sea; EU."], cons: ["Dating: add your input."] },
  slovakia: { pros: ["Affordable; safe; nature."], cons: ["Dating: add your input."] },
  lithuania: { pros: ["Affordable; safe; EU."], cons: ["Dating: add your input."] },
  latvia: { pros: ["Affordable; Riga; EU."], cons: ["Dating: add your input."] },
  estonia: { pros: ["Digital nomad friendly; safe; EU."], cons: ["Dating: add your input."] },
  slovenia: { pros: ["Very safe; nature; small and tidy."], cons: ["Dating: add your input."] },
  luxembourg: { pros: ["Very safe; multilingual; high income."], cons: ["Very expensive; dating: add your input."] },
  malta: { pros: ["English official; Schengen; sun and sea."], cons: ["Small; dating: add your input."] },
  cyprus: { pros: ["English widely used; EU; beaches."], cons: ["Dating: add your input."] },
  iceland: { pros: ["Very safe; nature; English spoken."], cons: ["Very expensive; small population; dating: add your input."] },
  montenegro: { pros: ["Coast; affordable; euro used."], cons: ["Dating: add your input."] },
  "north-macedonia": { pros: ["Affordable; visa-free for many."], cons: ["Dating: add your input."] },
  albania: { pros: ["Affordable; coast; visa-free for many."], cons: ["Dating: add your input."] },
  "bosnia-and-herzegovina": { pros: ["Affordable; nature; visa-free for many."], cons: ["Dating: add your input."] },
  moldova: { pros: ["Very affordable; visa-free for EU."], cons: ["Dating: add your input."] },
};

/** Get pros list: prefer our intel, merge DB string as first item if provided. */
export function getPros(slug: string, dbPros: string): string[] {
  const intel = COMMUNITY_INTEL[slug];
  const fromIntel = intel?.pros ?? [];
  const fromDb = splitFallback(dbPros);
  if (fromDb.length && !fromIntel.length) return fromDb;
  const combined = fromDb.length ? [...fromDb, ...fromIntel.filter((p) => !fromDb.includes(p))] : fromIntel;
  return combined.length ? combined : ["No community pros listed yet. Check Reddit r/passportbros for more."];
}

/** Get cons list: prefer our intel, merge DB string as first item if provided. */
export function getCons(slug: string, dbCons: string): string[] {
  const intel = COMMUNITY_INTEL[slug];
  const fromIntel = intel?.cons ?? [];
  const fromDb = splitFallback(dbCons);
  if (fromDb.length && !fromIntel.length) return fromDb;
  const combined = fromDb.length ? [...fromDb, ...fromIntel.filter((c) => !fromDb.includes(c))] : fromIntel;
  return combined.length ? combined : ["No community cons listed yet. Check Reddit r/passportbros for more."];
}
