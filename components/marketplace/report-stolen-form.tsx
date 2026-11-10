"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isValidImei } from "@/lib/domain/imei";

/**
 * Stolen-phone report UI (Phase 3). The IMEI stays in the browser here; Phase 6 sends it to a
 * server action that stores only an HMAC hash + last 4 digits. Never log or echo it.
 */
export function ReportStolenForm({ brands }: { brands: { slug: string; name: string }[] }) {
  const t = useTranslations("Pages.reportStolen");
  const id = useId();
  const [imeiError, setImeiError] = useState(false);
  const [brand, setBrand] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imei = String(new FormData(e.currentTarget).get("imei") ?? "");
    if (!isValidImei(imei)) {
      setImeiError(true);
      return;
    }
    setImeiError(false);
    e.currentTarget.reset();
    setBrand("");
    toast.info(t("sent"));
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <p className="rounded-card bg-muted p-3 text-sm text-muted-foreground">{t("previewNote")}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-imei`} className="text-sm font-medium">
          {t("imei")}
        </label>
        <Input
          id={`${id}-imei`}
          name="imei"
          inputMode="numeric"
          autoComplete="off"
          maxLength={20}
          className="font-mono"
          aria-invalid={imeiError || undefined}
          aria-describedby={`${id}-imei-help${imeiError ? ` ${id}-imei-err` : ""}`}
        />
        <p id={`${id}-imei-help`} className="text-sm text-muted-foreground">
          {t("imeiHelp")}
        </p>
        {imeiError ? (
          <p id={`${id}-imei-err`} className="text-sm text-destructive-text">
            {t("imeiInvalid")}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-brand`} className="text-sm font-medium">
          {t("brand")}
        </span>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger aria-labelledby={`${id}-brand`} className="w-full">
            <SelectValue placeholder={t("brandPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b.slug} value={b.slug}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-model`} className="text-sm font-medium">
          {t("model")}
        </label>
        <Input id={`${id}-model`} name="model" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-police`} className="text-sm font-medium">
          {t("police")}
        </label>
        <Input id={`${id}-police`} name="police" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-details`} className="text-sm font-medium">
          {t("details")}
        </label>
        <Textarea id={`${id}-details`} name="details" rows={4} maxLength={1000} />
      </div>
      <p className="flex gap-2 text-sm text-muted-foreground">
        <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
        {t("privacyNote")}
      </p>
      <Button type="submit" className="w-full sm:w-fit">
        {t("submit")}
      </Button>
    </form>
  );
}
