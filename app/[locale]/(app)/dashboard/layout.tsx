import type { ReactNode } from "react";
import { AccountNav } from "@/components/account/account-nav";
import { PreviewNotice } from "@/components/account/preview-notice";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <PreviewNotice />
      <div className="mt-6 grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <AccountNav />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
