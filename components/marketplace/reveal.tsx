"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { staggerDelay } from "@/lib/motion";
export function Reveal({ children, index }: { children: ReactNode; index: number }) {
  const { reduced } = useDaamMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduced ? { opacity: 1 } : { opacity: [0.65, 1], y: [8, 0] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.2, delay: staggerDelay(index, reduced) }}
      className="min-w-0"
    >
      {children}
    </motion.div>
  );
}
