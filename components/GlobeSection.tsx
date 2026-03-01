"use client";

import dynamic from "next/dynamic";
import type { Country } from "@/lib/countries";

const WorldGlobe = dynamic(() => import("@/components/WorldGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-cyan-500" />
    </div>
  ),
});

export default function GlobeSection({ countries }: { countries: Country[] }) {
  return (
    <div className="relative mt-6 w-full overflow-hidden px-0 md:mt-8 md:-mt-10">
      {/* Constrained viewport: explicit size, no overflow, recalculates on resize */}
      <div className="relative mx-auto h-[320px] w-full max-w-4xl sm:h-[420px] md:h-[520px] lg:h-[620px]">
        <WorldGlobe countries={countries} />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent md:h-40" />
    </div>
  );
}
