import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { CampaignForm } from "@/components/account/campaign-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { campaignDisplayState } from "@/lib/domain/campaign-schedule";

async function loadAdminCampaigns() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    return null;
  try {
    const client = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user) return null;
    const { data: allowed, error: roleError } = await client.rpc("is_admin");
    if (roleError || allowed !== true) return null;
    const { data: campaigns, error } = await client
      .from("campaign_banners")
      .select("*")
      .order("created_at", { ascending: false });
    return error ? null : { items: campaigns, now: Date.now() };
  } catch {
    return null;
  }
}

async function AdminCampaigns() {
  const t = await getTranslations("AdminCampaigns");
  const r = await getTranslations("Redesign");
  const loaded = await loadAdminCampaigns();
  if (!loaded)
    return (
      <div>
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-4 rounded-card border border-border bg-muted p-5 text-sm">
          {t("unavailable")}
        </p>
      </div>
    );
  const { items: campaigns, now } = loaded;
  return (
    <div>
      <p className="mb-3 text-[0.65rem] font-bold tracking-[0.18em] text-clay-ink uppercase">
        {r("campaignEyebrow")}
      </p>
      <h2 className="text-3xl font-semibold tracking-display">{t("title")}</h2>
      <p className="mt-3 text-muted-foreground">{t("intro")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {(["live", "scheduled", "draft"] as const).map((state) => (
          <div key={state} className="rounded-card border border-border bg-surface p-6">
            <p className="text-sm text-muted-foreground">
              {state === "draft" ? t("draft") : r(state)}
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold">
              {campaigns.filter((campaign) => campaignDisplayState(campaign, now) === state).length}
            </p>
          </div>
        ))}
      </div>
      <details
        open={campaigns.length === 0}
        className="mt-8 rounded-card border border-border bg-card p-5 md:p-7"
      >
        <summary className="min-h-11 cursor-pointer text-xl font-semibold">{t("new")}</summary>
        <div className="mt-6">
          <CampaignForm />
        </div>
      </details>
      <section className="mt-8 space-y-3">
        <h2 className="mb-5 text-xl font-semibold">{r("campaignLibrary")}</h2>
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          campaigns.map((campaign) => (
            <details key={campaign.id} className="rounded-card border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold">
                <span className="inline-flex flex-wrap items-center gap-3">
                  <span>{campaign.title_en}</span>
                  <span className="rounded-full bg-sand px-3 py-1 text-xs font-normal">
                    {r(campaignDisplayState(campaign, now))}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {t(campaign.placement as "below_hero")} · {t("priority")} {campaign.priority}
                  </span>
                </span>
              </summary>
              <div className="mt-6">
                <CampaignForm initial={campaign} />
              </div>
            </details>
          ))
        )}
      </section>
    </div>
  );
}

export default function AdminCampaignsPage() {
  return (
    <Suspense fallback={null}>
      <AdminCampaigns />
    </Suspense>
  );
}
