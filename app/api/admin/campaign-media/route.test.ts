// @vitest-environment node
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
const state = vi.hoisted(() => ({
  admin: true,
  user: true,
  recordError: false,
  upload: vi.fn(),
  remove: vi.fn(),
  insert: vi.fn(),
  encode: vi.fn(),
}));
vi.mock("@/lib/security/campaign-image", () => ({
  MAX_CAMPAIGN_IMAGE_BYTES: 4194304,
  encodeCampaignImage: state.encode,
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: "50000000-0000-0000-0000-000000000001" } : null },
        error: null,
      }),
    },
    rpc: async () => ({ data: state.admin, error: null }),
    storage: { from: () => ({ upload: state.upload, remove: state.remove }) },
    from: () => ({ insert: state.insert }),
  }),
}));
import { POST } from "./route";
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");
  state.admin = true;
  state.user = true;
  state.recordError = false;
  state.upload.mockReset().mockResolvedValue({ error: null });
  state.remove.mockReset().mockResolvedValue({ error: null });
  state.insert.mockReset().mockResolvedValue({ error: null });
  state.encode
    .mockReset()
    .mockResolvedValue({ bytes: Buffer.from("re-encoded"), width: 400, height: 200 });
});
afterEach(() => vi.unstubAllEnvs());
function request(origin = "http://localhost") {
  const body = new FormData();
  body.set("file", new File(["image"], "file.png", { type: "image/png" }));
  return new NextRequest("http://localhost/api/admin/campaign-media", {
    method: "POST",
    body,
    headers: { origin },
  });
}
it("rejects cross-origin, unauthenticated and non-admin uploads before image processing", async () => {
  expect((await POST(request("https://other.example"))).status).toBe(403);
  state.user = false;
  expect((await POST(request())).status).toBe(403);
  state.user = true;
  state.admin = false;
  expect((await POST(request())).status).toBe(403);
  expect(state.encode).not.toHaveBeenCalled();
  expect(state.upload).not.toHaveBeenCalled();
});
it("stores re-encoded media and compensates if the audit record fails", async () => {
  const result = await POST(request());
  expect(result.status).toBe(200);
  expect((await result.json()).url).toMatch(
    /^\/api\/campaign-media\/50000000-0000-0000-0000-000000000001\/[0-9a-f-]+\.webp$/,
  );
  expect(state.upload).toHaveBeenCalledWith(
    expect.any(String),
    Buffer.from("re-encoded"),
    expect.objectContaining({ contentType: "image/webp", upsert: false }),
  );
  state.insert.mockResolvedValue({ error: { message: "failed" } });
  expect((await POST(request())).status).toBe(500);
  expect(state.remove).toHaveBeenCalled();
});
