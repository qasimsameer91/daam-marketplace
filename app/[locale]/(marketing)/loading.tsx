import { ListingCardSkeleton } from "@/components/daam/listing-card-skeleton";
export default function Loading() {
  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-4 py-12 lg:grid-cols-4">
      {[1, 2, 3, 4].map((n) => (
        <ListingCardSkeleton key={n} />
      ))}
    </main>
  );
}
