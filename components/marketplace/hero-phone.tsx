"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { PriceTag } from "@/components/daam/price-tag";

/**
 * Hero: a floating phone with a gently swinging price tag (CSS animations, no motion runtime).
 * Desktop pointer parallax sets --px/--py custom properties; reduced motion is handled in CSS.
 */
export function HeroPhone() {
  const phoneRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (
      e.pointerType !== "mouse" ||
      !matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches
    ) {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.x) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.y) / r.height - 0.5) * 12;
    phoneRef.current?.style.setProperty("--px", `${x}px`);
    phoneRef.current?.style.setProperty("--py", `${y}px`);
  };

  const reset = () => {
    phoneRef.current?.style.setProperty("--px", "0px");
    phoneRef.current?.style.setProperty("--py", "0px");
  };

  return (
    <div
      aria-hidden
      className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <div className="absolute inset-8 rounded-full border border-border" />
      <div className="absolute inset-16 rounded-full border border-border" />
      <div
        ref={phoneRef}
        style={{ "--px": "0px", "--py": "0px" } as CSSProperties}
        className="relative h-[90%] w-[74%] hero-parallax overflow-hidden rounded-[2rem] shadow-lift"
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
      </div>
      <div className="absolute end-0 bottom-14 origin-top hero-tag">
        <PriceTag amount={125000} size="lg" variant="tag" />
      </div>
    </div>
  );
}
