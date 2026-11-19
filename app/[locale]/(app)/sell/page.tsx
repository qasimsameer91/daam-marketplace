import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocale, getTranslations } from "next-intl/server";
import { SellWizard } from "@/components/sell/sell-wizard";
import { getSellCatalog } from "@/lib/catalog/seed-catalog";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { NETWORK_LOCKS, PTA_STATUSES } from "@/lib/domain/pta";
import { isAppLocale } from "@/lib/i18n/routing";
import { mockDaamRanges } from "@/lib/mock/marketplace";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Sell");
  return { title: `${t("title")} | Daam`, robots: { index: false } };
}

export default async function SellPage() {
  const common = await getTranslations("Common");
  const locale = await getLocale();
  const [catalog, blocks] = await Promise.all([
    getSellCatalog(),
    getSeedContentBlocks(isAppLocale(locale) ? locale : "en"),
  ]);
  // Only the explainer copy the wizard shows (content_blocks), not the whole table.
  const keys = [
    ...PTA_STATUSES.map((s) => `pta_status.${s}`),
    ...NETWORK_LOCKS.map((l) => `network_lock.${l}`),
  ];
  const copy = Object.fromEntries(keys.map((k) => [k, blocks.get(k) ?? ""]));

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <Suspense
        fallback={
          <div role="status" aria-label={common("loading")} className="space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        }
      >
        <SellWizard catalog={catalog} copy={copy} daamRanges={mockDaamRanges()} />
      </Suspense>
    </main>
  );
}
