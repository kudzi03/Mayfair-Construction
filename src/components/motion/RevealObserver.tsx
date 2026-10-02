"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Variants hidden with clip-path: IntersectionObserver reports these as not
 *  intersecting while fully clipped, so their parent is observed instead. */
const CLIPPED = new Set(["mask", "wipe"]);

/**
 * Marks `[data-reveal]` elements with `data-revealed` as they enter the
 * viewport. All visual behaviour lives in CSS; without JS nothing is hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (!("IntersectionObserver" in window)) {
      items.forEach(reveal);
      return;
    }

    const byTarget = new Map<Element, HTMLElement[]>();
    items.forEach((el) => {
      const target = CLIPPED.has(el.dataset.reveal ?? "") && el.parentElement ? el.parentElement : el;
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          byTarget.get(entry.target)?.forEach(reveal);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    byTarget.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
