"use client";

import { Lock, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DaamMeterLive } from "@/components/daam/daam-meter-live";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { requiresDisclosure } from "@/lib/domain/condition";
import { bandForPrice } from "@/lib/domain/daam-meter";
import { formatPKR, parsePKR } from "@/lib/domain/pricing";
import { MAX_DESCRIPTION } from "@/lib/validation/listing";
import { FieldError, errorId } from "./field-error";
import { useSellData, useSellForm, useSetField } from "./sell-form-context";

const CHIP_KEYS = ["pta", "noRepairs", "box", "original", "case", "warranty"] as const;
const NO_AREA = "__none";

/** Screen 6 (plan §8): price with live Daam Meter, city → area, description chips, contact toggles. */
export function StepPrice() {
  const t = useTranslations("Sell.price");
  const locale = useLocale();
  const { catalog, daamRanges } = useSellData();
  const { watch, getValues, clearErrors, formState } = useSellForm();
  const setField = useSetField();
  const price = watch("pricePkr");
  const citySlug = watch("citySlug");
  const areaSlug = watch("areaSlug");
  const description = watch("description") ?? "";
  const condition = watch("condition");
  const modelSlug = watch("modelSlug");
  const [priceText, setPriceText] = useState(() =>
    typeof getValues("pricePkr") === "number" && Number.isFinite(getValues("pricePkr"))
      ? String(getValues("pricePkr"))
      : "",
  );

  const range = modelSlug ? (daamRanges[modelSlug] ?? null) : null;
  const validPrice = typeof price === "number" && Number.isFinite(price) && price > 0;
  const band = validPrice ? bandForPrice(price, range) : "unknown";
  const areas = catalog.areas.filter((a) => a.citySlug === citySlug);
  const name = (x: { nameEn: string; nameUr: string }) => (locale === "ur" ? x.nameUr : x.nameEn);
  const disclosure = !!condition && requiresDisclosure(condition);

  const addChip = (text: string) => {
    if (description.includes(text)) return;
    const next = description.trim() ? `${description.trim()}. ${text}` : text;
    setField("description", next.slice(0, MAX_DESCRIPTION));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label htmlFor="field-pricePkr" className="text-sm font-semibold">
          {t("priceTitle")}
        </label>
        <Input
          id="field-pricePkr"
          inputMode="decimal"
          autoComplete="off"
          value={priceText}
          placeholder={t("pricePlaceholder")}
          onChange={(e) => {
            setPriceText(e.target.value);
            const parsed = parsePKR(e.target.value);
            setField("pricePkr", parsed ?? Number.NaN);
          }}
          className="max-w-xs font-mono text-lg"
          aria-invalid={!!formState.errors.pricePkr || undefined}
          aria-describedby={[
            "price-preview",
            formState.errors.pricePkr ? errorId("pricePkr") : null,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <p
          id="price-preview"
          className="font-mono text-sm text-muted-foreground"
          aria-live="polite"
        >
          {validPrice ? <bdi dir="ltr">{formatPKR(price)}</bdi> : null}
        </p>
        <FieldError name="pricePkr" />

        <label className="flex min-h-11 w-fit cursor-pointer items-center gap-3 text-sm">
          <Switch
            checked={!!watch("isNegotiable")}
            onCheckedChange={(v) => setField("isNegotiable", v)}
          />
          {t("negotiable")}
        </label>

        <div className="flex flex-col gap-2 rounded-card border border-border p-4">
          <p className="text-sm font-semibold">{t("meterTitle")}</p>
          {range ? (
            <>
              <DaamMeterLive band={band} size="md" range={range} showUnknown />
              <p className="text-xs text-muted-foreground">{t("meterHint")}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("meterNoData")}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span id="city-label" className="text-sm font-semibold">
            {t("cityTitle")}
          </span>
          <Select
            value={citySlug || undefined}
            onValueChange={(v) => {
              setField("citySlug", v);
              setField("areaSlug", null);
            }}
          >
            <SelectTrigger
              id="field-citySlug"
              aria-labelledby="city-label"
              aria-invalid={!!formState.errors.citySlug || undefined}
              aria-describedby={formState.errors.citySlug ? errorId("citySlug") : undefined}
              className="w-full"
            >
              <SelectValue placeholder={t("cityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {catalog.cities.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {name(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError name="citySlug" />
        </div>

        {areas.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span id="area-label" className="text-sm font-semibold">
              {t("areaTitle")}
            </span>
            <Select
              value={areaSlug ?? NO_AREA}
              onValueChange={(v) => setField("areaSlug", v === NO_AREA ? null : v)}
            >
              <SelectTrigger aria-labelledby="area-label" className="w-full">
                <SelectValue placeholder={t("areaPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_AREA}>{t("noArea")}</SelectItem>
                {areas.map((a) => (
                  <SelectItem key={a.slug} value={a.slug}>
                    {name(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="field-description" className="text-sm font-semibold">
          {t("descriptionTitle")}
          {disclosure ? <span aria-hidden> *</span> : null}
        </label>
        <p id="description-help" className="text-xs text-muted-foreground">
          {t("descriptionOptional")}
        </p>
        <Textarea
          id="field-description"
          rows={5}
          maxLength={MAX_DESCRIPTION}
          value={description}
          placeholder={t("descriptionPlaceholder")}
          onChange={(e) => setField("description", e.target.value)}
          aria-required={disclosure || undefined}
          aria-invalid={!!formState.errors.description || undefined}
          aria-describedby={[
            "description-help",
            "description-count",
            formState.errors.description ? errorId("description") : null,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <p id="description-count" className="text-end font-mono text-xs text-muted-foreground">
          {description.length}/{MAX_DESCRIPTION}
        </p>
        <FieldError name="description" />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">{t("chipsTitle")}</p>
          <div className="flex flex-wrap gap-2">
            {CHIP_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => addChip(t(`chips.${k}`))}
                className="inline-flex min-h-11 items-center gap-1 rounded-chip border border-input bg-surface px-3 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Plus aria-hidden className="size-3.5" />
                {t(`chips.${k}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <fieldset
        id="field-contactChat"
        tabIndex={-1}
        aria-describedby={formState.errors.contactChat ? errorId("contactChat") : undefined}
        className="flex flex-col gap-1 outline-none"
      >
        <legend className="mb-2 text-sm font-semibold">{t("contactTitle")}</legend>
        {(["contactChat", "contactWhatsapp", "contactCall"] as const).map((name) => (
          <label
            key={name}
            className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm"
          >
            {t(name === "contactChat" ? "chat" : name === "contactWhatsapp" ? "whatsapp" : "call")}
            <Switch
              checked={!!watch(name)}
              onCheckedChange={(v) => {
                setField(name, v);
                // The "at least one contact" error lives on contactChat.
                clearErrors("contactChat");
              }}
            />
          </label>
        ))}
        <FieldError name="contactChat" />
        <p className="mt-2 flex gap-2 text-xs text-muted-foreground">
          <Lock aria-hidden className="size-4 shrink-0" />
          {t("contactNote")}
        </p>
      </fieldset>
    </div>
  );
}
