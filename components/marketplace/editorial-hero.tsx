"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

/** Supplied poster + independent light layer: intentional 2.5D, never a turntable. */
export function EditorialHero({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const visibility = () => (element.dataset.paused = String(document.hidden));
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.paused = String(!entry?.isIntersecting || document.hidden);
    });
    observer.observe(element);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--art-x",
      `${((event.clientX - bounds.x) / bounds.width - 0.5) * 12}px`,
    );
    event.currentTarget.style.setProperty(
      "--art-y",
      `${((event.clientY - bounds.y) / bounds.height - 0.5) * 9}px`,
    );
  };
  return (
    <section
      ref={scene}
      className="editorial-hero"
      onPointerMove={move}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--art-x");
        event.currentTarget.style.removeProperty("--art-y");
      }}
    >
      <div className="editorial-hero-copy">{children}</div>
      <div className="editorial-art-frame" aria-hidden="true">
        <div className="editorial-art-float">
          <Image
            src="/campaigns/product-cobalt.png"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 70vw, 100vw"
            className="editorial-art object-cover"
          />
        </div>
        <span className="editorial-orb" />
      </div>
    </section>
  );
}
