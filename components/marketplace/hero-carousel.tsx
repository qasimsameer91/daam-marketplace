"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  { src: "/campaigns/hero-soch.png", alt: "Soch kya rahe ho" },
  { src: "/campaigns/hero-purana.png", alt: "Purana bechna hai na" },
  { src: "/campaigns/hero-naya.png", alt: "Naya ho ya purana" },
];

const INTERVAL = 5000;

export function HeroCarousel() {
  const t = useTranslations("DaamHome");
  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = SLIDES.length;

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((s) => (s + 1) % count), INTERVAL);
  }, [count]);

  useEffect(() => {
    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [start]);

  const go = useCallback(
    (i: number) => {
      setSlide(((i % count) + count) % count);
      start();
    },
    [count, start],
  );

  return (
    <div className="relative overflow-hidden bg-[#e9e4f2]">
      <div
        className="flex transition-transform duration-[550ms] ease-[cubic-bezier(.4,0,.1,1)] reduced-motion:transition-none"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div key={s.src} className="aspect-[16/8] shrink-0 grow-0 basis-full">
            <Image
              src={s.src}
              alt={s.alt}
              width={1440}
              height={720}
              priority={i === 0}
              sizes="(min-width:1440px) 1440px, 100vw"
              className="block h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => go(slide - 1)}
        aria-label={t("carouselPrev")}
        className="absolute start-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper/90 text-xl font-bold text-ink rtl:rotate-180"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(slide + 1)}
        aria-label={t("carouselNext")}
        className="absolute end-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper/90 text-xl font-bold text-ink rtl:rotate-180"
      >
        ›
      </button>
      <div className="absolute bottom-[18px] left-1/2 flex -translate-x-1/2 gap-[9px]">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`${t("goToSlide")} ${i + 1}`}
            aria-current={slide === i ? "true" : undefined}
            className={cn(
              "h-3 border-2 border-ink transition-[width] duration-300",
              slide === i ? "w-7 bg-lime" : "w-3 bg-paper/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
