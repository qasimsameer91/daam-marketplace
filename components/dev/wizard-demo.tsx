"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { WizardStepper } from "@/components/daam/wizard-stepper";
import { Button } from "@/components/ui/button";

const STEP_KEYS = ["phone", "pta", "condition", "extras", "photos", "price"] as const;

export function WizardDemo() {
  const t = useTranslations("Sell.steps");
  const tCommon = useTranslations("Common");
  const [current, setCurrent] = useState(1);
  const steps = STEP_KEYS.map((k) => t(k));

  return (
    <div className="flex flex-col gap-4">
      <WizardStepper steps={steps} current={current} />
      <div className="flex gap-3">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          <ArrowLeft aria-hidden className="rtl:rotate-180" />
          {tCommon("back")}
        </Button>
        <Button
          disabled={current === steps.length - 1}
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
        >
          {tCommon("next")}
          <ArrowRight aria-hidden className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
