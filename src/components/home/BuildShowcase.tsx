"use client";

import Image from "next/image";
import { RepNote } from "@/components/ui/RepNote";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import { media } from "@/content/media";
import { servicePath, type Service } from "@/content/services";
import { subscribeScroll } from "@/lib/scroll-loop";

/**
 * Desktop: a sticky image frame on the left wipes between services as their
 * text blocks scroll past on the right. Mobile: each block carries its own image.
 */
export function BuildShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

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
    <div className="container-x mt-14 grid grid-cols-1 gap-x-16 lg:mt-20 lg:grid-cols-12">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <div className="build-frame reg relative h-[calc(100svh-var(--header-h)-6rem)] max-h-[54rem] overflow-hidden bg-concrete text-ink">
            {services.map((s, i) => {
              const m = media[s.media];
              return (
                <div key={s.slug} className="bf-img" data-on={i === active} data-was={i < active}>
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 64rem) 46vw, 1px"
                    quality={75}
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
              <RepNote media={media[current.media]} />
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
          const m = media[s.media];
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
              <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-concrete lg:hidden">
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
              <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {s.scope.map((item) => (
                  <li key={item.title} className="border-t border-ink/15 pt-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{item.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <QuoteLink service={s.slug} className="btn btn-dark">
                  Quote for {s.name.toLowerCase()} <ArrowRight />
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
