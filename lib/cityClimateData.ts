/**
 * Real monthly climate data for major cities per country.
 * Sources: World Meteorological Organization, meteoblue, climate-data.org
 * Format: 12 months starting January.
 */

export type MonthlyClimate = {
  avg: number;   // °C average
  high: number;  // °C daytime high
  low: number;   // °C nighttime low
  rain: number;  // mm
};

export type CityClimate = {
  name: string;
  lat: number;
  lng: number;
  months: MonthlyClimate[];
};

type CountryCityMap = Record<string, CityClimate[]>;

export const CITY_CLIMATE_DATA: CountryCityMap = {
  philippines: [
    {
      name: "Manila", lat: 14.5995, lng: 120.9842,
      months: [
        { avg: 26.5, high: 30, low: 23, rain: 14 }, { avg: 26.7, high: 30, low: 23, rain: 13 },
        { avg: 28.1, high: 31, low: 24, rain: 18 }, { avg: 29.6, high: 33, low: 25, rain: 24 },
        { avg: 30.1, high: 34, low: 26, rain: 132 }, { avg: 29.3, high: 33, low: 26, rain: 254 },
        { avg: 28.4, high: 31, low: 25, rain: 432 }, { avg: 28.2, high: 31, low: 25, rain: 422 },
        { avg: 28.1, high: 31, low: 25, rain: 348 }, { avg: 27.8, high: 31, low: 24, rain: 193 },
        { avg: 27.1, high: 31, low: 23, rain: 76 },  { avg: 26.4, high: 30, low: 22, rain: 40 },
      ],
    },
    {
      name: "Cebu", lat: 10.3157, lng: 123.8854,
      months: [
        { avg: 25.7, high: 30, low: 21, rain: 52 }, { avg: 25.9, high: 31, low: 21, rain: 39 },
        { avg: 27.1, high: 33, low: 22, rain: 30 }, { avg: 28.7, high: 35, low: 23, rain: 46 },
        { avg: 29.3, high: 34, low: 25, rain: 130 }, { avg: 28.8, high: 33, low: 25, rain: 177 },
        { avg: 28.3, high: 32, low: 24, rain: 162 }, { avg: 28.0, high: 32, low: 24, rain: 153 },
        { avg: 27.9, high: 32, low: 24, rain: 151 }, { avg: 27.8, high: 31, low: 23, rain: 165 },
        { avg: 27.1, high: 30, low: 22, rain: 116 }, { avg: 26.1, high: 30, low: 21, rain: 78 },
      ],
    },
    {
      name: "Davao", lat: 7.0731, lng: 125.6128,
      months: [
        { avg: 26.9, high: 30, low: 23, rain: 116 }, { avg: 27.0, high: 31, low: 23, rain: 79 },
        { avg: 28.1, high: 32, low: 24, rain: 82 },  { avg: 28.9, high: 33, low: 25, rain: 98 },
        { avg: 28.7, high: 33, low: 25, rain: 141 }, { avg: 28.2, high: 32, low: 25, rain: 152 },
        { avg: 27.9, high: 32, low: 24, rain: 157 }, { avg: 27.8, high: 31, low: 24, rain: 152 },
        { avg: 27.8, high: 31, low: 24, rain: 143 }, { avg: 27.7, high: 31, low: 24, rain: 141 },
        { avg: 27.5, high: 31, low: 24, rain: 138 }, { avg: 27.1, high: 30, low: 23, rain: 125 },
      ],
    },
    {
      name: "Baguio", lat: 16.4023, lng: 120.596,
      months: [
        { avg: 14.8, high: 18, low: 11, rain: 48 }, { avg: 14.9, high: 18, low: 11, rain: 27 },
        { avg: 16.1, high: 20, low: 12, rain: 27 }, { avg: 17.6, high: 22, low: 13, rain: 35 },
        { avg: 18.6, high: 22, low: 15, rain: 169 }, { avg: 18.9, high: 22, low: 16, rain: 471 },
        { avg: 18.4, high: 21, low: 16, rain: 740 }, { avg: 18.3, high: 21, low: 16, rain: 706 },
        { avg: 18.0, high: 21, low: 16, rain: 563 }, { avg: 17.5, high: 21, low: 15, rain: 241 },
        { avg: 16.5, high: 20, low: 13, rain: 105 }, { avg: 15.3, high: 19, low: 12, rain: 56 },
      ],
    },
  ],

  thailand: [
    {
      name: "Bangkok", lat: 13.7563, lng: 100.5018,
      months: [
        { avg: 26.6, high: 31, low: 22, rain: 10 }, { avg: 27.9, high: 33, low: 23, rain: 27 },
        { avg: 29.4, high: 34, low: 24, rain: 31 }, { avg: 30.5, high: 35, low: 26, rain: 72 },
        { avg: 29.8, high: 34, low: 25, rain: 188 }, { avg: 29.3, high: 33, low: 25, rain: 152 },
        { avg: 28.8, high: 32, low: 25, rain: 160 }, { avg: 28.7, high: 32, low: 25, rain: 177 },
        { avg: 28.5, high: 32, low: 24, rain: 320 }, { avg: 28.2, high: 32, low: 24, rain: 231 },
        { avg: 27.7, high: 32, low: 23, rain: 47 },  { avg: 26.5, high: 31, low: 21, rain: 9 },
      ],
    },
    {
      name: "Chiang Mai", lat: 18.7883, lng: 98.9853,
      months: [
        { avg: 22.7, high: 28, low: 15, rain: 6 },  { avg: 24.5, high: 30, low: 17, rain: 7 },
        { avg: 27.3, high: 33, low: 21, rain: 12 }, { avg: 29.5, high: 36, low: 23, rain: 37 },
        { avg: 28.4, high: 34, low: 23, rain: 161 }, { avg: 28.2, high: 32, low: 24, rain: 126 },
        { avg: 27.8, high: 31, low: 24, rain: 179 }, { avg: 27.3, high: 31, low: 23, rain: 240 },
        { avg: 27.2, high: 31, low: 23, rain: 241 }, { avg: 26.0, high: 30, low: 22, rain: 96 },
        { avg: 24.2, high: 30, low: 18, rain: 36 }, { avg: 21.9, high: 28, low: 14, rain: 9 },
      ],
    },
    {
      name: "Phuket", lat: 7.8804, lng: 98.3923,
      months: [
        { avg: 27.2, high: 32, low: 22, rain: 34 },  { avg: 27.4, high: 33, low: 22, rain: 37 },
        { avg: 28.0, high: 33, low: 23, rain: 56 },  { avg: 28.5, high: 33, low: 24, rain: 124 },
        { avg: 28.4, high: 32, low: 25, rain: 291 }, { avg: 28.1, high: 31, low: 25, rain: 250 },
        { avg: 27.8, high: 31, low: 25, rain: 268 }, { avg: 27.6, high: 31, low: 25, rain: 264 },
        { avg: 27.5, high: 31, low: 25, rain: 381 }, { avg: 27.5, high: 31, low: 25, rain: 312 },
        { avg: 28.0, high: 32, low: 23, rain: 180 }, { avg: 27.7, high: 32, low: 22, rain: 62 },
      ],
    },
    {
      name: "Pattaya", lat: 12.9236, lng: 100.8729,
      months: [
        { avg: 26.9, high: 31, low: 23, rain: 14 }, { avg: 27.8, high: 32, low: 23, rain: 18 },
        { avg: 29.0, high: 33, low: 24, rain: 33 }, { avg: 30.2, high: 34, low: 25, rain: 56 },
        { avg: 29.9, high: 33, low: 25, rain: 161 }, { avg: 29.3, high: 33, low: 25, rain: 122 },
        { avg: 28.8, high: 32, low: 25, rain: 131 }, { avg: 28.6, high: 32, low: 25, rain: 153 },
        { avg: 28.2, high: 31, low: 25, rain: 298 }, { avg: 27.9, high: 31, low: 24, rain: 235 },
        { avg: 27.5, high: 31, low: 23, rain: 56 },  { avg: 26.7, high: 31, low: 22, rain: 12 },
      ],
    },
  ],

  indonesia: [
    {
      name: "Bali (Denpasar)", lat: -8.6705, lng: 115.2126,
      months: [
        { avg: 27.3, high: 30, low: 24, rain: 304 }, { avg: 27.4, high: 30, low: 24, rain: 257 },
        { avg: 27.5, high: 31, low: 24, rain: 204 }, { avg: 28.2, high: 31, low: 24, rain: 85 },
        { avg: 27.7, high: 31, low: 23, rain: 61 },  { avg: 27.0, high: 30, low: 23, rain: 53 },
        { avg: 26.8, high: 29, low: 23, rain: 36 },  { avg: 26.8, high: 30, low: 22, rain: 29 },
        { avg: 27.0, high: 30, low: 23, rain: 34 },  { avg: 27.5, high: 31, low: 24, rain: 72 },
        { avg: 27.9, high: 31, low: 24, rain: 130 }, { avg: 27.4, high: 30, low: 24, rain: 249 },
      ],
    },
    {
      name: "Jakarta", lat: -6.2088, lng: 106.8456,
      months: [
        { avg: 27.1, high: 30, low: 24, rain: 340 }, { avg: 27.2, high: 30, low: 24, rain: 289 },
        { avg: 27.5, high: 31, low: 24, rain: 197 }, { avg: 27.9, high: 32, low: 24, rain: 130 },
        { avg: 28.2, high: 32, low: 24, rain: 111 }, { avg: 27.5, high: 31, low: 24, rain: 98 },
        { avg: 27.2, high: 31, low: 23, rain: 66 },  { avg: 27.3, high: 31, low: 23, rain: 67 },
        { avg: 27.7, high: 31, low: 24, rain: 82 },  { avg: 28.0, high: 32, low: 24, rain: 93 },
        { avg: 27.8, high: 31, low: 24, rain: 163 }, { avg: 27.2, high: 30, low: 24, rain: 250 },
      ],
    },
    {
      name: "Yogyakarta", lat: -7.7956, lng: 110.3695,
      months: [
        { avg: 26.4, high: 30, low: 23, rain: 352 }, { avg: 26.5, high: 30, low: 23, rain: 290 },
        { avg: 27.0, high: 31, low: 23, rain: 247 }, { avg: 27.3, high: 32, low: 23, rain: 122 },
        { avg: 27.5, high: 32, low: 23, rain: 64 },  { avg: 26.8, high: 31, low: 22, rain: 49 },
        { avg: 26.5, high: 31, low: 22, rain: 33 },  { avg: 26.7, high: 31, low: 22, rain: 25 },
        { avg: 27.3, high: 32, low: 23, rain: 37 },  { avg: 27.6, high: 32, low: 23, rain: 105 },
        { avg: 27.2, high: 31, low: 23, rain: 197 }, { avg: 26.6, high: 30, low: 23, rain: 308 },
      ],
    },
    {
      name: "Lombok", lat: -8.6574, lng: 116.3231,
      months: [
        { avg: 26.9, high: 30, low: 23, rain: 196 }, { avg: 27.0, high: 30, low: 23, rain: 143 },
        { avg: 27.3, high: 31, low: 23, rain: 140 }, { avg: 28.0, high: 32, low: 24, rain: 74 },
        { avg: 27.8, high: 32, low: 23, rain: 34 },  { avg: 27.1, high: 30, low: 23, rain: 21 },
        { avg: 26.7, high: 30, low: 22, rain: 13 },  { avg: 26.8, high: 30, low: 22, rain: 11 },
        { avg: 27.2, high: 31, low: 23, rain: 17 },  { avg: 27.7, high: 32, low: 23, rain: 47 },
        { avg: 27.8, high: 31, low: 23, rain: 85 },  { avg: 27.1, high: 30, low: 23, rain: 157 },
      ],
    },
  ],

  vietnam: [
    {
      name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297,
      months: [
        { avg: 27.1, high: 32, low: 22, rain: 14 },  { avg: 28.0, high: 33, low: 22, rain: 4 },
        { avg: 29.0, high: 34, low: 23, rain: 13 },  { avg: 30.1, high: 35, low: 24, rain: 43 },
        { avg: 29.5, high: 34, low: 25, rain: 221 }, { avg: 28.9, high: 32, low: 25, rain: 330 },
        { avg: 28.4, high: 32, low: 25, rain: 315 }, { avg: 28.1, high: 32, low: 24, rain: 270 },
        { avg: 28.0, high: 31, low: 24, rain: 327 }, { avg: 27.9, high: 31, low: 24, rain: 266 },
        { avg: 27.5, high: 31, low: 23, rain: 116 }, { avg: 27.0, high: 31, low: 22, rain: 36 },
      ],
    },
    {
      name: "Hanoi", lat: 21.0285, lng: 105.8542,
      months: [
        { avg: 17.0, high: 19, low: 15, rain: 18 }, { avg: 18.1, high: 20, low: 16, rain: 27 },
        { avg: 20.2, high: 23, low: 18, rain: 43 }, { avg: 24.0, high: 28, low: 21, rain: 91 },
        { avg: 27.5, high: 32, low: 24, rain: 192 }, { avg: 29.2, high: 34, low: 25, rain: 240 },
        { avg: 29.4, high: 33, low: 25, rain: 288 }, { avg: 28.9, high: 32, low: 25, rain: 318 },
        { avg: 27.2, high: 31, low: 24, rain: 254 }, { avg: 24.6, high: 29, low: 21, rain: 99 },
        { avg: 20.9, high: 25, low: 17, rain: 40 }, { avg: 17.5, high: 20, low: 14, rain: 19 },
      ],
    },
    {
      name: "Da Nang", lat: 16.0544, lng: 108.2022,
      months: [
        { avg: 21.6, high: 24, low: 19, rain: 103 }, { avg: 22.4, high: 25, low: 20, rain: 45 },
        { avg: 24.1, high: 28, low: 21, rain: 25 },  { avg: 26.7, high: 31, low: 23, rain: 28 },
        { avg: 29.2, high: 34, low: 25, rain: 56 },  { avg: 30.2, high: 35, low: 26, rain: 43 },
        { avg: 30.1, high: 35, low: 26, rain: 54 },  { avg: 29.6, high: 34, low: 26, rain: 91 },
        { avg: 27.9, high: 32, low: 25, rain: 351 }, { avg: 25.8, high: 29, low: 23, rain: 614 },
        { avg: 23.6, high: 26, low: 21, rain: 432 }, { avg: 22.0, high: 25, low: 19, rain: 210 },
      ],
    },
    {
      name: "Nha Trang", lat: 12.2388, lng: 109.1967,
      months: [
        { avg: 25.0, high: 28, low: 22, rain: 46 }, { avg: 25.2, high: 29, low: 22, rain: 16 },
        { avg: 26.0, high: 30, low: 22, rain: 25 }, { avg: 27.7, high: 32, low: 24, rain: 25 },
        { avg: 28.8, high: 33, low: 25, rain: 42 }, { avg: 29.0, high: 33, low: 26, rain: 30 },
        { avg: 28.8, high: 33, low: 25, rain: 35 }, { avg: 28.8, high: 33, low: 25, rain: 36 },
        { avg: 28.1, high: 32, low: 25, rain: 120 }, { avg: 27.0, high: 31, low: 24, rain: 383 },
        { avg: 26.1, high: 29, low: 24, rain: 436 }, { avg: 25.3, high: 28, low: 22, rain: 192 },
      ],
    },
  ],

  colombia: [
    {
      name: "Medellín", lat: 6.2476, lng: -75.5658,
      months: [
        { avg: 22.3, high: 28, low: 16, rain: 71 },  { avg: 22.5, high: 29, low: 16, rain: 79 },
        { avg: 22.8, high: 29, low: 17, rain: 132 }, { avg: 22.8, high: 28, low: 17, rain: 209 },
        { avg: 22.7, high: 28, low: 17, rain: 188 }, { avg: 22.5, high: 28, low: 17, rain: 101 },
        { avg: 22.5, high: 29, low: 16, rain: 86 },  { avg: 22.5, high: 28, low: 16, rain: 116 },
        { avg: 22.5, high: 28, low: 17, rain: 171 }, { avg: 22.1, high: 28, low: 17, rain: 211 },
        { avg: 22.0, high: 28, low: 17, rain: 185 }, { avg: 22.2, high: 28, low: 17, rain: 103 },
      ],
    },
    {
      name: "Bogotá", lat: 4.711, lng: -74.0721,
      months: [
        { avg: 13.9, high: 19, low: 9, rain: 47 },  { avg: 14.2, high: 19, low: 9, rain: 63 },
        { avg: 14.3, high: 19, low: 9, rain: 91 },  { avg: 14.2, high: 18, low: 9, rain: 127 },
        { avg: 14.3, high: 18, low: 9, rain: 121 }, { avg: 14.3, high: 18, low: 9, rain: 57 },
        { avg: 13.6, high: 18, low: 8, rain: 44 },  { avg: 13.6, high: 18, low: 8, rain: 53 },
        { avg: 13.9, high: 18, low: 9, rain: 86 },  { avg: 14.1, high: 18, low: 9, rain: 172 },
        { avg: 14.0, high: 18, low: 9, rain: 131 }, { avg: 13.9, high: 19, low: 9, rain: 68 },
      ],
    },
    {
      name: "Cartagena", lat: 10.3997, lng: -75.5144,
      months: [
        { avg: 27.5, high: 30, low: 25, rain: 7 },  { avg: 27.5, high: 31, low: 24, rain: 5 },
        { avg: 28.0, high: 31, low: 25, rain: 7 },  { avg: 28.6, high: 31, low: 26, rain: 40 },
        { avg: 28.8, high: 31, low: 27, rain: 116 }, { avg: 28.5, high: 31, low: 26, rain: 74 },
        { avg: 28.3, high: 31, low: 26, rain: 93 },  { avg: 28.5, high: 31, low: 26, rain: 107 },
        { avg: 28.8, high: 32, low: 26, rain: 130 }, { avg: 28.3, high: 31, low: 26, rain: 237 },
        { avg: 27.9, high: 31, low: 25, rain: 197 }, { avg: 27.5, high: 30, low: 25, rain: 51 },
      ],
    },
    {
      name: "Cali", lat: 3.4516, lng: -76.532,
      months: [
        { avg: 23.9, high: 30, low: 17, rain: 97 },  { avg: 24.0, high: 30, low: 17, rain: 105 },
        { avg: 23.7, high: 30, low: 17, rain: 145 }, { avg: 23.6, high: 29, low: 17, rain: 164 },
        { avg: 23.5, high: 29, low: 17, rain: 131 }, { avg: 23.2, high: 29, low: 17, rain: 75 },
        { avg: 23.1, high: 30, low: 16, rain: 53 },  { avg: 23.3, high: 30, low: 16, rain: 73 },
        { avg: 23.3, high: 29, low: 17, rain: 124 }, { avg: 23.1, high: 29, low: 17, rain: 177 },
        { avg: 23.1, high: 29, low: 17, rain: 164 }, { avg: 23.7, high: 30, low: 17, rain: 113 },
      ],
    },
  ],

  brazil: [
    {
      name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729,
      months: [
        { avg: 26.7, high: 30, low: 23, rain: 137 }, { avg: 27.3, high: 31, low: 23, rain: 108 },
        { avg: 27.1, high: 30, low: 23, rain: 130 }, { avg: 25.0, high: 28, low: 21, rain: 107 },
        { avg: 22.9, high: 26, low: 19, rain: 55 },  { avg: 21.3, high: 24, low: 18, rain: 53 },
        { avg: 21.0, high: 24, low: 17, rain: 41 },  { avg: 21.4, high: 25, low: 17, rain: 49 },
        { avg: 22.5, high: 25, low: 19, rain: 66 },  { avg: 23.2, high: 26, low: 19, rain: 79 },
        { avg: 24.5, high: 28, low: 21, rain: 87 },  { avg: 26.1, high: 29, low: 22, rain: 117 },
      ],
    },
    {
      name: "São Paulo", lat: -23.5505, lng: -46.6333,
      months: [
        { avg: 23.1, high: 27, low: 19, rain: 231 }, { avg: 23.4, high: 28, low: 19, rain: 207 },
        { avg: 22.6, high: 27, low: 18, rain: 157 }, { avg: 21.0, high: 25, low: 16, rain: 80 },
        { avg: 18.9, high: 23, low: 14, rain: 78 },  { avg: 17.5, high: 21, low: 13, rain: 56 },
        { avg: 17.4, high: 22, low: 13, rain: 45 },  { avg: 18.4, high: 23, low: 14, rain: 44 },
        { avg: 19.4, high: 24, low: 14, rain: 87 },  { avg: 21.0, high: 25, low: 16, rain: 128 },
        { avg: 22.0, high: 26, low: 17, rain: 132 }, { avg: 23.0, high: 27, low: 18, rain: 215 },
      ],
    },
    {
      name: "Florianópolis", lat: -27.5954, lng: -48.548,
      months: [
        { avg: 25.9, high: 30, low: 21, rain: 190 }, { avg: 25.5, high: 30, low: 21, rain: 139 },
        { avg: 24.4, high: 28, low: 20, rain: 142 }, { avg: 21.9, high: 26, low: 17, rain: 105 },
        { avg: 19.2, high: 24, low: 14, rain: 108 }, { avg: 17.4, high: 21, low: 13, rain: 80 },
        { avg: 17.0, high: 21, low: 13, rain: 92 },  { avg: 17.8, high: 22, low: 13, rain: 106 },
        { avg: 19.4, high: 24, low: 15, rain: 120 }, { avg: 21.7, high: 26, low: 17, rain: 136 },
        { avg: 23.3, high: 27, low: 19, rain: 135 }, { avg: 25.3, high: 29, low: 21, rain: 156 },
      ],
    },
  ],

  mexico: [
    {
      name: "Mexico City", lat: 19.4326, lng: -99.1332,
      months: [
        { avg: 13.6, high: 20, low: 7, rain: 11 },  { avg: 14.7, high: 22, low: 7, rain: 7 },
        { avg: 16.5, high: 24, low: 9, rain: 14 },  { avg: 18.0, high: 25, low: 11, rain: 27 },
        { avg: 18.8, high: 25, low: 12, rain: 59 }, { avg: 17.6, high: 23, low: 12, rain: 113 },
        { avg: 16.8, high: 22, low: 12, rain: 146 }, { avg: 16.9, high: 22, low: 12, rain: 116 },
        { avg: 16.5, high: 22, low: 12, rain: 122 }, { avg: 15.5, high: 21, low: 10, rain: 54 },
        { avg: 14.4, high: 22, low: 8, rain: 14 },  { avg: 13.3, high: 20, low: 7, rain: 7 },
      ],
    },
    {
      name: "Cancún", lat: 21.1619, lng: -86.8515,
      months: [
        { avg: 24.4, high: 29, low: 19, rain: 67 },  { avg: 24.3, high: 30, low: 18, rain: 41 },
        { avg: 25.4, high: 32, low: 19, rain: 27 },  { avg: 27.2, high: 33, low: 21, rain: 22 },
        { avg: 29.0, high: 35, low: 23, rain: 75 },  { avg: 29.5, high: 35, low: 24, rain: 131 },
        { avg: 29.2, high: 35, low: 24, rain: 75 },  { avg: 29.6, high: 35, low: 24, rain: 84 },
        { avg: 28.9, high: 34, low: 24, rain: 175 }, { avg: 27.6, high: 32, low: 23, rain: 148 },
        { avg: 26.2, high: 31, low: 21, rain: 117 }, { avg: 24.7, high: 29, low: 19, rain: 80 },
      ],
    },
    {
      name: "Puerto Vallarta", lat: 20.6534, lng: -105.2253,
      months: [
        { avg: 22.4, high: 27, low: 18, rain: 18 }, { avg: 22.5, high: 28, low: 17, rain: 8 },
        { avg: 23.1, high: 29, low: 17, rain: 5 },  { avg: 25.0, high: 31, low: 19, rain: 5 },
        { avg: 27.4, high: 33, low: 22, rain: 8 },  { avg: 29.3, high: 34, low: 24, rain: 75 },
        { avg: 29.3, high: 33, low: 25, rain: 207 }, { avg: 29.3, high: 33, low: 25, rain: 257 },
        { avg: 29.0, high: 33, low: 25, rain: 263 }, { avg: 27.3, high: 32, low: 23, rain: 87 },
        { avg: 25.1, high: 30, low: 20, rain: 14 }, { avg: 22.8, high: 28, low: 18, rain: 9 },
      ],
    },
    {
      name: "Guadalajara", lat: 20.6597, lng: -103.3496,
      months: [
        { avg: 16.7, high: 24, low: 9, rain: 15 },  { avg: 17.7, high: 26, low: 9, rain: 8 },
        { avg: 19.8, high: 28, low: 11, rain: 11 }, { avg: 21.7, high: 29, low: 13, rain: 14 },
        { avg: 23.3, high: 30, low: 15, rain: 17 }, { avg: 22.7, high: 29, low: 16, rain: 122 },
        { avg: 21.5, high: 27, low: 16, rain: 216 }, { avg: 21.7, high: 27, low: 16, rain: 195 },
        { avg: 21.5, high: 27, low: 16, rain: 166 }, { avg: 19.9, high: 26, low: 14, rain: 49 },
        { avg: 18.2, high: 26, low: 10, rain: 12 }, { avg: 16.6, high: 24, low: 9, rain: 8 },
      ],
    },
  ],

  argentina: [
    {
      name: "Buenos Aires", lat: -34.6037, lng: -58.3816,
      months: [
        { avg: 25.5, high: 29, low: 20, rain: 112 }, { avg: 24.8, high: 28, low: 20, rain: 79 },
        { avg: 21.8, high: 25, low: 17, rain: 120 }, { avg: 17.7, high: 22, low: 13, rain: 82 },
        { avg: 14.0, high: 18, low: 10, rain: 72 },  { avg: 11.1, high: 15, low: 7, rain: 64 },
        { avg: 11.1, high: 14, low: 7, rain: 55 },   { avg: 12.1, high: 16, low: 8, rain: 60 },
        { avg: 14.3, high: 18, low: 10, rain: 79 },  { avg: 18.4, high: 22, low: 13, rain: 91 },
        { avg: 21.3, high: 25, low: 16, rain: 79 },  { avg: 24.3, high: 28, low: 19, rain: 103 },
      ],
    },
    {
      name: "Córdoba", lat: -31.4135, lng: -64.1811,
      months: [
        { avg: 24.5, high: 30, low: 18, rain: 121 }, { avg: 23.5, high: 29, low: 17, rain: 101 },
        { avg: 21.6, high: 27, low: 15, rain: 104 }, { avg: 17.5, high: 23, low: 11, rain: 44 },
        { avg: 14.0, high: 19, low: 8, rain: 29 },   { avg: 11.0, high: 16, low: 6, rain: 21 },
        { avg: 10.5, high: 16, low: 5, rain: 16 },   { avg: 11.7, high: 17, low: 6, rain: 17 },
        { avg: 14.6, high: 20, low: 9, rain: 32 },   { avg: 19.4, high: 25, low: 13, rain: 57 },
        { avg: 22.3, high: 28, low: 16, rain: 76 },  { avg: 24.3, high: 30, low: 17, rain: 108 },
      ],
    },
    {
      name: "Mendoza", lat: -32.8908, lng: -68.8272,
      months: [
        { avg: 25.5, high: 32, low: 18, rain: 25 }, { avg: 24.2, high: 31, low: 17, rain: 21 },
        { avg: 21.2, high: 28, low: 13, rain: 28 }, { avg: 16.5, high: 24, low: 9, rain: 15 },
        { avg: 12.3, high: 19, low: 5, rain: 12 },  { avg: 8.7, high: 15, low: 2, rain: 13 },
        { avg: 8.6, high: 15, low: 2, rain: 8 },    { avg: 10.1, high: 17, low: 3, rain: 9 },
        { avg: 13.9, high: 21, low: 7, rain: 12 },  { avg: 19.3, high: 27, low: 11, rain: 17 },
        { avg: 22.6, high: 30, low: 15, rain: 18 }, { avg: 24.9, high: 32, low: 17, rain: 18 },
      ],
    },
  ],

  peru: [
    {
      name: "Lima", lat: -12.0464, lng: -77.0428,
      months: [
        { avg: 23.0, high: 27, low: 19, rain: 0 },  { avg: 23.5, high: 28, low: 20, rain: 0 },
        { avg: 22.6, high: 27, low: 19, rain: 0 },  { avg: 20.8, high: 25, low: 17, rain: 0 },
        { avg: 18.3, high: 22, low: 15, rain: 1 },  { avg: 16.4, high: 19, low: 14, rain: 3 },
        { avg: 15.3, high: 18, low: 14, rain: 6 },  { avg: 15.0, high: 17, low: 13, rain: 6 },
        { avg: 15.5, high: 18, low: 13, rain: 3 },  { avg: 17.1, high: 20, low: 14, rain: 1 },
        { avg: 18.9, high: 22, low: 15, rain: 0 },  { avg: 21.2, high: 25, low: 17, rain: 0 },
      ],
    },
    {
      name: "Cusco", lat: -13.5319, lng: -71.9675,
      months: [
        { avg: 12.5, high: 19, low: 6, rain: 153 }, { avg: 12.5, high: 19, low: 6, rain: 120 },
        { avg: 12.1, high: 19, low: 6, rain: 101 }, { avg: 11.6, high: 19, low: 5, rain: 43 },
        { avg: 10.8, high: 19, low: 3, rain: 15 },  { avg: 9.6, high: 18, low: 1, rain: 6 },
        { avg: 9.8, high: 18, low: 1, rain: 5 },    { avg: 10.5, high: 19, low: 2, rain: 12 },
        { avg: 11.2, high: 19, low: 4, rain: 29 },  { avg: 12.6, high: 20, low: 6, rain: 45 },
        { avg: 13.0, high: 20, low: 7, rain: 67 },  { avg: 12.8, high: 19, low: 6, rain: 117 },
      ],
    },
    {
      name: "Arequipa", lat: -16.4090, lng: -71.5375,
      months: [
        { avg: 15.2, high: 21, low: 9, rain: 45 },  { avg: 15.2, high: 21, low: 9, rain: 33 },
        { avg: 15.0, high: 21, low: 9, rain: 20 },  { avg: 13.6, high: 20, low: 7, rain: 7 },
        { avg: 12.5, high: 20, low: 5, rain: 3 },   { avg: 11.7, high: 19, low: 4, rain: 1 },
        { avg: 11.2, high: 20, low: 3, rain: 2 },   { avg: 12.6, high: 21, low: 4, rain: 2 },
        { avg: 13.3, high: 21, low: 6, rain: 3 },   { avg: 14.6, high: 22, low: 7, rain: 7 },
        { avg: 15.3, high: 22, low: 8, rain: 10 },  { avg: 15.2, high: 21, low: 9, rain: 28 },
      ],
    },
  ],

  cambodia: [
    {
      name: "Phnom Penh", lat: 11.5564, lng: 104.9282,
      months: [
        { avg: 26.2, high: 31, low: 21, rain: 13 }, { avg: 27.6, high: 33, low: 22, rain: 6 },
        { avg: 28.9, high: 35, low: 23, rain: 31 }, { avg: 29.7, high: 36, low: 23, rain: 67 },
        { avg: 29.1, high: 34, low: 24, rain: 148 }, { avg: 28.6, high: 33, low: 24, rain: 155 },
        { avg: 28.2, high: 32, low: 24, rain: 155 }, { avg: 28.1, high: 32, low: 24, rain: 156 },
        { avg: 27.8, high: 31, low: 24, rain: 210 }, { avg: 27.3, high: 31, low: 23, rain: 264 },
        { avg: 26.7, high: 31, low: 22, rain: 108 }, { avg: 25.6, high: 30, low: 21, rain: 21 },
      ],
    },
    {
      name: "Siem Reap", lat: 13.3671, lng: 103.8448,
      months: [
        { avg: 25.5, high: 31, low: 20, rain: 7 },  { avg: 27.1, high: 33, low: 21, rain: 8 },
        { avg: 28.9, high: 35, low: 22, rain: 29 }, { avg: 29.7, high: 36, low: 23, rain: 58 },
        { avg: 29.2, high: 34, low: 24, rain: 143 }, { avg: 28.6, high: 33, low: 24, rain: 147 },
        { avg: 28.1, high: 32, low: 24, rain: 174 }, { avg: 27.9, high: 31, low: 24, rain: 208 },
        { avg: 27.6, high: 31, low: 23, rain: 280 }, { avg: 27.3, high: 31, low: 23, rain: 260 },
        { avg: 26.4, high: 31, low: 22, rain: 76 },  { avg: 24.9, high: 30, low: 19, rain: 16 },
      ],
    },
    {
      name: "Sihanoukville", lat: 10.6294, lng: 103.5229,
      months: [
        { avg: 27.2, high: 32, low: 22, rain: 14 },  { avg: 28.1, high: 33, low: 23, rain: 8 },
        { avg: 29.0, high: 34, low: 24, rain: 24 },  { avg: 29.5, high: 34, low: 24, rain: 55 },
        { avg: 29.0, high: 33, low: 25, rain: 234 }, { avg: 28.3, high: 32, low: 24, rain: 279 },
        { avg: 27.8, high: 32, low: 24, rain: 311 }, { avg: 27.8, high: 32, low: 24, rain: 373 },
        { avg: 27.8, high: 32, low: 24, rain: 466 }, { avg: 27.9, high: 32, low: 24, rain: 373 },
        { avg: 27.6, high: 32, low: 23, rain: 158 }, { avg: 27.1, high: 32, low: 22, rain: 24 },
      ],
    },
  ],

  malaysia: [
    {
      name: "Kuala Lumpur", lat: 3.139, lng: 101.6869,
      months: [
        { avg: 27.2, high: 32, low: 23, rain: 172 }, { avg: 27.2, high: 33, low: 23, rain: 163 },
        { avg: 27.4, high: 33, low: 23, rain: 211 }, { avg: 27.7, high: 33, low: 24, rain: 264 },
        { avg: 27.9, high: 33, low: 24, rain: 197 }, { avg: 27.3, high: 33, low: 23, rain: 121 },
        { avg: 27.3, high: 32, low: 23, rain: 122 }, { avg: 27.4, high: 33, low: 23, rain: 137 },
        { avg: 27.3, high: 32, low: 23, rain: 198 }, { avg: 27.0, high: 32, low: 23, rain: 256 },
        { avg: 26.9, high: 31, low: 23, rain: 280 }, { avg: 27.0, high: 32, low: 23, rain: 201 },
      ],
    },
    {
      name: "Penang", lat: 5.4141, lng: 100.3288,
      months: [
        { avg: 27.1, high: 31, low: 23, rain: 105 }, { avg: 27.4, high: 32, low: 23, rain: 91 },
        { avg: 27.8, high: 33, low: 24, rain: 143 }, { avg: 28.1, high: 33, low: 24, rain: 185 },
        { avg: 28.1, high: 33, low: 24, rain: 204 }, { avg: 27.8, high: 32, low: 24, rain: 151 },
        { avg: 27.5, high: 32, low: 23, rain: 193 }, { avg: 27.6, high: 32, low: 23, rain: 225 },
        { avg: 27.4, high: 32, low: 23, rain: 298 }, { avg: 27.1, high: 31, low: 23, rain: 370 },
        { avg: 26.9, high: 31, low: 23, rain: 298 }, { avg: 26.9, high: 31, low: 23, rain: 170 },
      ],
    },
    {
      name: "Kota Kinabalu", lat: 5.9749, lng: 116.0724,
      months: [
        { avg: 27.2, high: 30, low: 24, rain: 109 }, { avg: 27.3, high: 31, low: 24, rain: 68 },
        { avg: 27.8, high: 31, low: 24, rain: 63 },  { avg: 28.0, high: 32, low: 24, rain: 74 },
        { avg: 28.1, high: 32, low: 25, rain: 136 }, { avg: 28.1, high: 31, low: 25, rain: 185 },
        { avg: 27.8, high: 31, low: 25, rain: 222 }, { avg: 27.9, high: 31, low: 25, rain: 219 },
        { avg: 27.7, high: 31, low: 24, rain: 246 }, { avg: 27.7, high: 31, low: 24, rain: 285 },
        { avg: 27.3, high: 31, low: 24, rain: 258 }, { avg: 27.1, high: 30, low: 24, rain: 161 },
      ],
    },
  ],

  japan: [
    {
      name: "Tokyo", lat: 35.6762, lng: 139.6503,
      months: [
        { avg: 5.8, high: 10, low: 1, rain: 52 },    { avg: 6.0, high: 10, low: 2, rain: 56 },
        { avg: 9.4, high: 13, low: 5, rain: 117 },   { avg: 14.3, high: 18, low: 10, rain: 124 },
        { avg: 18.8, high: 23, low: 15, rain: 137 }, { avg: 22.1, high: 26, low: 19, rain: 168 },
        { avg: 25.8, high: 29, low: 23, rain: 153 }, { avg: 27.4, high: 31, low: 24, rain: 168 },
        { avg: 23.6, high: 27, low: 21, rain: 220 }, { avg: 18.4, high: 22, low: 15, rain: 198 },
        { avg: 13.0, high: 17, low: 9, rain: 93 },   { avg: 7.9, high: 12, low: 4, rain: 51 },
      ],
    },
    {
      name: "Osaka", lat: 34.6937, lng: 135.5022,
      months: [
        { avg: 6.6, high: 10, low: 3, rain: 45 },    { avg: 7.1, high: 11, low: 3, rain: 61 },
        { avg: 10.5, high: 14, low: 7, rain: 106 },  { avg: 15.8, high: 20, low: 11, rain: 108 },
        { avg: 20.3, high: 25, low: 16, rain: 147 }, { avg: 23.7, high: 28, low: 20, rain: 184 },
        { avg: 27.4, high: 31, low: 24, rain: 173 }, { avg: 29.1, high: 33, low: 25, rain: 110 },
        { avg: 24.9, high: 28, low: 22, rain: 160 }, { avg: 19.0, high: 23, low: 15, rain: 120 },
        { avg: 13.5, high: 17, low: 10, rain: 68 },  { avg: 8.2, high: 12, low: 4, rain: 42 },
      ],
    },
    {
      name: "Okinawa", lat: 26.2123, lng: 127.6791,
      months: [
        { avg: 17.0, high: 19, low: 14, rain: 107 }, { avg: 17.2, high: 20, low: 14, rain: 120 },
        { avg: 19.5, high: 22, low: 16, rain: 161 }, { avg: 22.5, high: 25, low: 19, rain: 166 },
        { avg: 25.4, high: 28, low: 22, rain: 231 }, { avg: 27.6, high: 31, low: 25, rain: 247 },
        { avg: 29.1, high: 32, low: 27, rain: 141 }, { avg: 29.0, high: 32, low: 27, rain: 240 },
        { avg: 27.8, high: 31, low: 25, rain: 260 }, { avg: 25.1, high: 28, low: 22, rain: 152 },
        { avg: 22.3, high: 25, low: 19, rain: 109 }, { avg: 18.7, high: 22, low: 15, rain: 102 },
      ],
    },
    {
      name: "Fukuoka", lat: 33.5904, lng: 130.4017,
      months: [
        { avg: 7.1, high: 10, low: 4, rain: 68 },   { avg: 7.8, high: 11, low: 4, rain: 73 },
        { avg: 10.8, high: 15, low: 7, rain: 107 },  { avg: 16.1, high: 20, low: 12, rain: 108 },
        { avg: 20.3, high: 25, low: 16, rain: 134 }, { avg: 23.9, high: 28, low: 20, rain: 245 },
        { avg: 27.8, high: 31, low: 25, rain: 277 }, { avg: 28.8, high: 33, low: 25, rain: 173 },
        { avg: 24.8, high: 28, low: 22, rain: 152 }, { avg: 19.2, high: 23, low: 15, rain: 73 },
        { avg: 13.9, high: 17, low: 11, rain: 92 },  { avg: 8.7, high: 12, low: 5, rain: 59 },
      ],
    },
  ],

  "south-korea": [
    {
      name: "Seoul", lat: 37.5665, lng: 126.978,
      months: [
        { avg: -1.4, high: 2, low: -5, rain: 22 },  { avg: 0.8, high: 5, low: -3, rain: 30 },
        { avg: 5.8, high: 11, low: 1, rain: 41 },   { avg: 12.5, high: 18, low: 7, rain: 64 },
        { avg: 17.4, high: 22, low: 13, rain: 93 }, { avg: 22.3, high: 26, low: 18, rain: 133 },
        { avg: 25.4, high: 28, low: 23, rain: 320 }, { avg: 26.3, high: 29, low: 23, rain: 300 },
        { avg: 21.5, high: 25, low: 18, rain: 118 }, { avg: 14.8, high: 20, low: 10, rain: 51 },
        { avg: 7.4, high: 12, low: 3, rain: 53 },   { avg: 1.4, high: 5, low: -2, rain: 18 },
      ],
    },
    {
      name: "Busan", lat: 35.1796, lng: 129.0756,
      months: [
        { avg: 4.7, high: 8, low: 1, rain: 35 },   { avg: 6.0, high: 10, low: 2, rain: 52 },
        { avg: 9.6, high: 14, low: 6, rain: 69 },  { avg: 14.7, high: 19, low: 11, rain: 91 },
        { avg: 18.7, high: 23, low: 14, rain: 103 }, { avg: 22.5, high: 26, low: 19, rain: 155 },
        { avg: 26.4, high: 29, low: 23, rain: 244 }, { avg: 27.6, high: 31, low: 24, rain: 185 },
        { avg: 23.2, high: 27, low: 20, rain: 135 }, { avg: 17.9, high: 22, low: 13, rain: 41 },
        { avg: 12.0, high: 16, low: 8, rain: 50 },  { avg: 6.5, high: 10, low: 3, rain: 30 },
      ],
    },
    {
      name: "Jeju", lat: 33.4996, lng: 126.5312,
      months: [
        { avg: 6.3, high: 9, low: 4, rain: 64 },   { avg: 7.2, high: 10, low: 4, rain: 88 },
        { avg: 10.6, high: 14, low: 7, rain: 94 }, { avg: 15.2, high: 19, low: 11, rain: 73 },
        { avg: 19.0, high: 23, low: 15, rain: 101 }, { avg: 22.8, high: 26, low: 20, rain: 181 },
        { avg: 26.6, high: 30, low: 23, rain: 211 }, { avg: 27.9, high: 31, low: 24, rain: 193 },
        { avg: 24.1, high: 27, low: 21, rain: 203 }, { avg: 18.7, high: 22, low: 15, rain: 82 },
        { avg: 13.7, high: 17, low: 10, rain: 74 }, { avg: 8.8, high: 12, low: 6, rain: 61 },
      ],
    },
  ],

  india: [
    {
      name: "Goa", lat: 15.2993, lng: 74.124,
      months: [
        { avg: 24.7, high: 31, low: 19, rain: 4 },   { avg: 25.6, high: 32, low: 20, rain: 3 },
        { avg: 27.5, high: 33, low: 22, rain: 4 },   { avg: 29.5, high: 34, low: 24, rain: 17 },
        { avg: 30.3, high: 34, low: 26, rain: 52 },  { avg: 27.8, high: 31, low: 25, rain: 553 },
        { avg: 26.9, high: 30, low: 24, rain: 590 }, { avg: 26.8, high: 29, low: 24, rain: 369 },
        { avg: 27.2, high: 31, low: 24, rain: 271 }, { avg: 27.6, high: 32, low: 24, rain: 65 },
        { avg: 27.1, high: 33, low: 22, rain: 16 },  { avg: 25.5, high: 32, low: 19, rain: 5 },
      ],
    },
    {
      name: "Mumbai", lat: 19.076, lng: 72.8777,
      months: [
        { avg: 24.1, high: 31, low: 17, rain: 0 },   { avg: 24.3, high: 32, low: 17, rain: 1 },
        { avg: 26.5, high: 33, low: 20, rain: 0 },   { avg: 28.6, high: 34, low: 23, rain: 0 },
        { avg: 30.8, high: 35, low: 26, rain: 18 },  { avg: 29.0, high: 32, low: 26, rain: 480 },
        { avg: 27.2, high: 30, low: 25, rain: 617 }, { avg: 27.0, high: 30, low: 25, rain: 340 },
        { avg: 27.5, high: 31, low: 25, rain: 264 }, { avg: 28.5, high: 32, low: 25, rain: 64 },
        { avg: 27.5, high: 33, low: 22, rain: 14 },  { avg: 25.3, high: 32, low: 18, rain: 3 },
      ],
    },
    {
      name: "Delhi", lat: 28.7041, lng: 77.1025,
      months: [
        { avg: 14.3, high: 20, low: 8, rain: 24 },  { avg: 16.7, high: 23, low: 10, rain: 18 },
        { avg: 22.4, high: 29, low: 15, rain: 14 }, { avg: 29.0, high: 36, low: 22, rain: 7 },
        { avg: 34.1, high: 40, low: 27, rain: 15 }, { avg: 35.8, high: 40, low: 31, rain: 57 },
        { avg: 31.6, high: 35, low: 28, rain: 193 }, { avg: 30.5, high: 34, low: 27, rain: 173 },
        { avg: 29.6, high: 34, low: 25, rain: 110 }, { avg: 25.4, high: 32, low: 18, rain: 14 },
        { avg: 19.4, high: 27, low: 12, rain: 7 },  { avg: 14.5, high: 21, low: 8, rain: 11 },
      ],
    },
    {
      name: "Bangalore", lat: 12.9716, lng: 77.5946,
      months: [
        { avg: 21.4, high: 27, low: 16, rain: 5 },  { avg: 23.1, high: 29, low: 17, rain: 9 },
        { avg: 25.6, high: 31, low: 20, rain: 11 }, { avg: 26.9, high: 32, low: 21, rain: 43 },
        { avg: 26.0, high: 31, low: 21, rain: 116 }, { avg: 23.9, high: 28, low: 20, rain: 92 },
        { avg: 23.1, high: 27, low: 19, rain: 120 }, { avg: 23.0, high: 27, low: 19, rain: 140 },
        { avg: 23.5, high: 28, low: 19, rain: 202 }, { avg: 23.0, high: 27, low: 19, rain: 178 },
        { avg: 21.4, high: 26, low: 17, rain: 73 },  { avg: 20.4, high: 26, low: 15, rain: 23 },
      ],
    },
  ],

  "south-africa": [
    {
      name: "Cape Town", lat: -33.9249, lng: 18.4241,
      months: [
        { avg: 21.7, high: 26, low: 16, rain: 15 }, { avg: 21.6, high: 26, low: 16, rain: 18 },
        { avg: 20.1, high: 25, low: 15, rain: 25 }, { avg: 17.5, high: 22, low: 13, rain: 43 },
        { avg: 14.7, high: 19, low: 11, rain: 63 }, { avg: 12.5, high: 17, low: 9, rain: 82 },
        { avg: 12.1, high: 16, low: 8, rain: 88 },  { avg: 12.7, high: 17, low: 8, rain: 68 },
        { avg: 14.4, high: 19, low: 10, rain: 45 }, { avg: 16.8, high: 21, low: 12, rain: 37 },
        { avg: 19.1, high: 23, low: 14, rain: 27 }, { avg: 20.9, high: 25, low: 15, rain: 17 },
      ],
    },
    {
      name: "Johannesburg", lat: -26.2041, lng: 28.0473,
      months: [
        { avg: 20.7, high: 26, low: 15, rain: 114 }, { avg: 20.3, high: 26, low: 15, rain: 99 },
        { avg: 18.8, high: 24, low: 13, rain: 88 },  { avg: 15.6, high: 22, low: 9, rain: 38 },
        { avg: 12.3, high: 19, low: 5, rain: 14 },   { avg: 9.8, high: 17, low: 2, rain: 7 },
        { avg: 9.5, high: 17, low: 2, rain: 5 },     { avg: 11.5, high: 19, low: 3, rain: 7 },
        { avg: 15.0, high: 23, low: 7, rain: 23 },   { avg: 18.7, high: 25, low: 12, rain: 61 },
        { avg: 19.9, high: 25, low: 14, rain: 101 }, { avg: 20.6, high: 26, low: 15, rain: 122 },
      ],
    },
    {
      name: "Durban", lat: -29.8587, lng: 31.0218,
      months: [
        { avg: 24.7, high: 28, low: 21, rain: 105 }, { avg: 25.0, high: 29, low: 21, rain: 108 },
        { avg: 24.5, high: 28, low: 21, rain: 110 }, { avg: 22.5, high: 27, low: 18, rain: 82 },
        { avg: 19.7, high: 25, low: 14, rain: 38 },  { avg: 17.1, high: 23, low: 12, rain: 33 },
        { avg: 17.0, high: 23, low: 11, rain: 32 },  { avg: 17.6, high: 23, low: 12, rain: 37 },
        { avg: 19.4, high: 24, low: 14, rain: 60 },  { avg: 21.4, high: 26, low: 17, rain: 84 },
        { avg: 23.2, high: 27, low: 19, rain: 117 }, { avg: 24.1, high: 28, low: 20, rain: 112 },
      ],
    },
  ],

  morocco: [
    {
      name: "Marrakech", lat: 31.6295, lng: -7.9811,
      months: [
        { avg: 11.5, high: 17, low: 6, rain: 30 },  { avg: 13.2, high: 18, low: 7, rain: 25 },
        { avg: 15.5, high: 21, low: 9, rain: 31 },  { avg: 19.0, high: 26, low: 12, rain: 27 },
        { avg: 22.5, high: 29, low: 15, rain: 14 }, { avg: 26.6, high: 33, low: 20, rain: 5 },
        { avg: 30.0, high: 38, low: 23, rain: 1 },  { avg: 29.7, high: 37, low: 22, rain: 2 },
        { avg: 25.2, high: 33, low: 18, rain: 9 },  { avg: 20.8, high: 28, low: 13, rain: 23 },
        { avg: 15.4, high: 21, low: 9, rain: 35 },  { avg: 11.8, high: 18, low: 6, rain: 35 },
      ],
    },
    {
      name: "Casablanca", lat: 33.5731, lng: -7.5898,
      months: [
        { avg: 12.8, high: 17, low: 9, rain: 73 },  { avg: 13.5, high: 18, low: 9, rain: 59 },
        { avg: 15.3, high: 20, low: 11, rain: 52 }, { avg: 17.9, high: 23, low: 13, rain: 35 },
        { avg: 20.6, high: 26, low: 15, rain: 20 }, { avg: 23.3, high: 29, low: 18, rain: 8 },
        { avg: 25.9, high: 31, low: 21, rain: 1 },  { avg: 26.0, high: 31, low: 21, rain: 1 },
        { avg: 23.5, high: 29, low: 18, rain: 5 },  { avg: 20.0, high: 25, low: 15, rain: 24 },
        { avg: 15.9, high: 20, low: 11, rain: 63 }, { avg: 13.3, high: 18, low: 9, rain: 77 },
      ],
    },
    {
      name: "Agadir", lat: 30.4278, lng: -9.5981,
      months: [
        { avg: 14.8, high: 20, low: 9, rain: 34 },  { avg: 15.5, high: 21, low: 9, rain: 24 },
        { avg: 17.2, high: 23, low: 11, rain: 23 }, { avg: 19.3, high: 25, low: 13, rain: 11 },
        { avg: 21.5, high: 27, low: 15, rain: 4 },  { avg: 24.2, high: 30, low: 18, rain: 0 },
        { avg: 26.0, high: 31, low: 21, rain: 0 },  { avg: 26.7, high: 31, low: 22, rain: 0 },
        { avg: 24.8, high: 30, low: 20, rain: 2 },  { avg: 21.6, high: 27, low: 16, rain: 10 },
        { avg: 18.0, high: 23, low: 13, rain: 24 }, { avg: 15.4, high: 20, low: 10, rain: 31 },
      ],
    },
  ],

  turkey: [
    {
      name: "Istanbul", lat: 41.0082, lng: 28.9784,
      months: [
        { avg: 5.5, high: 9, low: 3, rain: 94 },    { avg: 5.7, high: 9, low: 3, rain: 76 },
        { avg: 7.9, high: 11, low: 5, rain: 68 },   { avg: 12.3, high: 16, low: 9, rain: 46 },
        { avg: 17.0, high: 21, low: 13, rain: 36 }, { avg: 21.3, high: 26, low: 17, rain: 33 },
        { avg: 23.6, high: 28, low: 20, rain: 27 }, { avg: 24.1, high: 28, low: 21, rain: 30 },
        { avg: 20.3, high: 25, low: 17, rain: 59 }, { avg: 15.8, high: 20, low: 12, rain: 84 },
        { avg: 11.8, high: 16, low: 8, rain: 110 }, { avg: 7.7, high: 11, low: 5, rain: 118 },
      ],
    },
    {
      name: "Antalya", lat: 36.8969, lng: 30.7133,
      months: [
        { avg: 9.8, high: 14, low: 6, rain: 220 }, { avg: 10.5, high: 15, low: 6, rain: 145 },
        { avg: 13.0, high: 18, low: 8, rain: 84 }, { avg: 16.9, high: 22, low: 11, rain: 37 },
        { avg: 21.5, high: 27, low: 15, rain: 17 }, { avg: 25.9, high: 31, low: 20, rain: 8 },
        { avg: 28.8, high: 34, low: 23, rain: 5 },  { avg: 28.8, high: 34, low: 23, rain: 5 },
        { avg: 26.1, high: 31, low: 21, rain: 15 }, { avg: 21.0, high: 26, low: 16, rain: 48 },
        { avg: 15.7, high: 20, low: 11, rain: 121 }, { avg: 11.6, high: 16, low: 7, rain: 210 },
      ],
    },
    {
      name: "Bodrum", lat: 37.0344, lng: 27.4305,
      months: [
        { avg: 11.0, high: 15, low: 7, rain: 134 }, { avg: 11.4, high: 16, low: 7, rain: 95 },
        { avg: 13.7, high: 18, low: 9, rain: 72 },  { avg: 17.8, high: 22, low: 13, rain: 36 },
        { avg: 22.5, high: 27, low: 17, rain: 18 }, { avg: 27.0, high: 32, low: 21, rain: 6 },
        { avg: 29.8, high: 35, low: 25, rain: 2 },  { avg: 29.9, high: 35, low: 25, rain: 4 },
        { avg: 26.5, high: 31, low: 22, rain: 16 }, { avg: 21.5, high: 26, low: 17, rain: 40 },
        { avg: 16.7, high: 21, low: 13, rain: 75 }, { avg: 12.7, high: 16, low: 9, rain: 120 },
      ],
    },
  ],

  spain: [
    {
      name: "Barcelona", lat: 41.3851, lng: 2.1734,
      months: [
        { avg: 9.0, high: 13, low: 5, rain: 47 },  { avg: 10.0, high: 14, low: 6, rain: 38 },
        { avg: 12.4, high: 17, low: 8, rain: 42 }, { avg: 15.0, high: 19, low: 11, rain: 52 },
        { avg: 18.6, high: 23, low: 14, rain: 61 }, { avg: 22.5, high: 27, low: 18, rain: 40 },
        { avg: 25.3, high: 30, low: 20, rain: 32 }, { avg: 25.6, high: 30, low: 21, rain: 48 },
        { avg: 22.4, high: 27, low: 18, rain: 83 }, { avg: 17.7, high: 22, low: 13, rain: 100 },
        { avg: 13.0, high: 16, low: 9, rain: 59 }, { avg: 9.9, high: 13, low: 6, rain: 48 },
      ],
    },
    {
      name: "Madrid", lat: 40.4168, lng: -3.7038,
      months: [
        { avg: 6.7, high: 10, low: 3, rain: 39 },  { avg: 7.7, high: 12, low: 4, rain: 37 },
        { avg: 10.9, high: 16, low: 6, rain: 33 }, { avg: 14.4, high: 19, low: 9, rain: 45 },
        { avg: 18.1, high: 23, low: 13, rain: 45 }, { avg: 23.0, high: 29, low: 17, rain: 27 },
        { avg: 26.3, high: 33, low: 20, rain: 9 },  { avg: 25.8, high: 32, low: 19, rain: 10 },
        { avg: 21.6, high: 27, low: 16, rain: 28 }, { avg: 16.0, high: 21, low: 11, rain: 50 },
        { avg: 10.6, high: 14, low: 7, rain: 47 }, { avg: 7.0, high: 10, low: 4, rain: 45 },
      ],
    },
    {
      name: "Seville", lat: 37.3891, lng: -5.9845,
      months: [
        { avg: 10.4, high: 15, low: 5, rain: 66 },  { avg: 12.0, high: 18, low: 6, rain: 53 },
        { avg: 14.9, high: 21, low: 8, rain: 43 },  { avg: 18.2, high: 25, low: 11, rain: 38 },
        { avg: 21.7, high: 28, low: 14, rain: 23 }, { avg: 26.4, high: 33, low: 19, rain: 9 },
        { avg: 29.5, high: 37, low: 22, rain: 1 },  { avg: 29.2, high: 36, low: 22, rain: 4 },
        { avg: 25.3, high: 31, low: 18, rain: 19 }, { avg: 19.9, high: 26, low: 14, rain: 54 },
        { avg: 14.7, high: 20, low: 9, rain: 73 },  { avg: 11.0, high: 15, low: 6, rain: 76 },
      ],
    },
    {
      name: "Malaga", lat: 36.7213, lng: -4.4213,
      months: [
        { avg: 12.5, high: 17, low: 8, rain: 72 },  { avg: 13.4, high: 18, low: 9, rain: 53 },
        { avg: 15.5, high: 21, low: 10, rain: 49 }, { avg: 18.3, high: 24, low: 13, rain: 35 },
        { avg: 21.3, high: 27, low: 15, rain: 19 }, { avg: 25.2, high: 31, low: 19, rain: 5 },
        { avg: 28.0, high: 34, low: 22, rain: 1 },  { avg: 28.2, high: 34, low: 22, rain: 3 },
        { avg: 25.2, high: 30, low: 20, rain: 17 }, { avg: 20.6, high: 26, low: 15, rain: 57 },
        { avg: 16.3, high: 21, low: 11, rain: 82 }, { avg: 13.2, high: 17, low: 9, rain: 85 },
      ],
    },
  ],

  "costa-rica": [
    {
      name: "San José", lat: 9.9281, lng: -84.0907,
      months: [
        { avg: 19.6, high: 24, low: 15, rain: 15 },  { avg: 20.0, high: 25, low: 15, rain: 10 },
        { avg: 21.2, high: 26, low: 16, rain: 13 },  { avg: 21.9, high: 26, low: 17, rain: 40 },
        { avg: 21.8, high: 26, low: 17, rain: 236 }, { avg: 20.9, high: 25, low: 17, rain: 291 },
        { avg: 20.4, high: 25, low: 17, rain: 204 }, { avg: 20.6, high: 25, low: 17, rain: 246 },
        { avg: 20.8, high: 25, low: 17, rain: 352 }, { avg: 20.9, high: 25, low: 17, rain: 344 },
        { avg: 20.3, high: 25, low: 16, rain: 179 }, { avg: 19.8, high: 24, low: 15, rain: 44 },
      ],
    },
    {
      name: "Liberia", lat: 10.6347, lng: -85.4400,
      months: [
        { avg: 26.5, high: 33, low: 20, rain: 6 },   { avg: 27.3, high: 34, low: 20, rain: 4 },
        { avg: 29.2, high: 36, low: 22, rain: 4 },   { avg: 31.0, high: 38, low: 24, rain: 18 },
        { avg: 29.9, high: 36, low: 24, rain: 187 }, { avg: 27.9, high: 33, low: 23, rain: 223 },
        { avg: 27.0, high: 33, low: 22, rain: 173 }, { avg: 27.2, high: 33, low: 22, rain: 188 },
        { avg: 27.1, high: 33, low: 22, rain: 292 }, { avg: 27.2, high: 33, low: 22, rain: 337 },
        { avg: 27.0, high: 33, low: 21, rain: 115 }, { avg: 26.3, high: 33, low: 19, rain: 23 },
      ],
    },
  ],

  "dominican-republic": [
    {
      name: "Santo Domingo", lat: 18.4861, lng: -69.9312,
      months: [
        { avg: 25.4, high: 29, low: 22, rain: 60 },  { avg: 25.4, high: 29, low: 22, rain: 55 },
        { avg: 25.8, high: 29, low: 22, rain: 50 },  { avg: 26.5, high: 30, low: 23, rain: 74 },
        { avg: 27.1, high: 31, low: 24, rain: 195 }, { avg: 27.5, high: 31, low: 24, rain: 165 },
        { avg: 27.8, high: 32, low: 24, rain: 166 }, { avg: 28.0, high: 32, low: 25, rain: 157 },
        { avg: 27.7, high: 32, low: 24, rain: 171 }, { avg: 27.0, high: 31, low: 24, rain: 175 },
        { avg: 26.5, high: 30, low: 23, rain: 102 }, { avg: 25.8, high: 29, low: 22, rain: 73 },
      ],
    },
    {
      name: "Punta Cana", lat: 18.5820, lng: -68.4005,
      months: [
        { avg: 25.1, high: 28, low: 22, rain: 82 },  { avg: 25.2, high: 28, low: 22, rain: 68 },
        { avg: 25.8, high: 29, low: 22, rain: 57 },  { avg: 26.4, high: 30, low: 23, rain: 62 },
        { avg: 27.1, high: 31, low: 24, rain: 127 }, { avg: 27.8, high: 32, low: 25, rain: 114 },
        { avg: 28.1, high: 32, low: 25, rain: 110 }, { avg: 28.3, high: 33, low: 25, rain: 125 },
        { avg: 27.9, high: 32, low: 25, rain: 167 }, { avg: 27.2, high: 31, low: 24, rain: 195 },
        { avg: 26.5, high: 30, low: 23, rain: 120 }, { avg: 25.6, high: 29, low: 22, rain: 95 },
      ],
    },
  ],
};

/** Get cities for a country slug. Returns empty array if no data exists. */
export function getCitiesForCountry(slug: string): CityClimate[] {
  return CITY_CLIMATE_DATA[slug] ?? [];
}
