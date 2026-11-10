"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatusIcon } from "@/components/daam/status-icon";
import { Input } from "@/components/ui/input";
import {
  NETWORK_LOCK_META,
  PTA_REG_TYPES,
  PTA_STATUSES,
  PTA_STATUS_META,
  allowedNetworkLocks,
  type PtaStatus,
} from "@/lib/domain/pta";
import { ChipGroup } from "./chip-group";
import { ChoiceCards } from "./choice-cards";
import { FieldError, errorId } from "./field-error";
import { useSellData, useSellForm, useSetField } from "./sell-form-context";

/** Screen 2 (plan §8): PTA status, network lock (JV only for Apple), IMEI(s). */
export function StepPta() {
  const t = useTranslations("Sell.pta");
  const pta = useTranslations("Pta");
  const spec = useTranslations("Spec");
  const { copy } = useSellData();
  const { watch, register, formState } = useSellForm();
  const setField = useSetField();
  const brandSlug = watch("brandSlug");
  const ptaStatus = watch("ptaStatus");
  const networkLock = watch("networkLock");
  const ptaRegType = watch("ptaRegType");
  const locks = ptaStatus
    ? allowedNetworkLocks(brandSlug, ptaStatus)
    : allowedNetworkLocks(brandSlug, "unknown");

  const chooseStatus = (status: PtaStatus) => {
    setField("ptaStatus", status);
    // Keep the two PTA facts consistent: drop a lock or registration type that no longer applies.
    if (networkLock && !allowedNetworkLocks(brandSlug, status).includes(networkLock)) {
      setField("networkLock", undefined as never);
    }
    if (status !== "pta_approved") setField("ptaRegType", null);
  };

  const errorProps = (name: "ptaStatus" | "networkLock" | "imei1" | "imei2") => ({
    invalid: !!formState.errors[name],
    describedBy: formState.errors[name] ? errorId(name) : undefined,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ChoiceCards
          name="ptaStatus"
          legend={t("statusTitle")}
          value={ptaStatus}
          onChange={chooseStatus}
          options={PTA_STATUSES.map((s) => ({
            value: s,
            title: pta(`status.${s}`),
            description: copy[`pta_status.${s}`],
            icon: <StatusIcon icon={PTA_STATUS_META[s].icon} className="size-4" />,
          }))}
          {...errorProps("ptaStatus")}
        />
        <FieldError name="ptaStatus" />
      </div>

      {ptaStatus === "pta_approved" ? (
        <ChipGroup
          name="ptaRegType"
          legend={t("regTitle")}
          options={PTA_REG_TYPES.filter((r) => r !== "unknown").map((r) => ({
            value: r,
            label: spec(`regTypeValues.${r}`),
          }))}
          value={ptaRegType}
          onChange={(v) => setField("ptaRegType", (v === ptaRegType ? null : v) as never)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <ChoiceCards
          name="networkLock"
          legend={t("lockTitle")}
          value={networkLock}
          onChange={(v) => setField("networkLock", v)}
          options={locks.map((l) => ({
            value: l,
            title: pta(`lock.${l}`),
            description: copy[`network_lock.${l}`],
            icon: <StatusIcon icon={NETWORK_LOCK_META[l].icon} className="size-4" />,
          }))}
          {...errorProps("networkLock")}
        />
        {brandSlug === "apple" && ptaStatus === "pta_approved" ? (
          <p className="text-sm text-muted-foreground">{t("jvAppleOnly")}</p>
        ) : null}
        <FieldError name="networkLock" />
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-semibold">{t("imeiTitle")}</legend>
        <p className="flex gap-2 rounded-button bg-muted/60 p-3 text-sm">
          <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
          {t("imeiPrivate")}
        </p>
        {(["imei1", "imei2"] as const).map((name) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label htmlFor={`field-${name}`} className="text-sm font-medium">
              {t(name)}
            </label>
            <Input
              id={`field-${name}`}
              inputMode="numeric"
              autoComplete="off"
              maxLength={20}
              className="font-mono"
              {...register(name)}
              aria-invalid={errorProps(name).invalid || undefined}
              aria-describedby={[`${name}-help`, errorProps(name).describedBy]
                .filter(Boolean)
                .join(" ")}
            />
            <p id={`${name}-help`} className="text-xs text-muted-foreground">
              {t("imeiHelp")}
            </p>
            <FieldError name={name} />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
