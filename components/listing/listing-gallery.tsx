"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Listing photos: swipeable (CSS scroll-snap) on mobile, main image + thumbnails on desktop,
 * and a full-screen viewer with arrow-key navigation. First photo is eager (LCP).
 */
export function ListingGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const t = useTranslations("Listing.gallery");
  const rtl = useLocale() === "ur";
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  // Mobile strip: keep the counter in sync with the swiped-to photo.
  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (i !== index && i < total) setIndex(i);
  };

  const onViewerKey = (e: KeyboardEvent) => {
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) go(index + 1);
    if (e.key === back) go(index - 1);
  };

  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <section aria-label={t("label")} className="flex flex-col gap-3">
      {/* Mobile: swipe */}
      <div className="relative md:hidden">
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto rounded-card"
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              aria-label={t("open", { n: i + 1 })}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-muted"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute end-3 bottom-3 rounded-chip bg-background/85 px-2.5 py-1 font-mono text-xs backdrop-blur">
          <span className="sr-only">{t("photo", { n: index + 1, total })}</span>
          <span aria-hidden>
            {index + 1}/{total}
          </span>
        </span>
      </div>

      {/* Desktop: main + thumbnails */}
      <div className="hidden flex-col gap-3 md:flex">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("open", { n: index + 1 })}
          className="group relative aspect-[4/5] overflow-hidden rounded-card bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1280px) 600px, 50vw"
            className="object-cover"
          />
          <span className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-background/85 opacity-0 backdrop-blur transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand aria-hidden className="size-4" />
          </span>
        </button>
        {total > 1 ? (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("photo", { n: i + 1, total })}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-button bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === index ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onKeyDown={onViewerKey}
          className="flex h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] flex-col gap-3 p-3 sm:max-w-4xl"
        >
          <DialogTitle className="pe-10 text-sm">{t("fullscreen", { title })}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("photo", { n: index + 1, total })}
          </DialogDescription>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-button bg-muted">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {total > 1 ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => go(index - 1)}
                aria-label={t("prev")}
              >
                <ChevronLeft aria-hidden className="rtl:rotate-180" />
              </Button>
              <span className="font-mono text-sm" aria-live="polite">
                {index + 1}/{total}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => go(index + 1)}
                aria-label={t("next")}
              >
                <ChevronRight aria-hidden className="rtl:rotate-180" />
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
