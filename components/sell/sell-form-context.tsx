"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFormContext, FormProvider, type UseFormReturn } from "react-hook-form";
import type { DaamRange } from "@/lib/domain/daam-meter";
import type { CatalogModel, SellCatalog } from "@/lib/catalog/seed-catalog";
import type { ListingField, ListingInput } from "@/lib/validation/listing";

/** Static data every wizard screen may need. */
export interface SellData {
  catalog: SellCatalog;
  /** content_blocks copy for PTA status / network lock explainers. */
  copy: Record<string, string>;
  /** Mock Daam Meter ranges by model slug (Phase 7 computes these live). */
  daamRanges: Record<string, DaamRange>;
}

const SellDataContext = createContext<SellData | null>(null);

export function SellFormProvider({
  form,
  data,
  children,
}: {
  form: UseFormReturn<ListingInput>;
  data: SellData;
  children: ReactNode;
}) {
  return (
    <SellDataContext.Provider value={data}>
      <FormProvider {...form}>{children}</FormProvider>
    </SellDataContext.Provider>
  );
}

export function useSellForm() {
  return useFormContext<ListingInput>();
}

export function useSellData(): SellData {
  const data = useContext(SellDataContext);
  if (!data) throw new Error("useSellData must be used inside SellFormProvider");
  return data;
}

/** The catalog model currently chosen in the form, if any. */
export function useSelectedModel(): CatalogModel | undefined {
  const { catalog } = useSellData();
  const { watch } = useSellForm();
  const slug = watch("modelSlug");
  return slug ? catalog.models.find((m) => m.slug === slug) : undefined;
}

/** Set a value from a custom control and clear its error. */
export function useSetField() {
  const { setValue, clearErrors } = useSellForm();
  return <K extends ListingField>(name: K, value: ListingInput[K]) => {
    setValue(name, value as never, { shouldDirty: true });
    clearErrors(name);
  };
}
