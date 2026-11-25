"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    // `threshold` is measured against the viewport, not the element: reveal once
    // the element's top has come `threshold` of the screen height into view.
    // A ratio of the element itself can never be reached by sections taller
    // than the screen (e.g. Projects on a phone in landscape).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${Math.round(threshold * window.innerHeight)}px 0px`,
      },
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  return { ref, isVisible };
}
