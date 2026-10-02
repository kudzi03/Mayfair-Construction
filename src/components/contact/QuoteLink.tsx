"use client";

import type { ReactNode } from "react";
import { emitPrefill, type PrefillDetail } from "@/lib/events";

/**
 * Jumps to the enquiry form on the current page (#quote) and pre-selects the
 * service or equipment. Plain anchor behaviour without JS.
 */
export function QuoteLink({
  className,
  children,
  service,
  equipment,
  href = "#quote",
}: PrefillDetail & { className?: string; children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        if (service || equipment) emitPrefill({ service, equipment });
      }}
    >
      {children}
    </a>
  );
}
