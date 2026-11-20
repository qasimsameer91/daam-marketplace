"use client";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  UserRound,
  ArrowUpRight,
  Heart,
  Menu,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Market");
  const r = useTranslations("Redesign");
  const home = useTranslations("Home");
  const locale = useLocale();
  const path = usePathname();
  const links = [
    ["/phones", t("allPhones")],
    ["/phones/box-packed", t("newMobiles")],
    ["/sell", t("sell")],
    ["/brands", t("allBrands")],
    ["/pta-guide", t("pages.pta-guide")],
  ] as const;
  return (
    <>
      <div className="bg-sand px-4 py-2 text-center text-[0.65rem] tracking-wide text-muted-foreground sm:text-xs">
        {r("announcement")}
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {t("skipToContent")}
        </a>
        <div className="mx-auto flex min-h-20 max-w-[1380px] items-center gap-4 px-5 md:px-8 lg:px-10">
          <Link
            href="/"
            aria-label={`DAAM ${t("home")}`}
            dir="ltr"
            className="inline-flex shrink-0 items-center gap-[2px] font-display text-[1.9rem] leading-none font-extrabold tracking-[-0.04em]"
          >
            <span>[</span>
            <span className="px-[2px] text-[0.5em] tracking-[0.12em]">DAAM</span>
            <span>]</span>
          </Link>
          <nav
            aria-label={t("explore")}
            className="mx-auto hidden items-center gap-7 text-sm lg:flex"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                aria-current={path === href ? "page" : undefined}
                className="nav-editorial-link min-h-11 content-center"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" className="px-2 text-xs">
              <Link href={path} locale={locale === "en" ? "ur" : "en"}>
                {home("switchLanguage")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="hidden rounded-full border-border bg-surface md:inline-flex"
            >
              <Link href="/phones" aria-label={t("search")}>
                <Search aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="hidden rounded-full border-border bg-surface md:inline-flex"
            >
              <Link href="/dashboard/favorites" prefetch={false} aria-label={r("favorites")}>
                <Heart aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hidden xl:inline-flex">
              <Link href="/messages" prefetch={false} aria-label={t("messages")}>
                <MessageCircle aria-hidden />
              </Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/sell" prefetch={false}>
                <Plus aria-hidden />
                {r("postListing")}
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={r("menu")} className="lg:hidden">
                  <Menu aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side={locale === "ur" ? "left" : "right"} className="bg-background">
                <SheetHeader>
                  <SheetTitle>{r("menu")}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 p-5">
                  {[
                    ...links,
                    ["/messages", t("messages")],
                    ["/notifications", r("notifications")],
                    ["/dashboard", t("account")],
                    ["/login", t("login")],
                  ].map(([href, label]) => (
                    <SheetClose asChild key={href}>
                      <Link
                        className="flex min-h-12 items-center justify-between rounded-xl border-b border-border px-3 text-lg"
                        href={href!}
                        prefetch={false}
                      >
                        {label}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Button asChild variant="ghost" size="icon" className="hidden lg:inline-flex">
              <Link href="/login" prefetch={false} aria-label={t("login")}>
                <UserRound aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </>
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
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      {links.map(({ href, key, Icon }) => {
        const active = path === href || (href !== "/" && path.startsWith(`${href}/`));
        return (
          <Link
            key={key}
            href={href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-[0.65rem] text-muted-foreground",
              active && "font-semibold text-foreground",
            )}
          >
            <span
              className={cn(
                "grid h-7 w-11 place-items-center rounded-full",
                key === "sell" && "bg-primary text-primary-foreground",
                active && key !== "sell" && "bg-sand",
              )}
            >
              <Icon aria-hidden className="size-[19px]" strokeWidth={1.6} />
            </span>
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteFooter() {
  const t = useTranslations("Market");
  const r = useTranslations("Redesign");
  const shops = useTranslations("Shops");
  return (
    <footer className="mt-20 border-t border-border bg-sand/60 pt-12 pb-24 md:pt-16 md:pb-8">
      <div className="mx-auto max-w-[1380px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              dir="ltr"
              className="inline-flex items-center gap-[2px] font-display text-3xl font-extrabold tracking-[-0.04em]"
            >
              <span>[</span>
              <span className="px-[2px] text-[0.5em] tracking-[0.12em]">DAAM</span>
              <span>]</span>
            </Link>
            <p className="mt-5 max-w-sm text-xl leading-relaxed tracking-tight">
              {r("footerTitle")}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footerCopy")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="mb-3 text-xs font-semibold tracking-widest text-clay-ink uppercase">
              {t("explore")}
            </h2>
            {[
              ["/phones", t("allPhones")],
              ["/brands", t("allBrands")],
              ["/shops", shops("title")],
              ["/sell", t("sell")],
              ["/dashboard/favorites", r("favorites")],
            ].map(([href, label]) => (
              <Link
                key={href}
                className="min-h-11 content-center text-sm hover:underline"
                href={href!}
              >
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold tracking-widest text-clay-ink uppercase">
              {t("help")}
            </h2>
            <div className="grid grid-cols-2 gap-x-3">
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
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {t(`pages.${key}`)}
                  <ArrowUpRight aria-hidden className="size-3 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span dir="ltr">[ DAAM ] · {r("madeForPakistan")}</span>
          <span className="max-w-lg">{t("demo")}</span>
        </div>
      </div>
    </footer>
  );
}
