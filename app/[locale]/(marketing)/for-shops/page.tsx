import { Award, Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageSection, StaticPage } from "@/components/marketplace/static-page";
import { cn } from "@/lib/utils";

const PLANS = [
  { key: "free", features: ["freeF1", "freeF2", "freeF3"] },
  { key: "pro", features: ["proF1", "proF2", "proF3"] },
  { key: "elite", features: ["eliteF1", "eliteF2", "eliteF3"] },
] as const;
const VERIFY = ["v1", "v2", "v3", "v4"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.forShops");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

/** Shop plans (plan §18). Prices are hypotheses, so no prices are shown: every plan is "Coming soon". */
export default async function ForShopsPage() {
  const t = await getTranslations("Pages.forShops");
  return (
    <StaticPage title={t("title")} intro={t("intro")} wide>
      <section className="flex flex-col gap-3 rounded-card bg-sand p-6 text-foreground md:p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-lime text-ink">
          <Award aria-hidden className="size-5" />
        </span>
        <h2 className="text-2xl font-semibold">{t("foundingTitle")}</h2>
        <p className="max-w-2xl text-paper/80">{t("foundingBody")}</p>
      </section>

      <PageSection id="plans" title={t("plansTitle")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <li
              key={plan.key}
              className={cn(
                "flex flex-col gap-4 rounded-card border border-border p-5",
                plan.key === "pro" && "border-foreground",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{t(plan.key)}</h3>
                <span className="rounded-chip bg-muted px-2.5 py-1 text-xs font-medium">
                  {t("comingSoon")}
                </span>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {t(f)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="verify" title={t("verifyTitle")}>
        <ol className="grid gap-3 sm:grid-cols-2">
          {VERIFY.map((k, i) => (
            <li key={k} className="flex items-center gap-3 rounded-card bg-muted/60 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime font-mono text-sm font-semibold text-ink">
                {i + 1}
              </span>
              {t(k)}
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">{t("verifyNote")}</p>
      </PageSection>
    </StaticPage>
  );
}
