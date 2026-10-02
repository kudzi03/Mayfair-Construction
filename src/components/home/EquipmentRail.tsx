"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContactLink } from "@/components/contact/ContactLink";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight, ChevronIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import type { Equipment } from "@/content/equipment";
import { media } from "@/content/media";
import { clamp01, subscribeScroll } from "@/lib/scroll-loop";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Desktop with motion allowed: the section pins and vertical scroll drives the
 * rail sideways. Everywhere else: a native, swipeable scroll-snap rail.
 */
export function EquipmentRail({ items }: { items: Equipment[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery("(min-width: 64rem) and (min-height: 40rem) and (prefers-reduced-motion: no-preference)");
  const [index, setIndex] = useState(0);
  const total = items.length;

  // Pinned mode: size the section so its scroll length equals the rail's overflow.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pinned || !section || !track) {
      if (section) section.style.height = "";
      if (track) track.style.transform = "";
      return;
    }

    let distance = 0;
    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${distance + window.innerHeight}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const unsubscribe = subscribeScroll(() => {
      const rect = section.getBoundingClientRect();
      const p = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      track.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setIndex(Math.min(total - 1, Math.round(p * (total + 1) - 0.5)));
    });

    // Keyboard users: bring the focused panel into view by scrolling the page.
    const onFocus = (e: FocusEvent) => {
      const panel = (e.target as HTMLElement).closest<HTMLElement>(".rail-panel");
      if (!panel) return;
      track.parentElement!.scrollLeft = 0;
      const target = Math.min(distance, Math.max(0, panel.offsetLeft - window.innerWidth * 0.1));
      const top = section.getBoundingClientRect().top + window.scrollY + target;
      window.scrollTo({ top, behavior: "instant" });
    };
    track.addEventListener("focusin", onFocus);

    return () => {
      ro.disconnect();
      unsubscribe();
      track.removeEventListener("focusin", onFocus);
      section.style.height = "";
      track.style.transform = "";
    };
  }, [pinned, total]);

  // Native mode: keep the counter in sync with horizontal scrolling.
  useEffect(() => {
    const track = trackRef.current;
    if (pinned || !track) return;
    const onScroll = () => {
      const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-item]"));
      const left = track.scrollLeft + track.clientWidth * 0.3;
      let i = 0;
      panels.forEach((p, n) => {
        if (p.offsetLeft <= left) i = n;
      });
      setIndex(i);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [pinned]);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const panel = track?.querySelector<HTMLElement>("[data-item]");
    if (!track || !panel) return;
    track.scrollBy({ left: dir * (panel.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="rail relative" data-pinned={pinned}>
      <div className="rail-sticky">
        <div className="container-x mb-6 flex items-center justify-between gap-4">
          <p className="mono text-muted" aria-live="polite">
            <span className="text-ink">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} —{" "}
            {items[index]?.name}
          </p>
          {!pinned && (
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} className="flex size-11 items-center justify-center border border-ink/25 hover:bg-ink hover:text-bone" aria-label="Previous equipment">
                <ChevronIcon className="rotate-180" />
              </button>
              <button type="button" onClick={() => step(1)} className="flex size-11 items-center justify-center border border-ink/25 hover:bg-ink hover:text-bone" aria-label="Next equipment">
                <ChevronIcon />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div ref={trackRef} className="rail-track" role="list" aria-label="Equipment available for hire">
            {items.map((item, i) => {
              const m = media[item.media];
              return (
                <article
                  key={item.id}
                  id={`hire-${item.id}`}
                  role="listitem"
                  data-item
                  className="rail-panel grid bg-paper ring-1 ring-ink/10 lg:grid-cols-[1.15fr_1fr]"
                  aria-labelledby={`eq-${item.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-concrete lg:aspect-auto lg:min-h-[min(62svh,36rem)]">
                    <Image
                      src={m.src}
                      alt={m.alt}
                      fill
                      sizes="(min-width: 64rem) 40vw, 86vw"
                      quality={60}
                      className="object-cover"
                      style={{ objectPosition: m.focus }}
                    />
                    <span className="mono absolute top-4 left-4 bg-ochre px-2 py-1 text-ink">EQ-0{i + 1}</span>
                    {site.isDemo && <p className="rep-note absolute right-3 bottom-3">Representative image</p>}
                  </div>
                  <div className="flex flex-col p-6 md:p-8 lg:p-10">
                    <p className="mono text-muted">{item.category}</p>
                    <h3 id={`eq-${item.id}`} className="display mt-3 text-[clamp(2.75rem,2rem+3vw,5.25rem)]">
                      {item.name}
                    </h3>
                    <p className="mt-4 max-w-md leading-snug text-muted">{item.use}</p>
                    <dl className="mt-6 text-[0.9375rem]">
                      {item.specs.map((spec) => (
                        <div key={spec.label} className="spec-row">
                          <dt className="mono pt-0.5 text-muted">{spec.label}</dt>
                          <dd className="font-semibold">{spec.value}</dd>
                        </div>
                      ))}
                      <div className="spec-row border-b border-b-ink/15">
                        <dt className="mono pt-0.5 text-muted">Availability</dt>
                        <dd className="font-semibold">Ask Mayfair</dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex flex-wrap gap-2 pt-8">
                      <QuoteLink service="equipment-hire" equipment={item.singular} className="btn btn-dark btn-sm">
                        Check availability <ArrowRight size={16} />
                      </QuoteLink>
                      <ContactLink
                        channel="whatsapp"
                        message={`Hello Mayfair, is a ${item.singular.toLowerCase()} available for hire?`}
                        className="btn btn-outline btn-sm"
                      >
                        <WhatsAppIcon size={16} /> Ask
                      </ContactLink>
                    </div>
                  </div>
                </article>
              );
            })}

            <div role="listitem" className="rail-panel rail-outro flex flex-col justify-center bg-ink p-8 text-bone md:p-10">
              <p className="mono text-ochre">Something else?</p>
              <p className="mt-4 text-[clamp(1.75rem,1.3rem+1.5vw,2.5rem)] leading-tight font-semibold">
                These four are what’s listed today. Ask about other site equipment.
              </p>
              <QuoteLink service="equipment-hire" className="btn btn-primary mt-8 self-start">
                Ask about equipment <ArrowRight />
              </QuoteLink>
            </div>
          </div>
        </div>

        {pinned && (
          <div className="container-x mt-8" aria-hidden="true">
            <div className="h-px bg-ink/15">
              <div ref={barRef} className="h-px origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
