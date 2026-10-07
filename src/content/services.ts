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
    summary: "Restoration, waterproofing, painting, electrical, carpeting, office partitioning and paving.",
  },
  {
    id: "install",
    number: "02",
    name: "Install",
    title: "Specialist installations",
    summary: "ATM installation, EV charging, glass doors and floor springs, and joinery.",
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
  | "waterproofing"
  | "painting"
  | "electrical"
  | "carpeting"
  | "office-partitioning"
  | "paving"
  | "atm-installation"
  | "ev-charging"
  | "doors"
  | "joinery"
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
  /** Two of Mayfair's own photos for the service page hero (shown instead of a full-bleed image). */
  heroPair?: [MediaKey, MediaKey];
  related: ServiceSlug[];
  /**
   * Second line of the page's H1, under the service name. Says where (and,
   * where the trade name alone is ambiguous, what). Defaults to the coverage line.
   */
  heroTail?: string;
  /** `title` is the page part; " | Mayfair Construction" is appended by the layout template. */
  meta: { title: string; description: string };
};

export const services: Service[] = [
  {
    slug: "restoration",
    pillar: "build",
    name: "Restoration",
    summary: "Tired, damaged and neglected buildings brought back into use.",
    intro:
      "Restoration and renovation is the work between “this building has problems” and “this building is ready to use again”. Mayfair takes on restoration for homes, rental units, offices and commercial property in Gaborone and across Botswana — and because painting, electrical work and carpeting sit with the same contractor, one enquiry can cover the whole job.",
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
    related: ["waterproofing", "painting", "electrical"],
    heroTail: "and renovation, in Gaborone and across Botswana",
    meta: {
      title: "Renovation & Restoration in Gaborone",
      description:
        "Restoration and renovation for homes, rental units, offices and commercial property in Gaborone: repairs, refinishing, painting, electrical and flooring as one job.",
    },
  },
  {
    slug: "waterproofing",
    pillar: "build",
    name: "Waterproofing",
    summary: "Flat concrete roofs sealed with torch-on bitumen membrane.",
    intro:
      "A flat roof that holds water will eventually let it in. Mayfair waterproofs flat concrete roofs with torch-on bitumen membrane — dealing with the ponding, cracks and broken-up parapets first, so the membrane goes down on a sound, primed surface. For homes, offices and commercial buildings in Gaborone and across Botswana.",
    scope: [
      {
        title: "Ponding and cracks",
        text: "Low spots that hold water, cracked screed and render, and parapets that have started to break up.",
      },
      {
        title: "Screed and primer",
        text: "Low areas screeded and the slab primed, so the membrane bonds to a sound surface.",
      },
      {
        title: "Torch-on membrane",
        text: "Rolls of bitumen membrane torched down onto the roof, each one overlapping the last.",
      },
      {
        title: "Edges and parapets",
        text: "The membrane taken right to the roof’s edges and parapets, not just across the open area.",
      },
    ],
    clients: ["homeowners", "property-managers", "businesses", "developers"],
    quoteChecklist: [
      "Photos of the roof, including any standing water and cracks",
      "Rough roof area in m², or its length and width",
      "Whether water is getting inside, and where",
      "How the roof is reached — stairs, hatch or ladder",
      "The building’s town or area",
    ],
    media: "roofMembrane",
    heroPair: ["roofPonding", "roofMembrane"],
    related: ["restoration", "painting", "paving"],
    meta: {
      title: "Flat Roof Waterproofing in Gaborone",
      description:
        "Torch-on bitumen waterproofing for flat concrete roofs in Gaborone and across Botswana: ponding and cracks fixed, slab primed, membrane torched down to the parapets.",
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
      title: "Painting Contractor in Gaborone",
      description:
        "Interior and exterior painting for homes, offices, rental units and commercial buildings in Gaborone and across Botswana, surface preparation included.",
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
      title: "Electrical Services in Gaborone",
      description:
        "Electrical installation and repairs for homes and commercial property in Gaborone — new points and lighting, fault finding, and power for fit-outs, ATMs and EV chargers.",
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
      title: "Carpet Fitting in Gaborone",
      description:
        "Carpet fitting for offices, homes and commercial interiors in Gaborone and across Botswana — measured, laid and trimmed, and sequenced with painting and partitioning.",
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
      title: "Office Partitioning in Gaborone",
      description:
        "Office partitioning in Gaborone for companies, property managers and banks — partition walls, doors, power points, paint and carpet handled as one job. Send a floor plan.",
    },
  },
  {
    slug: "paving",
    pillar: "build",
    name: "Paving",
    summary: "Brick paving lifted, levelled, compacted and re-laid — walkways, steps and kerbs.",
    intro:
      "Sunken, broken and lifting paving is a trip hazard outside any building. Mayfair repairs brick paving for shopping centres, offices, property owners and homes in Gaborone and across Botswana — lifting the damaged area, re-levelling and compacting the bed, and laying the bricks back so the surface is even again.",
    scope: [
      {
        title: "Lift and re-lay",
        text: "Damaged and sunken areas lifted and the bricks re-laid, reusing sound bricks where they can be.",
      },
      {
        title: "Level and compact",
        text: "The sand bed re-levelled and compacted with a plate compactor before the bricks go back down.",
      },
      {
        title: "Steps and kerbs",
        text: "Paved steps, kerbs and edges put right along with the surface around them.",
      },
      {
        title: "Busy sites",
        text: "Work areas taped off, so shops, walkways and parking can keep running around the job.",
      },
    ],
    clients: ["property-managers", "businesses", "developers", "homeowners"],
    quoteChecklist: [
      "Photos of the damaged paving",
      "Rough area in m², or how many separate spots",
      "Whether steps or kerbs are involved",
      "Whether the area has to stay open to the public during the work",
      "The site’s town or area",
    ],
    media: "pavingRelay",
    heroPair: ["pavingRelay", "pavingCompactor"],
    related: ["equipment-hire", "restoration", "waterproofing"],
    meta: {
      title: "Paving Repairs in Gaborone",
      description:
        "Brick paving repairs for shopping centres, offices and homes in Gaborone — sunken and broken areas lifted, levelled, compacted and re-laid, including steps and kerbs.",
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
    media: "atmInstalled",
    heroPair: ["atmOpening", "atmInstalled"],
    related: ["electrical", "doors", "office-partitioning"],
    meta: {
      title: "ATM Installation for Banks in Botswana",
      description:
        "ATM installation for banks and financial institutions in Gaborone and across Botswana — site preparation, placement and fixing, power to the unit, and making good.",
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
      title: "EV Charger Installation in Botswana",
      description:
        "EV charger installation for homes, workplaces and property developments in Gaborone and across Botswana — position, mounting and the electrical connection on one job.",
    },
  },
  {
    slug: "doors",
    pillar: "install",
    name: "Doors & Floor Springs",
    summary: "Glass entrance doors replaced, and floor springs fitted so they swing and close under control.",
    intro:
      "An entrance door that drags, sticks or won’t close is the first thing every visitor notices. Mayfair replaces glass entrance doors and installs door floor springs for banks, shops, offices and other commercial buildings in Gaborone and across Botswana.",
    scope: [
      {
        title: "Entrance door replacement",
        text: "Worn or damaged double glass entrance doors taken out and replaced.",
      },
      {
        title: "Floor springs",
        text: "Floor springs set into the floor beneath the door, so it swings and closes under control.",
      },
      {
        title: "Frames and fittings",
        text: "Aluminium frames, handles and push plates fitted with the new doors.",
      },
      {
        title: "Part of a refit",
        text: "Door work coordinated with partitioning, painting and electrical work on the same job.",
      },
    ],
    clients: ["banks", "businesses", "property-managers", "developers"],
    quoteChecklist: [
      "Photos of the door from both sides, and of the floor beneath it",
      "The size of the opening — width and height",
      "Single or double door, glass or framed",
      "What is wrong now — dragging, not closing, broken glass, a failed spring",
      "The building’s town or area",
    ],
    media: "doorFloorSpring",
    heroPair: ["doorNew", "doorFloorSpring"],
    related: ["office-partitioning", "joinery", "atm-installation"],
    meta: {
      title: "Glass Doors & Floor Springs in Gaborone",
      description:
        "Glass entrance door replacement and door floor spring installation for banks, shops and offices in Gaborone and across Botswana. Send photos of the door for a quote.",
    },
  },
  {
    slug: "joinery",
    pillar: "install",
    name: "Joinery",
    summary: "Lockers, cabinets and storage units fabricated and installed.",
    intro:
      "Built-in storage takes a beating in offices, staff rooms and changing areas. Mayfair fabricates and installs lockers, cabinets and storage units for businesses, banks and commercial property in Gaborone and across Botswana — and takes the worn units out.",
    scope: [
      {
        title: "Fabrication",
        text: "Units built to suit the space and the number of compartments needed.",
      },
      {
        title: "Lockers and pigeon-holes",
        text: "Lockable pigeon-hole lockers for staff rooms, changing areas and offices.",
      },
      {
        title: "Cabinets and storage",
        text: "Cabinets and storage units for offices and commercial spaces.",
      },
      {
        title: "Out with the old",
        text: "Worn units removed and the new ones fitted and fixed in place.",
      },
    ],
    clients: ["businesses", "banks", "property-managers", "developers"],
    quoteChecklist: [
      "Photos and rough measurements of the space",
      "What the units are for — lockers, filing, general storage",
      "How many compartments or units you need",
      "Any finish or colour preference",
      "The building’s town or area",
    ],
    media: "lockersAfter",
    heroPair: ["lockersBefore", "lockersAfter"],
    related: ["office-partitioning", "carpeting", "doors"],
    meta: {
      title: "Lockers, Cabinets & Joinery in Gaborone",
      description:
        "Lockers, pigeon-hole cabinets and storage units fabricated and installed for offices, banks and commercial property in Gaborone and across Botswana. Old units removed.",
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
    media: "concreteMixer",
    heroPair: ["concreteMixer", "plateCompactor"],
    related: ["paving", "restoration", "electrical"],
    heroTail: "in Gaborone: forklifts, pallet jacks, mixers and compactors",
    meta: {
      title: "Forklift & Equipment Hire in Gaborone",
      description:
        "Hire forklifts, pallet jacks, concrete mixers and plate compactors from Mayfair Construction in Gaborone. Tell us the dates and the site and check availability online.",
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const servicesInPillar = (pillar: PillarId) => services.filter((s) => s.pillar === pillar);
export const pillarById = (id: PillarId) => pillars.find((p) => p.id === id)!;
export const servicePath = (slug: ServiceSlug) => `/${slug}`;
/** Service name for use mid-sentence: "office partitioning", but "ATM installation" and "EV charging systems". */
export const inSentence = (name: string) =>
  name
    .split(" ")
    .map((w) => (w.length > 1 && w === w.toUpperCase() ? w : w.toLowerCase()))
    .join(" ");
