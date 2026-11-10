import { describe, expect, it } from "vitest";
import { filterListings, type BrowseFilters } from "./browse";
import { listings, models, mockNow } from "@/lib/mock/marketplace";
const empty: BrowseFilters = {
  q: "",
  brand: "",
  model: "",
  city: "",
  area: "",
  pta: "",
  lock: "",
  condition: "",
  storage: 0,
  ram: 0,
  min: 0,
  max: 0,
  battery: 0,
  color: "",
  seller: "",
  warranty: false,
  box: false,
  imei: false,
  checked: false,
  days: 0,
  sort: "newest",
};
const find = (patch: Partial<BrowseFilters>) =>
  filterListings(listings, { ...empty, ...patch }, mockNow, models);
describe("mock marketplace browse", () => {
  it("recognizes Pakistani aliases", () => {
    expect(find({ q: "13 pm" }).length).toBeGreaterThan(0);
    expect(find({ q: "13 pm" }).every((l) => l.model === "iphone-13-pro-max")).toBe(true);
    expect(find({ q: "s23u" }).every((l) => l.brand === "samsung")).toBe(true);
  });
  it("includes child brands in Xiaomi", () => {
    expect(find({ brand: "xiaomi" }).length).toBeGreaterThan(0);
    expect(
      find({ brand: "xiaomi" }).every((l) => ["xiaomi", "redmi", "poco"].includes(l.brand)),
    ).toBe(true);
  });
  it("combines location, PTA, price, battery and condition constraints", () => {
    const l = listings[0]!;
    const result = find({
      city: l.citySlug,
      pta: l.ptaStatus,
      min: l.pricePkr,
      max: l.pricePkr,
      battery: 85,
      condition: l.condition,
    });
    expect(result.map((row) => row.id)).toContain(l.id);
    expect(find({ min: 900000 })).toEqual([]);
  });
  it("excludes CPID and unknown PTA from best deals", () => {
    expect(
      find({ sort: "deals" }).every((l) => !["cpid_patched", "unknown"].includes(l.ptaStatus)),
    ).toBe(true);
  });
  it("sorts prices and preserves the source order", () => {
    const ids = listings.map((l) => l.id);
    const prices = find({ sort: "low" }).map((l) => l.pricePkr);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(listings.map((l) => l.id)).toEqual(ids);
  });
  it("applies ownership-independent public feature filters", () => {
    expect(
      find({ checked: true, box: true, warranty: true }).every(
        (l) => l.checked && l.box && l.warranty,
      ),
    ).toBe(true);
    expect(
      find({ days: 1 }).every(
        (l) => mockNow.getTime() - new Date(l.publishedAt).getTime() <= 86400000,
      ),
    ).toBe(true);
  });
});
