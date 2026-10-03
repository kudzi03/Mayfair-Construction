import type { MediaKey } from "./media";

/**
 * Equipment-hire inventory.
 * Only the four categories Mayfair has confirmed are listed. Specs are left
 * empty until real fleet details are supplied — add them to `specs`
 * (e.g. `{ label: "Lift capacity", value: "2.5 t" }`) and they render automatically.
 */
export type Equipment = {
  /** Anchor on /equipment-hire (#forklift). */
  id: string;
  /** URL segment of the machine's own page: /equipment-hire/forklifts. */
  slug: string;
  name: string;
  singular: string;
  category: string;
  use: string;
  media: MediaKey;
  specs: { label: string; value: string }[];
  /**
   * Copy for a dedicated /equipment-hire/<slug> page. The page is published
   * only when this AND real specs exist — without them it would just repeat
   * the hire page. Fill in from Mayfair's actual fleet and terms, e.g.
   * `{ intro: "...", hireNotes: ["Minimum hire: 1 day", "Delivery within Gaborone"] }`.
   */
  page?: { intro: string; hireNotes: string[] };
};

export const equipment: Equipment[] = [
  {
    id: "forklift",
    slug: "forklifts",
    name: "Forklifts",
    singular: "Forklift",
    category: "Material handling",
    use: "Loading, unloading and moving palletised goods and building materials around a yard, warehouse or site.",
    media: "forklift",
    specs: [],
  },
  {
    id: "pallet-jack",
    slug: "pallet-jacks",
    name: "Pallet jacks",
    singular: "Pallet jack",
    category: "Material handling",
    use: "Moving pallets across warehouse floors, loading bays and truck beds where a forklift is too much machine.",
    media: "palletJack",
    specs: [],
  },
  {
    id: "concrete-mixer",
    slug: "concrete-mixers",
    name: "Concrete mixers",
    singular: "Concrete mixer",
    category: "Concrete & masonry",
    use: "Mixing concrete and mortar on site for slabs, footings, plaster and brickwork.",
    media: "concreteMixer",
    specs: [],
  },
  {
    id: "plate-compactor",
    slug: "plate-compactors",
    name: "Plate compactors",
    singular: "Plate compactor",
    category: "Groundworks",
    use: "Compacting soil, sand and gravel bases before paving, slabs and foundations go down.",
    media: "plateCompactor",
    specs: [],
  },
];

/** True once a machine has enough verified detail to justify its own page. */
export const hasOwnPage = (e: Equipment): e is Equipment & { page: NonNullable<Equipment["page"]> } =>
  Boolean(e.page) && e.specs.length > 0;

export const equipmentWithPages = () => equipment.filter(hasOwnPage);
export const equipmentBySlug = (slug: string) => equipment.find((e) => e.slug === slug);

/** The machine's own page when published, otherwise its section on the hire page. */
export const equipmentHref = (e: Equipment) => (hasOwnPage(e) ? `/equipment-hire/${e.slug}` : `/equipment-hire#${e.id}`);
