"use client";

import { usePathname } from "next/navigation";
import { services, servicePath } from "@/content/services";

const pagesWithForm = new Set<string>(["/", ...services.map((s) => servicePath(s.slug))]);

/** "#quote" when the current page has an enquiry form, otherwise the home page form. */
export function useQuoteHref() {
  return pagesWithForm.has(usePathname()) ? "#quote" : "/#quote";
}
