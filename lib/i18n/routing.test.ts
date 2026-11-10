import { describe, expect, it } from "vitest";
import { getDirection, isAppLocale, routing } from "./routing";

describe("i18n routing", () => {
  it("defaults to English", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("renders Urdu right-to-left and English left-to-right", () => {
    expect(getDirection("ur")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("recognises only supported locales", () => {
    expect(isAppLocale("en")).toBe(true);
    expect(isAppLocale("ur")).toBe(true);
    expect(isAppLocale("fr")).toBe(false);
    expect(isAppLocale(undefined)).toBe(false);
  });
});
