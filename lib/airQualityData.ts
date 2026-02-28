export type CityAQI = {
  name: string;
  aqi: number;
  lat: number;
  lng: number;
  tourismNote?: string;
};

export type CountryAirQuality = {
  overall: number;
  trend: "improving" | "stable" | "worsening";
  cities: CityAQI[];
};

export type AqiCategory = {
  label: string;
  sublabel: string;
  color: string;
  trackColor: string;
  level: number; // 1–6
};

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50)  return { label: "Good",        sublabel: "Air quality is satisfactory",               color: "#22c55e", trackColor: "#16a34a", level: 1 };
  if (aqi <= 100) return { label: "Moderate",     sublabel: "Acceptable for most people",               color: "#eab308", trackColor: "#ca8a04", level: 2 };
  if (aqi <= 150) return { label: "Sensitive",    sublabel: "Unhealthy for sensitive groups",           color: "#f97316", trackColor: "#ea580c", level: 3 };
  if (aqi <= 200) return { label: "Unhealthy",    sublabel: "Everyone may experience effects",          color: "#ef4444", trackColor: "#dc2626", level: 4 };
  if (aqi <= 300) return { label: "Very Unhealthy", sublabel: "Health alert — serious effects",         color: "#a855f7", trackColor: "#9333ea", level: 5 };
  return           { label: "Hazardous",           sublabel: "Emergency conditions — avoid outdoors",   color: "#be185d", trackColor: "#9d174d", level: 6 };
}

