import { describe, expect, it } from "vitest";
import {
  NETWORK_LOCKS,
  PTA_STATUSES,
  allowedNetworkLocks,
  canBePromoted,
  combinedPtaBadge,
  isEligibleForBestDeals,
  isJvAllowed,
  isVisibleUnderSettings,
  ptaCheckLabel,
  ptaGroup,
  requiresCpidBanner,
  validatePtaCombination,
  worstTone,
} from "./pta";

describe("JV rule (§6.3.1)", () => {
  it("allows JV only for non-approved iPhones", () => {
    expect(isJvAllowed("apple", "non_pta")).toBe(true);
    expect(isJvAllowed("apple", "unknown")).toBe(true);
    expect(isJvAllowed("apple", "cpid_patched")).toBe(true);
    expect(isJvAllowed("apple", "pta_approved")).toBe(false);
    expect(isJvAllowed("samsung", "non_pta")).toBe(false);
    expect(isJvAllowed(null, "non_pta")).toBe(false);
  });

  it("offers the JV option only when allowed", () => {
    expect(allowedNetworkLocks("apple", "non_pta")).toEqual([...NETWORK_LOCKS]);
    expect(allowedNetworkLocks("apple", "pta_approved")).not.toContain("jv");
    expect(allowedNetworkLocks("google", "non_pta")).not.toContain("jv");
  });

  it("reports every violated rule", () => {
    expect(
      validatePtaCombination({ brandSlug: "apple", ptaStatus: "non_pta", networkLock: "jv" }),
    ).toEqual([]);
    expect(
      validatePtaCombination({ brandSlug: "apple", ptaStatus: "pta_approved", networkLock: "jv" }),
    ).toEqual(["jv_cannot_be_pta_approved"]);
    expect(
      validatePtaCombination({
        brandSlug: "samsung",
        ptaStatus: "pta_approved",
        networkLock: "jv",
      }),
    ).toEqual(["jv_requires_apple", "jv_cannot_be_pta_approved"]);
    expect(
      validatePtaCombination({
        brandSlug: "samsung",
        ptaStatus: "pta_approved",
        networkLock: "factory_unlocked",
      }),
    ).toEqual([]);
  });

  it("never lets JV + PTA Approved pass for any brand", () => {
    for (const brand of ["apple", "samsung", "google", null]) {
      expect(
        validatePtaCombination({ brandSlug: brand, ptaStatus: "pta_approved", networkLock: "jv" }),
      ).not.toEqual([]);
    }
  });
});

describe("CPID rules (§6.3.2)", () => {
  it("never promotes CPID, keeps it out of Best Deals and shows the banner", () => {
    expect(canBePromoted("cpid_patched")).toBe(false);
    expect(isEligibleForBestDeals("cpid_patched")).toBe(false);
    expect(requiresCpidBanner("cpid_patched")).toBe(true);
    for (const s of PTA_STATUSES.filter((x) => x !== "cpid_patched")) {
      expect(canBePromoted(s)).toBe(true);
      expect(requiresCpidBanner(s)).toBe(false);
    }
  });

  it("excludes unknown PTA from Best Deals", () => {
    expect(isEligibleForBestDeals("unknown")).toBe(false);
    expect(isEligibleForBestDeals("pta_approved")).toBe(true);
    expect(isEligibleForBestDeals("non_pta")).toBe(true);
  });

  it("hides CPID listings when the kill switch is off", () => {
    expect(isVisibleUnderSettings("cpid_patched", false)).toBe(false);
    expect(isVisibleUnderSettings("cpid_patched", true)).toBe(true);
    expect(isVisibleUnderSettings("non_pta", false)).toBe(true);
  });
});

describe("combined badge (§6.3.3)", () => {
  it("combines both fields and uses the more serious tone", () => {
    expect(combinedPtaBadge("pta_approved", "factory_unlocked")).toMatchObject({
      lock: "factory_unlocked",
      tone: "success",
    });
    expect(combinedPtaBadge("non_pta", "jv")).toMatchObject({ lock: "jv", tone: "danger" });
    expect(combinedPtaBadge("pta_approved", "carrier_locked")).toMatchObject({ tone: "warning" });
  });

  it("drops an unknown lock from the badge", () => {
    expect(combinedPtaBadge("non_pta", "unknown")).toMatchObject({ lock: null, tone: "warning" });
  });

  it("ranks tones danger > warning > neutral > success", () => {
    expect(worstTone("success", "danger")).toBe("danger");
    expect(worstTone("warning", "neutral")).toBe("warning");
    expect(worstTone("neutral", "success")).toBe("neutral");
  });
});

describe("PTA check label (§6.3.4–5)", () => {
  const now = new Date("2026-11-10T12:00:00Z");

  it("says 'Seller says' unless Daam checked it", () => {
    expect(ptaCheckLabel({ source: "seller_declared", checkedAt: now, now })).toEqual({
      kind: "seller_says",
    });
    expect(ptaCheckLabel({ source: "daam_checked", checkedAt: null, now })).toEqual({
      kind: "seller_says",
    });
  });

  it("shows 'Checked by Daam' for 30 days, then falls back", () => {
    const fresh = new Date("2026-10-20T12:00:00Z");
    expect(ptaCheckLabel({ source: "daam_checked", checkedAt: fresh, now })).toEqual({
      kind: "daam_checked",
      checkedAt: fresh,
    });
    expect(
      ptaCheckLabel({ source: "daam_checked", checkedAt: "2026-10-11T12:00:00Z", now }).kind,
    ).toBe("daam_checked");
    expect(
      ptaCheckLabel({ source: "daam_checked", checkedAt: "2026-10-09T12:00:00Z", now }).kind,
    ).toBe("seller_says");
  });

  it("rejects future or invalid check dates", () => {
    expect(
      ptaCheckLabel({ source: "daam_checked", checkedAt: "2026-12-01T00:00:00Z", now }).kind,
    ).toBe("seller_says");
    expect(ptaCheckLabel({ source: "daam_checked", checkedAt: "not a date", now }).kind).toBe(
      "seller_says",
    );
  });
});

describe("PTA group (§10)", () => {
  it("groups only PTA Approved as approved", () => {
    expect(ptaGroup("pta_approved")).toBe("approved");
    expect(ptaGroup("cpid_patched")).toBe("not_approved");
    expect(ptaGroup("non_pta")).toBe("not_approved");
    expect(ptaGroup("unknown")).toBe("not_approved");
  });
});
