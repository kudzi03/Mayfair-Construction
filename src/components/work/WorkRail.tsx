"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icon";

/**
 * A horizontal rail of project cards: native scrolling and snap on touch,
 * drag with a mouse, arrow keys once focused, and previous/next buttons.
 */
export function WorkRail({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="max-w-sm text-sm text-muted">Scroll, drag or use the arrow keys. Select a photo to open it.</p>
        <div className="flex gap-2">
          <button type="button" className="round-btn" aria-label="Previous projects" disabled={edges.start} onClick={() => step(-1)}>
            <ArrowLeft />
          </button>
          <button type="button" className="round-btn" aria-label="Next projects" disabled={edges.end} onClick={() => step(1)}>
            <ArrowRight />
          </button>
        </div>
      </div>
      <ul
        ref={ref}
        className="rail"
        tabIndex={0}
        aria-label={label}
        data-dragging={dragging}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
          drag.current = { active: true, moved: false, x: e.clientX, left: ref.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.active || !ref.current) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 6) {
            d.moved = true;
            setDragging(true);
            ref.current.setPointerCapture(e.pointerId);
          }
          if (d.moved) ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current.active = false;
          setDragging(false);
        }}
        onPointerCancel={() => {
          drag.current.active = false;
          setDragging(false);
        }}
        // A drag that ends over a photo must not open it.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {children}
      </ul>
    </div>
  );
}
