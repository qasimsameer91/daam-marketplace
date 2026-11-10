"use client";

import { CircleCheck, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { BatteryPill } from "@/components/daam/battery-pill";
import { ConditionChip } from "@/components/daam/condition-chip";
import { ListingCard, type ListingCardData } from "@/components/daam/listing-card";
import { PtaBadge } from "@/components/daam/pta-badge";
import { Button } from "@/components/ui/button";
import { bandForPrice } from "@/lib/domain/daam-meter";
import { completionScore } from "@/lib/domain/listing-completion";
import { formatPKR } from "@/lib/domain/pricing";
import { variantLabel } from "@/lib/domain/variant";
import type { WizardStep } from "@/lib/validation/listing";
import { useSelectedModel, useSellData, useSellForm } from "./sell-form-context";

/** Preview (plan §8): the exact card buyers will see, completion score, and per-section edit links. */
export function SellPreview({ now, onEdit }: { now: Date; onEdit: (step: WizardStep) => void }) {
  const t = useTranslations("Sell");
  const spec = useTranslations("Spec");
  const steps = useTranslations("Sell.steps");
  const locale = useLocale();
  const { catalog, daamRanges } = useSellData();
  const { getValues } = useSellForm();
  const model = useSelectedModel();
  const v = getValues();

  const city = catalog.cities.find((c) => c.slug === v.citySlug);
  const area = catalog.areas.find((a) => a.citySlug === v.citySlug && a.slug === v.areaSlug);
  const label = (x: { nameEn: string; nameUr: string } | undefined) =>
    x ? (locale === "ur" ? x.nameUr : x.nameEn) : "";
  const modelName = model?.name ?? `${v.customBrand ?? ""} ${v.customModel ?? ""}`.trim();
  const variant = v.storageGb ? variantLabel(v.ramGb ?? null, v.storageGb) : "";
  const range = v.modelSlug ? (daamRanges[v.modelSlug] ?? null) : null;

  const card: ListingCardData = useMemo(
    () => ({
      id: "preview",
      href: "/sell",
      modelName,
      variantLabel: variant,
      pricePkr: v.pricePkr ?? 0,
      daamBand: bandForPrice(v.pricePkr ?? 0, range),
      ptaStatus: v.ptaStatus ?? "unknown",
      networkLock: v.networkLock ?? "unknown",
      condition: v.condition ?? "used",
      batteryHealth: v.batteryHealth ?? null,
      city: label(city),
      area: area ? label(area) : null,
      publishedAt: now.toISOString(),
      imageUrl: v.photos?.[0]?.url ?? null,
      isFeatured: false,
      verification: null,
    }),
    // getValues() is a snapshot taken when the preview opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { score, hints } = completionScore({
    photoCount: v.photos?.length ?? 0,
    descriptionLength: v.description?.trim().length ?? 0,
    batteryHealth: v.batteryHealth ?? null,
    supportsBatteryHealth: v.brandSlug === "apple" || !!model?.supportsBatteryHealth,
    colorName: v.colorName ?? null,
    purchaseMonth: v.purchaseMonth ?? null,
  });

  const rows: { step: WizardStep; content: React.ReactNode }[] = [
    { step: "phone", content: <span className="font-medium">{`${modelName} · ${variant}`}</span> },
    {
      step: "pta",
      content: <PtaBadge status={card.ptaStatus} networkLock={card.networkLock} detailed />,
    },
    {
      step: "condition",
      content: (
        <span className="flex flex-wrap gap-1.5">
          <ConditionChip condition={card.condition} />
          {card.batteryHealth !== null ? <BatteryPill health={card.batteryHealth} /> : null}
        </span>
      ),
    },
    { step: "extras", content: v.boxStatus ? spec(`boxValues.${v.boxStatus}`) : null },
    {
      step: "photos",
      content: (
        <span className="font-mono">{t("photos.count", { count: v.photos?.length ?? 0 })}</span>
      ),
    },
    {
      step: "price",
      content: (
        <span>
          <bdi dir="ltr" className="font-mono">
            {formatPKR(v.pricePkr ?? 0)}
          </bdi>
          {" · "}
          {card.area ? `${card.area}, ${card.city}` : card.city}
        </span>
      ),
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t("preview.body")}</p>
        <ListingCard listing={card} now={now} />
      </div>

      <div className="flex flex-col gap-6">
        <section
          aria-labelledby="completion-title"
          className="flex flex-col gap-3 rounded-card border border-border p-4"
        >
          <h3 id="completion-title" className="font-semibold">
            {t("preview.completion", { score })}
          </h3>
          <div
            role="progressbar"
            aria-labelledby="completion-title"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full w-full origin-left rounded-full bg-lime rtl:origin-right"
              style={{ transform: `scaleX(${score / 100})` }}
            />
          </div>
          {hints.length === 0 ? (
            <p className="flex items-center gap-2 text-sm">
              <CircleCheck aria-hidden className="size-4" />
              {t("preview.complete")}
            </p>
          ) : (
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {hints.map((h) => (
                <li key={h.key}>
                  ·{" "}
                  {h.key === "photos"
                    ? t("preview.hints.photos", { count: h.count })
                    : t(`preview.hints.${h.key}`)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="summary-title" className="flex flex-col gap-2">
          <h3 id="summary-title" className="font-semibold">
            {t("preview.summary")}
          </h3>
          <dl className="divide-y divide-border rounded-card border border-border">
            {rows.map((row) => (
              <div key={row.step} className="flex items-center justify-between gap-3 px-4 py-2">
                <div className="flex min-w-0 flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">{steps(row.step)}</dt>
                  <dd className="text-sm">{row.content}</dd>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(row.step)}>
                  <Pencil aria-hidden />
                  <span>
                    {t("edit")}
                    <span className="sr-only">: {steps(row.step)}</span>
                  </span>
                </Button>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
