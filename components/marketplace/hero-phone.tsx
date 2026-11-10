"use client";
import Image from "next/image";
import { m } from "motion/react";
import { useState } from "react";
import { useDaamMotion } from "@/hooks/use-daam-motion";
import { PriceTag } from "@/components/daam/price-tag";
export function HeroPhone() {
  const { reduced } = useDaamMotion();
  const [point, setPoint] = useState({ x: 0, y: 0 });
  return (
    <div
      aria-hidden
      className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !matchMedia("(min-width: 1024px)").matches)
          return;
        const r = e.currentTarget.getBoundingClientRect();
        setPoint({
          x: ((e.clientX - r.x) / r.width - 0.5) * 12,
          y: ((e.clientY - r.y) / r.height - 0.5) * 12,
        });
      }}
      onPointerLeave={() => setPoint({ x: 0, y: 0 })}
    >
      <div className="absolute inset-8 rounded-full border border-border" />
      <div className="absolute inset-16 rounded-full border border-border" />
      <m.div
        initial={false}
        animate={reduced ? { opacity: 1 } : { x: point.x, y: point.y }}
        transition={{ duration: 0.5 }}
        className="relative h-[90%] w-[74%] -rotate-6 overflow-hidden rounded-[2rem] shadow-lift"
      >
        <Image
          src="/phone-preview.svg"
          alt=""
          fill
          sizes="(min-width:768px) 360px, 70vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      </m.div>
      <m.div
        initial={false}
        animate={reduced ? { opacity: 1 } : { rotate: [-8, 4, -3, 0] }}
        transition={{ duration: 0.5 }}
        className="absolute end-0 bottom-14"
      >
        <PriceTag amount={125000} size="lg" variant="tag" />
      </m.div>
    </div>
  );
}
