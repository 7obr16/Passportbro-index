/**
 * Fetches category-specific photos: nightlife = bars/clubs/night markets,
 * food = national dishes, city = landmarks/streets, beaches = iconic beaches.
 * ~5 photos per category, hyper-specific Unsplash queries.
 */

// Per-country: nightlife (bars/clubs/night markets), food (national dishes), city (landmarks), beaches (iconic spots)
const QUERIES = {
  "philippines": {
    nightlife: ["Manila night market", "Manila Poblacion bars", "Boracay bar", "Philippines nightclub", "Cebu nightlife"],
    food: ["Philippines adobo", "Philippines lechon", "Philippines street food", "Manila Filipino food", "Philippines halo-halo"],
    city: ["Manila Intramuros", "Manila Makati skyline", "Cebu city", "Manila jeepney", "Manila traffic"],
    beaches: ["Boracay beach", "Palawan El Nido", "Philippines island beach", "Boracay White Beach", "Palawan lagoons"],
  },
  "thailand": {
    nightlife: ["Bangkok Khao San Road night", "Bangkok rooftop bar", "Phuket nightlife", "Thailand night market", "Bangkok bar street"],
    food: ["Thai pad thai", "Thai street food", "Bangkok food market", "Thailand tom yum", "Thai mango sticky rice"],
    city: ["Bangkok Wat Arun", "Bangkok skyline", "Chiang Mai old city", "Bangkok tuk tuk", "Bangkok street"],
    beaches: ["Phuket beach", "Thailand Phi Phi Islands", "Krabi beach", "Thailand Full Moon Party", "Thailand island beach"],
  },
  "indonesia": {
    nightlife: ["Bali Seminyak nightlife", "Bali beach club", "Jakarta rooftop bar", "Bali night market", "Ubud night"],
    food: ["Indonesian nasi goreng", "Bali babi guling", "Indonesia satay", "Indonesia street food", "Bali warung food"],
    city: ["Bali Ubud rice terraces", "Jakarta skyline", "Bali Ubud", "Yogyakarta Borobudur", "Bali monkey forest"],
    beaches: ["Bali Kuta beach", "Bali Nusa Penida", "Indonesia Raja Ampat", "Bali Uluwatu", "Lombok beach"],
  },
  "malaysia": {
    nightlife: ["Kuala Lumpur rooftop bar", "Kuala Lumpur night market", "Malaysia nightlife", "Penang night market", "KL bar"],
    food: ["Malaysia nasi lemak", "Malaysia satay", "Penang char kway teow", "Malaysia street food", "Kuala Lumpur food"],
    city: ["Kuala Lumpur Petronas Towers", "Kuala Lumpur skyline", "Penang Georgetown", "Malaysia Batu Caves", "KL street"],
    beaches: ["Langkawi beach", "Malaysia Perhentian Islands", "Malaysia beach", "Langkawi island", "Malaysia coast"],
  },
  "vietnam": {
    nightlife: ["Ho Chi Minh City nightlife", "Hanoi night market", "Vietnam night street", "Saigon bar", "Hanoi bar street"],
    food: ["Vietnam pho", "Vietnamese banh mi", "Vietnam street food", "Vietnam spring rolls", "Hanoi food"],
    city: ["Ho Chi Minh City street", "Hanoi Old Quarter", "Vietnam motorbike traffic", "Halong Bay", "Hanoi street"],
    beaches: ["Vietnam Da Nang beach", "Nha Trang beach", "Vietnam Phu Quoc", "Vietnam coast", "Da Nang coastline"],
  },
  "cambodia": {
    nightlife: ["Phnom Penh nightlife", "Siem Reap Pub Street", "Cambodia night market", "Phnom Penh bar", "Siem Reap night"],
    food: ["Cambodia amok fish", "Cambodia street food", "Cambodian lok lak", "Phnom Penh food", "Cambodia food market"],
    city: ["Angkor Wat", "Phnom Penh Royal Palace", "Siem Reap temple", "Cambodia tuk tuk", "Phnom Penh street"],
    beaches: ["Cambodia Sihanoukville", "Cambodia Koh Rong", "Cambodia beach", "Koh Rong island", "Cambodia coast"],
  },
  "kenya": {
    nightlife: ["Nairobi nightlife", "Nairobi bar", "Kenya nightclub", "Nairobi rooftop", "Mombasa night"],
    food: ["Kenya nyama choma", "Kenyan street food", "Kenya ugali", "Nairobi food", "Kenya maasai food"],
    city: ["Nairobi skyline", "Nairobi city", "Kenya safari", "Nairobi street", "Mombasa old town"],
    beaches: ["Mombasa Diani Beach", "Kenya coast", "Malindi beach", "Kenya beach", "Watamu beach"],
  },
  "nigeria": {
    nightlife: ["Lagos nightlife", "Lagos club", "Nigeria nightclub", "Lagos bar", "Abuja night"],
    food: ["Nigerian jollof rice", "Nigeria street food", "Nigerian suya", "Lagos food", "Nigeria pounded yam"],
    city: ["Lagos city", "Lagos skyline", "Nigeria market", "Lagos street", "Abuja city"],
    beaches: ["Nigeria Lagos beach", "Lagos Bar Beach", "Nigeria coast", "Lekki beach", "Nigeria shoreline"],
  },
  "uganda": {
    nightlife: ["Kampala nightlife", "Kampala bar", "Uganda nightclub", "Kampala night", "Uganda bar"],
    food: ["Uganda matoke", "Ugandan street food", "Uganda Rolex", "Kampala food", "Uganda food"],
    city: ["Kampala city", "Uganda safari", "Kampala street", "Uganda gorilla", "Kampala market"],
    beaches: ["Uganda Lake Victoria", "Uganda Ssese Islands", "Lake Victoria beach", "Uganda lake", "Uganda nature"],
  },
  "rwanda": {
    nightlife: ["Kigali nightlife", "Kigali bar", "Rwanda nightclub", "Kigali rooftop", "Rwanda bar"],
    food: ["Rwanda brochettes", "Rwandan street food", "Rwanda food", "Kigali food", "Rwanda cuisine"],
    city: ["Kigali city", "Kigali skyline", "Rwanda gorilla", "Kigali street", "Rwanda market"],
    beaches: ["Rwanda Lake Kivu", "Rwanda lake", "Lake Kivu", "Rwanda nature", "Rwanda mountains"],
  },
  "tanzania": {
    nightlife: ["Dar es Salaam nightlife", "Zanzibar night", "Tanzania bar", "Dar bar", "Zanzibar rooftop"],
    food: ["Tanzanian ugali", "Tanzania street food", "Zanzibar food", "Tanzania nyama choma", "Zanzibar spice market"],
    city: ["Dar es Salaam city", "Zanzibar Stone Town", "Tanzania safari", "Zanzibar streets", "Dar skyline"],
    beaches: ["Zanzibar beach", "Zanzibar Nungwi", "Tanzania beach", "Zanzibar coast", "Pemba island"],
  },
  "ethiopia": {
    nightlife: ["Addis Ababa nightlife", "Addis bar", "Ethiopia nightclub", "Addis Ababa night", "Ethiopia bar"],
    food: ["Ethiopian injera", "Ethiopia coffee ceremony", "Ethiopian food", "Addis Ababa food", "Ethiopia street food"],
    city: ["Addis Ababa city", "Ethiopia Lalibela", "Addis Ababa street", "Ethiopia market", "Addis skyline"],
    beaches: ["Ethiopia Danakil", "Ethiopia Simien Mountains", "Ethiopia nature", "Ethiopia landscape", "Ethiopia highlands"],
  },
  "bolivia": {
    nightlife: ["La Paz nightlife", "Bolivia bar", "La Paz night", "Bolivia nightclub", "Santa Cruz nightlife"],
    food: ["Bolivian salteñas", "Bolivia street food", "Bolivia llajwa", "La Paz food", "Bolivia food market"],
    city: ["La Paz city", "Uyuni salt flats", "Bolivia Sucre", "La Paz street", "Bolivia market"],
    beaches: ["Bolivia Lake Titicaca", "Bolivia Uyuni", "Bolivia altiplano", "Lake Titicaca", "Bolivia Salar"],
  },
  "colombia": {
    nightlife: ["Medellín nightlife", "Bogotá Zona T bars", "Cartagena night", "Colombia salsa club", "Medellín bar"],
    food: ["Colombian arepas", "Colombia street food", "Colombian bandeja paisa", "Bogotá food", "Colombia empanadas"],
    city: ["Cartagena old town", "Medellín city", "Bogotá city", "Colombia Comuna 13", "Cartagena colorful"],
    beaches: ["Colombia Cartagena beach", "Colombia Tayrona", "Cartagena Caribbean", "Colombia San Andrés", "Colombia coast"],
  },
  "mexico": {
    nightlife: ["Mexico City Condesa nightlife", "Cancún nightclub", "Playa del Carmen bar", "Mexico bar street", "CDMX rooftop"],
    food: ["Mexican tacos", "Mexico street food tacos", "Mexican ceviche", "Mexico City food", "Mexican guacamole"],
    city: ["Mexico City Zócalo", "Cancún hotel zone", "Guadalajara centro", "Mexico City street", "Tulum ruins"],
    beaches: ["Cancún beach", "Playa del Carmen beach", "Tulum beach", "Mexico Caribbean coast", "Los Cabos beach"],
  },
  "peru": {
    nightlife: ["Lima Miraflores nightlife", "Cusco bar", "Peru nightlife", "Lima bar", "Cusco night"],
    food: ["Peruvian ceviche", "Peru lomo saltado", "Peruvian food", "Lima food", "Peru street food"],
    city: ["Machu Picchu", "Lima city", "Cusco Plaza", "Peru Lima", "Cusco streets"],
    beaches: ["Peru Mancora beach", "Lima Costa Verde", "Peru coast", "Peru beach", "Peru coastline"],
  },
  "venezuela": {
    nightlife: ["Caracas nightlife", "Venezuela bar", "Caracas night", "Venezuela nightclub", "Caracas rooftop"],
    food: ["Venezuelan arepas", "Venezuela street food", "Venezuela pabellón", "Caracas food", "Venezuela empanadas"],
    city: ["Caracas city", "Venezuela Angel Falls", "Caracas street", "Venezuela market", "Caracas skyline"],
    beaches: ["Venezuela Los Roques", "Venezuela Margarita Island", "Venezuela Caribbean beach", "Venezuela coast", "Los Roques"],
  },
  "dominican-republic": {
    nightlife: ["Punta Cana nightlife", "Santo Domingo night", "Dominican bar", "Punta Cana club", "Dominican nightclub"],
    food: ["Dominican mofongo", "Dominican Republic food", "Dominican sancocho", "Santo Domingo food", "Dominican street food"],
    city: ["Santo Domingo Zona Colonial", "Punta Cana resort", "Dominican Republic city", "Santo Domingo street", "Dominican capital"],
    beaches: ["Punta Cana beach", "Dominican Republic beach", "Bávaro beach", "Dominican Caribbean", "Punta Cana coast"],
  },
  "costa-rica": {
    nightlife: ["San José nightlife", "Costa Rica bar", "Tamarindo night", "San José bar", "Costa Rica nightlife"],
    food: ["Costa Rica gallo pinto", "Costa Rican food", "Costa Rica casado", "Costa Rica street food", "Costa Rica coffee"],
    city: ["San José Costa Rica", "Costa Rica cloud forest", "Costa Rica volcano", "San José city", "Costa Rica jungle"],
    beaches: ["Costa Rica Tamarindo", "Manuel Antonio beach", "Costa Rica beach", "Costa Rica coast", "Costa Rica surf"],
  },
  "india": {
    nightlife: ["Mumbai nightlife", "Goa club", "India rooftop bar", "Mumbai bar", "Goa night"],
    food: ["Indian curry", "India street food", "Indian biryani", "India chaat", "Indian thali"],
    city: ["Taj Mahal", "Mumbai Gateway", "Jaipur Hawa Mahal", "India Delhi", "Mumbai street"],
    beaches: ["Goa beach", "India Kerala beach", "Goa Palolem", "India coastline", "Goa coast"],
  },
  "pakistan": {
    nightlife: ["Lahore food street night", "Pakistan cafe", "Karachi night", "Lahore night", "Pakistan restaurant"],
    food: ["Pakistani biryani", "Pakistan street food", "Pakistani karahi", "Lahore food", "Pakistan naan"],
    city: ["Lahore Badshahi Mosque", "Pakistan Lahore", "Karachi city", "Pakistan Islamabad", "Lahore fort"],
    beaches: ["Pakistan Karachi beach", "Pakistan Gwadar", "Karachi coast", "Pakistan coast", "Pakistan beach"],
  },
  "morocco": {
    nightlife: ["Marrakech night market", "Morocco rooftop bar", "Marrakech Djemaa el Fna night", "Morocco bar", "Casablanca night"],
    food: ["Moroccan tagine", "Morocco street food", "Moroccan couscous", "Marrakech food", "Morocco mint tea"],
    city: ["Marrakech medina", "Morocco Chefchaouen", "Fez medina", "Marrakech square", "Morocco souk"],
    beaches: ["Morocco Essaouira beach", "Morocco Agadir", "Morocco coast", "Tangier beach", "Morocco beach"],
  },
  "brazil": {
    nightlife: ["Rio de Janeiro Lapa", "São Paulo nightlife", "Brazil samba club", "Rio bar", "Brazil beach party"],
    food: ["Brazilian feijoada", "Brazil street food", "Brazilian churrasco", "Rio food", "Brazil açaí"],
    city: ["Rio de Janeiro Christ Redeemer", "São Paulo skyline", "Rio Copacabana", "Brazil favela", "Rio street"],
    beaches: ["Rio Copacabana beach", "Brazil Ipanema", "Rio beach", "Brazil Florianópolis", "Brazil coast"],
  },
  "argentina": {
    nightlife: ["Buenos Aires nightlife", "Buenos Aires tango", "Argentina bar", "Buenos Aires bar", "Argentina club"],
    food: ["Argentine asado", "Argentina steak", "Argentine empanadas", "Buenos Aires food", "Argentina mate"],
    city: ["Buenos Aires Obelisco", "Buenos Aires La Boca", "Argentina Mendoza", "Buenos Aires street", "Argentina Recoleta"],
    beaches: ["Argentina Mar del Plata", "Argentina Patagonia", "Buenos Aires coast", "Argentina coast", "Argentina beach"],
  },
  "chile": {
    nightlife: ["Santiago nightlife", "Valparaíso night", "Chile bar", "Santiago bar", "Chile nightclub"],
    food: ["Chilean empanadas", "Chile street food", "Chilean pastel de choclo", "Santiago food", "Chile seafood"],
    city: ["Santiago Chile", "Valparaíso colorful", "Chile Atacama", "Santiago skyline", "Chile Patagonia"],
    beaches: ["Chile Valparaíso beach", "Chile coast", "Viña del Mar beach", "Chile beach", "Chile coastline"],
  },
  "china": {
    nightlife: ["Shanghai nightlife", "Beijing bar street", "China night market", "Shanghai bar", "China nightclub"],
    food: ["Chinese dim sum", "China street food", "Chinese Peking duck", "Shanghai food", "China noodles"],
    city: ["Shanghai skyline", "Beijing Forbidden City", "China Great Wall", "Shanghai Bund", "China Beijing"],
    beaches: ["China Hainan beach", "China Sanya", "China coast", "China beach", "China coastline"],
  },
  "mongolia": {
    nightlife: ["Ulaanbaatar nightlife", "Mongolia bar", "Ulaanbaatar night", "Mongolia club", "Mongolia bar"],
    food: ["Mongolian buuz", "Mongolia food", "Mongolia street food", "Ulaanbaatar food", "Mongolia barbecue"],
    city: ["Ulaanbaatar city", "Mongolia ger", "Mongolia Ulaanbaatar", "Mongolia steppe", "Mongolia landscape"],
    beaches: ["Mongolia Lake Khovsgol", "Mongolia nature", "Mongolia landscape", "Mongolia Gobi", "Mongolia mountains"],
  },
  "south-africa": {
    nightlife: ["Cape Town nightlife", "Johannesburg club", "South Africa bar", "Cape Town bar", "South Africa nightlife"],
    food: ["South African braai", "South Africa street food", "South African bobotie", "Cape Town food", "South Africa biltong"],
    city: ["Cape Town Table Mountain", "Johannesburg city", "South Africa Kruger", "Cape Town waterfront", "South Africa township"],
    beaches: ["Cape Town beach", "South Africa Cape Town coast", "Durban beach", "South Africa coast", "Camps Bay beach"],
  },
  "russia": {
    nightlife: ["Moscow nightlife", "Saint Petersburg bar", "Russia nightclub", "Moscow bar", "Russia night"],
    food: ["Russian borscht", "Russia street food", "Russian pelmeni", "Moscow food", "Russia blini"],
    city: ["Moscow Red Square", "Saint Petersburg Hermitage", "Moscow Kremlin", "Russia Moscow", "Saint Petersburg"],
    beaches: ["Russia Sochi beach", "Russia Black Sea", "Sochi coast", "Russia beach", "Russia coast"],
  },
  "ukraine": {
    nightlife: ["Kyiv nightlife", "Kyiv bar", "Ukraine nightclub", "Lviv bar", "Ukraine night"],
    food: ["Ukrainian borscht", "Ukraine street food", "Ukrainian varenyky", "Kyiv food", "Ukraine food"],
    city: ["Kyiv Saint Sophia", "Kyiv city", "Lviv old town", "Ukraine Kyiv", "Kyiv independence square"],
    beaches: ["Ukraine Odesa beach", "Ukraine Black Sea", "Odesa coast", "Ukraine beach", "Ukraine coast"],
  },
  "poland": {
    nightlife: ["Warsaw nightlife", "Kraków bar", "Poland nightclub", "Warsaw bar", "Kraków night"],
    food: ["Polish pierogi", "Poland street food", "Polish żurek", "Warsaw food", "Poland food"],
    city: ["Warsaw old town", "Kraków main square", "Poland Warsaw", "Gdańsk old town", "Poland Wawel"],
    beaches: ["Poland Gdańsk beach", "Poland Baltic coast", "Poland Sopot", "Poland beach", "Poland coast"],
  },
  "romania": {
    nightlife: ["Bucharest nightlife", "Bucharest bar", "Romania club", "Bucharest old town night", "Romania bar"],
    food: ["Romanian sarmale", "Romania street food", "Romanian mici", "Bucharest food", "Romania food"],
    city: ["Bucharest Palace", "Romania Bran Castle", "Bucharest old town", "Romania Transylvania", "Bucharest street"],
    beaches: ["Romania Constanța beach", "Romania Black Sea", "Romania coast", "Constanța beach", "Romania beach"],
  },
  "turkey": {
    nightlife: ["Istanbul nightlife", "Istanbul rooftop bar", "Turkey club", "Istanbul bar", "Bodrum night"],
    food: ["Turkish kebab", "Turkey street food", "Turkish breakfast", "Istanbul food", "Turkey baklava"],
    city: ["Istanbul Hagia Sophia", "Istanbul Grand Bazaar", "Cappadocia Turkey", "Istanbul skyline", "Turkey Ephesus"],
    beaches: ["Turkey Bodrum beach", "Turkey Antalya beach", "Turkey Mediterranean coast", "Bodrum coast", "Turkey beach"],
  },
  "kazakhstan": {
    nightlife: ["Almaty nightlife", "Astana bar", "Kazakhstan club", "Almaty bar", "Kazakhstan night"],
    food: ["Kazakhstan beshbarmak", "Kazakhstan street food", "Kazakhstan plov", "Almaty food", "Kazakhstan food"],
    city: ["Astana Bayterek", "Almaty city", "Kazakhstan Almaty", "Astana city", "Kazakhstan mountains"],
    beaches: ["Kazakhstan Caspian", "Kazakhstan nature", "Kazakhstan Almaty mountains", "Kazakhstan landscape", "Kazakhstan lake"],
  },
  "algeria": {
    nightlife: ["Algiers night", "Algeria cafe", "Algiers bar", "Algeria restaurant", "Algiers nightlife"],
    food: ["Algerian couscous", "Algeria street food", "Algerian tagine", "Algiers food", "Algeria food"],
    city: ["Algiers Casbah", "Algeria Algiers", "Algeria Timgad", "Algiers city", "Algeria market"],
    beaches: ["Algeria beaches", "Algeria coast", "Algiers beach", "Algeria Mediterranean", "Algeria coastline"],
  },
  "libya": {
    nightlife: ["Tripoli night", "Libya cafe", "Tripoli restaurant", "Libya bar", "Libya night"],
    food: ["Libyan food", "Libya couscous", "Tripoli food", "Libya street food", "Libya cuisine"],
    city: ["Tripoli old town", "Libya Leptis Magna", "Tripoli city", "Libya market", "Libya ruins"],
    beaches: ["Libya coast", "Libya beach", "Libya Mediterranean", "Libya coastline", "Tripoli coast"],
  },
  "usa": {
    nightlife: ["Miami South Beach nightlife", "Las Vegas nightclub", "New York rooftop bar", "Miami bar", "Los Angeles nightlife"],
    food: ["American barbecue", "USA street food", "American burger", "New York food", "USA food truck"],
    city: ["New York skyline", "Las Vegas strip", "Miami beach city", "USA Grand Canyon", "New York Times Square"],
    beaches: ["Miami Beach", "California beach", "Hawaii beach", "USA Florida beach", "USA coast"],
  },
  "canada": {
    nightlife: ["Toronto nightlife", "Montreal bar", "Vancouver nightlife", "Canada bar", "Toronto bar"],
    food: ["Canadian poutine", "Canada street food", "Canadian maple syrup", "Toronto food", "Canada food"],
    city: ["Toronto CN Tower", "Vancouver city", "Montreal old town", "Canada Niagara Falls", "Toronto skyline"],
    beaches: ["Canada Vancouver beach", "Canada Nova Scotia coast", "Canada beach", "Canada coast", "Toronto island"],
  },
  "australia": {
    nightlife: ["Sydney nightlife", "Melbourne bar", "Australia Gold Coast night", "Sydney bar", "Australia nightclub"],
    food: ["Australian barbecue", "Australia street food", "Australian meat pie", "Sydney food", "Australia brunch"],
    city: ["Sydney Opera House", "Melbourne city", "Australia Sydney", "Australia Uluru", "Sydney harbour"],
    beaches: ["Australia Bondi Beach", "Australia Gold Coast", "Sydney beach", "Australia coast", "Australia surf beach"],
  },
  "uk": {
    nightlife: ["London nightlife", "London Shoreditch bar", "UK nightclub", "London pub", "Manchester nightlife"],
    food: ["British fish and chips", "UK street food", "British breakfast", "London food", "UK food market"],
    city: ["London Big Ben", "London skyline", "Edinburgh castle", "UK London", "London Tower Bridge"],
    beaches: ["UK Brighton beach", "UK Cornwall coast", "UK beach", "Brighton beach", "UK coastline"],
  },
  "france": {
    nightlife: ["Paris nightlife", "Paris bar", "France nightclub", "Paris rooftop", "Nice nightlife"],
    food: ["French croissant", "France street food", "French cheese", "Paris food", "France crepes"],
    city: ["Paris Eiffel Tower", "Paris Louvre", "Nice France", "Paris street", "France Mont Saint Michel"],
    beaches: ["French Riviera beach", "Nice beach", "France Côte d'Azur", "France beach", "France coast"],
  },
  "germany": {
    nightlife: ["Berlin nightclub", "Berlin nightlife", "Munich beer garden night", "Germany bar", "Berlin bar"],
    food: ["German bratwurst", "Germany street food", "German pretzel", "Berlin food", "Germany currywurst"],
    city: ["Berlin Brandenburg Gate", "Munich city", "Germany Berlin", "Neuschwanstein Castle", "Berlin street"],
    beaches: ["Germany Baltic coast", "Germany beach", "Germany coast", "Sylt beach", "Germany coastline"],
  },
  "spain": {
    nightlife: ["Barcelona nightlife", "Ibiza club", "Madrid bar", "Spain tapas bar", "Barcelona bar"],
    food: ["Spanish paella", "Spain tapas", "Spanish jamón", "Barcelona food", "Spain street food"],
    city: ["Barcelona Sagrada Familia", "Madrid city", "Spain Alhambra", "Barcelona street", "Spain Seville"],
    beaches: ["Spain Ibiza beach", "Barcelona beach", "Spain Costa del Sol", "Spain beach", "Spain coast"],
  },
  "italy": {
    nightlife: ["Rome nightlife", "Milan bar", "Italy bar", "Rome bar", "Amalfi night"],
    food: ["Italian pizza", "Italy pasta", "Italian gelato", "Rome food", "Italy street food"],
    city: ["Rome Colosseum", "Venice canals", "Florence Duomo", "Italy Rome", "Amalfi Coast"],
    beaches: ["Italy Amalfi beach", "Italy Positano", "Sardinia beach", "Italy coast", "Italy beach"],
  },
  "sweden": {
    nightlife: ["Stockholm nightlife", "Stockholm bar", "Sweden nightclub", "Stockholm night", "Sweden bar"],
    food: ["Swedish meatballs", "Sweden street food", "Swedish cinnamon bun", "Stockholm food", "Sweden food"],
    city: ["Stockholm old town", "Sweden Stockholm", "Stockholm city", "Sweden archipelago", "Stockholm street"],
    beaches: ["Sweden beach", "Sweden coast", "Stockholm archipelago", "Sweden Baltic", "Sweden coastline"],
  },
  "japan": {
    nightlife: ["Tokyo Shibuya night", "Tokyo nightlife", "Japan izakaya", "Tokyo bar", "Osaka night"],
    food: ["Japanese sushi", "Japan ramen", "Japanese street food", "Tokyo food", "Japan tempura"],
    city: ["Tokyo Shibuya", "Tokyo skyline", "Kyoto temple", "Japan Mount Fuji", "Tokyo street"],
    beaches: ["Japan Okinawa beach", "Japan coast", "Okinawa beach", "Japan beach", "Japan coastline"],
  },
  "south-korea": {
    nightlife: ["Seoul nightlife", "Seoul Hongdae bar", "Korea nightclub", "Seoul bar", "Busan night"],
    food: ["Korean barbecue", "Korea street food", "Korean bibimbap", "Seoul food", "Korea kimchi"],
    city: ["Seoul skyline", "Seoul Gyeongbokgung", "Busan city", "Korea Seoul", "Seoul street"],
    beaches: ["South Korea Busan beach", "Busan Haeundae", "Korea coast", "Korea beach", "Busan coast"],
  },
  "saudi-arabia": {
    nightlife: ["Riyadh restaurant", "Jeddah corniche night", "Saudi cafe", "Riyadh cafe", "Saudi Arabia restaurant"],
    food: ["Saudi kabsa", "Saudi Arabia food", "Saudi shawarma", "Riyadh food", "Saudi Arabian cuisine"],
    city: ["Riyadh skyline", "Saudi Arabia Mecca", "Jeddah city", "Saudi Riyadh", "Saudi Arabia modern"],
    beaches: ["Saudi Arabia Red Sea", "Jeddah beach", "Saudi coast", "Saudi beach", "Saudi Arabia coast"],
  },
  "egypt": {
    nightlife: ["Cairo night", "Egypt restaurant", "Sharm nightlife", "Cairo cafe", "Egypt bar"],
    food: ["Egyptian koshari", "Egypt street food", "Egyptian falafel", "Cairo food", "Egypt ful medames"],
    city: ["Egypt pyramids", "Cairo city", "Egypt Luxor temple", "Egypt Sphinx", "Cairo street"],
    beaches: ["Egypt Sharm El Sheikh", "Egypt Red Sea beach", "Egypt coast", "Hurghada beach", "Egypt beach"],
  },
  "iran": {
    nightlife: ["Tehran cafe", "Iran restaurant", "Isfahan night", "Tehran restaurant", "Iran tea house"],
    food: ["Persian kabab", "Iran street food", "Persian rice", "Tehran food", "Iran saffron"],
    city: ["Iran Isfahan mosque", "Tehran city", "Iran Persepolis", "Isfahan Naqsh-e Jahan", "Iran bazaar"],
    beaches: ["Iran Caspian coast", "Iran nature", "Iran mountains", "Iran landscape", "Iran Caspian"],
  },
};

