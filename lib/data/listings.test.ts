// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

import { getPublicListings } from "./listings";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("requests only public listing fields and caps the page size", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-public-key");
  let requested: URL | undefined;
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    requested = new URL(new Request(input, init).url);
    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  });
  await expect(getPublicListings(1000)).resolves.toEqual([]);
  expect(requested?.searchParams.get("limit")).toBe("100");
  expect(requested?.searchParams.get("status")).toBe("in.(active,sold)");
  expect(requested?.searchParams.get("select")).not.toMatch(/phone|imei|moderation|hold_reasons/);
});
