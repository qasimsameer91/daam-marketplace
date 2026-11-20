import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/daam/listing-card";
import { DaamStore, type StorePhone } from "@/components/daam/daam-store";
import { listings, daamListings, brands, cities, mockNow } from "@/lib/mock/marketplace";
import { formatPKR } from "@/lib/domain/pricing";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DaamStore");
  return { title: `${t("title")} | Daam` };
}

export default async function BoxPackedPage({
  searchParams,
}: PageProps<"/[locale]/phones/box-packed">) {
  const { source } = await searchParams;
  const active: "daam" | "sellers" = source === "sellers" ? "sellers" : "daam";
  const [t, market] = await Promise.all([getTranslations("BoxPacked"), getTranslations("Market")]);

  // From Daam = Daam's own sealed catalogue (secure store); From sellers = box-packed listings.
  const fromSellers = listings.filter((l) => l.box && l.condition === "like_new" && !l.soldByDaam);

  const storePhones: StorePhone[] = daamListings.map((l) => ({
    id: l.id,
    href: l.href,
    name: l.modelName,
    price: l.pricePkr,
    priceLabel: formatPKR(l.pricePkr),
    brand: l.brand,
    available: !l.unavailable,
  }));

  const cityLabel = (slug: string) =>
    (cities as readonly string[]).includes(slug) ? market(`cities.${slug as "lahore"}`) : slug;

  const tabs = [
    { key: "daam" as const, label: t("storeTab"), href: "/phones/box-packed" },
    { key: "sellers" as const, label: t("sellersTab"), href: "/phones/box-packed?source=sellers" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 lg:px-10">
      {/* TABS: Daam store vs seller listings */}
      <div className="mb-6 flex border-2 border-ink">
        {tabs.map((tab, i) => (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active === tab.key ? "page" : undefined}
            className={cn(
              "flex-1 py-[13px] text-center font-display text-[14px] font-bold md:text-[15px]",
              i > 0 && "border-s-2 border-ink",
              active === tab.key ? "bg-lime text-ink" : "bg-white text-ink",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {active === "daam" ? (
        <DaamStore phones={storePhones} brands={brands} />
      ) : (
        <section>
          <h1 className="font-display text-[clamp(30px,4vw,48px)] leading-[0.95] font-extrabold tracking-[-1.5px] rtl:leading-[1.25]">
            {t("fromSellers")}
          </h1>
          <p className="mt-3 mb-5 max-w-[640px] border-s-4 border-lime bg-sand/60 py-2 ps-3 text-[15px] font-medium text-body">
            💬 {t("sellersNote")}
          </p>
          {fromSellers.length === 0 ? (
            <p className="border-2 border-ink bg-white p-6 text-sm text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-4">
              {fromSellers.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={{ ...l, city: cityLabel(l.citySlug) }}
                  now={mockNow}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
