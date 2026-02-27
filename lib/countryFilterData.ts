export type CountryFilterMeta = {
  receptiveness: "High" | "Medium" | "Low";
  localValues: "Traditional" | "Mixed" | "Modern";
  englishProficiency: "High" | "Moderate" | "Low";
  budgetTier: "<$1k" | "$1k-$2k" | "$2k-$3k" | "$3k+";
  visaEase: "Visa-Free" | "e-Visa" | "Difficult";
  internetSpeed: "Fast" | "Moderate" | "Slow";
  climate: "Tropical" | "Temperate" | "Cold";
  vibe: "Great Nightlife" | "Beach Access" | "Nature/Mountains";
  safetyLevel: "Very Safe" | "Safe" | "Moderate";
  healthcareQuality: "High" | "Moderate" | "Low";
};

// Combined dataset from the user's 15 + remaining 35 countries.
export const COUNTRY_FILTER_DATA: Record<string, CountryFilterMeta> = {
  "thailand": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "High" },
  "philippines": { receptiveness: "High", localValues: "Traditional", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "colombia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Moderate", healthcareQuality: "High" },
  "brazil": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "mexico": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "vietnam": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Fast", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Very Safe", healthcareQuality: "Moderate" },
  "indonesia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Fast", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "japan": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "argentina": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "High" },
  "dominican-republic": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "poland": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Cold", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "romania": { receptiveness: "High", localValues: "Traditional", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Very Safe", healthcareQuality: "Moderate" },
  "peru": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "spain": { receptiveness: "High", localValues: "Modern", englishProficiency: "Moderate", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "turkey": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "High" },
  "portugal": { receptiveness: "High", localValues: "Mixed", englishProficiency: "High", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "malaysia": { receptiveness: "High", localValues: "Mixed", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "High" },
  "south-korea": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "taiwan": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "costa-rica": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "panama": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "High" },
  "chile": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "High" },
  "hungary": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "czech-republic": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "bulgaria": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "serbia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "High", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "croatia": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "Moderate" },
  "georgia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "estonia": { receptiveness: "Medium", localValues: "Modern", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Cold", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "greece": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Safe", healthcareQuality: "High" },
  "italy": { receptiveness: "High", localValues: "Mixed", englishProficiency: "Low", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Great Nightlife", safetyLevel: "Safe", healthcareQuality: "High" },
  "south-africa": { receptiveness: "High", localValues: "Mixed", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "kenya": { receptiveness: "High", localValues: "Traditional", englishProficiency: "High", budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Moderate", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Moderate", healthcareQuality: "Low" },
  "morocco": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Safe", healthcareQuality: "Low" },
  "egypt": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Moderate", healthcareQuality: "Low" },
  "tanzania": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Slow", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Low" },
  "united-arab-emirates": { receptiveness: "Medium", localValues: "Mixed", englishProficiency: "High", budgetTier: "$3k+", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "mauritius": { receptiveness: "High", localValues: "Mixed", englishProficiency: "High", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "Moderate" },
  "cyprus": { receptiveness: "High", localValues: "Mixed", englishProficiency: "High", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "malta": { receptiveness: "High", localValues: "Modern", englishProficiency: "High", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "High" },
  "montenegro": { receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Moderate" },
  "albania": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Safe", healthcareQuality: "Low" },
  "north-macedonia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Low" },
  "sri-lanka": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate", budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Slow", climate: "Tropical", vibe: "Beach Access", safetyLevel: "Moderate", healthcareQuality: "Low" },
  "cambodia": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate", climate: "Tropical", vibe: "Great Nightlife", safetyLevel: "Moderate", healthcareQuality: "Low" },
  "laos": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Slow", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Low" },
  "ecuador": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Temperate", vibe: "Nature/Mountains", safetyLevel: "Moderate", healthcareQuality: "Moderate" },
  "guatemala": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Moderate", healthcareQuality: "Low" },
  "paraguay": { receptiveness: "High", localValues: "Traditional", englishProficiency: "Low", budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Moderate", climate: "Tropical", vibe: "Nature/Mountains", safetyLevel: "Safe", healthcareQuality: "Low" },
  "uruguay": { receptiveness: "High", localValues: "Modern", englishProficiency: "Moderate", budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast", climate: "Temperate", vibe: "Beach Access", safetyLevel: "Very Safe", healthcareQuality: "High" },
};

export const DEFAULT_COUNTRY_FILTER_META: CountryFilterMeta = {
  receptiveness: "Medium",
  localValues: "Mixed",
  englishProficiency: "Moderate",
  budgetTier: "$1k-$2k",
  visaEase: "Visa-Free",
  internetSpeed: "Moderate",
  climate: "Temperate",
  vibe: "Nature/Mountains",
  safetyLevel: "Safe",
  healthcareQuality: "Moderate",
};
