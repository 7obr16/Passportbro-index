import { Suspense } from "react";
import SiteNav from "@/components/SiteNav";

const NavFallback = () => (
  <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm">
    <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-5" />
  </header>
);

export default function SiteNavWithSuspense() {
  return (
    <Suspense fallback={<NavFallback />}>
      <SiteNav />
    </Suspense>
  );
}
