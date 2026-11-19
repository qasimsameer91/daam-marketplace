import { Clock, ExternalLink, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ListingGrid } from "@/components/listing/listing-grid";
import { ReviewList } from "@/components/listing/review-list";
import { StarRating } from "@/components/listing/star-rating";
import { Link } from "@/lib/i18n/navigation";
import { cities, listingsByShop } from "@/lib/mock/marketplace";
import { findShop, reviewsFor, type ShopDay } from "@/lib/mock/people";

const DAYS: ShopDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const TILE_BG = ["#5a1f36", "#223042", "#2f5130", "#1f3a5a", "#2b2b33", "#3a2740"];

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

  const [t, profile, market] = await Promise.all([
    getTranslations("Shop"),
    getTranslations("Profile"),
    getTranslations("Market"),
  ]);
  const city = cities.find((c) => c === shop.citySlug);
  const cityName = city ? market(`cities.${city}`) : shop.citySlug;
  const stock = listingsByShop(shop.slug);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, ${cityName}`)}`;
  const tileBg = TILE_BG[slug.length % TILE_BG.length];
  const verified = shop.tier !== "none";

  const stats = [
    { value: String(stock.length), label: t("statListings") },
    {
      value: shop.ratingCount > 0 ? `${shop.ratingAvg.toFixed(1)} ★` : "—",
      label: t("statRating"),
    },
    { value: String(shop.ratingCount), label: t("statReviews") },
    { value: verified ? t("statusVerified") : t("statusNew"), label: t("statStatus") },
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-7 md:px-8 lg:px-10">
      {/* HEADER */}
      <div className="grid items-start gap-[30px] lg:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <h1 className="font-display text-[clamp(34px,4.2vw,52px)] leading-[0.95] font-extrabold tracking-[-1.6px] rtl:leading-[1.25]">
            {shop.name}
          </h1>
          <div className="mt-1 text-[15px] font-semibold text-slate">
            {t("phoneShop")} · {cityName}
          </div>

          <div className="mt-4 grid gap-[14px] sm:grid-cols-[230px_minmax(0,1fr)]">
            <div
              className="flex aspect-[3/2] items-center justify-center border-2 border-ink p-2"
              style={{ background: tileBg }}
            >
              <span className="font-display text-lg font-bold text-white">{shop.name}</span>
            </div>
            <div className="flex aspect-[16/8] flex-col items-center justify-center gap-1.5 border-2 border-ink bg-sand">
              <span className="text-2xl text-ink/40">⌁</span>
              <span className="text-[12.5px] font-semibold text-ink/50">{t("stock")}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-stretch border-2 border-ink bg-white">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`min-w-[120px] flex-1 px-[18px] py-[14px] ${i < stats.length - 1 ? "border-e-2 border-ink" : ""}`}
              >
                <div className="font-display text-2xl font-extrabold">{s.value}</div>
                <div className="text-[12.5px] font-semibold text-slate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-2 border-ink bg-white p-5">
          <div className="flex items-center gap-2 font-display text-xl font-extrabold">
            <MapPin aria-hidden className="size-5" /> {t("location")}
          </div>
          <p className="mt-2 text-sm font-medium text-body">
            {shop.address}, {cityName}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-1.5 border-b-2 border-ink pb-0.5 text-sm font-bold"
          >
            {t("openMaps")}
            <ExternalLink aria-hidden className="size-3.5" />
          </a>

          <div className="mt-5 border-t-[1.5px] border-ink/[0.18] pt-[18px]">
            <div className="font-display text-xl font-extrabold">☎ {t("contactShop")}</div>
            <p className="mt-1.5 text-[13.5px] font-medium text-slate">{t("contactIntro")}</p>
            <Link
              href="/messages"
              prefetch={false}
              className="mt-3 flex items-center justify-center gap-2.5 border-2 border-ink bg-lime py-[13px] font-display text-[15px] font-bold text-ink"
            >
              💬 {t("chatShop")}
            </Link>
          </div>

          <div className="mt-5 border-t-[1.5px] border-ink/[0.18] pt-[18px]">
            <div className="flex items-center gap-2 font-display text-lg font-extrabold">
              <Clock aria-hidden className="size-4" /> {t("hours")}
            </div>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              {DAYS.map((day) => {
                const slot = shop.hours.find((h) => h.days.includes(day));
                return (
                  <div key={day} className="contents">
                    <dt className="text-slate">{t(`days.${day}`)}</dt>
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

      {/* INVENTORY */}
      <section aria-labelledby="stock-title" className="mt-10 border-t-2 border-ink pt-6">
        <h2
          id="stock-title"
          className="mb-5 font-display text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-1px]"
        >
          {t("inventory")} <span className="text-slate">({stock.length})</span>
        </h2>
        <ListingGrid listings={stock} />
      </section>

      {shop.tier !== "none" ? (
        <p className="mt-6 text-sm text-muted-foreground">{t("verifiedNote")}</p>
      ) : null}

      <section aria-labelledby="reviews-title" className="mt-12 max-w-3xl">
        <h2
          id="reviews-title"
          className="mb-5 flex items-center gap-3 font-display text-2xl font-extrabold"
        >
          {profile("reviews")}
          {shop.ratingCount > 0 ? <StarRating rating={shop.ratingAvg} /> : null}
        </h2>
        <ReviewList reviews={reviewsFor(shop.ownerUsername)} />
      </section>
    </main>
  );
}
