"use client";
import { LayoutDashboard, ListChecks, Users, Flag, Megaphone, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { key: "overview", href: "/admin", Icon: LayoutDashboard },
  { key: "listings", href: "/admin/listings", Icon: ListChecks },
  { key: "users", href: "/admin/users", Icon: Users },
  { key: "reports", href: "/admin/reports", Icon: Flag },
  { key: "promotions", href: "/admin/promotions", Icon: Megaphone },
  { key: "settings", href: "/admin/settings", Icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Admin");
  const path = usePathname();
  const isActive = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));
  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-clay-ink uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-display">
            {t("title")}
          </h1>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-chip border border-border bg-warning/20 px-3 py-1 text-xs font-medium text-warning-ink",
          )}
        >
          {t("previewBadge")}
        </span>
      </div>
      <p className="mt-4 rounded-card border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
        {t("previewNotice")}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="min-w-0 self-start rounded-card border border-border bg-surface p-3">
          <nav
            aria-label={t("title")}
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
          >
            {links.map(({ key, href, Icon }) => (
              <Link
                key={key}
                href={href}
                prefetch={false}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-button px-4 text-sm [&>svg]:size-4 [&>svg]:shrink-0",
                  isActive(href)
                    ? "bg-secondary font-semibold text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon aria-hidden strokeWidth={1.6} />
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
