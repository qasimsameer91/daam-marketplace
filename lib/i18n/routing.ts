import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ur"] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

/** Locales rendered right-to-left. */
const rtlLocales: ReadonlySet<AppLocale> = new Set<AppLocale>(["ur"]);

export function getDirection(locale: AppLocale): "ltr" | "rtl" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}
