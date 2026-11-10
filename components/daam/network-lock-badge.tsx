import { useTranslations } from "next-intl";
import { NETWORK_LOCK_META, type NetworkLock } from "@/lib/domain/pta";
import { cn } from "@/lib/utils";
import { StatusIcon } from "./status-icon";
import { chipBase, chipSizes, toneClasses, type ChipSize } from "./tone-classes";

/** Network lock on its own (plan §6.2). */
export function NetworkLockBadge({
  lock,
  size = "sm",
  className,
}: {
  lock: NetworkLock;
  size?: ChipSize;
  className?: string;
}) {
  const t = useTranslations("Pta");
  const meta = NETWORK_LOCK_META[lock];
  return (
    <span
      data-slot="network-lock-badge"
      data-lock={lock}
      className={cn(chipBase, chipSizes[size], toneClasses[meta.tone], className)}
    >
      <StatusIcon icon={meta.icon} />
      {t(`lock.${lock}`)}
    </span>
  );
}
