/**
 * Cities with population and female-to-male ratio context for the 20–39 prime dating age.
 * Population: UN World Urbanization Prospects, national census, or official estimates.
 * Ratio: Country-level 20–39 sex ratio (PRIME_WOMEN_PER_100_MEN_2039, blended from CIA World
 * Factbook 15-24 and 25-54 bands, UN WPP 2022) with city-type adjustment (tourism /
 * university = better; industrial / port / mining = worse). Used for map and rankings.
 * @see https://population.un.org/wpp/
 * @see https://www.cia.gov/the-world-factbook/field/sex-ratio/
 */

import { getCountryWomenPer100MenPrime } from "./populationDemographics";

export type RatioTier = "better" | "same" | "worse";

export type CityPrimeAge = {
  countrySlug: string;
  name: string;
  lat: number;
  lng: number;
  /** Population (thousands). */
  population: number;
  /** Affects displayed ratio vs country: better = more women, worse = more men. */
  ratioTier: RatioTier;
};

/** Tier multiplier applied to country ratio: women per 100 men. */
const RATIO_TIER_MULT: Record<RatioTier, number> = {
  better: 1.08,
  same: 1,
  worse: 0.92,
};

/** Cities with coordinates and population. Ratio derived from country + ratioTier. */
export const CITIES_PRIME_AGE: CityPrimeAge[] = [
  // Philippines
  { countrySlug: "philippines", name: "Cebu City", lat: 10.3157, lng: 123.8854, population: 964, ratioTier: "better" },
  { countrySlug: "philippines", name: "Davao City", lat: 7.0731, lng: 125.6128, population: 1771, ratioTier: "better" },
  { countrySlug: "philippines", name: "Manila", lat: 14.5995, lng: 120.9842, population: 1846, ratioTier: "worse" },
  { countrySlug: "philippines", name: "Quezon City", lat: 14.6501, lng: 121.0500, population: 2962, ratioTier: "worse" },
  { countrySlug: "philippines", name: "Iloilo City", lat: 10.7202, lng: 122.5621, population: 458, ratioTier: "better" },
  { countrySlug: "philippines", name: "Bacolod", lat: 10.6667, lng: 122.9500, population: 562, ratioTier: "better" },
  { countrySlug: "philippines", name: "Baguio", lat: 16.4023, lng: 120.5960, population: 366, ratioTier: "better" },
  { countrySlug: "philippines", name: "Cagayan de Oro", lat: 8.4542, lng: 124.6319, population: 728, ratioTier: "same" },
  { countrySlug: "philippines", name: "Angeles", lat: 15.1450, lng: 120.5843, population: 462, ratioTier: "worse" },
  { countrySlug: "philippines", name: "Puerto Princesa", lat: 9.7392, lng: 118.7353, population: 307, ratioTier: "better" },
  { countrySlug: "philippines", name: "Zamboanga City", lat: 6.9214, lng: 122.0790, population: 977, ratioTier: "same" },
  { countrySlug: "philippines", name: "General Santos", lat: 6.1167, lng: 125.1667, population: 697, ratioTier: "same" },
  // Thailand
  { countrySlug: "thailand", name: "Chiang Mai", lat: 18.7883, lng: 98.9853, population: 1_198, ratioTier: "better" },
  { countrySlug: "thailand", name: "Bangkok", lat: 13.7563, lng: 100.5018, population: 10_539, ratioTier: "worse" },
  { countrySlug: "thailand", name: "Phuket", lat: 7.8804, lng: 98.3923, population: 418, ratioTier: "same" },
  { countrySlug: "thailand", name: "Khon Kaen", lat: 16.4322, lng: 102.8236, population: 115, ratioTier: "better" },
  { countrySlug: "thailand", name: "Udon Thani", lat: 17.4157, lng: 102.7859, population: 247, ratioTier: "same" },
  { countrySlug: "thailand", name: "Pattaya", lat: 12.9236, lng: 100.8729, population: 119, ratioTier: "worse" },
  { countrySlug: "thailand", name: "Nakhon Ratchasima", lat: 14.9799, lng: 102.0977, population: 174, ratioTier: "same" },
  { countrySlug: "thailand", name: "Chiang Rai", lat: 19.9105, lng: 99.8406, population: 199, ratioTier: "better" },
  { countrySlug: "thailand", name: "Hat Yai", lat: 7.0084, lng: 100.4767, population: 159, ratioTier: "same" },
  // Indonesia
  { countrySlug: "indonesia", name: "Denpasar (Bali)", lat: -8.6705, lng: 115.2126, population: 897, ratioTier: "better" },
  { countrySlug: "indonesia", name: "Jakarta", lat: -6.2088, lng: 106.8456, population: 10_562, ratioTier: "worse" },
  { countrySlug: "indonesia", name: "Surabaya", lat: -7.2575, lng: 112.7521, population: 2848, ratioTier: "same" },
  { countrySlug: "indonesia", name: "Bandung", lat: -6.9175, lng: 107.6191, population: 2503, ratioTier: "better" },
  { countrySlug: "indonesia", name: "Medan", lat: 3.5952, lng: 98.6722, population: 2097, ratioTier: "same" },
  { countrySlug: "indonesia", name: "Yogyakarta", lat: -7.7956, lng: 110.3695, population: 422, ratioTier: "better" },
  { countrySlug: "indonesia", name: "Semarang", lat: -6.9667, lng: 110.4167, population: 1628, ratioTier: "same" },
  { countrySlug: "indonesia", name: "Makassar", lat: -5.1477, lng: 119.4327, population: 1444, ratioTier: "same" },
  { countrySlug: "indonesia", name: "Palembang", lat: -2.9911, lng: 104.7567, population: 1662, ratioTier: "same" },
  // Vietnam
  { countrySlug: "vietnam", name: "Da Nang", lat: 16.0544, lng: 108.2022, population: 1134, ratioTier: "better" },
  { countrySlug: "vietnam", name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, population: 8993, ratioTier: "worse" },
  { countrySlug: "vietnam", name: "Hanoi", lat: 21.0285, lng: 105.8542, population: 8053, ratioTier: "same" },
  { countrySlug: "vietnam", name: "Nha Trang", lat: 12.2388, lng: 109.1967, population: 392, ratioTier: "better" },
  { countrySlug: "vietnam", name: "Hue", lat: 16.4637, lng: 107.5909, population: 333, ratioTier: "better" },
  { countrySlug: "vietnam", name: "Can Tho", lat: 10.0453, lng: 105.7469, population: 1237, ratioTier: "same" },
  { countrySlug: "vietnam", name: "Da Lat", lat: 11.9404, lng: 108.4583, population: 406, ratioTier: "better" },
  { countrySlug: "vietnam", name: "Vung Tau", lat: 10.4111, lng: 107.1362, population: 327, ratioTier: "worse" },
  // Colombia
  { countrySlug: "colombia", name: "Medellín", lat: 6.2476, lng: -75.5658, population: 2540, ratioTier: "better" },
  { countrySlug: "colombia", name: "Bogotá", lat: 4.7110, lng: -74.0721, population: 11074, ratioTier: "worse" },
  { countrySlug: "colombia", name: "Cartagena", lat: 10.3997, lng: -75.5144, population: 914, ratioTier: "better" },
  { countrySlug: "colombia", name: "Cali", lat: 3.4516, lng: -76.5320, population: 2242, ratioTier: "same" },
  { countrySlug: "colombia", name: "Barranquilla", lat: 10.9639, lng: -74.7964, population: 1237, ratioTier: "same" },
  { countrySlug: "colombia", name: "Bucaramanga", lat: 7.1195, lng: -73.1227, population: 581, ratioTier: "better" },
  { countrySlug: "colombia", name: "Pereira", lat: 4.8143, lng: -75.6946, population: 468, ratioTier: "same" },
  // Mexico
  { countrySlug: "mexico", name: "Playa del Carmen", lat: 20.6296, lng: -87.0739, population: 304, ratioTier: "better" },
  { countrySlug: "mexico", name: "Mexico City", lat: 19.4326, lng: -99.1332, population: 9209, ratioTier: "same" },
  { countrySlug: "mexico", name: "Guadalajara", lat: 20.6597, lng: -103.3496, population: 5346, ratioTier: "same" },
  { countrySlug: "mexico", name: "Monterrey", lat: 25.6866, lng: -100.3161, population: 5342, ratioTier: "worse" },
  { countrySlug: "mexico", name: "Cancún", lat: 21.1619, lng: -86.8515, population: 888, ratioTier: "better" },
  { countrySlug: "mexico", name: "Tijuana", lat: 32.5149, lng: -117.0382, population: 1969, ratioTier: "worse" },
  { countrySlug: "mexico", name: "Mérida", lat: 20.9674, lng: -89.5926, population: 921, ratioTier: "better" },
  { countrySlug: "mexico", name: "Oaxaca", lat: 17.0732, lng: -96.7266, population: 264, ratioTier: "better" },
  // Brazil
  { countrySlug: "brazil", name: "Florianópolis", lat: -27.5954, lng: -48.5480, population: 516, ratioTier: "better" },
  { countrySlug: "brazil", name: "São Paulo", lat: -23.5505, lng: -46.6333, population: 12396, ratioTier: "worse" },
  { countrySlug: "brazil", name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, population: 6748, ratioTier: "same" },
  { countrySlug: "brazil", name: "Salvador", lat: -12.9714, lng: -38.5014, population: 2882, ratioTier: "better" },
  { countrySlug: "brazil", name: "Brasília", lat: -15.8267, lng: -47.9218, population: 3015, ratioTier: "worse" },
  { countrySlug: "brazil", name: "Curitiba", lat: -25.4284, lng: -49.2733, population: 1937, ratioTier: "same" },
  { countrySlug: "brazil", name: "Porto Alegre", lat: -30.0346, lng: -51.2177, population: 1484, ratioTier: "same" },
  { countrySlug: "brazil", name: "Fortaleza", lat: -3.7172, lng: -38.5433, population: 2669, ratioTier: "same" },
  // Argentina
  { countrySlug: "argentina", name: "Buenos Aires", lat: -34.6037, lng: -58.3816, population: 3051, ratioTier: "better" },
  { countrySlug: "argentina", name: "Córdoba", lat: -31.4201, lng: -64.1888, population: 1564, ratioTier: "worse" },
  { countrySlug: "argentina", name: "Mendoza", lat: -32.8895, lng: -68.8458, population: 1150, ratioTier: "same" },
  { countrySlug: "argentina", name: "Rosario", lat: -32.9468, lng: -60.6393, population: 1332, ratioTier: "same" },
  // Peru
  { countrySlug: "peru", name: "Cusco", lat: -13.5319, lng: -71.9675, population: 447, ratioTier: "better" },
  { countrySlug: "peru", name: "Lima", lat: -12.0464, lng: -77.0428, population: 10719, ratioTier: "worse" },
  { countrySlug: "peru", name: "Arequipa", lat: -16.4090, lng: -71.5375, population: 1008, ratioTier: "same" },
  { countrySlug: "peru", name: "Trujillo", lat: -8.1116, lng: -79.0285, population: 919, ratioTier: "same" },
  // Costa Rica
  { countrySlug: "costa-rica", name: "San José", lat: 9.9281, lng: -84.0907, population: 342, ratioTier: "better" },
  { countrySlug: "costa-rica", name: "Puerto Limón", lat: 10.0000, lng: -83.0333, population: 58, ratioTier: "worse" },
  { countrySlug: "costa-rica", name: "Alajuela", lat: 10.0155, lng: -84.2142, population: 254, ratioTier: "same" },
  { countrySlug: "costa-rica", name: "Liberia", lat: 10.6350, lng: -85.4377, population: 67, ratioTier: "same" },
  // Dominican Republic
  { countrySlug: "dominican-republic", name: "Santo Domingo", lat: 18.4861, lng: -69.9312, population: 3287, ratioTier: "better" },
  { countrySlug: "dominican-republic", name: "Santiago", lat: 19.4517, lng: -70.6970, population: 1342, ratioTier: "worse" },
  { countrySlug: "dominican-republic", name: "La Romana", lat: 18.4273, lng: -68.9729, population: 130, ratioTier: "same" },
  { countrySlug: "dominican-republic", name: "Puerto Plata", lat: 19.7934, lng: -70.6884, population: 318, ratioTier: "better" },
  // Cambodia
  { countrySlug: "cambodia", name: "Siem Reap", lat: 13.3671, lng: 103.8448, population: 245, ratioTier: "better" },
  { countrySlug: "cambodia", name: "Phnom Penh", lat: 11.5564, lng: 104.9282, population: 2129, ratioTier: "worse" },
  { countrySlug: "cambodia", name: "Battambang", lat: 13.0957, lng: 103.2022, population: 119, ratioTier: "same" },
  { countrySlug: "cambodia", name: "Sihanoukville", lat: 10.6093, lng: 103.5298, population: 89, ratioTier: "same" },
  // Malaysia
  { countrySlug: "malaysia", name: "Penang (George Town)", lat: 5.4164, lng: 100.3327, population: 708, ratioTier: "better" },
  { countrySlug: "malaysia", name: "Kuala Lumpur", lat: 3.1390, lng: 101.6869, population: 1909, ratioTier: "worse" },
  { countrySlug: "malaysia", name: "Johor Bahru", lat: 1.4927, lng: 103.7414, population: 912, ratioTier: "same" },
  { countrySlug: "malaysia", name: "Ipoh", lat: 4.5975, lng: 101.0901, population: 737, ratioTier: "same" },
  { countrySlug: "malaysia", name: "Kota Kinabalu", lat: 5.9804, lng: 116.0735, population: 462, ratioTier: "better" },
  // India
  { countrySlug: "india", name: "Bangalore", lat: 12.9716, lng: 77.5946, population: 13608, ratioTier: "better" },
  { countrySlug: "india", name: "Mumbai", lat: 19.0760, lng: 72.8777, population: 20411, ratioTier: "worse" },
  { countrySlug: "india", name: "Delhi", lat: 28.7041, lng: 77.1025, population: 32941, ratioTier: "worse" },
  { countrySlug: "india", name: "Chennai", lat: 13.0827, lng: 80.2707, population: 11324, ratioTier: "same" },
  { countrySlug: "india", name: "Hyderabad", lat: 17.3850, lng: 78.4867, population: 10494, ratioTier: "same" },
  { countrySlug: "india", name: "Pune", lat: 18.5204, lng: 73.8567, population: 7764, ratioTier: "better" },
  { countrySlug: "india", name: "Goa (Panaji)", lat: 15.4909, lng: 73.8278, population: 114, ratioTier: "better" },
  { countrySlug: "india", name: "Kolkata", lat: 22.5726, lng: 88.3639, population: 15134, ratioTier: "same" },
  // Japan
  { countrySlug: "japan", name: "Fukuoka", lat: 33.5904, lng: 130.4017, population: 1592, ratioTier: "better" },
  { countrySlug: "japan", name: "Tokyo", lat: 35.6762, lng: 139.6503, population: 14094, ratioTier: "worse" },
  { countrySlug: "japan", name: "Osaka", lat: 34.6937, lng: 135.5023, population: 2726, ratioTier: "same" },
  { countrySlug: "japan", name: "Kyoto", lat: 35.0116, lng: 135.7681, population: 1465, ratioTier: "better" },
  { countrySlug: "japan", name: "Nagoya", lat: 35.1815, lng: 136.9066, population: 2322, ratioTier: "same" },
  { countrySlug: "japan", name: "Sapporo", lat: 43.0618, lng: 141.3545, population: 1968, ratioTier: "same" },
  { countrySlug: "japan", name: "Hiroshima", lat: 34.3853, lng: 132.4553, population: 1194, ratioTier: "better" },
  // South Korea
  { countrySlug: "south-korea", name: "Busan", lat: 35.1796, lng: 129.0756, population: 3429, ratioTier: "better" },
  { countrySlug: "south-korea", name: "Seoul", lat: 37.5665, lng: 126.9780, population: 9668, ratioTier: "worse" },
  { countrySlug: "south-korea", name: "Incheon", lat: 37.4563, lng: 126.7052, population: 2952, ratioTier: "same" },
  { countrySlug: "south-korea", name: "Daegu", lat: 35.8714, lng: 128.6014, population: 2422, ratioTier: "same" },
  { countrySlug: "south-korea", name: "Gwangju", lat: 35.1595, lng: 126.8526, population: 1479, ratioTier: "better" },
  // China
  { countrySlug: "china", name: "Chengdu", lat: 30.5728, lng: 104.0668, population: 20935, ratioTier: "better" },
  { countrySlug: "china", name: "Shenzhen", lat: 22.5431, lng: 114.0579, population: 17561, ratioTier: "worse" },
  { countrySlug: "china", name: "Shanghai", lat: 31.2304, lng: 121.4737, population: 26317, ratioTier: "same" },
  { countrySlug: "china", name: "Beijing", lat: 39.9042, lng: 116.4074, population: 21542, ratioTier: "same" },
  { countrySlug: "china", name: "Hangzhou", lat: 30.2741, lng: 120.1551, population: 10036, ratioTier: "better" },
  { countrySlug: "china", name: "Xiamen", lat: 24.4798, lng: 118.0894, population: 5164, ratioTier: "same" },
  { countrySlug: "china", name: "Kunming", lat: 25.0406, lng: 102.7129, population: 6850, ratioTier: "better" },
  // USA
  { countrySlug: "usa", name: "New York City", lat: 40.7128, lng: -74.0060, population: 8336, ratioTier: "better" },
  { countrySlug: "usa", name: "Houston", lat: 29.7604, lng: -95.3698, population: 2303, ratioTier: "worse" },
  { countrySlug: "usa", name: "Miami", lat: 25.7617, lng: -80.1918, population: 467, ratioTier: "better" },
  { countrySlug: "usa", name: "Los Angeles", lat: 34.0522, lng: -118.2437, population: 3979, ratioTier: "same" },
  { countrySlug: "usa", name: "Chicago", lat: 41.8781, lng: -87.6298, population: 2746, ratioTier: "same" },
  { countrySlug: "usa", name: "San Francisco", lat: 37.7749, lng: -122.4194, population: 873, ratioTier: "same" },
  { countrySlug: "usa", name: "Las Vegas", lat: 36.1699, lng: -115.1398, population: 641, ratioTier: "worse" },
  { countrySlug: "usa", name: "Austin", lat: 30.2672, lng: -97.7431, population: 978, ratioTier: "same" },
  // UK
  { countrySlug: "uk", name: "London", lat: 51.5074, lng: -0.1278, population: 9102, ratioTier: "better" },
  { countrySlug: "uk", name: "Manchester", lat: 53.4808, lng: -2.2426, population: 552, ratioTier: "worse" },
  { countrySlug: "uk", name: "Birmingham", lat: 52.4862, lng: -1.8904, population: 1142, ratioTier: "same" },
  { countrySlug: "uk", name: "Edinburgh", lat: 55.9533, lng: -3.1883, population: 518, ratioTier: "better" },
  { countrySlug: "uk", name: "Leeds", lat: 53.8008, lng: -1.5491, population: 789, ratioTier: "same" },
  { countrySlug: "uk", name: "Liverpool", lat: 53.4084, lng: -2.9916, population: 498, ratioTier: "same" },
  { countrySlug: "uk", name: "Bristol", lat: 51.4545, lng: -2.5879, population: 463, ratioTier: "better" },
  // Spain
  { countrySlug: "spain", name: "Barcelona", lat: 41.3851, lng: 2.1734, population: 1620, ratioTier: "better" },
  { countrySlug: "spain", name: "Madrid", lat: 40.4168, lng: -3.7038, population: 3223, ratioTier: "same" },
  { countrySlug: "spain", name: "Valencia", lat: 39.4699, lng: -0.3763, population: 791, ratioTier: "better" },
  { countrySlug: "spain", name: "Seville", lat: 37.3891, lng: -5.9845, population: 688, ratioTier: "same" },
  { countrySlug: "spain", name: "Bilbao", lat: 43.2630, lng: -2.9350, population: 346, ratioTier: "worse" },
  { countrySlug: "spain", name: "Málaga", lat: 36.7213, lng: -4.4214, population: 578, ratioTier: "better" },
  // Germany
  { countrySlug: "germany", name: "Berlin", lat: 52.5200, lng: 13.4050, population: 3769, ratioTier: "better" },
  { countrySlug: "germany", name: "Munich", lat: 48.1351, lng: 11.5820, population: 1472, ratioTier: "same" },
  { countrySlug: "germany", name: "Hamburg", lat: 53.5511, lng: 9.9937, population: 1841, ratioTier: "same" },
  { countrySlug: "germany", name: "Cologne", lat: 50.9375, lng: 6.9603, population: 1086, ratioTier: "same" },
  { countrySlug: "germany", name: "Frankfurt", lat: 50.1109, lng: 8.6821, population: 764, ratioTier: "worse" },
  { countrySlug: "germany", name: "Wolfsburg", lat: 52.4225, lng: 10.7865, population: 124, ratioTier: "worse" },
  { countrySlug: "germany", name: "Leipzig", lat: 51.3397, lng: 12.3731, population: 597, ratioTier: "better" },
  // France
  { countrySlug: "france", name: "Paris", lat: 48.8566, lng: 2.3522, population: 2161, ratioTier: "same" },
  { countrySlug: "france", name: "Lyon", lat: 45.7640, lng: 4.8357, population: 516, ratioTier: "better" },
  { countrySlug: "france", name: "Marseille", lat: 43.2965, lng: 5.3698, population: 870, ratioTier: "worse" },
  { countrySlug: "france", name: "Nice", lat: 43.7102, lng: 7.2620, population: 340, ratioTier: "better" },
  { countrySlug: "france", name: "Toulouse", lat: 43.6047, lng: 1.4442, population: 479, ratioTier: "better" },
  { countrySlug: "france", name: "Bordeaux", lat: 44.8378, lng: -0.5792, population: 254, ratioTier: "same" },
  // Italy
  { countrySlug: "italy", name: "Milan", lat: 45.4642, lng: 9.1900, population: 1379, ratioTier: "better" },
  { countrySlug: "italy", name: "Rome", lat: 41.9028, lng: 12.4964, population: 2873, ratioTier: "same" },
  { countrySlug: "italy", name: "Florence", lat: 43.7696, lng: 11.2558, population: 383, ratioTier: "better" },
  { countrySlug: "italy", name: "Naples", lat: 40.8518, lng: 14.2681, population: 967, ratioTier: "same" },
  { countrySlug: "italy", name: "Turin", lat: 45.0703, lng: 7.6869, population: 870, ratioTier: "worse" },
  { countrySlug: "italy", name: "Venice", lat: 45.4408, lng: 12.3155, population: 261, ratioTier: "same" },
  // Kenya
  { countrySlug: "kenya", name: "Nairobi", lat: -1.2921, lng: 36.8219, population: 4397, ratioTier: "better" },
  { countrySlug: "kenya", name: "Mombasa", lat: -4.0437, lng: 39.6682, population: 1208, ratioTier: "worse" },
  { countrySlug: "kenya", name: "Kisumu", lat: -0.1022, lng: 34.7617, population: 409, ratioTier: "same" },
  { countrySlug: "kenya", name: "Nakuru", lat: -0.3031, lng: 36.0800, population: 570, ratioTier: "same" },
  // Nigeria
  { countrySlug: "nigeria", name: "Lagos", lat: 6.5244, lng: 3.3792, population: 15400, ratioTier: "same" },
  { countrySlug: "nigeria", name: "Abuja", lat: 9.0765, lng: 7.3986, population: 3560, ratioTier: "worse" },
  { countrySlug: "nigeria", name: "Port Harcourt", lat: 4.8156, lng: 7.0498, population: 1865, ratioTier: "worse" },
  { countrySlug: "nigeria", name: "Ibadan", lat: 7.3775, lng: 3.9470, population: 3550, ratioTier: "same" },
  { countrySlug: "nigeria", name: "Kano", lat: 12.0022, lng: 8.5920, population: 4240, ratioTier: "same" },
  // South Africa
  { countrySlug: "south-africa", name: "Cape Town", lat: -33.9249, lng: 18.4241, population: 4618, ratioTier: "better" },
  { countrySlug: "south-africa", name: "Johannesburg", lat: -26.2041, lng: 28.0473, population: 5639, ratioTier: "worse" },
  { countrySlug: "south-africa", name: "Durban", lat: -29.8587, lng: 31.0218, population: 3120, ratioTier: "same" },
  { countrySlug: "south-africa", name: "Pretoria", lat: -25.7479, lng: 28.2293, population: 2432, ratioTier: "same" },
  // Morocco
  { countrySlug: "morocco", name: "Marrakech", lat: 31.6295, lng: -7.9811, population: 928, ratioTier: "better" },
  { countrySlug: "morocco", name: "Casablanca", lat: 33.5731, lng: -7.5898, population: 3718, ratioTier: "worse" },
  { countrySlug: "morocco", name: "Fez", lat: 34.0181, lng: -5.0078, population: 1112, ratioTier: "same" },
  { countrySlug: "morocco", name: "Tangier", lat: 35.7595, lng: -5.8340, population: 947, ratioTier: "same" },
  { countrySlug: "morocco", name: "Rabat", lat: 34.0209, lng: -6.8416, population: 577, ratioTier: "same" },
  // Egypt
  { countrySlug: "egypt", name: "Alexandria", lat: 31.2001, lng: 29.9187, population: 5218, ratioTier: "better" },
  { countrySlug: "egypt", name: "Cairo", lat: 30.0444, lng: 31.2357, population: 21320, ratioTier: "worse" },
  { countrySlug: "egypt", name: "Giza", lat: 30.0131, lng: 31.2089, population: 9019, ratioTier: "same" },
  { countrySlug: "egypt", name: "Sharm El Sheikh", lat: 27.9158, lng: 34.3300, population: 73, ratioTier: "worse" },
  // Turkey
  { countrySlug: "turkey", name: "Istanbul", lat: 41.0082, lng: 28.9784, population: 15460, ratioTier: "better" },
  { countrySlug: "turkey", name: "Ankara", lat: 39.9334, lng: 32.8597, population: 5747, ratioTier: "worse" },
  { countrySlug: "turkey", name: "Izmir", lat: 38.4192, lng: 27.1287, population: 4320, ratioTier: "same" },
  { countrySlug: "turkey", name: "Antalya", lat: 36.8969, lng: 30.7133, population: 1304, ratioTier: "better" },
  { countrySlug: "turkey", name: "Bodrum", lat: 37.0344, lng: 27.4305, population: 197, ratioTier: "better" },
  { countrySlug: "turkey", name: "Bursa", lat: 40.1885, lng: 29.0610, population: 2033, ratioTier: "same" },
  // Poland
  { countrySlug: "poland", name: "Kraków", lat: 50.0647, lng: 19.9450, population: 779, ratioTier: "better" },
  { countrySlug: "poland", name: "Warsaw", lat: 52.2297, lng: 21.0122, population: 1860, ratioTier: "same" },
  { countrySlug: "poland", name: "Wrocław", lat: 51.1079, lng: 17.0385, population: 643, ratioTier: "better" },
  { countrySlug: "poland", name: "Gdańsk", lat: 54.3520, lng: 18.6466, population: 471, ratioTier: "same" },
  { countrySlug: "poland", name: "Katowice", lat: 50.2649, lng: 19.0238, population: 293, ratioTier: "worse" },
  { countrySlug: "poland", name: "Poznań", lat: 52.4064, lng: 16.9252, population: 534, ratioTier: "same" },
  // Romania
  { countrySlug: "romania", name: "Cluj-Napoca", lat: 46.7712, lng: 23.6236, population: 324, ratioTier: "better" },
  { countrySlug: "romania", name: "Bucharest", lat: 44.4268, lng: 26.1025, population: 1831, ratioTier: "worse" },
  { countrySlug: "romania", name: "Timișoara", lat: 45.7489, lng: 21.2087, population: 319, ratioTier: "same" },
  { countrySlug: "romania", name: "Brașov", lat: 45.6427, lng: 25.5887, population: 253, ratioTier: "better" },
  { countrySlug: "romania", name: "Iași", lat: 47.1585, lng: 27.6014, population: 378, ratioTier: "same" },
  // Portugal
  { countrySlug: "portugal", name: "Lisbon", lat: 38.7223, lng: -9.1393, population: 544, ratioTier: "better" },
  { countrySlug: "portugal", name: "Porto", lat: 41.1579, lng: -8.6291, population: 237, ratioTier: "worse" },
  { countrySlug: "portugal", name: "Faro", lat: 37.0194, lng: -7.9304, population: 61, ratioTier: "same" },
  { countrySlug: "portugal", name: "Braga", lat: 41.5503, lng: -8.4201, population: 193, ratioTier: "same" },
  // Netherlands
  { countrySlug: "netherlands", name: "Amsterdam", lat: 52.3676, lng: 4.9041, population: 872, ratioTier: "better" },
  { countrySlug: "netherlands", name: "Rotterdam", lat: 51.9225, lng: 4.4792, population: 651, ratioTier: "worse" },
  { countrySlug: "netherlands", name: "The Hague", lat: 52.0705, lng: 4.3007, population: 548, ratioTier: "same" },
  { countrySlug: "netherlands", name: "Utrecht", lat: 52.0907, lng: 5.1214, population: 359, ratioTier: "same" },
  // Canada
  { countrySlug: "canada", name: "Montreal", lat: 45.5017, lng: -73.5673, population: 1780, ratioTier: "better" },
  { countrySlug: "canada", name: "Toronto", lat: 43.6532, lng: -79.3832, population: 2732, ratioTier: "same" },
  { countrySlug: "canada", name: "Vancouver", lat: 49.2827, lng: -123.1207, population: 631, ratioTier: "same" },
  { countrySlug: "canada", name: "Calgary", lat: 51.0447, lng: -114.0719, population: 1305, ratioTier: "worse" },
  { countrySlug: "canada", name: "Ottawa", lat: 45.4215, lng: -75.6972, population: 994, ratioTier: "same" },
  // Australia
  { countrySlug: "australia", name: "Melbourne", lat: -37.8136, lng: 144.9631, population: 4936, ratioTier: "better" },
  { countrySlug: "australia", name: "Sydney", lat: -33.8688, lng: 151.2093, population: 5312, ratioTier: "same" },
  { countrySlug: "australia", name: "Brisbane", lat: -27.4698, lng: 153.0251, population: 2560, ratioTier: "same" },
  { countrySlug: "australia", name: "Perth", lat: -31.9505, lng: 115.8605, population: 2142, ratioTier: "worse" },
  { countrySlug: "australia", name: "Gold Coast", lat: -28.0167, lng: 153.4000, population: 710, ratioTier: "same" },
  { countrySlug: "australia", name: "Adelaide", lat: -34.9285, lng: 138.6007, population: 1346, ratioTier: "same" },
  // Russia
  { countrySlug: "russia", name: "Saint Petersburg", lat: 59.9343, lng: 30.3351, population: 5383, ratioTier: "better" },
  { countrySlug: "russia", name: "Moscow", lat: 55.7558, lng: 37.6173, population: 13104, ratioTier: "same" },
  { countrySlug: "russia", name: "Kazan", lat: 55.8304, lng: 49.0661, population: 1252, ratioTier: "same" },
  { countrySlug: "russia", name: "Sochi", lat: 43.6028, lng: 39.7342, population: 443, ratioTier: "better" },
  { countrySlug: "russia", name: "Norilsk", lat: 69.3550, lng: 88.2027, population: 182, ratioTier: "worse" },
  // Ukraine
  { countrySlug: "ukraine", name: "Kyiv", lat: 50.4501, lng: 30.5234, population: 2962, ratioTier: "better" },
  { countrySlug: "ukraine", name: "Lviv", lat: 49.8397, lng: 24.0297, population: 724, ratioTier: "better" },
  { countrySlug: "ukraine", name: "Odesa", lat: 46.4825, lng: 30.7233, population: 1017, ratioTier: "same" },
  { countrySlug: "ukraine", name: "Kharkiv", lat: 49.9935, lng: 36.2304, population: 1421, ratioTier: "same" },
  // Chile
  { countrySlug: "chile", name: "Valparaíso", lat: -33.0472, lng: -71.6127, population: 296, ratioTier: "better" },
  { countrySlug: "chile", name: "Santiago", lat: -33.4489, lng: -70.6693, population: 6685, ratioTier: "same" },
  { countrySlug: "chile", name: "Antofagasta", lat: -23.6500, lng: -70.4000, population: 361, ratioTier: "worse" },
  { countrySlug: "chile", name: "Viña del Mar", lat: -33.0247, lng: -71.5518, population: 325, ratioTier: "better" },
  { countrySlug: "chile", name: "Concepción", lat: -36.8270, lng: -73.0503, population: 223, ratioTier: "same" },
  // Tanzania
  { countrySlug: "tanzania", name: "Dar es Salaam", lat: -6.7924, lng: 39.2083, population: 6096, ratioTier: "same" },
  { countrySlug: "tanzania", name: "Zanzibar City", lat: -6.1659, lng: 39.2026, population: 219, ratioTier: "better" },
  { countrySlug: "tanzania", name: "Mwanza", lat: -2.5167, lng: 32.9000, population: 706, ratioTier: "worse" },
  { countrySlug: "tanzania", name: "Arusha", lat: -3.3869, lng: 36.6831, population: 416, ratioTier: "same" },
  // Ethiopia
  { countrySlug: "ethiopia", name: "Addis Ababa", lat: 9.0320, lng: 38.7469, population: 5180, ratioTier: "better" },
  { countrySlug: "ethiopia", name: "Dire Dawa", lat: 9.5931, lng: 41.8661, population: 493, ratioTier: "worse" },
  { countrySlug: "ethiopia", name: "Mek'ele", lat: 13.4967, lng: 39.4753, population: 324, ratioTier: "same" },
  // Uganda
  { countrySlug: "uganda", name: "Kampala", lat: 0.3476, lng: 32.5825, population: 1680, ratioTier: "better" },
  { countrySlug: "uganda", name: "Entebbe", lat: 0.0564, lng: 32.4375, population: 90, ratioTier: "worse" },
  { countrySlug: "uganda", name: "Gulu", lat: 2.7746, lng: 32.2990, population: 154, ratioTier: "same" },
  // Rwanda
  { countrySlug: "rwanda", name: "Kigali", lat: -1.9536, lng: 30.0606, population: 1132, ratioTier: "better" },
  { countrySlug: "rwanda", name: "Gisenyi", lat: -1.7028, lng: 29.2564, population: 136, ratioTier: "worse" },
  { countrySlug: "rwanda", name: "Butare", lat: -2.5963, lng: 29.7394, population: 90, ratioTier: "same" },
  // Bolivia
  { countrySlug: "bolivia", name: "Santa Cruz", lat: -17.7833, lng: -63.1821, population: 1812, ratioTier: "better" },
  { countrySlug: "bolivia", name: "La Paz", lat: -16.5000, lng: -68.1500, population: 1897, ratioTier: "same" },
  { countrySlug: "bolivia", name: "El Alto", lat: -16.5097, lng: -68.1631, population: 943, ratioTier: "worse" },
  { countrySlug: "bolivia", name: "Cochabamba", lat: -17.3935, lng: -66.1570, population: 632, ratioTier: "same" },
  // Venezuela
  { countrySlug: "venezuela", name: "Valencia", lat: 10.1620, lng: -68.0076, population: 1385, ratioTier: "better" },
  { countrySlug: "venezuela", name: "Caracas", lat: 10.4806, lng: -66.9036, population: 2843, ratioTier: "same" },
  { countrySlug: "venezuela", name: "Maracaibo", lat: 10.6422, lng: -71.6124, population: 2220, ratioTier: "worse" },
  // Pakistan
  { countrySlug: "pakistan", name: "Lahore", lat: 31.5204, lng: 74.3587, population: 13124, ratioTier: "better" },
  { countrySlug: "pakistan", name: "Karachi", lat: 24.8607, lng: 67.0011, population: 15771, ratioTier: "worse" },
  { countrySlug: "pakistan", name: "Islamabad", lat: 33.6844, lng: 73.0479, population: 1012, ratioTier: "worse" },
  { countrySlug: "pakistan", name: "Rawalpindi", lat: 33.6007, lng: 73.0679, population: 2098, ratioTier: "same" },
  { countrySlug: "pakistan", name: "Faisalabad", lat: 31.4181, lng: 73.0792, population: 3204, ratioTier: "same" },
  // Saudi Arabia
  { countrySlug: "saudi-arabia", name: "Jeddah", lat: 21.5433, lng: 39.1728, population: 4697, ratioTier: "better" },
  { countrySlug: "saudi-arabia", name: "Riyadh", lat: 24.7136, lng: 46.6753, population: 7676, ratioTier: "worse" },
  { countrySlug: "saudi-arabia", name: "Mecca", lat: 21.4225, lng: 39.8262, population: 2042, ratioTier: "same" },
  { countrySlug: "saudi-arabia", name: "Medina", lat: 24.5247, lng: 39.5692, population: 1513, ratioTier: "same" },
  { countrySlug: "saudi-arabia", name: "Dammam", lat: 26.4207, lng: 50.0888, population: 1431, ratioTier: "worse" },
  // Greece
  { countrySlug: "greece", name: "Athens", lat: 37.9838, lng: 23.7275, population: 664, ratioTier: "better" },
  { countrySlug: "greece", name: "Thessaloniki", lat: 40.6401, lng: 22.9444, population: 325, ratioTier: "worse" },
  { countrySlug: "greece", name: "Patras", lat: 38.2466, lng: 21.7346, population: 214, ratioTier: "same" },
  { countrySlug: "greece", name: "Heraklion", lat: 35.3387, lng: 25.1442, population: 173, ratioTier: "better" },
  // Czech Republic
  { countrySlug: "czech-republic", name: "Prague", lat: 50.0755, lng: 14.4378, population: 1309, ratioTier: "better" },
  { countrySlug: "czech-republic", name: "Brno", lat: 49.1951, lng: 16.6068, population: 381, ratioTier: "same" },
  { countrySlug: "czech-republic", name: "Ostrava", lat: 49.8209, lng: 18.2625, population: 284, ratioTier: "worse" },
  { countrySlug: "czech-republic", name: "České Budějovice", lat: 48.9745, lng: 14.4747, population: 94, ratioTier: "same" },
  // Hungary
  { countrySlug: "hungary", name: "Budapest", lat: 47.4979, lng: 19.0402, population: 1752, ratioTier: "better" },
  { countrySlug: "hungary", name: "Debrecen", lat: 47.5316, lng: 21.6273, population: 201, ratioTier: "same" },
  { countrySlug: "hungary", name: "Miskolc", lat: 48.1031, lng: 20.7781, population: 157, ratioTier: "worse" },
  { countrySlug: "hungary", name: "Szeged", lat: 46.2530, lng: 20.1414, population: 161, ratioTier: "same" },
  // Croatia
  { countrySlug: "croatia", name: "Zagreb", lat: 45.8150, lng: 15.9819, population: 769, ratioTier: "better" },
  { countrySlug: "croatia", name: "Split", lat: 43.5081, lng: 16.4402, population: 178, ratioTier: "worse" },
  { countrySlug: "croatia", name: "Rijeka", lat: 45.3271, lng: 14.4422, population: 128, ratioTier: "same" },
  { countrySlug: "croatia", name: "Dubrovnik", lat: 42.6507, lng: 18.0944, population: 42, ratioTier: "better" },
  // Serbia
  { countrySlug: "serbia", name: "Belgrade", lat: 44.7866, lng: 20.4489, population: 1371, ratioTier: "better" },
  { countrySlug: "serbia", name: "Novi Sad", lat: 45.2671, lng: 19.8335, population: 368, ratioTier: "worse" },
  { countrySlug: "serbia", name: "Niš", lat: 43.3209, lng: 21.8958, population: 260, ratioTier: "same" },
  // Sweden
  { countrySlug: "sweden", name: "Stockholm", lat: 59.3293, lng: 18.0686, population: 1583, ratioTier: "better" },
  { countrySlug: "sweden", name: "Gothenburg", lat: 57.7089, lng: 11.9746, population: 580, ratioTier: "worse" },
  { countrySlug: "sweden", name: "Malmö", lat: 55.6050, lng: 13.0038, population: 351, ratioTier: "same" },
  { countrySlug: "sweden", name: "Uppsala", lat: 59.8586, lng: 17.6389, population: 233, ratioTier: "better" },
  // Norway
  { countrySlug: "norway", name: "Oslo", lat: 59.9139, lng: 10.7522, population: 697, ratioTier: "better" },
  { countrySlug: "norway", name: "Bergen", lat: 60.3913, lng: 5.3221, population: 286, ratioTier: "same" },
  { countrySlug: "norway", name: "Stavanger", lat: 58.9700, lng: 5.7331, population: 237, ratioTier: "worse" },
  { countrySlug: "norway", name: "Trondheim", lat: 63.4305, lng: 10.3951, population: 212, ratioTier: "same" },
  // Denmark
  { countrySlug: "denmark", name: "Copenhagen", lat: 55.6761, lng: 12.5683, population: 1346, ratioTier: "better" },
  { countrySlug: "denmark", name: "Aarhus", lat: 56.1629, lng: 10.2039, population: 280, ratioTier: "worse" },
  { countrySlug: "denmark", name: "Odense", lat: 55.4038, lng: 10.4024, population: 180, ratioTier: "same" },
  // Finland
  { countrySlug: "finland", name: "Helsinki", lat: 60.1699, lng: 24.9384, population: 656, ratioTier: "better" },
  { countrySlug: "finland", name: "Tampere", lat: 61.4978, lng: 23.7610, population: 244, ratioTier: "worse" },
  { countrySlug: "finland", name: "Turku", lat: 60.4518, lng: 22.2666, population: 194, ratioTier: "same" },
  // Ireland
  { countrySlug: "ireland", name: "Dublin", lat: 53.3498, lng: -6.2603, population: 1388, ratioTier: "better" },
  { countrySlug: "ireland", name: "Cork", lat: 51.8985, lng: -8.4756, population: 222, ratioTier: "worse" },
  { countrySlug: "ireland", name: "Galway", lat: 53.2707, lng: -9.0492, population: 83, ratioTier: "same" },
  // Iran
  { countrySlug: "iran", name: "Shiraz", lat: 29.5918, lng: 52.5836, population: 1565, ratioTier: "better" },
  { countrySlug: "iran", name: "Tehran", lat: 35.6892, lng: 51.3890, population: 8694, ratioTier: "worse" },
  { countrySlug: "iran", name: "Isfahan", lat: 32.6546, lng: 51.6680, population: 1961, ratioTier: "same" },
  { countrySlug: "iran", name: "Mashhad", lat: 36.2974, lng: 59.6062, population: 3204, ratioTier: "same" },
  // Kazakhstan
  { countrySlug: "kazakhstan", name: "Almaty", lat: 43.2220, lng: 76.8512, population: 2009, ratioTier: "better" },
  { countrySlug: "kazakhstan", name: "Astana", lat: 51.1694, lng: 71.4491, population: 1232, ratioTier: "same" },
  { countrySlug: "kazakhstan", name: "Shymkent", lat: 42.3417, lng: 69.5901, population: 1038, ratioTier: "same" },
  { countrySlug: "kazakhstan", name: "Aktobe", lat: 50.2839, lng: 57.1670, population: 387, ratioTier: "worse" },
  // Mongolia
  { countrySlug: "mongolia", name: "Ulaanbaatar", lat: 47.8864, lng: 106.9057, population: 1602, ratioTier: "same" },
  { countrySlug: "mongolia", name: "Erdenet", lat: 49.0333, lng: 104.0833, population: 97, ratioTier: "worse" },
  { countrySlug: "mongolia", name: "Darkhan", lat: 49.4867, lng: 105.9228, population: 74, ratioTier: "same" },
  // Algeria
  { countrySlug: "algeria", name: "Algiers", lat: 36.7538, lng: 3.0588, population: 3416, ratioTier: "better" },
  { countrySlug: "algeria", name: "Oran", lat: 35.6969, lng: -0.6331, population: 803, ratioTier: "worse" },
  { countrySlug: "algeria", name: "Constantine", lat: 36.3650, lng: 6.6147, population: 448, ratioTier: "same" },
  // Estonia
  { countrySlug: "estonia", name: "Tallinn", lat: 59.4370, lng: 24.7536, population: 438, ratioTier: "better" },
  { countrySlug: "estonia", name: "Tartu", lat: 58.3780, lng: 26.7290, population: 97, ratioTier: "worse" },
  { countrySlug: "estonia", name: "Narva", lat: 59.3772, lng: 28.1789, population: 54, ratioTier: "same" },
  // Bulgaria
  { countrySlug: "bulgaria", name: "Sofia", lat: 42.6977, lng: 23.3219, population: 1286, ratioTier: "better" },
  { countrySlug: "bulgaria", name: "Plovdiv", lat: 42.1354, lng: 24.7453, population: 347, ratioTier: "worse" },
  { countrySlug: "bulgaria", name: "Varna", lat: 43.2141, lng: 27.9147, population: 348, ratioTier: "same" },
  // Slovakia
  { countrySlug: "slovakia", name: "Bratislava", lat: 48.1486, lng: 17.1077, population: 437, ratioTier: "better" },
  { countrySlug: "slovakia", name: "Košice", lat: 48.7164, lng: 21.2611, population: 229, ratioTier: "worse" },
  { countrySlug: "slovakia", name: "Prešov", lat: 48.9984, lng: 21.2339, population: 89, ratioTier: "same" },
  // Lithuania
  { countrySlug: "lithuania", name: "Vilnius", lat: 54.6872, lng: 25.2797, population: 588, ratioTier: "better" },
  { countrySlug: "lithuania", name: "Kaunas", lat: 54.8985, lng: 23.9036, population: 297, ratioTier: "same" },
  { countrySlug: "lithuania", name: "Klaipėda", lat: 55.7033, lng: 21.1443, population: 152, ratioTier: "worse" },
  // Latvia
  { countrySlug: "latvia", name: "Riga", lat: 56.9496, lng: 24.1052, population: 614, ratioTier: "better" },
  { countrySlug: "latvia", name: "Daugavpils", lat: 55.8728, lng: 26.5162, population: 82, ratioTier: "worse" },
  { countrySlug: "latvia", name: "Liepāja", lat: 56.5047, lng: 21.0108, population: 68, ratioTier: "same" },
  // Slovenia
  { countrySlug: "slovenia", name: "Ljubljana", lat: 46.0569, lng: 14.5058, population: 295, ratioTier: "better" },
  { countrySlug: "slovenia", name: "Maribor", lat: 46.5547, lng: 15.6459, population: 96, ratioTier: "worse" },
  { countrySlug: "slovenia", name: "Celje", lat: 46.2361, lng: 15.2675, population: 38, ratioTier: "same" },
  // Malta
  { countrySlug: "malta", name: "Valletta", lat: 35.8989, lng: 14.5146, population: 6, ratioTier: "better" },
  { countrySlug: "malta", name: "Sliema", lat: 35.9125, lng: 14.5019, population: 22, ratioTier: "worse" },
  { countrySlug: "malta", name: "Victoria (Gozo)", lat: 36.0424, lng: 14.2396, population: 7, ratioTier: "same" },
  // Cyprus
  { countrySlug: "cyprus", name: "Limassol", lat: 34.6841, lng: 33.0379, population: 184, ratioTier: "better" },
  { countrySlug: "cyprus", name: "Nicosia", lat: 35.1856, lng: 33.3823, population: 326, ratioTier: "worse" },
  { countrySlug: "cyprus", name: "Larnaca", lat: 34.9229, lng: 33.6233, population: 85, ratioTier: "same" },
  // Albania
  { countrySlug: "albania", name: "Tirana", lat: 41.3275, lng: 19.8187, population: 418, ratioTier: "better" },
  { countrySlug: "albania", name: "Durrës", lat: 41.3231, lng: 19.4417, population: 175, ratioTier: "worse" },
  { countrySlug: "albania", name: "Vlorë", lat: 40.4667, lng: 19.4897, population: 131, ratioTier: "same" },
  // North Macedonia
  { countrySlug: "north-macedonia", name: "Skopje", lat: 41.9973, lng: 21.4280, population: 526, ratioTier: "better" },
  { countrySlug: "north-macedonia", name: "Bitola", lat: 41.0311, lng: 21.3403, population: 74, ratioTier: "worse" },
  { countrySlug: "north-macedonia", name: "Ohrid", lat: 41.1171, lng: 20.8018, population: 42, ratioTier: "same" },
  // Montenegro
  { countrySlug: "montenegro", name: "Podgorica", lat: 42.4304, lng: 19.2594, population: 150, ratioTier: "better" },
  { countrySlug: "montenegro", name: "Nikšić", lat: 42.7731, lng: 18.9445, population: 58, ratioTier: "worse" },
  { countrySlug: "montenegro", name: "Budva", lat: 42.2861, lng: 18.8400, population: 22, ratioTier: "same" },
  // Bosnia and Herzegovina
  { countrySlug: "bosnia-and-herzegovina", name: "Sarajevo", lat: 43.8516, lng: 18.3864, population: 275, ratioTier: "better" },
  { countrySlug: "bosnia-and-herzegovina", name: "Banja Luka", lat: 44.7722, lng: 17.1910, population: 199, ratioTier: "worse" },
  { countrySlug: "bosnia-and-herzegovina", name: "Mostar", lat: 43.3438, lng: 17.8078, population: 113, ratioTier: "same" },
  // Moldova
  { countrySlug: "moldova", name: "Chișinău", lat: 47.0105, lng: 28.8638, population: 639, ratioTier: "better" },
  { countrySlug: "moldova", name: "Tiraspol", lat: 46.8427, lng: 29.6291, population: 134, ratioTier: "worse" },
  { countrySlug: "moldova", name: "Bălți", lat: 47.7631, lng: 27.9289, population: 102, ratioTier: "same" },
  // Libya
  { countrySlug: "libya", name: "Tripoli", lat: 32.9024, lng: 13.1803, population: 1158, ratioTier: "same" },
  { countrySlug: "libya", name: "Benghazi", lat: 32.1150, lng: 20.0686, population: 750, ratioTier: "worse" },
  { countrySlug: "libya", name: "Misrata", lat: 32.3754, lng: 15.0925, population: 386, ratioTier: "worse" },
  { countrySlug: "libya", name: "Derna", lat: 32.7543, lng: 22.6352, population: 100, ratioTier: "same" },
  // Belgium
  { countrySlug: "belgium", name: "Brussels", lat: 50.8503, lng: 4.3517, population: 1218, ratioTier: "better" },
  { countrySlug: "belgium", name: "Ghent", lat: 51.0543, lng: 3.7174, population: 265, ratioTier: "better" },
  { countrySlug: "belgium", name: "Antwerp", lat: 51.2194, lng: 4.4025, population: 529, ratioTier: "same" },
  { countrySlug: "belgium", name: "Bruges", lat: 51.2093, lng: 3.2247, population: 118, ratioTier: "same" },
  { countrySlug: "belgium", name: "Liège", lat: 50.6326, lng: 5.5797, population: 197, ratioTier: "worse" },
  // Austria
  { countrySlug: "austria", name: "Vienna", lat: 48.2082, lng: 16.3738, population: 1897, ratioTier: "better" },
  { countrySlug: "austria", name: "Innsbruck", lat: 47.2692, lng: 11.4041, population: 132, ratioTier: "better" },
  { countrySlug: "austria", name: "Graz", lat: 47.0707, lng: 15.4395, population: 291, ratioTier: "same" },
  { countrySlug: "austria", name: "Salzburg", lat: 47.8095, lng: 13.0550, population: 157, ratioTier: "same" },
  { countrySlug: "austria", name: "Linz", lat: 48.3069, lng: 14.2858, population: 205, ratioTier: "worse" },
  // Switzerland
  { countrySlug: "switzerland", name: "Geneva", lat: 46.2044, lng: 6.1432, population: 201, ratioTier: "better" },
  { countrySlug: "switzerland", name: "Zurich", lat: 47.3769, lng: 8.5417, population: 434, ratioTier: "same" },
  { countrySlug: "switzerland", name: "Basel", lat: 47.5596, lng: 7.5886, population: 178, ratioTier: "same" },
  { countrySlug: "switzerland", name: "Lausanne", lat: 46.5197, lng: 6.6323, population: 140, ratioTier: "better" },
  { countrySlug: "switzerland", name: "Bern", lat: 46.9480, lng: 7.4474, population: 134, ratioTier: "worse" },
  // Luxembourg
  { countrySlug: "luxembourg", name: "Luxembourg City", lat: 49.6116, lng: 6.1319, population: 120, ratioTier: "better" },
  { countrySlug: "luxembourg", name: "Esch-sur-Alzette", lat: 49.4957, lng: 5.9808, population: 36, ratioTier: "worse" },
  { countrySlug: "luxembourg", name: "Differdange", lat: 49.5231, lng: 5.8912, population: 27, ratioTier: "same" },
];

/** Women per 100 men (25–39 proxy) for a city. Uses country ratio + tier. */
export function getCityWomenPer100Men(city: CityPrimeAge): number {
  const countryRatio = getCountryWomenPer100MenPrime(city.countrySlug);
  const mult = RATIO_TIER_MULT[city.ratioTier];
  return Math.round(countryRatio * mult);
}

/** Cities for a country, sorted by ratio (best first) then by population desc. */
export function getCitiesForCountry(countrySlug: string): (CityPrimeAge & { womenPer100Men: number })[] {
  const list = CITIES_PRIME_AGE.filter((c) => c.countrySlug === countrySlug).map((c) => ({
    ...c,
    womenPer100Men: getCityWomenPer100Men(c),
  }));
  list.sort((a, b) => {
    const r = b.womenPer100Men - a.womenPer100Men;
    if (r !== 0) return r;
    return b.population - a.population;
  });
  return list;
}

/** All cities with computed ratio, for global view. */
export function getAllCitiesWithRatio(): (CityPrimeAge & { womenPer100Men: number })[] {
  return CITIES_PRIME_AGE.map((c) => ({ ...c, womenPer100Men: getCityWomenPer100Men(c) }));
}
