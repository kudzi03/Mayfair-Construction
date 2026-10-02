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
    line: "Repairs, repainting, electrical work, carpets and EV chargers for the house you live in or the one you’re fixing up.",
    services: ["restoration", "painting", "electrical", "carpeting", "ev-charging"],
  },
  {
    id: "property-managers",
    name: "Property managers",
    line: "Repaints, repairs and refits between tenants, across the buildings you look after.",
    services: ["restoration", "painting", "electrical", "carpeting", "office-partitioning"],
  },
  {
    id: "developers",
    name: "Developers",
    line: "Finishing trades, EV charging and equipment hire for new developments.",
    services: ["painting", "electrical", "carpeting", "ev-charging", "equipment-hire"],
  },
  {
    id: "businesses",
    name: "Businesses",
    line: "Office partitions, carpets, power and EV charging for staff and visitors — and equipment when the work is yours to do.",
    services: ["office-partitioning", "carpeting", "painting", "electrical", "ev-charging", "equipment-hire"],
  },
  {
    id: "banks",
    name: "Banks & financial institutions",
    line: "ATM installation, plus the electrical, painting and partitioning work around it.",
    services: ["atm-installation", "electrical", "painting", "office-partitioning"],
  },
];

export const clientById = (id: ClientId) => clientTypes.find((c) => c.id === id)!;
