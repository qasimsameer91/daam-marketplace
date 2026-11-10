import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { models, listings } from "@/lib/mock/marketplace";
import { BrowsePage } from "@/components/marketplace/browse-page";
import { PriceTag } from "@/components/daam/price-tag";
import { PtaBadge } from "@/components/daam/pta-badge";
import { ConditionChip } from "@/components/daam/condition-chip";
export default async function Page({ params }: PageProps<"/[locale]/phones/[brand]/[model]">) {
  const { brand, model } = await params;
  const entry = models.find((m) => m.slug === model && m.brand === brand);
  if (!entry) notFound();
  const t = await getTranslations("Market");
  const rows = listings.filter((l) => l.model === model);
  const groups = [...new Set(rows.map((l) => `${l.ptaStatus}:${l.condition}`))].map((key) =>
    rows.filter((l) => `${l.ptaStatus}:${l.condition}` === key),
  );
  return (
    <>
      <section className="mx-auto mt-8 w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="rounded-card border border-border bg-muted/40 p-5">
          <h2 className="text-xl font-semibold">{t("guide")}</h2>
          <p className="my-3 text-sm text-muted-foreground">{t("guideBody")}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, i) => {
              const prices = group.map((l) => l.pricePkr).sort((a, b) => a - b);
              const middle = Math.floor(prices.length / 2);
              const median =
                prices.length % 2 ? prices[middle]! : (prices[middle - 1]! + prices[middle]!) / 2;
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-card border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <PtaBadge status={group[0]!.ptaStatus} />
                    <ConditionChip condition={group[0]!.condition} />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("median")}</p>
                  <PriceTag amount={Math.round(median)} />
                  <p className="text-xs text-muted-foreground">{t("range")}</p>
                  <div className="flex flex-wrap gap-2">
                    <PriceTag amount={prices[0]!} size="sm" />
                    <span>–</span>
                    <PriceTag amount={prices.at(-1)!} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <BrowsePage title={entry.name} scope={{ brand, model }} />
    </>
  );
}
