import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/marketplace/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.terms");
  return { title: `${t("title")} | Daam` };
}

export default function TermsPage() {
  return <LegalPage namespace="terms" />;
}
