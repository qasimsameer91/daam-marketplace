import { describe, expect, it } from "vitest";
import { campaignSchema, isSafeCampaignUrl } from "./campaign";

describe("campaign validation", () => {
  it("accepts internal and HTTPS destinations and rejects unsafe links", () => {
    for (const value of ["/phones?pta=pta_approved", "https://example.com/offers"])
      expect(isSafeCampaignUrl(value)).toBe(true);
    for (const value of [
      "//example.com",
      "javascript:alert(1)",
      "https://example.com/a b",
      "/\\evil",
      "http://example.com",
    ])
      expect(isSafeCampaignUrl(value)).toBe(false);
  });

  it("rejects invalid schedules and fields outside the admin form", () => {
    const valid = {
      title_en: "Discover phones",
      title_ur: "فون دیکھیں",
      subtitle_en: "",
      subtitle_ur: "",
      description_en: "",
      description_ur: "",
      desktop_image_url: "",
      mobile_image_url: "",
      cta_en: "Browse",
      cta_ur: "دیکھیں",
      cta_url: "/phones",
      theme: "dark",
      placement: "below_hero",
      starts_at: "2026-11-11T00:00:00Z",
      ends_at: "2026-11-12T00:00:00Z",
      priority: 0,
      status: "draft",
      is_active: false,
    };
    expect(campaignSchema.safeParse(valid).success).toBe(true);
    expect(campaignSchema.safeParse({ ...valid, ends_at: valid.starts_at }).success).toBe(false);
    expect(campaignSchema.safeParse({ ...valid, approved_at: "2026-11-11" }).success).toBe(false);
  });
});
