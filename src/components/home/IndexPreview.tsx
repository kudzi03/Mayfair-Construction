"use client";

import Image from "next/image";
import { RepNote } from "@/components/ui/RepNote";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { media, type MediaKey } from "@/content/media";
import { prefersReducedMotion } from "@/lib/scroll-loop";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Wraps the service index. On fine pointers, a small image follows the cursor
 * and shows the row being hovered (`data-preview` on each row).
 */
export function IndexPreview({ keys, children }: { keys: MediaKey[]; children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 64rem)");
  const [active, setActive] = useState<MediaKey | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const box = boxRef.current;
    if (!enabled || !wrap || !box) return;

    const still = prefersReducedMotion();
    let tx = 0, ty = 0, x = 0, y = 0, frame = 0, primed = false;

    const loop = () => {
      x += (tx - x) * (still ? 1 : 0.16);
      y += (ty - y) * (still ? 1 : 0.16);
      box.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${still ? 0 : (tx - x) * 0.02}deg)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX + 28;
      ty = e.clientY - box.offsetHeight / 2;
      if (!primed) {
        x = tx;
        y = ty;
        primed = true;
      }
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      setActive((row?.dataset.preview as MediaKey) ?? null);
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const leave = () => {
      setActive(null);
      primed = false;
    };

    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    return () => {
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return (
    <div ref={wrapRef}>
      {children}
      {enabled && (
        <div ref={boxRef} className="index-preview" data-active={active !== null} aria-hidden="true">
          {keys.map((k) => (
            <div key={k} className="pv" data-on={active === k}>
              <Image src={media[k].src} alt="" fill sizes="272px" quality={60} className="object-cover" />
              <RepNote media={media[k]} className="absolute right-2 bottom-2 z-10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
