"use client";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { usePreviewAccount } from "./preview-provider";
import { PreviewNotice } from "./preview-notice";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { listings } from "@/lib/mock/marketplace";
export function Notifications() {
  const t = useTranslations("Notifications");
  const shell = useTranslations("Shell");
  const { readNotifications, setReadNotifications } = usePreviewAccount();
  const notes = [
    { text: t("types.new_message", { name: "Hafeez Mobile Hub" }), href: "/messages/hafeez" },
    {
      text: t("types.listing_approved", { title: listings[0]!.modelName }),
      href: listings[0]!.href,
    },
    {
      text: t("types.listing_expiring", { title: listings[1]!.modelName, days: 3 }),
      href: "/dashboard/listings",
    },
  ];
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <PreviewNotice />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <Button
          variant="outline"
          disabled={readNotifications}
          onClick={() => setReadNotifications(true)}
        >
          {t("markAll")}
        </Button>
      </div>
      {readNotifications && (
        <p role="status" className="text-sm text-muted-foreground">
          {t("empty")} · {shell("localOnly")}
        </p>
      )}
      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note.href} className="rounded-card border border-border bg-card p-4">
            <Link href={note.href} className="flex min-h-11 items-start gap-3">
              <Bell aria-hidden className="mt-1 size-5 shrink-0" />
              <div>
                <p className="text-sm">{note.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {shell("sampleNotification")}
                  {!readNotifications && ` · ${t("unread")}`}
                </p>
              </div>
              {!readNotifications && (
                <span aria-hidden className="ms-auto mt-2 size-2 shrink-0 rounded-full bg-info" />
              )}
            </Link>
          </li>
        ))}
      </ul>
      <Button asChild variant="ghost">
        <Link href="/dashboard">{shell("openDashboard")}</Link>
      </Button>
    </main>
  );
}
