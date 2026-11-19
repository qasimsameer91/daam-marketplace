import type { Tone } from "@/lib/domain/pta";

/**
 * Solid tone backgrounds with ink text: passes WCAG AA in light and dark mode
 * (raw status colours are never used as text). Always pair with an icon + label.
 */
export const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success-ink dark:bg-success dark:text-ink",
  warning: "bg-warning/10 text-warning-ink dark:bg-warning dark:text-ink",
  danger: "bg-danger/10 text-danger-ink dark:bg-danger dark:text-ink",
  neutral: "bg-muted text-foreground",
};

export const chipBase =
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-chip font-medium whitespace-nowrap [&>svg]:shrink-0";

export const chipSizes = {
  sm: "h-6 px-2 text-xs [&>svg]:size-3.5",
  md: "h-7 px-2.5 text-sm [&>svg]:size-4",
} as const;

export type ChipSize = keyof typeof chipSizes;
