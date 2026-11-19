import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ListingCard } from "@/components/daam/listing-card";
import { listings, daamListings, cities, mockNow } from "@/lib/mock/marketplace";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BoxPacked");
  return { title: `${t("title")} | Daam` };
}

export default async function BoxPackedPage({
  searchParams,
}: PageProps<"/[locale]/phones/box-packed">) {
  const { source } = await searchParams;
  const active: "daam" | "sellers" = source === "sellers" ? "sellers" : "daam";
  const [t, market] = await Promise.all([getTranslations("BoxPacked"), getTranslations("Market")]);

  // From Daam = Daam's own sealed catalogue; From sellers = box-packed listings from users/shops.
  const fromDaam = daamListings;
  const fromSellers = listings.filter((l) => l.box && l.condition === "like_new" && !l.soldByDaam);
  const shown = active === "daam" ? fromDaam : fromSellers;

  const cityLabel = (slug: string) =>
    (cities as readonly string[]).includes(slug) ? market(`cities.${slug as "lahore"}`) : slug;

  const cats = [
    { key: "daam" as const, label: t("fromDaam"), desc: t("fromDaamDesc"), count: fromDaam.length },
    {
      key: "sellers" as const,
      label: t("fromSellers"),
      desc: t("fromSellersDesc"),
      count: fromSellers.length,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 lg:px-10">
      <h1 className="font-display text-[clamp(38px,5vw,64px)] leading-[0.95] font-extrabold tracking-[-2px] rtl:leading-[1.25]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-[640px] text-[17px] font-medium text-body">{t("intro")}</p>

      {/* CATEGORY CARDS / TABS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cats.map((c) => (
          <Link
            key={c.key}
            href={c.key === "daam" ? "/phones/box-packed" : "/phones/box-packed?source=sellers"}
            aria-current={active === c.key ? "true" : undefined}
            className={cn(
              "flex flex-col gap-1 border-2 border-ink p-5 transition-transform hover:-translate-y-1 reduced-motion:hover:translate-y-0",
              active === c.key ? "bg-lime" : "bg-white",
            )}
          >
            <span className="flex items-center justify-between font-display text-xl font-extrabold">
              {c.label}
              <span className="text-sm font-semibold text-ink/60">
                {t("count", { count: c.count })}
              </span>
            </span>
            <span className="text-sm font-medium text-body">{c.desc}</span>
          </Link>
        ))}
      </div>

      {/* RESULTS */}
      <h2 className="mt-8 mb-4 font-display text-[clamp(22px,2.6vw,32px)] font-extrabold tracking-[-1px]">
        {active === "daam" ? t("fromDaam") : t("fromSellers")}{" "}
        <span className="text-slate">({shown.length})</span>
      </h2>
      {shown.length === 0 ? (
        <p className="border-2 border-ink bg-white p-6 text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-4">
          {shown.map((l) => (
            <ListingCard key={l.id} listing={{ ...l, city: cityLabel(l.citySlug) }} now={mockNow} />
          ))}
        </div>
      )}
    </main>
  );
}
