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
  played: boolean;
  animation?: Animation;
};

/** Native, replayable entrances; base content stays readable without JavaScript. */
export function ScrollMotion() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !Element.prototype.animate)
      return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Map<HTMLElement, Target>();
    let registrationFrame: number | null = null;

    const finish = (element: HTMLElement, target: Target) => {
      target.animation?.cancel();
      target.animation = undefined;
      element.dataset.motionState = "settled";
    };
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const target = targets.get(element);
          if (
            !target ||
            !entry.isIntersecting ||
            target.played ||
            preference.matches ||
            document.hidden
          )
            continue;
          const rect = element.getBoundingClientRect();
          if (
            rect.bottom <= 0 ||
            rect.top >= innerHeight ||
            !element.isConnected
          )
            continue;
          target.played = true;
          element.dataset.motionState = "running";
          const animation = element.animate(
            entranceFrames(target.effect, innerWidth <= 760, target.index),
            {
              id: `portfolio-${target.effect}`,
              duration:
                target.effect === "fan" || target.effect === "contact"
                  ? 850
                  : 720,
              delay: Math.min(target.index * 75, 225),
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            },
          );
          target.animation = animation;
          animation.addEventListener(
            "finish",
            () => {
              if (target.animation === animation) finish(element, target);
            },
            { once: true },
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );

    // A wider exit region prevents repeated flashing near the viewport edge.
    const rearm = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const target = targets.get(element);
          if (target) {
            finish(element, target);
            target.played = false;
          }
        }
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );

    const register = () => {
      registrationFrame = null;
      for (const [element, target] of targets) {
        if (element.isConnected) continue;
        finish(element, target);
        enter.unobserve(element);
        rearm.unobserve(element);
        targets.delete(element);
      }
      for (const group of motionGroups) {
        document
          .querySelectorAll<HTMLElement>(group.selector)
          .forEach((element, index) => {
            if (targets.has(element)) return;
            targets.set(element, {
              effect: group.effect,
              index,
              played: false,
            });
            element.dataset.motion = group.effect;
            enter.observe(element);
            rearm.observe(element);
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
        target.played = false;
        enter.unobserve(element);
        enter.observe(element);
      }
    };
    const visibilityChanged = () => {
      if (document.hidden)
        for (const [element, target] of targets) finish(element, target);
    };
    preference.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      enter.disconnect();
      rearm.disconnect();
      mutations.disconnect();
      if (registrationFrame !== null) cancelAnimationFrame(registrationFrame);
      for (const [element, target] of targets) {
        finish(element, target);
        delete element.dataset.motion;
        delete element.dataset.motionState;
      }
      preference.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, []);
  return null;
}
