import type { StaticImageData } from "next/image";

/**
 * Image metadata. Kept apart from content/media.ts (which imports every image
 * file) so client components can use the type and label without pulling the
 * whole image registry into the browser bundle.
 */
export type Media = {
  src: StaticImageData;
  alt: string;
  /**
   * true = not Mayfair's own work (licensed stock or an illustration made for the demo).
   * When Mayfair supplies photographs, replace the import and set this to false.
   */
  representative: boolean;
  /** AI or drawn illustration rather than a photograph. */
  illustration?: boolean;
  /** url is omitted for in-house illustrations. */
  credit: { source: string; url?: string };
  /** CSS object-position for art direction. */
  focus?: string;
};

/** Label for any image that is not Mayfair's own work. */
export const mediaLabel = (m: Media) => (m.illustration ? "Illustration — not a Mayfair project" : "Representative image");
