import type { ReactNode } from "react";
import { MAX_STAGGERED_ITEMS, STAGGER_SECONDS } from "@/lib/motion";

/**
 * Fade + 8px rise on load, CSS-only so the listing grid doesn't pull the motion runtime (plan §14).
 * Server component: without JS the content is still rendered; the animation is a progressive
 * enhancement, disabled under reduced motion in CSS. Stagger caps at 8 items × 30ms.
 */
export function Reveal({ children, index }: { children: ReactNode; index: number }) {
  const delay = Math.min(Math.max(index, 0), MAX_STAGGERED_ITEMS - 1) * STAGGER_SECONDS;
  return (
    <div style={{ animationDelay: `${delay}s` }} className="min-w-0 reveal-on-load">
      {children}
    </div>
  );
}
