"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
export function Verify() {
  const t = useTranslations("Dashboard.verify");
  const shell = useTranslations("Shell");
  const [sample, setSample] = useState(false);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("intro")}</p>
      <section className="space-y-5 rounded-card border border-border p-5">
        <ShieldCheck aria-hidden className="size-7" />
        <h2 className="text-xl font-semibold">{t("idTitle")}</h2>
        <p className="rounded-card bg-muted p-4 text-sm">{shell("noDocuments")}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["cnicFront", "cnicBack", "selfie"] as const).map((key) => (
            <div
              key={key}
              className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-card border border-dashed border-input p-4 text-center"
            >
              <ImageIcon aria-hidden className="size-6 text-muted-foreground" />
              <span className="text-sm">{t(key)}</span>
              <Button disabled variant="outline" size="sm">
                {t("choose")}
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={() => setSample(true)}>{shell("sampleVerification")}</Button>
        {sample && (
          <p role="status" className="text-sm text-muted-foreground">
            {shell("verificationPreview")}
          </p>
        )}
      </section>
      <section className="space-y-3 rounded-card border border-border p-5">
        <h2 className="text-xl font-semibold">{t("shopTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("shopBody")}</p>
        <Button asChild variant="outline">
          <Link href="/for-shops">{t("shopCta")}</Link>
        </Button>
      </section>
    </div>
  );
}
