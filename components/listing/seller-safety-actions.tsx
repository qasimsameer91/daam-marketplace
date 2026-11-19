"use client";

import { Ban, Flag, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_REASONS, type ReportReason } from "./report-listing-dialog";

/**
 * Report / Block the seller (a person) from the listing page. Phase 3 mock: it surfaces a
 * confirmation and keeps block state locally. Phase 6 wires `reports` + `blocked_users` rows,
 * and a blocked seller's contact actions stay hidden server-side.
 */
export function SellerSafetyActions({ sellerName }: { sellerName: string }) {
  const t = useTranslations("Listing");
  const id = useId();
  const [blocked, setBlocked] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [error, setError] = useState(false);

  const submitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError(true);
      return;
    }
    setReportOpen(false);
    setReason("");
    setError(false);
    toast.info(t("userReported"));
  };

  if (blocked) {
    return (
      <div className="flex flex-col gap-2 border-t-[1.5px] border-ink/[0.18] pt-4">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldOff aria-hidden className="mt-0.5 size-4 shrink-0" />
          {t("blockedNote")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => {
            setBlocked(false);
            toast.info(t("userUnblocked"));
          }}
        >
          {t("unblockUser")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 border-t-[1.5px] border-ink/[0.18] pt-4">
      {/* REPORT */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Flag aria-hidden />
            {t("reportUser")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <form onSubmit={submitReport} className="flex flex-col gap-4" noValidate>
            <DialogHeader>
              <DialogTitle>{t("reportUserTitle")}</DialogTitle>
              <DialogDescription>{t("reportUserBody")}</DialogDescription>
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
                  <label
                    key={r}
                    className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
                  >
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

      {/* BLOCK */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Ban aria-hidden />
            {t("blockUser")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("blockTitle")}</DialogTitle>
            <DialogDescription>{t("blockBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  setBlocked(true);
                  toast.info(t("userBlocked"));
                }}
              >
                <Ban aria-hidden />
                {t("blockConfirm")} {sellerName}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
