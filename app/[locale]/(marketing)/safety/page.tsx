import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SafetyCard } from "@/components/daam/safety-card";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";
import { Button } from "@/components/ui/button";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { Link } from "@/lib/i18n/navigation";
import { isAppLocale } from "@/lib/i18n/routing";

const MEETUP = [
  "public_place",
  "daylight",
  "bring_someone",
  "check_imei",
  "test_phone",
  "no_advance",
  "verified_shops",
] as const;
const SCAMS = [
  "token_money",
  "easypaisa_first",
  "courier",
  "outside_links",
  "fake_8484",
  "too_cheap",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.safety");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function SafetyPage() {
  const locale = await getLocale();
  const [t, copy] = await Promise.all([
    getTranslations("Pages.safety"),
    getSeedContentBlocks(isAppLocale(locale) ? locale : "en"),
  ]);

  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <SafetyCard
        title={t("meetupTitle")}
        intro={copy.get("safety.meetup.intro")}
        tips={MEETUP.map((k) => copy.get(`safety.meetup.${k}`) ?? "")}
      />

      <PageSection id="scams" title={t("scamTitle")}>
        <ul className="flex flex-col gap-3">
          {SCAMS.map((k) => (
            <li key={k} className="flex gap-3 rounded-card border border-border p-4">
              <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p>{copy.get(`safety.scam.${k}`)}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="report" title={t("reportTitle")}>
        <p className="text-muted-foreground">{copy.get("safety.report")}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/report-stolen">{t("reportCta")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pta-guide">{t("ptaCta")}</Link>
          </Button>
        </div>
      </PageSection>
    </StaticPage>
  );
}
