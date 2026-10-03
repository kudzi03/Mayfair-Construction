import type { MediaKey } from "./media";

/**
 * Equipment-hire inventory.
 * Only the four categories Mayfair has confirmed are listed. Specs are left
 * empty until real fleet details are supplied — add them to `specs`
 * (e.g. `{ label: "Lift capacity", value: "2.5 t" }`) and they render automatically.
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
    specs: [],
  },
  {
    id: "pallet-jack",
    name: "Pallet jacks",
    singular: "Pallet jack",
    category: "Material handling",
    use: "Moving pallets across warehouse floors, loading bays and truck beds where a forklift is too much machine.",
    media: "palletJack",
    specs: [],
  },
  {
    id: "concrete-mixer",
    name: "Concrete mixers",
    singular: "Concrete mixer",
    category: "Concrete & masonry",
    use: "Mixing concrete and mortar on site for slabs, footings, plaster and brickwork.",
    media: "concreteMixer",
    specs: [],
  },
  {
    id: "plate-compactor",
    name: "Plate compactors",
    singular: "Plate compactor",
    category: "Groundworks",
    use: "Compacting soil, sand and gravel bases before paving, slabs and foundations go down.",
    media: "plateCompactor",
    specs: [],
  },
];
