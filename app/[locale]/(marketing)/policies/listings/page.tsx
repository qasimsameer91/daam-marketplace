import { Ban, Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";

const RULES = ["r1", "r2", "r3", "r4", "r5", "r6"] as const;
const PROHIBITED = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.listingPolicy");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function ListingPolicyPage() {
  const t = await getTranslations("Pages.listingPolicy");
  return (
    <StaticPage title={t("title")} intro={t("intro")} legalDraft>
      <PageSection id="rules" title={t("rulesTitle")}>
        <ul className="flex flex-col gap-3">
          {RULES.map((k) => (
            <li key={k} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
              </span>
              {t(k)}
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="prohibited" title={t("prohibitedTitle")}>
        <ul className="flex flex-col gap-3">
          {PROHIBITED.map((k) => (
            <li key={k} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-danger text-ink">
                <Ban aria-hidden className="size-3.5" strokeWidth={2.5} />
              </span>
              {t(k)}
            </li>
          ))}
        </ul>
      </PageSection>
    </StaticPage>
  );
}
