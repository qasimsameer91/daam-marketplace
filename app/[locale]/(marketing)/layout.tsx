import { Suspense, type ReactNode } from "react";
import { SiteHeader, MobileNav, SiteFooter } from "@/components/marketplace/site-shell";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <Suspense>
        <SiteHeader />
      </Suspense>
      <div id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </div>
      <SiteFooter />
      <Toaster position="top-center" />
      <Suspense>
        <MobileNav />
      </Suspense>
    </NuqsAdapter>
  );
}
