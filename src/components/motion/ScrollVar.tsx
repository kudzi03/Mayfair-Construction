"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { clamp01, prefersReducedMotion, subscribeScroll } from "@/lib/scroll-loop";

type Mode = "exit" | "through";

type Props<T extends ElementType> = {
  as?: T;
  /**
   * exit:    0 when the element's top is at the viewport top, 1 when its bottom is.
   * through: 0 as it enters at the bottom, 1 as it leaves at the top.
   */
  mode?: Mode;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Writes scroll progress to the `--p` custom property on its element.
 * CSS decides what moves; under reduced motion `--p` is never written.
 */
export function ScrollVar<T extends ElementType = "div">({ as, mode = "through", ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let visible = false;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      rootMargin: "10% 0px",
    });
    io.observe(el);

    let last = -1;
    const unsubscribe = subscribeScroll(() => {
      if (!visible && last !== -1) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "exit"
          ? clamp01(-rect.top / Math.max(1, rect.height))
          : clamp01((vh - rect.top) / (rect.height + vh));
      const rounded = Math.round(p * 1000) / 1000;
      if (rounded !== last) {
        el.style.setProperty("--p", String(rounded));
        last = rounded;
      }
    });

    return () => {
      io.disconnect();
      unsubscribe();
    };
  }, [mode]);

  return <Tag ref={ref} {...rest} />;
}
