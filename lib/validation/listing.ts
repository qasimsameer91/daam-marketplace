/**
 * Listing schema shared by the sell wizard (client) and, from Phase 6, the server actions.
 * Implements plan §6 (PTA), §7 (condition/specs) and §8 (wizard) rules.
 *
 * Error messages are stable codes (e.g. "imei_invalid"); the UI translates them with
 * `t(\`Sell.errors.${code}\`)`, so the same schema serves English and Urdu.
 */
import { z } from "zod";
import {
  ACCESSORIES,
  BODY_CONDITIONS,
  BOX_STATUSES,
  FUNCTIONAL_ISSUES,
  PHONE_CONDITIONS,
  REPAIRS,
  SCREEN_CONDITIONS,
  WARRANTY_TYPES,
  requiresBatteryHealth,
  requiresDisclosure,
} from "@/lib/domain/condition";
import { isValidImei, normalizeImei } from "@/lib/domain/imei";
import { PRICE_MAX_PKR, PRICE_MIN_PKR } from "@/lib/domain/pricing";
import {
  NETWORK_LOCKS,
  PTA_REG_TYPES,
  PTA_STATUSES,
  validatePtaCombination,
} from "@/lib/domain/pta";

export const MIN_PHOTOS = 3;
export const MAX_PHOTOS = 10;
export const MAX_DESCRIPTION = 2000;
export const MIN_DISCLOSURE = 20;
export const MAX_WARRANTY_MONTHS = 36;
export const OTHER_BRAND = "other";

export type ListingErrorCode =
  | "brand_required"
  | "model_required"
  | "storage_required"
  | "custom_brand_required"
  | "custom_model_required"
  | "pta_status_required"
  | "network_lock_required"
  | "jv_requires_apple"
  | "jv_cannot_be_pta_approved"
  | "reg_type_requires_approved"
  | "imei_invalid"
  | "imei_duplicate"
  | "condition_required"
  | "battery_required"
  | "battery_range"
  | "screen_required"
  | "body_required"
  | "none_exclusive"
  | "box_required"
  | "warranty_months_required"
  | "purchase_month_invalid"
  | "purchase_month_future"
  | "photos_min"
  | "photos_max"
  | "price_invalid"
  | "price_range"
  | "city_required"
  | "description_max"
  | "disclosure_required"
  | "contact_required";

const code = (c: ListingErrorCode) => c;

/** Arrays where "none" means nothing else may be selected. */
const exclusiveNone = <T extends string>(values: readonly [T, ...T[]]) =>
  z
    .array(z.enum(values))
    .refine((v) => !(v.includes("none" as T) && v.length > 1), code("none_exclusive"));

const photoSchema = z.object({
  id: z.string().min(1),
  /** Blob URL in the wizard; storage path once uploaded (Phase 6). */
  url: z.string().min(1),
});
export type ListingPhoto = z.infer<typeof photoSchema>;

