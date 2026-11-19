import { describe, it, expect } from "vitest";
import { toPakistanInput, fromPakistanInput, campaignDisplayState } from "./campaign-schedule";

describe("Pakistan campaign schedule", () => {
  it("converts dates across UTC midnight without using the host timezone", () => {
    expect(toPakistanInput("2026-11-10T22:30:00Z")).toBe("2026-11-11T03:30");
    expect(fromPakistanInput("2026-11-11T03:30")).toBe("2026-11-10T22:30:00.000Z");
    for (const invalid of ["2026-02-30T12:00", "2026-11-11T24:30", "bad"])
      expect(fromPakistanInput(invalid)).toBeNull();
  });
  it("handles publication windows at their exact boundaries", () => {
    const campaign = {
      status: "published",
      is_active: true,
      starts_at: "2026-11-11T00:00:00Z",
      ends_at: "2026-11-12T00:00:00Z",
    };
    expect(campaignDisplayState(campaign, Date.parse(campaign.starts_at))).toBe("live");
    expect(campaignDisplayState(campaign, Date.parse(campaign.ends_at))).toBe("expired");
    expect(campaignDisplayState(campaign, 0)).toBe("scheduled");
    expect(campaignDisplayState({ ...campaign, is_active: false }, 0)).toBe("paused");
    expect(campaignDisplayState({ ...campaign, status: "archived" }, 0)).toBe("archived");
  });
});
