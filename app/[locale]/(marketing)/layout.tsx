import { Suspense, type ReactNode } from "react";
import { SiteHeader, MobileNav, SiteFooter } from "@/components/marketplace/site-shell";
import { NuqsAdapter } from "nuqs/adapters/next/app";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <Suspense>
        <SiteHeader />
      </Suspense>
      {children}
      <SiteFooter />
      <Suspense>
        <MobileNav />
      </Suspense>
    </NuqsAdapter>
  );
}
