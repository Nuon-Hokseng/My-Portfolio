"use client";
import { useEffect } from "react";
import {
  entranceFrames,
  motionGroups,
  type MotionEffect,
} from "@/lib/scroll-motion";

type Target = {
  effect: MotionEffect;
  index: number;
  animation?: Animation;
};

/** Prepare offscreen, reveal once, and never hide content the visitor has seen. */
export function ScrollMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const linkedSection = document
      .getElementById(location.hash.slice(1))
      ?.closest("section");
    const targets = new Map<HTMLElement, Target>();
    let registrationFrame: number | null = null;

    const finish = (element: HTMLElement, target: Target) => {
      target.animation?.cancel();
      target.animation = undefined;
      element.dataset.motionState = "settled";
      element.style.removeProperty("--motion-from");
      enter.unobserve(element);
    };
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const target = targets.get(element);
          if (
            !target ||
            !entry.isIntersecting ||
            element.dataset.motionState !== "ready" ||
            preference.matches ||
            document.hidden
          )
            continue;
          if (!element.isConnected) continue;
          enter.unobserve(element);
          const animation = element.animate(
            [
              {
                transform: element.style.getPropertyValue("--motion-from"),
                opacity: 0,
              },
              { transform: "none", opacity: 1 },
            ],
            {
              id: `portfolio-${target.effect}`,
              duration: 1100,
              delay: Math.min(target.index * 60, 120),
              easing: "cubic-bezier(.25,.46,.45,.94)",
              fill: "both",
            },
          );
          target.animation = animation;
          element.dataset.motionState = "running";
          animation.addEventListener(
            "finish",
            () => {
              if (target.animation === animation) finish(element, target);
            },
            { once: true },
          );
        }
      },
      // Begin just before visibility, not after the content has already appeared.
      { threshold: 0, rootMargin: "0px 0px 80px 0px" },
    );

    const register = () => {
      registrationFrame = null;
      for (const [element, target] of targets) {
        if (element.isConnected) continue;
        finish(element, target);
        targets.delete(element);
      }
      for (const group of motionGroups) {
        document
          .querySelectorAll<HTMLElement>(group.selector)
          .forEach((element, index) => {
            if (targets.has(element)) return;
            const target: Target = {
              effect: group.effect,
              index,
            };
            targets.set(element, target);
            element.dataset.motion = group.effect;
            const rect = element.getBoundingClientRect();
            // Hydration, restored scroll and visible filter updates must not blink.
            if (
              preference.matches ||
              document.hidden ||
              linkedSection?.contains(element) ||
              rect.top < innerHeight ||
              !rect.height
            ) {
              finish(element, target);
              return;
            }
            const [from] = entranceFrames(group.effect, innerWidth <= 760);
            element.style.setProperty("--motion-from", String(from.transform));
            element.dataset.motionState = "ready";
            enter.observe(element);
          });
      }
    };
    register();
    // Gallery filters and lazy-loaded sections need the same choreography.
    const mutations = new MutationObserver((records) => {
      if (
        registrationFrame !== null ||
        !records.some((record) =>
          [...record.addedNodes, ...record.removedNodes].some(
            (node) => node instanceof Element,
          ),
        )
      )
        return;
      registrationFrame = requestAnimationFrame(register);
    });
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });

    const preferenceChanged = () => {
      for (const [element, target] of targets) {
        finish(element, target);
      }
    };
    const visibilityChanged = () => {
      if (document.hidden)
        for (const [element, target] of targets) finish(element, target);
    };
    const focusChanged = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-motion]");
      const target = element && targets.get(element);
      if (element && target) finish(element, target);
    };
    preference.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    main?.addEventListener("focusin", focusChanged);
    return () => {
      enter.disconnect();
      mutations.disconnect();
      if (registrationFrame !== null) cancelAnimationFrame(registrationFrame);
      for (const [element, target] of targets) {
        finish(element, target);
        delete element.dataset.motion;
        delete element.dataset.motionState;
      }
      preference.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      main?.removeEventListener("focusin", focusChanged);
    };
  }, []);
  return null;
}
