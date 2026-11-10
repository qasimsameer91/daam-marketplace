import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BrowseClient, type BrowseScope } from "./browse-client";
import { ListingCardSkeleton } from "@/components/daam/listing-card-skeleton";
export async function BrowsePage({ title, scope = {} }: { title?: string; scope?: BrowseScope }) {
  const t = await getTranslations("Market");
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="mb-3 text-3xl font-semibold tracking-display md:text-4xl">
        {title ?? t("browseTitle")}
      </h1>
      <p className="mb-8 text-xs text-muted-foreground">{t("demo")}</p>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <ListingCardSkeleton key={n} />
            ))}
          </div>
        }
      >
        <BrowseClient scope={scope} />
      </Suspense>
    </main>
  );
}
