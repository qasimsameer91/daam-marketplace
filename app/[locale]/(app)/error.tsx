"use client";
import { useTranslations } from "next-intl";
import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("Empty.error");
  const c = useTranslations("Common");
  return (
    <main>
      <EmptyState
        icon={TriangleAlert}
        variant="error"
        title={t("title")}
        description={t("body")}
        action={<Button onClick={reset}>{c("retry")}</Button>}
      />
    </main>
  );
}
