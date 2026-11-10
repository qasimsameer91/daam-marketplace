"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { DaamMeter } from "./daam-meter";

/** Daam Meter that pops when the band changes (sell wizard live price, plan §14). */
export function DaamMeterLive(props: ComponentProps<typeof DaamMeter>) {
  const { variants } = useDaamMotion();
  return (
    <span aria-live="polite" className="inline-flex">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={props.band}
          variants={variants.pop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-flex"
        >
          <DaamMeter {...props} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
