import type { MediaKey } from "./media";

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
  trade: string;
  ownerCaption?: string;
  summary: string;
  shots: ProjectShot[];
  /** Short muted site clip in /public, with a poster from media. */
  video?: { mp4: string; webm: string; poster: MediaKey; caption: string };
};

export const projects: Project[] = [
  {
    id: "roof-waterproofing",
    title: "Flat-roof waterproofing",
    trade: "Waterproofing",
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
    id: "pigeon-lockers",
    title: "Pigeon-hole locker cabinet",
    trade: "Joinery",
    ownerCaption: "Before meets after Pigeon locker cabinet fabrication and installation",
    summary: "A worn bank of lockers replaced with a new pigeon-hole locker cabinet, fabricated and installed by Mayfair.",
    shots: [
      { media: "lockersBefore", caption: "Before" },
      { media: "lockersAfter", caption: "After" },
    ],
  },
  {
    id: "entrance-doors",
    title: "Glass entrance doors",
    trade: "Doors & hardware",
    ownerCaption: "New and old · Door floor springs installation",
    summary: "A double glass entrance door replaced, and door floor springs set into the floor.",
    shots: [
      { media: "doorNew", caption: "New door" },
      { media: "doorFloorSpring", caption: "Floor spring" },
    ],
  },
  {
    id: "station-mall-paving",
    title: "Paving repairs",
    trade: "Paving",
    ownerCaption: "Paving repairs by Station mall",
    summary: "Paving bricks lifted and re-laid outside a busy shopping centre, with the work area taped off while the crew worked.",
    shots: [
      { media: "pavingRelay", caption: "Re-laying" },
    ],
  },
];
