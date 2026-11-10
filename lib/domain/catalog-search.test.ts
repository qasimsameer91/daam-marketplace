import { describe, expect, it } from "vitest";
import { normalizeQuery, searchModels, type SearchableModel } from "./catalog-search";

const models: SearchableModel[] = [
  {
    slug: "iphone-13",
    brandSlug: "apple",
    name: "iPhone 13",
    aliases: ["i13", "13 simple"],
    popularity: 85,
  },
  {
    slug: "iphone-13-pro-max",
    brandSlug: "apple",
    name: "iPhone 13 Pro Max",
    aliases: ["13 pm", "13pm", "13 pro max"],
    popularity: 90,
  },
  {
    slug: "iphone-13-pro",
    brandSlug: "apple",
    name: "iPhone 13 Pro",
    aliases: ["13 pro"],
    popularity: 75,
  },
  {
    slug: "galaxy-s23-ultra",
    brandSlug: "samsung",
    name: "Galaxy S23 Ultra",
    aliases: ["s23u", "s23 ultra"],
    popularity: 85,
  },
  {
    slug: "redmi-note-13",
    brandSlug: "redmi",
    name: "Redmi Note 13",
    aliases: ["note 13", "rn13"],
    popularity: 65,
  },
  {
    slug: "galaxy-s23-plus",
    brandSlug: "samsung",
    name: "Galaxy S23+",
    aliases: ["s23 plus"],
    popularity: 45,
  },
];

describe("model search", () => {
  it("finds Pakistani shorthand", () => {
    expect(searchModels(models, "13 pm")[0]?.slug).toBe("iphone-13-pro-max");
    expect(searchModels(models, "s23u")[0]?.slug).toBe("galaxy-s23-ultra");
    expect(searchModels(models, "note 13")[0]?.slug).toBe("redmi-note-13");
    expect(searchModels(models, "S23+")[0]?.slug).toBe("galaxy-s23-plus");
  });

  it("ranks exact matches above partial ones, then by popularity", () => {
    const results = searchModels(models, "iphone 13").map((m) => m.slug);
    expect(results[0]).toBe("iphone-13");
    expect(results.slice(1)).toEqual(["iphone-13-pro-max", "iphone-13-pro"]);
  });

  it("returns popular models for an empty query and honours brand + limit", () => {
    expect(searchModels(models, "", { limit: 2 }).map((m) => m.slug)).toEqual([
      "iphone-13-pro-max",
      "iphone-13",
    ]);
    expect(
      searchModels(models, "", { brandSlug: "samsung" }).every((m) => m.brandSlug === "samsung"),
    ).toBe(true);
    expect(searchModels(models, "zzz")).toEqual([]);
  });

  it("normalizes spacing, case and plus signs", () => {
    expect(normalizeQuery(" 13 Pro-Max ")).toBe("13promax");
    expect(normalizeQuery("S23+")).toBe("s23plus");
  });
});