async function searchUnsplash(query, perPage = 3) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&order_by=relevant`;
  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json", "Accept-Language": "en-US,en;q=0.9" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => {
      const raw = r.urls?.raw || r.urls?.regular || "";
      if (!raw) return null;
      const base = raw.split("?")[0];
      return `${base}?auto=format&fit=crop&w=1600&q=80`;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const gallery = {};
  const slugs = Object.keys(QUERIES);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const cats = QUERIES[slug];
    gallery[slug] = {};

    for (const [cat, queries] of Object.entries(cats)) {
      const seen = new Set();
      const urls = [];

      for (const q of queries) {
        const results = await searchUnsplash(q, 2);
        for (const u of results) {
          if (!seen.has(u)) { seen.add(u); urls.push(u); }
        }
        await sleep(150);
      }

      gallery[slug][cat] = urls.slice(0, 5);
      process.stderr.write(`  ${slug}/${cat}: ${gallery[slug][cat].length} photos\n`);
    }
    process.stderr.write(`[${i+1}/${slugs.length}] ${slug}\n`);
  }

  let ts = `// Country visuals: nightlife (bars/clubs/night markets), food (national dishes), city (landmarks), beaches (iconic spots). ~5 per category, category-specific Unsplash.\nexport type CountryGalleryEntry = {\n  nightlife: string[];\n  food: string[];\n  city: string[];\n  beaches: string[];\n};\n\nexport const COUNTRY_GALLERY: Record<string, CountryGalleryEntry> = {\n`;

  for (const [slug, cats] of Object.entries(gallery)) {
    ts += `  "${slug}": {\n`;
    for (const [cat, urls] of Object.entries(cats)) {
      ts += `    "${cat}": [\n`;
      for (const url of urls) ts += `      "${url}",\n`;
      ts += `    ],\n`;
    }
    ts += `  },\n`;
  }
  ts += `};\n`;
  console.log(ts);
}

main().catch(console.error);
