import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * "Featured" tag with the clipped price-tag corner (brand motif, plan §4.5).
 * Never render for CPID listings — check `canBePromoted()` first.
 */
export function FeaturedTag({ className }: { className?: string }) {
  const t = useTranslations("Featured");
  return (
    <span
      data-slot="featured-tag"
      className={cn(
        "inline-flex items-center gap-1 rounded-s-sm bg-lime py-1 ps-2 pe-3.5 text-[0.6875rem] font-semibold tracking-wide text-ink uppercase clip-tag",
        className,
      )}
    >
      <Star aria-hidden className="size-3 fill-current" strokeWidth={2} />
      {t("label")}
    </span>
  );
}
