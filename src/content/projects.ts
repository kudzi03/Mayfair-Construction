import type { MediaKey } from "./media";
import type { ServiceSlug } from "./services";

/**
 * Mayfair's own work, from photos and video the company supplied.
 * Only state what the photos show or what Mayfair wrote about them —
 * no invented clients, dates, sizes or outcomes. `ownerCaption` is
 * Mayfair's caption, word for word.
 */
export type ProjectShot = { media: MediaKey; caption: string };

export type Project = {
  id: string;
  title: string;
  /** The service page this work appears on. Omitted for work no service page covers yet (shown on the home page only). */
  service?: ServiceSlug;
  /** Short category label when there is no service, e.g. "Building". */
  label?: string;
  ownerCaption?: string;
  summary: string;
  shots: ProjectShot[];
  /** Short muted site clip in /public, with a poster from media. */
  video?: { mp4: string; webm: string; poster: MediaKey; caption: string };
};

export const projects: Project[] = [
  {
    id: "roof-waterproofing",
    service: "waterproofing",
    title: "Flat-roof waterproofing",
    summary:
      "Torch-on bitumen membrane on flat concrete roofs: dealing with ponding water and cracked parapets, screeding and priming the slab, then torching each roll down with overlapped joints.",
    video: { mp4: "/work/roof-torch.mp4", webm: "/work/roof-torch.webm", poster: "roofTorchPoster", caption: "Torching a membrane roll down — site video" },
    shots: [
      { media: "roofPonding", caption: "Ponding water" },
      { media: "roofParapet", caption: "Cracked parapet" },
      { media: "roofScreed", caption: "Screed" },
      { media: "roofPrimer", caption: "Primer" },
      { media: "roofMembrane", caption: "Membrane" },
      { media: "roofCrew", caption: "Next roll" },
    ],
  },
  {
    id: "atm-installation",
    service: "atm-installation",
    title: "ATM installation",
    summary:
      "Openings broken through walls for through-the-wall ATMs, with the work area screened off, the units set in and still in their wrap, and freestanding ATMs brought to site on a bakkie.",
    shots: [
      { media: "atmOpening", caption: "Opening the wall" },
      { media: "atmBreakthrough", caption: "Breaking through" },
      { media: "atmInstalled", caption: "Units in" },
      { media: "atmDelivery", caption: "Delivery" },
    ],
  },
  {
    id: "house-building",
    label: "Building",
    title: "House building",
    summary: "Single-storey houses, from blockwork walls at roof height to plastered walls, timber doors and a metal sheet roof.",
    shots: [
      { media: "houseBlockwork", caption: "Blockwork" },
      { media: "houseRoofed", caption: "Roofed" },
    ],
  },
  {
    id: "pigeon-lockers",
    service: "joinery",
    title: "Pigeon-hole locker cabinet",
    ownerCaption: "Before meets after Pigeon locker cabinet fabrication and installation",
    summary: "A worn bank of lockers replaced with a new pigeon-hole locker cabinet, fabricated and installed by Mayfair.",
    shots: [
      { media: "lockersBefore", caption: "Before" },
      { media: "lockersAfter", caption: "After" },
    ],
  },
  {
    id: "entrance-doors",
    service: "doors",
    title: "Glass entrance doors",
    ownerCaption: "New and old · Door floor springs installation",
    summary: "A double glass entrance door replaced, and door floor springs set into the floor.",
    shots: [
      { media: "doorNew", caption: "New door" },
      { media: "doorFloorSpring", caption: "Floor spring" },
    ],
  },
  {
    id: "shopfront",
    service: "doors",
    title: "Aluminium shopfront",
    summary: "A glass shopfront in white aluminium frames, with glass doors and frosted panels, fitted to a commercial unit.",
    shots: [{ media: "shopfront", caption: "Shopfront" }],
  },
  {
    id: "ac-cassette",
    service: "air-conditioning",
    title: "Ceiling cassette air conditioning",
    summary: "A ceiling cassette unit hung in an open ceiling during a commercial refit, its pipework and cables run through the ceiling void.",
    shots: [{ media: "acCassette", caption: "Cassette unit" }],
  },
  {
    id: "brick-partition",
    service: "office-partitioning",
    title: "Brick partition room",
    summary: "A new room built in brick inside an open commercial floor, its door frame set in and the ceiling services still exposed above.",
    shots: [{ media: "partitionBrick", caption: "Brick partition" }],
  },
  {
    id: "corridor-floor",
    service: "carpeting",
    title: "Corridor floor preparation",
    summary: "A corridor floor skimmed with levelling compound, so the new floor covering goes down flat.",
    shots: [{ media: "floorLevelling", caption: "Levelling" }],
  },
  {
    id: "station-mall-paving",
    service: "paving",
    title: "Paving repairs",
    ownerCaption: "Paving repairs by Station mall",
    summary: "Paving bricks lifted and re-laid outside a busy shopping centre, with the work area taped off while the crew worked.",
    shots: [
      { media: "pavingRelay", caption: "Re-laying" },
      { media: "pavingCompactor", caption: "Compacting" },
    ],
  },
  {
    id: "kerb-paving",
    service: "paving",
    title: "Kerb-line paving repair",
    summary: "Paving along a kerb line lifted and re-laid, with the kerb stones set aside, the plate compactor on site and the work area signed.",
    shots: [{ media: "pavingKerb", caption: "Re-laying" }],
  },
  {
    id: "hire-equipment",
    service: "equipment-hire",
    title: "Hire equipment",
    summary:
      "Two of the machines Mayfair hires out: a portable concrete mixer, here on the back of a bakkie, and a plate compactor with a Honda GX270 engine.",
    shots: [
      { media: "concreteMixer", caption: "Concrete mixer" },
      { media: "plateCompactor", caption: "Plate compactor" },
    ],
  },
];

export const projectsFor = (slug: ServiceSlug) => projects.filter((p) => p.service === slug);
