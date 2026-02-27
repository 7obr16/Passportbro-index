"use client";

import dynamic from "next/dynamic";
import type { Country } from "@/lib/countries";

const WorldGlobe = dynamic(() => import("@/components/WorldGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-500" />
    </div>
  ),
});

export default function GlobeSection({ countries }: { countries: Country[] }) {
  return (
    <div className="relative mt-8 h-[400px] w-full max-w-4xl md:-mt-10 md:h-[600px]">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_60%)]" />
      <WorldGlobe countries={countries} />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-zinc-950 to-transparent" />
    </div>
  );
}
