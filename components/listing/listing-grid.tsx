import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/daam/empty-state";
import { ListingCard } from "@/components/daam/listing-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cities, mockNow, type MockListing } from "@/lib/mock/marketplace";

/** Grid of listing cards with localized city names and an empty state. */
export function ListingGrid({ listings }: { listings: MockListing[] }) {
  const market = useTranslations("Market");
  const t = useTranslations("Profile");

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={t("noListings")}
        description={t("noListingsBody")}
        action={
          <Button asChild variant="outline">
            <Link href="/phones">{market("allPhones")}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((l) => {
        const known = cities.find((c) => c === l.citySlug);
        return (
          <ListingCard
            key={l.id}
            listing={{ ...l, city: known ? market(`cities.${known}`) : l.city }}
            now={mockNow}
          />
        );
      })}
    </div>
  );
}
