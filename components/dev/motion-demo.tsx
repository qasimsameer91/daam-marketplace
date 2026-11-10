"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DaamMeterLive } from "@/components/daam/daam-meter-live";
import { Button } from "@/components/ui/button";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { DAAM_BANDS } from "@/lib/domain/daam-meter";
import { duration, ease, staggerDelay } from "@/lib/motion";

const BANDS = DAAM_BANDS.filter((b) => b !== "unknown");

/** Card reveal stagger (max 8 × 30ms), the publish "stamp", and the live Daam Meter. */
export function MotionDemo() {
  const t = useTranslations("DevDesign.motion");
  const { reduced, variants } = useDaamMotion();
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [band, setBand] = useState<(typeof BANDS)[number]>("great");

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => {
      setBand((b) => BANDS[(BANDS.indexOf(b) + 1) % BANDS.length] ?? "great");
    }, 1800);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  return (
    <div data-testid="motion-demo" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw aria-hidden />
          {t("replay")}
        </Button>
        <Button
          variant="outline"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
          {paused ? t("resume") : t("pause")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {reduced ? t("reducedOn") : t("reducedOff")}
        </span>
      </div>

      <motion.ul
        key={`grid-${run}`}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-2 sm:grid-cols-8"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <motion.li
            key={i}
            variants={{
              ...variants.fadeRise,
              visible: {
                opacity: 1,
                ...(reduced ? {} : { y: 0 }),
                transition: {
                  duration: duration.slow,
                  ease: ease.standard,
                  delay: staggerDelay(i, reduced),
                },
              },
            }}
            className="aspect-[4/5] rounded-card bg-muted"
          />
        ))}
      </motion.ul>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex h-28 w-48 items-center justify-center rounded-card border border-dashed border-input">
          <motion.span
            key={`stamp-${run}`}
            variants={variants.stamp}
            initial="hidden"
            animate="visible"
            className="rounded-s-md bg-lime px-4 py-2 font-mono text-lg font-bold tracking-widest text-ink clip-tag"
          >
            {t("stampLabel")}
          </motion.span>
        </div>
        <DaamMeterLive band={band} size="md" />
      </div>
    </div>
  );
}
