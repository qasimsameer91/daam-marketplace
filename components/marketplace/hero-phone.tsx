"use client";

import { useRef, type PointerEvent } from "react";

/** A CSS-built three-dimensional phone; pointer movement is decorative only. */
export function HeroPhone() {
  const device = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    device.current?.style.setProperty("--hero-tilt-x", `${(-y * 9).toFixed(2)}deg`);
    device.current?.style.setProperty("--hero-tilt-y", `${(x * 12).toFixed(2)}deg`);
  }

  function reset() {
    device.current?.style.setProperty("--hero-tilt-x", "0deg");
    device.current?.style.setProperty("--hero-tilt-y", "0deg");
  }

  return (
    <div className="hero-stage" aria-hidden="true" onPointerMove={move} onPointerLeave={reset}>
      <div className="hero-stage-orbit hero-stage-orbit-outer" />
      <div className="hero-stage-orbit hero-stage-orbit-inner" />
      <div className="hero-stage-cross hero-stage-cross-start">+</div>
      <div className="hero-stage-cross hero-stage-cross-end">+</div>
      <div className="hero-device-entrance">
        <div className="hero-device-float">
          <div ref={device} className="hero-device" data-slot="hero-3d-phone">
            <div className="hero-device-edge" />
            <div className="hero-device-face">
              <div className="hero-device-camera">
                <span className="hero-camera-lens" />
                <span className="hero-camera-lens" />
                <span className="hero-camera-lens" />
                <span className="hero-camera-flash" />
              </div>
              <span className="hero-device-mark">d.</span>
            </div>
            <div className="hero-device-front" />
          </div>
        </div>
      </div>
      <div className="hero-stage-index">
        <span /> DAAM / 01
      </div>
    </div>
  );
}
