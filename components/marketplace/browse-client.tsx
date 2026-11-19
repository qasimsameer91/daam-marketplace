"use client";
import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { AnimatePresence, m, LazyMotion, domMax } from "motion/react";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import {
  listings,
  models as mockModels,
  brands as mockBrands,
  cities,
  areas,
  mockNow,
} from "@/lib/mock/marketplace";
import type { Catalog } from "@/lib/data/catalog";
import { filterListings, type BrowseFilters } from "@/lib/domain/browse";
import { PTA_STATUSES, NETWORK_LOCKS } from "@/lib/domain/pta";
import { PHONE_CONDITIONS } from "@/lib/domain/condition";
import { ListingCard } from "@/components/daam/listing-card";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { Link } from "@/lib/i18n/navigation";
import { staggerDelay } from "@/lib/motion";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const stringKeys = [
  "q",
  "brand",
  "model",
  "city",
  "area",
  "pta",
  "lock",
  "condition",
  "color",
  "seller",
  "sort",
] as const;
const numberKeys = ["storage", "ram", "min", "max", "battery", "days"] as const;
const boolKeys = ["warranty", "box", "imei", "checked"] as const;
const parsers = {
  q: parseAsString.withDefault(""),
  brand: parseAsString.withDefault(""),
  model: parseAsString.withDefault(""),
  city: parseAsString.withDefault(""),
  area: parseAsString.withDefault(""),
  pta: parseAsString.withDefault(""),
  lock: parseAsString.withDefault(""),
  condition: parseAsString.withDefault(""),
  color: parseAsString.withDefault(""),
  seller: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  storage: parseAsInteger.withDefault(0),
  ram: parseAsInteger.withDefault(0),
  min: parseAsInteger.withDefault(0),
  max: parseAsInteger.withDefault(0),
  battery: parseAsInteger.withDefault(0),
  days: parseAsInteger.withDefault(0),
  warranty: parseAsBoolean.withDefault(false),
  box: parseAsBoolean.withDefault(false),
  imei: parseAsBoolean.withDefault(false),
  checked: parseAsBoolean.withDefault(false),
};
export type BrowseScope = { brand?: string; model?: string; city?: string };
type Update = (values: Partial<BrowseFilters> | null) => void;

