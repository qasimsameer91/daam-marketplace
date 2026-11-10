import { ArrowDownRight, ArrowUpRight, CircleDashed, Equal, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DaamBand } from "@/lib/domain/daam-meter";
import { formatPKR } from "@/lib/domain/pricing";
import { cn } from "@/lib/utils";
import { chipBase, chipSizes, type ChipSize } from "./tone-classes";

/** Great = lime (ink text), Fair = neutral, Above market = slate (plan §10). */
const BAND_STYLE: Record<DaamBand, { className: string; Icon: LucideIcon }> = {
  great: { className: "bg-lime text-ink", Icon: ArrowDownRight },
  fair: { className: "bg-muted text-foreground", Icon: Equal },
  high: { className: "bg-slate text-paper", Icon: ArrowUpRight },
  unknown: {
    className: "border border-dashed border-input text-muted-foreground",
    Icon: CircleDashed,
  },
};

interface DaamMeterProps {
  band: DaamBand;
  size?: ChipSize;
  /** p25–p75 range: "Typical price Rs X – Y" (listing page, sell wizard). */
  range?: { low: number; high: number } | null;
  /** By default "Not enough data" renders nothing (cards); set to show it. */
  showUnknown?: boolean;
  className?: string;
}

/** The Daam Meter chip: is this price fair? Icon + label, never colour alone. */
export function DaamMeter({
  band,
  size = "sm",
  range,
  showUnknown = false,
  className,
}: DaamMeterProps) {
  const t = useTranslations("DaamMeter");
  if (band === "unknown" && !showUnknown) return null;
  const { className: bandClass, Icon } = BAND_STYLE[band];

  const chip = (
    <span
      data-slot="daam-meter"
      data-band={band}
      className={cn(chipBase, chipSizes[size], bandClass, !range && className)}
    >
      <Icon aria-hidden strokeWidth={2} />
      {t(band)}
    </span>
  );

  if (!range) return chip;
  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      {chip}
      <span className="text-xs text-muted-foreground">
        {t("typical")}{" "}
        <bdi dir="ltr" className="font-mono">
          {formatPKR(range.low)} – {formatPKR(range.high)}
        </bdi>
      </span>
    </span>
  );
}
