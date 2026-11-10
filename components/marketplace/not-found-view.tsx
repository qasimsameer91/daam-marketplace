import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

/** Localized 404 body (plan §15 #31). */
export function NotFoundView() {
  const t = useTranslations("NotFound");
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16">
      <p aria-hidden className="mb-2 font-mono text-6xl font-semibold tracking-display">
        404
      </p>
      <EmptyState
        icon={SearchX}
        title={t("title")}
        description={t("body")}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/phones">{t("browse")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{t("home")}</Link>
            </Button>
          </div>
        }
      />
    </main>
  );
}
