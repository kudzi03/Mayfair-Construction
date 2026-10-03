import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** The demo stays out of search results until NEXT_PUBLIC_ALLOW_INDEXING=true. */
export default function robots(): MetadataRoute.Robots {
  if (!site.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    // The CRM and any API routes are never public content. /crm also sends
    // X-Robots-Tag: noindex (next.config.ts) in case a URL leaks.
    rules: { userAgent: "*", allow: "/", disallow: ["/crm", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
