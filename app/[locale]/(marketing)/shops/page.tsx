import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { StarRating } from "@/components/listing/star-rating";
import { listingsByShop } from "@/lib/mock/marketplace";
import { shops } from "@/lib/mock/people";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Shops");
  return { title: `${t("title")} | Daam` };
}

/** Storefront tile tints (spec palette). */
const TILE_BG = ["#5a1f36", "#223042", "#2f5130", "#1f3a5a", "#2b2b33", "#3a2740"];

export default async function ShopsDirectoryPage() {
  const [t, m, listing] = await Promise.all([
    getTranslations("Shops"),
    getTranslations("Market"),
    getTranslations("Listing"),
  ]);
  const ordered = [...shops].sort(
    (a, b) => Number(b.tier !== "none") - Number(a.tier !== "none") || b.ratingAvg - a.ratingAvg,
  );

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 lg:px-10">
      <h1 className="font-display text-[clamp(44px,6.4vw,92px)] leading-[0.9] font-extrabold tracking-[-2.6px] rtl:leading-[1.25]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-[720px] text-[18px] font-medium text-body">{t("intro")}</p>

      {/* SEARCH */}
      <form className="mt-6 flex max-w-[860px] gap-3">
        <div className="flex flex-1 items-center gap-[10px] border-2 border-ink bg-white px-4">
          <span className="text-[17px] opacity-60">⌕</span>
          <input
            placeholder={t("searchPlaceholder")}
            className="w-full border-none bg-transparent py-[15px] text-[15px] text-ink outline-none"
          />
        </div>
        <Link
          href="/shops"
          className="flex items-center border-2 border-ink bg-lime px-[26px] font-display text-base font-bold whitespace-nowrap text-ink"
        >
          {t("searchShops")}
        </Link>
      </form>

      <div className="mt-7 flex items-end justify-between">
        <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold tracking-[-1.2px]">
          {t("localShops")}
        </h2>
        <span className="text-[15px] font-semibold text-slate">
          {t("shopsFound", { count: ordered.length })}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {ordered.map((shop, i) => {
          const stock = listingsByShop(shop.slug).length;
          return (
            <div
              key={shop.slug}
              className="group flex gap-[18px] border-2 border-ink bg-white p-[14px] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] reduced-motion:hover:translate-y-0 reduced-motion:hover:shadow-none"
            >
              <div
                className="flex h-[140px] shrink-0 basis-[150px] items-center justify-center border-2 border-ink p-2 text-center"
                style={{ background: TILE_BG[i % TILE_BG.length] }}
              >
                <span className="font-display text-base leading-tight font-bold text-white">
                  {shop.name}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="font-display text-[21px] font-bold tracking-[-0.4px]">
                  {shop.name}
                </div>
                <div className="mt-[3px] text-[13.5px] font-semibold text-slate">
                  ◉ {m(`cities.${shop.citySlug as "lahore"}`)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {shop.tier !== "none" ? (
                    <VerifiedBadge kind={shop.tier === "trusted" ? "trusted" : "shop"} />
                  ) : null}
                  {shop.ratingCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate">
                      <StarRating rating={shop.ratingAvg} />
                      {listing("reviewsCount", { count: shop.ratingCount })}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 flex-1 text-sm font-medium text-body">
                  {t("inStock", { count: stock })}
                </p>
                <Link
                  href={`/shop/${shop.slug}`}
                  className="mt-[10px] self-start border-2 border-ink bg-lime px-4 py-[9px] font-display text-sm font-bold text-ink"
                >
                  {t("viewShop")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
