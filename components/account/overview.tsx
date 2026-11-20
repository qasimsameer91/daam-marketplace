"use client";
import { useTranslations } from "next-intl";
import { ShieldCheck, Eye, MessageCircle, Smartphone, ArrowUpRight, Pencil } from "lucide-react";
import { usePreviewAccount } from "./preview-provider";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
export function Overview() {
  const t = useTranslations("Dashboard");
  const shell = useTranslations("Shell");
  const market = useTranslations("Market");
  const { profile, owned } = usePreviewAccount();
  const count = owned.filter((l) => l.status === "active").length;
  const initial = profile.name.trim().charAt(0).toUpperCase() || "D";
  const cityLabel = (() => {
    try {
      return market(`cities.${profile.city as "lahore"}`);
    } catch {
      return profile.city;
    }
  })();
  return (
    <div className="space-y-6">
      {/* PROFILE HEADER — edit profile sits at the very top */}
      <section className="flex items-center gap-4 rounded-card border border-border bg-card p-4 sm:p-5">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xl font-semibold text-background"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-display sm:text-2xl">
            {profile.name}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            @{profile.username} · {cityLabel}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/dashboard/settings">
            <Pencil aria-hidden className="size-4" />
            <span className="hidden sm:inline">{t("overview.editProfile")}</span>
          </Link>
        </Button>
      </section>

      <p className="text-base text-muted-foreground">{t("greeting", { name: profile.name })}</p>

      {/* STATS — one horizontal line (3 across on every width) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { key: "active", value: count, Icon: Smartphone },
          { key: "views", value: 128, Icon: Eye },
          { key: "unread", value: 2, Icon: MessageCircle },
        ].map(({ key, value, Icon }) => (
          <div key={key} className="rounded-card border border-border bg-card p-3 sm:p-5">
            <Icon aria-hidden className="mb-2 size-5 text-muted-foreground sm:mb-4" />
            <p className="font-mono text-2xl font-semibold sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
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
