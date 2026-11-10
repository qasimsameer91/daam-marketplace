"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { ConditionChip } from "@/components/daam/condition-chip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { PhoneCondition } from "@/lib/domain/condition";

const DEMO_CONDITIONS: PhoneCondition[] = ["like_new", "grade_9", "grade_8"];

export function FormControlsDemo({ cities }: { cities: string[] }) {
  const t = useTranslations("DevDesign.forms");
  const id = useId();
  const [battery, setBattery] = useState(85);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-search`} className="text-sm font-medium">
            {t("search")}
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id={`${id}-search`}
              type="search"
              placeholder={t("searchPlaceholder")}
              className="ps-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-phone`} className="text-sm font-medium">
            {t("invalid")}
          </label>
          <Input
            id={`${id}-phone`}
            inputMode="tel"
            defaultValue="0300-12"
            aria-invalid
            aria-describedby={`${id}-phone-error`}
            className="font-mono"
          />
          <p id={`${id}-phone-error`} className="text-sm text-destructive-text">
            {t("invalid")}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span id={`${id}-city`} className="text-sm font-medium">
            {t("city")}
          </span>
          <Select>
            <SelectTrigger aria-labelledby={`${id}-city`} className="w-full">
              <SelectValue placeholder={t("cityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-desc`} className="text-sm font-medium">
            {t("description")}
          </label>
          <Textarea id={`${id}-desc`} placeholder={t("descriptionPlaceholder")} rows={3} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <Checkbox defaultChecked />
          {t("negotiable")}
        </label>
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
          {t("whatsapp")}
          <Switch defaultChecked />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">{t("condition")}</legend>
          <RadioGroup defaultValue="grade_9" className="gap-1">
            {DEMO_CONDITIONS.map((c) => (
              <label key={c} className="flex min-h-11 cursor-pointer items-center gap-3">
                <RadioGroupItem value={c} />
                <ConditionChip condition={c} />
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        <div className="flex flex-col gap-3">
          <span id={`${id}-battery`} className="text-sm font-medium">
            {t("battery", { value: battery })}
          </span>
          <Slider
            aria-labelledby={`${id}-battery`}
            min={80}
            max={100}
            step={5}
            value={[battery]}
            onValueChange={(v) => setBattery(v[0] ?? 80)}
          />
        </div>
      </div>
    </div>
  );
}
