"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { QuoteLink } from "@/components/contact/QuoteLink";
import { ArrowRight } from "@/components/ui/Icon";
import { clientTypes } from "@/content/clients";
import { serviceBySlug, servicePath } from "@/content/services";

/** "Which one are you?" — tabs for each client type, showing the services that usually matter to them. */
export function ClientPicker() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = clientTypes.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? active === last ? 0 : active + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? active === 0 ? last : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-x-16">
      <div role="tablist" aria-label="Client type" className="cp-tabs lg:col-span-5" onKeyDown={onKeyDown}>
        {clientTypes.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`cp-tab-${c.id}`}
            aria-selected={i === active}
            aria-controls={`cp-panel-${c.id}`}
            tabIndex={i === active ? 0 : -1}
            className="cp-tab"
            onClick={() => setActive(i)}
          >
            <span className="mono cp-num" aria-hidden="true">
              04.{i + 1}
            </span>
            <span className="cp-name">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7">
        {clientTypes.map((c, i) => (
          <div
            key={c.id}
            role="tabpanel"
            id={`cp-panel-${c.id}`}
            aria-labelledby={`cp-tab-${c.id}`}
            hidden={i !== active}
            tabIndex={0}
            className="cp-panel"
          >
            <p className="statement max-w-2xl">{c.line}</p>
            <p className="mono mt-10 text-muted">Usually needed</p>
            <ul className="mt-3">
              {c.services.map((slug) => {
                const s = serviceBySlug(slug)!;
                return (
                  <li key={slug}>
                    <Link href={servicePath(slug)} className="cp-service group">
                      <span className="text-xl font-semibold tracking-tight">{s.name}</span>
                      <span className="hidden text-[0.9375rem] leading-snug text-muted sm:block">{s.summary}</span>
                      <ArrowRight size={18} className="justify-self-end transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <QuoteLink className="btn btn-dark mt-8">
              Get a quote <ArrowRight />
            </QuoteLink>
          </div>
        ))}
      </div>
    </div>
  );
}
