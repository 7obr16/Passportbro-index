export function countryCodeFromFlagEmoji(flagEmoji?: string): string | undefined {
  if (!flagEmoji) return undefined;

  const chars = [...flagEmoji];
  if (chars.length !== 2) return undefined;

  const REGIONAL_A = 0x1f1e6;
  const REGIONAL_Z = 0x1f1ff;

  const points = chars.map((c) => c.codePointAt(0) ?? 0);
  if (!points.every((p) => p >= REGIONAL_A && p <= REGIONAL_Z)) return undefined;

  const code = points
    .map((p) => String.fromCharCode(65 + (p - REGIONAL_A)))
    .join("");

  return code;
}