const baseShape = {
  // Screen 1: your phone
  brandSlug: z.string().min(1, code("brand_required")),
  modelSlug: z.string().nullable(),
  customBrand: z.string().trim().max(40),
  customModel: z.string().trim().max(60),
  storageGb: z.number().int().positive().nullable(),
  ramGb: z.number().int().positive().nullable(),
  colorName: z.string().trim().max(40).nullable(),
  // Screen 2: PTA & network
  ptaStatus: z.enum(PTA_STATUSES, code("pta_status_required")),
  networkLock: z.enum(NETWORK_LOCKS, code("network_lock_required")),
  ptaRegType: z.enum(PTA_REG_TYPES).nullable(),
  imei1: z.string().refine(isValidImei, code("imei_invalid")),
  imei2: z.string(),
  // Screen 3: condition
  condition: z.enum(PHONE_CONDITIONS, code("condition_required")),
  batteryHealth: z
    .number(code("battery_range"))
    .int(code("battery_range"))
    .min(0, code("battery_range"))
    .max(100, code("battery_range"))
    .nullable(),
  screen: z.enum(SCREEN_CONDITIONS, code("screen_required")),
  body: z.enum(BODY_CONDITIONS, code("body_required")),
  repairs: exclusiveNone(REPAIRS),
  functionalIssues: exclusiveNone(FUNCTIONAL_ISSUES),
  // Screen 4: box & extras
  boxStatus: z.enum(BOX_STATUSES, code("box_required")),
  accessories: z.array(z.enum(ACCESSORIES)),
  warrantyType: z.enum(WARRANTY_TYPES),
  warrantyMonths: z.number().int().nullable(),
  purchaseMonth: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, code("purchase_month_invalid"))
    .nullable(),
  // Screen 5: photos
  photos: z
    .array(photoSchema)
    .min(MIN_PHOTOS, code("photos_min"))
    .max(MAX_PHOTOS, code("photos_max")),
  // Screen 6: price & location
  pricePkr: z
    .number(code("price_invalid"))
    .int(code("price_invalid"))
    .min(PRICE_MIN_PKR, code("price_range"))
    .max(PRICE_MAX_PKR, code("price_range")),
  isNegotiable: z.boolean(),
  citySlug: z.string(code("city_required")).min(1, code("city_required")),
  areaSlug: z.string().nullable(),
  description: z.string().trim().max(MAX_DESCRIPTION, code("description_max")),
  contactChat: z.boolean(),
  contactWhatsapp: z.boolean(),
  contactCall: z.boolean(),
};

export type ListingField = keyof typeof baseShape;

/** Recover only known, well-typed draft fields; localStorage may contain stale or corrupt data. */
export function restoreDraftValues(input: unknown): Partial<ListingInput> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const entries: [string, unknown][] = [];
  for (const [key, schema] of Object.entries(baseShape)) {
    if (["photos", "imei1", "imei2"].includes(key) || !(key in record)) continue;
    const parsed = schema.safeParse(record[key]);
    if (parsed.success) entries.push([key, parsed.data]);
  }
  return Object.fromEntries(entries) as Partial<ListingInput>;
}

/** Fields validated on each wizard screen (plan §8). */
export const STEP_FIELDS = {
  phone: [
    "brandSlug",
    "modelSlug",
    "customBrand",
    "customModel",
    "storageGb",
    "ramGb",
    "colorName",
  ],
  pta: ["ptaStatus", "networkLock", "ptaRegType", "imei1", "imei2"],
  condition: ["condition", "batteryHealth", "screen", "body", "repairs", "functionalIssues"],
  extras: ["boxStatus", "accessories", "warrantyType", "warrantyMonths", "purchaseMonth"],
  photos: ["photos"],
  price: [
    "pricePkr",
    "isNegotiable",
    "citySlug",
    "areaSlug",
    "description",
    "contactChat",
    "contactWhatsapp",
    "contactCall",
  ],
} as const satisfies Record<string, readonly ListingField[]>;

export type WizardStep = keyof typeof STEP_FIELDS;
export const WIZARD_STEPS = Object.keys(STEP_FIELDS) as WizardStep[];

/** Earlier-screen values a screen's rules depend on (e.g. JV needs the brand). */
const STEP_CONTEXT: Record<WizardStep, readonly ListingField[]> = {
  phone: [],
  pta: ["brandSlug"],
  condition: ["brandSlug"],
  extras: [],
  photos: [],
  price: ["condition"],
};

type Draft = Partial<Record<ListingField, unknown>>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

/**
 * Cross-field rules, shared by the full schema and every step schema. Defensive about missing
 * values so a step can be checked on its own; only issues for `scope` fields are reported.
 */
