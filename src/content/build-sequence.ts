import type { StaticImageData } from "next/image";

import plot from "@/assets/images/sequence/stage-00-plot.jpg";
import foundations from "@/assets/images/sequence/stage-01-foundations.jpg";
import slab from "@/assets/images/sequence/stage-02-slab.jpg";
import walls from "@/assets/images/sequence/stage-03-walls.jpg";
import roof from "@/assets/images/sequence/stage-04-roof.jpg";
import services from "@/assets/images/sequence/stage-05-services.jpg";
import finished from "@/assets/images/sequence/stage-06-finished.jpg";
import handover from "@/assets/images/sequence/stage-07-handover.jpg";

export type BuildStage = {
  id: string;
  title: string;
  text: string;
  src: StaticImageData;
};

/**
 * The home-page hero: one plot, one camera, eight stages. The frames are
 * AI-generated illustrations made for this demo from a single base image, so
 * the camera, hill and trees never move between stages. They are not a
 * Mayfair project and are labelled as such on the page.
 */
export const buildStages: BuildStage[] = [
  {
    id: "plot",
    title: "The plot",
    text: "Ground cleared and levelled. The building pegged out and checked before anything is dug.",
    src: plot,
  },
  {
    id: "foundations",
    title: "Foundations",
    text: "Trenches, steel and concrete. The compactor and the mixer are both on Mayfair’s hire list.",
    src: foundations,
  },
  {
    id: "slab",
    title: "Slab and blockwork",
    text: "Floor slab cast. Blockwork set out on the line, openings left where the drawings put them.",
    src: slab,
  },
  {
    id: "walls",
    title: "Walls up",
    text: "Ground floor complete, first-floor slab cast, walls rising to roof height.",
    src: walls,
  },
  {
    id: "roof",
    title: "Roof structure",
    text: "Trusses fixed and braced across the full span.",
    src: roof,
  },
  {
    id: "services",
    title: "Roof on, power in",
    text: "Sheeting on. Conduit and boards in before the walls are finished — electrical is one of Mayfair’s own trades.",
    src: services,
  },
  {
    id: "finishes",
    title: "Finishes",
    text: "Plaster, paint, floors, partitions and paving. A building ready to use.",
    src: finished,
  },
  {
    id: "handover",
    title: "Handover",
    text: "Lights on, EV charger tested, keys handed over.",
    src: handover,
  },
];

/** Alt text for the frame shown when the sequence does not animate. */
export const buildSequenceAlt =
  "Illustration of a finished two-storey building with a red face-brick wing on an open plot near Gaborone, with a rocky hill and acacia trees behind";

/** The frame shown when motion is reduced or JavaScript is off. */
export const buildStaticIndex = buildStages.findIndex((s) => s.id === "finishes");
