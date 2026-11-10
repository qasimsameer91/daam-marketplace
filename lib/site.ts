/** Public site origin for canonical URLs and JSON-LD (no trailing slash). */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

/** Absolute URL for a locale-prefixed path, e.g. absoluteUrl("en", "/listing/x"). */
export function absoluteUrl(locale: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}/${locale}${clean === "/" ? "" : clean}`;
}
