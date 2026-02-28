import SiteNav from "@/components/SiteNav";
import VisaGlobeClient from "@/components/VisaGlobeClient";

export default function VisaPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-5 pt-8 pb-20">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            199 passports · Live data
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Interactive Visa{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Globe
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
            Select your passport and instantly see every country color-coded by visa requirement.
            Visa free, on arrival, e-visa, or full visa required — all at a glance.
          </p>
        </div>

        <VisaGlobeClient />
      </section>
    </div>
  );
}
