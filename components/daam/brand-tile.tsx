import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface BrandTileProps {
  name: string;
  href: string;
  logoUrl?: string | null;
  /** Active listing count; omit to hide. */
  count?: number;
  className?: string;
}

/** Brand shortcut tile; the name stays legible when an official logo is unavailable. */
export function BrandTile({ name, href, logoUrl, count, className }: BrandTileProps) {
  const t = useTranslations("BrandTile");
  const identity = {
    Apple: { mark: "a", color: "bg-pearl", copy: "apple" },
    Samsung: { mark: "S", color: "bg-info/5", copy: "samsung" },
    "Google Pixel": { mark: "G", color: "bg-success/5", copy: "google" },
    OnePlus: { mark: "1+", color: "bg-clay/10", copy: "oneplus" },
    Xiaomi: { mark: "mi", color: "bg-warning/5", copy: "xiaomi" },
  }[name] ?? {
    mark: name === "All brands" ? "↗" : name.charAt(0),
    color: "bg-sand/70",
    copy: "other",
  };
  return (
    <Link
      href={href}
      data-slot="brand-tile"
      className={cn(
        "group relative flex min-h-36 flex-col items-start justify-between gap-2 overflow-hidden rounded-card border border-border/60 p-5 text-start outline-none",
        identity.color,
        "transition-transform duration-(--duration-base) ease-standard hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-ring",
        "reduced-motion:transition-none reduced-motion:hover:translate-y-0",
        className,
      )}
    >
      <span className="flex w-full items-start justify-between gap-3">
        {logoUrl ? (
          <span className="relative block h-8 w-20">
            <Image
              src={logoUrl}
              alt=""
              fill
              sizes="80px"
              className="object-contain object-left rtl:object-right"
            />
          </span>
        ) : (
          <span className="text-sm font-semibold tracking-tight">{name}</span>
        )}
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-90"
        />
      </span>
      {logoUrl ? <span className="text-sm font-semibold">{name}</span> : null}
      <span className="z-10 max-w-32 text-xs leading-relaxed text-muted-foreground">
        {t(`descriptions.${identity.copy as "apple"}`)}
      </span>
      <span
        aria-hidden
        dir="ltr"
        className="pointer-events-none absolute -end-1 -bottom-7 text-[6rem] leading-none font-bold tracking-[-0.08em] text-foreground/10 transition-transform duration-300 group-hover:-translate-y-2 reduced-motion:transition-none"
      >
        {identity.mark}
      </span>
      {count !== undefined ? (
        <span className="-mt-3 text-xs text-muted-foreground">{t("listings", { count })}</span>
      ) : null}
    </Link>
  );
}
