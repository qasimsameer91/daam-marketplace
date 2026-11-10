import { describe, expect, it } from "vitest";
import {
  PHONE_CONDITIONS,
  batteryTone,
  conditionBand,
  conditionRank,
  conditionScore,
  isValidBatteryHealth,
  requiresBatteryHealth,
  requiresDisclosure,
} from "./condition";

describe("condition bands (§10)", () => {
  it("maps grades to Daam Meter bands", () => {
    expect(conditionBand("brand_new")).toBe("new");
    expect(conditionBand("open_box")).toBe("new");
    expect(conditionBand("like_new")).toBe("excellent");
    expect(conditionBand("grade_9")).toBe("excellent");
    expect(conditionBand("grade_8")).toBe("good");
    expect(conditionBand("grade_7")).toBe("good");
    expect(conditionBand("used")).toBe("fair");
    expect(conditionBand("refurbished")).toBe("fair");
    expect(conditionBand("for_parts")).toBeNull();
  });

  it("orders conditions best to worst", () => {
    expect(conditionRank("brand_new")).toBe(0);
    expect(conditionRank("for_parts")).toBe(PHONE_CONDITIONS.length - 1);
  });

  it("gives numeric grades a mono score", () => {
    expect(conditionScore("grade_9")).toBe("9/10");
    expect(conditionScore("like_new")).toBe("10/10");
    expect(conditionScore("brand_new")).toBeNull();
  });

  it("requires disclosure for used, refurbished and parts phones", () => {
    expect(requiresDisclosure("used")).toBe(true);
    expect(requiresDisclosure("refurbished")).toBe(true);
    expect(requiresDisclosure("for_parts")).toBe(true);
    expect(requiresDisclosure("grade_8")).toBe(false);
  });
});

describe("battery health (§7.2)", () => {
  it("is required for used iPhones only", () => {
    expect(requiresBatteryHealth({ brandSlug: "apple", condition: "grade_9" })).toBe(true);
    expect(requiresBatteryHealth({ brandSlug: "apple", condition: "used" })).toBe(true);
    expect(requiresBatteryHealth({ brandSlug: "apple", condition: "brand_new" })).toBe(false);
    expect(requiresBatteryHealth({ brandSlug: "apple", condition: "open_box" })).toBe(false);
    expect(requiresBatteryHealth({ brandSlug: "samsung", condition: "grade_9" })).toBe(false);
  });

  it("accepts integers 0–100 only", () => {
    expect(isValidBatteryHealth(0)).toBe(true);
    expect(isValidBatteryHealth(100)).toBe(true);
    expect(isValidBatteryHealth(89)).toBe(true);
    expect(isValidBatteryHealth(101)).toBe(false);
    expect(isValidBatteryHealth(-1)).toBe(false);
    expect(isValidBatteryHealth(88.5)).toBe(false);
    expect(isValidBatteryHealth("89")).toBe(false);
  });

  it("tones battery health", () => {
    expect(batteryTone(95)).toBe("success");
    expect(batteryTone(85)).toBe("success");
    expect(batteryTone(82)).toBe("neutral");
    expect(batteryTone(79)).toBe("warning");
  });
});
