"use client";

import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export type FiltersState = {
  maxGdp: number;
  datingDifficulty: string[];
  receptiveness: string[];
  localValues: string[];
  englishProficiency: string[];
  monthlyBudget: string[];
  internetSpeed: string[];
  climate: string[];
  vibe: string[];
  safetyLevel: string[];
  healthcareQuality: string[];
};

export const createDefaultFilters = (): FiltersState => ({
  maxGdp: 80000,
  datingDifficulty: [],
  receptiveness: [],
  localValues: [],
  englishProficiency: [],
  monthlyBudget: [],
  internetSpeed: [],
  climate: [],
  vibe: [],
  safetyLevel: [],
  healthcareQuality: [],
});

type Props = {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  isOpen: boolean;
  onClose: () => void;
};

const FILTER_CONFIG = [
  {
    id: "datingDifficulty",
    label: "Max Dating Difficulty",
    options: ["Very Easy", "Easy", "Possible", "Normal", "Hard", "Improbable"],
  },
  {
    id: "englishProficiency",
    label: "Min. English Level",
    options: ["High", "Moderate", "Low"],
  },
  {
    id: "monthlyBudget",
    label: "Max Monthly Budget",
    options: ["<$1k", "$1k-$2k", "$2k-$3k", "$3k+"],
  },
  {
    id: "internetSpeed",
    label: "Min. Internet Speed",
    options: ["Fast", "Moderate", "Slow"],
  },
  {
    id: "climate",
    label: "Climate",
    options: ["Tropical", "Temperate", "Cold"],
  },
  {
    id: "safetyLevel",
    label: "Min. Safety Level",
    options: ["Very Safe", "Safe", "Moderate", "Dangerous"],
  },
  {
    id: "healthcareQuality",
    label: "Min. Healthcare Quality",
    options: ["High", "Moderate", "Low"],
  },
];

export default function FilterSidebar({ filters, setFilters, isOpen, onClose }: Props) {
  const handleToggle = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const handleClear = () => {
    setFilters(createDefaultFilters());
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-50 w-72 overflow-y-auto border-r border-zinc-800 bg-zinc-950/95 p-5 pb-24 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">Filters</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear all
            </button>
            <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                Max GDP per Capita
              </h3>
              <span className="text-[11px] font-medium text-zinc-300">
                {filters.maxGdp >= 80000 ? "Any" : `$${filters.maxGdp.toLocaleString()}`}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="80000"
              step="1000"
              value={filters.maxGdp}
              onChange={(e) => setFilters(prev => ({ ...prev, maxGdp: parseInt(e.target.value, 10) }))}
              className="h-1.5 w-full appearance-none rounded-full bg-zinc-800 accent-emerald-500 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
            />
          </div>

          {FILTER_CONFIG.map((group) => (
            <div key={group.id}>
              <h3 className="mb-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isActive = filters[group.id as keyof FiltersState].includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleToggle(group.id as keyof FiltersState, option)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${
                        isActive
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}