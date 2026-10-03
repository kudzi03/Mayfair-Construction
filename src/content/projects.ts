import type { ClientId } from "./clients";
import type { MediaKey } from "./media";
import type { ServiceSlug } from "./services";

/**
 * Project record — empty until Mayfair supplies real, photographed projects.
 * The "Selected work" section and its nav link appear automatically once the
 * first entry is added. Never add a project that did not happen.
 */
export type Project = {
  id: string;
  title: string;
  service: ServiceSlug;
  location: string;
  clientType: ClientId;
  year: string;
  summary: string;
  /** Add the photo to src/assets/images and register it in media.ts with `representative: false`. */
  media: MediaKey;
};

export const projects: Project[] = [];
