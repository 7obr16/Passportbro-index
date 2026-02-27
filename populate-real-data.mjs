import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Highly specific data tailored to the Passport Bro / Digital Nomad perspective
const realData = {
  philippines: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "High",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Moderate",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "Incredible hospitality, extremely high English proficiency makes dating and socializing frictionless. Traditional family values are still very prominent. Very affordable outside Manila, great beaches.",
    reddit_cons: "Internet can be spotty and slow in the provinces. Manila traffic is notoriously brutal. Dietary options can be heavy on sugar and fried foods if you don't cook yourself."
  },
  thailand: {
    receptiveness: "High", local_values: "Mixed", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Safe", healthcare_quality: "High",
    reddit_pros: "World-class food, excellent infrastructure for nomads, top-tier private healthcare, very safe. Diverse dating pool ranging from traditional to highly modern.",
    reddit_cons: "Visa runs are getting progressively harder with new crackdowns. High competition with other expats. Severe pollution/burning season in the north (Chiang Mai) during spring."
  },
  colombia: {
    receptiveness: "High", local_values: "Mixed", english_proficiency: "Low",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "High",
    reddit_pros: "Stunningly beautiful locals who are very warm and approachable. Medellin has a perfect 'eternal spring' climate. Incredible nightlife and vibrant culture.",
    reddit_cons: "Safety requires constant street smarts (scopolamine risks on dating apps). Severe language barrier if you don't speak decent Spanish. Can be noisy."
  },
  indonesia: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Moderate",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Safe", healthcare_quality: "Moderate",
    reddit_pros: "Bali offers an unmatched nomad ecosystem. Outside Bali (Jakarta, Bandung), locals are incredibly traditional, friendly, and receptive to foreigners. Very cheap.",
    reddit_cons: "Traffic in Bali and Jakarta is soul-crushing. Alcohol is heavily taxed outside Bali. Bureaucracy can be incredibly frustrating for long-term stays."
  },
  vietnam: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "Moderate",
    budget_tier: "<$1k", visa_ease: "e-Visa", internet_speed: "Fast",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Very Safe", healthcare_quality: "Moderate",
    reddit_pros: "Extremely low cost of living. Highly traditional dating culture with strong family values. Food is incredibly fresh, healthy, and cheap. Very low violent crime rate.",
    reddit_cons: "Pollution and air quality in Hanoi/HCMC can be terrible. Language barrier is tough (tonal language). Traffic feels chaotic until you get used to it."
  },
  brazil: {
    receptiveness: "High", local_values: "Modern", english_proficiency: "Low",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "Incredibly outgoing, fun, and beautiful people. Vibrant culture, amazing beaches, and a lifestyle focused on enjoyment. High receptiveness to confident foreigners.",
    reddit_cons: "Violent crime and muggings are a real concern (especially in Rio). You MUST learn Portuguese. Economy and currency can be volatile."
  },
  mexico: {
    receptiveness: "High", local_values: "Mixed", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "High",
    reddit_pros: "Amazing food, rich culture, and extremely easy flight access from the US. Locals are warm and family-oriented. Great mix of modern cities and traditional towns.",
    reddit_cons: "Certain regions are run by cartels, requiring you to stick to safe zones (CDMX, Merida, PDC). Prices are rising due to heavy gentrification."
  },
  "dominican-republic": {
    receptiveness: "High", local_values: "Mixed", english_proficiency: "Low",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Moderate",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "High energy, incredible beaches, and locals love foreigners. Very easy to socialize and date if you enjoy dancing (bachata/merengue) and nightlife.",
    reddit_cons: "High level of transactional dating/chapiadoras in tourist zones. Can be loud, and the infrastructure (power, water) can occasionally fail."
  },
  peru: {
    receptiveness: "Medium", local_values: "Traditional", english_proficiency: "Low",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Moderate",
    climate: "Temperate", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "Lima is a world-class culinary capital. Traditional, modest locals. Very affordable lifestyle and incredible historical/nature sites (Cusco).",
    reddit_cons: "Lima is covered in a grey fog (La Garua) for half the year. Petty theft is common. Dating pool can be more reserved and slower-paced than Colombia/Brazil."
  },
  poland: {
    receptiveness: "Medium", local_values: "Mixed", english_proficiency: "High",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Very Safe", healthcare_quality: "High",
    reddit_pros: "Extremely safe, clean, and highly developed European infrastructure at half the cost of Western Europe. High English proficiency and beautiful, feminine women.",
    reddit_cons: "Winters are long, dark, and brutally cold. Locals can seem unapproachable or cold on the street (Slavic resting face). Not a tropical vibe."
  },
  romania: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "High",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Very Safe", healthcare_quality: "Moderate",
    reddit_pros: "Some of the fastest internet in the world. Locals are surprisingly Latin/warm in personality compared to neighboring Slavic countries. Very traditional family values.",
    reddit_cons: "Bureaucracy is notoriously corrupt/slow. Healthcare outside of private clinics in Bucharest can be lacking. Winters are harsh."
  },
  ukraine: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "Moderate",
    budget_tier: "<$1k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Cold", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "Historically one of the top destinations for traditional, highly feminine women. Extremely cheap cost of living, great cafe culture in Kyiv/Lviv.",
    reddit_cons: "Currently an active warzone, making long-term planning impossible and travel highly restricted/dangerous. Frequent power outages."
  },
  russia: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Difficult", internet_speed: "Fast",
    climate: "Cold", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Safe", healthcare_quality: "Moderate",
    reddit_pros: "World-renowned for traditional values and feminine beauty. Moscow is an incredibly clean, modern, and 24/7 city with amazing infrastructure.",
    reddit_cons: "Visas are very difficult to get right now. Sanctions mean western credit cards don't work. Brutal winters. Severe political tensions."
  },
  kenya: {
    receptiveness: "High", local_values: "Traditional", english_proficiency: "High",
    budget_tier: "$1k-$2k", visa_ease: "e-Visa", internet_speed: "Moderate",
    climate: "Tropical", has_nightlife: true, has_beach: true, has_nature: true,
    safety_level: "Moderate", healthcare_quality: "Moderate",
    reddit_pros: "Nairobi is the tech hub of East Africa. Locals speak perfect English, are very welcoming, and have strong traditional/religious values. Great nature.",
    reddit_cons: "Nairobi has significant inequality and 'Nairobbery' petty crime. Traffic is heavy. Premium accommodation can be surprisingly expensive."
  },
  japan: {
    receptiveness: "Low", local_values: "Modern", english_proficiency: "Low",
    budget_tier: "$2k-$3k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Very Safe", healthcare_quality: "High",
    reddit_pros: "The safest, cleanest, most polite society on earth. Incredible food and public transit. Weak Yen currently makes it very affordable for westerners.",
    reddit_cons: "Extremely insular culture; hard to make deep local connections. Severe language barrier. Dating requires fitting into strict societal norms."
  },
  argentina: {
    receptiveness: "High", local_values: "Modern", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Fast",
    climate: "Temperate", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Safe", healthcare_quality: "High",
    reddit_pros: "Buenos Aires feels like Paris at a fraction of the cost. Locals are highly educated, passionate, and the nightlife goes until 7 AM. Great steak and wine.",
    reddit_cons: "Hyperinflation makes the economy chaotic. Dating culture is more modern/westernized than the rest of LatAm. Getting electronics imported is a nightmare."
  }
};

