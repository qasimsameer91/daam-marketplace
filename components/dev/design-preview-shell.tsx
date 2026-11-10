"use client";

import { Languages, Monitor, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type ReactNode } from "react";
import { ReducedMotionOverride } from "@/components/motion/reduced-motion-override";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme, type ThemePreference } from "@/hooks/use-theme";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const THEMES: { value: ThemePreference; Icon: typeof Sun }[] = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor },
];

/** Sticky toolbar (theme, language, reduced-motion preview) wrapping the design page. */
export function DesignPreviewShell({ children }: { children: ReactNode }) {
  const t = useTranslations("DevDesign");
  const tTheme = useTranslations("Theme");
  const tHome = useTranslations("Home");
  const locale = useLocale();
  const pathname = usePathname();
  const { preference, setPreference } = useTheme();
  const [reduced, setReduced] = useState(false);
  const themeGroup = useId();

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 md:px-6 lg:px-8">
          <div
            role="radiogroup"
            aria-label={tTheme("label")}
            className="flex rounded-button border border-border p-0.5"
          >
            {THEMES.map(({ value, Icon }) => (
              <label
                key={value}
                className={cn(
                  "relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-sm has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  preference === value
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name={themeGroup}
                  value={value}
                  checked={preference === value}
                  onChange={() => setPreference(value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
                <Icon aria-hidden className="size-4" />
                {tTheme(value)}
              </label>
            ))}
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href={pathname} locale={locale === "en" ? "ur" : "en"}>
              <Languages aria-hidden />
              {tHome("switchLanguage")}
            </Link>
          </Button>

          <label className="ms-auto flex min-h-11 cursor-pointer items-center gap-2 text-sm">
            <Switch checked={reduced} onCheckedChange={setReduced} />
            {t("toggles.reducedMotion")}
          </label>
        </div>
      </div>
      <ReducedMotionOverride reduced={reduced}>{children}</ReducedMotionOverride>
    </>
  );
}
