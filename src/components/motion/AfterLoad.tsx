"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders its children once the page has finished loading. For decorative
 * images just below the fold, so they never compete with the hero photo.
 */
export function AfterLoad({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const go = () => (idle ? idle(() => setReady(true)) : window.setTimeout(() => setReady(true), 200));
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  return ready ? children : null;
}
