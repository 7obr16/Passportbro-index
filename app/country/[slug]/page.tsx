import { notFound } from "next/navigation";
import { getCountryBySlug, getAllSlugs, TIER_CONFIG } from "@/lib/countries";
import CountryDetailClient from "@/components/CountryDetailClient";
import { COUNTRY_GALLERY } from "@/lib/countryImages";
import { WOMEN_GROUP_IMAGE } from "@/lib/womenGroupImages";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

type GalleryItem = {
  key: "nightlife" | "food" | "city" | "beaches";
  label: string;
  images: string[];
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildCountryGallery(slug: string): GalleryItem[] {
  const entry = COUNTRY_GALLERY[slug];
  if (!entry) return [];

  return [
    { key: "nightlife", label: "Nightlife", images: toArray(entry.nightlife) },
    { key: "food", label: "Food & Cafes", images: toArray(entry.food) },
    { key: "city", label: "City & Streets", images: toArray(entry.city) },
    { key: "beaches", label: "Beaches & Nature", images: toArray(entry.beaches) },
  ];
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const tierConfig = TIER_CONFIG[country.datingEase];
  const gallery = buildCountryGallery(slug);
  const womenGroupImageUrl = WOMEN_GROUP_IMAGE[slug] ?? null;

  return (
    <CountryDetailClient
      country={country}
      gallery={gallery}
      womenGroupImageUrl={womenGroupImageUrl}
    />
  );
}