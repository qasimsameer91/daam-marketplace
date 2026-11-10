import { MessageSquareText } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { EmptyState } from "@/components/daam/empty-state";
import type { MockReview } from "@/lib/mock/people";
import { StarRating } from "./star-rating";

/** Reviews from confirmed Daam sales only (plan §11). Comments are plain text. */
export function ReviewList({ reviews }: { reviews: MockReview[] }) {
  const t = useTranslations("Profile");
  const format = useFormatter();

  if (reviews.length === 0) {
    return (
      <EmptyState icon={MessageSquareText} title={t("noReviews")} description={t("reviewsNote")} />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{t("reviewsNote")}</p>
      <ul className="flex flex-col gap-3">
        {reviews.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 rounded-card border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{r.reviewerName}</span>
              <time dateTime={r.createdAt} className="text-xs text-muted-foreground">
                {format.dateTime(new Date(r.createdAt), {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
            <StarRating rating={r.rating} />
            <p className="text-sm">{r.comment}</p>
            {r.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {r.tags.map((tag) => (
                  <li key={tag} className="rounded-chip bg-muted px-2.5 py-1 text-xs">
                    {t(`tags.${tag}`)}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
