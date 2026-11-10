import { describe, expect, it } from "vitest";
import { restoreDraftValues } from "./listing";

describe("stored sell draft recovery", () => {
  it("rejects non-object draft values", () => {
    for (const value of [null, [], "broken", 42]) expect(restoreDraftValues(value)).toBeNull();
  });
  it("retains usable fields while dropping malformed data", () => {
    expect(
      restoreDraftValues({
        brandSlug: "apple",
        modelSlug: "iphone-13-pro-max",
        repairs: "none",
        batteryHealth: 200,
        storageGb: 256,
      }),
    ).toEqual({ brandSlug: "apple", modelSlug: "iphone-13-pro-max", storageGb: 256 });
  });
  it("never restores IMEIs, photos or unknown fields from storage", () => {
    expect(
      restoreDraftValues({
        brandSlug: "apple",
        imei1: "490154203237518",
        imei2: "490154203237518",
        photos: [{ id: "old", url: "blob:expired" }],
        untrusted: true,
      }),
    ).toEqual({ brandSlug: "apple" });
  });
});
