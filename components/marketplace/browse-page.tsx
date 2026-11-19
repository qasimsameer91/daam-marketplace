import { Suspense } from "react";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { BrowseClient, type BrowseScope } from "./browse-client";
import { ListingCardSkeleton } from "@/components/daam/listing-card-skeleton";
import { getCatalog } from "@/lib/data/catalog";
import { getSeedBrowseCatalog } from "@/lib/catalog/seed-catalog";

async function BrowseResults({
  scope,
  centerSearch,
}: {
  scope: BrowseScope;
  centerSearch?: boolean;
}) {
  // Render URL-dependent results on the server for the incoming request. A static
  // useSearchParams boundary otherwise sends only skeletons until hydration.
  await connection();
  // Supabase catalog when configured; otherwise the full seed catalog so every brand's
  // whole model line shows in the filters (not just models that have a mock listing).
  const catalog = (await getCatalog()) ?? (await getSeedBrowseCatalog());
  return <BrowseClient scope={scope} catalog={catalog} centerSearch={centerSearch} />;
}

export async function BrowsePage({
  title,
  scope = {},
  searchFirst = false,
}: {
  title?: string;
  scope?: BrowseScope;
  /** Search tab: hide the big heading and centre the search bar. */
  searchFirst?: boolean;
}) {
  const r = await getTranslations("Redesign");
  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-7 md:px-8 md:py-9 lg:px-10">
      {searchFirst ? (
        // Keep an accessible page title but hide it visually on the search-first tab.
        <h1 className="sr-only">{title ?? r("browseTitle")}</h1>
      ) : (
        <>
          <h1 className="font-display text-[clamp(38px,5vw,64px)] leading-[0.95] font-extrabold tracking-[-2px] rtl:leading-[1.3]">
            {title ?? r("browseTitle")}
          </h1>
          <p className="mt-2 mb-7 text-[17px] font-medium text-body">{r("browseBody")}</p>
        </>
      )}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <ListingCardSkeleton key={n} />
            ))}
          </div>
        }
      >
        <BrowseResults scope={scope} centerSearch={searchFirst} />
      </Suspense>
    </main>
  );
}
