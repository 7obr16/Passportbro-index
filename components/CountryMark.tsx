import ReactCountryFlag from "react-country-flag";
import { COUNTRY_FLAG_CODE } from "@/lib/countryCodes";

type Props = {
  slug: string;
  name: string;
  compact?: boolean;
};

export default function CountryMark({ slug, name, compact = false }: Props) {
  const countryCode = COUNTRY_FLAG_CODE[slug];
  const codeText = countryCode ?? "NA";

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950/90 ${
          compact ? "h-7 w-7" : "h-9 w-9"
        }`}
      >
        {countryCode ? (
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            aria-label={name}
            style={{
              width: compact ? "0.95em" : "1.15em",
              height: compact ? "0.95em" : "1.15em",
            }}
          />
        ) : (
          <span className="text-[10px] font-semibold text-zinc-400">{codeText}</span>
        )}
      </div>
      <span className="rounded-md border border-zinc-700/80 bg-zinc-950/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300">
        {codeText}
      </span>
    </div>
  );
}
