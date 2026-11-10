/**
 * Pakistani mobile numbers (plan §12). Accept `03XXXXXXXXX` or `+923XXXXXXXXX`
 * (spaces, dashes and brackets are ignored); store E.164 `+923XXXXXXXXX`.
 *
 * Phone numbers are personal data: never log them, never put them in public queries or HTML.
 */

/** The canonical input pattern from the plan, applied after stripping separators. */
export const PK_MOBILE_PATTERN = /^(?:\+92|0)3\d{9}$/;
const E164_PATTERN = /^\+923\d{9}$/;

function stripSeparators(input: string): string {
  return input.trim().replace(/[\s\-().]/g, "");
}

/** Normalise to E.164 (`+923001234567`) or return null if it isn't a Pakistani mobile number. */
export function normalizePakistaniMobile(input: string): string | null {
  const compact = stripSeparators(input);
  if (!PK_MOBILE_PATTERN.test(compact)) return null;
  return compact.startsWith("+92") ? compact : `+92${compact.slice(1)}`;
}

export function isValidPakistaniMobile(input: string): boolean {
  return normalizePakistaniMobile(input) !== null;
}

export function isE164PakistaniMobile(value: string): boolean {
  return E164_PATTERN.test(value);
}

/** Local display format: `0300 1234567`. Throws on non-E.164 input to catch bugs early. */
export function formatPakistaniMobile(e164: string): string {
  if (!isE164PakistaniMobile(e164))
    throw new RangeError("formatPakistaniMobile: expected +923XXXXXXXXX");
  const local = `0${e164.slice(3)}`;
  return `${local.slice(0, 4)} ${local.slice(4)}`;
}

/**
 * WhatsApp deep link (§12): `https://wa.me/92XXXXXXXXXX?text=…`.
 * Only call this server-side inside the revealContact flow, never while rendering public pages.
 */
export function whatsappLink(e164: string, message?: string): string {
  if (!isE164PakistaniMobile(e164)) throw new RangeError("whatsappLink: expected +923XXXXXXXXX");
  const base = `https://wa.me/${e164.slice(1)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
