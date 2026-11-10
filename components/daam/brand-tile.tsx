import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

interface BrandTileProps {
  name: string;
  href: string;
  logoUrl?: string | null;
  /** Active listing count; omit to hide. */
  count?: number;
  className?: string;
}

/** Brand shortcut tile (homepage, /brands). Falls back to a mono monogram until logos exist. */
export function BrandTile({ name, href, logoUrl, count, className }: BrandTileProps) {
  const t = useTranslations("BrandTile");
  return (
    <Link
      href={href}
      data-slot="brand-tile"
      className={cn(
        "group flex min-h-28 flex-col items-center justify-center gap-2 rounded-card border border-border bg-card p-3 text-center outline-none",
        "transition-transform duration-(--duration-base) ease-standard hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring",
        "reduced-motion:transition-none reduced-motion:hover:translate-y-0",
        className,
      )}
    >
      <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-muted">
        {logoUrl ? (
          <Image src={logoUrl} alt="" fill sizes="48px" className="object-contain p-2" />
        ) : (
          <span aria-hidden className="font-mono text-lg font-semibold">
            {name.charAt(0)}
          </span>
        )}
      </span>
      <span className="text-sm font-medium">{name}</span>
      {count !== undefined ? (
        <span className="text-xs text-muted-foreground">{t("listings", { count })}</span>
      ) : null}
    </Link>
  );
}
