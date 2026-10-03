import type { StaticImageData } from "next/image";

import atmInstallation from "@/assets/images/atm-installation.jpg";
import carpeting from "@/assets/images/carpeting.jpg";
import concreteMixer from "@/assets/images/concrete-mixer.jpg";
import electrical from "@/assets/images/electrical.jpg";
import electricalPanel from "@/assets/images/electrical-panel.jpg";
import evChargerPost from "@/assets/images/ev-charger-post.jpg";
import evCharging from "@/assets/images/ev-charging.jpg";
import forklift from "@/assets/images/forklift.jpg";
import gaborone from "@/assets/images/gaborone.jpg";
import officePartitioning from "@/assets/images/office-partitioning.jpg";
import painting from "@/assets/images/painting.jpg";
import palletJack from "@/assets/images/pallet-jack.jpg";
import partitionInstall from "@/assets/images/partition-install.jpg";
import plateCompactor from "@/assets/images/plate-compactor.jpg";
import projectFacade from "@/assets/images/project-facade.jpg";
import projectFoundation from "@/assets/images/project-foundation.jpg";
import projectFrame from "@/assets/images/project-frame.jpg";
import projectRebar from "@/assets/images/project-rebar.jpg";
import restoration from "@/assets/images/restoration.jpg";
import sequenceOpen from "@/assets/images/sequence-open.jpg";

export type Media = {
  src: StaticImageData;
  alt: string;
  /**
   * true = licensed stock used to show the layout. Never Mayfair's own work.
   * When Mayfair supplies photographs, replace the import and set this to false.
   */
  representative: boolean;
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

const registry = {
  sequenceOpen: {
    src: sequenceOpen,
    alt: "Illustration: a refurbished commercial building in Gaborone at dusk, lights on, with an ATM in the wall and an electric car charging",
    representative: true,
    credit: illustration,
  },
  restoration: {
    src: restoration,
    alt: "Scaffolding against a weathered wall with boarded openings during restoration work",
    representative: true,
    credit: pexels("19265075", "scaffolding-by-wall-of-building-under-construction"),
  },
  painting: {
    src: painting,
    alt: "Painter in a hard hat rolling fresh paint onto an interior wall",
    representative: true,
    credit: pexels("36153946", "construction-workers-painting-interior-walls"),
    focus: "35% 50%",
  },
  electrical: {
    src: electrical,
    alt: "Distribution board with rows of circuit breakers and colour-coded wiring",
    representative: true,
    credit: pexels("28950842", "electrical-circuit-breaker-panel-with-color-coded-wiring"),
  },
  electricalPanel: {
    src: electricalPanel,
    alt: "Electrician in a hard hat working on an open electrical panel",
    representative: true,
    credit: pexels("21812146", "electrician-in-helmet-working-with-cables"),
  },
  carpeting: {
    src: carpeting,
    alt: "Installer in work gloves measuring and cutting a roll of carpet",
    representative: true,
    credit: pexels("38510706", "worker-cutting-flooring-material-outdoors"),
  },
  officePartitioning: {
    src: officePartitioning,
    alt: "Glass-partitioned meeting room inside a modern office",
    representative: true,
    credit: pexels("33827315", "modern-conference-room-in-urban-office-setting"),
  },
  partitionInstall: {
    src: partitionInstall,
    alt: "Worker fixing boards to a new partition wall",
    representative: true,
    credit: pexels("5493673", "a-construction-worker-working-at-site"),
  },
  atmInstallation: {
    src: atmInstallation,
    alt: "Technician kneeling at an opened ATM unit during installation work",
    representative: true,
    credit: pexels("28374708", "a-man-is-kneeling-down-in-front-of-an-atm-machine"),
    focus: "50% 55%",
  },
  evCharging: {
    src: evCharging,
    alt: "Wall-mounted electric vehicle charger on a sandstone-coloured brick wall",
    representative: true,
    credit: pexels("5391509", "an-electric-car-charger-on-a-wall"),
    focus: "45% 50%",
  },
  evChargerPost: {
    src: evChargerPost,
    alt: "Free-standing EV charging post with a cable connected",
    representative: true,
    credit: pexels("32472665", "electric-vehicle-charging-station-outdoors"),
  },
  forklift: {
    src: forklift,
    alt: "Operator driving an orange forklift across an open yard",
    representative: true,
    credit: pexels("18812418", "forklift-driver-transporting-palletes"),
  },
  palletJack: {
    src: palletJack,
    alt: "Red hand pallet jack inside an empty truck trailer",
    representative: true,
    credit: pexels("34585139", "red-pallet-jack-in-empty-truck-trailer"),
  },
  concreteMixer: {
    src: concreteMixer,
    alt: "Orange drum concrete mixer beside a sand pile and new brickwork",
    representative: true,
    credit: pexels("2333694", "orange-cement-mixer"),
  },
  plateCompactor: {
    src: plateCompactor,
    alt: "Worker guiding a plate compactor over a levelled soil base",
    representative: true,
    credit: pexels("17315723", "legs-of-man-working-with-machine-on-soil-and-sand"),
    focus: "50% 45%",
  },
  gaborone: {
    src: gaborone,
    alt: "High-rise towers on the Gaborone skyline, seen across open grassland",
    representative: true,
    credit: pexels("39179468", "modern-skyscraper-in-gaborone-landscape"),
  },
  projectFrame: {
    src: projectFrame,
    alt: "Curved multi-storey concrete frame with a tower crane behind it",
    representative: true,
    credit: pexels("1463917", "unfinished-gray-concrete-building"),
  },
  projectFacade: {
    src: projectFacade,
    alt: "Steel and glass facade going up beside a finished building",
    representative: true,
    credit: pexels("38654069", "urban-architecture-building-construction-at-sunset"),
  },
  projectRebar: {
    src: projectRebar,
    alt: "Site worker in a hard hat standing among reinforcing steel",
    representative: true,
    credit: pexels("19982408", "worker-at-construction-site"),
  },
  projectFoundation: {
    src: projectFoundation,
    alt: "Worker walking through a trench between new block foundation walls",
    representative: true,
    credit: pexels("33595992", "construction-workers-laying-foundation-bricks-outdoors"),
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof registry;
export const media: Record<MediaKey, Media> = registry;
