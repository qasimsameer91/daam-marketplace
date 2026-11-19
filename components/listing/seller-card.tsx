import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import type { MockProfile, MockShop } from "@/lib/mock/people";
import { cn } from "@/lib/utils";
import { SellerSafetyActions } from "./seller-safety-actions";
import { StarRating } from "./star-rating";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

interface SellerCardProps {
  profile: MockProfile;
  shop: MockShop | null;
  cityName: string;
  className?: string;
}

/** Seller summary on the listing page: badges, rating, member since, typical reply time. No phone number. */
export function SellerCard({ profile, shop, cityName, className }: SellerCardProps) {
  const t = useTranslations("Listing");
  const format = useFormatter();
  const name = shop?.name ?? profile.displayName;
  const href = shop ? `/shop/${shop.slug}` : `/u/${profile.username}`;
  const rating = shop?.ratingAvg ?? profile.ratingAvg;
  const ratingCount = shop?.ratingCount ?? profile.ratingCount;
  const replyTime =
    profile.responseMinutes < 60
      ? t("minutes", { count: profile.responseMinutes })
      : t("hours", { count: Math.round(profile.responseMinutes / 60) });

  return (
    <section
      aria-labelledby="seller-title"
      className={cn("flex flex-col gap-4 rounded-card border border-border p-4", className)}
    >
      <h2 id="seller-title" className="text-sm font-semibold">
        {t("seller")}
      </h2>
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-muted font-mono text-sm font-semibold">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate font-semibold">{name}</p>
          <div className="flex flex-wrap gap-1.5">
            {shop && shop.tier !== "none" ? (
              <VerifiedBadge kind={shop.tier === "trusted" ? "trusted" : "shop"} />
            ) : null}
            {shop?.isFounding ? <VerifiedBadge kind="founding" /> : null}
            {!shop && profile.idVerified ? <VerifiedBadge kind="id" /> : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p className="flex flex-wrap items-center gap-2">
          {ratingCount > 0 ? <StarRating rating={rating} className="text-foreground" /> : null}
          <span>{t("reviewsCount", { count: ratingCount })}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin aria-hidden className="size-4 shrink-0" />
          {cityName} ·{" "}
          {t("memberSince", {
            date: format.dateTime(new Date(profile.memberSince), {
              month: "short",
              year: "numeric",
            }),
          })}
        </p>
        <p className="flex items-center gap-2">
          <Clock aria-hidden className="size-4 shrink-0" />
          {t("replies", { time: replyTime })}
        </p>
      </div>

      <Button asChild variant="outline">
        <Link href={href}>
          {shop ? t("viewShop") : t("viewProfile")}
          <ArrowUpRight aria-hidden />
        </Link>
      </Button>

      <SellerSafetyActions sellerName={name} />
    </section>
  );
}
