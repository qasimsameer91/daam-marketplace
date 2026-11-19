import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Only a real authenticated admin receives the dashboard shortcut. */
export async function AdminCampaignLink() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    return null;
  try {
    const client = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user) return null;
    const { data: allowed, error: roleError } = await client.rpc("is_admin");
    if (roleError || allowed !== true) return null;
  } catch {
    return null;
  }
  const t = await getTranslations("AdminCampaigns");
  return (
    <Link
      href="/admin/promotions"
      className="mt-3 inline-flex min-h-11 items-center rounded-button border border-border px-4 text-sm font-semibold hover:bg-muted"
    >
      {t("title")}
    </Link>
  );
}
