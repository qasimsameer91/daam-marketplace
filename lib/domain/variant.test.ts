import { describe, expect, it } from "vitest";
import { storageLabel, variantLabel } from "./variant";

describe("variant labels", () => {
  it("formats storage in GB or TB", () => {
    expect(storageLabel(128)).toBe("128GB");
    expect(storageLabel(1024)).toBe("1TB");
    expect(storageLabel(2048)).toBe("2TB");
  });

  it("adds RAM only when known", () => {
    expect(variantLabel(null, 256)).toBe("256GB");
    expect(variantLabel(8, 256)).toBe("8/256GB");
    expect(variantLabel(16, 1024)).toBe("16/1TB");
  });
});
