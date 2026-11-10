import { describe, expect, it } from "vitest";
import {
  formatPakistaniMobile,
  isE164PakistaniMobile,
  isValidPakistaniMobile,
  normalizePakistaniMobile,
  whatsappLink,
} from "./phone";

describe("normalizePakistaniMobile", () => {
  it("accepts 03XXXXXXXXX and +923XXXXXXXXX and returns E.164", () => {
    expect(normalizePakistaniMobile("03001234567")).toBe("+923001234567");
    expect(normalizePakistaniMobile("+923001234567")).toBe("+923001234567");
  });

  it("ignores spaces, dashes and brackets", () => {
    expect(normalizePakistaniMobile(" 0300-1234567 ")).toBe("+923001234567");
    expect(normalizePakistaniMobile("+92 300 1234567")).toBe("+923001234567");
    expect(normalizePakistaniMobile("(0321) 765 4321")).toBe("+923217654321");
  });

  it("rejects landlines, wrong lengths and foreign numbers", () => {
    expect(normalizePakistaniMobile("0421234567")).toBeNull(); // Lahore landline
    expect(normalizePakistaniMobile("0300123456")).toBeNull(); // too short
    expect(normalizePakistaniMobile("030012345678")).toBeNull(); // too long
    expect(normalizePakistaniMobile("+447911123456")).toBeNull();
    expect(normalizePakistaniMobile("923001234567")).toBeNull(); // missing + or 0 (plan format)
    expect(normalizePakistaniMobile("")).toBeNull();
    expect(normalizePakistaniMobile("03oo1234567")).toBeNull();
  });

  it("validates", () => {
    expect(isValidPakistaniMobile("03451234567")).toBe(true);
    expect(isValidPakistaniMobile("12345")).toBe(false);
    expect(isE164PakistaniMobile("+923001234567")).toBe(true);
    expect(isE164PakistaniMobile("03001234567")).toBe(false);
  });
});

describe("display & WhatsApp", () => {
  it("formats for local display", () => {
    expect(formatPakistaniMobile("+923001234567")).toBe("0300 1234567");
    expect(() => formatPakistaniMobile("03001234567")).toThrow(RangeError);
  });

  it("builds a wa.me link with an encoded message", () => {
    expect(whatsappLink("+923001234567")).toBe("https://wa.me/923001234567");
    expect(whatsappLink("+923001234567", "Assalam o Alaikum, I saw your iPhone 13 on Daam")).toBe(
      "https://wa.me/923001234567?text=Assalam%20o%20Alaikum%2C%20I%20saw%20your%20iPhone%2013%20on%20Daam",
    );
    expect(() => whatsappLink("+447911123456")).toThrow(RangeError);
  });
});
