import { describe, expect, it } from "vitest";
import type { Variants } from "motion/react";
import { MAX_STAGGERED_ITEMS, STAGGER_SECONDS, getVariants, staggerDelay } from "./motion";

/** Every animated property in a variant set (excluding the nested transition config). */
function animatedProps(variants: Variants): Set<string> {
  const props = new Set<string>();
  for (const value of Object.values(variants)) {
    if (typeof value !== "object" || value === null) continue;
    for (const key of Object.keys(value)) if (key !== "transition") props.add(key);
  }
  return props;
}

const TRANSFORM_AND_OPACITY = new Set(["opacity", "x", "y", "scale", "rotate"]);

describe("motion variants", () => {
  it("animate only transform and opacity", () => {
    for (const [name, variants] of Object.entries(getVariants(false))) {
      for (const prop of animatedProps(variants)) {
        expect(TRANSFORM_AND_OPACITY.has(prop), `${name} animates ${prop}`).toBe(true);
      }
    }
  });

  it("degrade to opacity-only under reduced motion", () => {
    for (const [name, variants] of Object.entries(getVariants(true))) {
      for (const prop of animatedProps(variants)) {
        expect(prop, `${name} should be opacity-only`).toBe("opacity");
      }
    }
  });

  it("turn off stagger under reduced motion", () => {
    const visible = getVariants(true).stagger.visible;
    expect(visible).toMatchObject({ transition: { staggerChildren: 0 } });
  });
});

describe("staggerDelay", () => {
  it("steps 30ms and caps at 8 items", () => {
    expect(staggerDelay(0, false)).toBe(0);
    expect(staggerDelay(1, false)).toBeCloseTo(STAGGER_SECONDS);
    expect(staggerDelay(7, false)).toBeCloseTo(7 * STAGGER_SECONDS);
    expect(staggerDelay(20, false)).toBeCloseTo((MAX_STAGGERED_ITEMS - 1) * STAGGER_SECONDS);
  });

  it("is zero under reduced motion", () => {
    expect(staggerDelay(5, true)).toBe(0);
  });
});
