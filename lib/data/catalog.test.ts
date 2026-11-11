// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

import { getCatalog } from "./catalog";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("public catalog", () => {
  it("keeps the sample mode only when Supabase is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    await expect(getCatalog()).resolves.toBeNull();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
    await expect(getCatalog()).rejects.toThrow("configuration is incomplete");
  });

  it("loads all alias pages and associates models with their real brands", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-public-key");
    const aliases = Array.from({ length: 1001 }, (_, i) => ({ model_id: 11, alias: `alias-${i}` }));
    const calls: string[] = [];
    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = new Request(input, init);
      const url = new URL(request.url);
      calls.push(`${url.pathname}:${url.searchParams.get("offset")}`);
      const start = Number(url.searchParams.get("offset") ?? "0");
      const rows = url.pathname.endsWith("/brands")
        ? [{ id: 1, slug: "apple", name: "Apple" }]
        : url.pathname.endsWith("/models")
          ? [{ id: 11, brand_id: 1, slug: "iphone-x", name: "iPhone X" }]
          : url.pathname.endsWith("/cities")
            ? [{ id: 5, slug: "lahore", name_en: "Lahore", name_ur: "لاہور" }]
            : url.pathname.endsWith("/areas")
              ? [{ city_id: 5, slug: "dha", name_en: "DHA", name_ur: null }]
              : aliases.slice(start, start + 1000);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    const catalog = await getCatalog();
    expect(catalog?.models[0]).toMatchObject({
      slug: "iphone-x",
      brand: "apple",
      name: "iPhone X",
    });
    expect(catalog?.models[0]?.aliases).toHaveLength(1001);
    expect(catalog?.areas[0]).toMatchObject({ citySlug: "lahore", slug: "dha", nameUr: "DHA" });
    expect(calls.filter((call) => call.includes("model_aliases"))).toHaveLength(2);
  });

  it("reports a configured database failure instead of returning sample data", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-public-key");
    vi.stubGlobal("fetch", async () => new Response("{}", { status: 400 }));
    await expect(getCatalog()).rejects.toThrow("Catalog could not be loaded");
  });
});
