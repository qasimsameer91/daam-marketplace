import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { isAppLocale, routing } from "./routing";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // An explicit locale (e.g. getTranslations({ locale })) wins; otherwise use the [locale] root segment.
  const candidate = explicitLocale ?? (await rootLocale());
  if (candidate !== undefined && !isAppLocale(candidate)) notFound();
  const locale = candidate ?? routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
