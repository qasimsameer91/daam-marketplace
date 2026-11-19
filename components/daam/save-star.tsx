"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

/** Spec save control: a 34px ink-bordered box that toggles ☆ → ★ (lime fill). Local state. */
export function SaveStar({
  initialSaved = false,
  onToggle,
  className,
}: {
  initialSaved?: boolean;
  onToggle?: (next: boolean) => void;
  className?: string;
}) {
  const t = useTranslations("ListingCard");
  const hydrated = useHydrated();
  const [saved, setSaved] = useState(initialSaved);
  return (
    <button
      type="button"
      disabled={!hydrated}
      aria-pressed={saved}
      aria-label={saved ? t("removeFavorite") : t("addFavorite")}
      onClick={(e) => {
        e.preventDefault();
        const next = !saved;
        setSaved(next);
        onToggle?.(next);
      }}
      className={cn(
        "z-10 flex size-[34px] items-center justify-center border-[1.5px] border-ink text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring",
        saved ? "bg-lime" : "bg-paper/90",
        className,
      )}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}