function FilterControls({
  filters,
  update,
  scope,
  catalog,
}: {
  filters: BrowseFilters;
  update: Update;
  scope: BrowseScope;
  catalog: Catalog | null;
}) {
  const { brands, models } = catalog ?? { brands: mockBrands, models: mockModels };
  const locale = useLocale();
  const t = useTranslations("Market");
  const pta = useTranslations("Pta");
  const condition = useTranslations("Condition");
  const id = useId();
  const ready = useHydrated();
  const select = (key: keyof BrowseFilters, options: { value: string; label: string }[]) => (
    <label key={key} className="flex flex-col gap-1.5 text-sm">
      <span>{t(key)}</span>
      <select
        disabled={!ready}
        aria-label={t(key)}
        value={String(filters[key])}
        onChange={(e) =>
          update({
            [key]: numberKeys.includes(key as (typeof numberKeys)[number])
              ? Number(e.target.value)
              : e.target.value,
            ...(key === "brand" ? { model: "" } : {}),
            ...(key === "city" ? { area: "" } : {}),
          })
        }
        className="h-11 w-full min-w-0 rounded-button border border-input bg-background px-3 text-foreground"
      >
        <option value={numberKeys.includes(key as (typeof numberKeys)[number]) ? 0 : ""}>
          {t("all")}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label} (
            {
              filterListings(
                listings,
                {
                  ...filters,
                  [key]: numberKeys.includes(key as (typeof numberKeys)[number])
                    ? Number(o.value)
                    : o.value,
                },
                mockNow,
                models,
              ).length
            }
            )
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="space-y-4">
      {!scope.brand &&
        select(
          "brand",
          brands.map((b) => ({
            value: b.slug,
            label: b.name,
          })),
        )}
      {!scope.model &&
        select(
          "model",
          models
            .filter((m) => !filters.brand || m.brand === filters.brand)
            .map((m) => ({ value: m.slug, label: m.name })),
        )}
      <div className="grid grid-cols-2 gap-2">
        {(["min", "max"] as const).map((key) => (
          <label key={key} className="text-sm">
            <span className="mb-1.5 block">{t(key)}</span>
            <Input
              aria-label={t(key)}
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              value={filters[key] || ""}
              onChange={(e) => update({ [key]: Math.max(0, Number(e.target.value)) })}
            />
          </label>
        ))}
      </div>
      {select(
        "pta",
        PTA_STATUSES.map((value) => ({ value, label: pta(`status.${value}`) })),
      )}
      {select(
        "lock",
        NETWORK_LOCKS.map((value) => ({ value, label: pta(`lock.${value}`) })),
      )}
      {!scope.city &&
        select(
          "city",
          catalog
            ? catalog.cities.map((city) => ({
                value: city.slug,
                label: locale === "ur" ? city.nameUr : city.nameEn,
              }))
            : cities.map((value) => ({ value, label: t(`cities.${value}`) })),
        )}
      {select(
        "area",
        catalog
          ? [
              ...new Map(
                catalog.areas
                  .filter((area) => !filters.city || area.citySlug === filters.city)
                  .map((area) => [
                    area.slug,
                    { value: area.slug, label: locale === "ur" ? area.nameUr : area.nameEn },
                  ]),
              ).values(),
            ]
          : areas
              .filter(
                (area) =>
                  !filters.city ||
                  listings.some((l) => l.citySlug === filters.city && l.areaSlug === area),
              )
              .map((value) => ({ value, label: value })),
      )}
      {select(
        "condition",
        PHONE_CONDITIONS.map((value) => ({ value, label: condition(value) })),
      )}
      {select(
        "storage",
        [64, 128, 256, 512, 1024].map((v) => ({ value: String(v), label: String(v) })),
      )}
      {select(
        "ram",
        [4, 6, 8, 12, 16].map((v) => ({ value: String(v), label: String(v) })),
      )}
      {select(
        "battery",
        [80, 85, 90, 95].map((v) => ({ value: String(v), label: `${v}%` })),
      )}
      {select(
        "color",
        (["black", "silver", "green"] as const).map((value) => ({ value, label: t(value) })),
      )}
      {select(
        "seller",
        (["individual", "shop"] as const).map((value) => ({ value, label: t(value) })),
      )}
      {select(
        "days",
        [1, 7, 30].map((v) => ({ value: String(v), label: t("dayLabel", { count: v }) })),
      )}
      {boolKeys.map((key) => (
        <label
          key={key}
          htmlFor={`${id}-${key}`}
          className="flex min-h-11 items-center gap-3 text-sm"
        >
          <input
            id={`${id}-${key}`}
            type="checkbox"
            checked={filters[key]}
            onChange={(e) => update({ [key]: e.target.checked })}
            className="size-5 accent-foreground"
          />
          {t(key)}
        </label>
      ))}
    </div>
  );
}

