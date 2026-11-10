import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReportStolenForm } from "@/components/marketplace/report-stolen-form";
import { StaticPage } from "@/components/marketplace/static-page";
import { brands } from "@/lib/mock/marketplace";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.reportStolen");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function ReportStolenPage() {
  const t = await getTranslations("Pages.reportStolen");
  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <ReportStolenForm brands={brands.filter((b) => b.slug !== "other")} />
    </StaticPage>
  );
}
