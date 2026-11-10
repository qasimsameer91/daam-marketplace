"use client";

import { Direction } from "radix-ui";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyMotion, domAnimation } from "motion/react";

/** Client-side providers shared by every page: reading direction for Radix primitives, tooltips. */
export function AppProviders({ dir, children }: { dir: "ltr" | "rtl"; children: ReactNode }) {
  return (
    <Direction.Provider dir={dir}>
      <LazyMotion features={domAnimation}>
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </LazyMotion>
    </Direction.Provider>
  );
}
