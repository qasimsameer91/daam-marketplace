import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqList } from "@/components/marketplace/faq-list";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { HELP_FAQ_KEYS, faqItems } from "@/lib/content/faq";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { Link } from "@/lib/i18n/navigation";
import { isAppLocale } from "@/lib/i18n/routing";
import { faqPageJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.help");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function HelpPage() {
  const locale = await getLocale();
  const [t, copy] = await Promise.all([
    getTranslations("Pages.help"),
    getSeedContentBlocks(isAppLocale(locale) ? locale : "en"),
  ]);
  const faq = faqItems(copy, HELP_FAQ_KEYS);

  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <JsonLd data={faqPageJsonLd(faq)} />
      <FaqList items={faq} />
      <PageSection id="contact" title={t("contactTitle")}>
        <Button asChild variant="secondary" className="w-fit">
          <Link href="/contact">{t("contactCta")}</Link>
        </Button>
      </PageSection>
    </StaticPage>
  );
}
