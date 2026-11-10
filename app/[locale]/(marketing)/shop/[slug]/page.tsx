import { Clock, ExternalLink, MapPin, Store } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { ListingGrid } from "@/components/listing/listing-grid";
import { ReviewList } from "@/components/listing/review-list";
import { initials } from "@/components/listing/seller-card";
import { StarRating } from "@/components/listing/star-rating";
import { cities, listingsByShop } from "@/lib/mock/marketplace";
import { findShop, reviewsFor, type ShopDay } from "@/lib/mock/people";

const DAYS: ShopDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const shop = findShop(slug);
  return shop ? { title: `${shop.name} · ${shop.marketName} | Daam` } : {};
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop/[slug]">) {
  const { slug } = await params;
  const shop = findShop(slug);
  if (!shop) notFound();

  const [t, profile, listing, market] = await Promise.all([
    getTranslations("Shop"),
    getTranslations("Profile"),
    getTranslations("Listing"),
    getTranslations("Market"),
  ]);
  const city = cities.find((c) => c === shop.citySlug);
  const cityName = city ? market(`cities.${city}`) : shop.citySlug;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, ${cityName}`)}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-card bg-ink p-6 text-paper sm:flex-row sm:items-center md:p-8">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-card bg-lime font-mono text-2xl font-bold text-ink">
          {initials(shop.name)}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-display">{shop.name}</h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-paper/80">
            <Store aria-hidden className="size-4" />
            {shop.marketName}, {shop.areaName}, {cityName}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {shop.tier !== "none" ? (
              <VerifiedBadge
                kind={shop.tier === "trusted" ? "trusted" : "shop"}
                className="bg-paper text-ink"
              />
            ) : null}
            {shop.isFounding ? <VerifiedBadge kind="founding" /> : null}
            {shop.ratingCount > 0 ? <StarRating rating={shop.ratingAvg} /> : null}
            <span className="text-sm text-paper/80">
              {listing("reviewsCount", { count: shop.ratingCount })}
            </span>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section aria-labelledby="about-title" className="flex flex-col gap-3">
          <h2 id="about-title" className="text-xl font-semibold">
            {t("about")}
          </h2>
          <p>{shop.description}</p>
          {shop.tier !== "none" ? (
            <p className="text-sm text-muted-foreground">{t("verifiedNote")}</p>
          ) : null}
        </section>

        <aside className="flex flex-col gap-4 rounded-card border border-border p-4 text-sm">
          <div className="flex flex-col gap-1">
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <MapPin aria-hidden className="size-4" />
              {t("address")}
            </h2>
            <p>
              {shop.address}, {cityName}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-1.5 font-medium underline underline-offset-4"
            >
              {t("openMaps")}
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="inline-flex items-center gap-2 font-semibold">
              <Clock aria-hidden className="size-4" />
              {t("hours")}
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {DAYS.map((day) => {
                const slot = shop.hours.find((h) => h.days.includes(day));
                return (
                  <div key={day} className="contents">
                    <dt className="text-muted-foreground">{t(`days.${day}`)}</dt>
                    <dd>
                      {slot ? (
                        <bdi dir="ltr" className="font-mono">
                          {slot.open}–{slot.close}
                        </bdi>
                      ) : (
                        t("closed")
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </aside>
      </div>

      <section aria-labelledby="stock-title" className="mt-12">
        <h2 id="stock-title" className="mb-5 text-xl font-semibold">
          {t("stock")}
        </h2>
        <ListingGrid listings={listingsByShop(shop.slug)} />
      </section>

      <section aria-labelledby="reviews-title" className="mt-12 max-w-3xl">
        <h2 id="reviews-title" className="mb-5 text-xl font-semibold">
          {profile("reviews")}
        </h2>
        <ReviewList reviews={reviewsFor(shop.ownerUsername)} />
      </section>
    </main>
  );
}
