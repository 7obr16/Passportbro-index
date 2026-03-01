"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { DATA_SOURCES, type DataSourceKey } from "@/lib/dataSources";

type Props = {
  sourceKey: DataSourceKey;
  /** Optional override label (e.g. "Eurostat" when key is marriageEurope) */
  label?: string;
  className?: string;
};

export default function SourceLink({ sourceKey, label, className = "" }: Props) {
  const source = DATA_SOURCES[sourceKey];
  if (!source) return null;

  const displayLabel = label ?? source.label;

  return (
    <Link
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-[10px] text-zinc-500/70 transition-colors hover:text-zinc-300 ${className}`}
      title={`Data source: ${displayLabel}`}
    >
      <Star className="h-2.5 w-2.5 opacity-80" aria-hidden />
      <span>{displayLabel}</span>
    </Link>
  );
}
