import { ArrowUpRight, Store, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { StatusChip } from "@/components/admin/status-chip";
import { moderationQueue } from "@/lib/mock/admin";
import { formatPKR } from "@/lib/domain/pricing";

export default async function AdminListingsPage() {
  const [t, m] = await Promise.all([getTranslations("Admin"), getTranslations("Market")]);
  const counts = {
    all: moderationQueue.length,
    pending: moderationQueue.filter((r) => r.status === "pending").length,
    flagged: moderationQueue.filter((r) => r.status === "flagged").length,
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">{t("listings.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("listings.intro")}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {(["all", "pending", "flagged"] as const).map((k) => (
          <span
            key={k}
            className="inline-flex items-center gap-1.5 rounded-chip border border-border px-3 py-1.5"
          >
            {t(`listings.filter.${k}`)}
            <span className="font-mono font-semibold">{counts[k]}</span>
          </span>
        ))}
      </div>

      {moderationQueue.length === 0 ? (
        <p className="rounded-card border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          {t("listings.empty")}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-card border border-border md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-start text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">{t("listings.col.phone")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("listings.col.seller")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("listings.col.price")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("listings.col.status")}</th>
                  <th className="px-4 py-3 text-end font-medium">{t("listings.col.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {moderationQueue.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.variant} · {m(`cities.${row.city as "lahore"}`)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        {row.isShop ? (
                          <Store aria-hidden className="size-3.5" />
                        ) : (
                          <UserRound aria-hidden className="size-3.5" />
                        )}
                        {row.seller}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">{formatPKR(row.pricePkr)}</td>
                    <td className="px-4 py-3">
                      <StatusChip kind={row.status} label={t(`moderationStatus.${row.status}`)} />
                      {row.flagReason ? (
                        <p className="mt-1 text-xs text-danger-ink">
                          {t(`reportReason.${row.flagReason}`)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={row.href}
                        prefetch={false}
                        className="editorial-text-link text-xs"
                      >
                        {t("listings.col.view")}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="flex flex-col gap-3 md:hidden">
            {moderationQueue.map((row) => (
              <li key={row.id} className="rounded-card border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.variant} · {m(`cities.${row.city as "lahore"}`)}
                    </p>
                  </div>
                  <StatusChip kind={row.status} label={t(`moderationStatus.${row.status}`)} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    {row.isShop ? (
                      <Store aria-hidden className="size-3.5" />
                    ) : (
                      <UserRound aria-hidden className="size-3.5" />
                    )}
                    {row.seller}
                  </span>
                  <span className="font-mono tabular-nums">{formatPKR(row.pricePkr)}</span>
                </div>
                <Link
                  href={row.href}
                  prefetch={false}
                  className="editorial-text-link mt-3 inline-flex text-xs"
                >
                  {t("listings.col.view")}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
