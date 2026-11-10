/**
 * Listing completion score shown on the sell-wizard preview (plan §8: "Add 2 more photos to
 * reach 100%"). Pure; Phase 6 stores the same value in listings.completion_score.
 */

export interface CompletionInput {
  photoCount: number;
  descriptionLength: number;
  /** null when the phone doesn't expose battery health (then it isn't counted). */
  batteryHealth: number | null;
  supportsBatteryHealth: boolean;
  colorName: string | null;
  purchaseMonth: string | null;
}

export type CompletionHint =
  | { key: "photos"; count: number }
  | { key: "description" }
  | { key: "battery" }
  | { key: "color" }
  | { key: "purchase" };

/** Photos beyond this add nothing more to the score. */
export const IDEAL_PHOTOS = 6;
export const GOOD_DESCRIPTION = 40;

export function completionScore(input: CompletionInput): {
  score: number;
  hints: CompletionHint[];
} {
  const parts: { weight: number; done: number; hint: CompletionHint | null }[] = [
    {
      weight: 40,
      done: Math.min(input.photoCount, IDEAL_PHOTOS) / IDEAL_PHOTOS,
      hint:
        input.photoCount < IDEAL_PHOTOS
          ? { key: "photos", count: IDEAL_PHOTOS - input.photoCount }
          : null,
    },
    {
      weight: 25,
      done: input.descriptionLength >= GOOD_DESCRIPTION ? 1 : 0,
      hint: input.descriptionLength >= GOOD_DESCRIPTION ? null : { key: "description" },
    },
    ...(input.supportsBatteryHealth
      ? [
          {
            weight: 15,
            done: input.batteryHealth !== null ? 1 : 0,
            hint: input.batteryHealth !== null ? null : ({ key: "battery" } as const),
          },
        ]
      : []),
    {
      weight: 10,
      done: input.colorName ? 1 : 0,
      hint: input.colorName ? null : ({ key: "color" } as const),
    },
    {
      weight: 10,
      done: input.purchaseMonth ? 1 : 0,
      hint: input.purchaseMonth ? null : ({ key: "purchase" } as const),
    },
  ];
  const total = parts.reduce((sum, p) => sum + p.weight, 0);
  const earned = parts.reduce((sum, p) => sum + p.weight * p.done, 0);
  return {
    score: Math.round((earned / total) * 100),
    hints: parts.flatMap((p) => (p.hint ? [p.hint] : [])),
  };
}
