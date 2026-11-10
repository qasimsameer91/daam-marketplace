import { BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.about");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function AboutPage() {
  const t = await getTranslations("Pages.about");
  const promises = [
    { q: "q1", body: "q1Body", Icon: ShieldCheck },
    { q: "q2", body: "q2Body", Icon: BadgeCheck },
    { q: "q3", body: "q3Body", Icon: Sparkles },
  ] as const;

  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <PageSection id="promise" title={t("promiseTitle")}>
        <ol className="grid gap-3 sm:grid-cols-3">
          {promises.map(({ q, body, Icon }) => (
            <li key={q} className="flex flex-col gap-3 rounded-card border border-border p-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-lime text-ink">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="font-semibold">{t(q)}</h3>
              <p className="text-sm text-muted-foreground">{t(body)}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection id="city" title={t("cityTitle")}>
        <p className="flex gap-2 text-muted-foreground">
          <MapPin aria-hidden className="mt-1 size-4 shrink-0" />
          {t("cityBody")}
        </p>
      </PageSection>
    </StaticPage>
  );
}
