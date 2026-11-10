import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Loading placeholder shaped exactly like ListingCard (no layout shift when data arrives). */
export function ListingCardSkeleton({ className }: { className?: string }) {
  const t = useTranslations("Common");
  return (
    <div
      data-slot="listing-card-skeleton"
      role="status"
      aria-label={t("loading")}
      className={cn(
        "flex flex-col overflow-hidden rounded-card border border-border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20 rounded-chip" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-20 rounded-chip" />
          <Skeleton className="h-6 w-12 rounded-chip" />
          <Skeleton className="h-6 w-12 rounded-chip" />
        </div>
        <Skeleton className="mt-1 h-3 w-2/3" />
      </div>
    </div>
  );
}
