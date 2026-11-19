"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { saveCampaign, deleteCampaign } from "@/app/[locale]/(app)/admin/promotions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/supabase/database.types";
import {
  CAMPAIGN_PLACEMENTS,
  campaignSchema,
  isSafeCampaignUrl,
  type CampaignInput,
} from "@/lib/validation/campaign";
import { fromPakistanInput, toPakistanInput } from "@/lib/domain/campaign-schedule";
import { CampaignImageUpload } from "./campaign-image-upload";
import { CampaignCreative } from "@/components/marketplace/campaign-creative";
import { useHydrated } from "@/hooks/use-hydrated";

type Row = Database["public"]["Tables"]["campaign_banners"]["Row"];
type Feedback = "saved" | "deleted" | "invalid" | "forbidden" | "failed";
function initialValues(row?: Row): CampaignInput {
  return {
    id: row?.id,
    title_en: row?.title_en ?? "",
    title_ur: row?.title_ur ?? "",
    subtitle_en: row?.subtitle_en ?? "",
    subtitle_ur: row?.subtitle_ur ?? "",
    description_en: row?.description_en ?? "",
    description_ur: row?.description_ur ?? "",
    desktop_image_url: row?.desktop_image_url ?? "",
    mobile_image_url: row?.mobile_image_url ?? "",
    cta_en: row?.cta_en ?? "",
    cta_ur: row?.cta_ur ?? "",
    cta_url: row?.cta_url ?? "/phones",
    theme: (row?.theme as CampaignInput["theme"]) ?? "light",
    placement: (row?.placement as CampaignInput["placement"]) ?? "below_hero",
    starts_at: row ? toPakistanInput(row.starts_at) : "",
    ends_at: row ? toPakistanInput(row.ends_at) : "",
    priority: row?.priority ?? 0,
    status: (row?.status as CampaignInput["status"]) ?? "draft",
    is_active: row?.is_active ?? false,
  };
}
export function CampaignForm({
  initial,
  previewOnly = false,
}: {
  initial?: Row;
  previewOnly?: boolean;
}) {
  const t = useTranslations("AdminCampaigns");
  const r = useTranslations("Redesign");
  const locale = useLocale();
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(initial));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [pending, startTransition] = useTransition();
  const [mobile, setMobile] = useState(false);
  const ready = useHydrated();
  const update = <K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) => {
    setFeedback(null);
    setValues((current) => ({ ...current, [key]: value }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (previewOnly) return;
    const start = fromPakistanInput(values.starts_at),
      end = fromPakistanInput(values.ends_at);
    const parsed = campaignSchema.safeParse({ ...values, starts_at: start, ends_at: end });
    if (!parsed.success) {
      setFeedback("invalid");
      return;
    }
    startTransition(async () => {
      const result = await saveCampaign(parsed.data);
      setFeedback(result.ok ? "saved" : result.reason);
      if (result.ok) {
        if (result.id) setValues((current) => ({ ...current, id: result.id }));
        router.refresh();
      }
    });
  };
  const textField = (
    key:
      | "title_en"
      | "title_ur"
      | "subtitle_en"
      | "subtitle_ur"
      | "desktop_image_url"
      | "mobile_image_url"
      | "cta_en"
      | "cta_ur"
      | "cta_url",
    label: Parameters<typeof t>[0],
    required = false,
  ) => (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {t(label)}
      <Input
        value={values[key]}
        required={required}
        maxLength={key.includes("url") ? 2048 : undefined}
        onChange={(event) => update(key, event.target.value)}
        dir={key.endsWith("_ur") ? "rtl" : undefined}
      />
    </label>
  );
  const image = (url: string) => (url && isSafeCampaignUrl(url) ? url : null);
  return (
    <form
      onSubmit={submit}
      className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
    >
      <fieldset disabled={!ready || pending} className="contents">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("title_en", "titleEn", true)}
            {textField("title_ur", "titleUr", true)}
            {textField("subtitle_en", "subtitleEn")}
            {textField("subtitle_ur", "subtitleUr")}
            {(
              [
                ["description_en", "descriptionEn"],
                ["description_ur", "descriptionUr"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-2 text-sm font-medium">
                {t(label)}
                <Textarea
                  rows={3}
                  value={values[key]}
                  maxLength={key.endsWith("ur") ? 600 : 400}
                  onChange={(event) => update(key, event.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="grid gap-4 rounded-card border border-border bg-background p-4 sm:grid-cols-2">
            <CampaignImageUpload
              disabled={previewOnly || pending}
              onUploaded={(url) => update("desktop_image_url", url)}
            />
            <CampaignImageUpload
              mobile
              disabled={previewOnly || pending}
              onUploaded={(url) => update("mobile_image_url", url)}
            />
            {textField("desktop_image_url", "desktopImage")}
            {textField("mobile_image_url", "mobileImage")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("cta_en", "ctaEn", true)}
            {textField("cta_ur", "ctaUr", true)}
            {textField("cta_url", "ctaUrl", true)}
            <label className="flex flex-col gap-2 text-sm font-medium">
              {t("placement")}
              <select
                className="h-11 rounded-xl border border-input bg-surface px-3"
                value={values.placement}
                onChange={(event) =>
                  update("placement", event.target.value as CampaignInput["placement"])
                }
              >
                {CAMPAIGN_PLACEMENTS.map((placement) => (
                  <option key={placement} value={placement}>
                    {t(placement)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {t("theme")}
              <select
                className="h-11 rounded-xl border border-input bg-surface px-3"
                value={values.theme}
                onChange={(event) => update("theme", event.target.value as CampaignInput["theme"])}
              >
                {(["light", "sand", "pearl", "dark", "lime"] as const).map((theme) => (
                  <option key={theme} value={theme}>
                    {theme === "sand" || theme === "pearl" ? t(theme) : t(theme)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {t("priority")}
              <Input
                type="number"
                min={-100}
                max={100}
                value={values.priority}
                onChange={(event) => update("priority", Number(event.target.value))}
              />
            </label>
          </div>
          <div className="rounded-card border border-border bg-sand/40 p-4">
            <p className="mb-4 text-xs font-semibold text-clay-ink">{r("karachiTime")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["starts_at", "starts"],
                  ["ends_at", "ends"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex flex-col gap-2 text-sm font-medium">
                  {t(label)}
                  <Input
                    type="datetime-local"
                    required
                    value={values[key]}
                    onChange={(event) => update(key, event.target.value)}
                  />
                </label>
              ))}
              <label className="flex flex-col gap-2 text-sm font-medium">
                {t("status")}
                <select
                  className="h-11 rounded-xl border border-input bg-surface px-3"
                  value={values.status}
                  onChange={(event) =>
                    update("status", event.target.value as CampaignInput["status"])
                  }
                >
                  <option value="draft">{t("draft")}</option>
                  <option value="published">{t("published")}</option>
                  <option value="archived">{r("archived")}</option>
                </select>
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={values.is_active}
                  onChange={(event) => update("is_active", event.target.checked)}
                />
                {t("active")}
              </label>
            </div>
          </div>
          {feedback ? (
            <p role="status" className="text-sm">
              {t(feedback)}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={previewOnly || pending}>
              {pending ? t("saving") : t("save")}
            </Button>
            {initial ? (
              <Button
                type="button"
                variant="outline"
                disabled={previewOnly || pending}
                onClick={() => {
                  if (!window.confirm(t("confirmDelete"))) return;
                  startTransition(async () => {
                    const result = await deleteCampaign(initial.id);
                    setFeedback(result.ok ? "deleted" : result.reason);
                    if (result.ok) router.refresh();
                  });
                }}
              >
                {t("delete")}
              </Button>
            ) : null}
          </div>
        </div>
        <aside className="min-w-0 space-y-4 xl:sticky xl:top-28">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{t("preview")}</h3>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={mobile ? "ghost" : "secondary"}
                size="sm"
                aria-pressed={!mobile}
                onClick={() => setMobile(false)}
              >
                {r("desktopPreview")}
              </Button>
              <Button
                type="button"
                variant={mobile ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mobile}
                onClick={() => setMobile(true)}
              >
                {r("mobilePreview")}
              </Button>
            </div>
          </div>
          <div className={mobile ? "mx-auto max-w-[390px]" : "w-full"}>
            <CampaignCreative
              title={(locale === "ur" ? values.title_ur : values.title_en) || t("previewFallback")}
              eyebrow={locale === "ur" ? values.subtitle_ur : values.subtitle_en}
              description={locale === "ur" ? values.description_ur : values.description_en}
              cta={locale === "ur" ? values.cta_ur : values.cta_en}
              desktop={image(values.desktop_image_url)}
              mobile={image(values.mobile_image_url)}
              theme={values.theme}
              previewMobile={mobile}
            />
          </div>
        </aside>
      </fieldset>
    </form>
  );
}
