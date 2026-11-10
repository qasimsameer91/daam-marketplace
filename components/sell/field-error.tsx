"use client";

import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ListingField } from "@/lib/validation/listing";
import { useSellForm } from "./sell-form-context";

/** Error id for aria-describedby. */
export const errorId = (name: ListingField) => `error-${name}`;

/** Translates a schema error code (e.g. "imei_invalid") for one field. Icon + text, not colour alone. */
export function FieldError({ name }: { name: ListingField }) {
  const t = useTranslations("Sell");
  const { formState } = useSellForm();
  const code = formState.errors[name]?.message;
  if (!code) return null;
  const key = `errors.${code}`;
  return (
    <p id={errorId(name)} className="flex items-start gap-1.5 text-sm text-destructive-text">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {t.has(key as "errors.imei_invalid") ? t(key as "errors.imei_invalid") : t("fixErrors")}
    </p>
  );
}
