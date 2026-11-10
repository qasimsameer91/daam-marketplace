import { describe, expect, it } from "vitest";
import { createListingSchema, type ListingInput } from "./listing";

const NOW = new Date("2026-11-10T12:00:00Z");
const schema = createListingSchema({ now: NOW });
const IMEI_A = "490154203237518";
const IMEI_B = "356938035643809";

const valid: ListingInput = {
  brandSlug: "apple",
  modelSlug: "iphone-13-pro-max",
  customBrand: "",
  customModel: "",
  storageGb: 256,
  ramGb: null,
  colorName: "Sierra Blue",
  ptaStatus: "pta_approved",
  networkLock: "factory_unlocked",
  ptaRegType: "individual_tax_paid",
  imei1: IMEI_A,
  imei2: "",
  condition: "grade_9",
  batteryHealth: 88,
  screen: "flawless",
  body: "minor_marks",
  repairs: ["none"],
  functionalIssues: ["none"],
  boxStatus: "box_matching_imei",
  accessories: ["cable"],
  warrantyType: "none",
  warrantyMonths: null,
  purchaseMonth: "2023-01",
  photos: [1, 2, 3].map((n) => ({ id: `p${n}`, url: `blob:${n}` })),
  pricePkr: 189000,
  isNegotiable: true,
  citySlug: "lahore",
  areaSlug: "gulberg",
  description: "",
  contactChat: true,
  contactWhatsapp: true,
  contactCall: false,
};

/** Error codes reported for a field. */
function errorsFor(input: ListingInput, field: string): string[] {
  const result = schema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.filter((i) => i.path[0] === field).map((i) => i.message);
}

