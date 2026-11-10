"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchModels } from "@/lib/domain/catalog-search";
import { variantLabel } from "@/lib/domain/variant";
import { cn } from "@/lib/utils";
import { OTHER_BRAND } from "@/lib/validation/listing";
import { ChipGroup } from "./chip-group";
import { FieldError, errorId } from "./field-error";
import { useSelectedModel, useSellData, useSellForm, useSetField } from "./sell-form-context";

/** Screen 1 (plan §8): brand → model (alias search) → variant → colour. */
export function StepPhone() {
  const t = useTranslations("Sell.phone");
  const id = useId();
  const { catalog } = useSellData();
  const { watch, register, formState } = useSellForm();
  const setField = useSetField();
  const brandSlug = watch("brandSlug");
  const storageGb = watch("storageGb");
  const ramGb = watch("ramGb");
  const colorName = watch("colorName");
  const model = useSelectedModel();
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      searchModels(catalog.models, query, {
        brandSlug: query ? undefined : brandSlug || undefined,
      }),
    [catalog.models, query, brandSlug],
  );

  const chooseModel = (slug: string) => {
    const m = catalog.models.find((x) => x.slug === slug);
    if (!m) return;
    setField("brandSlug", m.brandSlug);
    setField("modelSlug", m.slug);
    // Single-variant models are chosen automatically.
    const only = m.variants.length === 1 ? m.variants[0] : undefined;
    setField("storageGb", only?.storageGb ?? null);
    setField("ramGb", only?.ramGb ?? null);
    setField("colorName", null);
    setQuery("");
  };

  const chooseBrand = (slug: string) => {
    if (slug === brandSlug) return;
    setField("brandSlug", slug);
    setField("modelSlug", null);
    setField("storageGb", null);
    setField("ramGb", null);
    setField("colorName", null);
  };

  const isOther = brandSlug === OTHER_BRAND;

  return (
    <div className="flex flex-col gap-8">
      <ChipGroup
        name="brandSlug"
        legend={t("brandTitle")}
        options={catalog.brands.map((b) => ({ value: b.slug, label: b.name }))}
        value={brandSlug || null}
        onChange={(v) => chooseBrand(v as string)}
        invalid={!!formState.errors.brandSlug}
        describedBy={formState.errors.brandSlug ? errorId("brandSlug") : undefined}
      />
      <FieldError name="brandSlug" />

      {isOther ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{t("otherNote")}</p>
          {(["customBrand", "customModel"] as const).map((name) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label htmlFor={`field-${name}`} className="text-sm font-semibold">
                {t(name)}
              </label>
              <Input
                id={`field-${name}`}
                {...register(name)}
                aria-invalid={!!formState.errors[name] || undefined}
                aria-describedby={formState.errors[name] ? errorId(name) : undefined}
              />
              <FieldError name={name} />
            </div>
          ))}
        </div>
      ) : model ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3 rounded-card border border-foreground bg-muted p-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("modelTitle")}</p>
              <p className="text-lg font-semibold">{model.name}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setField("modelSlug", null)}
            >
              <X aria-hidden />
              {t("change")}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <ChipGroup
              name="storageGb"
              legend={t("variantTitle")}
              options={model.variants.map((v) => ({
                value: `${v.ramGb ?? 0}-${v.storageGb}`,
                label: <span className="font-mono">{variantLabel(v.ramGb, v.storageGb)}</span>,
              }))}
              value={storageGb ? `${ramGb ?? 0}-${storageGb}` : null}
              onChange={(v) => {
                const [ram, storage] = String(v).split("-").map(Number);
                setField("ramGb", ram ? ram : null);
                setField("storageGb", storage ?? null);
              }}
              invalid={!!formState.errors.storageGb}
              describedBy={formState.errors.storageGb ? errorId("storageGb") : undefined}
            />
            <FieldError name="storageGb" />
          </div>

          {model.colors.length > 0 ? (
            <ChipGroup
              name="colorName"
              legend={t("colorTitle")}
              options={model.colors.map((c) => ({
                value: c.name,
                label: (
                  <>
                    {/* Swatch colour is catalog data, not a design token. */}
                    <span
                      aria-hidden
                      className="size-3.5 rounded-full border border-input"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </>
                ),
              }))}
              value={colorName}
              onChange={(v) => setField("colorName", v as string)}
            />
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <label htmlFor={`${id}-search`} className="text-sm font-semibold">
            {t("searchLabel")}
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id={`${id}-search`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="ps-9"
              aria-controls={`${id}-results`}
            />
          </div>
          <div
            id="field-modelSlug"
            tabIndex={-1}
            aria-describedby={formState.errors.modelSlug ? errorId("modelSlug") : undefined}
            className="outline-none"
          >
            {!query ? <p className="mb-2 text-xs text-muted-foreground">{t("popular")}</p> : null}
            {results.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground" role="status">
                {t("noModels")}
              </p>
            ) : (
              <ul
                id={`${id}-results`}
                aria-label={t("modelTitle")}
                className="grid gap-2 sm:grid-cols-2"
              >
                {results.map((m) => (
                  <li key={m.slug}>
                    <button
                      type="button"
                      onClick={() => chooseModel(m.slug)}
                      className={cn(
                        "flex min-h-12 w-full items-center justify-between gap-2 rounded-button border border-input bg-surface px-4 text-start text-sm hover:bg-muted",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {catalog.brands.find((b) => b.slug === m.brandSlug)?.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <FieldError name="modelSlug" />
        </div>
      )}
    </div>
  );
}
