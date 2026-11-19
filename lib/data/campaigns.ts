import "server-only";
import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import type { CAMPAIGN_PLACEMENTS } from "@/lib/validation/campaign";

export type CampaignPlacement = (typeof CAMPAIGN_PLACEMENTS)[number];
export type PublicCampaign = Pick<
  Database["public"]["Tables"]["campaign_banners"]["Row"],
  | "title_en"
  | "title_ur"
  | "subtitle_en"
  | "subtitle_ur"
  | "description_en"
  | "description_ur"
  | "desktop_image_url"
  | "mobile_image_url"
  | "cta_en"
  | "cta_ur"
  | "cta_url"
  | "theme"
>;

/** Always query at request time so scheduled campaigns expire on time. */
export async function getPublicCampaign(
  placement: CampaignPlacement,
): Promise<PublicCampaign | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  await connection();
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("campaign_banners")
    .select(
      "title_en,title_ur,subtitle_en,subtitle_ur,description_en,description_ur,desktop_image_url,mobile_image_url,cta_en,cta_ur,cta_url,theme",
    )
    .eq("placement", placement)
    .eq("status", "published")
    .eq("is_active", true)
    .not("approved_at", "is", null)
    .lte("starts_at", now)
    .gt("ends_at", now)
    .order("priority", { ascending: false })
    .order("starts_at", { ascending: false })
    .order("id")
    .limit(1)
    .maybeSingle();
  if (error) {
    // A campaign is optional; never replace an unavailable service with fake copy.
    console.error("Campaign placement could not be loaded");
    return null;
  }
  return data;
}