describe("listing schema", () => {
  it("accepts a complete, valid listing", () => {
    const result = schema.safeParse(valid);
    expect(result.success, JSON.stringify(!result.success && result.error.issues)).toBe(true);
  });

  describe("catalog (§5)", () => {
    it("needs a model and storage for known brands", () => {
      expect(errorsFor({ ...valid, modelSlug: null }, "modelSlug")).toEqual(["model_required"]);
      expect(errorsFor({ ...valid, storageGb: null }, "storageGb")).toEqual(["storage_required"]);
    });

    it("needs free-text names for 'Other' brands, not a catalog model", () => {
      const other = { ...valid, brandSlug: "other", modelSlug: null, storageGb: null };
      expect(errorsFor(other, "customBrand")).toEqual(["custom_brand_required"]);
      expect(errorsFor(other, "customModel")).toEqual(["custom_model_required"]);
      expect(schema.safeParse({ ...other, customBrand: "Itel", customModel: "S23" }).success).toBe(
        true,
      );
    });
  });

  describe("PTA rules (§6.3)", () => {
    it("rejects JV + PTA Approved", () => {
      expect(errorsFor({ ...valid, networkLock: "jv" }, "networkLock")).toContain(
        "jv_cannot_be_pta_approved",
      );
    });

    it("rejects JV on non-Apple phones", () => {
      const samsung = {
        ...valid,
        brandSlug: "samsung",
        modelSlug: "galaxy-s23-ultra",
        ptaStatus: "non_pta" as const,
        ptaRegType: null,
        networkLock: "jv" as const,
      };
      expect(errorsFor(samsung, "networkLock")).toEqual(["jv_requires_apple"]);
    });

    it("allows JV on a non-approved iPhone", () => {
      expect(
        schema.safeParse({ ...valid, ptaStatus: "non_pta", ptaRegType: null, networkLock: "jv" })
          .success,
      ).toBe(true);
    });

    it("allows a registration type only for PTA Approved phones", () => {
      expect(errorsFor({ ...valid, ptaStatus: "non_pta" }, "ptaRegType")).toEqual([
        "reg_type_requires_approved",
      ]);
    });
  });

  describe("IMEI (§8)", () => {
    it("requires a valid 15-digit IMEI", () => {
      expect(errorsFor({ ...valid, imei1: "" }, "imei1")).toEqual(["imei_invalid"]);
      expect(errorsFor({ ...valid, imei1: "490154203237519" }, "imei1")).toEqual(["imei_invalid"]);
    });

    it("validates an optional second IMEI and rejects duplicates", () => {
      expect(errorsFor({ ...valid, imei2: "123" }, "imei2")).toEqual(["imei_invalid"]);
      expect(errorsFor({ ...valid, imei2: "49 015420 3237518" }, "imei2")).toEqual([
        "imei_duplicate",
      ]);
      expect(schema.safeParse({ ...valid, imei2: IMEI_B }).success).toBe(true);
    });
  });

  describe("condition (§7)", () => {
    it("requires battery health for used iPhones only", () => {
      expect(errorsFor({ ...valid, batteryHealth: null }, "batteryHealth")).toEqual([
        "battery_required",
      ]);
      expect(
        schema.safeParse({ ...valid, batteryHealth: null, condition: "brand_new" }).success,
      ).toBe(true);
      expect(
        schema.safeParse({ ...valid, batteryHealth: null, condition: "open_box" }).success,
      ).toBe(true);
      const pixel = {
        ...valid,
        brandSlug: "google",
        modelSlug: "pixel-7-pro",
        ptaRegType: null,
        ptaStatus: "non_pta" as const,
        batteryHealth: null,
      };
      expect(schema.safeParse(pixel).success).toBe(true);
    });

    it("keeps battery health within 0–100", () => {
      expect(errorsFor({ ...valid, batteryHealth: 101 }, "batteryHealth")).toEqual([
        "battery_range",
      ]);
      expect(errorsFor({ ...valid, batteryHealth: 88.5 }, "batteryHealth")).toEqual([
        "battery_range",
      ]);
    });

    it("doesn't let 'none' combine with other repairs or issues", () => {
      expect(errorsFor({ ...valid, repairs: ["none", "screen"] }, "repairs")).toEqual([
        "none_exclusive",
      ]);
      expect(
        errorsFor({ ...valid, functionalIssues: ["none", "speaker"] }, "functionalIssues"),
      ).toEqual(["none_exclusive"]);
    });

    it("requires a fault description for used, refurbished and parts phones", () => {
      expect(errorsFor({ ...valid, condition: "used" }, "description")).toEqual([
        "disclosure_required",
      ]);
      expect(
        schema.safeParse({
          ...valid,
          condition: "used",
          description: "Back glass has a crack near the camera.",
        }).success,
      ).toBe(true);
    });
  });

  describe("extras", () => {
    it("requires 1–36 warranty months when there is a warranty", () => {
      expect(errorsFor({ ...valid, warrantyType: "shop" }, "warrantyMonths")).toEqual([
        "warranty_months_required",
      ]);
      expect(
        errorsFor({ ...valid, warrantyType: "shop", warrantyMonths: 40 }, "warrantyMonths"),
      ).toEqual(["warranty_months_required"]);
      expect(schema.safeParse({ ...valid, warrantyType: "shop", warrantyMonths: 3 }).success).toBe(
        true,
      );
    });

    it("rejects a malformed or future purchase month", () => {
      expect(errorsFor({ ...valid, purchaseMonth: "2023-13" }, "purchaseMonth")).toEqual([
        "purchase_month_invalid",
      ]);
      expect(errorsFor({ ...valid, purchaseMonth: "2026-12" }, "purchaseMonth")).toEqual([
        "purchase_month_future",
      ]);
      expect(schema.safeParse({ ...valid, purchaseMonth: "2026-11" }).success).toBe(true);
    });
  });

  describe("photos, price, location, contact", () => {
    it("needs 3–10 photos", () => {
      expect(errorsFor({ ...valid, photos: valid.photos.slice(0, 2) }, "photos")).toEqual([
        "photos_min",
      ]);
      const eleven = Array.from({ length: 11 }, (_, i) => ({ id: `p${i}`, url: `blob:${i}` }));
      expect(errorsFor({ ...valid, photos: eleven }, "photos")).toEqual(["photos_max"]);
    });

    it("needs an integer price between Rs 1,000 and Rs 2,000,000", () => {
      expect(errorsFor({ ...valid, pricePkr: 999 }, "pricePkr")).toEqual(["price_range"]);
      expect(errorsFor({ ...valid, pricePkr: 2000001 }, "pricePkr")).toEqual(["price_range"]);
      expect(errorsFor({ ...valid, pricePkr: 1500.5 }, "pricePkr")).toEqual(["price_invalid"]);
      expect(errorsFor({ ...valid, pricePkr: Number.NaN }, "pricePkr")).toEqual(["price_invalid"]);
    });

    it("needs a city and a description under 2,000 characters", () => {
      expect(errorsFor({ ...valid, citySlug: "" }, "citySlug")).toEqual(["city_required"]);
      expect(errorsFor({ ...valid, description: "x".repeat(2001) }, "description")).toEqual([
        "description_max",
      ]);
    });

    it("needs at least one contact method", () => {
      expect(
        errorsFor(
          { ...valid, contactChat: false, contactWhatsapp: false, contactCall: false },
          "contactChat",
        ),
      ).toEqual(["contact_required"]);
    });
  });
});

describe("step schemas", () => {
  it("reports screen-level rules even when later screens are empty", async () => {
    const { createStepSchema } = await import("./listing");
    const phone = createStepSchema("phone", { now: NOW }).safeParse({
      brandSlug: "apple",
      modelSlug: null,
      customBrand: "",
      customModel: "",
      storageGb: null,
      ramGb: null,
      colorName: null,
    });
    expect(phone.success).toBe(false);
    const codes = !phone.success ? phone.error.issues.map((i) => i.message) : [];
    expect(codes).toEqual(expect.arrayContaining(["model_required", "storage_required"]));
  });

  it("uses earlier answers as context (JV needs the brand)", async () => {
    const { createStepSchema } = await import("./listing");
    const pta = createStepSchema("pta", { now: NOW }).safeParse({
      brandSlug: "samsung",
      ptaStatus: "non_pta",
      networkLock: "jv",
      ptaRegType: null,
      imei1: IMEI_A,
      imei2: "",
    });
    expect(!pta.success && pta.error.issues.map((i) => i.message)).toEqual(["jv_requires_apple"]);
  });

  it("only reports issues for the screen's own fields", async () => {
    const { createStepSchema } = await import("./listing");
    const price = createStepSchema("price", { now: NOW }).safeParse({
      condition: "used",
      pricePkr: 50000,
      isNegotiable: true,
      citySlug: "lahore",
      areaSlug: null,
      description: "",
      contactChat: true,
      contactWhatsapp: false,
      contactCall: false,
    });
    expect(!price.success && price.error.issues.map((i) => i.path[0])).toEqual(["description"]);
  });
});
