import type { StaticImageData } from "next/image";

import atmInstallation from "@/assets/images/atm-installation.jpg";
import carpeting from "@/assets/images/carpeting.jpg";
import concreteMixer from "@/assets/images/concrete-mixer.jpg";
import electrical from "@/assets/images/electrical.jpg";
import equipmentSite from "@/assets/images/equipment-site.jpg";
import evCharging from "@/assets/images/ev-charging.jpg";
import forklift from "@/assets/images/forklift.jpg";
import gaborone from "@/assets/images/gaborone.jpg";
import officePartitioning from "@/assets/images/office-partitioning.jpg";
import painting from "@/assets/images/painting.jpg";
import palletJack from "@/assets/images/pallet-jack.jpg";
import plateCompactor from "@/assets/images/plate-compactor.jpg";
import restoration from "@/assets/images/restoration.jpg";
import sequenceOpen from "@/assets/images/sequence-open.jpg";
import doorFloorSpring from "@/assets/images/work/door-floor-spring.jpg";
import doorNew from "@/assets/images/work/door-new.jpg";
import lockersAfter from "@/assets/images/work/lockers-after.jpg";
import lockersBefore from "@/assets/images/work/lockers-before.jpg";
import pavingRelay from "@/assets/images/work/paving-relay.jpg";
import roofCrew from "@/assets/images/work/roof-crew.jpg";
import roofMembrane from "@/assets/images/work/roof-membrane.jpg";
import roofParapet from "@/assets/images/work/roof-parapet.jpg";
import roofPonding from "@/assets/images/work/roof-ponding.jpg";
import roofPrimer from "@/assets/images/work/roof-primer.jpg";
import roofScreed from "@/assets/images/work/roof-screed.jpg";
import roofTorchPoster from "@/assets/images/work/roof-torch-poster.jpg";

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

const pexels = (id: string, slug: string) => ({
  source: "Pexels (Pexels License)",
  url: `https://www.pexels.com/photo/${slug}-${id}/`,
});

const illustration = { source: "AI-generated illustration for this demo (VelaBuilt)" };

/** Mayfair's own site photos, supplied by the company. Faces of passers-by and number plates are blurred. */
const own = { source: "Mayfair Construction — site photo" };
const photo = (src: StaticImageData, alt: string, focus?: string): Media => ({ src, alt, representative: false, credit: own, focus });

const registry = {
  sequenceOpen: {
    src: sequenceOpen,
    alt: "Illustration: a refurbished commercial building at dusk, lights on, with an ATM in the wall and an electric car charging",
    representative: true,
    illustration: true,
    credit: illustration,
  },
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
  atmInstallation: {
    src: atmInstallation,
    alt: "Illustration: a technician checking a newly installed through-the-wall ATM on a rendered commercial building",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "56% 55%",
  },
  evCharging: {
    src: evCharging,
    alt: "Illustration: a white electric car charging from a post-mounted charger on a building forecourt",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "52% 60%",
  },
  equipmentSite: {
    src: equipmentSite,
    alt: "Illustration: a forklift, concrete mixer and scaffolding on site beside a building under restoration",
    representative: true,
    illustration: true,
    credit: illustration,
    focus: "40% 60%",
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
  concreteMixer: {
    src: concreteMixer,
    alt: "Illustration: an orange portable concrete mixer on a plain studio backdrop",
    representative: true,
    illustration: true,
    credit: illustration,
  },
  plateCompactor: {
    src: plateCompactor,
    alt: "Illustration: an orange walk-behind plate compactor on a plain studio backdrop",
    representative: true,
    illustration: true,
    credit: illustration,
  },
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
  pavingRelay: photo(pavingRelay, "A Mayfair crew member re-laying paving bricks outside a shopping centre, with the work area taped off", "78% 50%"),
  gaborone: {
    src: gaborone,
    alt: "High-rise towers on the Gaborone skyline, seen across open grassland",
    representative: true,
    credit: pexels("39179468", "modern-skyscraper-in-gaborone-landscape"),
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof registry;
export const media: Record<MediaKey, Media> = registry;

/** Label for any image that is not Mayfair's own work. */
export const mediaLabel = (m: Media) => (m.illustration ? "Illustration — not a Mayfair project" : "Representative image");
