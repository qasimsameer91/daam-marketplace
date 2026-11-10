"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

/** 500 for errors thrown by layouts below the locale root (keeps translations available). */
export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("Empty.error");
  const common = useTranslations("Common");
  const nf = useTranslations("NotFound");
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16">
      <EmptyState
        icon={TriangleAlert}
        title={t("title")}
        description={t("body")}
        variant="error"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>{common("retry")}</Button>
            <Button asChild variant="outline">
              <Link href="/">{nf("home")}</Link>
            </Button>
          </div>
        }
      />
    </main>
  );
}
