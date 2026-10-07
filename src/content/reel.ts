import type { MediaKey } from "./media";
import type { ServiceSlug } from "./services";

/**
 * The home-page reel: Mayfair's own site photos, slowly pushed in and
 * crossfaded. Phones and wide screens get different photos — the camera
 * shots are phone-sized, so tall photos only ever fill tall screens and
 * wide photos wide ones. Each slide pairs one of each.
 *
 * Swap in a real walk-through video when Mayfair films one (see
 * docs/local-seo-launch.md, "Hero video"); until then this is the motion.
 */
export type ReelShot = { media: MediaKey; label: string; service?: ServiceSlug };
export type ReelSlide = { wide: ReelShot; tall: ReelShot };

export const reel: ReelSlide[] = [
  {
    wide: { media: "shopfront", label: "Shopfront & glass doors", service: "doors" },
    tall: { media: "roofMembrane", label: "Flat-roof waterproofing", service: "waterproofing" },
  },
  {
    wide: { media: "atmInstalled", label: "ATM installation", service: "atm-installation" },
    tall: { media: "atmOpening", label: "ATM installation", service: "atm-installation" },
  },
  {
    wide: { media: "concreteMixer", label: "Concrete mixer hire", service: "equipment-hire" },
    tall: { media: "doorFloorSpring", label: "Door floor springs", service: "doors" },
  },
  {
    wide: { media: "acCassette", label: "Air conditioning", service: "air-conditioning" },
    tall: { media: "pavingKerb", label: "Paving repairs", service: "paving" },
  },
  {
    wide: { media: "roofParapet", label: "Flat-roof waterproofing", service: "waterproofing" },
    tall: { media: "partitionBrick", label: "Partitioning", service: "office-partitioning" },
  },
  {
    wide: { media: "plateCompactor", label: "Plate compactor hire", service: "equipment-hire" },
    tall: { media: "floorLevelling", label: "Floor preparation", service: "carpeting" },
  },
];

/** Media query that picks the tall photo. Kept in one place so CSS and <source> agree. */
export const TALL_QUERY = "(max-aspect-ratio: 4/5)";
