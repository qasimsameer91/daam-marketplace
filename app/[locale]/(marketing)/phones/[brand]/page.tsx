import { notFound } from "next/navigation";
import { brands } from "@/lib/mock/marketplace";
import { BrowsePage } from "@/components/marketplace/browse-page";
export default async function Page({ params }: PageProps<"/[locale]/phones/[brand]">) {
  const { brand } = await params;
  const entry = brands.find((b) => b.slug === brand);
  if (!entry) notFound();
  return <BrowsePage title={entry.name} scope={{ brand }} />;
}
