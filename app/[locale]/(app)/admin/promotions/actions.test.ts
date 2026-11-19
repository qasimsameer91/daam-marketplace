// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ user: true, admin: true, mutate: vi.fn(), result: true }));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: "test-user" } : null },
        error: null,
      }),
    },
    rpc: async () => ({ data: state.admin, error: null }),
    from: () => ({
      insert: (value: unknown) => {
        state.mutate(value);
        return {
          select: () => ({
            maybeSingle: async () => ({ data: state.result ? { id: "saved" } : null, error: null }),
          }),
        };
      },
      update: (value: unknown) => {
        state.mutate(value);
        return {
          eq: () => ({
            select: () => ({
              maybeSingle: async () => ({
                data: state.result ? { id: "saved" } : null,
                error: null,
              }),
            }),
          }),
        };
      },
      delete: () => ({
        eq: () => ({
          select: () => ({
            maybeSingle: async () => ({ data: state.result ? { id: "saved" } : null, error: null }),
          }),
        }),
      }),
    }),
  }),
}));
import { deleteCampaign, saveCampaign } from "./actions";

const valid = {
  title_en: "Campaign",
  title_ur: "مہم",
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

beforeEach(() => {
  state.user = true;
  state.admin = true;
  state.result = true;
  state.mutate.mockClear();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key");
});
afterEach(() => vi.unstubAllEnvs());

describe("campaign server actions", () => {
  it("rejects invalid input and non-admin sessions before any mutation", async () => {
    expect(await saveCampaign({ ...valid, cta_url: "javascript:alert(1)" })).toEqual({
      ok: false,
      reason: "invalid",
    });
    state.admin = false;
    expect(await saveCampaign(valid)).toEqual({ ok: false, reason: "forbidden" });
    state.admin = true;
    state.user = false;
    expect(await saveCampaign(valid)).toEqual({ ok: false, reason: "forbidden" });
    expect(state.mutate).not.toHaveBeenCalled();
  });
  it("saves validated fields only when the database confirms a row", async () => {
    expect(await saveCampaign(valid)).toEqual({ ok: true, id: "saved" });
    expect(state.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ desktop_image_url: null, mobile_image_url: null }),
    );
    state.result = false;
    expect(await saveCampaign(valid)).toEqual({ ok: false, reason: "failed" });
    expect(await deleteCampaign("not-a-uuid")).toEqual({ ok: false, reason: "invalid" });
  });
});
