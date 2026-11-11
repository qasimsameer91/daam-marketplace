"use client";

import { LazyMotion } from "motion/react";
import { Direction } from "radix-ui";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

/** Load Motion's DOM features lazily: a separate chunk, kept out of every page's initial JS. */
const loadFeatures = () => import("@/lib/motion-features").then((m) => m.domAnimation);

/** Client-side providers shared by every page: Radix reading direction, tooltips, lazy motion. */
export function AppProviders({ dir, children }: { dir: "ltr" | "rtl"; children: ReactNode }) {
  return (
    <Direction.Provider dir={dir}>
      <LazyMotion features={loadFeatures}>
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </LazyMotion>
    </Direction.Provider>
  );
}
