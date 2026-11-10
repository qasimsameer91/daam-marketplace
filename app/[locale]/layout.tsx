import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { AppProviders } from "@/components/providers/app-providers";
import { pickClientMessages } from "@/lib/i18n/client-messages";
import { getDirection, isAppLocale, locales } from "@/lib/i18n/routing";
import { brandColors } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Urdu only: not preloaded, and its variable is attached only on /ur, so English pages never download it.
const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  preload: false,
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brandColors.paper },
    { media: "(prefers-color-scheme: dark)", color: brandColors.night },
  ],
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!isAppLocale(locale)) notFound();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      // theme-init.js may set data-theme before hydration.
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        locale === "ur" && notoNastaliq.variable,
        "h-full antialiased",
      )}
    >
      <head>
        {/* Render-blocking on purpose: applies the saved theme before first paint (no flash). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={pickClientMessages(await getMessages())}>
          <AppProviders dir={dir}>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
