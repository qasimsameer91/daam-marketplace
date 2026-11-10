import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Heart, TriangleAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { BatteryPill } from "@/components/daam/battery-pill";
import { BrandTile } from "@/components/daam/brand-tile";
import { ConditionChip } from "@/components/daam/condition-chip";
import { DaamMeter } from "@/components/daam/daam-meter";
import { EmptyState } from "@/components/daam/empty-state";
import { FeaturedTag } from "@/components/daam/featured-tag";
import { ListingCard } from "@/components/daam/listing-card";
import { ListingCardSkeleton } from "@/components/daam/listing-card-skeleton";
import { NetworkLockBadge } from "@/components/daam/network-lock-badge";
import { PriceTag } from "@/components/daam/price-tag";
import { PtaBadge } from "@/components/daam/pta-badge";
import { PtaCheckLabel } from "@/components/daam/pta-check-label";
import { SafetyCard } from "@/components/daam/safety-card";
import { VerifiedBadge } from "@/components/daam/verified-badge";
import { DesignPreviewShell } from "@/components/dev/design-preview-shell";
import { ComponentStates } from "@/components/dev/component-states";
import { FormControlsDemo } from "@/components/dev/form-controls-demo";
import { MotionDemo } from "@/components/dev/motion-demo";
import { OverlaysDemo } from "@/components/dev/overlays-demo";
import { WizardDemo } from "@/components/dev/wizard-demo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { brandColors } from "@/lib/design/tokens";
import { PHONE_CONDITIONS } from "@/lib/domain/condition";
import { DAAM_BANDS } from "@/lib/domain/daam-meter";
import { NETWORK_LOCKS, PTA_STATUSES } from "@/lib/domain/pta";
import { isAppLocale } from "@/lib/i18n/routing";
import {
  DESIGN_NOW,
  sampleBrands,
  sampleCities,
  sampleListings,
  sampleModels,
} from "@/lib/mock/design-samples";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5 border-t border-border py-8">
      <h2 className="text-2xl font-semibold tracking-display">{title}</h2>
      {children}
    </section>
  );
}

const swatches = [
  "bg-ink",
  "bg-paper",
  "bg-lime",
  "bg-graphite",
  "bg-slate",
  "bg-mist",
  "bg-success",
  "bg-warning",
  "bg-danger",
  "bg-info",
  "bg-night",
  "bg-night-surface",
  "bg-night-text",
];

