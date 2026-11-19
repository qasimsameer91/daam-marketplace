/**
 * Raw brand colours for places CSS variables can't reach (viewport theme-color, OG images, emails).
 * Mirrors the @theme palette in app/globals.css — keep both in sync. Components must use
 * Tailwind token classes instead of these values.
 */
export const brandColors = {
  ink: "#2b0f1c",
  paper: "#f4efe4",
  lime: "#d8f500",
  graphite: "#3a1826",
  slate: "#6a5560",
  mist: "#e3dccb",
  clay: "#ad7456",
  clayInk: "#915b3f",
  sand: "#efe9dc",
  pearl: "#eeece8",
  body: "#44303a",
  success: "#cfe8c4",
  successInk: "#234016",
  warning: "#f3e0b8",
  warningInk: "#6b4e12",
  danger: "#f3d9c4",
  dangerInk: "#8a3b1f",
  info: "#cfe0ef",
  live: "#3ea76a",
  night: "#1a0912",
  nightSurface: "#3a1826",
  nightText: "#f4efe4",
} as const;

export type BrandColor = keyof typeof brandColors;
