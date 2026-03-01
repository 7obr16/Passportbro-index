/**
 * High-quality source URLs for all data displayed in the app.
 * Used by the SourceLink component so users can verify and cite data.
 */

export const DATA_SOURCES = {
  /** Global Peace Index – safety/peace rankings */
  safety: {
    label: "GPI",
    url: "https://www.visionofhumanity.org/",
  },
  /** NCD-RisC – mean height by country */
  height: {
    label: "NCD-RisC",
    url: "https://www.ncdrisc.org/data-downloads-height.html",
  },
  /** World Bank – GDP per capita */
  gdp: {
    label: "World Bank",
    url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.CD",
  },
  /** WHO GHO – BMI/obesity prevalence */
  bmi: {
    label: "WHO GHO",
    url: "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/prevalence-of-obesity-among-adults-bmi-=-30-(age-standardized-estimate)-(-)",
  },
  /** CIA World Factbook (median age) – via Wikipedia list */
  demographicsAge: {
    label: "CIA Factbook",
    url: "https://en.wikipedia.org/wiki/List_of_countries_by_median_age",
  },
  /** Ethnic fractionalization (Fearon) – via Wikipedia */
  demographicsEthnic: {
    label: "Fearon Index",
    url: "https://en.wikipedia.org/wiki/List_of_countries_by_ethnic_and_cultural_diversity_level",
  },
  /** Eurostat / EC – mixed marriages (native–foreign-born) in Europe */
  marriageEurope: {
    label: "Eurostat",
    url: "https://ec.europa.eu/eurostat/documents/3433488/5584928/KS-SF-12-029-EN.PDF/4c0917f8-9cfa-485b-a638-960c00d66da4",
  },
  /** UN / OECD – marriage data globally */
  marriageGlobal: {
    label: "UN Data",
    url: "https://population.un.org/MarriageData/Index.html",
  },
  /** UN World Population Prospects – population by age and sex */
  demographicsPopulation: {
    label: "UN WPP",
    url: "https://population.un.org/wpp/",
  },
  /** World Bank – Total Fertility Rate (SP.DYN.TFRT.IN) */
  fertility: {
    label: "World Bank",
    url: "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN",
  },
} as const;

export type DataSourceKey = keyof typeof DATA_SOURCES;