export const AIR_QUALITY_DATA: Record<string, CountryAirQuality> = {
  "philippines": {
    overall: 58,
    trend: "stable",
    cities: [
      { name: "Manila", aqi: 72, lat: 14.6, lng: 121.0, tourismNote: "Capital — urban pollution" },
      { name: "Cebu City", aqi: 55, lat: 10.3, lng: 123.9, tourismNote: "Popular island hub" },
      { name: "Boracay", aqi: 28, lat: 11.97, lng: 121.93, tourismNote: "Beach resort island" },
      { name: "Palawan", aqi: 22, lat: 9.85, lng: 118.73, tourismNote: "Pristine nature destination" },
      { name: "Davao", aqi: 42, lat: 7.07, lng: 125.6, tourismNote: "Mindanao gateway" },
    ],
  },
  "thailand": {
    overall: 75,
    trend: "worsening",
    cities: [
      { name: "Bangkok", aqi: 95, lat: 13.75, lng: 100.5, tourismNote: "Capital — traffic heavy" },
      { name: "Chiang Mai", aqi: 110, lat: 18.79, lng: 98.98, tourismNote: "Burning season spikes Mar-Apr" },
      { name: "Phuket", aqi: 35, lat: 7.88, lng: 98.39, tourismNote: "Beach resort — clean coastal air" },
      { name: "Koh Samui", aqi: 30, lat: 9.51, lng: 100.06, tourismNote: "Island resort" },
      { name: "Pattaya", aqi: 55, lat: 12.93, lng: 100.88, tourismNote: "Coastal city" },
    ],
  },
  "indonesia": {
    overall: 82,
    trend: "stable",
    cities: [
      { name: "Jakarta", aqi: 115, lat: -6.2, lng: 106.85, tourismNote: "Capital — heavy pollution" },
      { name: "Bali (Ubud)", aqi: 38, lat: -8.51, lng: 115.26, tourismNote: "Top tourist destination" },
      { name: "Bali (Kuta)", aqi: 48, lat: -8.72, lng: 115.17, tourismNote: "Beach and nightlife hub" },
      { name: "Yogyakarta", aqi: 65, lat: -7.8, lng: 110.36, tourismNote: "Cultural capital" },
      { name: "Lombok", aqi: 32, lat: -8.65, lng: 116.35, tourismNote: "Emerging island destination" },
    ],
  },
  "colombia": {
    overall: 52,
    trend: "improving",
    cities: [
      { name: "Bogota", aqi: 62, lat: 4.71, lng: -74.07, tourismNote: "Capital at altitude" },
      { name: "Medellin", aqi: 68, lat: 6.25, lng: -75.56, tourismNote: "Digital nomad hub — valley traps smog" },
      { name: "Cartagena", aqi: 35, lat: 10.39, lng: -75.51, tourismNote: "Coastal colonial city" },
      { name: "Cali", aqi: 55, lat: 3.45, lng: -76.53, tourismNote: "Salsa capital" },
      { name: "Santa Marta", aqi: 28, lat: 11.24, lng: -74.2, tourismNote: "Beach and Tayrona gateway" },
    ],
  },
  "brazil": {
    overall: 48,
    trend: "stable",
    cities: [
      { name: "Sao Paulo", aqi: 62, lat: -23.55, lng: -46.63, tourismNote: "Largest city — urban smog" },
      { name: "Rio de Janeiro", aqi: 45, lat: -22.91, lng: -43.17, tourismNote: "Coastal metropolis" },
      { name: "Florianopolis", aqi: 25, lat: -27.59, lng: -48.55, tourismNote: "Beach island city" },
      { name: "Salvador", aqi: 38, lat: -12.97, lng: -38.51, tourismNote: "Cultural hub" },
      { name: "Manaus", aqi: 55, lat: -3.12, lng: -60.02, tourismNote: "Amazon gateway — seasonal fires" },
    ],
  },
  "mexico": {
    overall: 72,
    trend: "stable",
    cities: [
      { name: "Mexico City", aqi: 95, lat: 19.43, lng: -99.13, tourismNote: "Capital — altitude + pollution" },
      { name: "Cancun", aqi: 25, lat: 21.16, lng: -86.85, tourismNote: "Beach resort — pristine" },
      { name: "Playa del Carmen", aqi: 22, lat: 20.63, lng: -87.08, tourismNote: "Riviera Maya" },
      { name: "Guadalajara", aqi: 65, lat: 20.67, lng: -103.35, tourismNote: "Second city" },
      { name: "Oaxaca", aqi: 40, lat: 17.07, lng: -96.73, tourismNote: "Cultural destination" },
    ],
  },
  "vietnam": {
    overall: 88,
    trend: "worsening",
    cities: [
      { name: "Hanoi", aqi: 120, lat: 21.03, lng: 105.85, tourismNote: "Capital — high pollution" },
      { name: "Ho Chi Minh City", aqi: 95, lat: 10.82, lng: 106.63, tourismNote: "Saigon — traffic smog" },
      { name: "Da Nang", aqi: 45, lat: 16.07, lng: 108.22, tourismNote: "Beach city" },
      { name: "Hoi An", aqi: 40, lat: 15.88, lng: 108.33, tourismNote: "Historic town" },
      { name: "Phu Quoc", aqi: 25, lat: 10.23, lng: 103.97, tourismNote: "Island resort" },
    ],
  },
  "japan": {
    overall: 42,
    trend: "improving",
    cities: [
      { name: "Tokyo", aqi: 48, lat: 35.68, lng: 139.69, tourismNote: "Capital" },
      { name: "Osaka", aqi: 45, lat: 34.69, lng: 135.5, tourismNote: "Food capital" },
      { name: "Kyoto", aqi: 38, lat: 35.01, lng: 135.77, tourismNote: "Temple city" },
      { name: "Okinawa", aqi: 18, lat: 26.34, lng: 127.8, tourismNote: "Tropical islands" },
      { name: "Sapporo", aqi: 30, lat: 43.06, lng: 141.35, tourismNote: "Hokkaido hub" },
    ],
  },
  "argentina": {
    overall: 38,
    trend: "stable",
    cities: [
      { name: "Buenos Aires", aqi: 48, lat: -34.6, lng: -58.38, tourismNote: "Capital" },
      { name: "Mendoza", aqi: 35, lat: -32.89, lng: -68.83, tourismNote: "Wine region" },
      { name: "Bariloche", aqi: 15, lat: -41.13, lng: -71.31, tourismNote: "Patagonia lakes" },
      { name: "Cordoba", aqi: 42, lat: -31.42, lng: -64.18, tourismNote: "University city" },
      { name: "Ushuaia", aqi: 12, lat: -54.8, lng: -68.3, tourismNote: "End of the world" },
    ],
  },
  "dominican-republic": {
    overall: 42,
    trend: "stable",
    cities: [
      { name: "Santo Domingo", aqi: 55, lat: 18.49, lng: -69.93, tourismNote: "Capital" },
      { name: "Punta Cana", aqi: 22, lat: 18.58, lng: -68.37, tourismNote: "Beach resort" },
      { name: "Puerto Plata", aqi: 30, lat: 19.79, lng: -70.69, tourismNote: "North coast resort" },
      { name: "Sosua", aqi: 28, lat: 19.75, lng: -70.52, tourismNote: "Popular expat town" },
    ],
  },
  "poland": {
    overall: 62,
    trend: "improving",
    cities: [
      { name: "Warsaw", aqi: 58, lat: 52.23, lng: 21.01, tourismNote: "Capital" },
      { name: "Krakow", aqi: 78, lat: 50.06, lng: 19.94, tourismNote: "Historic city — coal heating" },
      { name: "Gdansk", aqi: 38, lat: 54.35, lng: 18.65, tourismNote: "Baltic coast" },
      { name: "Wroclaw", aqi: 55, lat: 51.11, lng: 17.04, tourismNote: "Nightlife hub" },
    ],
  },
  "romania": {
    overall: 52,
    trend: "stable",
    cities: [
      { name: "Bucharest", aqi: 65, lat: 44.43, lng: 26.1, tourismNote: "Capital" },
      { name: "Cluj-Napoca", aqi: 42, lat: 46.77, lng: 23.6, tourismNote: "Tech hub" },
      { name: "Brasov", aqi: 35, lat: 45.65, lng: 25.6, tourismNote: "Mountain city" },
      { name: "Sibiu", aqi: 30, lat: 45.8, lng: 24.15, tourismNote: "Medieval town" },
    ],
  },
  "peru": {
    overall: 65,
    trend: "stable",
    cities: [
      { name: "Lima", aqi: 82, lat: -12.05, lng: -77.04, tourismNote: "Capital — coastal fog traps smog" },
      { name: "Cusco", aqi: 35, lat: -13.52, lng: -71.97, tourismNote: "Machu Picchu gateway" },
      { name: "Arequipa", aqi: 40, lat: -16.4, lng: -71.54, tourismNote: "White city" },
      { name: "Iquitos", aqi: 30, lat: -3.75, lng: -73.25, tourismNote: "Amazon gateway" },
    ],
  },
  "spain": {
    overall: 35,
    trend: "improving",
    cities: [
      { name: "Madrid", aqi: 42, lat: 40.42, lng: -3.7, tourismNote: "Capital" },
      { name: "Barcelona", aqi: 38, lat: 41.39, lng: 2.17, tourismNote: "Coastal city" },
      { name: "Valencia", aqi: 32, lat: 39.47, lng: -0.38, tourismNote: "Beach + culture" },
      { name: "Malaga", aqi: 28, lat: 36.72, lng: -4.42, tourismNote: "Costa del Sol" },
      { name: "Canary Islands", aqi: 18, lat: 28.29, lng: -16.63, tourismNote: "Atlantic islands" },
    ],
  },
  "turkey": {
    overall: 62,
    trend: "stable",
    cities: [
      { name: "Istanbul", aqi: 72, lat: 41.01, lng: 28.98, tourismNote: "Transcontinental city" },
      { name: "Antalya", aqi: 35, lat: 36.9, lng: 30.69, tourismNote: "Turkish Riviera" },
      { name: "Cappadocia", aqi: 25, lat: 38.64, lng: 34.83, tourismNote: "Balloon flights" },
      { name: "Izmir", aqi: 48, lat: 38.42, lng: 27.14, tourismNote: "Aegean coast" },
      { name: "Bodrum", aqi: 30, lat: 37.04, lng: 27.43, tourismNote: "Resort town" },
    ],
  },
  "malaysia": {
    overall: 58,
    trend: "stable",
    cities: [
      { name: "Kuala Lumpur", aqi: 68, lat: 3.14, lng: 101.69, tourismNote: "Capital" },
      { name: "Penang", aqi: 52, lat: 5.41, lng: 100.33, tourismNote: "Food capital" },
      { name: "Langkawi", aqi: 28, lat: 6.35, lng: 99.8, tourismNote: "Island resort" },
      { name: "Kota Kinabalu", aqi: 35, lat: 5.98, lng: 116.07, tourismNote: "Borneo gateway" },
    ],
  },
  "south-korea": {
    overall: 65,
    trend: "improving",
    cities: [
      { name: "Seoul", aqi: 72, lat: 37.57, lng: 126.98, tourismNote: "Capital — seasonal dust" },
      { name: "Busan", aqi: 48, lat: 35.18, lng: 129.07, tourismNote: "Coastal city" },
      { name: "Jeju Island", aqi: 25, lat: 33.5, lng: 126.53, tourismNote: "Volcanic island" },
      { name: "Gyeongju", aqi: 38, lat: 35.86, lng: 129.21, tourismNote: "Historic city" },
    ],
  },
  "taiwan": {
    overall: 55,
    trend: "improving",
    cities: [
      { name: "Taipei", aqi: 58, lat: 25.03, lng: 121.57, tourismNote: "Capital" },
      { name: "Kaohsiung", aqi: 62, lat: 22.63, lng: 120.3, tourismNote: "Port city" },
      { name: "Hualien", aqi: 28, lat: 23.99, lng: 121.6, tourismNote: "Taroko Gorge gateway" },
      { name: "Kenting", aqi: 22, lat: 21.95, lng: 120.8, tourismNote: "Beach resort" },
    ],
  },
  "costa-rica": {
    overall: 32,
    trend: "stable",
    cities: [
      { name: "San Jose", aqi: 42, lat: 9.93, lng: -84.08, tourismNote: "Capital" },
      { name: "Tamarindo", aqi: 18, lat: 10.3, lng: -85.84, tourismNote: "Surf town" },
      { name: "Manuel Antonio", aqi: 15, lat: 9.39, lng: -84.14, tourismNote: "National park" },
      { name: "La Fortuna", aqi: 20, lat: 10.47, lng: -84.64, tourismNote: "Volcano region" },
    ],
  },
  "hungary": {
    overall: 55,
    trend: "stable",
    cities: [
      { name: "Budapest", aqi: 58, lat: 47.5, lng: 19.04, tourismNote: "Capital — thermal baths" },
      { name: "Debrecen", aqi: 48, lat: 47.53, lng: 21.63, tourismNote: "Eastern hub" },
      { name: "Lake Balaton", aqi: 25, lat: 46.91, lng: 17.89, tourismNote: "Resort lake" },
    ],
  },
  "czech-republic": {
    overall: 48,
    trend: "improving",
    cities: [
      { name: "Prague", aqi: 52, lat: 50.08, lng: 14.44, tourismNote: "Capital" },
      { name: "Brno", aqi: 45, lat: 49.2, lng: 16.61, tourismNote: "Second city" },
      { name: "Cesky Krumlov", aqi: 22, lat: 48.81, lng: 14.32, tourismNote: "Medieval town" },
    ],
  },
  "bulgaria": {
    overall: 52,
    trend: "stable",
    cities: [
      { name: "Sofia", aqi: 62, lat: 42.7, lng: 23.32, tourismNote: "Capital" },
      { name: "Varna", aqi: 35, lat: 43.21, lng: 27.92, tourismNote: "Black Sea coast" },
      { name: "Plovdiv", aqi: 48, lat: 42.15, lng: 24.75, tourismNote: "Cultural hub" },
    ],
  },
  "serbia": {
    overall: 68,
    trend: "stable",
    cities: [
      { name: "Belgrade", aqi: 72, lat: 44.79, lng: 20.46, tourismNote: "Capital — nightlife hub" },
      { name: "Novi Sad", aqi: 55, lat: 45.25, lng: 19.84, tourismNote: "EXIT festival" },
      { name: "Nis", aqi: 58, lat: 43.32, lng: 21.9, tourismNote: "Southern hub" },
    ],
  },
  "croatia": {
    overall: 32,
    trend: "stable",
    cities: [
      { name: "Zagreb", aqi: 40, lat: 45.81, lng: 15.98, tourismNote: "Capital" },
      { name: "Dubrovnik", aqi: 20, lat: 42.65, lng: 18.09, tourismNote: "Coastal gem" },
      { name: "Split", aqi: 28, lat: 43.51, lng: 16.44, tourismNote: "Island gateway" },
    ],
  },
  "georgia": {
    overall: 48,
    trend: "improving",
    cities: [
      { name: "Tbilisi", aqi: 52, lat: 41.69, lng: 44.8, tourismNote: "Capital" },
      { name: "Batumi", aqi: 35, lat: 41.64, lng: 41.63, tourismNote: "Black Sea resort" },
      { name: "Kazbegi", aqi: 15, lat: 42.66, lng: 44.62, tourismNote: "Mountain region" },
    ],
  },
  "estonia": {
    overall: 22,
    trend: "stable",
    cities: [
      { name: "Tallinn", aqi: 25, lat: 59.44, lng: 24.75, tourismNote: "Capital" },
      { name: "Tartu", aqi: 18, lat: 58.38, lng: 26.72, tourismNote: "University city" },
    ],
  },
  "greece": {
    overall: 42,
    trend: "stable",
    cities: [
      { name: "Athens", aqi: 55, lat: 37.98, lng: 23.73, tourismNote: "Capital — basin traps smog" },
      { name: "Santorini", aqi: 18, lat: 36.39, lng: 25.46, tourismNote: "Iconic island" },
      { name: "Crete", aqi: 22, lat: 35.24, lng: 24.47, tourismNote: "Largest island" },
      { name: "Thessaloniki", aqi: 48, lat: 40.64, lng: 22.94, tourismNote: "Northern hub" },
    ],
  },
  "italy": {
    overall: 48,
    trend: "stable",
    cities: [
      { name: "Rome", aqi: 52, lat: 41.9, lng: 12.5, tourismNote: "Capital" },
      { name: "Milan", aqi: 65, lat: 45.46, lng: 9.19, tourismNote: "Po Valley pollution" },
      { name: "Naples", aqi: 55, lat: 40.85, lng: 14.27, tourismNote: "Southern hub" },
      { name: "Sardinia", aqi: 18, lat: 39.23, lng: 9.12, tourismNote: "Island resort" },
      { name: "Amalfi Coast", aqi: 22, lat: 40.63, lng: 14.6, tourismNote: "Coastal paradise" },
    ],
  },
  "south-africa": {
    overall: 45,
    trend: "stable",
    cities: [
      { name: "Cape Town", aqi: 30, lat: -33.93, lng: 18.42, tourismNote: "Coastal city" },
      { name: "Johannesburg", aqi: 58, lat: -26.2, lng: 28.05, tourismNote: "Largest city" },
      { name: "Durban", aqi: 42, lat: -29.86, lng: 31.02, tourismNote: "Beach city" },
      { name: "Kruger Area", aqi: 25, lat: -24.01, lng: 31.5, tourismNote: "Safari region" },
    ],
  },
  "kenya": {
    overall: 55,
    trend: "stable",
    cities: [
      { name: "Nairobi", aqi: 62, lat: -1.29, lng: 36.82, tourismNote: "Capital" },
      { name: "Mombasa", aqi: 42, lat: -4.04, lng: 39.67, tourismNote: "Coastal city" },
      { name: "Maasai Mara", aqi: 15, lat: -1.5, lng: 35.15, tourismNote: "Safari heartland" },
      { name: "Diani Beach", aqi: 20, lat: -4.35, lng: 39.57, tourismNote: "Beach destination" },
    ],
  },
  "morocco": {
    overall: 58,
    trend: "stable",
    cities: [
      { name: "Marrakech", aqi: 62, lat: 31.63, lng: -8.0, tourismNote: "Tourist capital" },
      { name: "Casablanca", aqi: 55, lat: 33.57, lng: -7.59, tourismNote: "Economic hub" },
      { name: "Essaouira", aqi: 25, lat: 31.51, lng: -9.77, tourismNote: "Coastal wind city" },
      { name: "Chefchaouen", aqi: 22, lat: 35.17, lng: -5.26, tourismNote: "Blue city" },
    ],
  },
  "egypt": {
    overall: 105,
    trend: "stable",
    cities: [
      { name: "Cairo", aqi: 135, lat: 30.04, lng: 31.24, tourismNote: "Capital — desert dust + traffic" },
      { name: "Sharm el-Sheikh", aqi: 35, lat: 27.98, lng: 34.39, tourismNote: "Red Sea resort" },
      { name: "Hurghada", aqi: 38, lat: 27.26, lng: 33.81, tourismNote: "Diving hub" },
      { name: "Luxor", aqi: 85, lat: 25.69, lng: 32.64, tourismNote: "Valley of Kings" },
      { name: "Alexandria", aqi: 72, lat: 31.2, lng: 29.92, tourismNote: "Mediterranean coast" },
    ],
  },
  "tanzania": {
    overall: 52,
    trend: "stable",
    cities: [
      { name: "Dar es Salaam", aqi: 58, lat: -6.79, lng: 39.28, tourismNote: "Largest city" },
      { name: "Zanzibar", aqi: 22, lat: -6.16, lng: 39.19, tourismNote: "Island paradise" },
      { name: "Arusha", aqi: 35, lat: -3.37, lng: 36.68, tourismNote: "Safari gateway" },
      { name: "Serengeti Area", aqi: 12, lat: -2.33, lng: 34.83, tourismNote: "National park" },
    ],
  },
  "united-arab-emirates": {
    overall: 95,
    trend: "stable",
    cities: [
      { name: "Dubai", aqi: 98, lat: 25.2, lng: 55.27, tourismNote: "Tourism capital — dust storms" },
      { name: "Abu Dhabi", aqi: 92, lat: 24.45, lng: 54.65, tourismNote: "Capital" },
      { name: "Ras Al Khaimah", aqi: 75, lat: 25.79, lng: 55.94, tourismNote: "Adventure tourism" },
    ],
  },
  "cambodia": {
    overall: 72,
    trend: "stable",
    cities: [
      { name: "Phnom Penh", aqi: 78, lat: 11.56, lng: 104.93, tourismNote: "Capital" },
      { name: "Siem Reap", aqi: 55, lat: 13.36, lng: 103.86, tourismNote: "Angkor Wat gateway" },
      { name: "Sihanoukville", aqi: 42, lat: 10.63, lng: 103.52, tourismNote: "Beach city" },
    ],
  },
  "india": {
    overall: 145,
    trend: "worsening",
    cities: [
      { name: "Delhi", aqi: 185, lat: 28.61, lng: 77.21, tourismNote: "Capital — severe pollution" },
      { name: "Mumbai", aqi: 115, lat: 19.08, lng: 72.88, tourismNote: "Financial capital" },
      { name: "Goa", aqi: 35, lat: 15.5, lng: 73.83, tourismNote: "Beach state" },
      { name: "Jaipur", aqi: 125, lat: 26.92, lng: 75.78, tourismNote: "Pink city" },
      { name: "Kerala", aqi: 40, lat: 10.85, lng: 76.27, tourismNote: "Backwaters" },
    ],
  },
  "panama": {
    overall: 38,
    trend: "stable",
    cities: [
      { name: "Panama City", aqi: 45, lat: 8.98, lng: -79.52, tourismNote: "Capital" },
      { name: "Bocas del Toro", aqi: 18, lat: 9.34, lng: -82.24, tourismNote: "Island chain" },
      { name: "Boquete", aqi: 15, lat: 8.78, lng: -82.44, tourismNote: "Mountain town" },
    ],
  },
  "chile": {
    overall: 48,
    trend: "improving",
    cities: [
      { name: "Santiago", aqi: 62, lat: -33.45, lng: -70.67, tourismNote: "Capital — valley smog" },
      { name: "Valparaiso", aqi: 35, lat: -33.05, lng: -71.62, tourismNote: "Coastal art city" },
      { name: "Atacama", aqi: 12, lat: -23.65, lng: -68.15, tourismNote: "Desert" },
      { name: "Patagonia", aqi: 8, lat: -51.73, lng: -72.49, tourismNote: "Pristine wilderness" },
    ],
  },
  "portugal": {
    overall: 28,
    trend: "stable",
    cities: [
      { name: "Lisbon", aqi: 32, lat: 38.72, lng: -9.14, tourismNote: "Capital" },
      { name: "Porto", aqi: 30, lat: 41.15, lng: -8.61, tourismNote: "Wine region" },
      { name: "Algarve", aqi: 18, lat: 37.02, lng: -7.93, tourismNote: "Beach coast" },
      { name: "Madeira", aqi: 12, lat: 32.65, lng: -16.91, tourismNote: "Atlantic island" },
    ],
  },
  "albania": {
    overall: 45,
    trend: "stable",
    cities: [
      { name: "Tirana", aqi: 52, lat: 41.33, lng: 19.82, tourismNote: "Capital" },
      { name: "Saranda", aqi: 22, lat: 39.87, lng: 20.01, tourismNote: "Riviera coast" },
      { name: "Vlora", aqi: 28, lat: 40.47, lng: 19.49, tourismNote: "Beach city" },
    ],
  },
  "uruguay": {
    overall: 25,
    trend: "stable",
    cities: [
      { name: "Montevideo", aqi: 28, lat: -34.9, lng: -56.16, tourismNote: "Capital" },
      { name: "Punta del Este", aqi: 15, lat: -34.97, lng: -54.95, tourismNote: "Beach resort" },
      { name: "Colonia", aqi: 18, lat: -34.47, lng: -57.84, tourismNote: "Historic town" },
    ],
  },
  "sri-lanka": {
    overall: 62,
    trend: "stable",
    cities: [
      { name: "Colombo", aqi: 68, lat: 6.93, lng: 79.84, tourismNote: "Capital" },
      { name: "Kandy", aqi: 42, lat: 7.29, lng: 80.63, tourismNote: "Hill capital" },
      { name: "Galle", aqi: 30, lat: 6.03, lng: 80.22, tourismNote: "Colonial fort city" },
      { name: "Ella", aqi: 18, lat: 6.87, lng: 81.05, tourismNote: "Mountain village" },
    ],
  },
  "ecuador": {
    overall: 42,
    trend: "stable",
    cities: [
      { name: "Quito", aqi: 48, lat: -0.18, lng: -78.47, tourismNote: "Capital at altitude" },
      { name: "Guayaquil", aqi: 52, lat: -2.19, lng: -79.89, tourismNote: "Port city" },
      { name: "Galapagos", aqi: 8, lat: -0.95, lng: -90.97, tourismNote: "Pristine islands" },
      { name: "Cuenca", aqi: 30, lat: -2.9, lng: -79.0, tourismNote: "Colonial city" },
    ],
  },
  "paraguay": {
    overall: 48,
    trend: "stable",
    cities: [
      { name: "Asuncion", aqi: 52, lat: -25.26, lng: -57.58, tourismNote: "Capital" },
      { name: "Ciudad del Este", aqi: 45, lat: -25.51, lng: -54.61, tourismNote: "Border city" },
      { name: "Encarnacion", aqi: 30, lat: -27.33, lng: -55.87, tourismNote: "River city" },
    ],
  },
  "guatemala": {
    overall: 55,
    trend: "stable",
    cities: [
      { name: "Guatemala City", aqi: 62, lat: 14.63, lng: -90.51, tourismNote: "Capital" },
      { name: "Antigua", aqi: 35, lat: 14.56, lng: -90.73, tourismNote: "Colonial gem" },
      { name: "Lake Atitlan", aqi: 22, lat: 14.69, lng: -91.2, tourismNote: "Volcano lake" },
    ],
  },
  "laos": {
    overall: 58,
    trend: "worsening",
    cities: [
      { name: "Vientiane", aqi: 62, lat: 17.97, lng: 102.63, tourismNote: "Capital" },
      { name: "Luang Prabang", aqi: 45, lat: 19.89, lng: 102.14, tourismNote: "UNESCO city" },
      { name: "Vang Vieng", aqi: 35, lat: 18.92, lng: 102.45, tourismNote: "Adventure town" },
    ],
  },
  "north-macedonia": {
    overall: 62,
    trend: "stable",
    cities: [
      { name: "Skopje", aqi: 72, lat: 42.0, lng: 21.43, tourismNote: "Capital — winter smog" },
      { name: "Ohrid", aqi: 28, lat: 41.12, lng: 20.8, tourismNote: "UNESCO lake city" },
    ],
  },
  "montenegro": {
    overall: 35,
    trend: "stable",
    cities: [
      { name: "Podgorica", aqi: 42, lat: 42.44, lng: 19.26, tourismNote: "Capital" },
      { name: "Kotor", aqi: 22, lat: 42.42, lng: 18.77, tourismNote: "Bay of Kotor" },
      { name: "Budva", aqi: 25, lat: 42.29, lng: 18.84, tourismNote: "Beach resort" },
    ],
  },
  "mauritius": {
    overall: 25,
    trend: "stable",
    cities: [
      { name: "Port Louis", aqi: 32, lat: -20.16, lng: 57.5, tourismNote: "Capital" },
      { name: "Grand Baie", aqi: 18, lat: -20.01, lng: 57.58, tourismNote: "Beach resort" },
      { name: "Flic en Flac", aqi: 15, lat: -20.29, lng: 57.37, tourismNote: "West coast" },
    ],
  },
  "cyprus": {
    overall: 35,
    trend: "stable",
    cities: [
      { name: "Nicosia", aqi: 42, lat: 35.17, lng: 33.37, tourismNote: "Capital" },
      { name: "Limassol", aqi: 30, lat: 34.68, lng: 33.04, tourismNote: "Coastal city" },
      { name: "Paphos", aqi: 22, lat: 34.78, lng: 32.42, tourismNote: "Resort city" },
      { name: "Ayia Napa", aqi: 18, lat: 34.98, lng: 34.0, tourismNote: "Party beach" },
    ],
  },
  "malta": {
    overall: 32,
    trend: "stable",
    cities: [
      { name: "Valletta", aqi: 35, lat: 35.9, lng: 14.51, tourismNote: "Capital" },
      { name: "St Julian's", aqi: 32, lat: 35.92, lng: 14.49, tourismNote: "Nightlife hub" },
      { name: "Gozo", aqi: 18, lat: 36.04, lng: 14.24, tourismNote: "Sister island" },
    ],
  },
  "usa": {
    overall: 38,
    trend: "improving",
    cities: [
      { name: "New York", aqi: 42, lat: 40.71, lng: -74.0, tourismNote: "Major hub" },
      { name: "Los Angeles", aqi: 58, lat: 34.05, lng: -118.24, tourismNote: "Car traffic smog" },
      { name: "Miami", aqi: 32, lat: 25.77, lng: -80.19, tourismNote: "Beach city" },
      { name: "Las Vegas", aqi: 52, lat: 36.17, lng: -115.14, tourismNote: "Desert city" },
      { name: "Chicago", aqi: 38, lat: 41.88, lng: -87.63, tourismNote: "Midwest hub" },
    ],
  },
  "uk": {
    overall: 32,
    trend: "improving",
    cities: [
      { name: "London", aqi: 38, lat: 51.51, lng: -0.13, tourismNote: "Capital" },
      { name: "Manchester", aqi: 32, lat: 53.48, lng: -2.24, tourismNote: "Northern hub" },
      { name: "Edinburgh", aqi: 22, lat: 55.95, lng: -3.19, tourismNote: "Scottish capital" },
      { name: "Bristol", aqi: 28, lat: 51.46, lng: -2.59, tourismNote: "Coastal city" },
    ],
  },
  "france": {
    overall: 30,
    trend: "improving",
    cities: [
      { name: "Paris", aqi: 38, lat: 48.86, lng: 2.35, tourismNote: "Capital" },
      { name: "Nice", aqi: 22, lat: 43.71, lng: 7.26, tourismNote: "Riviera coast" },
      { name: "Lyon", aqi: 35, lat: 45.75, lng: 4.83, tourismNote: "Gastronomy hub" },
      { name: "Marseille", aqi: 30, lat: 43.3, lng: 5.37, tourismNote: "Mediterranean port" },
    ],
  },
  "germany": {
    overall: 28,
    trend: "improving",
    cities: [
      { name: "Berlin", aqi: 30, lat: 52.52, lng: 13.4, tourismNote: "Capital" },
      { name: "Munich", aqi: 28, lat: 48.14, lng: 11.58, tourismNote: "Bavaria hub" },
      { name: "Hamburg", aqi: 32, lat: 53.55, lng: 9.99, tourismNote: "Port city" },
      { name: "Frankfurt", aqi: 35, lat: 50.11, lng: 8.68, tourismNote: "Financial centre" },
    ],
  },
  "australia": {
    overall: 22,
    trend: "stable",
    cities: [
      { name: "Sydney", aqi: 25, lat: -33.87, lng: 151.21, tourismNote: "Largest city" },
      { name: "Melbourne", aqi: 22, lat: -37.81, lng: 144.96, tourismNote: "Cultural capital" },
      { name: "Brisbane", aqi: 18, lat: -27.47, lng: 153.03, tourismNote: "Sunshine state" },
      { name: "Gold Coast", aqi: 15, lat: -28.02, lng: 153.43, tourismNote: "Beach resort" },
      { name: "Cairns", aqi: 12, lat: -16.92, lng: 145.77, tourismNote: "Reef gateway" },
    ],
  },
  "canada": {
    overall: 22,
    trend: "stable",
    cities: [
      { name: "Toronto", aqi: 28, lat: 43.65, lng: -79.38, tourismNote: "Largest city" },
      { name: "Vancouver", aqi: 18, lat: 49.28, lng: -123.12, tourismNote: "West coast" },
      { name: "Montreal", aqi: 22, lat: 45.5, lng: -73.57, tourismNote: "French Canada" },
      { name: "Banff", aqi: 8, lat: 51.18, lng: -115.57, tourismNote: "Mountain national park" },
    ],
  },
  "sweden": {
    overall: 18,
    trend: "stable",
    cities: [
      { name: "Stockholm", aqi: 20, lat: 59.33, lng: 18.07, tourismNote: "Capital" },
      { name: "Gothenburg", aqi: 18, lat: 57.71, lng: 11.97, tourismNote: "West coast city" },
      { name: "Malmo", aqi: 22, lat: 55.6, lng: 13.0, tourismNote: "Southern hub" },
    ],
  },
  "russia": {
    overall: 82,
    trend: "stable",
    cities: [
      { name: "Moscow", aqi: 68, lat: 55.76, lng: 37.62, tourismNote: "Capital" },
      { name: "St. Petersburg", aqi: 55, lat: 59.94, lng: 30.32, tourismNote: "Cultural capital" },
      { name: "Novosibirsk", aqi: 95, lat: 54.99, lng: 82.9, tourismNote: "Siberian hub" },
      { name: "Sochi", aqi: 28, lat: 43.6, lng: 39.73, tourismNote: "Black Sea resort" },
    ],
  },
  "ukraine": {
    overall: 55,
    trend: "worsening",
    cities: [
      { name: "Kyiv", aqi: 58, lat: 50.45, lng: 30.52, tourismNote: "Capital" },
      { name: "Lviv", aqi: 45, lat: 49.84, lng: 24.03, tourismNote: "Western hub" },
      { name: "Odessa", aqi: 40, lat: 46.48, lng: 30.73, tourismNote: "Black Sea city" },
    ],
  },
  "china": {
    overall: 135,
    trend: "improving",
    cities: [
      { name: "Beijing", aqi: 155, lat: 39.91, lng: 116.39, tourismNote: "Capital — heavy pollution" },
      { name: "Shanghai", aqi: 82, lat: 31.23, lng: 121.47, tourismNote: "Financial hub" },
      { name: "Chengdu", aqi: 95, lat: 30.66, lng: 104.07, tourismNote: "Panda base" },
      { name: "Guilin", aqi: 42, lat: 25.27, lng: 110.29, tourismNote: "Karst landscape" },
      { name: "Hainan Island", aqi: 18, lat: 19.2, lng: 110.33, tourismNote: "Tropical island resort" },
    ],
  },
  "pakistan": {
    overall: 165,
    trend: "worsening",
    cities: [
      { name: "Lahore", aqi: 195, lat: 31.55, lng: 74.34, tourismNote: "Cultural capital — severe smog" },
      { name: "Karachi", aqi: 142, lat: 24.86, lng: 67.01, tourismNote: "Largest city" },
      { name: "Islamabad", aqi: 88, lat: 33.72, lng: 73.04, tourismNote: "Capital" },
      { name: "Peshawar", aqi: 155, lat: 34.01, lng: 71.58, tourismNote: "Northern hub" },
    ],
  },
  "kazakhstan": {
    overall: 88,
    trend: "stable",
    cities: [
      { name: "Almaty", aqi: 85, lat: 43.22, lng: 76.85, tourismNote: "Largest city" },
      { name: "Astana", aqi: 92, lat: 51.18, lng: 71.45, tourismNote: "Capital" },
      { name: "Shymkent", aqi: 78, lat: 42.32, lng: 69.59, tourismNote: "Southern hub" },
    ],
  },
  "iran": {
    overall: 115,
    trend: "stable",
    cities: [
      { name: "Tehran", aqi: 145, lat: 35.69, lng: 51.39, tourismNote: "Capital — basin traps smog" },
      { name: "Isfahan", aqi: 88, lat: 32.66, lng: 51.68, tourismNote: "Historic city" },
      { name: "Shiraz", aqi: 75, lat: 29.59, lng: 52.58, tourismNote: "Cultural hub" },
      { name: "Mashhad", aqi: 98, lat: 36.3, lng: 59.61, tourismNote: "Pilgrimage city" },
    ],
  },
  "algeria": {
    overall: 62,
    trend: "stable",
    cities: [
      { name: "Algiers", aqi: 68, lat: 36.74, lng: 3.06, tourismNote: "Capital" },
      { name: "Oran", aqi: 55, lat: 35.7, lng: -0.64, tourismNote: "Western hub" },
      { name: "Constantine", aqi: 58, lat: 36.36, lng: 6.61, tourismNote: "Eastern city" },
    ],
  },
  "libya": {
    overall: 78,
    trend: "stable",
    cities: [
      { name: "Tripoli", aqi: 82, lat: 32.9, lng: 13.18, tourismNote: "Capital" },
      { name: "Benghazi", aqi: 72, lat: 32.11, lng: 20.07, tourismNote: "Eastern hub" },
    ],
  },
  "mongolia": {
    overall: 155,
    trend: "worsening",
    cities: [
      { name: "Ulaanbaatar", aqi: 175, lat: 47.91, lng: 106.88, tourismNote: "Capital — severe coal heating smog" },
      { name: "Erdenet", aqi: 72, lat: 49.03, lng: 104.07, tourismNote: "Mining city" },
      { name: "Gobi (rural)", aqi: 25, lat: 44.0, lng: 105.0, tourismNote: "Pristine desert" },
    ],
  },
  "nigeria": {
    overall: 92,
    trend: "worsening",
    cities: [
      { name: "Lagos", aqi: 105, lat: 6.52, lng: 3.38, tourismNote: "Commercial capital" },
      { name: "Abuja", aqi: 72, lat: 9.07, lng: 7.4, tourismNote: "Federal capital" },
      { name: "Kano", aqi: 115, lat: 12.0, lng: 8.52, tourismNote: "Northern hub" },
      { name: "Port Harcourt", aqi: 88, lat: 4.77, lng: 7.01, tourismNote: "Oil delta city" },
    ],
  },
  "rwanda": {
    overall: 42,
    trend: "improving",
    cities: [
      { name: "Kigali", aqi: 45, lat: -1.94, lng: 30.06, tourismNote: "Capital — one of Africa's cleanest" },
      { name: "Musanze", aqi: 28, lat: -1.5, lng: 29.63, tourismNote: "Gorilla trekking gateway" },
      { name: "Gisenyi", aqi: 22, lat: -1.7, lng: 29.26, tourismNote: "Lake Kivu resort" },
    ],
  },
  "uganda": {
    overall: 68,
    trend: "stable",
    cities: [
      { name: "Kampala", aqi: 75, lat: 0.32, lng: 32.58, tourismNote: "Capital" },
      { name: "Entebbe", aqi: 52, lat: 0.05, lng: 32.46, tourismNote: "Airport city" },
      { name: "Bwindi (forest)", aqi: 12, lat: -1.04, lng: 29.71, tourismNote: "Gorilla sanctuary" },
    ],
  },
  "ethiopia": {
    overall: 72,
    trend: "worsening",
    cities: [
      { name: "Addis Ababa", aqi: 78, lat: 9.02, lng: 38.75, tourismNote: "Capital" },
      { name: "Lalibela", aqi: 35, lat: 12.03, lng: 39.04, tourismNote: "Historic churches" },
      { name: "Gondar", aqi: 42, lat: 12.6, lng: 37.47, tourismNote: "Historical city" },
    ],
  },
  "bolivia": {
    overall: 58,
    trend: "stable",
    cities: [
      { name: "La Paz", aqi: 65, lat: -16.5, lng: -68.15, tourismNote: "Seat of government — altitude" },
      { name: "Santa Cruz", aqi: 55, lat: -17.78, lng: -63.18, tourismNote: "Largest city" },
      { name: "Sucre", aqi: 38, lat: -19.04, lng: -65.26, tourismNote: "Constitutional capital" },
      { name: "Salar de Uyuni", aqi: 10, lat: -20.13, lng: -67.49, tourismNote: "Salt flats" },
    ],
  },
  "venezuela": {
    overall: 52,
    trend: "stable",
    cities: [
      { name: "Caracas", aqi: 62, lat: 10.5, lng: -66.92, tourismNote: "Capital" },
      { name: "Maracaibo", aqi: 58, lat: 10.64, lng: -71.61, tourismNote: "Oil city" },
      { name: "Merida", aqi: 32, lat: 8.59, lng: -71.15, tourismNote: "Andes mountain city" },
    ],
  },
  "saudi-arabia": {
    overall: 112,
    trend: "stable",
    cities: [
      { name: "Riyadh", aqi: 125, lat: 24.69, lng: 46.72, tourismNote: "Capital — desert dust" },
      { name: "Jeddah", aqi: 98, lat: 21.54, lng: 39.17, tourismNote: "Red Sea port" },
      { name: "NEOM / Tabuk", aqi: 55, lat: 28.38, lng: 36.56, tourismNote: "New city development" },
      { name: "Al-Ula", aqi: 38, lat: 26.62, lng: 37.92, tourismNote: "Heritage site" },
    ],
  },
};
