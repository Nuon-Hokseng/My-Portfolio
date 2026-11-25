"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** A slow, decorative ribbon; CSS does the drawing, not a JavaScript frame loop. */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const hero = element?.closest("section");
    if (!element || !hero || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      element.dataset.running = String(
        visible && !paused && !document.hidden && !preference.matches,
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    element.dataset.enhanced = "true";
    observer.observe(hero);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      element.dataset.running = "false";
    };
  }, [paused]);

  return (
    <div ref={ref} className="hero-backdrop">
      <div className="hero-ribbon" aria-hidden="true">
        <Image
          className="hero-ribbon-image"
          src="/hero/sculpted-ribbon.webp"
          alt=""
          width={960}
          height={1198}
          sizes="(max-width: 760px) 480px, (max-width: 1200px) 64vw, 680px"
          loading="eager"
          fetchPriority="low"
          draggable={false}
        />
      </div>
      <button
        type="button"
        className="hero-motion-toggle"
        aria-label={
          paused ? "Resume background animation" : "Pause background animation"
        }
        title={
          paused ? "Resume background animation" : "Pause background animation"
        }
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <Play size={15} aria-hidden="true" />
        ) : (
          <Pause size={15} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
