"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { clamp01, prefersReducedMotion, subscribeScroll } from "@/lib/scroll-loop";

type Props<T extends ElementType> = {
  as?: T;
  /** When set, `data-step` (0…steps-1) is written and matching `[data-step-item]` children get `data-on`. */
  steps?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * For a tall section with a sticky child: writes pinned progress to `--p`
 * (0 when the section's top reaches the viewport top, 1 when its bottom
 * reaches the viewport bottom). CSS decides what moves. Under reduced motion
 * nothing is written and the section's CSS falls back to a static layout.
 */
export function PinnedProgress<T extends ElementType = "section">({ as, steps, ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "section") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.pinned = "true";

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "20% 0px" });
    io.observe(el);

    const items = steps ? Array.from(el.querySelectorAll<HTMLElement>("[data-step-item]")) : [];
    let lastP = -1;
    let lastStep = -1;

    const unsubscribe = subscribeScroll(() => {
      if (!visible && lastP !== -1) return;
      const rect = el.getBoundingClientRect();
      const p = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      const rounded = Math.round(p * 2000) / 2000;
      if (rounded !== lastP) {
        el.style.setProperty("--p", String(rounded));
        lastP = rounded;
      }
      if (steps) {
        const step = Math.min(steps - 1, Math.round(p * (steps - 1)));
        if (step !== lastStep) {
          el.dataset.step = String(step);
          items.forEach((item) => item.toggleAttribute("data-on", item.dataset.stepItem === String(step)));
          lastStep = step;
        }
      }
    });

    return () => {
      io.disconnect();
      unsubscribe();
      delete el.dataset.pinned;
    };
  }, [steps]);

  return <Tag ref={ref} data-pin="" {...rest} />;
}
