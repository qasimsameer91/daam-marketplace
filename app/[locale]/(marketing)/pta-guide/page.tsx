import { ExternalLink, MessageSquareText, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { NetworkLockBadge } from "@/components/daam/network-lock-badge";
import { PtaBadge } from "@/components/daam/pta-badge";
import { FaqList } from "@/components/marketplace/faq-list";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";
import { JsonLd } from "@/components/seo/json-ld";
import { PTA_FAQ_KEYS, faqItems } from "@/lib/content/faq";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { NETWORK_LOCKS, PTA_STATUSES } from "@/lib/domain/pta";
import { isAppLocale } from "@/lib/i18n/routing";
import { faqPageJsonLd } from "@/lib/seo/json-ld";

const STEPS = [1, 2, 3, 4, 5] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.ptaGuide");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function PtaGuidePage() {
  const locale = await getLocale();
  const [t, spec, copy] = await Promise.all([
    getTranslations("Pages.ptaGuide"),
    getTranslations("Spec"),
    getSeedContentBlocks(isAppLocale(locale) ? locale : "en"),
  ]);
  const faq = faqItems(copy, PTA_FAQ_KEYS);

  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <JsonLd data={faqPageJsonLd(faq)} />

      <PageSection id="status" title={t("statusTitle")}>
        <ul className="flex flex-col gap-3">
          {PTA_STATUSES.map((status) => (
            <li key={status} className="flex flex-col gap-2 rounded-card border border-border p-4">
              <PtaBadge status={status} size="md" detailed />
              <p className="text-muted-foreground">{copy.get(`pta_status.${status}`)}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="lock" title={t("lockTitle")}>
        <ul className="flex flex-col gap-3">
          {NETWORK_LOCKS.map((lock) => (
            <li key={lock} className="flex flex-col gap-2 rounded-card border border-border p-4">
              <NetworkLockBadge lock={lock} size="md" />
              <p className="text-muted-foreground">{copy.get(`network_lock.${lock}`)}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="reg" title={t("regTitle")}>
        <dl className="flex flex-col gap-3">
          {(["official_import", "individual_tax_paid"] as const).map((type) => (
            <div key={type} className="rounded-card bg-muted/60 p-4">
              <dt className="font-medium">{spec(`regTypeValues.${type}`)}</dt>
              <dd className="mt-1 text-muted-foreground">{copy.get(`pta_reg_type.${type}`)}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection id="check" title={t("checkTitle")}>
        <p>{copy.get("check_before_pay.intro")}</p>
        <ol className="flex flex-col gap-3">
          {STEPS.map((n) => (
            <li key={n} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime font-mono text-sm font-semibold text-ink">
                {n}
              </span>
              <p className="pt-1">{copy.get(`check_before_pay.step_${n}`)}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="official" title={t("officialTitle")}>
        <p className="text-muted-foreground">{t("officialBody")}</p>
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href="https://dvs.pta.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
            >
              <ExternalLink aria-hidden className="size-4" />
              {t("dvs")}
            </a>
          </li>
          <li className="flex min-h-11 items-center gap-2">
            <MessageSquareText aria-hidden className="size-4" />
            {t("sms")}
          </li>
          <li className="flex min-h-11 items-center gap-2">
            <Phone aria-hidden className="size-4" />
            <bdi dir="ltr">{t("ussd")}</bdi>
          </li>
        </ul>
      </PageSection>

      <PageSection id="faq" title={t("faqTitle")}>
        <FaqList items={faq} />
      </PageSection>
    </StaticPage>
  );
}
