import { FileWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaticPageProps {
  title: string;
  intro?: string;
  /** Marks legal copy as a draft pending lawyer review (plan §24). */
  legalDraft?: boolean;
  wide?: boolean;
  children: ReactNode;
}

/** Shared frame for info pages: title, intro and a readable column. */
export function StaticPage({
  title,
  intro,
  legalDraft = false,
  wide = false,
  children,
}: StaticPageProps) {
  const t = useTranslations("Pages");
  return (
    <main
      className={cn(
        "mx-auto w-full px-4 py-10 md:px-6 md:py-14 lg:px-8",
        wide ? "max-w-6xl" : "max-w-3xl",
      )}
    >
      <header className="mb-8 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-display md:text-4xl">{title}</h1>
        {intro ? <p className="text-lg text-muted-foreground">{intro}</p> : null}
        {legalDraft ? (
          <p className="flex items-center gap-2 rounded-button bg-warning px-3 py-2 text-sm text-ink">
            <FileWarning aria-hidden className="size-4 shrink-0" />
            {t("legalDraft")}
          </p>
        ) : null}
      </header>
      <div className="flex flex-col gap-10">{children}</div>
    </main>
  );
}

/** A titled section inside a static page. */
export function PageSection({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="text-xl font-semibold tracking-display">
        {title}
      </h2>
      {children}
    </section>
  );
}