export function BrowseClient({
  scope = {},
  catalog = null,
  centerSearch = false,
}: {
  scope?: BrowseScope;
  catalog?: Catalog | null;
  /** Search tab: present the search bar as a centred hero row. */
  centerSearch?: boolean;
}) {
  const { models } = catalog ?? { models: mockModels };
  const ready = useHydrated();
  const t = useTranslations("Market");
  const common = useTranslations("Common");
  const { reduced, variants } = useDaamMotion();
  const [query, setQuery] = useQueryStates(parsers, { history: "push", shallow: true });
  const filters: BrowseFilters = {
    ...query,
    ...scope,
    sort: query.sort || (query.q ? "relevant" : "newest"),
  };
  const results = filterListings(listings, filters, mockNow, models);
  const update: Update = (values) => {
    void setQuery(values);
  };
  const active = [...stringKeys, ...numberKeys, ...boolKeys].filter(
    (key) => key !== "sort" && Boolean(query[key]) && !(key in scope),
  );
  return (
    <LazyMotion features={domMax}>
      <div className="grid gap-8 lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden self-start rounded-card border border-border bg-surface p-5 lg:block">
          <h2 className="mb-5 border-b border-border pb-5 font-semibold">{t("filters")}</h2>
          <FilterControls filters={filters} update={update} scope={scope} catalog={catalog} />
        </aside>
        <div className="min-w-0">
          <div
            className={cn(
              "flex flex-wrap items-center gap-3",
              centerSearch && "mx-auto max-w-2xl justify-center",
            )}
          >
            <Input
              disabled={!ready}
              aria-label={t("q")}
              placeholder={t("searchPlaceholder")}
              value={query.q}
              onChange={(e) => update({ q: e.target.value })}
              className={cn("min-w-0 flex-1 basis-40", centerSearch && "h-12 basis-full text-base")}
            />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal aria-hidden />
                  {t("filters")}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85dvh]">
                <DrawerHeader>
                  <DrawerTitle>{t("filters")}</DrawerTitle>
                  <DrawerDescription>{t("demo")}</DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4 pb-6">
                  <FilterControls
                    filters={filters}
                    update={update}
                    scope={scope}
                    catalog={catalog}
                  />
                </div>
                <DrawerClose asChild>
                  <Button className="m-4 shrink-0">{common("close")}</Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">{t("sort")}</span>
              <select
                aria-label={t("sort")}
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="h-11 max-w-44 rounded-button border border-input bg-background px-3"
              >
                {(["relevant", "newest", "low", "high", "deals"] as const).map((value) => (
                  <option key={value} value={value}>
                    {t(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="my-5 flex flex-wrap items-center gap-2">
            <p role="status" aria-live="polite" className="me-auto text-sm text-muted-foreground">
              {t("results", { count: results.length })}
            </p>
            {active.map((key) => (
              <button
                key={key}
                type="button"
                aria-label={t("remove", { filter: t(key) })}
                onClick={() =>
                  update({
                    [key]: boolKeys.includes(key as (typeof boolKeys)[number])
                      ? false
                      : numberKeys.includes(key as (typeof numberKeys)[number])
                        ? 0
                        : "",
                  })
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-chip border border-border px-3 text-xs"
              >
                {t(key)}
                {typeof query[key] !== "boolean" ? `: ${query[key]}` : ""}
                <X aria-hidden className="size-3" />
              </button>
            ))}
            {active.length > 0 && (
              <Button variant="ghost" onClick={() => update(null)}>
                {t("clear")}
              </Button>
            )}
          </div>
          {scope.brand && !scope.model && (
            <div className="mb-6 flex flex-wrap gap-2">
              {models
                .filter((m) => m.brand === scope.brand)
                .map((m) => (
                  <Link
                    key={m.slug}
                    href={`/phones/${m.brand}/${m.slug}`}
                    className="rounded-chip border border-border px-4 py-3 text-sm"
                  >
                    {m.name}
                  </Link>
                ))}
            </div>
          )}
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={t("noResults")}
              description={t("noResultsBody")}
              action={<Button onClick={() => update(null)}>{t("clear")}</Button>}
            />
          ) : (
            <m.div
              layout={!reduced}
              className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence initial={false}>
                {results.map((listing, index) => (
                  <m.div
                    key={listing.id}
                    layout={!reduced}
                    initial={index < 4 ? false : "hidden"}
                    animate="visible"
                    exit="exit"
                    variants={{
                      ...variants.fadeRise,
                      visible: {
                        opacity: 1,
                        ...(reduced ? {} : { y: 0 }),
                        transition: { duration: 0.2, delay: staggerDelay(index, reduced) },
                      },
                    }}
                    className="min-w-0"
                  >
                    <ListingCard
                      headingLevel={2}
                      priority={index < 4}
                      listing={{
                        ...listing,
                        city: t(`cities.${listing.citySlug as (typeof cities)[number]}`),
                      }}
                      now={mockNow}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            </m.div>
          )}
        </div>
      </div>
    </LazyMotion>
  );
}
