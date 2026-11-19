import { BadgeCheck, Store } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StatusChip } from "@/components/admin/status-chip";
import { adminUsers } from "@/lib/mock/admin";

export default async function AdminUsersPage() {
  const [t, m] = await Promise.all([getTranslations("Admin"), getTranslations("Market")]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">{t("users.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("users.intro")}</p>
      </div>

      {adminUsers.length === 0 ? (
        <p className="rounded-card border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          {t("users.empty")}
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-card border border-border md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">{t("users.col.user")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("users.col.role")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("users.col.listings")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("users.col.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {adminUsers.map((u) => (
                  <tr key={u.username}>
                    <td className="px-4 py-3">
                      <p className="inline-flex items-center gap-1.5 font-medium">
                        {u.displayName}
                        {u.idVerified ? (
                          <BadgeCheck aria-hidden className="size-4 text-info" />
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m(`cities.${u.citySlug as "lahore"}`)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-chip bg-muted px-2.5 py-1 text-xs font-medium">
                        {u.role === "shop" ? <Store aria-hidden className="size-3.5" /> : null}
                        {t(`userRole.${u.role}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">{u.listingsCount}</td>
                    <td className="px-4 py-3">
                      <StatusChip kind={u.status} label={t(`userStatus.${u.status}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {adminUsers.map((u) => (
              <li key={u.username} className="rounded-card border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 font-medium">
                      {u.displayName}
                      {u.idVerified ? (
                        <BadgeCheck aria-hidden className="size-4 text-info" />
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m(`cities.${u.citySlug as "lahore"}`)} · {t(`userRole.${u.role}`)}
                    </p>
                  </div>
                  <StatusChip kind={u.status} label={t(`userStatus.${u.status}`)} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("users.col.listings")}: <span className="font-mono">{u.listingsCount}</span>
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
