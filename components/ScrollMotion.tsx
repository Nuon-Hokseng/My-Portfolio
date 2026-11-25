"use client";
import { useEffect } from "react";
/** Enhances visible base content with finite, one-time entrances. */
export function ScrollMotion() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        let delay = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches || typeof entry.target.animate !== "function")
            continue;
          const animation = entry.target.animate(
            [
              { transform: "translateY(12px)", opacity: 0.85 },
              { transform: "translateY(0)", opacity: 1 },
            ],
            {
              duration: 460,
              delay: Math.min(delay, 150),
              easing: "cubic-bezier(.22,1,.36,1)",
            },
          );
          animations.add(animation);
          animation.addEventListener(
            "finish",
            () => animations.delete(animation),
            { once: true },
          );
          delay += 50;
        }
      },
      { threshold: 0, rootMargin: "0px 0px -45px 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    const cancel = () => {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", cancel);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", cancel);
    };
  }, []);
  return null;
}
