/** Condition grades & specification enums (plan §7). Pure functions: no React, no I/O. */

export const PHONE_CONDITIONS = [
  "brand_new",
  "open_box",
  "like_new",
  "grade_9",
  "grade_8",
  "grade_7",
  "used",
  "refurbished",
  "for_parts",
] as const;
export type PhoneCondition = (typeof PHONE_CONDITIONS)[number];

export const SCREEN_CONDITIONS = [
  "flawless",
  "minor_scratches",
  "visible_scratches",
  "cracked",
  "replaced",
] as const;
export type ScreenCondition = (typeof SCREEN_CONDITIONS)[number];

export const BODY_CONDITIONS = [
  "flawless",
  "minor_marks",
  "visible_marks",
  "dents_or_cracks",
] as const;
export type BodyCondition = (typeof BODY_CONDITIONS)[number];

export const BOX_STATUSES = ["box_matching_imei", "box_not_matching", "no_box"] as const;
export type BoxStatus = (typeof BOX_STATUSES)[number];

export const WARRANTY_TYPES = ["none", "official_brand", "shop", "other"] as const;
export type WarrantyType = (typeof WARRANTY_TYPES)[number];

export const ACCESSORIES = ["charger", "cable", "case", "earphones", "original_receipt"] as const;
export type Accessory = (typeof ACCESSORIES)[number];

export const REPAIRS = [
  "none",
  "screen",
  "battery",
  "back_glass",
  "camera",
  "charging_port",
  "motherboard",
  "other",
] as const;
export type Repair = (typeof REPAIRS)[number];

export const FUNCTIONAL_ISSUES = [
  "none",
  "biometrics",
  "true_tone",
  "speaker",
  "mic",
  "camera",
  "network",
] as const;
export type FunctionalIssue = (typeof FUNCTIONAL_ISSUES)[number];

/** Daam Meter condition band (§10). `for_parts` is never compared. */
export type ConditionBand = "new" | "excellent" | "good" | "fair";

const BAND: Record<PhoneCondition, ConditionBand | null> = {
  brand_new: "new",
  open_box: "new",
  like_new: "excellent",
  grade_9: "excellent",
  grade_8: "good",
  grade_7: "good",
  used: "fair",
  refurbished: "fair",
  for_parts: null,
};

export function conditionBand(condition: PhoneCondition): ConditionBand | null {
  return BAND[condition];
}

/** Numeric grade shown in mono on chips ("9/10"); null for non-numeric conditions. */
const SCORE: Partial<Record<PhoneCondition, string>> = {
  like_new: "10/10",
  grade_9: "9/10",
  grade_8: "8/10",
  grade_7: "7/10",
  used: "≤6/10",
};

export function conditionScore(condition: PhoneCondition): string | null {
  return SCORE[condition] ?? null;
}

/** Best → worst, for sorting and filter lists. */
export function conditionRank(condition: PhoneCondition): number {
  return PHONE_CONDITIONS.indexOf(condition);
}

/** Conditions that must list their issues/replaced parts in the description (§7.1). */
export function requiresDisclosure(condition: PhoneCondition): boolean {
  return condition === "used" || condition === "refurbished" || condition === "for_parts";
}

/**
 * Battery health is required for iPhones unless brand new / open box (§7.2).
 * Pass the brand slug; non-Apple phones may still provide it optionally.
 */
export function requiresBatteryHealth(input: {
  brandSlug: string | null | undefined;
  condition: PhoneCondition;
}): boolean {
  return (
    input.brandSlug === "apple" && input.condition !== "brand_new" && input.condition !== "open_box"
  );
}

export function isValidBatteryHealth(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

/** Battery filter thresholds (§9). */
export const BATTERY_THRESHOLDS = [80, 85, 90, 95] as const;

/** Tone for the battery pill: ≥85 good, 80–84 okay, <80 worn. */
export function batteryTone(health: number): "success" | "neutral" | "warning" {
  if (health >= 85) return "success";
  if (health >= 80) return "neutral";
  return "warning";
}
