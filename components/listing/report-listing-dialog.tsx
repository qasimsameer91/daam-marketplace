"use client";

import { Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

/** Mirrors the `report_reason` enum (plan §17.1). */
export const REPORT_REASONS = [
  "fake_listing",
  "wrong_pta_status",
  "stolen_device",
  "scam_or_fraud",
  "misleading_price",
  "duplicate",
  "offensive",
  "prohibited_item",
  "other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** Report form UI. Phase 3 only shows a confirmation; Phase 6 writes a `reports` row. */
export function ReportListingDialog() {
  const t = useTranslations("Listing");
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError(true);
      return;
    }
    setOpen(false);
    setReason("");
    setError(false);
    toast.info(t("reportSent"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-fit text-muted-foreground">
          <Flag aria-hidden />
          {t("report")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>{t("reportTitle")}</DialogTitle>
            <DialogDescription>{t("reportBody")}</DialogDescription>
          </DialogHeader>
          <fieldset
            className="flex flex-col gap-1"
            aria-describedby={error ? `${id}-err` : undefined}
          >
            <legend className="mb-2 text-sm font-medium">{t("reportReason")}</legend>
            <RadioGroup
              value={reason}
              onValueChange={(v) => {
                setReason(v as ReportReason);
                setError(false);
              }}
              aria-invalid={error || undefined}
              className="gap-0"
            >
              {REPORT_REASONS.map((r) => (
                <label key={r} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                  <RadioGroupItem value={r} />
                  {t(`reasons.${r}`)}
                </label>
              ))}
            </RadioGroup>
            {error ? (
              <p id={`${id}-err`} className="text-sm text-destructive-text">
                {t("reportNeedReason")}
              </p>
            ) : null}
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-details`} className="text-sm font-medium">
              {t("reportDetails")}
            </label>
            <Textarea id={`${id}-details`} rows={3} maxLength={1000} />
          </div>
          <DialogFooter>
            <Button type="submit">{t("reportSubmit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
