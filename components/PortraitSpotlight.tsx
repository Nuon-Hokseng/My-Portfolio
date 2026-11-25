"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

/** Reveals the original portrait's color without re-rendering on pointer movement. */
export function PortraitSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const clear = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    ref.current?.removeAttribute("data-hover");
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    position.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      const element = ref.current;
      if (element) {
        element.style.setProperty("--spot-x", `${position.current.x}px`);
        element.style.setProperty("--spot-y", `${position.current.y}px`);
        element.setAttribute("data-hover", "true");
      }
      frame.current = null;
    });
  };
  return (
    <div
      ref={ref}
      className="poster-portrait"
      onPointerMove={move}
      onPointerLeave={clear}
      onPointerCancel={clear}
    >
      <Image
        src="/hero.png"
        alt="Nuon Hokseng, full-stack web developer"
        fill
        sizes="(max-width: 760px) 90vw, 520px"
        loading="eager"
        fetchPriority="high"
        className="portrait-mono"
      />
      <Image
        src="/hero.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 760px) 90vw, 520px"
        className="portrait-color"
      />
    </div>
  );
}
