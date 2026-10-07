import type { ServiceSlug } from "./services";

export type ClientId = "homeowners" | "property-managers" | "developers" | "businesses" | "banks";

export type ClientType = {
  id: ClientId;
  name: string;
  line: string;
  /** Services most relevant to this client type. */
  services: ServiceSlug[];
};

export const clientTypes: ClientType[] = [
  {
    id: "homeowners",
    name: "Homeowners",
    line: "Repairs, roof waterproofing, repainting, electrical work, paving and EV chargers for the house you live in or the one you’re fixing up.",
    services: ["restoration", "waterproofing", "painting", "electrical", "paving", "ev-charging"],
  },
  {
    id: "property-managers",
    name: "Property managers",
    line: "Repairs, roof waterproofing, repaints, paving and entrance doors — between tenants and across the buildings you look after.",
    services: ["restoration", "waterproofing", "painting", "paving", "doors", "office-partitioning"],
  },
  {
    id: "developers",
    name: "Developers",
    line: "Finishing trades, waterproofing, paving, EV charging and equipment hire for new developments.",
    services: ["painting", "electrical", "waterproofing", "paving", "ev-charging", "equipment-hire"],
  },
  {
    id: "businesses",
    name: "Businesses",
    line: "Office partitions, air conditioning, lockers and storage, entrance doors, carpets and power — and equipment when the work is yours to do.",
    services: ["office-partitioning", "air-conditioning", "joinery", "doors", "carpeting", "electrical", "equipment-hire"],
  },
  {
    id: "banks",
    name: "Banks & financial institutions",
    line: "ATM installation and entrance doors, plus the joinery, electrical, air conditioning and partitioning work around them.",
    services: ["atm-installation", "doors", "joinery", "electrical", "air-conditioning", "office-partitioning"],
  },
];

export const clientById = (id: ClientId) => clientTypes.find((c) => c.id === id)!;
