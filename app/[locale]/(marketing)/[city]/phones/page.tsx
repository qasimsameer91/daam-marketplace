import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cities } from "@/lib/mock/marketplace";
import { BrowsePage } from "@/components/marketplace/browse-page";
import { getCatalog } from "@/lib/data/catalog";
export default async function Page({ params }: PageProps<"/[locale]/[city]/phones">) {
  const { city } = await params;
  const catalog = await getCatalog();
  const entry = catalog?.cities.find((c) => c.slug === city);
  if (catalog && !entry) notFound();
  const mockEntry = cities.find((c) => c === city);
  if (!catalog && !mockEntry) notFound();
  const t = await getTranslations("Market");
  const locale = await getLocale();
  const title = entry ? (locale === "ur" ? entry.nameUr : entry.nameEn) : t(`cities.${mockEntry!}`);
  return <BrowsePage title={title} scope={{ city }} />;
}
