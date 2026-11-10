import { Smartphone } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { PhoneCondition } from "@/lib/domain/condition";
import type { DaamBand } from "@/lib/domain/daam-meter";
import { canBePromoted, type NetworkLock, type PtaStatus } from "@/lib/domain/pta";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { BatteryPill } from "./battery-pill";
import { ConditionChip } from "./condition-chip";
import { DaamMeter } from "./daam-meter";
import { FavoriteButton } from "./favorite-button";
import { FeaturedTag } from "./featured-tag";
import { PriceTag } from "./price-tag";
import { PtaBadge } from "./pta-badge";
import { VerifiedBadge, type VerificationKind } from "./verified-badge";

/** Public fields a card needs. No phone numbers or IMEI data ever reach this shape. */
export interface ListingCardData {
  id: string;
  href: string;
  /** "iPhone 14 Pro" */
  modelName: string;
  /** "256GB" or "8/256GB" */
  variantLabel: string;
  pricePkr: number;
  daamBand: DaamBand;
  ptaStatus: PtaStatus;
  networkLock: NetworkLock;
  condition: PhoneCondition;
  batteryHealth: number | null;
  city: string;
  area: string | null;
  publishedAt: string;
  imageUrl: string | null;
  isFeatured: boolean;
  verification: VerificationKind | null;
  isFavorited?: boolean;
}

interface ListingCardProps {
  listing: ListingCardData;
  /** Request time, for "2 hours ago" (passed in so pages stay cacheable). */
  now: Date;
  /** Eager-load the image (first row above the fold). */
  priority?: boolean;
  className?: string;
  onFavoriteToggle?: (value: boolean) => void;
  headingLevel?: 2 | 3;
}

/**
 * Listing card (plan §13.3): photo 4:5 → price + Daam Meter → model · variant →
 * PTA · condition · battery → area, city · time · verification. The whole card is one link.
 */
export function ListingCard({
  listing,
  now,
  priority = false,
  className,
  onFavoriteToggle,
  headingLevel = 3,
}: ListingCardProps) {
  const t = useTranslations("ListingCard");
  const format = useFormatter();
  const showFeatured = listing.isFeatured && canBePromoted(listing.ptaStatus);
  const title = `${listing.modelName} · ${listing.variantLabel}`;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      data-slot="listing-card"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-border bg-card text-card-foreground",
        "transition-transform duration-(--duration-base) ease-standard hover:-translate-y-0.5 hover:shadow-lift",
        "reduced-motion:transition-none reduced-motion:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={title}
            fill
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-(--duration-slow) ease-standard group-hover:scale-[1.03] reduced-motion:transition-none reduced-motion:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Smartphone aria-hidden className="size-10" strokeWidth={1.25} />
            <span className="text-xs">{t("noPhoto")}</span>
          </div>
        )}
        {showFeatured ? <FeaturedTag className="absolute start-0 top-2" /> : null}
        <FavoriteButton
          initialFavorited={listing.isFavorited}
          onToggle={onFavoriteToggle}
          className="absolute end-0.5 top-0.5"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <PriceTag amount={listing.pricePkr} short size="md" />
          <DaamMeter band={listing.daamBand} />
        </div>

        <Heading className="line-clamp-1 text-sm font-medium">
          <Link
            href={listing.href}
            prefetch={false}
            className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {title}
          </Link>
        </Heading>

        <div className="flex flex-wrap gap-1.5">
          <PtaBadge
            status={listing.ptaStatus}
            networkLock={listing.networkLock}
            className="h-auto min-h-6 max-w-full py-1 whitespace-normal"
          />
          <ConditionChip
            condition={listing.condition}
            className="h-auto min-h-6 max-w-full py-1 whitespace-normal"
          />
          {listing.batteryHealth !== null ? <BatteryPill health={listing.batteryHealth} /> : null}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">
            {listing.area
              ? t("location", { area: listing.area, city: listing.city })
              : listing.city}
            {" · "}
            <time dateTime={listing.publishedAt}>
              {format.relativeTime(new Date(listing.publishedAt), now)}
            </time>
          </span>
          {listing.verification ? (
            <VerifiedBadge kind={listing.verification} iconOnly className="ms-auto" />
          ) : null}
        </div>
      </div>
    </article>
  );
}
