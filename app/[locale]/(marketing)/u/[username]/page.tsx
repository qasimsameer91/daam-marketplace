import { Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { ListingGrid } from "@/components/listing/listing-grid";
import { ReviewList } from "@/components/listing/review-list";
import { initials } from "@/components/listing/seller-card";
import { StarRating } from "@/components/listing/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cities, listingsBySeller } from "@/lib/mock/marketplace";
import { findProfile, reviewsFor } from "@/lib/mock/people";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  const profile = findProfile(decodeURIComponent(username));
  return profile ? { title: `${profile.displayName} | Daam` } : {};
}

export default async function ProfilePage({ params }: PageProps<"/[locale]/u/[username]">) {
  const { username } = await params;
  const profile = findProfile(decodeURIComponent(username));
  // Shops have a storefront instead of a personal profile.
  if (!profile || profile.accountType === "shop") notFound();

  const [t, listing, market, format] = await Promise.all([
    getTranslations("Profile"),
    getTranslations("Listing"),
    getTranslations("Market"),
    getFormatter(),
  ]);
  const city = cities.find((c) => c === profile.citySlug);
  const items = listingsBySeller(profile.username);
  const replyTime =
    profile.responseMinutes < 60
      ? listing("minutes", { count: profile.responseMinutes })
      : listing("hours", { count: Math.round(profile.responseMinutes / 60) });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center">
        <Avatar className="size-20">
          <AvatarFallback className="bg-muted font-mono text-xl font-semibold">
            {initials(profile.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-display">{profile.displayName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t("individual")}</span>
            {profile.idVerified ? <VerifiedBadge kind="id" /> : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {profile.ratingCount > 0 ? (
              <StarRating rating={profile.ratingAvg} className="text-foreground" />
            ) : null}
            <span>{listing("reviewsCount", { count: profile.ratingCount })}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-4" />
              {city ? market(`cities.${city}`) : profile.citySlug} ·{" "}
              {listing("memberSince", {
                date: format.dateTime(new Date(profile.memberSince), {
                  month: "short",
                  year: "numeric",
                }),
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-4" />
              {listing("replies", { time: replyTime })}
            </span>
          </div>
          {profile.bio ? <p className="max-w-2xl text-sm">{profile.bio}</p> : null}
        </div>
      </header>

      <section aria-labelledby="listings-title" className="mt-10">
        <h2 id="listings-title" className="mb-5 text-xl font-semibold">
          {t("listings")}
        </h2>
        <ListingGrid listings={items} />
      </section>

      <section aria-labelledby="reviews-title" className="mt-12 max-w-3xl">
        <h2 id="reviews-title" className="mb-5 text-xl font-semibold">
          {t("reviews")}
        </h2>
        <ReviewList reviews={reviewsFor(profile.username)} />
      </section>
    </main>
  );
}