export default async function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const locale = await getLocale();
  if (!isAppLocale(locale)) notFound();
  const t = await getTranslations("DevDesign");
  const empty = await getTranslations("Empty");
  const content = await getSeedContentBlocks(locale);
  return (
    // The kitchen sink needs every namespace on the client (the root provider sends a subset).
    <NextIntlClientProvider messages={await getMessages()}>
      <DesignPreviewShell>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <header className="mb-8 space-y-3">
            <h1 className="text-4xl font-bold tracking-display">{t("title")}</h1>
            <p className="text-muted-foreground">{t("intro")}</p>
          </header>
          <Section title={t("sections.colors")}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {Object.keys(brandColors).map((name, i) => (
                <div key={name} className="overflow-hidden rounded-card border border-border">
                  <div className={`h-20 ${swatches[i]}`} />
                  <p className="p-2 font-mono text-xs">{name}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title={t("sections.type")}>
            <div className="space-y-4">
              {[
                "text-xs",
                "text-sm",
                "text-base",
                "text-lg",
                "text-xl",
                "text-2xl",
                "text-3xl",
                "text-4xl",
                "text-5xl",
                "text-6xl",
              ].map((size) => (
                <p key={size} className={`${size} break-words`}>
                  {t("typeSample")}
                </p>
              ))}
              <p className="font-mono" dir="ltr">
                {t("monoSample")}
              </p>
            </div>
          </Section>
          <Section title={t("sections.buttons")}>
            <div className="flex flex-wrap gap-3">
              {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
                (variant, i) => (
                  <Button key={variant} variant={variant}>
                    {t(
                      `buttons.${(["primary", "secondary", "outline", "ghost", "destructive", "link"] as const)[i] ?? "primary"}`,
                    )}
                  </Button>
                ),
              )}
              <Button disabled>{t("buttons.disabled")}</Button>
            </div>
          </Section>
          <Section title={t("sections.forms")}>
            <FormControlsDemo cities={sampleCities} />
          </Section>
          <Section title={t("sections.status")}>
            <div className="flex flex-wrap gap-3">
              {PTA_STATUSES.map((status) => (
                <PtaBadge key={status} status={status} detailed />
              ))}
              {NETWORK_LOCKS.map((lock) => (
                <NetworkLockBadge key={lock} lock={lock} />
              ))}
              <PtaBadge status="non_pta" networkLock="jv" />
              <PtaBadge status="pta_approved" networkLock="factory_unlocked" />
            </div>
            <div className="flex flex-col gap-3">
              <PtaCheckLabel source="seller_declared" checkedAt={null} now={DESIGN_NOW} />
              <PtaCheckLabel source="daam_checked" checkedAt={DESIGN_NOW} now={DESIGN_NOW} />
            </div>
          </Section>
          <Section title={t("sections.condition")}>
            <div className="flex flex-wrap gap-3">
              {PHONE_CONDITIONS.map((condition) => (
                <ConditionChip key={condition} condition={condition} />
              ))}
              {[100, 85, 80, 79, 0].map((health) => (
                <BatteryPill key={health} health={health} />
              ))}
            </div>
          </Section>
          <Section title={t("sections.meter")}>
            <div className="flex flex-wrap gap-4">
              {DAAM_BANDS.map((band) => (
                <DaamMeter key={band} band={band} showUnknown />
              ))}
              <DaamMeter band="fair" range={{ low: 120000, high: 150000 }} />
            </div>
          </Section>
          <Section title={t("sections.trust")}>
            <div className="flex flex-wrap items-center gap-3">
              {(["id", "shop", "trusted", "founding"] as const).map((kind) => (
                <VerifiedBadge key={kind} kind={kind} />
              ))}
              <Avatar>
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <Badge>{t("title")}</Badge>
              <FeaturedTag />
            </div>
          </Section>
          <Section title={t("sections.price")}>
            <div className="flex flex-wrap items-center gap-6">
              <PriceTag amount={125000} size="lg" negotiable />
              <PriceTag amount={125000} short negotiable={false} />
              <PriceTag amount={125000} variant="tag" />
            </div>
          </Section>
          <Section title={t("sections.cards")}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sampleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} now={DESIGN_NOW} />
              ))}
            </div>
          </Section>
          <Section title={t("sections.tiles")}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sampleBrands.map((brand) => (
                <BrandTile
                  key={brand.slug}
                  name={brand.name}
                  href="/dev/design"
                  count={brand.count}
                />
              ))}
            </div>
          </Section>
          <Section title={t("sections.states")}>
            <div className="grid gap-4 md:grid-cols-3">
              <EmptyState
                icon={Heart}
                title={empty("favorites.title")}
                description={empty("favorites.body")}
              />
              <EmptyState
                icon={TriangleAlert}
                variant="error"
                title={empty("error.title")}
                description={empty("error.body")}
              />
              <ListingCardSkeleton />
            </div>
          </Section>
          <Section title={t("sections.safety")}>
            <SafetyCard
              title={t("sections.safety")}
              tips={[...content]
                .filter(([key]) => key.startsWith("safety.meetup."))
                .map(([, body]) => body)}
            />
          </Section>
          <Section title={t("sections.wizard")}>
            <WizardDemo />
          </Section>
          <Section title={t("sections.overlays")}>
            <OverlaysDemo models={sampleModels} />
          </Section>
          <Separator />
          <Section title={t("sections.motion")}>
            <MotionDemo />
          </Section>
          <Section title={t("states.title")}>
            <ComponentStates />
          </Section>
        </main>
      </DesignPreviewShell>
    </NextIntlClientProvider>
  );
}
