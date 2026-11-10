import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { PtaBadge } from "@/components/daam/pta-badge";
import { PtaCheckLabel } from "@/components/daam/pta-check-label";
import type { NetworkLock, PtaCheckSource, PtaRegType, PtaStatus } from "@/lib/domain/pta";

interface PtaSectionProps {
  status: PtaStatus;
  lock: NetworkLock;
  regType: PtaRegType | null;
  checkSource: PtaCheckSource;
  checkedAt: string | null;
  now: Date;
  /** content_blocks copy, keyed like `pta_status.non_pta`. */
  copy: Map<string, string>;
}

/**
 * PTA & network block on the listing page: combined badge, "Seller says" / "Checked by Daam",
 * and a native disclosure with the explainer copy (works without JavaScript).
 */
export function PtaSection({
  status,
  lock,
  regType,
  checkSource,
  checkedAt,
  now,
  copy,
}: PtaSectionProps) {
  const t = useTranslations("Listing");
  const spec = useTranslations("Spec");
  return (
    <section
      aria-labelledby="pta-title"
      className="flex flex-col gap-3 rounded-card border border-border p-4"
    >
      <h2 id="pta-title" className="text-sm font-semibold">
        {t("ptaTitle")}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <PtaBadge status={status} networkLock={lock} size="md" detailed />
      </div>
      <PtaCheckLabel source={checkSource} checkedAt={checkedAt} now={now} />
      {status === "pta_approved" && regType ? (
        <p className="text-sm text-muted-foreground">
          {t("regType")}:{" "}
          <span className="text-foreground">{spec(`regTypeValues.${regType}`)}</span>
        </p>
      ) : null}
      <details className="group rounded-button bg-muted/60 px-3 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium">
          {t("explain")}
          <ChevronDown
            aria-hidden
            className="size-4 transition-transform duration-(--duration-base) group-open:rotate-180 reduced-motion:transition-none"
          />
        </summary>
        <div className="flex flex-col gap-2 pb-3 text-sm text-muted-foreground">
          <p>{copy.get(`pta_status.${status}`)}</p>
          {lock !== "unknown" ? <p>{copy.get(`network_lock.${lock}`)}</p> : null}
        </div>
      </details>
    </section>
  );
}
