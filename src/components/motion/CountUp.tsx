"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, subscribeScroll } from "@/lib/scroll-loop";

const format = (n: number) => n.toLocaleString("en-GB");

/**
 * A number that counts up once. Server output is the final value, so the
 * figure is right without JS. Inside a pinned section (`[data-pin]`) it
 * starts when the section's `--p` passes `at`; elsewhere when it scrolls into view.
 */
export function CountUp({ value, at = 0, duration = 1600 }: { value: number; at?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - k, 4);
        setShown(Math.round(value * eased));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    setShown(0);
    const section = el.closest<HTMLElement>("[data-pin]");
    if (section) {
      const unsubscribe = subscribeScroll(() => {
        const p = Number(section.style.getPropertyValue("--p") || 0);
        if (p >= at) start();
      });
      return () => {
        unsubscribe();
        cancelAnimationFrame(raf);
      };
    }

    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && start(), { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, at, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
