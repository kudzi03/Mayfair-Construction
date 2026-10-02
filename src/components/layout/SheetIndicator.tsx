"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Sheet = { label: string; tone: string; quiet: boolean };

/**
 * Vertical drawing-sheet label in the left margin on wide screens:
 * reads `data-sheet` / `data-tone` from the section crossing mid-screen.
 * `data-sheet-quiet` hides it where content runs edge to edge.
 */
export function SheetIndicator() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<Sheet | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-sheet]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            setSheet({ label: el.dataset.sheet!, tone: el.dataset.tone ?? "light", quiet: "sheetQuiet" in el.dataset });
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`sheet-indicator mono hidden text-[0.625rem] xl:block ${sheet?.tone === "dark" ? "text-muted-dark" : "text-muted"}`}
      style={{ opacity: sheet && !sheet.quiet ? 1 : 0 }}
    >
      Mayfair Construction <span className="mx-2 opacity-50">—</span> {sheet?.label}
    </div>
  );
}
