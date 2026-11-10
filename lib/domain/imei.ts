/**
 * IMEI format checks (plan §8, §11). Pure validation only: encryption and hashing live in
 * lib/security/imei.ts (server-only, Phase 6). Never log or display a full IMEI.
 */

/** Strip spaces, dashes and slashes people paste from `*#06#` screens or box labels. */
export function normalizeImei(input: string): string {
  return input.replace(/[\s\-/]/g, "");
}

/** Luhn checksum over a digit string. */
export function passesLuhn(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** A valid IMEI is exactly 15 digits and passes Luhn. */
export function isValidImei(input: string): boolean {
  const digits = normalizeImei(input);
  return digits.length === 15 && passesLuhn(digits);
}

/** Last 4 digits: the only part of an IMEI that may ever be shown publicly ("••••1234"). */
export function imeiLast4(input: string): string {
  const digits = normalizeImei(input);
  if (digits.length < 4 || !/^\d+$/.test(digits)) throw new RangeError("imeiLast4: not an IMEI");
  return digits.slice(-4);
}
