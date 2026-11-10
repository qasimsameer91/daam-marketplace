import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Five stars + the numeric rating in mono. The number is always shown, so it's not visual-only. */
export function StarRating({ rating, className }: { rating: number; className?: string }) {
  const t = useTranslations("Listing");
  const filled = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span aria-hidden className="inline-flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn("size-3.5", i < filled ? "fill-current" : "opacity-35")}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="sr-only">{t("rating", { rating: rating.toFixed(1) })}</span>
      <span aria-hidden className="font-mono text-sm font-semibold">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
