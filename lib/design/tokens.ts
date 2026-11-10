/**
 * Raw brand colours for places CSS variables can't reach (viewport theme-color, OG images, emails).
 * Mirrors the @theme palette in app/globals.css — keep both in sync. Components must use
 * Tailwind token classes instead of these values.
 */
export const brandColors = {
  ink: "#0e0f12",
  paper: "#f7f6f2",
  lime: "#d7ff3f",
  graphite: "#2a2c31",
  slate: "#6b6f76",
  mist: "#e7e6e1",
  success: "#12b76a",
  warning: "#f59e0b",
  danger: "#e5484d",
  info: "#3b82f6",
  night: "#0b0c0e",
  nightSurface: "#15171b",
  nightText: "#f2f1ec",
} as const;

export type BrandColor = keyof typeof brandColors;
