"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, X, ChevronDown, CheckCircle2, AlertCircle, Clock } from "lucide-react";

type VisaData = {
  countries: string[];
  matrix: Record<string, Record<string, string>>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function VisaCheckerModal({ isOpen, onClose }: Props) {
  const [data, setData] = useState<VisaData | null>(null);
  const [passport, setPassport] = useState<string>("United States");
  const [destination, setDestination] = useState<string>("Japan");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && !data) {
      setIsLoading(true);
      fetch("/visa-matrix.json")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load visa data", err);
          setIsLoading(false);
        });
    }
  }, [isOpen, data]);

  const visaStatus = data?.matrix?.[passport]?.[destination] || "unknown";

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("free") || s === "visa not required" || s === "freedom of movement") {
      return { text: "text-emerald-400", bg: "bg-emerald-400/10", label: "VISA FREE" };
    }
    if (s.includes("e-visa") || s.includes("eta") || s.includes("arrival") || !isNaN(Number(s))) {
      return { text: "text-blue-400", bg: "bg-blue-400/10", label: s.toUpperCase() };
    }
    if (s.includes("required") || s.includes("refused") || s === "-1" || s === "unknown") {
      return { text: "text-red-400", bg: "bg-red-400/10", label: s === "-1" ? "NOT APPLICABLE" : "VISA REQUIRED" };
    }
    return { text: "text-zinc-300", bg: "bg-zinc-800", label: s.toUpperCase() };
  };

  const statusStyle = getStatusStyle(visaStatus);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-visible rounded-2xl bg-[#1c1c1f] shadow-2xl ring-1 ring-white/10"
            style={{
              boxShadow: "0 0 40px -10px rgba(139, 92, 246, 0.15), 0 0 20px -10px rgba(236, 72, 153, 0.15)"
            }}
          >
            {/* Glowing borders effect (subtle) */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20 [mask-image:linear-gradient(#fff_0,white_0)]" style={{ WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px" }} />

            {/* Plane Icon Badge */}
            <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-amber-600/30 bg-white text-amber-700 shadow-lg">
              <Plane className="h-6 w-6 -rotate-45" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-6 pb-6 pt-10">
              <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-white">
                Instant Visa Checker
              </h2>

              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-500" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Passport Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-amber-500/80">
                      PASSPORT
                    </label>
                    <div className="relative">
                      <select
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-amber-500/30 bg-transparent px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60"
                      >
                        {data?.countries.map((c) => (
                          <option key={`pass-${c}`} value={c} className="bg-zinc-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/70" />
                    </div>
                  </div>

                  {/* Destination Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-amber-500/80">
                      DESTINATION
                    </label>
                    <div className="relative">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-amber-500/30 bg-transparent px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60"
                      >
                        {data?.countries.map((c) => (
                          <option key={`dest-${c}`} value={c} className="bg-zinc-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/70" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Section */}
            {!isLoading && (
              <div className="flex flex-col items-center justify-center bg-[#252528] py-8">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                  VISA STATUS
                </div>
                <div className={`mt-3 px-4 py-1.5 font-bold tracking-widest ${statusStyle.text} ${statusStyle.bg}`}>
                  {statusStyle.label}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="rounded-b-2xl border-t border-white/5 bg-[#252528] px-6 py-4 text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400">
                PASSPORT · DESTINATION
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}