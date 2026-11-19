"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Smartphone } from "lucide-react";
import { usePreviewAccount, type PreviewStatus } from "./preview-provider";
import { listings } from "@/lib/mock/marketplace";
import { PriceTag } from "@/components/daam/price-tag";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const statuses: PreviewStatus[] = ["active", "pending", "drafts", "sold", "expired"];
export function MyListings() {
  const t = useTranslations("Dashboard.listings");
  const shell = useTranslations("Shell");
  const { owned, setOwned } = usePreviewAccount();
  const [status, setStatus] = useState<PreviewStatus>("active");
  const [notice, setNotice] = useState(false);
  const rows = owned.filter((l) => l.status === status);
  const change = (id: string, next: PreviewStatus | null) => {
    setOwned((old) =>
      next
        ? old.map((l) => (l.id === id ? { ...l, status: next } : l))
        : old.filter((l) => l.id !== id),
    );
    setNotice(true);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as PreviewStatus);
          setNotice(false);
        }}
      >
        <div className="pb-2">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {statuses.map((s) => (
              <TabsTrigger key={s} value={s} className="flex-none">
                {t(`tabs.${s}`)} ({owned.filter((l) => l.status === s).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={status} className="space-y-6">
          {notice && (
            <p role="status" className="rounded-card bg-muted p-3 text-sm">
              {shell("localChange")}
            </p>
          )}
          {rows.length === 0 ? (
            <EmptyState
              icon={Smartphone}
              title={t(`empty.${status}`)}
              description={t("emptyBody")}
              action={
                <Button asChild>
                  <Link href="/sell">{shell("tryWizard")}</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {rows.map((row) => {
                const l = listings.find((l) => l.id === row.id)!;
                return (
                  <article
                    key={row.id}
                    className="space-y-4 rounded-card border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={l.href}
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        {l.modelName} · {l.variantLabel}
                      </Link>
                      <PriceTag amount={l.pricePkr} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("stats", { views: l.detail.viewCount, saves: 4 })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline">
                        <Link href="/sell">{shell("newPreview")}</Link>
                      </Button>
                      {status === "active" && (
                        <Button variant="outline" onClick={() => change(row.id, "sold")}>
                          {t("markSold")}
                        </Button>
                      )}
                      {status === "expired" && (
                        <Button variant="outline" onClick={() => change(row.id, "active")}>
                          {t("renew")}
                        </Button>
                      )}
                      <Button variant="ghost" onClick={() => change(row.id, null)}>
                        {shell("removeSample")}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
