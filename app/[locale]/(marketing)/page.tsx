import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const otherLocale = locale === "en" ? "ur" : "en";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-6xl font-bold tracking-tight">{t("brand")}</h1>
      <p className="text-lg">{t("tagline")}</p>
      <Link href="/" locale={otherLocale} className="underline underline-offset-4">
        {t("switchLanguage")}
      </Link>
    </main>
  );
}
