"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { campaignSchema } from "@/lib/validation/campaign";

type ActionResult =
  { ok: true; id?: string } | { ok: false; reason: "invalid" | "forbidden" | "failed" };

async function adminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    return null;
  const client = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: allowed, error: roleError } = await client.rpc("is_admin");
  return !roleError && allowed === true ? client : null;
}

/** Authentication, administrator role, validation and RLS are checked for every mutation. */
export async function saveCampaign(input: unknown): Promise<ActionResult> {
  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  try {
    const client = await adminClient();
    if (!client) return { ok: false, reason: "forbidden" };
    const { id, desktop_image_url, mobile_image_url, ...fields } = parsed.data;
    const values = {
      ...fields,
      desktop_image_url: desktop_image_url || null,
      mobile_image_url: mobile_image_url || null,
    };
    const query = id
      ? client.from("campaign_banners").update(values).eq("id", id)
      : client.from("campaign_banners").insert(values);
    const { data, error } = await query.select("id").maybeSingle();
    return error || !data ? { ok: false, reason: "failed" } : { ok: true, id: data.id };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

export async function deleteCampaign(id: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, reason: "invalid" };
  try {
    const client = await adminClient();
    if (!client) return { ok: false, reason: "forbidden" };
    const { data, error } = await client
      .from("campaign_banners")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    return error || !data ? { ok: false, reason: "failed" } : { ok: true };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
