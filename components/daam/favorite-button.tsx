"use client";

import { Heart } from "lucide-react";
import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-daam-motion";
import { useHydrated } from "@/hooks/use-hydrated";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  initialFavorited?: boolean;
  /** Persist the change (server action in Phase 6). Optimistic: the heart flips immediately. */
  onToggle?: (next: boolean) => void;
  className?: string;
}

/** Heart toggle on listing cards: a 44px tap target around a 36px visual. */
export function FavoriteButton({
  initialFavorited = false,
  onToggle,
  className,
}: FavoriteButtonProps) {
  const t = useTranslations("ListingCard");
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  const [favorited, setFavorited] = useState(initialFavorited);

  return (
    <button
      type="button"
      disabled={!hydrated}
      aria-pressed={favorited}
      aria-label={favorited ? t("removeFavorite") : t("addFavorite")}
      onClick={() => {
        const next = !favorited;
        setFavorited(next);
        onToggle?.(next);
      }}
      className={cn(
        "group/fav relative z-10 inline-flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur">
        <m.span
          key={String(favorited)}
          initial={reduced ? { opacity: 0.4 } : { scale: 0.6 }}
          animate={reduced ? { opacity: 1 } : { scale: 1 }}
          transition={spring}
          className="inline-flex"
        >
          <Heart
            aria-hidden
            strokeWidth={1.75}
            className={cn("size-5", favorited && "fill-current")}
          />
        </m.span>
      </span>
    </button>
  );
}
