import { mediaLabel, type Media } from "@/content/media";

/**
 * Small label on any image that is not Mayfair's own work. Driven by the
 * image's `representative` flag, not by demo mode, so stock and illustrated
 * images stay labelled until they are replaced with real photographs.
 */
export function RepNote({ media, className = "", as: Tag = "p" }: { media: Media; className?: string; as?: "p" | "figcaption" }) {
  if (!media.representative) return null;
  return <Tag className={`rep-note ${className}`}>{mediaLabel(media)}</Tag>;
}
