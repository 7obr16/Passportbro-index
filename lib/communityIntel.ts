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

/** Placeholder text from DB to strip so we never show "add your input" etc. */
const PLACEHOLDER_PHRASES = [
  "add your input",
  "dating: add your input",
  "Add your input",
  "Dating: add your input",
  "no data",
  "No data",
  "tbd",
  "TBD",
  "coming soon",
  "Community data currently being expanded",
  "community data currently being expanded",
  "data being expanded",
  "being expanded",
  "coming soon",
  "placeholder",
];

function isPlaceholder(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return PLACEHOLDER_PHRASES.some((p) => lower.includes(p.toLowerCase()) || lower === p.toLowerCase());
}

function filterPlaceholders(items: string[]): string[] {
  return items.filter((item) => !isPlaceholder(item));
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
  // European and neighboring countries — pros/cons from passport bro forum perspective
  portugal: {
    pros: ["Safe; Schengen; good infrastructure and beaches; Lisbon and Porto popular with nomads.", "Relatively affordable for Western Europe; good weather."],
    cons: ["Dating culture is Western; women independent and less traditional than in Latin or Asian hubs.", "Smaller passport bro scene; less community intel than Medellín or Bangkok."],
  },
  netherlands: {
    pros: ["Very safe; excellent English; strong infrastructure; Amsterdam has nightlife and expats."],
    cons: ["Expensive; Dutch dating norms are progressive and competitive; not a typical passport bro destination.", "Women generally independent; less interest in foreign men as a category."],
  },
  belgium: {
    pros: ["Central EU; multilingual; safe; Brussels has international crowd."],
    cons: ["Dating scene is Western European; reserved; not a go-to for passport bros.", "Split culture (Flemish/French) can make socializing niche."],
  },
  austria: {
    pros: ["Very safe; Alps; high quality of life; Vienna is clean and cultured."],
    cons: ["Expensive; dating culture formal and reserved; women less approachable than in Southern Europe or Asia.", "German-speaking; English only gets you so far socially."],
  },
  switzerland: {
    pros: ["Very safe; nature; high quality of life; good for hiking and skiing."],
    cons: ["Very expensive; Swiss are private and dating is slow; not a dating-focused destination.", "Small; tight-knit; hard to break into local circles."],
  },
  norway: {
    pros: ["Very safe; nature; English widely spoken; high standard of living."],
    cons: ["Very expensive; Nordic dating culture is egalitarian and reserved; women not seeking foreign men.", "Long dark winters; small population in cities."],
  },
  denmark: {
    pros: ["Very safe; English widely spoken; bike-friendly; Copenhagen has expats and nightlife."],
    cons: ["Expensive; Danish women independent and direct; dating is Western-style and competitive.", "Not a classic passport bro destination; fewer shared trip reports."],
  },
  finland: {
    pros: ["Very safe; nature; good English; Helsinki is orderly and tech-friendly."],
    cons: ["Reserved culture; Finns are famously introverted; dating and making friends take time.", "Expensive; cold and dark in winter; small dating pool."],
  },
  ireland: {
    pros: ["Very safe; English; friendly pub culture; Dublin has young population and tech scene."],
    cons: ["Expensive; dating is Western; women not looking for foreigners specifically.", "Weather can be grim; housing in Dublin is costly."],
  },
  greece: {
    pros: ["Schengen; beaches; history; affordable by EU standards; islands and Athens both popular."],
    cons: ["Dating is Mediterranean but more traditional; Greek women often family-focused and less open to short-term.", "Economy and bureaucracy can be frustrating; English outside tourism is limited."],
  },
  "czech-republic": {
    pros: ["Affordable; safe; good nightlife in Prague; Central European vibe; many tourists and expats."],
    cons: ["Czech women can be reserved with foreigners; some see Western men as tourists only.", "Prague can feel tourist-saturated; smaller cities have smaller dating pools."],
  },
  hungary: {
    pros: ["Affordable; Budapest nightlife is famous; thermal baths; safe; visa-free for many."],
    cons: ["Hungarian women often traditional; language barrier outside Budapest; dating can feel transactional in tourist areas.", "Less passport bro coverage than Prague or Poland."],
  },
  croatia: {
    pros: ["Coast; Schengen; relatively affordable; Dubrovnik and Split popular; good weather."],
    cons: ["Dating is Mediterranean but small pool; many women in coastal towns used to tourists.", "Peak season crowded and pricier; off-season quieter and fewer options."],
  },
  serbia: {
    pros: ["Affordable; Belgrade nightlife is strong; visa-free for many; friendly locals; good food."],
    cons: ["Dating culture is mixed; some women open to foreigners, others traditional; Serbian language helps a lot.", "Infrastructure and bureaucracy less smooth than EU; safety fine in main cities."],
  },
  bulgaria: {
    pros: ["Very affordable; Black Sea; EU; Sofia and coast have expat presence; low cost of living."],
    cons: ["Smaller dating scene; Bulgarian women can be reserved; less English outside Sofia.", "Not a major passport bro hub; fewer trip reports and community intel."],
  },
  slovakia: {
    pros: ["Affordable; safe; nature; Bratislava close to Vienna; EU."],
    cons: ["Small country; dating pool limited; Slovak women often traditional; less English than Czech Republic.", "Not a typical passport bro destination; little forum discussion."],
  },
  lithuania: {
    pros: ["Affordable; safe; EU; Vilnius has bars and digital nomads; Baltic vibe."],
    cons: ["Lithuanian women can be cold initially; small population; dating is European/Western.", "Cold winters; less coverage in passport bro communities."],
  },
  latvia: {
    pros: ["Affordable; Riga has nightlife and old town; EU; visa-free for many."],
    cons: ["Small population; Latvian women reserved; dating culture not geared to foreign men.", "Riga can feel small; limited long-term trip reports."],
  },
  estonia: {
    pros: ["Digital nomad friendly; safe; EU; Tallinn is techy and English-speaking; e-residency."],
    cons: ["Estonians are reserved; dating is Nordic-style and slow; very small population.", "Cold and dark in winter; not a dating-focused destination."],
  },
  slovenia: {
    pros: ["Very safe; nature; small and tidy; Ljubljana is charming; Schengen; good for outdoor types."],
    cons: ["Tiny country; small dating pool; Slovenes reserved; not a passport bro hotspot.", "Few trip reports; English okay in capital only."],
  },
  luxembourg: {
    pros: ["Very safe; multilingual; high income; central in Europe; good for finance and EU workers."],
    cons: ["Very expensive; tiny population; dating pool is small and international rather than local.", "Not a dating destination; more for career and stability."],
  },
  malta: {
    pros: ["English official; Schengen; sun and sea; small and easy; low tax options for nomads."],
    cons: ["Small island; dating pool limited; many expats and tourists; locals can be insular.", "Summer crowded and hot; not a major passport bro destination."],
  },
  cyprus: {
    pros: ["English widely used; EU; beaches; good weather; Paphos and Limassol have expats."],
    cons: ["Split island (Greek/Turkish); dating is Mediterranean but small pool; can feel transient.", "Less community intel than Spain or Greece for dating."],
  },
  montenegro: {
    pros: ["Coast; affordable; euro used; Budva and Kotor popular; visa-free for many; scenic."],
    cons: ["Small country; dating pool limited; seasonal tourism; Montenegrin women often traditional.", "Less passport bro coverage; good for nature and cost, not primarily for dating."],
  },
  "north-macedonia": {
    pros: ["Affordable; visa-free for many; Ohrid and Skopje; emerging nomad spot."],
    cons: ["Small; conservative in places; Macedonian women reserved; limited English and dating scene.", "Few trip reports; infrastructure and bureaucracy less polished."],
  },
  albania: {
    pros: ["Affordable; coast; visa-free for many; Tirana and coast getting more popular; raw and cheap."],
    cons: ["Albanian women often very traditional; conservative in rural areas; small expat dating pool.", "Infrastructure and driving chaotic; less English than Balkans hotspots."],
  },
  "bosnia-and-herzegovina": {
    pros: ["Affordable; nature; visa-free for many; Sarajevo and Mostar unique; low cost."],
    cons: ["Conservative and divided society; dating scene small; Bosnian women often traditional.", "Less tourism and expat scene; limited passport bro intel."],
  },
  moldova: {
    pros: ["Very affordable; visa-free for EU; Chișinău has bars; low cost of living."],
    cons: ["Poor infrastructure; many young women leave for EU; dating pool affected by emigration.", "Corruption and weak economy; not a mainstream passport bro destination."],
  },

  // ── East Asia ──
  taiwan: {
    pros: [
      "Taipei is top-tier for East Asia: women are warmer and more direct than in Japan.",
      "Very safe; one of the safest countries in Asia for foreigners.",
      "Excellent food scene; night markets, street food, restaurants everywhere.",
      "Good English in Taipei; younger generation often English-capable.",
      "Modern infrastructure; high-speed rail; clean cities.",
      "Women are well-educated, open-minded, and curious about foreigners.",
      "Night markets and café culture make casual meetups easy.",
      "Visa-free for many nationalities for 90 days; gold card visa for longer stays.",
    ],
    cons: [
      "Dating can still be conservative compared to Southeast Asia; moving slower expected.",
      "Language helps a lot outside Taipei.",
      "Smaller country; dating pool limited compared to Japan or South Korea.",
      "Political situation with China creates background uncertainty.",
    ],
  },
  "hong-kong": {
    pros: [
      "World-class city; great nightlife, dining, and finance scene.",
      "English is widely spoken; easy to navigate.",
      "Cosmopolitan dating pool; many expats and international professionals.",
      "Excellent transport and infrastructure.",
    ],
    cons: [
      "Extremely expensive; one of the priciest cities in the world.",
      "Political changes post-2020 affect expat sentiment.",
      "Competitive dating; women independent and career-focused.",
      "Small territory; limited variety outside the city.",
    ],
  },
  "north-korea": {
    pros: [],
    cons: [
      "Closed to nearly all foreign visitors; no independent travel possible.",
      "Not a viable destination for passport bros or anyone.",
    ],
  },
  macau: {
    pros: [
      "Easy day-trip from Hong Kong; casino and entertainment hub.",
      "Visa-free for many; Portuguese colonial architecture unique.",
    ],
    cons: [
      "Very small; not a long-term destination.",
      "Expensive; tourism-focused economy; limited authentic local scene.",
    ],
  },

  // ── Southeast Asia ──
  laos: {
    pros: [
      "Very affordable; Vientiane and Vang Vieng popular with budget travelers.",
      "Relaxed and friendly culture; low-key vibe.",
      "Easy visa on arrival; good for slow travel.",
      "Luang Prabang is a UNESCO gem; great for nature lovers.",
    ],
    cons: [
      "Small population; limited dating scene compared to Thailand or Vietnam.",
      "English is limited; Lao language helps.",
      "Infrastructure basic; internet can be slow outside cities.",
      "Less of a passport bro hub; few community trip reports.",
    ],
  },
  myanmar: {
    pros: [
      "Beautiful culture and temples; Bagan, Yangon, Inle Lake all unique.",
      "Very affordable when accessible.",
      "Women generally friendly and curious about foreigners historically.",
    ],
    cons: [
      "Military coup since 2021; travel not recommended; safety concerns.",
      "Infrastructure and internet disrupted; banking complicated.",
      "Not a viable passport bro destination currently.",
    ],
  },
  "timor-leste": {
    pros: [
      "Untouched; one of Southeast Asia's most unexplored countries.",
      "Cheap and authentic; Portuguese and Tetum culture.",
    ],
    cons: [
      "Very limited infrastructure; poor internet and healthcare.",
      "Tiny expat scene; not a dating or nomad destination.",
      "Visa process and travel logistics can be complicated.",
    ],
  },

  // ── South Asia ──
  "sri-lanka": {
    pros: [
      "Beautiful island; beaches, mountains, temples — huge variety.",
      "Affordable; $1k–1.5k/month possible with care.",
      "English widely spoken due to British heritage.",
      "Colombo has a growing expat and digital nomad scene.",
      "Visa on arrival or ETA; easy entry for most.",
    ],
    cons: [
      "Conservative culture; public dating norms matter.",
      "Economic instability and political uncertainty in recent years.",
      "Smaller passport bro community; fewer trip reports.",
      "Infrastructure outside Colombo can be basic.",
    ],
  },
  nepal: {
    pros: [
      "Kathmandu is vibrant; trekking culture brings internationals together.",
      "Very affordable; great for long-term budget living.",
      "Friendly and curious locals; English in tourist areas.",
      "Spiritual and nature experiences unique globally.",
    ],
    cons: [
      "Conservative in many areas; dating culture traditional.",
      "Infrastructure basic; power cuts still occur.",
      "Thin air at altitude; not for everyone.",
      "Smaller nomad dating scene outside Kathmandu.",
    ],
  },
  bangladesh: {
    pros: [
      "Dhaka is a huge, buzzing city; very affordable.",
      "English common in professional circles.",
    ],
    cons: [
      "Conservative Muslim country; dating scene very limited.",
      "Traffic and pollution in Dhaka extreme.",
      "Not a typical passport bro destination; little forum coverage.",
    ],
  },
  bhutan: {
    pros: [
      "Unique Himalayan kingdom; stunning nature and Buddhist culture.",
      "Safe and peaceful.",
    ],
    cons: [
      "High daily tourist fee ($200/day) limits budget stays.",
      "Very conservative; no real dating scene.",
      "Not a passport bro destination; more for spiritual travel.",
    ],
  },
  afghanistan: {
    pros: [],
    cons: [
      "Active conflict and Taliban rule; no-go for virtually all foreign travel.",
      "Not a viable destination under any circumstances.",
    ],
  },

  // ── Central Asia ──
  uzbekistan: {
    pros: [
      "Samarkand and Bukhara are stunning; rich Silk Road history.",
      "Very affordable; visa-free or on arrival for many.",
      "Women curious about foreigners in cities; traditional yet warming.",
    ],
    cons: [
      "Conservative Muslim culture; dating and nightlife limited.",
      "Language (Uzbek/Russian) barrier; English rare outside tourist spots.",
      "Infrastructure improving but still developing.",
    ],
  },
  kyrgyzstan: {
    pros: [
      "Bishkek is affordable and surprisingly lively; visa-free for many.",
      "Outdoor and adventure capital of Central Asia.",
      "Women in cities are more open than regional neighbors.",
    ],
    cons: [
      "Small country; dating pool limited.",
      "Russian useful; English limited.",
      "Conservative in rural areas; not a typical nomad hub.",
    ],
  },
  tajikistan: {
    pros: [
      "Pamir Highway is one of the world's great adventures.",
      "Very affordable; visa-on-arrival options.",
    ],
    cons: [
      "Conservative; limited dating scene.",
      "Infrastructure very basic; internet limited.",
      "Not a passport bro destination; niche adventure only.",
    ],
  },
  turkmenistan: {
    pros: [
      "Darvaza gas crater ('Door to Hell') is a unique spectacle.",
    ],
    cons: [
      "Highly authoritarian state; tourist visa very hard to get.",
      "No real expat or dating scene.",
      "Not viable for passport bros.",
    ],
  },
  azerbaijan: {
    pros: [
      "Baku is modern and well-developed; oil money visible.",
      "Visa-on-arrival or e-visa; visa-free for some.",
      "Mix of European and Eastern culture; good food.",
    ],
    cons: [
      "Women can be conservative and family-guarded.",
      "Dating apps exist but culture is cautious.",
      "Conflict with Armenia creates regional instability.",
    ],
  },
  armenia: {
    pros: [
      "Yerevan is affordable, growing; strong café and arts scene.",
      "English increasingly spoken; EU alignment growing.",
      "Women are well-educated and often beautiful; curious about foreigners.",
    ],
    cons: [
      "Conservative culture; families are protective.",
      "Small country; dating pool limited.",
      "Ongoing tension with Azerbaijan affects stability.",
    ],
  },
  georgia: {
    pros: [
      "Tbilisi is an underrated gem; great nightlife, wine, and food.",
      "Visa-free for most; 365-day visa-free for many nationalities.",
      "Affordable: $1k–1.5k/month comfortable in Tbilisi.",
      "Women are beautiful, educated, and open in the city.",
      "Strong digital nomad growth post-2022; great café culture.",
      "Unique culture; ancient churches, Caucasus mountains nearby.",
    ],
    cons: [
      "Traditional family values; meeting women outside apps or venues harder.",
      "Russian influence and language common; English improving but limited.",
      "Tbilisi gets crowded; regional tensions with Russia.",
    ],
  },

  // ── Middle East ──
  "united-arab-emirates": {
    pros: [
      "Dubai is glamorous; world-class nightlife and events.",
      "Safe; modern infrastructure; English everywhere.",
      "International crowd; many single expats from all over the world.",
      "Tax-free income; great for working and saving.",
    ],
    cons: [
      "Very expensive; one of the priciest places to live.",
      "Local women off-limits; dating pool is expat only.",
      "Conservative laws still apply; be discreet.",
      "Soulless if you're on a budget; transient expat culture.",
    ],
  },
  jordan: {
    pros: [
      "Amman is relatively modern and safe for the region.",
      "English common; visa-on-arrival for many.",
      "Petra and Wadi Rum; world-class sights.",
    ],
    cons: [
      "Conservative culture; dating as a foreigner is limited.",
      "Limited nightlife outside hotel bars in Amman.",
      "Not a dating destination; more cultural tourism.",
    ],
  },
  oman: {
    pros: [
      "Very safe; one of the most stable Arab countries.",
      "Muscat is clean and well-run; great for nature trips.",
      "Visa-on-arrival or e-visa for many.",
    ],
    cons: [
      "Strict conservative culture; no real dating scene.",
      "Expensive by regional standards.",
      "Not a passport bro destination.",
    ],
  },
  kuwait: {
    pros: [
      "Very safe; high income for those working there.",
      "English common in professional settings.",
    ],
    cons: [
      "Very conservative; no nightlife; alcohol illegal.",
      "Expat dating exists but restricted; local women not accessible.",
      "Expensive; insular society.",
    ],
  },
  bahrain: {
    pros: [
      "Most liberal Gulf state; nightlife and alcohol allowed.",
      "Easy visa; expat-friendly; smaller and more relaxed than Dubai.",
      "Weekends draw Saudi visitors; active social scene on weekends.",
    ],
    cons: [
      "Small island; limited long-term options.",
      "Expensive; expat-heavy social bubble.",
      "Dating is expat-to-expat mostly; local women not available.",
    ],
  },
  qatar: {
    pros: [
      "Doha is modern and safe; world-class events (World Cup legacy).",
      "High income potential for workers; English common.",
    ],
    cons: [
      "Very expensive; conservative laws still apply.",
      "Local dating off-limits; expat bubble.",
      "Not a typical passport bro destination.",
    ],
  },
  iraq: {
    pros: [
      "Kurdistan region (Erbil) is surprisingly safe and developing.",
    ],
    cons: [
      "Most of country not recommended; active security concerns.",
      "Conservative; strict cultural rules.",
      "Not a passport bro destination; high risk.",
    ],
  },
  yemen: {
    pros: [],
    cons: [
      "Active civil war; no travel recommended.",
      "Not a viable destination.",
    ],
  },
  syria: {
    pros: [
      "Post-conflict reconstruction beginning; Damascus slowly reopening.",
    ],
    cons: [
      "Still unstable in many regions; travel not recommended for most.",
      "Infrastructure destroyed in many areas.",
    ],
  },
  palestine: {
    pros: [
      "Ramallah has a small but vibrant café and social scene.",
    ],
    cons: [
      "Active conflict; travel highly uncertain and dangerous.",
      "Not a viable destination currently.",
    ],
  },
  israel: {
    pros: [
      "Tel Aviv has excellent nightlife; one of the Middle East's most liberal cities.",
      "English widely spoken; modern infrastructure.",
      "Tech scene and beach city lifestyle attract internationals.",
    ],
    cons: [
      "Expensive; security situation affects travel freely.",
      "Entry can be complicated for some nationalities.",
      "Regional conflict creates ongoing instability.",
    ],
  },
  lebanon: {
    pros: [
      "Beirut had the best nightlife in the Middle East; women fashion-conscious and open.",
      "Arabic and French culture mix; cosmopolitan before economic collapse.",
    ],
    cons: [
      "Severe economic and political crisis since 2019; banking collapsed.",
      "Infrastructure unreliable; electricity and internet cut regularly.",
      "Active security risks; not recommended currently.",
    ],
  },

  // ── Africa ──
  ghana: {
    pros: [
      "Accra is a growing hub; English official language; stable democracy.",
      "Warm and welcoming culture; West African music and food great.",
      "Visa-free or on-arrival for many; popular with the diaspora.",
      "Women generally friendly and family-oriented.",
    ],
    cons: [
      "Scams targeting foreigners common; 'sakawa' and romance fraud known.",
      "Infrastructure and healthcare inconsistent outside Accra.",
      "Dating expectations can be transactional; financial gifts expected by some.",
    ],
  },
  senegal: {
    pros: [
      "Dakar is one of West Africa's best cities; French and Wolof culture.",
      "Relatively safe; stable politically.",
      "Beaches, music, and nightlife in Dakar.",
    ],
    cons: [
      "French essential; English limited.",
      "Conservative Muslim values in many areas.",
      "Infrastructure developing; logistics can be tough.",
    ],
  },
  "ivory-coast": {
    pros: [
      "Abidjan is the economic powerhouse of West Africa; vibrant and modern.",
      "Nightlife active; women open in urban areas.",
    ],
    cons: [
      "Safety in some areas; political history of instability.",
      "French needed; English rare.",
    ],
  },
  mali: {
    pros: [
      "Bamako is culturally rich; world-class music scene.",
    ],
    cons: [
      "Security concerns; active jihadist threat in the north.",
      "Not recommended for general travel; limited passport bro scene.",
    ],
  },
  niger: {
    pros: [
      "Niamey; Saharan culture and gateway to the desert.",
    ],
    cons: [
      "Security concerns; recent coup; not recommended.",
      "Very limited infrastructure; not a nomad destination.",
    ],
  },
  "burkina-faso": {
    pros: [],
    cons: [
      "Active jihadist insurgency; travel not recommended.",
      "Not a viable destination currently.",
    ],
  },
  togo: {
    pros: [
      "Lomé has a beach and a lively vibe; visa-on-arrival for many.",
      "French culture; affordable.",
    ],
    cons: [
      "Small and underdeveloped; limited dating and nomad scene.",
      "French needed; English limited.",
    ],
  },
  benin: {
    pros: [
      "Cotonou; West African culture; vodou heritage and beaches.",
      "Visa-on-arrival for many.",
    ],
    cons: [
      "Very small expat dating scene.",
      "French needed; infrastructure basic.",
    ],
  },
  cameroon: {
    pros: [
      "Douala and Yaoundé; dual French/English due to colonial split.",
      "Diverse culture; great food.",
    ],
    cons: [
      "Safety concerns especially in Anglophone regions.",
      "Corruption; infrastructure variable.",
      "Not a typical passport bro hub.",
    ],
  },
  angola: {
    pros: [
      "Luanda booming with oil money; expat scene exists.",
      "Portuguese-speaking; Africa's largest Lusophone country.",
    ],
    cons: [
      "One of the world's most expensive cities for expats.",
      "Safety varies; corruption high.",
      "Visa difficult to obtain.",
    ],
  },
  mozambique: {
    pros: [
      "Maputo is affordable; Portuguese culture meets African beaches.",
      "Diving and beaches near Tofo outstanding.",
    ],
    cons: [
      "Security concerns in northern regions.",
      "Portuguese needed; English limited.",
      "Infrastructure basic; healthcare limited.",
    ],
  },
  zimbabwe: {
    pros: [
      "Victoria Falls is world-class; English spoken.",
      "Harare has a surprisingly developed middle class and nightlife.",
    ],
    cons: [
      "Economic instability; currency issues.",
      "Infrastructure deteriorated; power cuts common.",
      "Smaller passport bro scene.",
    ],
  },
  zambia: {
    pros: [
      "Lusaka; English official; Victoria Falls accessible.",
      "Friendly people; relatively stable.",
    ],
    cons: [
      "Smaller nomad scene; limited nightlife.",
      "Infrastructure developing; healthcare limited.",
    ],
  },
  malawi: {
    pros: [
      "Lake Malawi is stunning; peaceful and affordable.",
      "English official; very friendly people ('The Warm Heart of Africa').",
    ],
    cons: [
      "One of the world's poorest countries; limited infrastructure.",
      "Very small expat and dating scene.",
    ],
  },
  "dr-congo": {
    pros: [
      "Kinshasa is huge; music capital of Africa (rumba).",
      "French-speaking; vibrant culture.",
    ],
    cons: [
      "Safety concerns significant; eastern regions in conflict.",
      "Infrastructure very poor; not recommended for inexperienced travelers.",
    ],
  },
  "republic-of-the-congo": {
    pros: [
      "Brazzaville; French culture; across the river from Kinshasa.",
    ],
    cons: [
      "Limited infrastructure; small expat scene.",
      "French needed; not a typical destination.",
    ],
  },
  "central-african-republic": {
    pros: [],
    cons: [
      "One of the world's most dangerous countries; travel not recommended.",
      "No viable passport bro or nomad scene.",
    ],
  },
  chad: {
    pros: [],
    cons: [
      "Extreme heat; ongoing security concerns; limited infrastructure.",
      "Not a viable travel destination.",
    ],
  },
  "equatorial-guinea": {
    pros: [
      "Spanish-speaking; oil wealth means relative infrastructure.",
    ],
    cons: [
      "Authoritarian; expensive; visa difficult.",
      "Very small expat scene.",
    ],
  },
  gabon: {
    pros: [
      "Libreville; oil wealth; relatively stable; good infrastructure for region.",
    ],
    cons: [
      "Expensive; French needed; very small passport bro scene.",
    ],
  },
  eritrea: {
    pros: [
      "Asmara; unique Italian colonial architecture; safe for tourists.",
    ],
    cons: [
      "Authoritarian state; visa very hard to obtain.",
      "Not a viable travel or dating destination.",
    ],
  },
  djibouti: {
    pros: [
      "Strategic location; diving in the Gulf of Aden; whale sharks.",
    ],
    cons: [
      "Extremely expensive; tiny; very hot.",
      "Limited dating scene; conservative.",
    ],
  },
  somalia: {
    pros: [
      "Somaliland (north) is safer and emerging slowly.",
    ],
    cons: [
      "Active conflict in most regions; not recommended.",
      "No viable passport bro destination.",
    ],
  },
  "south-sudan": {
    pros: [],
    cons: [
      "Active conflict; one of the world's most dangerous countries.",
      "Not a viable destination.",
    ],
  },
  sudan: {
    pros: [],
    cons: [
      "Active civil war since 2023; not recommended for travel.",
    ],
  },
  burundi: {
    pros: [
      "Bujumbura on Lake Tanganyika; beautiful scenery.",
    ],
    cons: [
      "Safety concerns; political instability.",
      "Very underdeveloped; not a nomad or dating destination.",
    ],
  },
  "guinea-bissau": {
    pros: [
      "Visa-on-arrival; low cost.",
    ],
    cons: [
      "Very underdeveloped; political instability; limited infrastructure.",
      "Portuguese needed; no real passport bro scene.",
    ],
  },
  guinea: {
    pros: [
      "Conakry; French culture; mining wealth.",
    ],
    cons: [
      "Safety and political instability; French needed.",
      "Not a typical destination.",
    ],
  },
  "sierra-leone": {
    pros: [
      "Freetown; English official; beach scene growing.",
      "Friendly people; recovering from Ebola past.",
    ],
    cons: [
      "Infrastructure and healthcare limited.",
      "Safety and poverty concerns.",
    ],
  },
  liberia: {
    pros: [
      "English official; unique American-African heritage.",
    ],
    cons: [
      "Post-war recovery; infrastructure very limited.",
      "Safety concerns; not a nomad destination.",
    ],
  },
  mauritania: {
    pros: [
      "Saharan landscapes; unique culture.",
    ],
    cons: [
      "Conservative Islamic country; dating not viable.",
      "Very limited infrastructure; extreme heat.",
    ],
  },
  "sao-tome-and-principe": {
    pros: [
      "Beautiful islands; Portuguese culture; laid-back.",
    ],
    cons: [
      "Very small and isolated; expensive to reach.",
      "Tiny population; limited scene.",
    ],
  },
  "cape-verde": {
    pros: [
      "Beaches; Portuguese Creole culture; safe; good for island relaxation.",
      "Women are known for warmth and approachability.",
      "Regular flights from Europe; growing tourist scene.",
    ],
    cons: [
      "Small archipelago; limited beyond beach tourism.",
      "More expensive than mainland Africa.",
    ],
  },
  eswatini: {
    pros: [
      "Small; nature parks; culture unique for the region.",
    ],
    cons: [
      "Authoritarian monarchy; very small; limited scene.",
    ],
  },
  lesotho: {
    pros: [
      "Highland kingdom; unique culture; good for trekking.",
    ],
    cons: [
      "Very poor; landlocked within South Africa; limited options.",
      "Not a travel or dating destination.",
    ],
  },
  namibia: {
    pros: [
      "Windhoek is well-run; Namib Desert is world-class.",
      "English official; safe by African standards.",
      "Very small population; peaceful.",
    ],
    cons: [
      "Very sparse population; tiny dating scene.",
      "Expensive for Africa; limited nightlife.",
    ],
  },
  botswana: {
    pros: [
      "Very safe; stable democracy; Okavango Delta world-famous.",
      "English official; good infrastructure for region.",
    ],
    cons: [
      "Very small and expensive for Africa.",
      "Limited dating and nomad scene.",
    ],
  },

  // ── Oceania ──
  "new-zealand": {
    pros: [
      "Beautiful nature; safe; English-speaking; Queenstown and Auckland popular.",
      "Good work-holiday visa options for many.",
    ],
    cons: [
      "Very expensive; remote; dating is Western and competitive.",
      "Small population; high cost of living.",
    ],
  },
  fiji: {
    pros: [
      "World-famous beaches; resort culture; friendly locals.",
      "English-speaking; visa-free for many.",
    ],
    cons: [
      "Expensive as a tourist; outside resorts infrastructure is basic.",
      "Small population; not a dating destination; more couples/honeymoon.",
    ],
  },
  "papua-new-guinea": {
    pros: [
      "Unique tribal cultures; truly off-the-beaten-path.",
    ],
    cons: [
      "Very high crime and safety risks; not recommended for general travel.",
      "Infrastructure very limited; healthcare poor.",
    ],
  },
  "solomon-islands": {
    pros: [
      "World-class diving; WWII history; untouched.",
    ],
    cons: [
      "Very limited infrastructure; not a dating or nomad destination.",
      "Remote and expensive to reach.",
    ],
  },
  vanuatu: {
    pros: [
      "Volcano tourism (Tanna); visa-free for many; laid-back.",
    ],
    cons: [
      "Very small; expensive; limited scene beyond tourism.",
    ],
  },
  samoa: {
    pros: [
      "Beautiful islands; friendly people; English and Samoan spoken.",
    ],
    cons: [
      "Small population; conservative Christian culture.",
      "Limited nightlife and dating scene.",
    ],
  },
  tonga: {
    pros: [
      "Friendly; swimming with humpback whales unique.",
    ],
    cons: [
      "Very conservative Christian society.",
      "Small; expensive to reach; limited scene.",
    ],
  },
  micronesia: {
    pros: [
      "Diving world-class in Pohnpei and Chuuk lagoon.",
    ],
    cons: [
      "Very remote; tiny; no real dating or nomad scene.",
    ],
  },
  "french-polynesia": {
    pros: [
      "Bora Bora and Tahiti are dream destinations; French culture.",
      "Stunning overwater bungalows; couples/honeymoon tourism.",
    ],
    cons: [
      "Extremely expensive; one of the priciest places on earth.",
      "Not a dating destination; honeymoon territory.",
    ],
  },
  "new-caledonia": {
    pros: [
      "French territory; beautiful lagoons; unique blend of cultures.",
    ],
    cons: [
      "Expensive; limited passport bro scene.",
      "Political tensions between French and Kanak populations.",
    ],
  },

  // ── Latin America (additional) ──
  paraguay: {
    pros: [
      "One of South America's most affordable countries; low cost of living.",
      "Asunción has a growing expat scene; low taxes attract foreigners.",
      "Women are warm and family-oriented; generally traditional.",
      "Visa-free or easy for many; no income tax for foreign income.",
    ],
    cons: [
      "Small and landlocked; not a typical nomad hub.",
      "Less English spoken; Spanish essential.",
      "Less dating scene coverage than Colombia, Brazil, or Argentina.",
    ],
  },
  uruguay: {
    pros: [
      "Safest country in Latin America; good infrastructure.",
      "Montevideo is chill; Punta del Este is upscale beach resort.",
      "Progressive and open society; good quality of life.",
      "Visa-free for many; digital nomad visa available.",
    ],
    cons: [
      "More expensive than neighboring countries.",
      "Smaller dating scene; women independent and more Western-oriented.",
      "Less passport bro content; more for quality-of-life seekers.",
    ],
  },
  panama: {
    pros: [
      "Panama City is the most developed in Central America; great hub.",
      "Dollarized economy; easy banking and visas.",
      "Friendly Pensionado program for long stays.",
      "Good nightlife; women approachable; mix of Latin cultures.",
      "Gateway between North and South America.",
    ],
    cons: [
      "Panama City can feel expensive in tourist areas.",
      "Safety varies by district; do research.",
      "Spanish helps a lot; English limited outside the canal zone.",
    ],
  },
  guatemala: {
    pros: [
      "Antigua is stunning; colonial architecture and expat community.",
      "Very affordable; $800–1.2k/month possible.",
      "Lake Atitlán attracts spiritual travelers and nomads.",
      "Women generally traditional and family-oriented.",
    ],
    cons: [
      "Safety concerns; Guatemala City has high crime.",
      "Spanish needed; English limited outside tourist areas.",
      "Less passport bro coverage; more adventure/backpacker scene.",
    ],
  },
  cuba: {
    pros: [
      "Havana is iconic; music, rum, classic cars.",
      "Women are beautiful and often very forward with foreign men.",
      "Caribbean vibes; beaches and nightlife unique.",
    ],
    cons: [
      "Internet highly restricted; banking and ATMs problematic.",
      "Jinetero/jinetera culture; many locals target tourists financially.",
      "Currency situation confusing; double economy.",
      "Government restrictions limit free movement.",
    ],
  },
  jamaica: {
    pros: [
      "Beaches; reggae culture; Kingston has energy and nightlife.",
      "English official; no language barrier.",
      "Women often confident and direct.",
    ],
    cons: [
      "High crime; safety vigilance required at all times.",
      "Tourist vs. local divide; inflated prices.",
      "Romance scam culture exists in some areas.",
    ],
  },
  haiti: {
    pros: [
      "Unique culture; French and Creole heritage.",
    ],
    cons: [
      "Major safety crisis; gang violence widespread; not recommended.",
      "Infrastructure collapsed; healthcare limited.",
    ],
  },
  nicaragua: {
    pros: [
      "Very affordable; Granada and León charming colonial cities.",
      "Visa-free for many; laid-back vibe.",
      "Women can be warm and traditional.",
    ],
    cons: [
      "Political instability; authoritarian government since 2018.",
      "Safety in cities mixed; do research.",
      "Smaller nomad and passport bro scene.",
    ],
  },
  belize: {
    pros: [
      "English official; only English-speaking country in Central America.",
      "Stunning reefs; relaxed Caribbean coast.",
      "Visa-free for many; good for retirees and divers.",
    ],
    cons: [
      "Small population; very limited dating scene.",
      "Expensive by regional standards; crime in Belize City.",
      "Not a typical passport bro hub.",
    ],
  },
  honduras: {
    pros: [
      "Bay Islands (Roatán) are world-class diving and beaches.",
      "Very affordable on the mainland.",
    ],
    cons: [
      "High crime rate; one of the more dangerous in Central America.",
      "Tegucigalpa and San Pedro Sula have safety concerns.",
      "Limited expat and passport bro scene.",
    ],
  },
  "el-salvador": {
    pros: [
      "Bitcoin-friendly; growing startup and surf scene.",
      "Affordable; El Zonte ('Bitcoin Beach') popular with tech crowd.",
      "Women traditional and family-oriented.",
    ],
    cons: [
      "Safety improving but historically high crime.",
      "Small country; limited long-term scene.",
      "Spanish needed; English outside tourist areas limited.",
    ],
  },
  suriname: {
    pros: [
      "Dutch-speaking; unique mix of South American and Caribbean culture.",
      "Untouched Amazon; great for nature tourism.",
    ],
    cons: [
      "Very small; limited infrastructure and dating scene.",
      "Dutch or Sranan needed; English limited.",
    ],
  },
  guyana: {
    pros: [
      "English-speaking; Caribbean-South American culture.",
      "Oil boom attracting investment; Georgetown developing.",
    ],
    cons: [
      "Safety in Georgetown variable.",
      "Small expat and dating scene.",
    ],
  },

  // ── Additional European ──
  iceland: {
    pros: [
      "Safe; stunning nature; midnight sun and Northern Lights unique.",
      "English widely spoken; educated population.",
      "Reykjavik has a surprisingly good nightlife for its size.",
    ],
    cons: [
      "One of the most expensive countries in the world.",
      "Tiny population; dating pool very small.",
      "Nordic dating culture; women very independent; not seeking foreign men.",
    ],
  },
  belarus: {
    pros: [
      "Minsk; women often beautiful; affordable when accessible.",
      "Central European culture; Russian-speaking.",
    ],
    cons: [
      "Authoritarian government; Lukashenko regime; sanctions complicate travel.",
      "Visa situation complex for many; not recommended currently.",
      "Western men scrutinized by authorities.",
    ],
  },
  kosovo: {
    pros: [
      "Pristina; young population; visa-free for many; affordable.",
      "Pro-Western; English decent among young people.",
      "Growing café and bar scene; young demographics.",
    ],
    cons: [
      "Small; limited passport bro coverage.",
      "Not recognized by all countries; some visa complications.",
    ],
  },
  mauritius: {
    pros: [
      "Stunning island; beaches and resorts world-class.",
      "English and French official; safe and stable.",
      "Growing digital nomad and premium expat destination.",
      "Women educated and cosmopolitan in Port Louis.",
    ],
    cons: [
      "Expensive; resort economy means high prices.",
      "Small island; limited variety long-term.",
      "Dating pool small; mostly for couples or premium stays.",
    ],
  },
  singapore: {
    pros: [
      "World-class city; clean, safe, incredibly efficient.",
      "English the primary language; easy to navigate.",
      "Dating apps active; international crowd.",
      "Great food and nightlife; transit hub for SEA.",
    ],
    cons: [
      "Extremely expensive; one of Asia's priciest cities.",
      "Dating as a foreigner not particularly advantaged.",
      "Strict laws; fines for small infractions; little flexibility.",
      "Small country; limited variety.",
    ],
  },
};



/** Get pros list: forum intel first; DB merged only if real (no placeholders). */
export function getPros(slug: string, dbPros: string): string[] {
  const intel = COMMUNITY_INTEL[slug];
  const fromIntel = intel?.pros ?? [];
  const fromDb = filterPlaceholders(splitFallback(dbPros));
  if (fromDb.length && !fromIntel.length) return fromDb;
  const combined = fromDb.length ? [...fromDb, ...fromIntel.filter((p) => !fromDb.includes(p))] : fromIntel;
  return combined.length ? combined : ["No community pros listed yet. Check Reddit r/passportbros for more."];
}

/** Get cons list: forum intel first; DB merged only if real (no placeholders). */
export function getCons(slug: string, dbCons: string): string[] {
  const intel = COMMUNITY_INTEL[slug];
  const fromIntel = intel?.cons ?? [];
  const fromDb = filterPlaceholders(splitFallback(dbCons));
  if (fromDb.length && !fromIntel.length) return fromDb;
  const combined = fromDb.length ? [...fromDb, ...fromIntel.filter((c) => !fromDb.includes(c))] : fromIntel;
  return combined.length ? combined : ["No community cons listed yet. Check Reddit r/passportbros for more."];
}