function refineListing(
  v: Draft,
  ctx: z.RefinementCtx,
  scope: ReadonlySet<ListingField>,
  now: Date,
) {
  const issue = (path: ListingField, message: ListingErrorCode) => {
    if (scope.has(path)) ctx.addIssue({ code: "custom", path: [path], message });
  };
  const brandSlug = str(v.brandSlug);

  // Catalog: a known brand needs a model + storage; "Other" needs free-text names (§5).
  if (brandSlug === OTHER_BRAND) {
    if (!str(v.customBrand).trim()) issue("customBrand", "custom_brand_required");
    if (!str(v.customModel).trim()) issue("customModel", "custom_model_required");
  } else if (brandSlug) {
    if (!v.modelSlug) issue("modelSlug", "model_required");
    if (!v.storageGb) issue("storageGb", "storage_required");
  }

  // PTA hard rules (§6.3): JV only for non-approved iPhones.
  const ptaStatus = v.ptaStatus as ListingValues["ptaStatus"] | undefined;
  const networkLock = v.networkLock as ListingValues["networkLock"] | undefined;
  if (ptaStatus && networkLock) {
    for (const violation of validatePtaCombination({ brandSlug, ptaStatus, networkLock })) {
      issue("networkLock", violation);
    }
  }
  if (v.ptaRegType && ptaStatus && ptaStatus !== "pta_approved") {
    issue("ptaRegType", "reg_type_requires_approved");
  }

  // Second IMEI is optional but must be valid and different (§8).
  const imei2 = str(v.imei2);
  if (imei2.trim()) {
    if (!isValidImei(imei2)) issue("imei2", "imei_invalid");
    else if (normalizeImei(imei2) === normalizeImei(str(v.imei1))) issue("imei2", "imei_duplicate");
  }

  // Battery health is required for iPhones unless brand new / open box (§7.2).
  const condition = v.condition as ListingValues["condition"] | undefined;
  if ((v.batteryHealth === null || v.batteryHealth === undefined) && condition) {
    if (requiresBatteryHealth({ brandSlug, condition })) issue("batteryHealth", "battery_required");
  }

  // Warranty months only when there is a warranty.
  const months = typeof v.warrantyMonths === "number" ? v.warrantyMonths : null;
  if (
    v.warrantyType &&
    v.warrantyType !== "none" &&
    (months === null || months < 1 || months > MAX_WARRANTY_MONTHS)
  ) {
    issue("warrantyMonths", "warranty_months_required");
  }

  const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  if (typeof v.purchaseMonth === "string" && v.purchaseMonth > currentMonth) {
    issue("purchaseMonth", "purchase_month_future");
  }

  // Used / refurbished / parts phones must list their faults (§7.1).
  if (
    condition &&
    requiresDisclosure(condition) &&
    str(v.description).trim().length < MIN_DISCLOSURE
  ) {
    issue("description", "disclosure_required");
  }

  if (scope.has("contactChat") && !v.contactChat && !v.contactWhatsapp && !v.contactCall) {
    issue("contactChat", "contact_required");
  }
}

const ALL_FIELDS = new Set(Object.keys(baseShape) as ListingField[]);

/**
 * The full listing schema (publish, and server actions from Phase 6). `now` decides what
 * counts as a future purchase month, injected so tests and servers are deterministic.
 */
export function createListingSchema({ now = new Date() }: { now?: Date } = {}) {
  return z.object(baseShape).superRefine((v, ctx) => refineListing(v, ctx, ALL_FIELDS, now));
}

/** Schema for one wizard screen: its own fields plus the earlier values its rules need. */
export function createStepSchema(step: WizardStep, { now = new Date() }: { now?: Date } = {}) {
  const fields = STEP_FIELDS[step];
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) shape[f] = baseShape[f];
  for (const c of STEP_CONTEXT[step]) shape[c] = z.unknown();
  const scope = new Set<ListingField>(fields);
  return z.object(shape).superRefine((v, ctx) => refineListing(v as Draft, ctx, scope, now));
}

export type ListingInput = z.input<ReturnType<typeof createListingSchema>>;
export type ListingValues = z.output<ReturnType<typeof createListingSchema>>;

/** Starting values for a new draft (nothing chosen yet). */
export function emptyListingDraft(): Partial<ListingInput> {
  return {
    brandSlug: "",
    modelSlug: null,
    customBrand: "",
    customModel: "",
    storageGb: null,
    ramGb: null,
    colorName: null,
    ptaRegType: null,
    imei1: "",
    imei2: "",
    batteryHealth: null,
    repairs: [],
    functionalIssues: [],
    accessories: [],
    warrantyType: "none",
    warrantyMonths: null,
    purchaseMonth: null,
    photos: [],
    isNegotiable: true,
    areaSlug: null,
    description: "",
    contactChat: true,
    contactWhatsapp: true,
    contactCall: false,
  };
}
