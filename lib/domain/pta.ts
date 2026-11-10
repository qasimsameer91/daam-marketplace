/**
 * PTA & network status model (plan §6). Pure functions: no React, no I/O.
 *
 * A phone's PTA situation is TWO separate facts:
 *   - pta_status:   is the IMEI registered with PTA?
 *   - network_lock: is the phone locked to a (foreign) carrier?
 * Never treat CPID, JV or "server approved" as PTA approval.
 */

export const PTA_STATUSES = ["pta_approved", "non_pta", "cpid_patched", "unknown"] as const;
export type PtaStatus = (typeof PTA_STATUSES)[number];

export const NETWORK_LOCKS = ["factory_unlocked", "carrier_locked", "jv", "unknown"] as const;
export type NetworkLock = (typeof NETWORK_LOCKS)[number];

export const PTA_REG_TYPES = ["official_import", "individual_tax_paid", "unknown"] as const;
export type PtaRegType = (typeof PTA_REG_TYPES)[number];

export const PTA_CHECK_SOURCES = ["seller_declared", "daam_checked"] as const;
export type PtaCheckSource = (typeof PTA_CHECK_SOURCES)[number];

/** Visual tone. Maps to design tokens in the UI layer; status is never shown by colour alone. */
export type Tone = "success" | "warning" | "danger" | "neutral";

/** Icon keys resolved to Lucide icons in the UI layer. */
export type StatusIcon =
  | "shield-check"
  | "shield-alert"
  | "shield-x"
  | "shield-question"
  | "unlock"
  | "lock"
  | "sim-alert"
  | "help";

export interface StatusMeta {
  tone: Tone;
  icon: StatusIcon;
}

export const PTA_STATUS_META: Record<PtaStatus, StatusMeta> = {
  pta_approved: { tone: "success", icon: "shield-check" },
  non_pta: { tone: "warning", icon: "shield-alert" },
  cpid_patched: { tone: "danger", icon: "shield-x" },
  unknown: { tone: "neutral", icon: "shield-question" },
};

export const NETWORK_LOCK_META: Record<NetworkLock, StatusMeta> = {
  factory_unlocked: { tone: "success", icon: "unlock" },
  carrier_locked: { tone: "warning", icon: "lock" },
  jv: { tone: "danger", icon: "sim-alert" },
  unknown: { tone: "neutral", icon: "help" },
};

const TONE_RANK: Record<Tone, number> = { success: 0, neutral: 1, warning: 2, danger: 3 };

/** The more serious of two tones (danger > warning > neutral > success). */
export function worstTone(a: Tone, b: Tone): Tone {
  return TONE_RANK[a] >= TONE_RANK[b] ? a : b;
}

const APPLE_BRAND_SLUG = "apple";

/** Hard rule §6.3.1: `jv` ⇒ brand is Apple AND pta_status ≠ pta_approved. */
export function isJvAllowed(brandSlug: string | null | undefined, ptaStatus: PtaStatus): boolean {
  return brandSlug === APPLE_BRAND_SLUG && ptaStatus !== "pta_approved";
}

/** Network-lock options a seller may pick for this brand + PTA status (JV only for non-approved iPhones). */
export function allowedNetworkLocks(
  brandSlug: string | null | undefined,
  ptaStatus: PtaStatus,
): NetworkLock[] {
  return NETWORK_LOCKS.filter((lock) => lock !== "jv" || isJvAllowed(brandSlug, ptaStatus));
}

export type PtaRuleViolation = "jv_requires_apple" | "jv_cannot_be_pta_approved";

/** Validate a PTA/network combination. Returns every rule broken (empty = valid). */
export function validatePtaCombination(input: {
  brandSlug: string | null | undefined;
  ptaStatus: PtaStatus;
  networkLock: NetworkLock;
}): PtaRuleViolation[] {
  const violations: PtaRuleViolation[] = [];
  if (input.networkLock === "jv") {
    if (input.brandSlug !== APPLE_BRAND_SLUG) violations.push("jv_requires_apple");
    if (input.ptaStatus === "pta_approved") violations.push("jv_cannot_be_pta_approved");
  }
  return violations;
}

/** Hard rule §6.3.2: CPID listings can never be featured or promoted. */
export function canBePromoted(ptaStatus: PtaStatus): boolean {
  return ptaStatus !== "cpid_patched";
}

/** "Best deals" excludes CPID and unknown PTA status (§9). */
export function isEligibleForBestDeals(ptaStatus: PtaStatus): boolean {
  return ptaStatus !== "cpid_patched" && ptaStatus !== "unknown";
}

/** CPID kill switch (§6.3.2): hidden entirely when app_settings.allow_cpid_listings = false. */
export function isVisibleUnderSettings(ptaStatus: PtaStatus, allowCpidListings: boolean): boolean {
  return ptaStatus !== "cpid_patched" || allowCpidListings;
}

/** CPID listings always show the red warning banner. */
export function requiresCpidBanner(ptaStatus: PtaStatus): boolean {
  return ptaStatus === "cpid_patched";
}

/** Daam Meter comparable group (§10): approved vs everything else. */
export function ptaGroup(ptaStatus: PtaStatus): "approved" | "not_approved" {
  return ptaStatus === "pta_approved" ? "approved" : "not_approved";
}

export interface CombinedPtaBadge {
  status: PtaStatus;
  /** Omitted when the lock is unknown, so the badge reads e.g. "Non-PTA" rather than "Non-PTA · ?". */
  lock: NetworkLock | null;
  tone: Tone;
  icon: StatusIcon;
}

/** Combined badge §6.3.3, e.g. `Non-PTA · JV`, `PTA Approved · FU`. Tone is the more serious of the two. */
export function combinedPtaBadge(ptaStatus: PtaStatus, networkLock: NetworkLock): CombinedPtaBadge {
  const statusMeta = PTA_STATUS_META[ptaStatus];
  const lock = networkLock === "unknown" ? null : networkLock;
  const tone = lock ? worstTone(statusMeta.tone, NETWORK_LOCK_META[lock].tone) : statusMeta.tone;
  return { status: ptaStatus, lock, tone, icon: statusMeta.icon };
}

/** A moderator PTA check is valid for 30 days (§6.3.4). */
export const PTA_CHECK_VALIDITY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type PtaCheckLabel = { kind: "daam_checked"; checkedAt: Date } | { kind: "seller_says" };

/**
 * What to label the PTA status with (§6.3.4–5). "Checked by Daam" ONLY when a moderator checked it on
 * PTA DVS within the last 30 days; otherwise it is always "Seller says". Never "IMEI verified".
 */
export function ptaCheckLabel(input: {
  source: PtaCheckSource;
  checkedAt: Date | string | null | undefined;
  now: Date;
}): PtaCheckLabel {
  if (input.source !== "daam_checked" || !input.checkedAt) return { kind: "seller_says" };
  const checkedAt = input.checkedAt instanceof Date ? input.checkedAt : new Date(input.checkedAt);
  if (Number.isNaN(checkedAt.getTime())) return { kind: "seller_says" };
  const age = input.now.getTime() - checkedAt.getTime();
  if (age < 0 || age > PTA_CHECK_VALIDITY_DAYS * DAY_MS) return { kind: "seller_says" };
  return { kind: "daam_checked", checkedAt };
}
