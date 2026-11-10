import { describe, expect, it } from "vitest";
import { imeiLast4, isValidImei, normalizeImei, passesLuhn } from "./imei";

// 490154203237518 is the standard Luhn-valid example IMEI used in documentation.
const VALID = "490154203237518";

describe("IMEI validation", () => {
  it("accepts a 15-digit Luhn-valid IMEI, ignoring separators", () => {
    expect(isValidImei(VALID)).toBe(true);
    expect(isValidImei("49-015420-323751-8")).toBe(true);
    expect(isValidImei("4901 5420 3237 518")).toBe(true);
  });

  it("rejects a wrong check digit, wrong length and non-digits", () => {
    expect(isValidImei("490154203237519")).toBe(false);
    expect(isValidImei("49015420323751")).toBe(false);
    expect(isValidImei("4901542032375180")).toBe(false);
    expect(isValidImei("49015420323751a")).toBe(false);
    expect(isValidImei("")).toBe(false);
  });

  it("computes Luhn", () => {
    expect(passesLuhn("79927398713")).toBe(true);
    expect(passesLuhn("79927398710")).toBe(false);
    expect(passesLuhn("12a4")).toBe(false);
  });

  it("normalises and exposes only the last 4 digits", () => {
    expect(normalizeImei(" 49-0154 2032/37518 ")).toBe(VALID);
    expect(imeiLast4(VALID)).toBe("7518");
    expect(() => imeiLast4("12")).toThrow(RangeError);
  });
});
