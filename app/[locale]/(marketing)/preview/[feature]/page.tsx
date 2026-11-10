import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
const features = [
  "listing",
  "sell",
  "messages",
  "account",
  "pta-guide",
  "safety",
  "about",
  "contact",
  "help",
  "terms",
  "privacy",
  "policies",
  "for-shops",
  "report-stolen",
] as const;
export default async function Page({ params }: PageProps<"/[locale]/preview/[feature]">) {
  const { feature } = await params;
  const known = features.find((f) => f === feature);
  if (!known) notFound();
  const t = await getTranslations("Market");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-20">
      <p className="mb-4 text-xs text-muted-foreground">{t("demo")}</p>
      <h1 className="mb-5 text-3xl font-semibold">{t(`pages.${known}`)}</h1>
      <h2 className="mb-3 text-xl">{t("nextStage")}</h2>
      <p className="mb-8 text-muted-foreground">{t("nextBody")}</p>
      <Button asChild>
        <Link href="/phones">{t("allPhones")}</Link>
      </Button>
    </main>
  );
}
