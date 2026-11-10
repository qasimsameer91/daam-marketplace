import { describe, expect, it } from "vitest";
import {
  PRICE_MAX_PKR,
  PRICE_MIN_PKR,
  formatPKR,
  formatPKRShort,
  isValidPrice,
  parsePKR,
} from "./pricing";

describe("formatPKR", () => {
  it("formats integer rupees with thousands separators", () => {
    expect(formatPKR(125000)).toBe("Rs 125,000");
    expect(formatPKR(1000)).toBe("Rs 1,000");
    expect(formatPKR(999)).toBe("Rs 999");
    expect(formatPKR(2000000)).toBe("Rs 2,000,000");
    expect(formatPKR(0)).toBe("Rs 0");
  });

  it("rounds stray decimals and handles negatives", () => {
    expect(formatPKR(124999.6)).toBe("Rs 125,000");
    expect(formatPKR(-5000)).toBe("-Rs 5,000");
  });

  it("rejects non-finite input", () => {
    expect(() => formatPKR(Number.NaN)).toThrow(RangeError);
    expect(() => formatPKR(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("formatPKRShort", () => {
  it("uses lac from 1 lac upwards", () => {
    expect(formatPKRShort(125000)).toBe("Rs 1.25 lac");
    expect(formatPKRShort(100000)).toBe("Rs 1 lac");
    expect(formatPKRShort(150000)).toBe("Rs 1.5 lac");
    expect(formatPKRShort(1550000)).toBe("Rs 15.5 lac");
    expect(formatPKRShort(2000000)).toBe("Rs 20 lac");
    expect(formatPKRShort(129999)).toBe("Rs 1.3 lac");
  });

  it("keeps the full figure below 1 lac", () => {
    expect(formatPKRShort(85000)).toBe("Rs 85,000");
    expect(formatPKRShort(99999)).toBe("Rs 99,999");
  });
});

describe("isValidPrice", () => {
  it("matches the DB constraint (integer, 1,000 – 2,000,000)", () => {
    expect(isValidPrice(PRICE_MIN_PKR)).toBe(true);
    expect(isValidPrice(PRICE_MAX_PKR)).toBe(true);
    expect(isValidPrice(999)).toBe(false);
    expect(isValidPrice(2000001)).toBe(false);
    expect(isValidPrice(1500.5)).toBe(false);
    expect(isValidPrice("125000")).toBe(false);
  });
});

describe("parsePKR", () => {
  it("parses plain, grouped and prefixed amounts", () => {
    expect(parsePKR("125000")).toBe(125000);
    expect(parsePKR("125,000")).toBe(125000);
    expect(parsePKR("1,25,000")).toBe(125000);
    expect(parsePKR("Rs 125,000")).toBe(125000);
    expect(parsePKR("rs. 85000")).toBe(85000);
  });

  it("parses lac and k shorthand", () => {
    expect(parsePKR("1.25 lac")).toBe(125000);
    expect(parsePKR("1.25lakh")).toBe(125000);
    expect(parsePKR("2 lacs")).toBe(200000);
    expect(parsePKR("125k")).toBe(125000);
  });

  it("rejects junk", () => {
    expect(parsePKR("")).toBeNull();
    expect(parsePKR("abc")).toBeNull();
    expect(parsePKR("12-000")).toBeNull();
    expect(parsePKR("125000.5")).toBeNull();
  });
});
