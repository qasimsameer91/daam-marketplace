import { useTranslations } from "next-intl";
export function PreviewNotice() {
  const t = useTranslations("Shell");
  return (
    <p className="rounded-card border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
      {t("notice")}
    </p>
  );
}
