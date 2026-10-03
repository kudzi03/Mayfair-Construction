import type { Metadata } from "next";
import { site } from "@/config/site";

/** Home page title and description; other pages set their own via pageMetadata(). */
export const homeTitle = `${site.name} | Construction Company in Gaborone, Botswana`;
export const homeDescription =
  "Gaborone contractor for renovations, roof waterproofing, painting, electrical, office partitioning, ATM and EV charger installation, and equipment hire across Botswana.";

/**
 * Full per-page metadata. Next merges `openGraph` and `twitter` shallowly, so
 * a page that sets only a title there would drop the site name, locale, type
 * and large-image card from the root layout. Every page goes through here.
 *
 * `title` is the page part; the root template appends " | Mayfair Construction".
 * Pass `absoluteTitle` for the home page, which leads with the brand instead.
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  index = true,
  ownImage = false,
}: {
  title?: string;
  absoluteTitle?: string;
  description: string;
  path: string;
  /** false = keep this page out of search results but let crawlers follow its links. */
  index?: boolean;
  /** true when the page's segment has its own opengraph-image file; explicit images would override it. */
  ownImage?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ?? `${title} | ${site.name}`;
  // The site-wide social card, for pages without their own opengraph-image file.
  const images = ownImage
    ? undefined
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.base.city}, ${site.base.country}` }];
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_BW",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...(images ? { images } : {}) },
    ...(index && site.allowIndexing ? {} : { robots: { index: false, follow: site.allowIndexing } }),
  };
}
