import { useTranslations } from "next-intl";
import { formatPKR, formatPKRShort } from "@/lib/domain/pricing";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-3xl tracking-display",
} as const;

interface PriceTagProps {
  amount: number;
  size?: keyof typeof sizes;
  /** `Rs 1.25 lac` instead of `Rs 125,000` (cards). */
  short?: boolean;
  /** Shows "Negotiable" / "Fixed price" under the amount. */
  negotiable?: boolean;
  /** `tag`: lime price tag with the clipped-corner brand motif. */
  variant?: "plain" | "tag";
  className?: string;
}

/** Price in Geist Mono (plan §4.4). Always formatted with formatPKR / formatPKRShort. */
export function PriceTag({
  amount,
  size = "md",
  short = false,
  negotiable,
  variant = "plain",
  className,
}: PriceTagProps) {
  const t = useTranslations("Price");
  const text = short ? formatPKRShort(amount) : formatPKR(amount);
  const fullText = formatPKR(amount);

  const value = (
    <bdi
      dir="ltr"
      title={short ? fullText : undefined}
      className={cn("font-sans font-bold tracking-tight tabular-nums", sizes[size])}
    >
      {text}
    </bdi>
  );

  if (variant === "tag") {
    return (
      <span
        data-slot="price-tag"
        className={cn(
          "inline-flex items-center gap-2 rounded-s-md bg-lime py-1.5 ps-3 pe-5 text-ink clip-tag",
          className,
        )}
      >
        {value}
        <span aria-hidden className="size-1.5 rounded-full bg-ink/80" />
      </span>
    );
  }

  return (
    <span data-slot="price-tag" className={cn("inline-flex flex-col text-foreground", className)}>
      {value}
      {negotiable !== undefined ? (
        <span className="text-xs text-muted-foreground">
          {negotiable ? t("negotiable") : t("fixed")}
        </span>
      ) : null}
    </span>
  );
}
