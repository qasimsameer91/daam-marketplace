/**
 * Daam Meter bands (plan §10). Display metadata only; the comparable-set computation
 * (median / p25 / p75, price_references fallback, scam guard) arrives in Phase 7.
 */

export const DAAM_BANDS = ["great", "fair", "high", "unknown"] as const;
export type DaamBand = (typeof DAAM_BANDS)[number];

export function isDaamBand(value: unknown): value is DaamBand {
  return typeof value === "string" && (DAAM_BANDS as readonly string[]).includes(value);
}
