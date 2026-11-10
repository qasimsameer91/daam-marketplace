import { Info } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketplace/contact-form";
import { StaticPage } from "@/components/marketplace/static-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.contact");
  return { title: `${t("title")} | Daam`, description: t("intro") };
}

export default async function ContactPage() {
  const t = await getTranslations("Pages.contact");
  return (
    <StaticPage title={t("title")} intro={t("intro")}>
      <ContactForm />
      <p className="flex gap-2 rounded-card bg-muted/60 p-4 text-sm">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        {t("reportNote")}
      </p>
    </StaticPage>
  );
}
