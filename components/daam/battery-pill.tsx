import { BatteryFull, BatteryLow, BatteryMedium } from "lucide-react";
import { useTranslations } from "next-intl";
import { batteryTone } from "@/lib/domain/condition";
import { cn } from "@/lib/utils";
import { chipBase, chipSizes, toneClasses, type ChipSize } from "./tone-classes";

/** Battery health %, mono. The icon shows the level too, so it's never colour alone. */
export function BatteryPill({
  health,
  size = "sm",
  className,
}: {
  health: number;
  size?: ChipSize;
  className?: string;
}) {
  const t = useTranslations("Battery");
  const tone = batteryTone(health);
  const Icon = tone === "success" ? BatteryFull : tone === "neutral" ? BatteryMedium : BatteryLow;
  const label = t("label", { health });

  return (
    <span
      data-slot="battery-pill"
      title={label}
      className={cn(
        chipBase,
        chipSizes[size],
        tone === "warning" ? toneClasses.warning : "bg-muted text-foreground",
        className,
      )}
    >
      <Icon aria-hidden strokeWidth={1.75} />
      <span className="sr-only">{label}</span>
      <bdi aria-hidden dir="ltr" className="font-mono">
        {health}%
      </bdi>
    </span>
  );
}
