import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ur from "@/messages/ur.json";
import { WCAG_AA_LARGE_OR_UI, WCAG_AA_TEXT, contrastRatio, hexToRgb, mixOklab } from "./contrast";
import { brandColors } from "./tokens";

const c = (name: keyof typeof brandColors) => hexToRgb(brandColors[name]);
const white = hexToRgb("#ffffff");

// Semantic tokens, computed exactly as app/globals.css defines them.
const light = {
  background: c("paper"),
  surface: mixOklab(c("paper"), 0.35, white),
  foreground: c("ink"),
  muted: c("mist"),
  mutedForeground: c("slate"),
  destructiveText: c("dangerInk"),
};
const dark = {
  background: c("night"),
  surface: c("nightSurface"),
  popover: c("graphite"),
  foreground: c("nightText"),
  mutedForeground: mixOklab(c("slate"), 0.45, c("nightText")),
  destructiveText: mixOklab(c("danger"), 0.75, c("nightText")),
};

describe("tokens.ts mirrors globals.css", () => {
  it("has the same hex for every palette colour", () => {
    const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");
    const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    for (const [name, hex] of Object.entries(brandColors)) {
      expect(css, `--color-${kebab(name)}`).toContain(`--color-${kebab(name)}: ${hex};`);
    }
  });
});

describe("WCAG AA contrast (text ≥ 4.5:1)", () => {
  const pairs: [string, readonly [number, number, number], readonly [number, number, number]][] = [
    // light mode
    ["ink on paper", light.foreground, light.background],
    ["ink on surface", light.foreground, light.surface],
    ["slate (muted text) on paper", light.mutedForeground, light.background],
    ["slate (muted text) on surface", light.mutedForeground, light.surface],
    ["ink on mist (neutral chip)", light.foreground, light.muted],
    ["paper on ink (secondary button)", c("paper"), c("ink")],
    ["destructive text on paper", light.destructiveText, light.background],
    // brand + status chips (same in both modes)
    ["ink on lime (primary, Great daam)", c("ink"), c("lime")],
    ["ink on success (PTA Approved)", c("ink"), c("success")],
    ["ink on warning (Non-PTA)", c("ink"), c("warning")],
    ["ink on danger (CPID / JV)", c("ink"), c("danger")],
    ["ink on info", c("ink"), c("info")],
    ["paper on slate (Above market)", c("paper"), c("slate")],
    // dark mode
    ["text on night", dark.foreground, dark.background],
    ["text on night surface", dark.foreground, dark.surface],
    ["text on graphite (popover / chips)", dark.foreground, dark.popover],
    ["muted text on night", dark.mutedForeground, dark.background],
    ["muted text on night surface", dark.mutedForeground, dark.surface],
    ["muted text on graphite", dark.mutedForeground, dark.popover],
    ["ink on night text (secondary button)", c("ink"), c("nightText")],
    ["destructive text on night", dark.destructiveText, dark.background],
  ];

  for (const [label, fg, bg] of pairs) {
    it(label, () => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
    });
  }

  it("keeps the focus ring visible (≥ 3:1 UI contrast)", () => {
    expect(contrastRatio(c("ink"), light.background)).toBeGreaterThanOrEqual(WCAG_AA_LARGE_OR_UI);
    expect(contrastRatio(c("lime"), dark.background)).toBeGreaterThanOrEqual(WCAG_AA_LARGE_OR_UI);
  });

  it("confirms why raw status colours are never used as text on paper", () => {
    expect(contrastRatio(c("success"), light.background)).toBeLessThan(WCAG_AA_TEXT);
    expect(contrastRatio(c("lime"), light.background)).toBeLessThan(WCAG_AA_LARGE_OR_UI);
  });
});

describe("messages", () => {
  const keys = (obj: object, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([k, v]) =>
      typeof v === "object" && v !== null ? keys(v as object, `${prefix}${k}.`) : [`${prefix}${k}`],
    );

  it("has the same keys in English and Urdu", () => {
    expect(keys(ur).sort()).toEqual(keys(en).sort());
  });
});