// Fallback generator for countries not explicitly detailed above
function generateFallback(slug) {
  const isLatAm = ["bolivia", "costa-rica", "chile", "venezuela"].includes(slug);
  const isAsia = ["malaysia", "cambodia", "china", "mongolia", "kazakhstan", "pakistan", "india", "south-korea"].includes(slug);
  const isAfrica = ["nigeria", "uganda", "rwanda", "tanzania", "ethiopia", "south-africa", "morocco", "algeria", "libya", "egypt"].includes(slug);
  const isEurope = ["turkey", "spain", "italy", "france", "germany", "uk", "sweden"].includes(slug);

  let data = {
    receptiveness: "Medium", local_values: "Mixed", english_proficiency: "Moderate",
    budget_tier: "$1k-$2k", visa_ease: "Visa-Free", internet_speed: "Moderate",
    climate: "Temperate", has_nightlife: true, has_beach: false, has_nature: true,
    safety_level: "Safe", healthcare_quality: "Moderate",
    reddit_pros: "Good balance of lifestyle and affordability. Locals are generally welcoming once you break the ice.",
    reddit_cons: "Can be culturally opaque for newcomers. Bureaucracy and local logistics often take time to figure out."
  };

  if (isLatAm) {
    data.receptiveness = "High"; data.climate = "Tropical"; data.english_proficiency = "Low"; data.has_beach = true;
    data.reddit_pros = "Warm, hospitable culture with a relaxed pace of life. Great food and vibrant social scenes.";
    data.reddit_cons = "Safety can be localized. Language barrier exists outside major tourist hubs.";
  } else if (isAsia) {
    data.local_values = "Traditional"; data.budget_tier = "<$1k"; data.visa_ease = "e-Visa";
    data.reddit_pros = "Deeply traditional culture with massive respect for elders. Very low cost of living and amazing street food.";
    data.reddit_cons = "Visas can be tricky long-term. Pollution in major cities. Massive cultural differences to navigate.";
  } else if (isAfrica) {
    data.receptiveness = "High"; data.local_values = "Traditional"; data.climate = "Tropical";
    data.reddit_pros = "Untapped potential with incredibly welcoming communities. Deep family values and rapidly growing tech scenes.";
    data.reddit_cons = "Infrastructure (power/internet) can be highly unreliable. Healthcare outside capitals is poor.";
  } else if (isEurope) {
    data.budget_tier = "$3k+"; data.local_values = "Modern"; data.internet_speed = "Fast"; data.healthcare_quality = "High";
    data.reddit_pros = "World-class infrastructure, history, and healthcare. Extremely safe with high English proficiency in the north.";
    data.reddit_cons = "High cost of living. Dating culture is highly westernized and competitive. Heavy taxation if you become a resident.";
  }

  return data;
}

async function main() {
  const { data: countries } = await supabase.from("Countries").select("id, slug");
  if (!countries) return;

  for (const c of countries) {
    const updateData = realData[c.slug] || generateFallback(c.slug);
    
    const { error } = await supabase
      .from("Countries")
      .update(updateData)
      .eq("id", c.id);
      
    if (error) {
      console.error(`Error updating ${c.slug}:`, error.message);
    } else {
      console.log(`Updated ${c.slug} with real data.`);
    }
  }
  console.log("All filters and Reddit data populated successfully!");
}

main();