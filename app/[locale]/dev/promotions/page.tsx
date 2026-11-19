import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { pickClientMessages } from "@/lib/i18n/client-messages";
import { CampaignForm } from "@/components/account/campaign-form";

/** Development-only visual inspection. No auth bypass: saving and uploads stay disabled. */
export default async function CampaignComponentPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  const r = await getTranslations("Redesign");
  return (
    <NextIntlClientProvider messages={pickClientMessages(await getMessages(), "app")}>
      <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-10">
        <h1 className="text-3xl font-semibold">{r("campaignLibrary")}</h1>
        <p className="rounded-card border border-border bg-sand p-4 text-sm">
          {r("editorPreviewNotice")}
        </p>
        <CampaignForm previewOnly />
      </main>
    </NextIntlClientProvider>
  );
}
