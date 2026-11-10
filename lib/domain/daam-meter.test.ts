import { describe, expect, it } from "vitest";
import { bandForPrice, isDaamBand } from "./daam-meter";

describe("Daam Meter bands (§10)", () => {
  const range = { low: 100_000, high: 120_000 };

  it("bands a price against p25–p75", () => {
    expect(bandForPrice(95_000, range)).toBe("great");
    expect(bandForPrice(100_000, range)).toBe("fair");
    expect(bandForPrice(120_000, range)).toBe("fair");
    expect(bandForPrice(130_000, range)).toBe("high");
  });

  it("is unknown without enough comparables or a usable price", () => {
    expect(bandForPrice(100_000, null)).toBe("unknown");
    expect(bandForPrice(Number.NaN, range)).toBe("unknown");
    expect(bandForPrice(0, range)).toBe("unknown");
  });

  it("recognises band values", () => {
    expect(isDaamBand("great")).toBe(true);
    expect(isDaamBand("cheap")).toBe(false);
  });
});
