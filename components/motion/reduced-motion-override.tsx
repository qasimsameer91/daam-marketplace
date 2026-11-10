"use client";

import { MotionConfig } from "motion/react";
import { createContext, type ReactNode } from "react";

/** `true` forces reduced motion (design-page preview); `null` defers to the OS setting. */
export const ReducedMotionOverrideContext = createContext<boolean | null>(null);

/**
 * Forces reduced motion for a subtree: our variants (via useDaamMotion), Motion's own
 * transform animations (MotionConfig) and CSS (data-reduced-motion → `reduced-motion:` variant).
 */
export function ReducedMotionOverride({
  reduced,
  children,
}: {
  reduced: boolean;
  children: ReactNode;
}) {
  return (
    <ReducedMotionOverrideContext.Provider value={reduced ? true : null}>
      <MotionConfig reducedMotion={reduced ? "always" : "user"}>
        <div data-reduced-motion={reduced ? "true" : undefined} className="contents">
          {children}
        </div>
      </MotionConfig>
    </ReducedMotionOverrideContext.Provider>
  );
}
