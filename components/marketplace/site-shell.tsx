"use client";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  UserRound,
  Moon,
  Sun,
  ArrowUpRight,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { SearchBox } from "./search-box";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Market");
  const home = useTranslations("Home");
  const locale = useLocale();
  const path = usePathname();
  const { resolved, setPreference } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t("home")}
          dir="ltr"
          className="shrink-0 text-3xl font-bold tracking-tight"
        >
          daam<span className="text-muted-foreground">.</span>
        </Link>
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchBox compact />
        </div>
        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost">
            <Link href={path} locale={locale === "en" ? "ur" : "en"}>
              {home("switchLanguage")}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("theme")}
            onClick={() => setPreference(resolved === "dark" ? "light" : "dark")}
          >
            {resolved === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/sell">
              <Plus aria-hidden />
              {t("sell")}
            </Link>
          </Button>
          {/* Auth placeholder until Phase 5: logged-out visitors see "Log in". */}
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/login" aria-label={t("login")}>
              <UserRound aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
export function MobileNav() {
  const t = useTranslations("Market");
  const path = usePathname();
  const links = [
    { href: "/", key: "home", Icon: Home },
    { href: "/phones", key: "search", Icon: Search },
    { href: "/sell", key: "sell", Icon: Plus },
    { href: "/messages", key: "messages", Icon: MessageCircle },
    { href: "/dashboard", key: "account", Icon: UserRound },
  ] as const;
  return (
    <nav
      aria-label={t("mobileNav")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {links.map(({ href, key, Icon }) => (
        <Link
          key={key}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className={cn(
            "flex min-h-16 flex-col items-center justify-center gap-1 text-[0.65rem] text-muted-foreground",
            path === href && "font-semibold text-foreground",
          )}
        >
          <span
            className={cn(
              "flex h-7 w-11 items-center justify-center rounded-chip",
              key === "sell" && "bg-lime text-ink",
            )}
          >
            <Icon aria-hidden className="size-5" />
          </span>
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
export function SiteFooter() {
  const t = useTranslations("Market");
  return (
    <footer className="mt-20 border-t border-border bg-muted/40 pt-12 pb-24 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[2fr_1fr_1fr] md:px-6 lg:px-8">
        <div>
          <Link href="/" dir="ltr" className="text-3xl font-bold">
            daam.
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footerCopy")}</p>
          <p className="mt-4 text-xs text-muted-foreground">{t("demo")}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2 className="mb-2 font-semibold">{t("explore")}</h2>
          <Link className="py-2 text-sm" href="/phones">
            {t("allPhones")}
          </Link>
          <Link className="py-2 text-sm" href="/brands">
            {t("allBrands")}
          </Link>
          <Link className="py-2 text-sm" href="/lahore/phones">
            {t("cities.lahore")}
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2 className="mb-2 font-semibold">{t("help")}</h2>
          {(
            [
              "pta-guide",
              "safety",
              "about",
              "contact",
              "help",
              "terms",
              "privacy",
              "policies",
              "for-shops",
              "report-stolen",
            ] as const
          ).map((key) => (
            <Link
              key={key}
              href={key === "policies" ? "/policies/listings" : `/${key}`}
              className="inline-flex items-center gap-2 py-1.5 text-sm text-muted-foreground"
            >
              {t(`pages.${key}`)}
              <ArrowUpRight aria-hidden className="size-3" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
