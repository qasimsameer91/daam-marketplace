import { getTranslations } from "next-intl/server";
import { brands, listings } from "@/lib/mock/marketplace";
import { BrandTile } from "@/components/daam/brand-tile";
export default async function Page() {
  const t = await getTranslations("Market");
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <h1 className="mb-3 text-4xl font-semibold">{t("allBrands")}</h1>
      <p className="mb-8 text-sm text-muted-foreground">{t("demo")}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {brands.map((b) => (
          <BrandTile
            key={b.slug}
            name={b.name}
            href={`/phones/${b.slug}`}
            count={listings.filter((l) => l.brand === b.slug).length}
          />
        ))}
      </div>
    </main>
  );
}
