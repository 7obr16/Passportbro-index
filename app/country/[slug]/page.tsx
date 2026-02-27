import { notFound } from "next/navigation";
import { getCountryBySlug, getAllSlugs, TIER_CONFIG } from "@/lib/countries";
import CountryDetailClient from "@/components/CountryDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

type GalleryItem = {
  label: string;
  url: string;
};

function buildImageUrl(query: string, seed: string): string {
  // Unsplash Source provides real travel photos by keyword query.
  return `https://source.unsplash.com/1600x1000/?${encodeURIComponent(query)}&${seed}`;
}

function buildCountryGallery(country: {
  slug: string;
  name: string;
  hasBeach: boolean;
  hasNature: boolean;
  hasNightlife: boolean;
  climate: string;
}): GalleryItem[] {
  const base = country.name;
  const lifestyleTag = country.hasNightlife
    ? "nightlife"
    : country.hasBeach
      ? "beach"
      : country.hasNature
        ? "mountains"
        : "city";

  return [
    {
      label: "City",
      url: buildImageUrl(`${base} city skyline architecture`, `${country.slug}-city`),
    },
    {
      label: "Nature",
      url: buildImageUrl(`${base} nature landscape ${country.climate}`, `${country.slug}-nature`),
    },
    {
      label: "People & Culture",
      url: buildImageUrl(`${base} people street culture`, `${country.slug}-people`),
    },
    {
      label: "Lifestyle",
      url: buildImageUrl(`${base} travel ${lifestyleTag}`, `${country.slug}-lifestyle`),
    },
  ];
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const tierConfig = TIER_CONFIG[country.datingEase];
  const gallery = buildCountryGallery(country);

  return (
    <CountryDetailClient
      country={country}
      tierConfig={tierConfig}
      gallery={gallery}
    />
  );
}