/**
 * Daam Meter bands (plan §10). Display metadata only; the comparable-set computation
 * (median / p25 / p75, price_references fallback, scam guard) arrives in Phase 7.
 */

export const DAAM_BANDS = ["great", "fair", "high", "unknown"] as const;
export type DaamBand = (typeof DAAM_BANDS)[number];

export function isDaamBand(value: unknown): value is DaamBand {
  return typeof value === "string" && (DAAM_BANDS as readonly string[]).includes(value);
}

export interface DaamRange {
  /** 25th percentile of comparable prices (PKR). */
  low: number;
  /** 75th percentile of comparable prices (PKR). */
  high: number;
}

/**
 * Band for a price against the comparable p25–p75 range (plan §10): below p25 = great,
 * p25–p75 = fair, above p75 = high. No range (not enough comparables) = unknown.
 */
export function bandForPrice(price: number, range: DaamRange | null): DaamBand {
  if (!range || !Number.isFinite(price) || price <= 0) return "unknown";
  if (price < range.low) return "great";
  if (price > range.high) return "high";
  return "fair";
}
