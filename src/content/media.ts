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
