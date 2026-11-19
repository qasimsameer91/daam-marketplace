/**
 * Shared motion tokens & variants (plan §14). Pure data, safe to import anywhere.
 *
 * Rules: animate only transform + opacity; under reduced motion every variant degrades to
 * opacity-only (no translate/scale/rotate, no stagger). Use `useDaamMotion()` in components.
 */
import type { Transition, Variants } from "motion/react";

/** Durations in seconds (mirrors --duration-* CSS tokens). */
export const duration = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  hero: 0.5,
} as const;

export const ease = {
  standard: [0.16, 1, 0.3, 1],
  emphasized: [0.3, 0, 0, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const spring = { type: "spring", stiffness: 400, damping: 30 } as const satisfies Transition;

/** Stagger: at most 8 items, 30ms apart (§14). */
export const STAGGER_SECONDS = 0.03;
export const MAX_STAGGERED_ITEMS = 8;

/** Delay for the i-th item of a batch; items past the 8th appear with the 8th. */
export function staggerDelay(index: number, reduced: boolean): number {
  if (reduced) return 0;
  return Math.min(Math.max(index, 0), MAX_STAGGERED_ITEMS - 1) * STAGGER_SECONDS;
}

const fade = (seconds: number): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: seconds, ease: ease.standard } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.standard } },
});

/** Card reveal: fade + 8px rise. */
export function fadeRise(reduced: boolean): Variants {
  if (reduced) return fade(duration.base);
  return {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.standard } },
    exit: { opacity: 0, y: 8, transition: { duration: duration.fast, ease: ease.standard } },
  };
}

/** Parent for staggered children (children use `fadeRise`). */
export function stagger(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : STAGGER_SECONDS } },
  };
}

/** Bottom sheet (mobile drawers): slides up. */
export function sheet(reduced: boolean): Variants {
  if (reduced) return fade(duration.base);
  return {
    hidden: { opacity: 1, y: "100%" },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.emphasized } },
    exit: { opacity: 1, y: "100%", transition: { duration: duration.base, ease: ease.standard } },
  };
}

/** Modal / dialog: scale 0.98 → 1 + fade. */
export function modal(reduced: boolean): Variants {
  if (reduced) return fade(duration.base);
  return {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: duration.slow, ease: ease.standard } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: ease.standard } },
  };
}

/** "LISTED" stamp on publish success: drops in rotated, settles with a spring bounce. */
export function stamp(reduced: boolean): Variants {
  if (reduced) return fade(duration.hero);
  return {
    hidden: { opacity: 0, scale: 1.6, rotate: -18 },
    visible: { opacity: 1, scale: 1, rotate: -8, transition: spring },
    exit: { opacity: 0, transition: { duration: duration.fast } },
  };
}

/** Chip pop (filter chips, Daam Meter band change). */
export function pop(reduced: boolean): Variants {
  if (reduced) return fade(duration.base);
  return {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: spring },
    exit: { opacity: 0, scale: 0.85, transition: { duration: duration.fast } },
  };
}

export interface DaamVariants {
  fadeRise: Variants;
  stagger: Variants;
  sheet: Variants;
  modal: Variants;
  stamp: Variants;
  pop: Variants;
}

export function getVariants(reduced: boolean): DaamVariants {
  return {
    fadeRise: fadeRise(reduced),
    stagger: stagger(reduced),
    sheet: sheet(reduced),
    modal: modal(reduced),
    stamp: stamp(reduced),
    pop: pop(reduced),
  };
}
