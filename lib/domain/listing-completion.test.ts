import { describe, expect, it } from "vitest";
import { completionScore, type CompletionInput } from "./listing-completion";

const complete: CompletionInput = {
  photoCount: 6,
  descriptionLength: 120,
  batteryHealth: 88,
  supportsBatteryHealth: true,
  colorName: "Midnight",
  purchaseMonth: "2024-01",
};

describe("completion score", () => {
  it("is 100% with no hints when everything is filled in", () => {
    expect(completionScore(complete)).toEqual({ score: 100, hints: [] });
  });

  it("asks for the missing photos", () => {
    const result = completionScore({ ...complete, photoCount: 4 });
    expect(result.hints).toEqual([{ key: "photos", count: 2 }]);
    expect(result.score).toBeLessThan(100);
  });

  it("doesn't count battery health for phones that don't show it", () => {
    const result = completionScore({
      ...complete,
      batteryHealth: null,
      supportsBatteryHealth: false,
    });
    expect(result).toEqual({ score: 100, hints: [] });
    expect(completionScore({ ...complete, batteryHealth: null }).hints).toEqual([
      { key: "battery" },
    ]);
  });

  it("lists every missing piece and scores a bare listing low", () => {
    const bare = completionScore({
      photoCount: 3,
      descriptionLength: 0,
      batteryHealth: null,
      supportsBatteryHealth: true,
      colorName: null,
      purchaseMonth: null,
    });
    expect(bare.hints.map((h) => h.key)).toEqual([
      "photos",
      "description",
      "battery",
      "color",
      "purchase",
    ]);
    expect(bare.score).toBe(20);
  });
});
