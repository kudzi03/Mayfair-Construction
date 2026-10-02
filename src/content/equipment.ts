import type { MediaKey } from "./media";

/**
 * Equipment-hire inventory.
 * Only the four categories Mayfair has confirmed are listed. Specs (capacity,
 * fuel, rates) are deliberately left as "on request" until the real fleet
 * details are supplied — add them to `specs` and they render automatically.
 */
export type Equipment = {
  id: string;
  name: string;
  singular: string;
  category: string;
  use: string;
  media: MediaKey;
  specs: { label: string; value: string }[];
};

export const equipment: Equipment[] = [
  {
    id: "forklift",
    name: "Forklifts",
    singular: "Forklift",
    category: "Material handling",
    use: "Loading, unloading and moving palletised goods and building materials around a yard, warehouse or site.",
    media: "forklift",
    specs: [
      { label: "Lift capacity", value: "On request" },
      { label: "Hire period", value: "On request" },
    ],
  },
  {
    id: "pallet-jack",
    name: "Pallet jacks",
    singular: "Pallet jack",
    category: "Material handling",
    use: "Moving pallets across warehouse floors, loading bays and truck beds where a forklift is too much machine.",
    media: "palletJack",
    specs: [
      { label: "Load rating", value: "On request" },
      { label: "Hire period", value: "On request" },
    ],
  },
  {
    id: "concrete-mixer",
    name: "Concrete mixers",
    singular: "Concrete mixer",
    category: "Concrete & masonry",
    use: "Mixing concrete and mortar on site for slabs, footings, plaster and brickwork.",
    media: "concreteMixer",
    specs: [
      { label: "Drum size", value: "On request" },
      { label: "Hire period", value: "On request" },
    ],
  },
  {
    id: "plate-compactor",
    name: "Plate compactors",
    singular: "Plate compactor",
    category: "Groundworks",
    use: "Compacting soil, sand and gravel bases before paving, slabs and foundations go down.",
    media: "plateCompactor",
    specs: [
      { label: "Plate size", value: "On request" },
      { label: "Hire period", value: "On request" },
    ],
  },
];
