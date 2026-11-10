"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
const links = [
  { key: "overview", href: "/dashboard" },
  { key: "listings", href: "/dashboard/listings" },
  { key: "favorites", href: "/dashboard/favorites" },
  { key: "messages", href: "/messages" },
  { key: "notifications", href: "/notifications" },
  { key: "verify", href: "/dashboard/verify" },
  { key: "shop", href: "/dashboard/shop" },
  { key: "settings", href: "/dashboard/settings" },
] as const;
export function AccountNav() {
  const t = useTranslations("Dashboard.nav");
  const path = usePathname();
  return (
    <nav
      aria-label={t("label")}
      className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
    >
      {links.map(({ key, href }) => (
        <Link
          key={key}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center rounded-button px-4 text-sm",
            path === href
              ? "bg-secondary font-semibold text-secondary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
