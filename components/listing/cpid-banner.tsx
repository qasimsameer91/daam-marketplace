import { ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Red warning shown on every CPID / patched listing (plan §6.3.2). Body copy comes from content_blocks. */
export function CpidBanner({ body, className }: { body: string; className?: string }) {
  const t = useTranslations("Listing");
  return (
    <div
      data-slot="cpid-banner"
      className={cn("flex gap-3 rounded-card bg-danger p-4 text-ink", className)}
    >
      <ShieldX aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{t("cpidTitle")}</p>
        <p className="text-sm">{body}</p>
      </div>
    </div>
  );
}
