import { getFormatter, getTranslations } from "next-intl/server";
import { PageSection, StaticPage } from "./static-page";

/** Draft legal copy was last revised on this date (update with the lawyer-reviewed version). */
const LEGAL_REVISED = new Date("2026-11-10T00:00:00Z");
const SECTIONS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

/** Terms / privacy pages: six titled sections from `Pages.<namespace>`, flagged as a legal draft. */
export async function LegalPage({ namespace }: { namespace: "terms" | "privacy" }) {
  const [t, pages, format] = await Promise.all([
    getTranslations(`Pages.${namespace}`),
    getTranslations("Pages"),
    getFormatter(),
  ]);
  return (
    <StaticPage title={t("title")} legalDraft>
      <p className="-mt-6 text-sm text-muted-foreground">
        {pages("lastUpdated", {
          date: format.dateTime(LEGAL_REVISED, { day: "numeric", month: "long", year: "numeric" }),
        })}
      </p>
      {SECTIONS.map((s) => (
        <PageSection key={s} id={s} title={t(s)}>
          <p className="text-muted-foreground">{t(`${s}Body`)}</p>
        </PageSection>
      ))}
    </StaticPage>
  );
}
