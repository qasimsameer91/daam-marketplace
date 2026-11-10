import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface WizardStepperProps {
  /** Step labels in order (the 6 sell screens, plan §8). */
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
  className?: string;
}

/**
 * Sell-wizard progress: "Step 2 of 6" + a progress bar (animated with scaleX, transform only)
 * and, from `md` up, the full list of steps.
 */
export function WizardStepper({ steps, current, className }: WizardStepperProps) {
  const t = useTranslations("Wizard");
  const total = steps.length;
  const index = Math.min(Math.max(current, 0), total - 1);
  const progress = (index + 1) / total;

  return (
    <nav
      data-slot="wizard-stepper"
      aria-label={t("progress")}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">{steps[index]}</span>
        <span className="text-muted-foreground">{t("stepOf", { current: index + 1, total })}</span>
      </div>

      <div
        role="progressbar"
        aria-label={t("progress")}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-valuetext={t("stepOf", { current: index + 1, total })}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full w-full origin-left rounded-full bg-lime transition-transform duration-(--duration-slow) ease-standard rtl:origin-right reduced-motion:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <ol className="hidden gap-2 md:flex">
        {steps.map((label, i) => {
          const state = i < index ? "done" : i === index ? "current" : "upcoming";
          return (
            <li
              key={label}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex flex-1 items-center gap-2 text-xs",
                state === "upcoming" ? "text-muted-foreground" : "text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem]",
                  state === "done" && "border-transparent bg-lime text-ink",
                  state === "current" && "border-foreground font-semibold",
                  state === "upcoming" && "border-input",
                )}
              >
                {state === "done" ? (
                  <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
                ) : (
                  i + 1
                )}
              </span>
              <span className="truncate">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
