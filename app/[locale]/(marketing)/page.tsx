import {
  ArrowUpRight,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  Store,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { brands, cities, listings, mockNow } from "@/lib/mock/marketplace";
import { Button } from "@/components/ui/button";
import { BrandTile } from "@/components/daam/brand-tile";
import { ListingCard } from "@/components/daam/listing-card";
import { PtaBadge } from "@/components/daam/pta-badge";
import { SearchBox } from "@/components/marketplace/search-box";
import { HeroPhone } from "@/components/marketplace/hero-phone";
import { Reveal } from "@/components/marketplace/reveal";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { isAppLocale } from "@/lib/i18n/routing";

export default async function HomePage() {
  const t = await getTranslations("Market");
  const locale = await getLocale();
  const copy = await getSeedContentBlocks(isAppLocale(locale) ? locale : "en");
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:px-6 md:py-20 lg:px-8">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <span className="size-2 rounded-full bg-success" />
            {t("eyebrow")}
          </p>
          <h1 className="text-5xl font-bold tracking-display sm:text-6xl">
            <span className="block">{t("heroStart")}</span>
            <span className="mt-3 inline-block bg-lime px-2 pb-2 text-ink">{t("heroEnd")}</span>
          </h1>
          <p className="my-7 max-w-lg text-lg text-muted-foreground">{t("heroBody")}</p>
          <SearchBox />
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {["iPhone 14 Pro", "13 pm", "s23u"].map((q) => (
              <Link
                key={q}
                href={`/phones?q=${encodeURIComponent(q)}`}
                prefetch={false}
                className="rounded-chip border border-border px-3 py-2 font-mono"
              >
                {q}
                <ArrowUpRight aria-hidden className="ms-1 inline size-3" />
              </Link>
            ))}
          </div>
        </div>
        <HeroPhone />
      </section>
      <div className="border-y border-border bg-muted/50">
        <p className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground md:px-6 lg:px-8">
          {t("demo")}
        </p>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-display">{t("brandTitle")}</h2>
          <Link
            href="/brands"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium"
          >
            {t("allBrands")}
            <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.slice(0, 8).map((b) => (
            <BrandTile
              key={b.slug}
              name={b.name}
              href={`/phones/${b.slug}`}
              count={listings.filter((l) => l.brand === b.slug).length}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
              {t("browseNote")}
            </p>
            <h2 className="text-3xl font-semibold tracking-display">{t("fresh")}</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/phones">
              {t("viewAll")}
              <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {listings.slice(0, 8).map((l, index) => (
            <Reveal key={l.id} index={index}>
              <ListingCard
                key={l.id}
                listing={{ ...l, city: t(`cities.${l.citySlug as (typeof cities)[number]}`) }}
                now={mockNow}
              />
            </Reveal>
          ))}
        </div>
      </section>
      <section id="safety" className="mt-16 border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-semibold tracking-display">{t("trustTitle")}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("trustBody")}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { key: "trustPta", Icon: ShieldCheck },
                { key: "trustCondition", Icon: BadgeCheck },
                { key: "trustPrice", Icon: Sparkles },
                { key: "trustShops", Icon: Store },
              ] as const
            ).map(({ key, Icon }) => (
              <div key={key} className="rounded-card border border-border bg-background p-5">
                <Icon aria-hidden className="mb-5 size-6" />
                <h3 className="font-semibold">{t(key)}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {key === "trustPta"
                    ? copy.get("pta_check.seller_declared")
                    : key === "trustShops"
                      ? copy.get("safety.meetup.verified_shops")
                      : key === "trustCondition"
                        ? copy.get("safety.meetup.test_phone")
                        : t("trustPriceBody")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-14 md:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-card border border-border p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-display">{t("ptaTeaserTitle")}</h2>
            <p className="max-w-xl text-muted-foreground">{t("ptaTeaserBody")}</p>
            <div className="flex flex-wrap gap-2">
              <PtaBadge status="pta_approved" networkLock="factory_unlocked" />
              <PtaBadge status="non_pta" networkLock="jv" />
              <PtaBadge status="cpid_patched" />
            </div>
          </div>
          <Button asChild variant="secondary" className="w-fit">
            <Link href="/pta-guide">
              {t("ptaTeaserCta")}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
        <MapPin aria-hidden className="mb-4 size-6" />
        <h2 className="text-3xl font-semibold">{t("cityTitle")}</h2>
        <p className="mt-3 text-muted-foreground">{t("cityBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/${city}/phones`}
              className="rounded-chip border border-border px-5 py-3 text-sm hover:bg-muted"
            >
              {t(`cities.${city}`)}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-card bg-ink p-7 text-paper md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-3xl font-semibold">{t("shopTitle")}</h2>
            <p className="mt-3 max-w-xl text-paper/75">{t("shopBody")}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/for-shops">
              {t("shopCta")}
              <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
