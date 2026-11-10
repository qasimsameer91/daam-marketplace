"use client";

import { MessageCircle, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { Link } from "@/lib/i18n/navigation";

/** Publish success (plan §8, §14): the price tag stamps "LISTED", then share / next actions. */
export function SellSuccess({ title, onAnother }: { title: string; onAnother: () => void }) {
  const t = useTranslations("Sell.success");
  const { variants } = useDaamMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  // Share text names the phone only: no phone number or IMEI ever goes into a link.
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(t("shareText", { title }))}`;

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex h-36 w-full max-w-xs items-center justify-center">
        <motion.span
          variants={variants.stamp}
          initial="hidden"
          animate="visible"
          className="rounded-s-md bg-lime px-6 py-3 font-mono text-2xl font-bold tracking-widest text-ink clip-tag"
        >
          {t("stamp")}
        </motion.span>
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-semibold tracking-display outline-none"
      >
        {t("title")}
      </h2>
      <p className="max-w-md text-muted-foreground" role="status">
        {t("body")}
      </p>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden />
            {t("share")}
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/phones">{t("dashboard")}</Link>
        </Button>
        <Button variant="ghost" onClick={onAnother}>
          <Plus aria-hidden />
          {t("another")}
        </Button>
      </div>
    </div>
  );
}
