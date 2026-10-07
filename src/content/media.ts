import type { StaticImageData } from "next/image";
import type { Media } from "./media-types";

import carpeting from "@/assets/images/carpeting.jpg";
import electrical from "@/assets/images/electrical.jpg";
import evCharging from "@/assets/images/ev-charging.jpg";
import forklift from "@/assets/images/forklift.jpg";
import gaborone from "@/assets/images/gaborone.jpg";
import officePartitioning from "@/assets/images/office-partitioning.jpg";
import painting from "@/assets/images/painting.jpg";
import palletJack from "@/assets/images/pallet-jack.jpg";
import restoration from "@/assets/images/restoration.jpg";
import acCassette from "@/assets/images/work/ac-cassette.jpg";
import atmBreakthrough from "@/assets/images/work/atm-breakthrough.jpg";
import atmDelivery from "@/assets/images/work/atm-delivery.jpg";
import atmInstalled from "@/assets/images/work/atm-installed.jpg";
import atmOpening from "@/assets/images/work/atm-opening.jpg";
import concreteMixer from "@/assets/images/work/concrete-mixer.jpg";
import doorFloorSpring from "@/assets/images/work/door-floor-spring.jpg";
import doorNew from "@/assets/images/work/door-new.jpg";
import floorLevelling from "@/assets/images/work/floor-levelling.jpg";
import houseBlockwork from "@/assets/images/work/house-blockwork.jpg";
import houseRoofed from "@/assets/images/work/house-roofed.jpg";
import lockersAfter from "@/assets/images/work/lockers-after.jpg";
import lockersBefore from "@/assets/images/work/lockers-before.jpg";
import partitionBrick from "@/assets/images/work/partition-brick.jpg";
import pavingCompactor from "@/assets/images/work/paving-compactor.jpg";
import pavingKerb from "@/assets/images/work/paving-kerb.jpg";
import pavingRelay from "@/assets/images/work/paving-relay.jpg";
import plateCompactor from "@/assets/images/work/plate-compactor.jpg";
import roofCrew from "@/assets/images/work/roof-crew.jpg";
import roofMembrane from "@/assets/images/work/roof-membrane.jpg";
import roofParapet from "@/assets/images/work/roof-parapet.jpg";
import roofPonding from "@/assets/images/work/roof-ponding.jpg";
import roofPrimer from "@/assets/images/work/roof-primer.jpg";
import roofScreed from "@/assets/images/work/roof-screed.jpg";
import roofTorchPoster from "@/assets/images/work/roof-torch-poster.jpg";
import shopfront from "@/assets/images/work/shopfront.jpg";

export type { Media } from "./media-types";
export { mediaLabel } from "./media-types";

const pexels = (id: string, slug: string) => ({
  source: "Pexels (Pexels License)",
  url: `https://www.pexels.com/photo/${slug}-${id}/`,
});

const illustration = { source: "AI-generated illustration for this demo (VelaBuilt)" };

/**
 * Mayfair's own site photos, supplied by the company and prepared with
 * scripts/work-photo.mjs (crop + light colour correction only). Bystanders
 * and number plates are cropped out rather than blurred.
 */
const own = { source: "Mayfair Construction — site photo" };
const photo = (src: StaticImageData, alt: string, focus?: string): Media => ({ src, alt, representative: false, credit: own, focus });

