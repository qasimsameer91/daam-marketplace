/**
 * PKR pricing helpers (plan §12). Prices are integer rupees.
 * Use formatPKR() / formatPKRShort() everywhere; never format prices by hand.
 */

/** DB constraint on listings.price_pkr. */
export const PRICE_MIN_PKR = 1_000;
export const PRICE_MAX_PKR = 2_000_000;

const LAKH = 100_000;
const grouping = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** `Rs 125,000`. Non-integers are rounded to the nearest rupee. */
export function formatPKR(amount: number): string {
  if (!Number.isFinite(amount)) throw new RangeError(`formatPKR: invalid amount ${amount}`);
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}Rs ${grouping.format(Math.abs(rounded))}`;
}

/**
 * Short form for cards: `Rs 1.25 lac` from 1 lac upwards (up to 2 decimals, trailing zeros trimmed);
 * below 1 lac it is the full figure, which is already short (`Rs 85,000`).
 */
export function formatPKRShort(amount: number): string {
  if (!Number.isFinite(amount)) throw new RangeError(`formatPKRShort: invalid amount ${amount}`);
  const rounded = Math.round(amount);
  if (Math.abs(rounded) < LAKH) return formatPKR(rounded);
  const lakhs = Math.round((Math.abs(rounded) / LAKH) * 100) / 100;
  const sign = rounded < 0 ? "-" : "";
  return `${sign}Rs ${lakhs.toFixed(2).replace(/\.?0+$/, "")} lac`;
}

export function isValidPrice(amount: unknown): amount is number {
  return (
    typeof amount === "number" &&
    Number.isInteger(amount) &&
    amount >= PRICE_MIN_PKR &&
    amount <= PRICE_MAX_PKR
  );
}

/**
 * Parse what a seller types into a price field: "125000", "1,25,000", "Rs 125,000", "1.25 lac",
 * "1.25 lakh", "125k". Returns integer rupees or null.
 */
export function parsePKR(input: string): number | null {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/^rs\.?\s*/, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
  const match = s.match(/^(\d+(?:\.\d+)?)\s*(lac|lacs|lakh|lakhs|k)?$/);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === "k" ? 1_000 : unit ? LAKH : 1;
  if (!unit && match[1]?.includes(".")) return null; // "125000.50" isn't a rupee amount
  const result = Math.round(value * multiplier);
  return Number.isSafeInteger(result) ? result : null;
}
