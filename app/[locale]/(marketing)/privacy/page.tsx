import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/marketplace/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.privacy");
  return { title: `${t("title")} | Daam` };
}

export default function PrivacyPage() {
  return <LegalPage namespace="privacy" />;
}
