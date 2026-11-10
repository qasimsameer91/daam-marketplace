import { MessageSquareQuote, ShieldCheck } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { ptaCheckLabel, type PtaCheckSource } from "@/lib/domain/pta";
import { cn } from "@/lib/utils";

interface PtaCheckLabelProps {
  source: PtaCheckSource;
  checkedAt: Date | string | null;
  /** Pass the request time; "Checked by Daam" expires after 30 days. */
  now: Date;
  className?: string;
}

/**
 * "Seller says" vs "PTA status checked by Daam on 12 Nov 2026" (plan §6.3.4–5).
 * Never claims a check that a moderator hasn't done on PTA DVS.
 */
export function PtaCheckLabel({ source, checkedAt, now, className }: PtaCheckLabelProps) {
  const t = useTranslations("Pta.check");
  const format = useFormatter();
  const label = ptaCheckLabel({ source, checkedAt, now });

  if (label.kind === "daam_checked") {
    return (
      <span
        data-slot="pta-check-label"
        data-kind="daam_checked"
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium text-foreground",
          className,
        )}
      >
        <ShieldCheck aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        {t("daamCheckedOn", {
          date: format.dateTime(label.checkedAt, {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        })}
      </span>
    );
  }

  return (
    <span
      data-slot="pta-check-label"
      data-kind="seller_says"
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}
    >
      <MessageSquareQuote aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
      {t("sellerSays")}
    </span>
  );
}