const registry = {
  restoration: {
    src: restoration,
    alt: "Illustration: scaffolding against a commercial building’s end wall, where cracked render has been cut back to the blockwork and fresh render is going on",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "52% 50%",
  },
  painting: {
    src: painting,
    alt: "Illustration: a decorator rolling warm-white paint over grey primer in a sunlit, empty commercial interior",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "60% 55%",
  },
  electrical: {
    src: electrical,
    alt: "Illustration: an electrician on a stepladder fitting a linear ceiling light beside an open distribution board",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "58% 50%",
  },
  carpeting: {
    src: carpeting,
    alt: "Illustration: a carpet fitter laying charcoal carpet tiles across a sunlit office floor",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "66% 55%",
  },
  officePartitioning: {
    src: officePartitioning,
    alt: "Illustration: a corridor between new glazed office partitions, with a meeting room on the left",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "40% 55%",
  },
  evCharging: {
    src: evCharging,
    alt: "Illustration: a white electric car charging from a post-mounted charger on a building forecourt",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "52% 60%",
  },
  forklift: {
    src: forklift,
    alt: "Illustration: an orange counterbalance forklift on a plain studio backdrop",
    representative: true,
    illustration: true,
    credit: illustration,
  },
  palletJack: {
    src: palletJack,
    alt: "Illustration: an orange hand pallet jack on a plain studio backdrop",
    representative: true,
    illustration: true,
    credit: illustration,
  },
  concreteMixer: photo(concreteMixer, "A yellow portable concrete mixer on the back of a white bakkie", "32% 50%"),
  plateCompactor: photo(plateCompactor, "A plate compactor with a red Honda GX270 engine, standing on gravel", "45% 50%"),
  roofTorchPoster: photo(roofTorchPoster, "A Mayfair crew member torching down a roll of bitumen waterproofing membrane on a flat concrete roof"),
  roofPonding: photo(roofPonding, "Rainwater ponding across a flat concrete roof before waterproofing, with a crew member at the parapet", "50% 60%"),
  roofParapet: photo(roofParapet, "Cracked and lifting render along a flat roof’s parapet, seen from above", "45% 50%"),
  roofScreed: photo(roofScreed, "Fresh screed laid along the edge of a flat roof beside the parapet", "45% 35%"),
  roofPrimer: photo(roofPrimer, "Black bitumen primer being rolled onto a flat roof slab", "55% 30%"),
  roofMembrane: photo(roofMembrane, "Two Mayfair crew members torching down a roll of bitumen membrane on a flat roof", "55% 45%"),
  roofCrew: photo(roofCrew, "Mayfair crew members laying a roll of waterproofing membrane on a flat roof, gas cylinder alongside", "50% 40%"),
  lockersBefore: photo(lockersBefore, "Before: a worn bank of wooden lockers with broken and missing doors"),
  lockersAfter: photo(lockersAfter, "After: a new pigeon-hole locker cabinet with lockable doors, installed against an office wall"),
  doorNew: photo(doorNew, "A replaced double glass entrance door with white aluminium frames", "50% 40%"),
  doorFloorSpring: photo(doorFloorSpring, "A Mayfair crew member setting a door floor spring into the floor beneath a glass door", "60% 40%"),
  pavingRelay: photo(pavingRelay, "A Mayfair crew member in a hi-vis vest re-laying paving bricks outside a shopping centre, with the work area taped off", "55% 50%"),
  atmOpening: photo(
    atmOpening,
    "Two Mayfair crew members in masks breaking an opening through a face-brick wall, the work area screened with green sheeting",
    "45% 40%",
  ),
  atmBreakthrough: photo(atmBreakthrough, "Two Mayfair crew members in hard hats breaking an opening through a plastered interior wall", "40% 45%"),
  acCassette: photo(acCassette, "A ceiling cassette air-conditioning unit hung in an open ceiling, with its pipework and cables running through the ceiling void", "30% 45%"),
  atmInstalled: photo(atmInstalled, "Two newly installed through-the-wall ATMs, still in protective wrap, with a caution sign in front", "50% 35%"),
  atmDelivery: photo(atmDelivery, "Two freestanding ATMs on pallets on the back of a bakkie outside a shopping centre", "50% 35%"),
  partitionBrick: photo(partitionBrick, "A new brick-walled room with a red door frame, built inside an open commercial floor", "50% 55%"),
  floorLevelling: photo(floorLevelling, "A corridor floor skimmed with grey levelling compound, with buckets and a trowel in the foreground", "50% 60%"),
  shopfront: photo(shopfront, "A new glass shopfront in white aluminium frames, with glass doors and blue frosted panels", "45% 50%"),
  pavingKerb: photo(pavingKerb, "Paving bricks re-laid along a kerb, with lifted kerb stones, a caution sign and a plate compactor beside the work", "55% 45%"),
  houseBlockwork: photo(houseBlockwork, "A single-storey house in blockwork, its walls up to roof height, on a sandy plot", "55% 50%"),
  houseRoofed: photo(houseRoofed, "A single-storey house with plastered walls, timber front doors and a metal sheet roof", "50% 50%"),
  pavingCompactor: photo(pavingCompactor, "A plate compactor on levelled sand beside stacks of lifted paving bricks", "45% 60%"),
  gaborone: {
    src: gaborone,
    alt: "High-rise towers on the Gaborone skyline, seen across open grassland",
    representative: true,
    credit: pexels("39179468", "modern-skyscraper-in-gaborone-landscape"),
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof registry;

/**
 * The registry without each import's blur placeholder (never used: large images
 * deliberately skip placeholder="blur"), so it doesn't ride along in every page payload.
 */
export const media = Object.fromEntries(
  Object.entries(registry).map(([key, m]) => [key, { ...m, src: { src: m.src.src, width: m.src.width, height: m.src.height } }]),
) as Record<MediaKey, Media>;

