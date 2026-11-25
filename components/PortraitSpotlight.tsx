"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type PointerEvent } from "react";

/** Color spotlight with one brief, rate-limited TV-tuning burst per interaction. */
export function PortraitSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGlitch = useRef(-Infinity);
  const clear = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    ref.current?.removeAttribute("data-hover");
    ref.current?.removeAttribute("data-glitch");
    if (glitchTimer.current !== null) clearTimeout(glitchTimer.current);
    glitchTimer.current = null;
  }, []);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const visibilityChanged = () => {
      if (document.hidden) clear();
    };
    preference.addEventListener("change", clear);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      preference.removeEventListener("change", clear);
      document.removeEventListener("visibilitychange", visibilityChanged);
      clear();
    };
  }, [clear]);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !event.isPrimary ||
      (event.pointerType === "touch" && event.buttons === 0)
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      clear();
      return;
    }
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
        if (
          !element.hasAttribute("data-hover") &&
          performance.now() - lastGlitch.current > 1200 &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          lastGlitch.current = performance.now();
          element.setAttribute("data-glitch", "true");
          glitchTimer.current = setTimeout(() => {
            element.removeAttribute("data-glitch");
            glitchTimer.current = null;
          }, 720);
        }
        element.setAttribute("data-hover", "true");
      }
      frame.current = null;
    });
  };
  return (
    <div
      ref={ref}
      className="poster-portrait"
      onPointerDown={move}
      onPointerMove={move}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") clear();
      }}
      onPointerLeave={clear}
      onPointerCancel={clear}
      onLostPointerCapture={(event) => {
        if (event.pointerType !== "mouse") clear();
      }}
    >
      <Image
        src="/hero.png"
        alt="Nuon Hokseng, full-stack web developer"
        fill
        sizes="(max-width: 760px) 90vw, 520px"
        loading="eager"
        fetchPriority="high"
        className="portrait-mono"
        onLoad={(event) => {
          // Reuse the already-decoded responsive image for the two signal ghosts.
          ref.current?.style.setProperty(
            "--portrait-image",
            `url("${event.currentTarget.currentSrc}")`,
          );
        }}
      />
      <Image
        src="/hero.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 760px) 90vw, 520px"
        className="portrait-color"
      />
      <span className="portrait-signal" aria-hidden="true">
        <span className="portrait-scanlines" />
      </span>
    </div>
  );
}
