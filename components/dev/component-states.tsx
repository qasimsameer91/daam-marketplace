import { Heart, LoaderCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BatteryPill } from "@/components/daam/battery-pill";
import { ConditionChip } from "@/components/daam/condition-chip";
import { DaamMeter } from "@/components/daam/daam-meter";
import { NetworkLockBadge } from "@/components/daam/network-lock-badge";
import { PriceTag } from "@/components/daam/price-tag";
import { PtaBadge } from "@/components/daam/pta-badge";
import { PtaCheckLabel } from "@/components/daam/pta-check-label";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { Button } from "@/components/ui/button";
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
import { PHONE_CONDITIONS } from "@/lib/domain/condition";
import { DAAM_BANDS } from "@/lib/domain/daam-meter";
import { NETWORK_LOCKS, PTA_STATUSES } from "@/lib/domain/pta";
import { DESIGN_NOW } from "@/lib/mock/design-samples";

/** Explicit state/size matrix, isolated from the interactive examples above it. */
export async function ComponentStates() {
  const t = await getTranslations("DevDesign.states");
  const common = await getTranslations("Common");
  const buttons = await getTranslations("DevDesign.buttons");
  const forms = await getTranslations("DevDesign.forms");
  return (
    <div data-testid="component-states" className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-semibold">{t("buttons")}</h3>
        {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
          (variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {buttons("primary")}
                </Button>
              ))}
              <Button variant={variant} disabled>
                {buttons("disabled")}
              </Button>
              <Button variant={variant} disabled aria-busy="true">
                <LoaderCircle aria-hidden className="animate-spin reduced-motion:animate-none" />
                {common("loading")}
              </Button>
            </div>
          ),
        )}
        <div className="flex flex-wrap items-center gap-3">
          {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={t("iconButton")}>
              <Heart aria-hidden />
            </Button>
          ))}
        </div>
      </div>
      <fieldset
        disabled
        className="grid gap-4 rounded-card border border-border p-4 sm:grid-cols-2"
      >
        <legend className="px-2 font-semibold">{t("disabled")}</legend>
        <label className="space-y-2">
          <span className="text-sm">{forms("search")}</span>
          <Input disabled defaultValue="iPhone 14 Pro" />
        </label>
        <label className="space-y-2">
          <span className="text-sm">{forms("description")}</span>
          <Textarea disabled />
        </label>
        <Select disabled>
          <SelectTrigger aria-label={forms("city")} className="w-full">
            <SelectValue placeholder={forms("cityPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lahore">Lahore</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <Checkbox disabled defaultChecked />
          {forms("negotiable")}
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <Switch disabled />
          {forms("whatsapp")}
        </label>
        <RadioGroup disabled defaultValue="grade_9" aria-label={forms("condition")}>
          <label className="flex min-h-11 items-center gap-3">
            <RadioGroupItem disabled value="grade_9" />
            <ConditionChip condition="grade_9" />
          </label>
        </RadioGroup>
        <Slider
          disabled
          defaultValue={[85]}
          min={80}
          max={100}
          aria-label={forms("battery", { value: 85 })}
        />
      </fieldset>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <Checkbox defaultChecked="indeterminate" />
          {t("indeterminate")}
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <Checkbox />
          {t("unchecked")}
        </label>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">{t("badgeSizes")}</h3>
        {(["sm", "md"] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            {PTA_STATUSES.map((status) => (
              <PtaBadge key={status} status={status} size={size} />
            ))}
            {NETWORK_LOCKS.map((lock) => (
              <NetworkLockBadge key={lock} lock={lock} size={size} />
            ))}
            {PHONE_CONDITIONS.map((condition) => (
              <ConditionChip key={condition} condition={condition} size={size} />
            ))}
            {[0, 79, 80, 85, 100].map((health) => (
              <BatteryPill key={health} health={health} size={size} />
            ))}
            {DAAM_BANDS.map((band) => (
              <DaamMeter key={band} band={band} size={size} showUnknown />
            ))}
            {(["id", "shop", "trusted", "founding"] as const).map((kind) => (
              <VerifiedBadge key={kind} kind={kind} size={size} iconOnly />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">{t("priceSizes")}</h3>
        <div className="flex flex-wrap items-center gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <PriceTag key={size} amount={125000} size={size} variant="tag" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">{t("expiredCheck")}</h3>
        <PtaCheckLabel source="daam_checked" checkedAt="2026-09-01T12:00:00Z" now={DESIGN_NOW} />
      </div>
    </div>
  );
}
