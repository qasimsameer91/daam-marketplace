import { useTranslations } from "next-intl";
import { combinedPtaBadge, type NetworkLock, type PtaStatus } from "@/lib/domain/pta";
import { cn } from "@/lib/utils";
import { StatusIcon } from "./status-icon";
import { chipBase, chipSizes, toneClasses, type ChipSize } from "./tone-classes";

interface PtaBadgeProps {
  status: PtaStatus;
  /** Shown as a suffix ("Non-PTA · JV"); omitted when unknown. */
  networkLock?: NetworkLock;
  size?: ChipSize;
  /** Adds "NOT PTA approved" to CPID badges (listing page). */
  detailed?: boolean;
  className?: string;
}

/** Combined PTA + network badge (plan §6.3.3). Icon + label, never colour alone. */
export function PtaBadge({
  status,
  networkLock = "unknown",
  size = "sm",
  detailed = false,
  className,
}: PtaBadgeProps) {
  const t = useTranslations("Pta");
  const badge = combinedPtaBadge(status, networkLock);
  const statusLabel = t(`status.${status}`);
  const cpidSuffix = detailed && status === "cpid_patched" ? t("cpidNotApproved") : null;
  const lockLabel = badge.lock ? t(`lock.${badge.lock}`) : null;
  const fullLabel = [statusLabel, cpidSuffix, lockLabel].filter(Boolean).join(" · ");

  return (
    <span
      data-slot="pta-badge"
      data-status={status}
      title={fullLabel}
      className={cn(chipBase, chipSizes[size], toneClasses[badge.tone], className)}
    >
      <StatusIcon icon={badge.icon} />
      <span className="sr-only">{fullLabel}</span>
      <span aria-hidden>
        {statusLabel}
        {cpidSuffix ? `: ${cpidSuffix}` : null}
        {badge.lock ? <span className="font-mono"> · {t(`lockShort.${badge.lock}`)}</span> : null}
      </span>
    </span>
  );
}
