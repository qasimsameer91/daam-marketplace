"use client";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { usePreviewAccount } from "./preview-provider";
import { listings, mockNow } from "@/lib/mock/marketplace";
import { ListingCard } from "@/components/daam/listing-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/daam/empty-state";
import { Link } from "@/lib/i18n/navigation";
export function Favorites() {
  const t = useTranslations("Dashboard.favorites");
  const empty = useTranslations("Empty.favorites");
  const shell = useTranslations("Shell");
  const { favorites, setFavorites } = usePreviewAccount();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      {favorites.length ? (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {favorites.map((id) => {
            const l = listings.find((l) => l.id === id)!;
            return (
              <div key={id} className="min-w-0 space-y-2">
                <ListingCard
                  headingLevel={2}
                  listing={{ ...l, isFavorited: true }}
                  now={mockNow}
                  onFavoriteToggle={(next) => {
                    if (!next) setFavorites((items) => items.filter((item) => item !== id));
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full whitespace-normal"
                  onClick={() => setFavorites((items) => items.filter((item) => item !== id))}
                >
                  {shell("removeFavorite")}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title={empty("title")}
          description={empty("body")}
          action={
            <Button asChild>
              <Link href="/phones">{empty("cta")}</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
