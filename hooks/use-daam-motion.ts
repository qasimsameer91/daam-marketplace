"use client";

import { useReducedMotion } from "motion/react";
import { useContext, useMemo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { ReducedMotionOverrideContext } from "@/components/motion/reduced-motion-override";
import { getVariants, type DaamVariants } from "@/lib/motion";

/** True when the OS asks for reduced motion or a parent forces it (design-page preview). */
export function usePrefersReducedMotion(): boolean {
  const override = useContext(ReducedMotionOverrideContext);
  const system = useReducedMotion();
  // The OS preference is unknown during SSR. Match the server on the initial
  // hydration render, then apply the preference immediately after hydration.
  const hydrated = useHydrated();
  return override ?? (hydrated && Boolean(system));
}

/** Daam motion variants that automatically degrade to opacity-only under reduced motion. */
export function useDaamMotion(): { reduced: boolean; variants: DaamVariants } {
  const reduced = usePrefersReducedMotion();
  const variants = useMemo(() => getVariants(reduced), [reduced]);
  return { reduced, variants };
}
