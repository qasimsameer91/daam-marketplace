import { ArrowUpRight } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { StatusChip } from "@/components/admin/status-chip";
import { adminReports } from "@/lib/mock/admin";

export default async function AdminReportsPage() {
  const [t, format] = await Promise.all([getTranslations("Admin"), getFormatter()]);
  const sorted = [...adminReports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">{t("reports.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("reports.intro")}</p>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-card border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          {t("reports.empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((r) => (
            <li key={r.id} className="rounded-card border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{t(`reportReason.${r.reason}`)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format.dateTime(new Date(r.createdAt), { dateStyle: "medium" })}
                  </p>
                </div>
                <StatusChip kind={r.status} label={t(`reportStatus.${r.status}`)} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.note}</p>
              <Link
                href={r.targetHref}
                prefetch={false}
                className="editorial-text-link mt-3 inline-flex text-xs"
              >
                {r.targetTitle}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
