import fs from "fs";

const curatedData = {
  "philippines": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Beach Access, Nature/Mountains, Great Nightlife",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "thailand": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "indonesia": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Beach Access, Nature/Mountains, Great Nightlife",
    safetyLevel: "Safe", healthcareQuality: "Moderate"
  },
  "malaysia": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "vietnam": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Nature/Mountains, Beach Access",
    safetyLevel: "Very Safe", healthcareQuality: "Moderate"
  },
  "cambodia": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "Low"
  },
  "kenya": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Nature/Mountains, Great Nightlife",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "nigeria": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Difficult", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Great Nightlife",
    safetyLevel: "Dangerous", healthcareQuality: "Low"
  },
  "uganda": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Slow",
    climate: "Tropical", vibe: "Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "Low"
  },
  "rwanda": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "Moderate"
  },
  "tanzania": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Nature/Mountains, Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Low"
  },
  "ethiopia": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Slow",
    climate: "Tropical", vibe: "Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "Low"
  },
  "bolivia": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Slow",
    climate: "Temperate", vibe: "Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "Low"
  },
  "colombia": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Nature/Mountains, Beach Access",
    safetyLevel: "Dangerous", healthcareQuality: "Moderate"
  },
  "mexico": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "peru": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains, Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "venezuela": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "<$1k", visaEase: "Difficult", internetSpeed: "Slow",
    climate: "Tropical", vibe: "Beach Access, Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "Low"
  },
  "dominican-republic": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Great Nightlife, Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "costa-rica": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "High",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Nature/Mountains, Beach Access",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "india": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "High",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Nature/Mountains, Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "pakistan": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Temperate", vibe: "Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "Low"
  },
  "morocco": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Temperate", vibe: "Beach Access, Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "brazil": {
    receptiveness: "High", localValues: "Modern", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "Moderate"
  },
  "argentina": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "chile": {
    receptiveness: "Medium", localValues: "Modern", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Nature/Mountains, Beach Access",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "china": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$2k-$3k", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "Moderate"
  },
  "mongolia": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Moderate",
    climate: "Cold", vibe: "Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "Low"
  },
  "south-africa": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "High"
  },
  "russia": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Cold", vibe: "Great Nightlife",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "ukraine": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "<$1k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Cold", vibe: "Great Nightlife",
    safetyLevel: "Dangerous", healthcareQuality: "Moderate"
  },
  "poland": {
    receptiveness: "Medium", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Cold", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "romania": {
    receptiveness: "High", localValues: "Mixed", englishProficiency: "High",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "Moderate"
  },
  "turkey": {
    receptiveness: "High", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "$1k-$2k", visaEase: "e-Visa", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "kazakhstan": {
    receptiveness: "Medium", localValues: "Mixed", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Cold", vibe: "Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "Moderate"
  },
  "algeria": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Difficult", internetSpeed: "Moderate",
    climate: "Temperate", vibe: "Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Low"
  },
  "libya": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$1k-$2k", visaEase: "Difficult", internetSpeed: "Slow",
    climate: "Tropical", vibe: "Beach Access",
    safetyLevel: "Dangerous", healthcareQuality: "Low"
  },
  "usa": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$3k+", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Moderate", healthcareQuality: "High"
  },
  "canada": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$3k+", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Cold", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "australia": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$3k+", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "uk": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$3k+", visaEase: "Difficult", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "france": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "Moderate",
    budgetTier: "$3k+", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "germany": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "spain": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "Moderate",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "italy": {
    receptiveness: "Low", localValues: "Mixed", englishProficiency: "Moderate",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Beach Access, Nature/Mountains",
    safetyLevel: "Safe", healthcareQuality: "High"
  },
  "sweden": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "High",
    budgetTier: "$3k+", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Cold", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "japan": {
    receptiveness: "Medium", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "south-korea": {
    receptiveness: "Low", localValues: "Modern", englishProficiency: "Moderate",
    budgetTier: "$2k-$3k", visaEase: "Visa-Free", internetSpeed: "Fast",
    climate: "Temperate", vibe: "Great Nightlife, Nature/Mountains",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "saudi-arabia": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "$3k+", visaEase: "e-Visa", internetSpeed: "Fast",
    climate: "Tropical", vibe: "Great Nightlife",
    safetyLevel: "Very Safe", healthcareQuality: "High"
  },
  "egypt": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Moderate",
    budgetTier: "<$1k", visaEase: "e-Visa", internetSpeed: "Moderate",
    climate: "Tropical", vibe: "Beach Access",
    safetyLevel: "Moderate", healthcareQuality: "Moderate"
  },
  "iran": {
    receptiveness: "Low", localValues: "Traditional", englishProficiency: "Low",
    budgetTier: "<$1k", visaEase: "Difficult", internetSpeed: "Moderate",
    climate: "Temperate", vibe: "Nature/Mountains",
    safetyLevel: "Dangerous", healthcareQuality: "Moderate"
  }
};

const fileOutput = `// This file is auto-generated and manually curated for perfect filtering
export type CountryFilterMeta = {
  receptiveness: string;
  localValues: string;
  englishProficiency: string;
  budgetTier: string;
  visaEase: string;
  internetSpeed: string;
  climate: string;
  vibe: string;
  safetyLevel: string;
  healthcareQuality: string;
};

export const COUNTRY_FILTER_DATA: Record<string, CountryFilterMeta> = ${JSON.stringify(curatedData, null, 2)};

export const DEFAULT_COUNTRY_FILTER_META: CountryFilterMeta = {
  receptiveness: "Medium",
  localValues: "Mixed",
  englishProficiency: "Moderate",
  budgetTier: "$1k-$2k",
  visaEase: "Visa-Free",
  internetSpeed: "Moderate",
  climate: "Temperate",
  vibe: "Great Nightlife",
  safetyLevel: "Moderate",
  healthcareQuality: "Moderate"
};
`;

fs.writeFileSync("./lib/countryFilterData.ts", fileOutput);
console.log("Filter data successfully regenerated!");
