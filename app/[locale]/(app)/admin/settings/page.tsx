import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { chipBase, chipSizes, toneClasses } from "@/components/daam/tone-classes";
import { adminSettings } from "@/lib/mock/admin";
import { cn } from "@/lib/utils";

const BOOL_KEYS = [
  "allowCpidListings",
  "requireImeiForShops",
  "autoApproveTrustedShops",
  "maintenanceMode",
] as const;

function BoolPill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={cn(chipBase, chipSizes.sm, on ? toneClasses.success : toneClasses.neutral)}>
      {on ? <Check aria-hidden /> : <X aria-hidden />}
      {on ? onLabel : offLabel}
    </span>
  );
}

export default async function AdminSettingsPage() {
  const t = await getTranslations("Admin");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">{t("settings.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.intro")}</p>
      </div>

      <p className="rounded-card border border-border bg-warning/15 p-4 text-sm text-warning-ink">
        {t("settings.readOnly")}
      </p>

      <section className="rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <p className="font-medium">{t("settings.maxFreeListings")}</p>
            <p className="text-xs text-muted-foreground">{t("settings.maxFreeListingsHint")}</p>
          </div>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {adminSettings.maxFreeListingsIndividual}
          </span>
        </div>
        {BOOL_KEYS.map((key, i) => (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between gap-4 p-5",
              i < BOOL_KEYS.length - 1 && "border-b border-border",
            )}
          >
            <div className="min-w-0">
              <p className="font-medium">{t(`settings.${key}`)}</p>
              <p className="text-xs text-muted-foreground">{t(`settings.${key}Hint`)}</p>
            </div>
            <BoolPill
              on={adminSettings[key]}
              onLabel={t("settings.on")}
              offLabel={t("settings.off")}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
