import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv, type CsvRow } from "@/lib/csv";

type Row = CsvRow;

function readCsv(file: string): Row[] {
  return parseCsv(readFileSync(join(__dirname, file), "utf8"), file);
}

const brands = readCsv("brands.csv");
const cities = readCsv("cities.csv");
const areas = readCsv("areas.csv");
const models = readCsv("models.csv");
const variants = readCsv("variants.csv");
const colors = readCsv("colors.csv");
const aliases = readCsv("aliases.csv");
const blocks = readCsv("content_blocks.csv");
const settings = readCsv("app_settings.csv");

const bool = (v: string | undefined) => v === "true" || v === "false";
const unique = (values: string[]) => new Set(values).size === values.length;

describe("seed: brands", () => {
  const slugs = new Set(brands.map((b) => b.slug));

  it("has unique ids and slugs", () => {
    expect(unique(brands.map((b) => b.id ?? ""))).toBe(true);
    expect(unique(brands.map((b) => b.slug ?? ""))).toBe(true);
  });

  it("includes every launch brand from plan section 5", () => {
    for (const s of [
      "apple",
      "samsung",
      "google",
      "oneplus",
      "xiaomi",
      "redmi",
      "poco",
      "oppo",
      "vivo",
      "realme",
      "tecno",
      "infinix",
      "huawei",
      "motorola",
      "nokia",
      "sony",
      "other",
    ]) {
      expect(slugs.has(s)).toBe(true);
    }
  });

  it("makes Redmi and Poco children of Xiaomi", () => {
    expect(brands.find((b) => b.slug === "redmi")?.parent_slug).toBe("xiaomi");
    expect(brands.find((b) => b.slug === "poco")?.parent_slug).toBe("xiaomi");
    for (const b of brands) if (b.parent_slug) expect(slugs.has(b.parent_slug)).toBe(true);
  });
});

describe("seed: locations", () => {
  const citySlugs = new Set(cities.map((c) => c.slug));

  it("has 29 cities with unique slugs, Urdu names and boolean is_major", () => {
    expect(cities).toHaveLength(29);
    expect(unique(cities.map((c) => c.slug ?? ""))).toBe(true);
    for (const c of cities) {
      expect(c.name_ur).not.toBe("");
      expect(bool(c.is_major)).toBe(true);
    }
  });

  it("only references known cities and keeps area slugs unique per city", () => {
    for (const a of areas) expect(citySlugs.has(a.city_slug ?? "")).toBe(true);
    expect(unique(areas.map((a) => `${a.city_slug}/${a.slug}`))).toBe(true);
  });

  it("meets the area targets (Lahore 25–40, Karachi/Islamabad/Rawalpindi 10–20)", () => {
    const count = (city: string) => areas.filter((a) => a.city_slug === city).length;
    expect(count("lahore")).toBeGreaterThanOrEqual(25);
    expect(count("lahore")).toBeLessThanOrEqual(40);
    for (const city of ["karachi", "islamabad", "rawalpindi"]) {
      expect(count(city)).toBeGreaterThanOrEqual(10);
      expect(count(city)).toBeLessThanOrEqual(20);
    }
  });
});

