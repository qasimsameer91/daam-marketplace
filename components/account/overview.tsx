"use client";
import { useTranslations } from "next-intl";
import { ShieldCheck, Eye, MessageCircle, Smartphone, ArrowUpRight } from "lucide-react";
import { usePreviewAccount } from "./preview-provider";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
export function Overview() {
  const t = useTranslations("Dashboard");
  const shell = useTranslations("Shell");
  const { profile, owned } = usePreviewAccount();
  const count = owned.filter((l) => l.status === "active").length;
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-display">
        {t("greeting", { name: profile.name })}
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { key: "active", value: count, Icon: Smartphone },
          { key: "views", value: 128, Icon: Eye },
          { key: "unread", value: 2, Icon: MessageCircle },
        ].map(({ key, value, Icon }) => (
          <div key={key} className="rounded-card border border-border bg-card p-5">
            <Icon aria-hidden className="mb-4 size-5 text-muted-foreground" />
            <p className="font-mono text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(`overview.${key as "active" | "views" | "unread"}`)}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{t("overview.limitNote", { max: 3 })}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="space-y-4 rounded-card border border-border p-5">
          <ShieldCheck aria-hidden className="size-6" />
          <h2 className="text-xl font-semibold">{t("overview.verificationTitle")}</h2>
          <p className="text-sm text-muted-foreground">{shell("verificationNotLive")}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/verify">{t("overview.idCta")}</Link>
          </Button>
        </section>
        <section className="space-y-4 rounded-card border border-border p-5">
          <h2 className="text-xl font-semibold">{t("overview.nextTitle")}</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>{t("overview.nextBattery")}</li>
            <li>{t("overview.nextPending")}</li>
          </ul>
          <Button asChild>
            <Link href="/sell">
              {t("overview.sell")}
              <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
