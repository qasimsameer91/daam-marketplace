import { useFormatter, useTranslations } from "next-intl";
import { BatteryPill } from "@/components/daam/battery-pill";
import { ConditionChip } from "@/components/daam/condition-chip";
import type { MockListing } from "@/lib/mock/marketplace";

/** Specification table (plan §7.2). Values are plain text; mono for specs. */
export function SpecTable({ listing, brandName }: { listing: MockListing; brandName: string }) {
  const t = useTranslations("Spec");
  const format = useFormatter();
  const d = listing.detail;

  const list = <T extends string>(values: T[], label: (v: T) => string) =>
    values.length === 0 ? t("none") : values.map(label).join(", ");

  const rows: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: t("brand"), value: brandName },
    { label: t("model"), value: listing.modelName },
    { label: t("storage"), value: `${listing.storage}GB`, mono: true },
    ...(listing.brand === "apple"
      ? []
      : [{ label: t("ram"), value: `${listing.ram}GB`, mono: true }]),
    { label: t("color"), value: d.colorName },
    { label: t("condition"), value: <ConditionChip condition={listing.condition} /> },
    {
      label: t("battery"),
      value:
        listing.batteryHealth !== null ? (
          <BatteryPill health={listing.batteryHealth} />
        ) : (
          t("notSaid")
        ),
    },
    { label: t("screen"), value: t(`screenValues.${d.screen}`) },
    { label: t("body"), value: t(`bodyValues.${d.body}`) },
    { label: t("box"), value: t(`boxValues.${d.boxStatus}`) },
    { label: t("accessories"), value: list(d.accessories, (a) => t(`accessoryValues.${a}`)) },
    {
      label: t("warranty"),
      value:
        d.warranty.type === "none"
          ? t("warrantyValues.none")
          : `${t(`warrantyValues.${d.warranty.type}`)}${
              d.warranty.monthsLeft ? ` · ${t("monthsLeft", { count: d.warranty.monthsLeft })}` : ""
            }`,
    },
    { label: t("repairs"), value: list(d.repairs, (r) => t(`repairValues.${r}`)) },
    { label: t("issues"), value: list(d.functionalIssues, (i) => t(`issueValues.${i}`)) },
    {
      label: t("purchased"),
      value: d.purchaseMonth
        ? format.dateTime(new Date(d.purchaseMonth), { month: "long", year: "numeric" })
        : t("notSaid"),
    },
  ];

  return (
    <dl className="divide-y divide-border rounded-card border border-border">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(7rem,40%)_1fr] gap-3 px-4 py-3 text-sm"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className={row.mono ? "font-mono" : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
