import Image from "next/image";
import { useTranslations } from "next-intl";
import type { PhoneCondition } from "@/lib/domain/condition";
import type { DaamBand } from "@/lib/domain/daam-meter";
import type { NetworkLock, PtaStatus } from "@/lib/domain/pta";
import { formatPKR } from "@/lib/domain/pricing";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { SaveStar } from "./save-star";

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
  /** Only local demonstration fixtures; never set for seller uploads. */
  isDemo?: boolean;
  isFeatured: boolean;
  verification: VerificationKindLike | null;
  isFavorited?: boolean;
  /** Discontinued / out-of-stock: shown with a "Not available" tag and dimmed. */
  unavailable?: boolean;
  /** Daam's own box-packed stock — no chat/bid social proof shown. */
  soldByDaam?: boolean;
}

type VerificationKindLike = "shop" | "id" | string;

interface ListingCardProps {
  listing: ListingCardData;
  /** Request time, kept for API compatibility. */
  now: Date;
  /** Eager-load the image (first row above the fold). */
  priority?: boolean;
  className?: string;
  onFavoriteToggle?: (value: boolean) => void;
  headingLevel?: 2 | 3;
}

/**
 * Listing card — hard-edge editorial spec (Daam Market / Browse .dc.html):
 * placeholder ("Seller's photo") → name → storage → lime price chip →
 * PTA badge + battery → ◉ city · condition. The whole card is one link.
 */
export function ListingCard({
  listing,
  priority = false,
  className,
  onFavoriteToggle,
  headingLevel = 3,
}: ListingCardProps) {
  const t = useTranslations("ListingCard");
  const pta = useTranslations("Pta");
  const condition = useTranslations("Condition");
  const approved = listing.ptaStatus === "pta_approved";
  const Heading = headingLevel === 2 ? "h2" : "h3";
  // Deterministic demo "social proof": how many people chatted / bid on this listing.
  const seed = [...listing.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const chats = listing.unavailable ? 0 : seed % 37;
  const bids = listing.unavailable ? 0 : seed % 11;

  return (
    <article
      data-slot="listing-card"
      className={cn(
        "group relative flex flex-col border-2 border-ink bg-white",
        "transition-transform duration-200 ease-standard hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]",
        "reduced-motion:transition-none reduced-motion:hover:translate-y-0 reduced-motion:hover:shadow-none",
        listing.unavailable && "opacity-70",
        className,
      )}
    >
      <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-[7px] border-b-2 border-ink bg-sand">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.isDemo ? t("illustrativeImage") : listing.modelName}
            fill
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <>
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink/40 text-[20px] text-ink/50">
              ⌁
            </span>
            <span className="text-xs font-semibold text-ink/50">{t("sellerPhoto")}</span>
          </>
        )}
        <SaveStar
          initialSaved={listing.isFavorited}
          onToggle={onFavoriteToggle}
          className="absolute end-[10px] top-[10px]"
        />
        {listing.unavailable ? (
          <span className="absolute start-[10px] top-[10px] border-[1.5px] border-ink bg-danger px-2 py-[3px] text-[11px] font-bold text-danger-ink">
            {t("notAvailable")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-[15px] pt-[14px] pb-4">
        <Heading className="font-display text-xl font-bold tracking-[-0.4px]">
          <Link
            href={listing.href}
            prefetch={false}
            className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {listing.modelName}
          </Link>
        </Heading>
        <div className="mt-0.5 text-[13px] font-semibold text-slate">{listing.variantLabel}</div>
        <div className="mt-[11px]">
          <span className="bg-lime [box-decoration-break:clone] px-[7px] py-[3px] font-display text-[17px] font-bold">
            {formatPKR(listing.pricePkr)}
          </span>
        </div>
        <div className="mt-[10px] flex flex-wrap gap-[6px]">
          <span
            className={cn(
              "border-[1.5px] border-ink px-2 py-[3px] text-[11px] font-bold",
              approved ? "bg-success" : "bg-danger",
            )}
          >
            {pta(`status.${listing.ptaStatus}`)}
          </span>
          {listing.batteryHealth !== null ? (
            <span className="border-[1.5px] border-ink bg-white px-2 py-[3px] text-[11px] font-bold">
              🔋 {listing.batteryHealth}%
            </span>
          ) : null}
        </div>
        <div className="mt-auto flex items-center gap-[7px] border-t-[1.5px] border-ink/[0.18] pt-[11px] text-[12.5px] font-semibold text-slate">
          <span className="min-w-0 truncate">◉ {listing.city}</span>
          <span className="opacity-40">|</span>
          <span className="shrink-0">{condition(listing.condition)}</span>
        </div>
        {listing.unavailable || listing.soldByDaam ? null : (
          <div className="mt-[9px] flex items-center gap-3 text-[12px] font-semibold text-slate">
            <span>💬 {t("chatsCount", { count: chats })}</span>
            <span>🔨 {t("bidsCount", { count: bids })}</span>
          </div>
        )}
      </div>
    </article>
  );
}
