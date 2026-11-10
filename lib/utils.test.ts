import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("lets later Tailwind utilities win conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("keeps logical (RTL-safe) utilities distinct", () => {
    expect(cn("ps-2", "pe-4")).toBe("ps-2 pe-4");
  });
});