describe("seed: catalog", () => {
  const brandSlugs = new Set(brands.map((b) => b.slug));
  const modelSlugs = new Set(models.map((m) => m.slug));

  it("has globally unique model slugs that belong to known brands", () => {
    expect(unique(models.map((m) => m.slug ?? ""))).toBe(true);
    for (const m of models) {
      expect(brandSlugs.has(m.brand_slug ?? "")).toBe(true);
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(bool(m.supports_battery_health)).toBe(true);
      expect(bool(m.needs_review)).toBe(true);
      expect(Number(m.release_year)).toBeGreaterThanOrEqual(2017);
      expect(Number(m.release_year)).toBeLessThanOrEqual(2026);
      expect(Number(m.popularity)).toBeGreaterThanOrEqual(0);
      expect(Number(m.popularity)).toBeLessThanOrEqual(100);
    }
  });

  it("marks every iPhone as supporting battery health (it is required for iPhones)", () => {
    for (const m of models.filter((x) => x.brand_slug === "apple")) {
      expect(m.supports_battery_health).toBe("true");
    }
  });

  it("gives every model at least one variant and keeps variants unique", () => {
    const withVariants = new Set(variants.map((v) => v.model_slug));
    for (const s of modelSlugs) expect(withVariants.has(s)).toBe(true);
    expect(unique(variants.map((v) => `${v.model_slug}/${v.ram_gb}/${v.storage_gb}`))).toBe(true);
  });

  it("stores storage as a positive integer and RAM as empty (iPhone) or a positive integer", () => {
    for (const v of variants) {
      expect(modelSlugs.has(v.model_slug ?? "")).toBe(true);
      expect(Number.isInteger(Number(v.storage_gb)) && Number(v.storage_gb) > 0).toBe(true);
      if (v.ram_gb !== "")
        expect(Number.isInteger(Number(v.ram_gb)) && Number(v.ram_gb) > 0).toBe(true);
      expect(bool(v.needs_review)).toBe(true);
    }
  });

  it("only uses 6-digit hex colours on known models", () => {
    for (const c of colors) {
      expect(modelSlugs.has(c.model_slug ?? "")).toBe(true);
      expect(c.hex).toMatch(/^#[0-9A-F]{6}$/i);
    }
    expect(unique(colors.map((c) => `${c.model_slug}/${c.name}`))).toBe(true);
  });

  it("has lowercase, unique-per-model aliases including the Pakistani shorthand examples", () => {
    for (const a of aliases) {
      expect(modelSlugs.has(a.model_slug ?? "")).toBe(true);
      expect(a.alias).toBe(a.alias?.toLowerCase());
    }
    expect(unique(aliases.map((a) => `${a.model_slug}/${a.alias}`))).toBe(true);
    const lookup = (alias: string) =>
      aliases.filter((a) => a.alias === alias).map((a) => a.model_slug);
    expect(lookup("13 pm")).toEqual(["iphone-13-pro-max"]);
    expect(lookup("s23u")).toEqual(["galaxy-s23-ultra"]);
    expect(lookup("note 13")).toEqual(["redmi-note-13"]);
  });
});

describe("seed: content blocks", () => {
  const byKey = new Map(blocks.map((b) => [b.key, b]));

  it("covers every PTA status, network lock, check step and meetup tip", () => {
    const required = [
      "pta_status.pta_approved",
      "pta_status.non_pta",
      "pta_status.cpid_patched",
      "pta_status.unknown",
      "network_lock.factory_unlocked",
      "network_lock.carrier_locked",
      "network_lock.jv",
      "network_lock.unknown",
      "pta_check.seller_declared",
      "pta_check.daam_checked",
      "cpid.banner",
      ...[1, 2, 3, 4, 5].map((n) => `check_before_pay.step_${n}`),
      "safety.meetup.public_place",
      "safety.meetup.check_imei",
      "safety.meetup.no_advance",
    ];
    for (const k of required) expect(byKey.has(k)).toBe(true);
  });

  it("has English and draft Urdu for every block", () => {
    for (const b of blocks) {
      expect(b.body_en).not.toBe("");
      expect(b.body_ur).not.toBe("");
      expect(b.review_status).toBe("ur_draft");
    }
  });

  it("never implies CPID or JV is PTA approval", () => {
    expect(byKey.get("pta_status.cpid_patched")?.body_en).toMatch(/not PTA approval/i);
    expect(byKey.get("cpid.banner")?.body_en).toMatch(/not PTA approved/i);
    expect(byKey.get("network_lock.jv")?.body_en).toMatch(/not PTA approved/i);
  });

  it("never claims Daam verified anything outside the daam_checked block", () => {
    for (const b of blocks) {
      if (b.key === "pta_check.daam_checked") continue;
      expect(b.body_en).not.toMatch(/(IMEI|PTA) verified/i);
    }
  });
});

describe("seed: app settings", () => {
  it("matches the Phase 1 defaults", () => {
    const value = (key: string) =>
      JSON.parse(settings.find((s) => s.key === key)?.value ?? "null") as unknown;
    expect(value("allow_cpid_listings")).toBe(true);
    expect(value("max_free_listings_individual")).toBe(3);
    expect(value("premoderation_enabled")).toBe(true);
    expect(value("scam_price_ratio")).toBe(0.5);
    expect(value("listing_expiry_days")).toBe(30);
    expect(value("daam_min_comparables")).toBe(5);
  });
});
