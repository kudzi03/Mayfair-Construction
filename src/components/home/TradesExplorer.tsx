"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/ui/Icon";
import { prefersReducedMotion } from "@/lib/scroll-loop";

export type TradeSlice = {
  slug: string;
  name: string;
  pillar: string;
  pillarNumber: string;
  summary: string;
  href: string;
  src: StaticImageData;
  alt: string;
};

export type TradePillar = { id: string; number: string; name: string; title: string; first: number; count: number };

const CYCLE_MS = 3800;

/**
 * Pillar list beside a row of image slices. One slice is open at a time; it
 * advances on its own while the row is on screen and nobody is pointing at it.
 * On touch, the first tap opens a slice and the second follows its link.
 */
export function TradesExplorer({ slices, pillars }: { slices: TradeSlice[]; pillars: TradePillar[] }) {
  const [active, setActive] = useState(0);
  const rowRef = useRef<HTMLUListElement>(null);
  const holdRef = useRef(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(row);
    const id = window.setInterval(() => {
      if (visible && !holdRef.current && !document.hidden) setActive((i) => (i + 1) % slices.length);
    }, CYCLE_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [slices.length]);

  const holdOn = () => {
    holdRef.current = true;
  };
  const holdOff = () => {
    holdRef.current = false;
  };
  const current = slices[active];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <ol className="lg:col-span-4" aria-label="Lines of work" onMouseLeave={holdOff}>
        {pillars.map((p) => {
          const on = active >= p.first && active < p.first + p.count;
          return (
            <li key={p.id} className="trade-pillar" data-on={on || undefined}>
              <button
                type="button"
                className="grid w-full grid-cols-[3rem_1fr] items-baseline py-5 text-left"
                onMouseEnter={() => {
                  holdRef.current = true;
                  if (!on) setActive(p.first);
                }}
                onClick={() => setActive(p.first)}
                aria-pressed={on}
              >
                <span className="mono text-(--accent-text)">{p.number}</span>
                <span>
                  <span className="trade-pillar-name display block">{p.name}</span>
                  <span className="mt-1 block text-muted">{p.title}</span>
                </span>
              </button>
            </li>
          );
        })}
        <li className="mt-8 hidden border-t border-ink/15 pt-6 lg:block" aria-live="polite">
          <p className="mono text-muted">
            {current.pillarNumber} <span className="mx-1.5 opacity-40">/</span> {current.pillar}
          </p>
          <p className="mt-2 text-lg leading-snug">
            <span className="font-semibold">{current.name}.</span> {current.summary}
          </p>
        </li>
      </ol>

      <ul
        ref={rowRef}
        className="slices lg:col-span-8"
        onMouseEnter={holdOn}
        onMouseLeave={holdOff}
        onFocus={holdOn}
        onBlur={holdOff}
      >
        {slices.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.slug} className="slice" data-on={on || undefined}>
              <Link
                href={s.href}
                className="slice-link"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={(e) => {
                  if (!on && window.matchMedia("(hover: none)").matches) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
              >
                <Image src={s.src} alt={s.alt} fill sizes="(min-width: 64rem) 46vw, 92vw" quality={60} className="slice-img" />
                <span className="slice-shade" aria-hidden="true" />
                <span className="slice-tab mono" aria-hidden="true">
                  {s.name}
                </span>
                <span className="slice-card">
                  <span className="mono block text-bone/70">
                    {s.pillarNumber} <span className="mx-1 opacity-50">/</span> {s.pillar}
                  </span>
                  <span className="slice-name display mt-2 block">{s.name}</span>
                  <span className="mt-2 block max-w-xs text-[0.9375rem] leading-snug text-bone/85">{s.summary}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ochre">
                    See the service <ArrowRight size={16} />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
