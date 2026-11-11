import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ur from "@/messages/ur.json";

/** The global error boundary inlines a few strings to avoid bundling the full catalogs. */
describe("global-error copy stays in sync with the message catalogs", () => {
  const src = readFileSync(join(process.cwd(), "app", "global-error.tsx"), "utf8");
  const expected = {
    en: [en.Empty.error.title, en.Empty.error.body, en.Common.retry],
    ur: [ur.Empty.error.title, ur.Empty.error.body, ur.Common.retry],
  };

  it("contains each error/retry string for both locales", () => {
    for (const strings of Object.values(expected)) {
      for (const s of strings) expect(src).toContain(s);
    }
  });

  it("does not import the message catalogs", () => {
    expect(src).not.toMatch(/from "@\/messages\//);
  });
});
