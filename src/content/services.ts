import type { ClientId } from "./clients";
import type { MediaKey } from "./media";

export type PillarId = "build" | "install" | "equip";

export type Pillar = {
  id: PillarId;
  number: string;
  name: string;
  title: string;
  summary: string;
};

export const pillars: Pillar[] = [
  {
    id: "build",
    number: "01",
    name: "Build",
    title: "Construction & property works",
    summary: "Restoration, painting, electrical, carpeting and office partitioning.",
  },
  {
    id: "install",
    number: "02",
    name: "Install",
    title: "Specialist installations",
    summary: "ATM installation and EV charging systems.",
  },
  {
    id: "equip",
    number: "03",
    name: "Equip",
    title: "Equipment hire",
    summary: "Forklifts, pallet jacks, concrete mixers and plate compactors.",
  },
];

export type ServiceSlug =
  | "restoration"
  | "painting"
  | "electrical"
  | "carpeting"
  | "office-partitioning"
  | "atm-installation"
  | "ev-charging"
  | "equipment-hire";

export type Service = {
  slug: ServiceSlug;
  pillar: PillarId;
  name: string;
  /** Short line used in indexes and cards. */
  summary: string;
  /** Opening paragraph on the service page. */
  intro: string;
  /**
   * What the work typically covers. Written as a description of the trade,
   * not as claims about past jobs. Confirm with Mayfair before launch.
   */
  scope: { title: string; text: string }[];
  clients: ClientId[];
  /** What a customer should send for an accurate quote. */
  quoteChecklist: string[];
  media: MediaKey;
  related: ServiceSlug[];
  meta: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "restoration",
    pillar: "build",
    name: "Restoration",
    summary: "Tired, damaged and neglected buildings brought back into use.",
    intro:
      "Restoration is the work between “this building has problems” and “this building is ready to use again”. Mayfair takes on restoration for homes, rental units, offices and commercial property in Gaborone and across Botswana — and because painting, electrical work and carpeting sit with the same contractor, one enquiry can cover the whole job.",
    scope: [
      {
        title: "Cracks, damp and wear",
        text: "The problems that leave a building tired: cracked render, stained walls, worn finishes and fittings.",
      },
      {
        title: "Repair and make good",
        text: "Damaged surfaces, finishes and fittings repaired and brought back to a usable standard.",
      },
      {
        title: "Refinish under one contractor",
        text: "Repainting, new floor coverings and electrical work coordinated as part of the same job.",
      },
      {
        title: "Between tenants, before a sale",
        text: "Restoration timed for when a unit is empty, about to be let, or being prepared for sale.",
      },
    ],
    clients: ["homeowners", "property-managers", "developers", "businesses"],
    quoteChecklist: [
      "Photos of the areas that need work",
      "The property’s town or area",
      "Rough size — number of rooms, floors or m²",
      "Whether the property is occupied",
      "Any deadline: a new tenant, a sale, an opening date",
    ],
    media: "restoration",
    related: ["painting", "electrical", "carpeting"],
    meta: {
      title: "Building Restoration in Gaborone, Botswana",
      description:
        "Restoration of homes, rental units, offices and commercial property — repairs, refinishing, painting, electrical and flooring from one Gaborone-based contractor working across Botswana.",
    },
  },
  {
    slug: "painting",
    pillar: "build",
    name: "Painting",
    summary: "Interior and exterior painting for homes, offices and commercial buildings.",
    intro:
      "Paint is the fastest way to change how a building looks and how long its surfaces last. Mayfair paints interiors and exteriors for homeowners, property managers, developers and businesses in Gaborone and across Botswana.",
    scope: [
      {
        title: "Interiors",
        text: "Walls, ceilings and trim in homes, offices, shops and common areas.",
      },
      {
        title: "Exteriors",
        text: "External walls, boundary walls and building facades.",
      },
      {
        title: "Preparation",
        text: "Cleaning, filling and priming surfaces before paint goes on.",
      },
      {
        title: "Portfolio repaints",
        text: "Repainting units between tenants or across several properties for one owner or manager.",
      },
    ],
    clients: ["homeowners", "property-managers", "developers", "businesses", "banks"],
    quoteChecklist: [
      "Interior, exterior, or both",
      "Number of rooms or an approximate wall area",
      "Photos of the current surfaces — cracks, damp and peeling paint included",
      "Colour choices or a paint specification, if you have one",
      "Location, and anything about access: height, occupied rooms, working hours",
    ],
    media: "painting",
    related: ["restoration", "office-partitioning", "carpeting"],
    meta: {
      title: "Interior & Exterior Painting in Gaborone",
      description:
        "Interior and exterior painting for homes, offices and commercial buildings in Gaborone and across Botswana. Interiors, exteriors and repaints across several properties.",
    },
  },
  {
    slug: "electrical",
    pillar: "build",
    name: "Electrical",
    summary: "Electrical installation and repair for homes and commercial property.",
    intro:
      "Electrical work runs through almost every other job on this site — partitions need sockets, restorations need repairs, ATMs and EV chargers need power. Mayfair carries out electrical work for homes and commercial property in Gaborone and across Botswana.",
    scope: [
      {
        title: "New points and lighting",
        text: "Sockets, switches and light fittings added or moved to suit how a space is used.",
      },
      {
        title: "Faults and repairs",
        text: "Tracing and repairing electrical faults in homes and commercial buildings.",
      },
      {
        title: "Boards and circuits",
        text: "Work on distribution boards and circuits as part of upgrades and refits.",
      },
      {
        title: "Power for installations",
        text: "Supply for partitions, fit-outs, ATM installations and EV chargers.",
      },
    ],
    clients: ["homeowners", "property-managers", "developers", "businesses", "banks"],
    quoteChecklist: [
      "What you need installed, or what the fault is doing",
      "Property type: house, flat, office, shop, warehouse",
      "A photo of the distribution board and the area concerned",
      "The town or area",
      "How urgent it is",
    ],
    media: "electrical",
    related: ["ev-charging", "atm-installation", "office-partitioning"],
    meta: {
      title: "Electrical Installation & Repairs, Gaborone",
      description:
        "Electrical installation and repair for homes and commercial property in Gaborone and across Botswana — new points, lighting, fault finding, and power for fit-outs, ATMs and EV chargers.",
    },
  },
  {
    slug: "carpeting",
    pillar: "build",
    name: "Carpeting",
    summary: "Carpet fitting for offices, homes and commercial interiors.",
    intro:
      "Carpet is often the last trade into a building and the first thing people notice. Mayfair fits carpet for offices, homes and commercial interiors in Gaborone and across Botswana, and can sequence it with painting and partitioning on the same job.",
    scope: [
      {
        title: "Measure and plan",
        text: "Rooms measured and the layout planned before carpet is cut.",
      },
      {
        title: "Offices and commercial floors",
        text: "Carpet for open-plan floors, meeting rooms, corridors and reception areas.",
      },
      {
        title: "Homes",
        text: "Bedrooms, living areas and stairs.",
      },
      {
        title: "Edges and trims",
        text: "Thresholds, edges and transitions to other floor finishes.",
      },
    ],
    clients: ["homeowners", "property-managers", "developers", "businesses"],
    quoteChecklist: [
      "Room sizes or a floor plan",
      "What is on the floor now",
      "The type of carpet you want — or ask for a recommendation",
      "Whether furniture needs to be moved",
      "For businesses: when the space can be worked on",
    ],
    media: "carpeting",
    related: ["office-partitioning", "painting", "restoration"],
    meta: {
      title: "Carpet Fitting for Offices & Homes, Gaborone",
      description:
        "Carpet fitting for offices, homes and commercial interiors in Gaborone and across Botswana, sequenced with painting and partitioning when it’s part of a larger fit-out.",
    },
  },
  {
    slug: "office-partitioning",
    pillar: "build",
    name: "Office Partitioning",
    summary: "Partition walls that turn open floors into offices and meeting rooms.",
    intro:
      "Partitioning changes how a floor works without changing the building. Mayfair builds office partitions for companies, property managers and banks in Gaborone and across Botswana — with the painting, carpeting and electrical points that finish the room handled on the same job.",
    scope: [
      {
        title: "Layout",
        text: "Agree where walls, doors and rooms go before anything is built.",
      },
      {
        title: "Partition walls",
        text: "Partitions built to the layout to create offices, meeting rooms and work areas.",
      },
      {
        title: "Finished rooms",
        text: "Paint, carpet and power points so the room is ready to use, not just divided.",
      },
      {
        title: "Reconfiguration",
        text: "Changing an existing layout as teams grow, shrink or move.",
      },
    ],
    clients: ["businesses", "property-managers", "banks", "developers"],
    quoteChecklist: [
      "A floor plan or a sketch with measurements",
      "How many rooms you need and roughly what size",
      "The kind of partition you have in mind, if any",
      "Whether the landlord has approved the work",
      "Your move-in or completion date",
    ],
    media: "officePartitioning",
    related: ["carpeting", "electrical", "painting"],
    meta: {
      title: "Office Partitioning in Gaborone, Botswana",
      description:
        "Office partitioning for companies, property managers and banks in Gaborone and across Botswana — partition walls, finishes and power points on one job.",
    },
  },
  {
    slug: "atm-installation",
    pillar: "install",
    name: "ATM Installation",
    summary: "ATM installation for banks and financial institutions across Botswana.",
    intro:
      "An ATM installation is site work: the location prepared, the unit placed and secured, power brought to it, and the surroundings finished so the site looks right on day one. Mayfair installs ATMs for banks and financial institutions in Gaborone and elsewhere in Botswana.",
    scope: [
      {
        title: "Site preparation",
        text: "Preparing the wall, lobby or freestanding position to receive the unit.",
      },
      {
        title: "Placement and fixing",
        text: "Positioning and securing the ATM to the bank’s specification.",
      },
      {
        title: "Power",
        text: "Electrical supply to the unit, coordinated with the rest of the installation.",
      },
      {
        title: "Making good",
        text: "Surrounding walls, finishes and paintwork restored once the unit is in.",
      },
    ],
    clients: ["banks", "businesses", "property-managers"],
    quoteChecklist: [
      "Site address — or a list, if there are several sites",
      "Through-the-wall, lobby or freestanding",
      "The ATM make and model, or the bank’s installation specification",
      "What power is available at the location now",
      "Access hours and any security requirements",
    ],
    media: "atmInstallation",
    related: ["electrical", "office-partitioning", "painting"],
    meta: {
      title: "ATM Installation for Banks in Botswana",
      description:
        "ATM installation for banks and financial institutions in Gaborone and across Botswana — site preparation, placement, power and finishing.",
    },
  },
  {
    slug: "ev-charging",
    pillar: "install",
    name: "EV Charging Systems",
    summary: "EV charger installation for homes, businesses and developments.",
    intro:
      "Electric vehicles need somewhere to charge, and that means installing chargers at homes, workplaces and new developments. Mayfair installs EV charging systems in Gaborone and across Botswana, with the electrical connection as part of the same job.",
    scope: [
      {
        title: "Position and route",
        text: "Charger position and cable route planned around the parking bays and the existing supply.",
      },
      {
        title: "Mounting",
        text: "Wall-mounted or post-mounted chargers positioned for the parking bays they serve.",
      },
      {
        title: "Electrical connection",
        text: "Connection back to the distribution board.",
      },
      {
        title: "Homes to developments",
        text: "A single charger at home, or several bays at a workplace or new development.",
      },
    ],
    clients: ["homeowners", "businesses", "developers", "property-managers"],
    quoteChecklist: [
      "Property type: home, workplace, development, public parking",
      "Charger make and model, if you already have one",
      "Number of chargers",
      "Rough distance from the distribution board to the parking bay",
      "Photos of the distribution board and the parking area",
    ],
    media: "evCharging",
    related: ["electrical", "atm-installation", "equipment-hire"],
    meta: {
      title: "EV Charger Installation in Gaborone",
      description:
        "EV charging system installation for homes, businesses and property developments in Gaborone and across Botswana — charger mounting and electrical connection.",
    },
  },
  {
    slug: "equipment-hire",
    pillar: "equip",
    name: "Equipment Hire",
    summary: "Forklifts, pallet jacks, concrete mixers and plate compactors for hire.",
    intro:
      "Not every job needs a contractor. Sometimes it needs a machine. Mayfair hires out forklifts, pallet jacks, concrete mixers and plate compactors to businesses, developers and individuals.",
    scope: [
      {
        title: "Forklifts",
        text: "Loading, unloading and moving palletised goods and building materials.",
      },
      {
        title: "Pallet jacks",
        text: "Moving pallets across warehouse floors, loading bays and truck beds.",
      },
      {
        title: "Concrete mixers",
        text: "Mixing concrete and mortar on site for slabs, footings and brickwork.",
      },
      {
        title: "Plate compactors",
        text: "Compacting soil, sand and gravel before paving, slabs and foundations.",
      },
    ],
    clients: ["businesses", "developers", "homeowners", "property-managers"],
    quoteChecklist: [
      "Which equipment you need, and how many",
      "Start date and how long you need it",
      "Where it will be used",
      "What the job is — what you’re lifting, mixing or compacting",
    ],
    media: "equipmentSite",
    related: ["restoration", "ev-charging", "electrical"],
    meta: {
      title: "Forklift & Site Equipment Hire, Gaborone",
      description:
        "Hire forklifts, pallet jacks, concrete mixers and plate compactors from Mayfair Construction in Gaborone. Ask about availability and send a hire request online.",
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const servicesInPillar = (pillar: PillarId) => services.filter((s) => s.pillar === pillar);
export const pillarById = (id: PillarId) => pillars.find((p) => p.id === id)!;
export const servicePath = (slug: ServiceSlug) => `/${slug}`;
