import { ArrowUpRight, Smartphone, Clock, Flag, Store, Users, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { StatusChip } from "@/components/admin/status-chip";
import { adminOverview, adminReports, moderationQueue } from "@/lib/mock/admin";

type TileKey =
  "liveListings" | "pendingReview" | "openReports" | "flagged" | "verifiedShops" | "totalUsers";

const TILES: { key: TileKey; value: number; Icon: LucideIcon; href: string }[] = [
  {
    key: "liveListings",
    value: adminOverview.liveListings,
    Icon: Smartphone,
    href: "/admin/listings",
  },
  {
    key: "pendingReview",
    value: adminOverview.pendingReview,
    Icon: Clock,
    href: "/admin/listings",
  },
  { key: "openReports", value: adminOverview.openReports, Icon: Flag, href: "/admin/reports" },
  { key: "flagged", value: adminOverview.flagged, Icon: ShieldAlert, href: "/admin/listings" },
  { key: "verifiedShops", value: adminOverview.verifiedShops, Icon: Store, href: "/shops" },
  { key: "totalUsers", value: adminOverview.totalUsers, Icon: Users, href: "/admin/users" },
];

export default async function AdminOverviewPage() {
  const [t, m] = await Promise.all([getTranslations("Admin"), getTranslations("Market")]);
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">
          {t("overview.statsTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILES.map(({ key, value, Icon, href }) => (
            <Link
              key={key}
              href={href}
              prefetch={false}
              className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-transform hover:-translate-y-0.5 reduced-motion:hover:translate-y-0"
            >
              <span className="flex items-center justify-between text-muted-foreground">
                <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                <ArrowUpRight
                  aria-hidden
                  className="size-4 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </span>
              <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
              <span className="text-xs text-muted-foreground">{t(`overview.${key}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="queue-title"
        className="rounded-card border border-border bg-surface p-5 md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="queue-title" className="text-lg font-semibold">
            {t("overview.recentModeration")}
          </h2>
          <Link href="/admin/listings" prefetch={false} className="editorial-text-link text-sm">
            {t("overview.viewAll")}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {moderationQueue.slice(0, 5).map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {row.title} <span className="text-muted-foreground">· {row.variant}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.seller} · {m(`cities.${row.city as "lahore"}`)}
                </p>
              </div>
              <StatusChip kind={row.status} label={t(`moderationStatus.${row.status}`)} />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="reports-title"
        className="rounded-card border border-border bg-surface p-5 md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="reports-title" className="text-lg font-semibold">
            {t("overview.openReports")}
          </h2>
          <Link href="/admin/reports" prefetch={false} className="editorial-text-link text-sm">
            {t("overview.viewAll")}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {adminReports
            .filter((r) => r.status === "open" || r.status === "reviewing")
            .map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t(`reportReason.${r.reason}`)}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.targetTitle}</p>
                </div>
                <StatusChip kind={r.status} label={t(`reportStatus.${r.status}`)} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
