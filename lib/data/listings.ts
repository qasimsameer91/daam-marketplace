import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type PublicListing = Pick<
  ListingRow,
  | "id"
  | "short_id"
  | "slug"
  | "title"
  | "price_pkr"
  | "pta_status"
  | "network_lock"
  | "condition"
  | "city_id"
  | "cover_image_path"
  | "published_at"
>;

/** Read only the public fields; real listing display is connected in Phase 6. */
export async function getPublicListings(limit = 24): Promise<PublicListing[]> {
  "use cache";
  cacheLife({ revalidate: 60 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public configuration is missing");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, Math.trunc(limit))) : 24;
  const { data, error } = await client
    .from("listings")
    .select(
      "id, short_id, slug, title, price_pkr, pta_status, network_lock, condition, city_id, cover_image_path, published_at",
    )
    .in("status", ["active", "sold"])
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(safeLimit);
  if (error) throw new Error("Listings could not be loaded");
  return data;
}
