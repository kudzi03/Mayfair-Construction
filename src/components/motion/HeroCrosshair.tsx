"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/scroll-loop";

/** Drafting-table crosshair that tracks a fine pointer across the hero. */
export function HeroCrosshair() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const host = root?.parentElement;
    if (!root || !host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;

    const x = root.querySelector<HTMLElement>(".ch-x")!;
    const y = root.querySelector<HTMLElement>(".ch-y")!;
    const label = root.querySelector<HTMLElement>(".ch-label")!;
    let frame = 0;
    let px = 0;
    let py = 0;

    const draw = () => {
      frame = 0;
      x.style.transform = `translate3d(0, ${py}px, 0)`;
      y.style.transform = `translate3d(${px}px, 0, 0)`;
      label.style.transform = `translate3d(${px + 12}px, ${py + 10}px, 0)`;
      label.textContent = `X ${String(Math.round(px)).padStart(4, "0")}  Y ${String(Math.round(py)).padStart(4, "0")}`;
    };

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      root.dataset.active = "true";
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => (root.dataset.active = "false");

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="crosshair" aria-hidden="true" data-active="false">
      <span className="ch-x" />
      <span className="ch-y" />
      <span className="ch-label mono text-[0.625rem]" />
    </div>
  );
}
