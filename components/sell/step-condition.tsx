"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  BODY_CONDITIONS,
  FUNCTIONAL_ISSUES,
  PHONE_CONDITIONS,
  REPAIRS,
  SCREEN_CONDITIONS,
  conditionScore,
  requiresBatteryHealth,
} from "@/lib/domain/condition";
import { ChipGroup } from "./chip-group";
import { ChoiceCards } from "./choice-cards";
import { FieldError, errorId } from "./field-error";
import { useSelectedModel, useSellForm, useSetField } from "./sell-form-context";

/** "None" is exclusive: picking it clears the rest, picking anything else clears "None". */
function exclusiveNone<T extends string>(prev: T[], next: T[]): T[] {
  const added = next.find((v) => !prev.includes(v));
  if (added === "none") return ["none" as T];
  return next.filter((v) => v !== "none");
}

/** Screen 3 (plan §8): grade with definitions, battery health when relevant, screen/body, repairs, issues. */
export function StepCondition() {
  const t = useTranslations("Sell.condition");
  const cond = useTranslations("Condition");
  const spec = useTranslations("Spec");
  const { watch, register, formState } = useSellForm();
  const setField = useSetField();
  const model = useSelectedModel();
  const brandSlug = watch("brandSlug");
  const condition = watch("condition");
  const repairs = watch("repairs") ?? [];
  const issues = watch("functionalIssues") ?? [];

  const isApple = brandSlug === "apple";
  const showBattery = isApple || !!model?.supportsBatteryHealth;
  const batteryRequired = !!condition && requiresBatteryHealth({ brandSlug, condition });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ChoiceCards
          name="condition"
          legend={t("gradeTitle")}
          columns={2}
          value={condition}
          onChange={(v) => setField("condition", v)}
          options={PHONE_CONDITIONS.map((c) => {
            const score = conditionScore(c);
            const label = cond(c);
            return {
              value: c,
              title: (
                <>
                  {label === score ? <span className="font-mono">{label}</span> : label}
                  {score && score !== label ? (
                    <span className="font-mono text-muted-foreground">{score}</span>
                  ) : null}
                </>
              ),
              description: t(`grades.${c}`),
            };
          })}
          invalid={!!formState.errors.condition}
          describedBy={formState.errors.condition ? errorId("condition") : undefined}
        />
        <FieldError name="condition" />
      </div>

      {showBattery ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-batteryHealth" className="text-sm font-semibold">
            {t("battery")}
            {batteryRequired ? <span aria-hidden> *</span> : null}
          </label>
          <Input
            id="field-batteryHealth"
            inputMode="numeric"
            className="w-32 font-mono"
            {...register("batteryHealth", {
              setValueAs: (v: string) => (v === "" || v === null ? null : Number(v)),
            })}
            aria-required={batteryRequired || undefined}
            aria-invalid={!!formState.errors.batteryHealth || undefined}
            aria-describedby={[
              "battery-help",
              formState.errors.batteryHealth ? errorId("batteryHealth") : null,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <p id="battery-help" className="text-xs text-muted-foreground">
            {isApple ? t("batteryHelpIphone") : t("batteryHelp")}
          </p>
          <FieldError name="batteryHealth" />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <ChipGroup
          name="screen"
          legend={t("screenTitle")}
          options={SCREEN_CONDITIONS.map((s) => ({ value: s, label: spec(`screenValues.${s}`) }))}
          value={watch("screen")}
          onChange={(v) => setField("screen", v as (typeof SCREEN_CONDITIONS)[number])}
          invalid={!!formState.errors.screen}
          describedBy={formState.errors.screen ? errorId("screen") : undefined}
        />
        <FieldError name="screen" />
      </div>

      <div className="flex flex-col gap-2">
        <ChipGroup
          name="body"
          legend={t("bodyTitle")}
          options={BODY_CONDITIONS.map((b) => ({ value: b, label: spec(`bodyValues.${b}`) }))}
          value={watch("body")}
          onChange={(v) => setField("body", v as (typeof BODY_CONDITIONS)[number])}
          invalid={!!formState.errors.body}
          describedBy={formState.errors.body ? errorId("body") : undefined}
        />
        <FieldError name="body" />
      </div>

      <div className="flex flex-col gap-2">
        <ChipGroup
          name="repairs"
          legend={t("repairsTitle")}
          multiple
          options={REPAIRS.map((r) => ({ value: r, label: spec(`repairValues.${r}`) }))}
          value={repairs}
          onChange={(v) => setField("repairs", exclusiveNone(repairs, v as typeof repairs))}
        />
        <FieldError name="repairs" />
      </div>

      <div className="flex flex-col gap-2">
        <ChipGroup
          name="functionalIssues"
          legend={t("issuesTitle")}
          multiple
          options={FUNCTIONAL_ISSUES.map((i) => ({ value: i, label: spec(`issueValues.${i}`) }))}
          value={issues}
          onChange={(v) => setField("functionalIssues", exclusiveNone(issues, v as typeof issues))}
        />
        <FieldError name="functionalIssues" />
      </div>
    </div>
  );
}
