"use client";

import Image, { type StaticImageData } from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type GalleryItem = {
  id: string;
  src: StaticImageData;
  alt: string;
  caption: string;
  project: string;
};

const OpenContext = createContext<(id: string) => void>(() => {});

/** Wraps an image so it opens the viewer on the photo with this `id`. */
export function GalleryTrigger({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const open = useContext(OpenContext);
  return (
    <button type="button" className={`work-zoom ${className}`} onClick={() => open(id)} aria-label={`View photo: ${label}`} aria-haspopup="dialog">
      {children}
      <span className="work-zoom-icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="size-4">
          <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </button>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen photo viewer for Mayfair's site photos. Native <dialog>
 * (focus trap, Esc, focus returned to the trigger), arrow keys, swipe,
 * neighbours preloaded so stepping through is instant.
 */
export function WorkGallery({ items, children }: { items: GalleryItem[]; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const n = items.length;

  const open = useCallback(
    (id: string) => {
      const i = items.findIndex((it) => it.id === id);
      if (i >= 0) setIndex(i);
    },
    [items],
  );
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n)), [n]);
  const close = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    const d = ref.current;
    if (!d || index === null || d.open) return;
    d.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onClose = () => {
      root.style.overflow = prev;
      setIndex(null);
    };
    d.addEventListener("close", onClose, { once: true });
  }, [index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  };

  const item = index === null ? null : items[index];

  return (
    <OpenContext.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        className="lightbox"
        aria-label="Photo viewer"
        onKeyDown={onKey}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {item && index !== null && (
          <div className="lightbox-frame">
            <header className="lightbox-bar">
              <p className="mono text-bone/80">
                <span className="text-bone">{pad(index + 1)}</span> / {pad(n)}
                <span className="mx-2 opacity-40">·</span>
                {item.project}
              </p>
              <button type="button" className="lightbox-btn" onClick={close} aria-label="Close photo viewer">
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                  <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </header>

            <div
              className="lightbox-stage"
              onPointerDown={(e) => {
                swipe.current = { x: e.clientX, y: e.clientY, moved: false };
              }}
              onPointerUp={(e) => {
                const s = swipe.current;
                if (!s) return;
                const dx = e.clientX - s.x;
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
                  s.moved = true;
                  step(dx < 0 ? 1 : -1);
                }
              }}
              onClick={(e) => {
                // A tap around the photo closes; a tap on the photo itself does nothing.
                if (swipe.current?.moved) return;
                if (!(e.target as Element).closest(".lightbox-shot.is-current")) close();
              }}
            >
              {[...new Set([index, (index + 1) % n, (index - 1 + n) % n])].map((i) => {
                const it = items[i];
                const current = i === index;
                // Each photo is shown no larger than its own pixels, so phone photos stay sharp.
                return (
                  <div
                    key={i}
                    className={`lightbox-shot ${current ? "is-current" : ""}`}
                    aria-hidden={current ? undefined : true}
                    style={{ "--w": it.src.width, "--h": it.src.height } as React.CSSProperties}
                  >
                    <Image src={it.src} alt={current ? it.alt : ""} fill sizes={`min(100vw, ${it.src.width}px)`} quality={75} loading="eager" draggable={false} />
                  </div>
                );
              })}
            </div>

            <footer className="lightbox-bar">
              <button type="button" className="lightbox-btn" onClick={() => step(-1)} aria-label="Previous photo">
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                  <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
              <p className="min-w-0 flex-1 text-center text-sm text-bone/85" aria-live="polite">
                <span className="mono mr-2 text-ochre">{item.caption}</span>
                <span className="hidden sm:inline">{item.alt}</span>
              </p>
              <button type="button" className="lightbox-btn" onClick={() => step(1)} aria-label="Next photo">
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                  <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </footer>
          </div>
        )}
      </dialog>
    </OpenContext.Provider>
  );
}
