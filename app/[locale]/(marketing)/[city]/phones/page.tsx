import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { cities } from "@/lib/mock/marketplace";
import { BrowsePage } from "@/components/marketplace/browse-page";
export default async function Page({ params }: PageProps<"/[locale]/[city]/phones">) {
  const { city } = await params;
  const entry = cities.find((c) => c === city);
  if (!entry) notFound();
  const t = await getTranslations("Market");
  return <BrowsePage title={t(`cities.${entry}`)} scope={{ city }} />;
}
