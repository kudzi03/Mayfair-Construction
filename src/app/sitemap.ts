import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { equipmentHref, equipmentWithPages } from "@/content/equipment";
import { services, servicePath } from "@/content/services";

/**
 * Canonical, indexable pages only: home, service pages and any equipment page
 * that has been published. No /crm, /credits or utility routes. lastmod is
 * left out on purpose: without a real content-change date it would be a guess,
 * and Google ignores lastmod that isn't consistently accurate.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({
      url: `${site.url}${servicePath(s.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...equipmentWithPages().map((e) => ({
      url: `${site.url}${equipmentHref(e)}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
