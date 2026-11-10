"use client";

import { ArrowLeft, ArrowRight, Check, Eye, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { WizardStepper } from "@/components/daam/wizard-stepper";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-daam-motion";
import { useSellDraft } from "@/hooks/use-sell-draft";
import { duration, ease } from "@/lib/motion";
import {
  STEP_FIELDS,
  WIZARD_STEPS,
  createListingSchema,
  createStepSchema,
  emptyListingDraft,
  type ListingField,
  type ListingInput,
  type WizardStep,
} from "@/lib/validation/listing";
import { variantLabel } from "@/lib/domain/variant";
import { SellFormProvider, type SellData } from "./sell-form-context";
import { SellPreview } from "./sell-preview";
import { SellSuccess } from "./sell-success";
import { StepCondition } from "./step-condition";
import { StepExtras } from "./step-extras";
import { StepPhone } from "./step-phone";
import { StepPhotos } from "./step-photos";
import { StepPrice } from "./step-price";
import { StepPta } from "./step-pta";

type Screen = number | "preview" | "success";
const LAST = WIZARD_STEPS.length - 1;

function currentMonth(now: Date) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Sell wizard (plan §8): 6 screens with a progress bar, horizontal slide between screens,
 * per-screen Zod validation (shared schema), local autosave, preview and a stamp on publish.
 */
export function SellWizard(data: SellData) {
  const t = useTranslations("Sell");
  const tSteps = useTranslations("Sell.steps");
  const common = useTranslations("Common");
  const rtl = useLocale() === "ur";
  const reduced = usePrefersReducedMotion();
  const form = useForm<ListingInput>({ defaultValues: emptyListingDraft() });
  const [screen, setScreen] = useState<Screen>(0);
  const [direction, setDirection] = useState(1);
  const [publishedTitle, setPublishedTitle] = useState("");
  const [now] = useState(() => new Date());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepIndex = typeof screen === "number" ? screen : LAST;
  const draft = useSellDraft(form, stepIndex, (n) => setScreen(n));

  // Free photo blob URLs when the wizard goes away.
  useEffect(
    () => () => form.getValues("photos")?.forEach((p) => URL.revokeObjectURL(p.url)),
    [form],
  );

  const go = (next: Screen) => {
    const from = typeof screen === "number" ? screen : LAST + 1;
    const to = typeof next === "number" ? next : LAST + 1;
    setDirection(to >= from ? 1 : -1);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  /** Apply Zod issues to the form and focus the first invalid field. */
  const applyIssues = (
    issues: { path: PropertyKey[]; message: string }[],
    fields: readonly ListingField[],
  ) => {
    form.clearErrors(fields as ListingField[]);
    let first: ListingField | null = null;
    for (const issue of issues) {
      const field = issue.path[0] as ListingField;
      if (!fields.includes(field) || form.getFieldState(field).error) continue;
      form.setError(field, { type: "zod", message: issue.message });
      first ??= field;
    }
    if (first) requestAnimationFrame(() => document.getElementById(`field-${first}`)?.focus());
    return first;
  };

  const validateStep = (step: WizardStep) => {
    const result = createStepSchema(step, { now }).safeParse(form.getValues());
    if (result.success) {
      form.clearErrors([...STEP_FIELDS[step]]);
      return true;
    }
    applyIssues(result.error.issues, STEP_FIELDS[step]);
    return false;
  };

  const next = () => {
    if (typeof screen !== "number") return;
    const step = WIZARD_STEPS[screen];
    if (!step || !validateStep(step)) return;
    go(screen === LAST ? "preview" : screen + 1);
  };

  const publish = () => {
    const values = form.getValues();
    const result = createListingSchema({ now }).safeParse(values);
    if (!result.success) {
      // Send the seller to the first screen with a problem.
      const fields = new Set(result.error.issues.map((i) => i.path[0] as ListingField));
      const target = WIZARD_STEPS.findIndex((s) => STEP_FIELDS[s].some((f) => fields.has(f)));
      const index = Math.max(target, 0);
      go(index);
      const step = WIZARD_STEPS[index]!;
      requestAnimationFrame(() => applyIssues(result.error.issues, STEP_FIELDS[step]));
      return;
    }
    const model = data.catalog.models.find((m) => m.slug === values.modelSlug);
    const name = model?.name ?? `${values.customBrand} ${values.customModel}`.trim();
    setPublishedTitle(
      values.storageGb ? `${name} ${variantLabel(values.ramGb ?? null, values.storageGb)}` : name,
    );
    draft.clear();
    go("success");
  };

  const startOver = () => {
    form.getValues("photos")?.forEach((p) => URL.revokeObjectURL(p.url));
    form.reset(emptyListingDraft());
    draft.clear();
    go(0);
  };

  const offset = (rtl ? -1 : 1) * direction * 24;
  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: offset },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -offset },
      };

  const stepNames = WIZARD_STEPS.map((s) => tSteps(s));
  const heading =
    screen === "preview"
      ? t("preview.title")
      : screen === "success"
        ? t("success.title")
        : stepNames[stepIndex];

  return (
    <SellFormProvider form={form} data={data}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-display">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
          <p className="text-xs text-muted-foreground">{t("previewNote")}</p>
        </header>

        {draft.restored && screen !== "success" ? (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-muted p-3 text-sm"
          >
            {t("draftRestored")}
            <Button type="button" variant="outline" size="sm" onClick={startOver}>
              <RotateCcw aria-hidden />
              {t("startOver")}
            </Button>
          </div>
        ) : null}

        {typeof screen === "number" ? <WizardStepper steps={stepNames} current={screen} /> : null}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (screen === "preview") publish();
            else next();
          }}
          className="flex flex-col gap-6 pb-28 md:pb-0"
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className={screen === "success" ? "sr-only" : "text-xl font-semibold outline-none"}
          >
            {heading}
          </h2>

          <div className="overflow-x-clip">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={String(screen)}
                {...slide}
                transition={{ duration: duration.base, ease: ease.standard }}
              >
                {screen === 0 ? <StepPhone /> : null}
                {screen === 1 ? <StepPta /> : null}
                {screen === 2 ? <StepCondition /> : null}
                {screen === 3 ? <StepExtras maxMonth={currentMonth(now)} /> : null}
                {screen === 4 ? <StepPhotos /> : null}
                {screen === 5 ? <StepPrice /> : null}
                {screen === "preview" ? (
                  <SellPreview now={now} onEdit={(s) => go(WIZARD_STEPS.indexOf(s))} />
                ) : null}
                {screen === "success" ? (
                  <SellSuccess title={publishedTitle} onAnother={startOver} />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {screen !== "success" ? (
            <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex gap-3 border-t border-border bg-background/95 p-3 backdrop-blur md:static md:z-auto md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
              <Button
                type="button"
                variant="outline"
                className="flex-1 md:flex-none"
                disabled={screen === 0}
                onClick={() =>
                  go(screen === "preview" ? LAST : Math.max(0, (screen as number) - 1))
                }
              >
                <ArrowLeft aria-hidden className="rtl:rotate-180" />
                {common("back")}
              </Button>
              <Button type="submit" className="flex-1 md:ms-auto md:flex-none">
                {screen === "preview" ? (
                  <>
                    <Check aria-hidden />
                    {t("publish")}
                  </>
                ) : screen === LAST ? (
                  <>
                    <Eye aria-hidden />
                    {t("toPreview")}
                  </>
                ) : (
                  <>
                    {common("next")}
                    <ArrowRight aria-hidden className="rtl:rotate-180" />
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </form>
      </div>
    </SellFormProvider>
  );
}
