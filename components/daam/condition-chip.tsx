import { useTranslations } from "next-intl";
import { conditionScore, type PhoneCondition } from "@/lib/domain/condition";
import { cn } from "@/lib/utils";
import { chipBase, chipSizes, type ChipSize } from "./tone-classes";

/** Condition grade chip (plan §7.1). Numeric grades render in Geist Mono. */
export function ConditionChip({
  condition,
  size = "sm",
  className,
}: {
  condition: PhoneCondition;
  size?: ChipSize;
  className?: string;
}) {
  const t = useTranslations("Condition");
  const label = t(condition);
  const score = conditionScore(condition);
  const labelIsScore = score === label;

  return (
    <span
      data-slot="condition-chip"
      data-condition={condition}
      className={cn(chipBase, chipSizes[size], "bg-muted text-foreground", className)}
    >
      {labelIsScore ? (
        <bdi dir="ltr" className="font-mono">
          {label}
        </bdi>
      ) : (
        label
      )}
      {score && !labelIsScore ? (
        <bdi dir="ltr" className="font-mono text-muted-foreground">
          {score}
        </bdi>
      ) : null}
    </span>
  );
}
