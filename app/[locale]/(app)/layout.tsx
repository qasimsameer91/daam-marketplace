import { Suspense, type ReactNode } from "react";
import { MobileNav, SiteHeader } from "@/components/marketplace/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { PreviewProvider } from "@/components/account/preview-provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { pickClientMessages } from "@/lib/i18n/client-messages";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Signed-in area (sell, dashboard, messages): site header + mobile nav, no marketing footer. */
export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider messages={pickClientMessages(await getMessages(), "app")}>
      <PreviewProvider>
        <Suspense>
          <SiteHeader />
        </Suspense>
        <div id="content" tabIndex={-1} className="flex flex-1 flex-col pb-20 outline-none md:pb-0">
          {children}
        </div>
        <Toaster position="top-center" />
        <Suspense>
          <MobileNav />
        </Suspense>
      </PreviewProvider>
    </NextIntlClientProvider>
  );
}
