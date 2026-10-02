import type { ClientId } from "./clients";
import type { MediaKey } from "./media";
import type { ServiceSlug } from "./services";

/**
 * Project record.
 *
 * `status: "slot"` entries are layout placeholders that use representative
 * imagery and show no project facts. When Mayfair supplies a real project,
 * add an entry with `status: "published"` and fill every field — the UI drops
 * the placeholder treatment automatically.
 */
export type Project =
  | {
      status: "slot";
      id: string;
      service: ServiceSlug;
      media: MediaKey;
    }
  | {
      status: "published";
      id: string;
      title: string;
      service: ServiceSlug;
      location: string;
      clientType: ClientId;
      year: string;
      summary: string;
      media: MediaKey;
      gallery?: MediaKey[];
    };

export const projects: Project[] = [
  { status: "slot", id: "slot-01", service: "restoration", media: "projectFrame" },
  { status: "slot", id: "slot-02", service: "office-partitioning", media: "projectFacade" },
  { status: "slot", id: "slot-03", service: "atm-installation", media: "projectRebar" },
  { status: "slot", id: "slot-04", service: "ev-charging", media: "evChargerPost" },
  { status: "slot", id: "slot-05", service: "painting", media: "buildFinished" },
  { status: "slot", id: "slot-06", service: "electrical", media: "electricalPanel" },
];

/** The fields each published case study needs — shown on placeholder slots. */
export const projectFields = ["Project", "Location", "Client type", "Scope", "Completed"] as const;
