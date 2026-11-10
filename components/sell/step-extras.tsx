"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { ACCESSORIES, BOX_STATUSES, WARRANTY_TYPES } from "@/lib/domain/condition";
import { MAX_WARRANTY_MONTHS } from "@/lib/validation/listing";
import { ChipGroup } from "./chip-group";
import { FieldError, errorId } from "./field-error";
import { useSellForm, useSetField } from "./sell-form-context";

/** Screen 4 (plan §8): box, accessories, warranty, purchase month — one-tap chips. */
export function StepExtras({ maxMonth }: { maxMonth: string }) {
  const t = useTranslations("Sell.extras");
  const spec = useTranslations("Spec");
  const { watch, register, formState } = useSellForm();
  const setField = useSetField();
  const warrantyType = watch("warrantyType");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ChipGroup
          name="boxStatus"
          legend={t("boxTitle")}
          options={BOX_STATUSES.map((b) => ({ value: b, label: spec(`boxValues.${b}`) }))}
          value={watch("boxStatus")}
          onChange={(v) => setField("boxStatus", v as (typeof BOX_STATUSES)[number])}
          invalid={!!formState.errors.boxStatus}
          describedBy={formState.errors.boxStatus ? errorId("boxStatus") : undefined}
        />
        <FieldError name="boxStatus" />
      </div>

      <ChipGroup
        name="accessories"
        legend={t("accessoriesTitle")}
        multiple
        options={ACCESSORIES.map((a) => ({ value: a, label: spec(`accessoryValues.${a}`) }))}
        value={watch("accessories") ?? []}
        onChange={(v) => setField("accessories", v as (typeof ACCESSORIES)[number][])}
      />

      <div className="flex flex-col gap-3">
        <ChipGroup
          name="warrantyType"
          legend={t("warrantyTitle")}
          options={WARRANTY_TYPES.map((w) => ({ value: w, label: spec(`warrantyValues.${w}`) }))}
          value={warrantyType}
          onChange={(v) => {
            setField("warrantyType", v as (typeof WARRANTY_TYPES)[number]);
            if (v === "none") setField("warrantyMonths", null);
          }}
        />
        {warrantyType && warrantyType !== "none" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-warrantyMonths" className="text-sm font-medium">
              {t("months")}
            </label>
            <Input
              id="field-warrantyMonths"
              inputMode="numeric"
              className="w-32 font-mono"
              max={MAX_WARRANTY_MONTHS}
              {...register("warrantyMonths", {
                setValueAs: (v: string) => (v === "" || v === null ? null : Number(v)),
              })}
              aria-invalid={!!formState.errors.warrantyMonths || undefined}
              aria-describedby={
                formState.errors.warrantyMonths ? errorId("warrantyMonths") : undefined
              }
            />
            <FieldError name="warrantyMonths" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-purchaseMonth" className="text-sm font-semibold">
          {t("purchaseMonth")}
        </label>
        <Input
          id="field-purchaseMonth"
          type="month"
          max={maxMonth}
          className="w-48 font-mono"
          {...register("purchaseMonth", { setValueAs: (v: string) => (v ? v : null) })}
          aria-invalid={!!formState.errors.purchaseMonth || undefined}
          aria-describedby={formState.errors.purchaseMonth ? errorId("purchaseMonth") : undefined}
        />
        <FieldError name="purchaseMonth" />
      </div>
    </div>
  );
}
