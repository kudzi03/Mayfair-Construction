"use client";

import Image from "next/image";
import { RepNote } from "@/components/ui/RepNote";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import type { Media } from "@/content/media-types";
import { inSentence, servicePath, type Service } from "@/content/services";
import { subscribeScroll } from "@/lib/scroll-loop";

/**
 * Desktop: a sticky image frame on the left wipes between services as their
 * text blocks scroll past on the right. Mobile: each block carries its own image.
 */
export function BuildShowcase({ services, images }: { services: Service[]; images: Record<string, Media> }) {
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  // Start loading every frame image a screen or so before the section arrives,
  // so the wipe never reveals an image that is still downloading.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // The active service is the last one whose heading has passed the middle of the screen.
  useEffect(() => {
    const headings = blocks.current.map((b) => b?.querySelector("h3") ?? null);
    return subscribeScroll(() => {
      const line = window.innerHeight * 0.55;
      let next = 0;
      headings.forEach((h, i) => {
        if (h && h.getBoundingClientRect().top < line) next = i;
      });
      setActive(next);
    });
  }, []);

  const current = services[active];

  return (
    <div ref={rootRef} className="container-x mt-14 grid grid-cols-1 gap-x-16 lg:mt-20 lg:grid-cols-12">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <div className="build-frame relative h-[calc(100svh-var(--header-h)-6rem)] max-h-[54rem] overflow-hidden rounded-[var(--radius-lg)] bg-concrete text-ink">
            {services.map((s, i) => {
              const m = images[s.media];
              return (
                <div key={s.slug} className="bf-img" data-on={i === active} data-was={i < active}>
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 64rem) 46vw, 1px"
                    quality={75}
                    loading={near ? "eager" : "lazy"}
                    fetchPriority="low"
                    className="object-cover"
                    style={{ objectPosition: m.focus }}
                  />
                </div>
              );
            })}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-linear-to-t from-ink/70 to-transparent p-5 pt-16 text-bone">
              <p className="mono" aria-live="off">
                01.{active + 1} — {current.name}
              </p>
              <RepNote media={images[current.media]} />
            </div>
          </div>
          <ol className="mt-4 flex gap-1.5" aria-hidden="true">
            {services.map((s, i) => (
              <li key={s.slug} className={`h-0.5 flex-1 transition-colors duration-500 ${i <= active ? "bg-ink" : "bg-ink/15"}`} />
            ))}
          </ol>
        </div>
      </div>

      <div className="lg:col-span-6">
        {services.map((s, i) => {
          const m = images[s.media];
          return (
            <article
              key={s.slug}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              data-index={i}
              data-active={i === active}
              className="build-block flex flex-col justify-center border-t border-ink/15 py-12 lg:min-h-[80svh] lg:py-16"
              aria-labelledby={`build-${s.slug}`}
            >
              <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-concrete lg:hidden">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 63.99rem) 92vw, 1px"
                  quality={60}
                  className="object-cover"
                  style={{ objectPosition: m.focus }}
                />
                <RepNote media={m} className="absolute right-3 bottom-3" />
              </div>
              <p className="mono text-(--accent-text)">01.{i + 1}</p>
              <h3 id={`build-${s.slug}`} className="display mt-3 text-[clamp(3rem,2rem+4.5vw,6rem)]">
                {s.name}
              </h3>
              <p className="lead mt-5 max-w-lg">{s.summary}</p>
              <ol className="mt-8 max-w-lg border-t border-ink/15">
                {s.scope.map((item, n) => (
                  <li key={item.title} className="flex items-baseline gap-4 border-b border-ink/15 py-3">
                    <span className="mono text-muted">{String(n + 1).padStart(2, "0")}</span>
                    <span className="text-lg font-medium">{item.title}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <QuoteLink service={s.slug} className="btn btn-dark">
                  Quote for {inSentence(s.name)} <ArrowRight />
                </QuoteLink>
                <Link href={servicePath(s.slug)} className="link-arrow">
                  {s.name} in detail <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
