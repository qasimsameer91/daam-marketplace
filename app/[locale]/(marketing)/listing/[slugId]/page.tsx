import { ChevronRight, Eye, Fingerprint, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { BatteryPill } from "@/components/daam/battery-pill";
import { ConditionChip } from "@/components/daam/condition-chip";
import { DaamMeter } from "@/components/daam/daam-meter";
import { ListingCard } from "@/components/daam/listing-card";
import { SafetyCard } from "@/components/daam/safety-card";
import { ContactActions } from "@/components/listing/contact-actions";
import { CpidBanner } from "@/components/listing/cpid-banner";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { PtaSection } from "@/components/listing/pta-section";
import { ReportListingDialog } from "@/components/listing/report-listing-dialog";
import { SellerCard } from "@/components/listing/seller-card";
import { SpecTable } from "@/components/listing/spec-table";
import { JsonLd } from "@/components/seo/json-ld";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { formatPKR } from "@/lib/domain/pricing";
import { requiresCpidBanner } from "@/lib/domain/pta";
import { Link } from "@/lib/i18n/navigation";
import { isAppLocale } from "@/lib/i18n/routing";
import {
  brands,
  cities,
  findListingBySlugId,
  mockNow,
  similarListings,
  type MockListing,
} from "@/lib/mock/marketplace";
import { findProfile, findShop } from "@/lib/mock/people";
import { productOfferJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/site";
import { Suspense } from "react";
import { CampaignBanner } from "@/components/marketplace/campaign-placement";

const MEETUP_KEYS = [
  "public_place",
  "daylight",
  "bring_someone",
  "check_imei",
  "test_phone",
  "no_advance",
  "verified_shops",
] as const;
const CHECK_STEPS = [1, 2, 3, 4, 5] as const;

function cityLabel(t: Awaited<ReturnType<typeof getTranslations<"Market">>>, listing: MockListing) {
  const known = cities.find((c) => c === listing.citySlug);
  return known ? t(`cities.${known}`) : listing.city;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/listing/[slugId]">): Promise<Metadata> {
  const { slugId } = await params;
  const listing = findListingBySlugId(slugId);
  if (!listing) return {};
  return {
    title: `${listing.modelName} ${listing.variantLabel} · ${formatPKR(listing.pricePkr)} | Daam`,
  };
}

export default async function ListingPage({ params }: PageProps<"/[locale]/listing/[slugId]">) {
  const { slugId } = await params;
  const listing = findListingBySlugId(slugId);
  if (!listing) notFound();

  const locale = await getLocale();
  const appLocale = isAppLocale(locale) ? locale : "en";
  const [t, market, card, format, copy] = await Promise.all([
    getTranslations("Listing"),
    getTranslations("Market"),
    getTranslations("ListingCard"),
    getFormatter(),
    getSeedContentBlocks(appLocale),
  ]);

  const profile = findProfile(listing.sellerUsername);
  const shop = listing.shopSlug ? (findShop(listing.shopSlug) ?? null) : null;
  const brandName = brands.find((b) => b.slug === listing.brand)?.name ?? listing.brand;
  const cityName = cityLabel(market, listing);
  const title = `${listing.modelName} · ${listing.variantLabel}`;
  const d = listing.detail;
  const images = Array.from({ length: Math.max(d.imageCount, 1) }, (_, i) => ({
    src: listing.imageUrl ?? "/phone-preview.svg",
    alt: listing.isDemo
      ? card("illustrativeImage")
      : `${title} (${t("gallery.photo", { n: i + 1, total: d.imageCount })})`,
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-36 md:px-6 md:pb-16 lg:px-8">
      <JsonLd
        data={productOfferJsonLd({
          name: `${listing.modelName} ${listing.variantLabel}`,
          brand: brandName,
          url: absoluteUrl(appLocale, listing.href),
          image: null,
          pricePkr: listing.pricePkr,
          condition: listing.condition,
          sold: false,
        })}
      />

      <nav aria-label={t("breadcrumb")} className="mb-5 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link
              href="/phones"
              className="inline-flex min-h-11 items-center hover:text-foreground"
            >
              {market("allPhones")}
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-4 rtl:rotate-180" />
          <li>
            <Link
              href={`/phones/${listing.brand}`}
              className="inline-flex min-h-11 items-center hover:text-foreground"
            >
              {brandName}
            </Link>
          </li>
          <ChevronRight aria-hidden className="size-4 rtl:rotate-180" />
          <li>
            <Link
              href={`/phones/${listing.brand}/${listing.model}`}
              className="inline-flex min-h-11 items-center hover:text-foreground"
            >
              {listing.modelName}
            </Link>
          </li>
        </ol>
      </nav>

      <p className="mb-5 rounded-xl border border-border bg-sand/50 px-4 py-3 text-xs text-muted-foreground">
        {market("demo")}
      </p>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
        <ListingGallery images={images} title={title} />

        <div className="flex flex-col gap-5 self-start rounded-card border border-border bg-surface p-5 md:p-7">
          {requiresCpidBanner(listing.ptaStatus) ? (
            <CpidBanner body={copy.get("cpid.banner") ?? ""} />
          ) : null}

          <div className="flex flex-col gap-3">
            <div>
              <h1 className="font-display text-[clamp(32px,4vw,52px)] leading-[0.95] font-extrabold tracking-[-1.6px] rtl:leading-[1.3]">
                {listing.modelName}
              </h1>
              <div className="mt-1 text-lg font-semibold text-body">{listing.variantLabel}</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="bg-lime px-3 py-[5px] font-display text-[30px] font-extrabold text-ink">
                {formatPKR(listing.pricePkr)}
              </span>
              <DaamMeter band={listing.daamBand} size="md" range={d.daamRange} showUnknown />
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden className="size-4" />
                {listing.area ? card("location", { area: listing.area, city: cityName }) : cityName}
              </span>
              <span>
                {t("listed", { time: format.relativeTime(new Date(listing.publishedAt), mockNow) })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye aria-hidden className="size-4" />
                {t("views", { count: d.viewCount })}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ConditionChip condition={listing.condition} size="md" />
            {listing.batteryHealth !== null ? (
              <BatteryPill health={listing.batteryHealth} size="md" />
            ) : null}
          </div>

          <PtaSection
            status={listing.ptaStatus}
            lock={listing.networkLock}
            regType={d.ptaRegType}
            checkSource={d.ptaCheckSource}
            checkedAt={d.ptaCheckedAt}
            now={mockNow}
            copy={copy}
          />

          <p className="flex items-start gap-2 text-sm">
            <Fingerprint aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-medium">{t("imeiOnFile")}</span>{" "}
              <bdi dir="ltr" className="font-mono">
                ••••{d.imeiLast4}
              </bdi>
              <span className="block text-muted-foreground">{t("imeiNote")}</span>
            </span>
          </p>

          <div className="hidden flex-col gap-2 md:flex">
            <h2 className="text-sm font-semibold">{t("contactTitle")}</h2>
            <ContactActions contact={d.contact} />
          </div>
          <ReportListingDialog />
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <section
            aria-labelledby="desc-title"
            className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6"
          >
            <h2 id="desc-title" className="text-xl font-semibold">
              {t("description")}
            </h2>
            <p className="text-xs text-muted-foreground">{t("descriptionNote")}</p>
            {/* Plain text only: user content is never rendered as HTML. */}
            <p className="text-base whitespace-pre-line">{d.description}</p>
          </section>
          <section
            aria-labelledby="spec-title"
            className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6"
          >
            <h2 id="spec-title" className="text-xl font-semibold">
              {t("specs")}
            </h2>
            <SpecTable listing={listing} brandName={brandName} />
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          {profile ? <SellerCard profile={profile} shop={shop} cityName={cityName} /> : null}
          <SafetyCard
            title={t("checkTitle")}
            intro={copy.get("check_before_pay.intro")}
            tips={CHECK_STEPS.map((n) => copy.get(`check_before_pay.step_${n}`) ?? "")}
          />
          <SafetyCard
            title={t("safetyTitle")}
            tips={MEETUP_KEYS.map((k) => copy.get(`safety.meetup.${k}`) ?? "")}
          />
        </aside>
      </div>

      <Suspense fallback={null}>
        <CampaignBanner placement="listing_page" locale={locale} />
      </Suspense>
      <section aria-labelledby="similar-title" className="mt-14">
        <h2 id="similar-title" className="mb-5 text-2xl font-semibold tracking-display">
          {t("similar")}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {similarListings(listing).map((l) => {
            const known = cities.find((c) => c === l.citySlug);
            return (
              <ListingCard
                key={l.id}
                listing={{ ...l, city: known ? market(`cities.${known}`) : l.city }}
                now={mockNow}
              />
            );
          })}
        </div>
      </section>

      <ContactActions contact={d.contact} variant="bar" />
    </main>
  );
}
