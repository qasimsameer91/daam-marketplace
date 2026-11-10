import { Award, BadgeCheck, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { chipBase, chipSizes, type ChipSize } from "./tone-classes";

export type VerificationKind = "id" | "shop" | "trusted" | "founding";

const KIND_STYLE: Record<VerificationKind, { className: string; Icon: LucideIcon }> = {
  id: { className: "border border-input text-foreground", Icon: BadgeCheck },
  shop: { className: "bg-secondary text-secondary-foreground", Icon: Store },
  trusted: { className: "bg-secondary text-secondary-foreground", Icon: ShieldCheck },
  founding: { className: "bg-lime text-ink", Icon: Award },
};

/**
 * Verification badge (plan §3). Earned through checks only; never purchasable.
 * `iconOnly` keeps the label for screen readers and as a tooltip title.
 */
export function VerifiedBadge({
  kind,
  size = "sm",
  iconOnly = false,
  className,
}: {
  kind: VerificationKind;
  size?: ChipSize;
  iconOnly?: boolean;
  className?: string;
}) {
  const t = useTranslations("Verified");
  const { className: kindClass, Icon } = KIND_STYLE[kind];
  const label = t(kind);

  return (
    <span
      data-slot="verified-badge"
      data-kind={kind}
      title={label}
      className={cn(
        chipBase,
        chipSizes[size],
        kindClass,
        iconOnly && "aspect-square justify-center px-0",
        className,
      )}
    >
      <Icon aria-hidden strokeWidth={1.75} />
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </span>
  );
}
